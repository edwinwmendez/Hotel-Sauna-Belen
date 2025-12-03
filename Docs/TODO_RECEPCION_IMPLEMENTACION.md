# 📋 TODO Completo: Implementación Módulo de Recepción
## Hotel Sauna Belén - Guía de Desarrollo Detallada

**Fecha:** Diciembre 2025  
**Estado:** Pendiente de desarrollo  
**Prioridad:** ALTA

---

## 📊 Resumen General

Este documento contiene el TODO completo y detallado para implementar el **Módulo de Recepción** que permitirá al hotel registrar clientes, realizar check-in/check-out y eliminar el uso de cuadernos manuales.

**Total de tareas:** 45 tareas  
**Fases:** 5 fases principales + integración y testing

---

## 🎯 Fase 1: Base de Datos y Queries Fundamentales

### 📦 Tareas de Base de Datos

#### ✅ Tarea 1: Crear migración SQL para índices y campos
**Archivo:** `supabase/migrations/004_reception_module.sql`

**Descripción:** Crear migración SQL que incluya:
- Índice único en `guests(document_type, document_number)`
- Campos opcionales `checked_in_at` y `checked_out_at` en `reservations`
- Tabla opcional `check_ins` para auditoría completa

**SQL requerido:**
```sql
-- Índice único para búsqueda rápida por documento
CREATE UNIQUE INDEX IF NOT EXISTS idx_guests_document 
ON guests(document_type, document_number);

-- Agregar campos de check-in/check-out a reservations
ALTER TABLE reservations 
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS checked_out_at TIMESTAMPTZ;

-- Tabla opcional para auditoría completa
CREATE TABLE IF NOT EXISTS check_ins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checked_out_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_check_ins_reservation ON check_ins(reservation_id);
CREATE INDEX idx_check_ins_dates ON check_ins(checked_in_at, checked_out_at);
```

**Criterios de éxito:**
- [ ] Migración se ejecuta sin errores
- [ ] Índice permite búsqueda instantánea por DNI
- [ ] Campos nuevos son opcionales (no rompen datos existentes)

---

#### ✅ Tarea 2: Actualizar tipos TypeScript
**Archivo:** `web/lib/supabase/types.ts`

**Descripción:** Actualizar los tipos TypeScript generados para incluir los nuevos campos.

**Cambios requeridos:**
```typescript
// En reservations Row type:
checked_in_at: string | null
checked_out_at: string | null

// Nueva tabla check_ins (si se implementa):
check_ins: {
  Row: {
    id: string
    reservation_id: string
    checked_in_at: string
    checked_out_at: string | null
    checked_in_by: string | null
    notes: string | null
    created_at: string
  }
  // ... Insert, Update types
}
```

**Nota:** Si se usa Supabase CLI, regenerar tipos con: `npx supabase gen types typescript`

---

### 📚 Tareas de Queries

#### ✅ Tarea 3: Crear lib/queries/guests.ts
**Archivo:** `web/lib/queries/guests.ts` (NUEVO)

**Funciones requeridas:**

1. **searchGuestByDocument**
```typescript
export async function searchGuestByDocument(
  documentType: 'DNI' | 'CE' | 'PASAPORTE',
  documentNumber: string
): Promise<Guest | null>
```
- Busca cliente por tipo y número de documento
- Retorna null si no existe
- Usa el índice único para búsqueda rápida

2. **getGuestHistory**
```typescript
export async function getGuestHistory(
  guestId: string
): Promise<Array<{
  reservation: Reservation
  room: Room
  checkIn: string | null
  checkOut: string | null
}>>
```
- Obtiene historial completo de estancias del cliente
- Incluye habitaciones, fechas, estados

**Patrón a seguir:**
- Seguir estructura de `lib/queries/rooms.ts`
- Usar `createClient()` de `@/lib/supabase/server`
- Manejar errores graciosamente
- Retornar tipos tipados

---

#### ✅ Tarea 4: Crear queries de recepción
**Archivo:** `web/lib/queries/reception.ts` (NUEVO)

**Funciones requeridas:**

1. **getTodayCheckIns**
```typescript
export async function getTodayCheckIns(): Promise<ReservationWithDetails[]>
```
- Obtiene reservas con check-in programado para hoy
- Estado: `confirmed` o `pending`
- Ordenadas por hora de check-in

