# Propuesta de Implementación: Sistema de Registro de Clientes en Recepción
## Hotel Sauna Belén - Módulo de Check-in/Check-out y Gestión de Huéspedes

**Fecha:** Diciembre 2025  
**Autor:** Análisis Técnico  
**Versión:** 1.0

---

## 📋 Resumen Ejecutivo

Actualmente, el sistema tiene funcionalidades excelentes para reservas online y gestión de habitaciones, pero **falta un componente crítico**: el proceso operativo diario en recepción para registrar huéspedes cuando llegan al hotel.

**El problema:** El personal del hotel está usando cuadernos manuales para registrar clientes porque:
1. Clientes con reserva no se pueden registrar cuando llegan
2. Clientes sin reserva (walk-in) no tienen forma de ser registrados en el sistema
3. No hay forma rápida de buscar clientes habituales por DNI
4. El proceso de check-in/check-out no está integrado

**La solución:** Implementar un módulo completo de **Recepción** que permita:
- ✅ Registrar clientes al llegar (con o sin reserva)
- ✅ Buscar clientes habituales por DNI
- ✅ Realizar check-in y check-out
- ✅ Gestionar la ocupación en tiempo real
- ✅ Eliminar el uso de cuadernos manuales

---

## 🔍 Análisis del Estado Actual

### Lo que SÍ tenemos:
- ✅ Sistema de reservas online funcional
- ✅ Base de datos de `guests` (huéspedes) con todos los campos necesarios
- ✅ Tabla `reservations` con estados: `pending`, `confirmed`, `cancelled`, `completed`, `no_show`
- ✅ Panel administrativo básico
- ✅ Gestión de habitaciones

### Lo que NO tenemos (y es crítico):
- ❌ Módulo de recepción para check-in/check-out
- ❌ Búsqueda rápida de clientes por DNI
- ❌ Registro de walk-in guests (clientes sin reserva)
- ❌ Cambio de estado de reserva a "en curso" (checked-in)
- ❌ Control de ocupación en tiempo real
- ❌ Flujo completo de recepción

---

## 🏨 Flujo Estándar de un Hotel (Investigación)

### Proceso de Check-in Normal:

#### **1. Cliente con Reserva Previa:**
```
1. Cliente llega al hotel → Presenta documento de identidad
2. Recepcionista busca la reserva (por código, DNI o nombre)
3. Verifica datos del huésped
4. Asigna habitación (si no está asignada)
5. Procesa pago/depósito (si aplica)
6. Entrega llaves y explica servicios
7. Registra check-in (marca habitación como ocupada)
8. Actualiza estado de reserva a "checked-in" o "en curso"
```

#### **2. Cliente Sin Reserva (Walk-in):**
```
1. Cliente llega al hotel → Pregunta disponibilidad
2. Recepcionista verifica habitaciones disponibles
3. Cliente selecciona habitación y fechas
4. Recepcionista busca si el cliente ya existe (por DNI)
   - Si existe: autocompleta datos
   - Si no existe: registra nuevo cliente
5. Crea reserva inmediata
6. Procesa pago
7. Asigna habitación y entrega llaves
8. Registra check-in
```

#### **3. Cliente Habitual:**
```
1. Cliente llega → Dice "Soy cliente frecuente"
2. Recepcionista pide DNI
3. Sistema busca por DNI → Encuentra historial completo
4. Autocompleta: nombre, teléfono, email, preferencias
5. Solo confirma o actualiza datos si cambió algo
6. Proceso acelerado de check-in
```

### Proceso de Check-out:
```
1. Cliente anuncia salida
2. Recepcionista busca reserva activa
3. Verifica consumo adicional (minibar, servicios extra)
4. Calcula total final
5. Procesa pago (si hay pendiente)
6. Entrega factura/comprobante
7. Marca check-out → Libera habitación
8. Cambia estado de reserva a "completed"
```

---

## 💡 Propuesta de Solución

### Módulo 1: Base de Datos de Clientes (CRM Básico)

**Funcionalidad:**
- Búsqueda instantánea por DNI (campo único e indexado)
- Historial de estancias del cliente
- Preferencias guardadas (tipo de habitación favorita, etc.)
- Contador de visitas

**Beneficios:**
- ⚡ Check-in en 30 segundos para clientes habituales
- 📊 Datos centralizados y organizados
- 🎯 Personalización del servicio
- 🔒 Cumplimiento legal (registro de huéspedes obligatorio en Perú)

