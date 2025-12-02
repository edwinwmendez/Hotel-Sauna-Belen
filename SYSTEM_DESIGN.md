# System Design
## Hotel Sauna Belén - Arquitectura y Diseño del Sistema

**Versión:** 1.0  
**Fecha:** Diciembre 2025  
**Autor:** Edwin Mendez - CTO  
**Stack:** Next.js 16 + React 19 + Supabase + Tailwind CSS v4

---

## 1. Visión General del Sistema

### 1.1 Propósito
Sistema web integral para la gestión de reservas, inventarios y operaciones del Hotel Sauna Belén, permitiendo reservas online 24/7 y administración eficiente de recursos.

### 1.2 Alcance
- **Frontend:** Aplicación web responsive (Next.js 16)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** Vercel (CDN + Edge Functions)
- **Módulos:** Reservas, Inventarios, Administración, Portal Cliente

### 1.3 Principios de Diseño
- **Simplicidad:** Arquitectura clara y mantenible
- **Escalabilidad:** Preparado para crecimiento futuro
- **Seguridad:** Autenticación robusta y RLS
- **Performance:** Optimización para velocidad
- **Mantenibilidad:** Código limpio y documentado

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Desktop    │  │    Mobile    │  │    Tablet    │          │
│  │  (Chrome,    │  │  (Safari,    │  │  (iPad,      │          │
│  │   Firefox)   │  │   Chrome)    │  │   Android)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (CDN + Edge)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Next.js 16 App Router                   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │   Pages     │ │   API       │ │   Server    │       │   │
│  │  │  (RSC)      │ │  Routes     │ │  Actions    │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Auth Proxy (proxy.ts)                    │   │   │
│  │  │         - Protección de rutas                    │   │   │
│  │  │         - Verificación de roles                  │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  PostgreSQL │ │    Auth     │ │   Storage   │               │
│  │  (Database) │ │  (Sessions) │ │  (Images)   │               │
│  │             │ │             │ │             │               │
│  │  - Rooms    │ │  - JWT      │ │  - Room     │               │
│  │  - Guests   │ │  - Sessions │ │    images   │               │
│  │  - Reserv.  │ │  - Roles    │ │  - Avatars  │               │
│  │  - Inventory│ │             │ │             │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Row Level Security (RLS)                        │   │
│  │         - Políticas por tabla                            │   │
│  │         - Verificación de roles                         │   │
│  │         - Aislamiento de datos                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         Database Functions                               │   │
│  │         - check_room_availability()                      │   │
│  │         - generate_booking_code()                        │   │
│  │         - update_product_stock()                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Capas del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Public     │  │   Client     │  │   Admin      │     │
│  │   Pages       │  │   Portal     │  │   Panel      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  Components: Header, Footer, Forms, Cards, Tables          │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Server     │  │   Client     │  │   Hooks      │     │
│  │   Actions    │  │   Queries    │  │   (Custom)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  - createReservation()  - useAuth()                         │
│  - updateReservation()  - useBooking()                      │
│  - createInventoryMovement() - useInventory()               │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Supabase   │  │   Validations│  │   Types      │     │
│  │   Client     │  │   (Zod)      │  │   (TS)       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  - createClient()  - BookingSchema                          │
│  - Queries         - InventorySchema                        │
│  - Mutations       - Type safety                            │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │   Storage    │  │   Auth       │     │
│  │  (Tables)    │  │   (Files)    │  │   (Users)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Componentes del Sistema

### 3.1 Módulos Principales

#### 3.1.1 Módulo Público
```
app/(public)/
├── page.tsx                    # Home page
├── habitaciones/
│   ├── page.tsx               # Lista de habitaciones
│   └── [slug]/
│       └── page.tsx           # Detalle de habitación
├── sauna/
│   └── page.tsx               # Página del sauna
├── contacto/
│   └── page.tsx               # Contacto
└── reservar/
    └── page.tsx               # Flujo de reserva
```