2. **getTodayCheckOuts**
```typescript
export async function getTodayCheckOuts(): Promise<ReservationWithDetails[]>
```
- Obtiene reservas con check-out programado para hoy
- Estado: `checked-in` o `confirmed`
- Ordenadas por hora de check-out

3. **getActiveReservations**
```typescript
export async function getActiveReservations(): Promise<ReservationWithDetails[]>
```
- Obtiene reservas actualmente en curso
- Estado: `checked-in`
- `checked_in_at` no null y `checked_out_at` null

**Tipos auxiliares:**
```typescript
type ReservationWithDetails = {
  reservation: Reservation
  guest: Guest
  room: Room
}
```

---

#### ✅ Tarea 5: Crear validaciones
**Archivo:** `web/lib/validations/reception.ts` (NUEVO)

**Schemas Zod requeridos:**

1. **GuestSearchSchema**
```typescript
export const GuestSearchSchema = z.object({
  documentType: z.enum(['DNI', 'CE', 'PASAPORTE']),
  documentNumber: z.string().min(8).max(20),
})
```

2. **CheckInSchema**
```typescript
export const CheckInSchema = z.object({
  reservationId: z.string().uuid(),
  notes: z.string().optional(),
})
```

3. **CheckOutSchema**
```typescript
export const CheckOutSchema = z.object({
  reservationId: z.string().uuid(),
  additionalCharges: z.number().min(0).default(0),
  notes: z.string().optional(),
})
```

4. **WalkInReservationSchema**
```typescript
// Combinar BookingSchema con validaciones adicionales
export const WalkInReservationSchema = BookingSchema.extend({
  performCheckIn: z.boolean().default(true), // Auto check-in
})
```

---

## 🔧 Fase 2: Server Actions y Check-in de Reservas

### ⚙️ Tareas de Server Actions

#### ✅ Tarea 6: Crear lib/actions/reception.ts
**Archivo:** `web/lib/actions/reception.ts` (NUEVO)

**Funciones requeridas (Server Actions):**

1. **performCheckIn**
```typescript
'use server'

export async function performCheckIn(
  reservationId: string,
  notes?: string
): Promise<{ success: boolean; error?: string }>
```
- Valida que la reserva existe y está en estado `confirmed`
- Valida que la habitación no esté ocupada
- Actualiza `reservations.checked_in_at = NOW()`
- Cambia estado a `checked-in` (o mantiene `confirmed` si no se agrega el estado)
- Crea registro en tabla `check_ins` (si existe)
- Marca habitación como ocupada (lógica de estado)
- `revalidatePath('/admin/recepcion')`

2. **performCheckOut**
```typescript
export async function performCheckOut(
  reservationId: string,
  additionalCharges?: number,
  notes?: string
): Promise<{ success: boolean; error?: string; total?: number }>
```
- Valida que la reserva está en estado `checked-in`
- Calcula total final (total_price + additionalCharges)
- Actualiza `reservations.checked_out_at = NOW()`
- Cambia estado a `completed`
- Actualiza registro en `check_ins` (si existe)
- Marca habitación como disponible (necesita limpieza)
- `revalidatePath('/admin/recepcion')`

3. **searchReservationByCode**
```typescript
export async function searchReservationByCode(
  bookingCode: string
): Promise<{ reservation: ReservationWithDetails | null; error?: string }>
```
- Busca reserva por `booking_code`
- Incluye datos de guest y room
- Retorna null si no existe

4. **searchReservationByDocument**
```typescript
export async function searchReservationByDocument(
  documentType: 'DNI' | 'CE' | 'PASAPORTE',
  documentNumber: string,
  onlyActive?: boolean
): Promise<{ reservations: ReservationWithDetails[]; error?: string }>
```
- Busca reservas del cliente por documento
- Filtra por estado activo si `onlyActive = true`
- Ordena por fecha más reciente

5. **createWalkInReservation**
```typescript
export async function createWalkInReservation(
  formData: FormData
): Promise<{ success: boolean; bookingCode?: string; error?: string }>
```
- Similar a `createReservation` pero:
  - Estado inicial: `confirmed`
  - Si `performCheckIn = true`, ejecuta check-in automático
  - Crea guest si no existe (búsqueda por DNI primero)

