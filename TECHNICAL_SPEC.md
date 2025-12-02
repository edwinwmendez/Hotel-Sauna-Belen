# Especificación Técnica
## Hotel Sauna Belén - Arquitectura y Diseño Técnico

**Versión:** 1.0  
**Fecha:** Diciembre 2025  
**Stack:** Next.js 16 + Supabase + Tailwind CSS  

---

## 1. Resumen de Arquitectura

### 1.1 Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Frontend | Next.js 16 (App Router) | SSR, SEO, React Server Components |
| Styling | Tailwind CSS | Utility-first, responsive, rápido |
| UI Components | shadcn/ui | Componentes accesibles, personalizables |
| Base de Datos | Supabase (PostgreSQL) | Free tier, Auth incluido, Realtime |
| Autenticación | Supabase Auth | Email/password, manejo de sesiones |
| Storage | Supabase Storage | Imágenes de habitaciones |
| Hosting | Vercel | Integración nativa con Next.js, CDN |
| Email | Resend (o simulado) | Confirmaciones de reserva |

### 1.2 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Desktop    │  │    Mobile    │  │    Tablet    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (CDN + Edge)                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Next.js 16 App                        │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │   Pages     │ │   API       │ │   Server    │       │   │
│  │  │  (RSC)      │ │  Routes     │ │  Actions    │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  PostgreSQL │ │    Auth     │ │   Storage   │               │
│  │  (Database) │ │  (Sessions) │ │  (Images)   │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Estructura del Proyecto

```
hotel-sauna-belen/
├── app/                          # App Router (Next.js 16)
│   ├── (public)/                 # Rutas públicas (sin auth)
│   │   ├── page.tsx              # Home
│   │   ├── habitaciones/
│   │   │   ├── page.tsx          # Lista de habitaciones
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Detalle de habitación
│   │   ├── sauna/
│   │   │   └── page.tsx          # Página del sauna
│   │   ├── contacto/
│   │   │   └── page.tsx          # Contacto
│   │   └── reservar/
│   │       └── page.tsx          # Flujo de reserva
│   │
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/
│   │   │   └── page.tsx          # Login cliente/admin
│   │   ├── registro/
│   │   │   └── page.tsx          # Registro de cliente
│   │   └── recuperar/
│   │       └── page.tsx          # Recuperar contraseña
│   │
│   ├── (cliente)/                # Portal del cliente (protegido)
│   │   ├── layout.tsx            # Layout con verificación de auth
│   │   ├── mis-reservas/
│   │   │   ├── page.tsx          # Lista de reservas del cliente
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Detalle de reserva
│   │   └── perfil/
│   │       └── page.tsx          # Perfil del cliente
│   │
│   ├── admin/                    # Panel administrativo (protegido)
│   │   ├── layout.tsx            # Layout admin con sidebar
│   │   ├── page.tsx              # Dashboard
│   │   ├── reservas/
│   │   │   ├── page.tsx          # Lista de reservas
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Detalle/edición de reserva
│   │   ├── calendario/
│   │   │   └── page.tsx          # Calendario de ocupación
│   │   └── habitaciones/
│   │       └── page.tsx          # Gestión de habitaciones
│   │
│   ├── api/                      # API Routes
│   │   ├── reservas/
│   │   │   └── route.ts          # CRUD reservas
│   │   └── webhooks/
│   │       └── route.ts          # Webhooks externos
│   │
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Estilos globales
│   └── not-found.tsx             # Página 404
│
├── components/                   # Componentes React
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── calendar.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   │
│   ├── layout/                   # Componentes de layout
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav.tsx
│   │   └── admin-sidebar.tsx
│   │
│   ├── home/                     # Componentes del home
│   │   ├── hero.tsx
│   │   ├── room-preview.tsx
│   │   ├── sauna-section.tsx
│   │   └── testimonials.tsx
│   │
│   ├── rooms/                    # Componentes de habitaciones
│   │   ├── room-card.tsx
│   │   ├── room-gallery.tsx
│   │   └── amenity-list.tsx
│   │
│   ├── booking/                  # Componentes de reserva
│   │   ├── date-picker.tsx
│   │   ├── room-selector.tsx
│   │   ├── guest-form.tsx
│   │   ├── booking-summary.tsx
│   │   └── confirmation.tsx
│   │
│   └── admin/                    # Componentes admin
│       ├── stats-card.tsx
│       ├── reservations-table.tsx
│       ├── occupancy-calendar.tsx
│       └── reservation-detail.tsx
│
├── lib/                          # Utilidades y configuración
│   ├── supabase/
│   │   ├── client.ts             # Cliente browser
│   │   ├── server.ts             # Cliente server
│   │   └── middleware.ts         # Auth middleware
│   ├── utils.ts                  # Utilidades generales
│   ├── validations.ts            # Schemas Zod
│   └── constants.ts              # Constantes del proyecto
│
├── hooks/                        # Custom hooks
│   ├── use-auth.ts
│   ├── use-booking.ts
│   └── use-rooms.ts
│
├── types/                        # TypeScript types
│   ├── database.ts               # Types generados de Supabase
│   ├── booking.ts
│   └── index.ts
│
├── public/                       # Assets estáticos
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero.jpg
│   │   └── rooms/
│   └── favicon.ico
│
├── supabase/                     # Configuración Supabase
│   ├── migrations/               # Migraciones SQL
│   └── seed.sql                  # Datos iniciales
│
├── .env.local                    # Variables de entorno
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Modelo de Datos

### 3.1 Diagrama Entidad-Relación

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     rooms       │     │   reservations  │     │     guests      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ room_id (FK)    │     │ id (PK)         │
│ name            │     │ id (PK)         │>────│                 │
│ slug            │     │ guest_id (FK)   │     │ user_id (FK)    │
│ type            │     │ check_in        │     │ full_name       │
│ description     │     │ check_out       │     │ email           │
│ price_per_night │     │ total_price     │     │ phone           │
│ capacity        │     │ status          │     │ document_type   │
│ amenities       │     │ booking_code    │     │ document_number │
│ images          │     │ notes           │     │ created_at      │
│ is_active       │     │ created_at      │     └─────────────────┘
│ created_at      │     │ updated_at      │
└─────────────────┘     └─────────────────┘
                              │
                              │
                        ┌─────────────────┐
                        │  auth.users     │
                        ├─────────────────┤
                        │ id (PK)         │
                        │ email           │
                        │ role            │
                        │ ...             │
                        └─────────────────┘
```