**Responsabilidades:**
- Mostrar información del hotel
- Permitir búsqueda de disponibilidad
- Procesar reservas sin autenticación
- SEO y metadata

#### 3.1.2 Módulo de Autenticación
```
app/(auth)/
├── login/
│   └── page.tsx               # Login cliente/admin
├── registro/
│   └── page.tsx               # Registro de cliente
└── recuperar/
    └── page.tsx               # Recuperar contraseña
```

**Responsabilidades:**
- Autenticación con Supabase Auth
- Gestión de sesiones
- Verificación de roles
- Recuperación de contraseña

#### 3.1.3 Módulo Cliente
```
app/(cliente)/
├── layout.tsx                 # Layout protegido
├── mis-reservas/
│   ├── page.tsx              # Lista de reservas
│   └── [id]/
│       └── page.tsx          # Detalle de reserva
└── perfil/
    └── page.tsx              # Perfil del cliente
```

**Responsabilidades:**
- Portal personalizado del cliente
- Visualización de reservas propias
- Gestión de perfil
- Solicitud de cancelaciones

#### 3.1.4 Módulo Administrativo
```
app/admin/
├── layout.tsx                 # Layout admin con sidebar
├── page.tsx                   # Dashboard
├── reservas/
│   ├── page.tsx              # Lista de reservas
│   └── [id]/
│       └── page.tsx          # Detalle/edición
├── calendario/
│   └── page.tsx              # Calendario de ocupación
├── habitaciones/
│   └── page.tsx              # Gestión de habitaciones
└── inventario/
    ├── page.tsx              # Dashboard inventario
    ├── productos/
    │   ├── page.tsx          # Lista productos
    │   ├── nuevo/
    │   │   └── page.tsx
    │   └── [id]/
    │       └── page.tsx
    ├── movimientos/
    │   ├── page.tsx          # Historial
    │   └── nuevo/
    │       └── page.tsx
    ├── categorias/
    │   └── page.tsx
    └── reportes/
        └── page.tsx
```

**Responsabilidades:**
- Gestión completa de reservas
- Control de inventarios
- Visualización de métricas
- Reportes y análisis

### 3.2 Componentes Reutilizables

```
components/
├── ui/                        # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── calendar.tsx
│   ├── dialog.tsx
│   ├── form.tsx
│   ├── input.tsx
│   └── select.tsx
│
├── layout/                    # Componentes de layout
│   ├── header.tsx
│   ├── footer.tsx
│   ├── mobile-nav.tsx
│   └── admin-sidebar.tsx
│
├── home/                      # Componentes del home
│   ├── hero.tsx
│   ├── room-preview.tsx
│   ├── sauna-section.tsx
│   └── testimonials.tsx
│
├── rooms/                     # Componentes de habitaciones
│   ├── room-card.tsx
│   ├── room-gallery.tsx
│   └── amenity-list.tsx
│
├── booking/                    # Componentes de reserva
│   ├── date-picker.tsx
│   ├── room-selector.tsx
│   ├── guest-form.tsx
│   ├── booking-summary.tsx
│   └── confirmation.tsx
│
├── admin/                      # Componentes admin
│   ├── stats-card.tsx
│   ├── reservations-table.tsx
│   ├── occupancy-calendar.tsx
│   └── reservation-detail.tsx
│
└── inventory/                  # Componentes inventario
    ├── product-card.tsx
    ├── stock-alert.tsx
    ├── movement-form.tsx
    ├── inventory-table.tsx
    └── stock-chart.tsx
```

---

## 4. Flujos de Datos

### 4.1 Flujo de Reserva (Cliente)