**Patrón a seguir:**
- Mirar `lib/actions/reservations.ts` como referencia
- Usar `'use server'` en todas las funciones
- Validar con Zod schemas
- Manejar errores y retornar objetos `{ success, error }`
- Usar `revalidatePath` después de mutaciones

---

### 🎨 Tareas de Componentes

#### ✅ Tarea 7: Componente de búsqueda de cliente
**Archivo:** `web/components/reception/guest-search.tsx` (NUEVO)

**Funcionalidad:**
- Input para tipo de documento (select: DNI, CE, PASAPORTE)
- Input para número de documento
- Botón de búsqueda
- Loading state durante búsqueda
- Mostrar resultado:
  - Si encuentra: datos del cliente + historial básico
  - Si no encuentra: mensaje "Cliente no encontrado"
- Botón "Usar este cliente" que pasa datos al componente padre

**Props:**
```typescript
interface GuestSearchProps {
  onGuestFound: (guest: Guest) => void
  defaultDocumentType?: 'DNI' | 'CE' | 'PASAPORTE'
}
```

**Diseño:**
- Seguir patrones de componentes existentes
- Usar shadcn/ui components (Input, Button, Card)
- Responsive para tablets/móviles
- Feedback visual claro

---

#### ✅ Tarea 8: Componente de búsqueda de reserva
**Archivo:** `web/components/reception/reservation-search.tsx` (NUEVO)

**Funcionalidad:**
- Tres métodos de búsqueda (tabs o radio buttons):
  - Por código de reserva
  - Por DNI del cliente
  - Por nombre del cliente
- Input dinámico según método seleccionado
- Búsqueda al escribir (debounce) o con botón
- Loading state
- Mostrar lista de resultados (máximo 10)
- Click en resultado para seleccionar

**Props:**
```typescript
interface ReservationSearchProps {
  onReservationSelect: (reservation: ReservationWithDetails) => void
  searchType?: 'code' | 'document' | 'name'
}
```

---

#### ✅ Tarea 9: Card de detalle de reserva
**Archivo:** `web/components/reception/reservation-detail-card.tsx` (NUEVO)

**Funcionalidad:**
- Muestra información completa de una reserva:
  - Código de reserva
  - Datos del cliente (nombre, DNI, teléfono)
  - Habitación (nombre, tipo)
  - Fechas (check-in, check-out)
  - Noches de estadía
  - Precio total
  - Estado actual
  - Desglose de huéspedes (adultos, jóvenes, niños, bebés)
- Botón de acción principal (ej: "Realizar Check-in")
- Botón secundario (ej: "Ver detalles completos")

**Props:**
```typescript
interface ReservationDetailCardProps {
  reservation: ReservationWithDetails
  onAction: () => void
  actionLabel: string
  actionVariant?: 'default' | 'destructive'
  showFullDetails?: boolean
}
```

**Diseño:**
- Card con información organizada
- Badge para estado
- Información destacada (precio, fechas)
- Responsive

---

### 📄 Tareas de Páginas

#### ✅ Tarea 10: Página de Check-in
**Archivo:** `web/app/admin/recepcion/check-in/page.tsx` (NUEVO)

**Estructura:**
1. Header: "Check-in de Reservas"
2. Componente de búsqueda de reserva
3. Si hay reserva seleccionada: mostrar card de detalle
4. Botón "Realizar Check-in" (deshabilitado si ya está checked-in)
5. Confirmación después del check-in

**Flujo:**
```
1. Usuario busca reserva
2. Selecciona reserva de los resultados
3. Ve detalle completo
4. Click "Realizar Check-in"
5. Confirmación → Redirigir a dashboard o mostrar mensaje
```

**Validaciones:**
- Reserva debe estar en estado `confirmed` o `pending`
- Habitación no debe estar ocupada
- Fecha de check-in debe ser hoy o anterior

**Estados:**
- Loading durante búsqueda
- Loading durante check-in
- Error si no se puede hacer check-in
- Éxito con mensaje de confirmación

---

## 🚶 Fase 3: Registro de Walk-in Guests

### 🎨 Tareas de Componentes

#### ✅ Tarea 11: Formulario de walk-in
**Archivo:** `web/components/reception/walk-in-form.tsx` (NUEVO)