### 3.2 Esquemas SQL (Supabase Migrations)

```sql
-- ============================================
-- TABLA: rooms (Habitaciones)
-- ============================================
CREATE TABLE public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('king', 'matrimonial', 'simple')),
    description TEXT,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 2,
    amenities JSONB DEFAULT '[]'::jsonb,
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: guests (Huéspedes)
-- ============================================
CREATE TABLE public.guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    document_type VARCHAR(20) DEFAULT 'DNI' CHECK (document_type IN ('DNI', 'CE', 'PASAPORTE')),
    document_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: reservations (Reservas)
-- ============================================
CREATE TABLE public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE RESTRICT NOT NULL,
    guest_id UUID REFERENCES public.guests(id) ON DELETE RESTRICT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INTEGER GENERATED ALWAYS AS (check_out - check_in) STORED,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_reservations_dates ON public.reservations(check_in, check_out);
CREATE INDEX idx_reservations_room ON public.reservations(room_id);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_reservations_booking_code ON public.reservations(booking_code);
CREATE INDEX idx_guests_email ON public.guests(email);
CREATE INDEX idx_guests_user ON public.guests(user_id);

-- ============================================
-- FUNCIONES
-- ============================================

-- Generar código de reserva único
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        new_code := 'HSB-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                    LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT EXISTS(SELECT 1 FROM public.reservations WHERE booking_code = new_code) 
        INTO code_exists;
        EXIT WHEN NOT code_exists;
    END LOOP;
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-generar booking_code
CREATE OR REPLACE FUNCTION set_booking_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_code IS NULL THEN
        NEW.booking_code := generate_booking_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_code
    BEFORE INSERT ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_code();

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rooms_updated_at
    BEFORE UPDATE ON public.rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_guests_updated_at
    BEFORE UPDATE ON public.guests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_reservations_updated_at
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- VERIFICAR DISPONIBILIDAD
-- ============================================
CREATE OR REPLACE FUNCTION check_room_availability(
    p_room_id UUID,
    p_check_in DATE,
    p_check_out DATE,
    p_exclude_reservation_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM public.reservations
        WHERE room_id = p_room_id
        AND status NOT IN ('cancelled')
        AND (p_exclude_reservation_id IS NULL OR id != p_exclude_reservation_id)
        AND (
            (check_in <= p_check_in AND check_out > p_check_in) OR
            (check_in < p_check_out AND check_out >= p_check_out) OR
            (check_in >= p_check_in AND check_out <= p_check_out)
        )
    );
END;
$$ LANGUAGE plpgsql;
```