```
┌─────────┐
│ Cliente │
└────┬────┘
     │
     │ 1. Selecciona fechas
     ▼
┌─────────────────┐
│  Availability   │
│  Check (RSC)    │
└────┬────────────┘
     │
     │ 2. Query Supabase
     ▼
┌─────────────────┐
│  check_room_    │
│  availability() │
│  (DB Function)  │
└────┬────────────┘
     │
     │ 3. Retorna disponibles
     ▼
┌─────────────────┐
│  Room Selector  │
│  Component      │
└────┬────────────┘
     │
     │ 4. Selecciona habitación
     ▼
┌─────────────────┐
│  Guest Form     │
│  (React Hook    │
│   Form + Zod)   │
└────┬────────────┘
     │
     │ 5. Valida datos
     ▼
┌─────────────────┐
│  Booking Summary│
└────┬────────────┘
     │
     │ 6. Confirma reserva
     ▼
┌─────────────────┐
│  Server Action  │
│  createReserv.()│
└────┬────────────┘
     │
     │ 7. Transacción DB
     ▼
┌─────────────────┐
│  Supabase       │
│  - Insert guest │
│  - Insert reserv│
│  - Generate code│
└────┬────────────┘
     │
     │ 8. Retorna booking_code
     ▼
┌─────────────────┐
│  Confirmation   │
│  Page           │
└─────────────────┘
```

### 4.2 Flujo de Autenticación

```
┌─────────┐
│ Usuario │
└────┬────┘
     │
     │ 1. Ingresa credenciales
     ▼
┌─────────────────┐
│  Login Form     │
│  (Client)       │
└────┬────────────┘
     │
     │ 2. signInWithPassword()
     ▼
┌─────────────────┐
│  Supabase Auth  │
│  - Valida       │
│  - Genera JWT   │
│  - Set cookies  │
└────┬────────────┘
     │
     │ 3. Retorna user + role
     ▼
┌─────────────────┐
│  Auth Context   │
│  (useAuth)      │
└────┬────────────┘
     │
     │ 4. Verifica rol
     ▼
┌─────────────────┐
│  Redirect       │
│  - Admin → /admin│
│  - Client → /mis-│
│    reservas     │
└─────────────────┘
```

### 4.3 Flujo de Inventario (Movimiento)

```
┌─────────┐
│ Admin   │
└────┬────┘
     │
     │ 1. Registra movimiento
     ▼
┌─────────────────┐
│  Movement Form  │
│  - Tipo          │
│  - Producto      │
│  - Cantidad      │
│  - Razón         │
└────┬────────────┘
     │
     │ 2. Valida (Zod)
     ▼
┌─────────────────┐
│  Server Action  │
│  createMovement()│
└────┬────────────┘
     │
     │ 3. Insert movimiento
     ▼
┌─────────────────┐
│  Trigger DB     │
│  update_product_│
│  stock()         │
└────┬────────────┘
     │
     │ 4. Actualiza stock
     │    - Calcula nuevo
     │    - Valida negativo
     │    - Actualiza producto
     ▼
┌─────────────────┐
│  Response       │
│  - Success      │
│  - Stock actualizado│
│  - Alerta si bajo│
└─────────────────┘
```

---

## 5. Modelo de Datos

### 5.1 Entidades Principales

```
┌─────────────────┐
│     rooms       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ slug            │
│ type            │
│ price_per_night │
│ capacity        │
│ amenities (JSON)│
│ images (ARRAY)  │
│ is_active       │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│  reservations   │
├─────────────────┤
│ id (PK)         │
│ booking_code    │
│ room_id (FK)    │──┐
│ guest_id (FK)   │──┼──┐
│ check_in        │  │  │
│ check_out       │  │  │
│ total_price     │  │  │
│ status          │  │  │
└─────────────────┘  │  │
                      │  │
┌──────────────────────┘  │
│                         │
│  ┌──────────────────────┘
│  │
│  ▼
│ ┌─────────────────┐
│ │     guests       │
│ ├─────────────────┤
│ │ id (PK)          │
│ │ user_id (FK)     │──┐
│ │ full_name        │  │
│ │ email            │  │
│ │ phone            │  │
│ │ document_number  │  │
│ └─────────────────┘  │
│                       │
│                       │
│  ┌────────────────────┘
│  │
│  ▼
│ ┌─────────────────┐
│ │   auth.users    │
│ ├─────────────────┤
│ │ id (PK)         │
│ │ email           │
│ │ role (metadata) │
│ └─────────────────┘
```