**Funcionalidad:**
- Formulario multi-paso:
  - Paso 1: Búsqueda de cliente (usar componente GuestSearch)
  - Paso 2: Si cliente no existe → Formulario completo de datos
  - Paso 3: Selección de habitación disponible
  - Paso 4: Selección de fechas
  - Paso 5: Resumen y confirmación

**Estados:**
- Si cliente encontrado: autocompleta, permitir editar
- Si cliente no encontrado: formulario completo

**Props:**
```typescript
interface WalkInFormProps {
  onComplete: (data: WalkInReservationData) => void
  onCancel: () => void
}
```

---

#### ✅ Tarea 12: Selector de habitaciones para recepción
**Archivo:** `web/components/reception/room-selector-reception.tsx` (NUEVO)

**Funcionalidad:**
- Similar a selector de booking, pero:
  - Solo muestra habitaciones disponibles para las fechas
  - Indicador visual de disponibilidad
  - Precio por noche destacado
  - Información de capacidad

**Props:**
```typescript
interface RoomSelectorReceptionProps {
  checkIn: string
  checkOut: string
  guests?: GuestBreakdown
  onRoomSelect: (roomId: string) => void
  selectedRoomId?: string
}
```

---

### 📄 Tareas de Páginas

#### ✅ Tarea 13: Página de Walk-in
**Archivo:** `web/app/admin/recepcion/walk-in/page.tsx` (NUEVO)

**Estructura:**
1. Header: "Registro de Cliente Walk-in"
2. Wizard de pasos:
   - Paso 1: Verificar disponibilidad (fechas)
   - Paso 2: Buscar/Registrar cliente
   - Paso 3: Seleccionar habitación
   - Paso 4: Confirmar y crear reserva + check-in

**Flujo completo:**
```
1. Usuario selecciona fechas
2. Sistema muestra habitaciones disponibles
3. Usuario busca cliente por DNI
   - Si existe: autocompleta
   - Si no existe: formulario nuevo
4. Usuario selecciona habitación
5. Usuario confirma datos
6. Sistema crea reserva + check-in automático
7. Muestra código de reserva generado
```

**Validaciones:**
- Fechas válidas (check-in <= check-out)
- Al menos una habitación disponible
- Datos de cliente completos
- Habitación disponible en las fechas

---

## 🚪 Fase 4: Check-out

### 🎨 Tareas de Componentes

#### ✅ Tarea 14: Card de detalle para check-out
**Archivo:** `web/components/reception/checkout-detail-card.tsx` (NUEVO)

**Funcionalidad:**
- Muestra información de reserva activa:
  - Datos del cliente
  - Habitación
  - Fechas de estadía
  - Días de estadía calculados
  - Precio base de reserva
  - Campo para servicios adicionales (input numérico)
  - Total calculado (base + adicionales)
  - Monto pagado vs. pendiente
- Botón "Realizar Check-out"

**Props:**
```typescript
interface CheckoutDetailCardProps {
  reservation: ReservationWithDetails
  onCheckOut: (additionalCharges: number) => Promise<void>
}
```

**Características:**
- Input para servicios adicionales (minibar, etc.)
- Cálculo automático de total
- Resumen claro de pagos

---

### 📄 Tareas de Páginas

#### ✅ Tarea 15: Página de Check-out
**Archivo:** `web/app/admin/recepcion/check-out/page.tsx` (NUEVO)

**Estructura:**
1. Header: "Check-out"
2. Componente de búsqueda de reserva activa:
   - Por habitación
   - Por DNI
   - Por nombre
3. Si hay reserva seleccionada: mostrar card de detalle
4. Input para servicios adicionales
5. Resumen de total
6. Botón "Realizar Check-out"

**Validaciones:**
- Reserva debe estar en estado `checked-in`
- Fecha de check-out debe ser hoy o anterior
- Calcular estadía real vs. programada

---

## 📊 Fase 5: Dashboard de Recepción

### 📄 Tareas de Páginas

#### ✅ Tarea 16: Dashboard principal
**Archivo:** `web/app/admin/recepcion/page.tsx` (NUEVO)

**Estructura:**

1. **Header:**
   - Título: "Recepción"
   - Fecha actual destacada

2. **Cards de Estadísticas:**
   - Check-ins de hoy (número)
   - Check-outs de hoy (número)
   - Habitaciones ocupadas (X/Y)
   - Ocupación (%)
   - Reservas pendientes de confirmación