### 3.3 Row Level Security (RLS)

```sql
-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Habilitar RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- ROOMS: Lectura pública, escritura solo admin
CREATE POLICY "Rooms are viewable by everyone"
    ON public.rooms FOR SELECT USING (is_active = true);

CREATE POLICY "Rooms are editable by admin"
    ON public.rooms FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- GUESTS: Solo el propio usuario o admin
CREATE POLICY "Users can view own guest profile"
    ON public.guests FOR SELECT
    USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can insert guest data"
    ON public.guests FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own guest profile"
    ON public.guests FOR UPDATE
    USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- RESERVATIONS: Usuarios ven las suyas, admin ve todas
CREATE POLICY "Users can view own reservations"
    ON public.reservations FOR SELECT
    USING (
        guest_id IN (SELECT id FROM public.guests WHERE user_id = auth.uid())
        OR auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Anyone can create reservations"
    ON public.reservations FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own reservations"
    ON public.reservations FOR UPDATE
    USING (
        guest_id IN (SELECT id FROM public.guests WHERE user_id = auth.uid())
        OR auth.jwt() ->> 'role' = 'admin'
    );

-- Admin full access bypass
CREATE POLICY "Admin full access rooms"
    ON public.rooms FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access guests"
    ON public.guests FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access reservations"
    ON public.reservations FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin');
```

### 3.4 Gestión de Roles

```sql
-- Agregar claim de rol al token JWT
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    claims jsonb;
    user_role text;
BEGIN
    -- Obtener el rol del usuario desde user_metadata
    SELECT raw_user_meta_data ->> 'role'
    INTO user_role
    FROM auth.users
    WHERE id = (event ->> 'user_id')::uuid;

    -- Establecer rol por defecto si no existe
    IF user_role IS NULL THEN
        user_role := 'customer';
    END IF;

    claims := event -> 'claims';
    claims := jsonb_set(claims, '{role}', to_jsonb(user_role));
    event := jsonb_set(event, '{claims}', claims);

    RETURN event;
END;
$$;
```

---

## 4. APIs y Endpoints

### 4.1 Server Actions (Recomendado en Next.js 16)

```typescript
// lib/actions/reservations.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const BookingSchema = z.object({
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

export async function createReservation(formData: FormData) {
  const supabase = await createClient()
  
  // Validar datos
  const validatedData = BookingSchema.parse({
    roomId: formData.get('roomId'),
    checkIn: formData.get('checkIn'),
    checkOut: formData.get('checkOut'),
    guest: {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      documentType: formData.get('documentType'),
      documentNumber: formData.get('documentNumber'),
    },
  })
  
  // Verificar disponibilidad
  const { data: isAvailable } = await supabase
    .rpc('check_room_availability', {
      p_room_id: validatedData.roomId,
      p_check_in: validatedData.checkIn,
      p_check_out: validatedData.checkOut,
    })
  
  if (!isAvailable) {
    return { error: 'La habitación no está disponible en esas fechas' }
  }
  
  // Crear o buscar guest
  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .upsert({
      ...validatedData.guest,
      full_name: validatedData.guest.fullName,
      document_type: validatedData.guest.documentType,
      document_number: validatedData.guest.documentNumber,
    }, { onConflict: 'email' })
    .select()
    .single()
  
  if (guestError) return { error: 'Error al registrar huésped' }
  
  // Calcular precio
  const { data: room } = await supabase
    .from('rooms')
    .select('price_per_night')
    .eq('id', validatedData.roomId)
    .single()
  
  const nights = Math.ceil(
    (new Date(validatedData.checkOut).getTime() - 
     new Date(validatedData.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalPrice = room.price_per_night * nights
  
  // Crear reserva
  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      room_id: validatedData.roomId,
      guest_id: guest.id,
      check_in: validatedData.checkIn,
      check_out: validatedData.checkOut,
      total_price: totalPrice,
    })
    .select()
    .single()
  
  if (error) return { error: 'Error al crear reserva' }
  
  revalidatePath('/admin/reservas')
  
  return { 
    success: true, 
    bookingCode: reservation.booking_code,
    reservationId: reservation.id 
  }
}
```