### 5.2 Entidades de Inventario

```
┌──────────────────────┐
│ inventory_categories  │
├──────────────────────┤
│ id (PK)              │
│ name                 │
│ description          │
│ icon                 │
└──────────┬───────────┘
           │
           │ 1:N
           │
┌──────────▼───────────┐
│ inventory_products   │
├──────────────────────┤
│ id (PK)              │
│ category_id (FK)     │
│ name                 │
│ sku                  │
│ unit                 │
│ current_stock        │
│ min_stock            │
│ cost_per_unit        │
│ supplier             │
│ location             │
│ is_active            │
└──────────┬───────────┘
           │
           │ 1:N
           │
┌──────────▼───────────┐
│ inventory_movements  │
├──────────────────────┤
│ id (PK)              │
│ product_id (FK)      │
│ movement_type        │
│ quantity             │
│ previous_stock       │
│ new_stock            │
│ reason               │
│ room_id (FK)         │──┐
│ reservation_id (FK)  │──┼──┐
│ notes                │  │  │
│ created_by (FK)      │  │  │
│ created_at           │  │  │
└──────────────────────┘  │  │
                          │  │
┌──────────────────────────┘  │
│                             │
│  ┌──────────────────────────┘
│  │
│  ▼
│ ┌─────────────────┐
│ │     rooms       │
│ └─────────────────┘
│
│ ┌─────────────────┐
│ │  reservations   │
│ └─────────────────┘
```

### 5.3 Relaciones y Cardinalidad

| Relación | Tipo | Cardinalidad | Descripción |
|----------|------|--------------|-------------|
| rooms → reservations | 1:N | Una habitación tiene muchas reservas | Una habitación puede tener múltiples reservas en el tiempo |
| guests → reservations | 1:N | Un huésped tiene muchas reservas | Un cliente puede reservar múltiples veces |
| auth.users → guests | 1:1 | Un usuario tiene un perfil de huésped | Opcional, para clientes registrados |
| inventory_categories → inventory_products | 1:N | Una categoría tiene muchos productos | Organización de productos |
| inventory_products → inventory_movements | 1:N | Un producto tiene muchos movimientos | Historial de entradas/salidas |
| rooms → inventory_movements | 1:N | Una habitación puede tener muchos movimientos | Consumo por habitación |
| reservations → inventory_movements | 1:N | Una reserva puede tener muchos movimientos | Consumo durante estadía |

---

## 6. Patrones de Diseño

### 6.1 Patrones Aplicados

#### 6.1.1 Server Components (Next.js 16)
```typescript
// app/habitaciones/page.tsx
export default async function RoomsPage() {
  const rooms = await getRooms() // Server-side fetch
  
  return (
    <div>
      {rooms.map(room => <RoomCard key={room.id} room={room} />)}
    </div>
  )
}
```

**Ventajas:**
- Menor bundle size en cliente
- Mejor SEO (contenido en HTML inicial)
- Acceso directo a base de datos

#### 6.1.2 Server Actions
```typescript
// lib/actions/reservations.ts
'use server'

export async function createReservation(formData: FormData) {
  const supabase = await createClient()
  // Validación y lógica de negocio
  const result = await supabase.from('reservations').insert(...)
  revalidatePath('/admin/reservas')
  return result
}
```

**Ventajas:**
- No requiere API routes
- Type-safe
- Integración con formularios nativos

#### 6.1.3 Repository Pattern (Queries)
```typescript
// lib/queries/rooms.ts
export async function getRooms() {
  const supabase = await createClient()
  return supabase.from('rooms').select('*').eq('is_active', true)
}

export async function getRoomBySlug(slug: string) {
  const supabase = await createClient()
  return supabase.from('rooms').select('*').eq('slug', slug).single()
}
```

**Ventajas:**
- Centralización de queries
- Fácil testing
- Reutilización

#### 6.1.4 Custom Hooks
```typescript
// hooks/use-auth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Lógica de autenticación
  }, [])
  
  return { user, loading, signOut }
}
```