### Módulo 2: Registro de Walk-in Guests

**Flujo Propuesto:**
1. Botón "Nuevo Cliente" en recepción
2. Formulario rápido con campos esenciales
3. Búsqueda previa por DNI (evitar duplicados)
4. Si existe cliente: autocompleta, solo confirma
5. Si no existe: completa formulario
6. Selecciona habitación disponible
7. Crea reserva inmediata y realiza check-in

**Beneficios:**
- 🚀 Proceso rápido y profesional
- 📝 Elimina cuadernos manuales
- 💾 Todo queda registrado digitalmente
- 📈 Datos para análisis futuro

### Módulo 3: Check-in de Reservas Existentes

**Flujo Propuesto:**
1. Vista de "Check-ins de Hoy" en dashboard
2. Búsqueda rápida por:
   - Código de reserva (HSB-20251215-4521)
   - DNI del cliente
   - Nombre del cliente
3. Vista previa de reserva:
   - Datos del cliente
   - Habitación asignada
   - Fechas
   - Estado de pago
4. Botón "Realizar Check-in":
   - Confirma datos
   - Marca habitación como ocupada
   - Cambia estado de reserva a "checked-in"
   - Registra fecha/hora de check-in
5. Impresión de comprobante (opcional)

**Beneficios:**
- ✅ Reservas online ahora SÍ son funcionales
- ⏱️ Proceso en menos de 2 minutos
- 🎯 Control total de ocupación
- 📱 Puede hacerse desde tablet o celular en recepción

### Módulo 4: Check-out y Cierre de Estancia

**Flujo Propuesto:**
1. Vista de "Check-outs de Hoy" en dashboard
2. Búsqueda de reserva activa
3. Vista de detalles:
   - Días de estadía
   - Servicios adicionales consumidos
   - Total a pagar
4. Botón "Realizar Check-out":
   - Calcula total final
   - Marca habitación como disponible
   - Cambia estado a "completed"
   - Registra fecha/hora de salida
5. Genera comprobante/factura

**Beneficios:**
- 🏁 Cierre rápido de estancias
- 💰 Control de pagos
- 🧹 Liberación inmediata para limpieza
- 📊 Datos precisos para reportes

### Módulo 5: Vista de Ocupación en Tiempo Real

**Funcionalidad:**
- Dashboard visual mostrando:
  - Habitaciones ocupadas (verde/rojo)
  - Habitaciones disponibles (gris)
  - Check-ins/check-outs programados hoy
  - Estado de cada habitación

**Beneficios:**
- 👁️ Visión clara de la situación
- 🎯 Toma de decisiones rápida
- 📈 Optimización de ocupación

---

## 📊 Flujos Detallados Propuestos

### Flujo 1: Cliente con Reserva - Check-in

```
┌─────────────────────────────────────────────────────────┐
│  RECEPCIÓN: Check-in de Reserva Existente              │
└─────────────────────────────────────────────────────────┘

1. Cliente llega con código de reserva o DNI
   ↓
2. Recepcionista abre página "/admin/recepcion/check-in"
   ↓
3. Busca reserva por:
   - Código: HSB-20251215-4521
   - DNI: 12345678
   - Nombre: María García
   ↓
4. Sistema muestra:
   ┌─────────────────────────────────────┐
   │ Reserva #HSB-20251215-4521          │
   │ Cliente: María García López         │
   │ DNI: 12345678                       │
   │ Habitación: Suite King (201)        │
   │ Check-in: 15 Dic 2025               │
   │ Check-out: 17 Dic 2025              │
   │ Estado: Confirmada                  │
   │ Precio: S/ 500 (2 noches)           │
   └─────────────────────────────────────┘
   ↓
5. Recepcionista verifica identidad del cliente
   ↓
6. Si todo correcto → Click "Realizar Check-in"
   ↓
7. Sistema:
   - Marca habitación 201 como "ocupada"
   - Cambia estado de reserva a "checked-in"
   - Registra fecha/hora: 15 Dic 2025, 14:30
   - Genera código de acceso (opcional)
   ↓
8. Muestra confirmación:
   "✅ Check-in realizado exitosamente
    Habitación 201 asignada a María García
    Check-out programado: 17 Dic 2025"
   ↓
9. Recepcionista entrega llaves y explica servicios
```

### Flujo 2: Cliente Sin Reserva (Walk-in)