3. **Sección: Accesos Rápidos**
   - Botón grande: "Check-in de Reserva"
   - Botón grande: "Cliente Walk-in"
   - Botón grande: "Check-out"
   - Botón: "Buscar Cliente"

4. **Lista: Check-ins Programados para Hoy**
   - Tabla/cards con:
     - Código de reserva
     - Nombre del cliente
     - Habitación
     - Hora programada
     - Estado
     - Botón "Realizar Check-in" (si está confirmada)
   - Máximo 10, link "Ver todas"

5. **Lista: Check-outs Programados para Hoy**
   - Similar a check-ins
   - Botón "Realizar Check-out"

6. **Vista: Estado de Habitaciones**
   - Grid de habitaciones:
     - Nombre/número de habitación
     - Estado visual (ocupada/disponible/limpieza)
     - Cliente actual (si ocupada)
     - Check-out programado (si aplica)

**Datos:**
- Usar queries: `getTodayCheckIns()`, `getTodayCheckOuts()`, `getActiveReservations()`
- Refresh automático cada 30 segundos (opcional)
- Loading states

**Diseño:**
- Seguir patrón de `app/admin/page.tsx`
- Responsive para tablets
- Colores claros para estados (verde/rojo/gris)

---

### 🧭 Tareas de Navegación

#### ✅ Tarea 17: Actualizar sidebar admin
**Archivo:** `web/app/admin/layout.tsx`

**Cambios:**
- Agregar item de menú "Recepción" con subitems:
  - Dashboard
  - Check-in
  - Walk-in
  - Check-out

**Código a agregar:**
```typescript
{
  href: '/admin/recepcion',
  label: 'Recepción',
  icon: Users, // o icon apropiado
  subItems: [
    { href: '/admin/recepcion', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/recepcion/check-in', label: 'Check-in', icon: LogIn },
    { href: '/admin/recepcion/walk-in', label: 'Walk-in', icon: UserPlus },
    { href: '/admin/recepcion/check-out', label: 'Check-out', icon: LogOut },
  ]
}
```

---

#### ✅ Tarea 18: Agregar acceso rápido desde dashboard principal
**Archivo:** `web/app/admin/page.tsx`

**Cambios:**
- En sección "Accesos Rápidos", agregar botón:
  - "Recepción" → Link a `/admin/recepcion`
  - Icono apropiado (Users, Receipt, etc.)

---

## 🔗 Fase 6: Integración y Utilidades

### 🛠️ Tareas de Utilidades

#### ✅ Tarea 19: Utilidad de estado de habitaciones
**Archivo:** `web/lib/utils/room-status.ts` (NUEVO)

**Funciones:**

1. **getRoomStatus**
```typescript
export function getRoomStatus(
  room: Room,
  activeReservations: ReservationWithDetails[]
): 'available' | 'occupied' | 'cleaning' | 'maintenance'
```
- Determina estado actual de una habitación
- Considera reservas activas (checked-in)

2. **isRoomOccupied**
```typescript
export function isRoomOccupied(
  roomId: string,
  activeReservations: ReservationWithDetails[]
): boolean
```

3. **getOccupiedRoomInfo**
```typescript
export function getOccupiedRoomInfo(
  roomId: string,
  activeReservations: ReservationWithDetails[]
): { guest: Guest; checkoutDate: string } | null
```

---

#### ✅ Tarea 20: Actualizar queries de disponibilidad
**Archivo:** `web/lib/queries/rooms.ts`

**Cambios:**
- En `getAvailableRooms()`, considerar estado `checked-in`
- No mostrar habitaciones ocupadas (checked-in sin checked-out)
- Opcional: considerar tiempo de limpieza después de check-out

---

## ✅ Fase 7: Testing y Pulido

### 🧪 Tareas de Testing

#### ✅ Tarea 21-24: Testing de flujos

**21. Test Check-in de reserva:**
- [ ] Buscar reserva por código
- [ ] Buscar reserva por DNI
- [ ] Verificar que reserva se encuentra
- [ ] Realizar check-in
- [ ] Verificar que estado cambia
- [ ] Verificar que habitación se marca como ocupada
- [ ] Verificar error si reserva ya está checked-in