**Ventajas:**
- Lógica reutilizable
- Separación de concerns
- Testing simplificado

### 6.2 Validación con Zod

```typescript
// lib/validations/booking.ts
export const BookingSchema = z.object({
  roomId: z.string().uuid(),
  checkIn: z.string().date(),
  checkOut: z.string().date(),
  guest: z.object({
    fullName: z.string().min(2).max(200),
    email: z.string().email(),
    phone: z.string().regex(/^9\d{8}$/),
    documentType: z.enum(['DNI', 'CE', 'PASAPORTE']),
    documentNumber: z.string().min(8).max(20),
  }),
})

// Uso en Server Action
export async function createReservation(data: unknown) {
  const validated = BookingSchema.parse(data) // Type-safe
  // ...
}
```

---

## 7. Seguridad

### 7.1 Autenticación

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. Login credentials
       ▼
┌─────────────┐
│ Next.js App │
│ (Client)    │
└──────┬──────┘
       │
       │ 2. signInWithPassword()
       ▼
┌─────────────┐
│ Supabase    │
│ Auth        │
└──────┬──────┘
       │
       │ 3. Valida y genera JWT
       │    - Incluye role en claims
       │    - Set httpOnly cookies
       ▼
┌─────────────┐
│ Browser     │
│ (Cookies)   │
└──────┬──────┘
       │
       │ 4. Request con cookies
       ▼
┌─────────────┐
│ proxy.ts    │
│ - Verifica  │
│ - Extrae    │
│   role      │
└──────┬──────┘
       │
       │ 5. Permite/Deniega
       ▼
┌─────────────┐
│ Protected   │
│ Route       │
└─────────────┘
```

### 7.2 Row Level Security (RLS)

```sql
-- Ejemplo: Reservas
CREATE POLICY "Users can view own reservations"
  ON public.reservations FOR SELECT
  USING (
    guest_id IN (
      SELECT id FROM public.guests 
      WHERE user_id = auth.uid()
    )
    OR auth.jwt() ->> 'role' = 'admin'
  );
```

**Políticas implementadas:**
- **Rooms:** Lectura pública, escritura solo admin
- **Guests:** Usuario ve solo su perfil, admin ve todos
- **Reservations:** Usuario ve solo sus reservas, admin ve todas
- **Inventory:** Solo admin tiene acceso completo

### 7.3 Validación de Datos

**Cliente (Zod + React Hook Form):**
```typescript
const form = useForm({
  resolver: zodResolver(BookingSchema),
  // Validación en tiempo real
})
```

**Servidor (Zod en Server Actions):**
```typescript
export async function createReservation(data: unknown) {
  const validated = BookingSchema.parse(data) // Lanza error si inválido
  // ...
}
```

**Base de datos (Constraints):**
```sql
ALTER TABLE reservations
  ADD CONSTRAINT valid_dates 
  CHECK (check_out > check_in);
```

---

## 8. Performance

### 8.1 Optimizaciones Implementadas

#### 8.1.1 Next.js Optimizations
- **Server Components:** Menor JavaScript en cliente
- **Image Optimization:** `next/image` con lazy loading
- **Code Splitting:** Automático por ruta
- **Static Generation:** Páginas públicas pre-renderizadas
- **Turbopack:** Build más rápido (dev mode)

#### 8.1.2 Database Optimizations
```sql
-- Índices estratégicos
CREATE INDEX idx_reservations_dates 
  ON reservations(check_in, check_out);

CREATE INDEX idx_reservations_room 
  ON reservations(room_id);

CREATE INDEX idx_inventory_low_stock 
  ON inventory_products(current_stock, min_stock) 
  WHERE current_stock <= min_stock;
```

#### 8.1.3 Caching Strategy
```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Vercel CDN      │
│  (Static pages)  │
└──────┬───────────┘
       │
       │ Cache miss
       ▼