### 4.2 API Routes (Para integraciones externas)

```typescript
// app/api/reservations/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  
  let query = supabase
    .from('reservations')
    .select(`
      *,
      room:rooms(name, type, price_per_night),
      guest:guests(full_name, email, phone)
    `)
    .order('check_in', { ascending: true })
  
  if (status) query = query.eq('status', status)
  if (from) query = query.gte('check_in', from)
  if (to) query = query.lte('check_out', to)
  
  const { data, error } = await query
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
```

### 4.3 Endpoints Necesarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | /api/rooms | Listar habitaciones | No |
| GET | /api/rooms/[slug] | Detalle habitación | No |
| GET | /api/rooms/availability | Verificar disponibilidad | No |
| POST | /api/reservations | Crear reserva | No* |
| GET | /api/reservations | Listar reservas | Admin |
| GET | /api/reservations/[id] | Detalle reserva | Owner/Admin |
| PATCH | /api/reservations/[id] | Actualizar estado | Admin |
| GET | /api/admin/dashboard | Stats del dashboard | Admin |

*La reserva no requiere auth pero crea un guest vinculado

---

## 5. Autenticación y Autorización

### 5.1 Configuración Supabase Auth

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

### 5.2 Middleware de Protección

```typescript
// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Proteger rutas admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
    }
    
    const role = user.user_metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Proteger rutas de cliente
  if (request.nextUrl.pathname.startsWith('/mis-reservas')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/mis-reservas', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/mis-reservas/:path*'],
}
```

---

## 6. SEO y Performance

### 6.1 Metadata (Next.js 16)

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://hotelsaunabelen.com'),
  title: {
    default: 'Hotel Sauna Belén | Hotel con Sauna Privado en Moquegua',
    template: '%s | Hotel Sauna Belén',
  },
  description: 'Hotel 3 estrellas en Moquegua con sauna privado en cada habitación. Reserva online 24/7. WiFi, estacionamiento gratis y atención personalizada.',
  keywords: ['hotel moquegua', 'hotel con sauna', 'hospedaje moquegua', 'hotel sauna belen'],
  authors: [{ name: 'Hotel Sauna Belén' }],
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://hotelsaunabelen.com',
    siteName: 'Hotel Sauna Belén',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
  },
}

// app/habitaciones/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const room = await getRoom(params.slug)
  
  return {
    title: room.name,
    description: room.description,
    openGraph: {
      images: room.images,
    },
  }
}
```

### 6.2 Schema.org Markup

```typescript
// components/schema/hotel-schema.tsx
export function HotelSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: 'Hotel Sauna Belén',
    description: 'Hotel 3 estrellas con sauna privado en cada habitación',
    image: 'https://hotelsaunabelen.com/images/hotel-exterior.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Huánuco 120',
      addressLocality: 'Moquegua',
      addressRegion: 'Moquegua',
      addressCountry: 'PE',
    },
    telephone: '+51943924822',
    email: 'reservas@hotelsaunabelen.com',
    starRating: {
      '@type': 'Rating',
      ratingValue: '3',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'WiFi gratuito' },
      { '@type': 'LocationFeatureSpecification', name: 'Estacionamiento' },
      { '@type': 'LocationFeatureSpecification', name: 'Sauna privado' },
      { '@type': 'LocationFeatureSpecification', name: 'TV Smart' },
    ],
    priceRange: 'S/120 - S/250',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