```
┌─────────────────────────────────────────────────────────┐
│  RECEPCIÓN: Registro de Cliente Walk-in                │
└─────────────────────────────────────────────────────────┘

1. Cliente llega sin reserva
   "¿Tienen habitación disponible?"
   ↓
2. Recepcionista abre "/admin/recepcion/walk-in"
   ↓
3. Primero verifica disponibilidad:
   - Selecciona fecha de entrada (hoy)
   - Selecciona fecha de salida
   - Sistema muestra habitaciones disponibles
   ↓
4. Cliente selecciona habitación
   ↓
5. Sistema pregunta: "¿El cliente ya está registrado?"
   ↓
6. Recepcionista ingresa DNI: 87654321
   ↓
7. Sistema busca en base de datos:
   
   CASO A: Cliente existe
   ┌─────────────────────────────────────┐
   │ ✅ Cliente encontrado               │
   │ Nombre: Carlos Rodríguez            │
   │ Teléfono: 912345678                 │
   │ Email: carlos@email.com             │
   │ Visitas anteriores: 3               │
   │ Última visita: 10 Nov 2025          │
   │                                     │
   │ [Confirmar datos] [Editar]          │
   └─────────────────────────────────────┘
   
   CASO B: Cliente NO existe
   ┌─────────────────────────────────────┐
   │ Nuevo Cliente                       │
   │ [Formulario completo]               │
   │ - Nombre completo                   │
   │ - DNI                               │
   │ - Teléfono                          │
   │ - Email (opcional)                  │
   └─────────────────────────────────────┘
   ↓
8. Sistema crea/actualiza cliente
   ↓
9. Crea reserva inmediata:
   - Habitación seleccionada
   - Fechas confirmadas
   - Estado: "confirmed"
   ↓
10. Realiza check-in automático:
    - Marca habitación como ocupada
    - Estado: "checked-in"
    ↓
11. Muestra resumen y genera código de reserva
```

### Flujo 3: Check-out

```
┌─────────────────────────────────────────────────────────┐
│  RECEPCIÓN: Check-out                                  │
└─────────────────────────────────────────────────────────┘

1. Cliente anuncia salida
   ↓
2. Recepcionista abre "/admin/recepcion/check-out"
   ↓
3. Busca reserva activa por:
   - Habitación (201)
   - DNI del cliente
   - Nombre
   ↓
4. Sistema muestra:
   ┌─────────────────────────────────────┐
   │ Check-out - Habitación 201          │
   │ Cliente: María García López         │
   │ Check-in: 15 Dic 2025, 14:30       │
   │ Check-out: 17 Dic 2025, 11:00      │
   │ Estadía: 2 noches                   │
   │                                     │
   │ Servicios adicionales:              │
   │ - Minibar: S/ 25                   │
   │                                     │
   │ Total: S/ 525                       │
   │ Pagado: S/ 500                      │
   │ Pendiente: S/ 25                    │
   └─────────────────────────────────────┘
   ↓
5. Si hay consumo adicional, lo registra
   ↓
6. Click "Realizar Check-out"
   ↓
7. Sistema:
   - Marca habitación como "disponible" (necesita limpieza)
   - Cambia estado de reserva a "completed"
   - Registra fecha/hora de salida
   - Genera comprobante
   ↓
8. Muestra confirmación:
   "✅ Check-out realizado
    Habitación 201 liberada
    Factura generada"
```

---

## 🎯 Beneficios para el Cliente

### Para el Hotel (Alessandra y equipo):

1. **Eliminación de Cuadernos Manuales:**
   - Todo digital y organizado
   - Búsqueda instantánea
   - Sin pérdida de información

2. **Proceso Más Rápido:**
   - Check-in de cliente habitual: 30 segundos
   - Check-in de walk-in: 2-3 minutos
   - Check-out: 1-2 minutos

3. **Control Total:**
   - Sabe exactamente qué habitaciones están ocupadas
   - Ve quién llega y quién sale hoy
   - No más confusión o errores

4. **Base de Datos de Clientes:**
   - Historial completo de cada cliente
   - Preferencias guardadas
   - Segmentación para marketing futuro

5. **Cumplimiento Legal:**
   - Registro obligatorio de huéspedes en Perú
   - Datos organizados para autoridades
   - Trazabilidad completa

6. **Reportes y Análisis:**
   - Ocupación real vs. reservas
   - Tasa de walk-ins
   - Clientes más frecuentes
   - Temporadas altas/bajas

### Para los Huéspedes:

1. **Check-in Rápido:**
   - Especialmente clientes habituales
   - No esperar tanto tiempo

2. **Experiencia Personalizada:**
   - El hotel "recuerda" sus preferencias
   - Servicio más eficiente

3. **Profesionalismo:**
   - Sistema moderno y confiable
   - Genera confianza

---

## 🛠️ Requerimientos Técnicos

### Cambios en Base de Datos:

#### 1. Nueva tabla: `check_ins` (opcional, para auditoría)
```sql
CREATE TABLE public.check_ins (
    id UUID PRIMARY KEY,
    reservation_id UUID REFERENCES reservations(id),
    checked_in_at TIMESTAMPTZ NOT NULL,
    checked_out_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES auth.users(id),
    notes TEXT
);
```

#### 2. Actualizar tabla `reservations`:
- Agregar campo `checked_in_at` (opcional)
- Agregar campo `checked_out_at` (opcional)
- Estado adicional: `checked-in` (opcional, o usar `confirmed`)

#### 3. Índice en `guests.document_number`:
```sql
CREATE UNIQUE INDEX idx_guests_document 
ON guests(document_type, document_number);
```
Esto permite búsqueda ultra-rápida por DNI.

### Nuevas Funcionalidades a Desarrollar:

1. **Página de Recepción Principal:**
   - `/admin/recepcion` - Dashboard de recepción
   - Vista rápida de check-ins/check-outs de hoy
   - Accesos rápidos a cada flujo

2. **Check-in de Reservas:**
   - `/admin/recepcion/check-in` - Buscar y realizar check-in
   - Búsqueda por código, DNI o nombre
   - Vista previa de reserva
   - Botón "Realizar Check-in"

3. **Registro Walk-in:**
   - `/admin/recepcion/walk-in` - Formulario completo
   - Verificación de disponibilidad
   - Búsqueda previa por DNI
   - Creación de reserva + check-in inmediato

4. **Check-out:**
   - `/admin/recepcion/check-out` - Buscar y realizar check-out
   - Cálculo de totales
   - Registro de servicios adicionales
   - Liberación de habitación

5. **Búsqueda de Clientes:**
   - Componente reutilizable de búsqueda por DNI
   - Autocompletado de datos
   - Historial de estancias

### Server Actions Necesarios:

1. `searchGuestByDocument(documentType, documentNumber)`
2. `performCheckIn(reservationId, checkedInAt)`
3. `performCheckOut(reservationId, checkedOutAt, additionalCharges)`
4. `createWalkInReservation(guestData, roomId, dates)`
5. `getTodayCheckIns()`
6. `getTodayCheckOuts()`
7. `getActiveReservations()`

---

## 📱 Interfaz de Usuario Propuesta

### Dashboard de Recepción:

```
┌─────────────────────────────────────────────────────────┐
│  🏨 RECEPCIÓN - Hotel Sauna Belén                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📊 Hoy, 15 de Diciembre 2025                          │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Check-ins    │  │ Check-outs   │  │ Ocupadas     │ │
│  │     5        │  │     3        │  │    12/15     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ────────────────────────────────────────────────────  │
│                                                          │
│  ⚡ ACCIONES RÁPIDAS                                    │
│                                                          │
│  [🔍 Check-in de Reserva]  [➕ Cliente Walk-in]       │
│  [🚪 Check-out]            [👥 Buscar Cliente]        │
│                                                          │
│  ────────────────────────────────────────────────────  │
│                                                          │
│  📅 CHECK-INS DE HOY (5)                                │
│                                                          │
│  • HSB-20251215-4521 | María García | Suite King       │
│    [Realizar Check-in]                                  │
│                                                          │
│  • HSB-20251215-3892 | Carlos Rodríguez | Matrimonial  │
│    [Realizar Check-in]                                  │
│                                                          │
│  ...                                                    │
│                                                          │
│  📅 CHECK-OUTS DE HOY (3)                               │
│                                                          │
│  • Hab. 201 | Ana Torres | Salida 11:00               │
│    [Realizar Check-out]                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Búsqueda de Cliente por DNI:

```
┌─────────────────────────────────────────────────────────┐
│  Buscar Cliente                                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Tipo de documento: [DNI ▼]                            │
│  Número: [87654321________]                             │
│                                                          │
│  [🔍 Buscar]                                            │
│                                                          │
│  ────────────────────────────────────────────────────  │
│                                                          │
│  ✅ Cliente Encontrado                                  │
│                                                          │
│  Nombre: Carlos Rodríguez Pérez                         │
│  DNI: 87654321                                          │
│  Teléfono: 912345678                                    │
│  Email: carlos@email.com                                │
│                                                          │
│  📊 Historial:                                          │
│  • 3 visitas anteriores                                 │
│  • Última visita: 10 Nov 2025                          │
│  • Habitación favorita: Suite King                     │
│                                                          │
│  [Usar este cliente]  [Ver historial completo]         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Plan de Implementación (Propuesta)