┌─────────────────┐
│  Next.js        │
│  (RSC Cache)    │
└──────┬───────────┘
       │
       │ Cache miss
       ▼
┌─────────────────┐
│  Supabase       │
│  (Query)        │
└─────────────────┘
```

**Estrategia:**
- **Static:** Páginas públicas (Home, Habitaciones) - ISR cada 1 hora
- **Dynamic:** Páginas admin/cliente - No cache, siempre fresh
- **API:** Server Actions - No cache, validación en tiempo real

### 8.2 Métricas Objetivo

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Time to First Byte (TTFB) | < 200ms | Vercel Analytics |
| First Contentful Paint (FCP) | < 1.8s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.8s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| API Response Time | < 500ms | Supabase Dashboard |

---

## 9. Escalabilidad

### 9.1 Escalabilidad Horizontal

```
┌─────────────────────────────────────────┐
│         Vercel Edge Network             │
│  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │ Edge │  │ Edge │  │ Edge │           │
│  │  US  │  │  EU  │  │  AS  │           │
│  └──────┘  └──────┘  └──────┘           │
└─────────────────────────────────────────┘
              │
              │ Load balanced
              ▼
┌─────────────────────────────────────────┐
│      Supabase (PostgreSQL)              │
│  ┌────────────┐  ┌────────────┐        │
│  │  Primary   │  │  Replicas   │        │
│  │  Database  │  │  (Read)     │        │
│  └────────────┘  └────────────┘        │
└─────────────────────────────────────────┘
```

**Ventajas:**
- Vercel escala automáticamente
- Supabase maneja réplicas de lectura
- CDN global para assets estáticos

### 9.2 Escalabilidad de Datos

**Estrategias futuras:**
- **Particionamiento:** Reservas por año (partitioning)
- **Archivado:** Reservas antiguas a storage frío
- **Caché Redis:** Para queries frecuentes (dashboard stats)
- **Read Replicas:** Para reportes pesados

### 9.3 Límites Actuales (Supabase Free Tier)

| Recurso | Límite | Estrategia |
|---------|--------|------------|
| Database Size | 500 MB | Optimizar imágenes (Storage) |
| Bandwidth | 5 GB/mes | CDN para assets |
| API Requests | 50k/mes | Caching agresivo |
| Auth Users | Ilimitado | OK |
| Storage | 1 GB | Comprimir imágenes |

**Plan de migración:**
- Monitorear uso mensual
- Upgrade a Pro cuando se acerque al límite
- Implementar optimizaciones antes de escalar

---

## 10. Integraciones

### 10.1 Integraciones Actuales

```
┌─────────────┐
│  Next.js    │
│  App        │
└──────┬──────┘
       │
       ├──► Supabase (Database + Auth)
       │
       ├──► Vercel (Hosting + CDN)
       │
       └──► [Futuro] Email Service (Resend)
```

### 10.2 Integraciones Futuras

| Integración | Propósito | Prioridad |
|-------------|-----------|-----------|
| Resend | Emails de confirmación | Media |
| Google Analytics | Analytics | Baja |
| WhatsApp Business API | Notificaciones | Baja |
| Payment Gateway | Pagos online | Alta (Post-MVP) |
| Booking.com API | Sincronización | Baja |

---

## 11. Monitoreo y Logging

### 11.1 Monitoreo Implementado

**Vercel Analytics:**
- Performance metrics
- Web Vitals
- Error tracking

**Supabase Dashboard:**
- Database performance
- Query analytics
- Auth logs

### 11.2 Logging Strategy

```typescript
// lib/utils/logger.ts
export function logError(error: Error, context: string) {
  console.error(`[${context}]`, error)
  // Futuro: Enviar a servicio de logging (Sentry)
}

// Uso
try {
  await createReservation(data)
} catch (error) {
  logError(error as Error, 'createReservation')
}
```

---

## 12. Testing Strategy

### 12.1 Niveles de Testing

```
┌─────────────────────────────────┐
│     E2E Tests (Playwright)      │
│  - Flujo completo de reserva    │
│  - Login/Logout                  │
│  - Admin operations              │
└─────────────────────────────────┘
              │