---

## 7. Deployment

### 7.1 Variables de Entorno

```env
# .env.local (No commitear)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Opcional para MVP)
RESEND_API_KEY=re_xxxxx

# Analytics (Opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 7.2 Configuración Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["gru1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### 7.3 Checklist de Deployment

- [ ] Crear proyecto en Supabase
- [ ] Ejecutar migraciones SQL
- [ ] Insertar datos seed (habitaciones, admin)
- [ ] Configurar Auth providers en Supabase
- [ ] Crear proyecto en Vercel
- [ ] Conectar repositorio GitHub
- [ ] Configurar variables de entorno
- [ ] Configurar dominio personalizado (opcional)
- [ ] Verificar SSL activo
- [ ] Probar flujo completo en producción

---

## 8. Datos Seed

```sql
-- supabase/seed.sql

-- Habitaciones
INSERT INTO public.rooms (name, slug, type, description, price_per_night, capacity, amenities, images) VALUES
(
  'Suite King con Sauna',
  'suite-king-sauna',
  'king',
  'Nuestra habitación más espaciosa con cama King Size, sauna privado de madera, y todas las comodidades para una estadía inolvidable.',
  250.00,
  2,
  '["Sauna privado", "Cama King Size", "TV Smart 55\"", "WiFi", "Minibar", "Caja fuerte", "Aire acondicionado"]',
  ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800']
),
(
  'Habitación Matrimonial con Sauna',
  'habitacion-matrimonial-sauna',
  'matrimonial',
  'Perfecta para parejas. Habitación acogedora con cama matrimonial, sauna privado y ambiente romántico.',
  180.00,
  2,
  '["Sauna privado", "Cama matrimonial", "TV Smart 43\"", "WiFi", "Aire acondicionado"]',
  ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800']
),
(
  'Habitación Simple con Sauna',
  'habitacion-simple-sauna',
  'simple',
  'Ideal para viajeros solos. Compacta pero confortable, con todas las amenidades esenciales incluyendo tu sauna privado.',
  120.00,
  1,
  '["Sauna privado", "Cama 1.5 plazas", "TV Smart 32\"", "WiFi"]',
  ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800']
);

-- Usuario Admin
-- Nota: Crear desde Supabase Dashboard o con signup + actualizar metadata
-- UPDATE auth.users SET raw_user_meta_data = '{"role": "admin"}' WHERE email = 'admin@hotelsaunabelen.com';

-- Reservas de ejemplo
INSERT INTO public.guests (full_name, email, phone, document_type, document_number) VALUES
('María García López', 'maria.garcia@email.com', '987654321', 'DNI', '12345678'),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '912345678', 'DNI', '87654321'),
('Ana Torres', 'ana.torres@email.com', '998877665', 'DNI', '11223344');

-- Las reservas se crearán con los IDs generados
-- Ejemplo de reserva futura
INSERT INTO public.reservations (room_id, guest_id, check_in, check_out, total_price, status)
SELECT 
  r.id,
  g.id,
  CURRENT_DATE + 7,
  CURRENT_DATE + 9,
  r.price_per_night * 2,
  'confirmed'
FROM public.rooms r, public.guests g
WHERE r.slug = 'suite-king-sauna' AND g.email = 'maria.garcia@email.com';
```

---

## 9. Dependencias del Proyecto

```json
{
  "dependencies": {
    "next": "16.x.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@supabase/ssr": "^0.5.x",
    "@supabase/supabase-js": "^2.x",
    "tailwindcss": "^3.4.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x",
    "date-fns": "^3.x",
    "react-day-picker": "^8.x",
    "zod": "^3.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "@types/react": "^18.x",
    "eslint": "^8.x",
    "eslint-config-next": "16.x",
    "prettier": "^3.x",
    "prettier-plugin-tailwindcss": "^0.6.x"
  }
}
```

---

*Especificación técnica para Hotel Sauna Belén - Versión 1.0*