### Fase 1: Base de Datos y Búsqueda (Prioridad ALTA)
- ✅ Índice único en `guests.document_number`
- ✅ Función de búsqueda por DNI
- ✅ Componente de búsqueda reutilizable
- ⏱️ Tiempo estimado: 1 día

### Fase 2: Check-in de Reservas (Prioridad ALTA)
- ✅ Página de búsqueda de reservas
- ✅ Vista de detalle de reserva
- ✅ Acción de check-in
- ✅ Actualización de estado de habitación
- ⏱️ Tiempo estimado: 2 días

### Fase 3: Registro Walk-in (Prioridad ALTA)
- ✅ Formulario de nuevo cliente
- ✅ Verificación de disponibilidad
- ✅ Búsqueda previa por DNI
- ✅ Creación de reserva inmediata
- ⏱️ Tiempo estimado: 2 días

### Fase 4: Check-out (Prioridad MEDIA)
- ✅ Búsqueda de reservas activas
- ✅ Cálculo de totales
- ✅ Registro de servicios adicionales
- ✅ Liberación de habitación
- ⏱️ Tiempo estimado: 1-2 días

### Fase 5: Dashboard de Recepción (Prioridad MEDIA)
- ✅ Vista consolidada de hoy
- ✅ Accesos rápidos
- ✅ Lista de check-ins/check-outs programados
- ⏱️ Tiempo estimado: 1 día

**Tiempo Total Estimado:** 7-8 días de desarrollo

---

## ✅ Criterios de Éxito

El sistema será exitoso si:

1. ✅ El personal puede registrar un walk-in en menos de 3 minutos
2. ✅ El personal puede hacer check-in de una reserva en menos de 1 minuto
3. ✅ La búsqueda por DNI encuentra clientes en menos de 1 segundo
4. ✅ El hotel deja de usar cuadernos manuales completamente
5. ✅ El sistema muestra en tiempo real qué habitaciones están ocupadas
6. ✅ Todos los check-ins/check-outs quedan registrados digitalmente

---

## 🔄 Integración con Sistema Existente

### No rompe nada existente:
- ✅ Las reservas online siguen funcionando igual
- ✅ El panel administrativo actual sigue disponible
- ✅ Las habitaciones y precios no cambian
- ✅ Todo es aditivo, no reemplaza

### Mejora lo existente:
- ✅ Ahora las reservas online SÍ se pueden usar en recepción
- ✅ La base de datos de guests se aprovecha mejor
- ✅ El sistema es completo y funcional end-to-end

---

## 📝 Consideraciones Legales y de Seguridad

### Cumplimiento Legal en Perú:
- ✅ Registro obligatorio de huéspedes según normativa
- ✅ Conservación de datos por tiempo legal
- ✅ Protección de datos personales (Ley N° 29733)

### Seguridad:
- ✅ Acceso solo para personal autorizado (rol admin)
- ✅ Auditoría de quién realizó cada check-in/check-out
- ✅ Datos encriptados en la base de datos

---

## 💬 Próximos Pasos

1. **Revisar esta propuesta** con el cliente
2. **Validar flujos** según necesidades específicas
3. **Ajustar prioridades** si es necesario
4. **Comenzar implementación** por fases
5. **Capacitación** del personal en el nuevo módulo

---

## 📞 Preguntas para el Cliente

Para afinar la propuesta, sería útil conocer:

1. ¿Necesitan registrar servicios adicionales durante la estadía? (minibar, servicios extra)
2. ¿Requieren imprimir comprobantes/facturas?
3. ¿Hay un horario específico de check-in/check-out?
4. ¿Necesitan notificaciones automáticas?
5. ¿Prefieren una interfaz simple para tablets o también desktop?

---

**Esta propuesta está diseñada para hacer que la página web sea 100% funcional para las operaciones diarias del hotel, eliminando la dependencia de cuadernos manuales y optimizando el proceso de recepción.**