┌─────────────────────────────────┐
│  Integration Tests (Vitest)     │
│  - Server Actions                │
│  - Database functions            │
│  - API routes                    │
└─────────────────────────────────┘
              │
┌─────────────────────────────────┐
│  Unit Tests (Vitest)             │
│  - Utility functions             │
│  - Validations (Zod)             │
│  - Custom hooks                  │
└─────────────────────────────────┘
```

### 12.2 Cobertura Objetivo

- **Unit Tests:** 80%+ cobertura
- **Integration Tests:** Flujos críticos (reservas, auth)
- **E2E Tests:** Happy paths principales

---

## 13. Deployment

### 13.1 Pipeline de Deployment

```
┌─────────────┐
│  Git Push   │
│  (main)     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  GitHub     │
│  (Trigger)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Vercel     │
│  Build      │
│  - Install  │
│  - Build    │
│  - Test     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Preview    │
│  (Staging)  │
└──────┬──────┘
       │
       │ Manual approval
       ▼
┌─────────────┐
│  Production │
│  (Deploy)   │
└─────────────┘
```

### 13.2 Variables de Entorno

```env
# .env.local (Development)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Vercel (Production)
# Configuradas en Vercel Dashboard
```

---

## 14. Decisiones Arquitectónicas

### 14.1 ADR (Architecture Decision Records)

#### ADR-001: Next.js App Router vs Pages Router
**Decisión:** App Router (Next.js 16)  
**Razón:** Server Components, mejor performance, futuro de Next.js  
**Alternativas consideradas:** Pages Router (legacy)

#### ADR-002: Supabase vs Firebase
**Decisión:** Supabase  
**Razón:** PostgreSQL (SQL), mejor para queries complejas, RLS nativo  
**Alternativas consideradas:** Firebase (NoSQL, menos flexible)

#### ADR-003: Server Actions vs API Routes
**Decisión:** Server Actions (preferido) + API Routes (solo si necesario)  
**Razón:** Type-safe, menos código, mejor DX  
**Alternativas consideradas:** Solo API Routes (más verboso)

#### ADR-004: Tailwind CSS v4 vs CSS Modules
**Decisión:** Tailwind CSS v4  
**Razón:** Desarrollo rápido, consistencia, utility-first  
**Alternativas consideradas:** CSS Modules, Styled Components

#### ADR-005: Zod vs Yup
**Decisión:** Zod  
**Razón:** TypeScript-first, mejor integración con TypeScript  
**Alternativas consideradas:** Yup (más maduro pero menos type-safe)

---

## 15. Diagramas de Secuencia

### 15.1 Crear Reserva

```
Cliente          UI Component      Server Action      Supabase DB
  │                    │                  │                │
  │-- Selecciona ----->│                  │                │
  │    fechas           │                  │                │
  │                    │                  │                │
  │<-- Disponibles ----│                  │                │
  │                    │                  │                │
  │-- Selecciona ----->│                  │                │
  │    habitación       │                  │                │
  │                    │                  │                │
  │-- Completa ------->│                  │                │
  │    formulario       │                  │                │
  │                    │                  │                │
  │-- Confirma ------->│                  │                │
  │                    │-- createReserv() │                │
  │                    │----------------->│                │
  │                    │                  │-- Check avail. │
  │                    │                  │--------------->│
  │                    │                  │<-- Available --│
  │                    │                  │                │
  │                    │                  │-- Insert guest│
  │                    │                  │--------------->│
  │                    │                  │<-- Guest ID ---│
  │                    │                  │                │
  │                    │                  │-- Insert reserv│
  │                    │                  │--------------->│
  │                    │                  │<-- Booking code│
  │                    │<-- Success ------│                │
  │<-- Confirmation ---│                  │                │
  │    Page            │                  │                │