**22. Test Walk-in:**
- [ ] Buscar cliente existente por DNI
- [ ] Verificar autocompletado de datos
- [ ] Registrar cliente nuevo
- [ ] Seleccionar habitación disponible
- [ ] Crear reserva + check-in automático
- [ ] Verificar código de reserva generado

**23. Test Check-out:**
- [ ] Buscar reserva activa
- [ ] Agregar servicios adicionales
- [ ] Calcular total correctamente
- [ ] Realizar check-out
- [ ] Verificar que habitación se libera
- [ ] Verificar que estado cambia a `completed`

**24. Test Búsqueda por DNI:**
- [ ] Buscar cliente existente
- [ ] Verificar que datos se autocompletan
- [ ] Buscar cliente no existente
- [ ] Verificar mensaje apropiado

---

### 🎨 Tareas de Pulido

#### ✅ Tarea 25: Agregar notificaciones
**Archivo:** Varios componentes

**Cambios:**
- Usar `toast` de Sonner en todas las acciones:
  - ✅ Éxito: "Check-in realizado exitosamente"
  - ❌ Error: "Error al realizar check-in"
  - ⚠️ Advertencia: "Reserva ya está checked-in"
  - ℹ️ Info: "Buscando reserva..."

**Ejemplo:**
```typescript
import { toast } from 'sonner'

// En server action después de éxito:
toast.success('Check-in realizado exitosamente')

// En componente después de error:
toast.error(error.message)
```

---

## 📝 Notas de Implementación

### Patrones a Seguir

1. **Server Actions:**
   - Todas las mutaciones deben ser Server Actions
   - Usar `'use server'` al inicio del archivo
   - Validar con Zod antes de procesar
   - Retornar `{ success: boolean, error?: string }`
   - Usar `revalidatePath` después de mutaciones

2. **Componentes:**
   - Usar shadcn/ui components
   - Seguir estructura de componentes existentes
   - Responsive design (mobile-first)
   - Loading states en todas las acciones async

3. **Queries:**
   - Funciones async que retornan tipos tipados
   - Manejar errores graciosamente
   - Retornar null/array vacío en caso de error
   - No lanzar excepciones

4. **Estados de Reserva:**
   - `pending` → Reserva creada, esperando confirmación
   - `confirmed` → Reserva confirmada, puede hacer check-in
   - `checked-in` → Cliente en hotel (usar `checked_in_at`)
   - `completed` → Cliente salió (usar `checked_out_at`)
   - `cancelled` → Reserva cancelada
   - `no_show` → Cliente no se presentó

5. **Búsqueda por DNI:**
   - Usar índice único para búsqueda rápida
   - Considerar mayúsculas/minúsculas
   - Validar formato antes de buscar

6. **Diseño:**
   - Seguir colores del tema (navy, gold, cream)
   - Usar iconos de lucide-react
   - Mantener consistencia con resto del admin

---

## 🚀 Orden de Implementación Recomendado

1. **Semana 1:**
   - Fase 1 completa (Base de datos y queries)
   - Fase 2: Server Actions básicas
   - Fase 2: Componente de búsqueda de cliente

2. **Semana 2:**
   - Fase 2: Página de check-in completa
   - Fase 3: Formulario walk-in
   - Fase 3: Página walk-in completa

3. **Semana 3:**
   - Fase 4: Check-out completo
   - Fase 5: Dashboard de recepción
   - Integración con sidebar y navegación

4. **Semana 4:**
   - Testing completo
   - Pulido y mejoras
   - Documentación final

---

## ✅ Checklist Final

Antes de considerar completado el módulo:

- [ ] Todas las migraciones SQL ejecutadas
- [ ] Todos los tipos TypeScript actualizados
- [ ] Todas las queries implementadas y probadas
- [ ] Todas las server actions implementadas
- [ ] Todas las páginas creadas y funcionales
- [ ] Todos los componentes reutilizables creados
- [ ] Navegación actualizada en sidebar
- [ ] Testing de flujos completos realizado
- [ ] Notificaciones agregadas
- [ ] Responsive design verificado
- [ ] Código revisado y limpio
- [ ] Documentación actualizada

---

**Este TODO está completo y listo para empezar el desarrollo. Cada tarea es específica, accionable y sigue los patrones establecidos en el proyecto.**