```

### 15.2 Autenticación

```
Usuario         Login Form      Supabase Auth      Browser      Protected Route
  │                  │                │              │                │
  │-- Credentials -->│                │              │                │
  │                  │-- signIn() -->│              │                │
  │                  │                │-- Validate  │                │
  │                  │                │   & Generate│                │
  │                  │                │   JWT        │                │
  │                  │                │              │                │
  │                  │                │-- Set cookie│                │
  │                  │                │------------>│                │
  │                  │<-- User + role │              │                │
  │<-- Success ------│                │              │                │
  │                  │                │              │                │
  │-- Navigate to -->│                │              │                │
  │    /admin        │                │              │                │
  │                  │                │              │-- Request ---->│
  │                  │                │              │                │
  │                  │                │              │                │-- Verify role
  │                  │                │              │                │-- Allow/Deny
  │                  │                │              │<-- Response ---│
  │<-- Dashboard ----│                │              │                │
```

---

## 16. Consideraciones de Seguridad

### 16.1 OWASP Top 10 Mitigations

| Riesgo | Mitigación |
|--------|-----------|
| **A01: Broken Access Control** | RLS policies, role verification en proxy.ts |
| **A02: Cryptographic Failures** | HTTPS obligatorio, cookies httpOnly |
| **A03: Injection** | Prepared statements (Supabase), Zod validation |
| **A04: Insecure Design** | Architecture reviews, threat modeling |
| **A05: Security Misconfiguration** | Environment variables, secure defaults |
| **A06: Vulnerable Components** | Dependabot, actualizaciones regulares |
| **A07: Authentication Failures** | Supabase Auth, rate limiting |
| **A08: Software and Data Integrity** | Package signing, CI/CD checks |
| **A09: Logging Failures** | Error logging, audit trails |
| **A10: SSRF** | Validación de URLs, whitelist |

### 16.2 Headers de Seguridad

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

---

## 17. Disaster Recovery

### 17.1 Backup Strategy

**Supabase:**
- Backups automáticos diarios
- Retención: 7 días
- Punto de recuperación: 24 horas

**Código:**
- Git repository (GitHub)
- Versionado completo
- Tags por release

### 17.2 Plan de Recuperación

1. **Database Corruption:**
   - Restaurar desde backup más reciente
   - Verificar integridad de datos
   - Notificar usuarios si es necesario

2. **Deployment Failure:**
   - Rollback automático en Vercel
   - Revisar logs
   - Hotfix y redeploy

3. **Security Breach:**
   - Rotar todas las API keys
   - Auditar logs de acceso
   - Notificar usuarios afectados

---

## 18. Roadmap Técnico

### 18.1 Fase 1: MVP (Actual)
- ✅ Arquitectura base
- ✅ Sistema de reservas
- ✅ Panel admin básico
- ✅ Módulo de inventarios
- ⏳ Testing básico
- ⏳ Deploy producción

### 18.2 Fase 2: Mejoras (Post-MVP)
- [ ] Pagos online (Stripe/Mercado Pago)
- [ ] Notificaciones email (Resend)
- [ ] Analytics avanzado
- [ ] Optimizaciones de performance
- [ ] Testing completo (E2E)

### 18.3 Fase 3: Escalabilidad
- [ ] Caché Redis
- [ ] Read replicas
- [ ] CDN para imágenes
- [ ] Monitoring avanzado (Sentry)
- [ ] CI/CD completo

---

## 19. Glosario Técnico

| Término | Definición |
|---------|------------|
| **RSC** | React Server Components - Componentes renderizados en servidor |
| **RLS** | Row Level Security - Seguridad a nivel de fila en PostgreSQL |
| **JWT** | JSON Web Token - Token de autenticación |
| **ISR** | Incremental Static Regeneration - Regeneración estática incremental |
| **CDN** | Content Delivery Network - Red de entrega de contenido |
| **DX** | Developer Experience - Experiencia del desarrollador |
| **TTFB** | Time to First Byte - Tiempo hasta primer byte |
| **LCP** | Largest Contentful Paint - Pintado del contenido más grande |

---

*System Design para Hotel Sauna Belén - Versión 1.0*

