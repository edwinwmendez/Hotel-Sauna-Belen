# Especificación Técnica
## Hotel Sauna Belén - Arquitectura y Diseño Técnico

**Versión:** 2.1  
**Fecha:** Diciembre 2025  
**Última actualización:** Diciembre 2025  
**Stack:** Next.js 16 + React 19 + Supabase + Tailwind CSS v4  

---

## 1. Resumen de Arquitectura

### 1.1 Stack Tecnológico

| Capa | Tecnología | Versión | Justificación |
|------|------------|---------|---------------|
| Framework | Next.js | 16.0.6 | Turbopack, Cache Components, SSR |
| UI Library | React | 19.2.0 | Activity, useEffectEvent, mejor performance |
| Styling | Tailwind CSS | 4.x | CSS-first config, @theme directive |
| UI Components | shadcn/ui | Latest | Actualizado para React 19, sin forwardRef |
| Base de Datos | Supabase (PostgreSQL) | Latest | Free tier, Auth, Realtime, Storage |
| Autenticación | Supabase Auth | Latest | Email/password, manejo de sesiones |
| Storage | Supabase Storage | Latest | Imágenes de habitaciones |
| Hosting | Vercel | Latest | Integración nativa con Next.js, CDN |
| Forms | React Hook Form + Zod | 7.54+ / 3.24+ | Validación type-safe |
| Icons | Lucide React | 0.555+ | Iconos modernos y ligeros |
| Dates | date-fns | 4.x | Manipulación de fechas |
| Notifications | Sonner | 1.7+ | Toast notifications |

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
│  │                  Next.js 16 App (Turbopack)              │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │   Pages     │ │   API       │ │   Server    │       │   │
│  │  │  (RSC)      │ │  Routes     │ │  Actions    │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  │                                                          │   │
│  │  Proxy (Auth) - Reemplaza middleware.ts                 │   │
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
│   │   ├── habitaciones/
│   │   │   └── page.tsx          # Gestión de habitaciones
│   │   └── inventario/           # NUEVO: Módulo de inventarios
│   │       ├── page.tsx          # Dashboard inventario
│   │       ├── productos/
│   │       │   ├── page.tsx      # Lista productos
│   │       │   ├── nuevo/
│   │       │   │   └── page.tsx
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       ├── movimientos/
│   │       │   ├── page.tsx      # Historial
│   │       │   └── nuevo/
│   │       │       └── page.tsx  # Registrar entrada/salida
│   │       ├── categorias/
│   │       │   └── page.tsx
│   │       └── reportes/
│   │           └── page.tsx
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
│   │
│   └── inventory/                # NUEVO: Componentes inventario
│       ├── product-card.tsx
│       ├── stock-alert.tsx
│       ├── movement-form.tsx
│       ├── inventory-table.tsx
│       └── stock-chart.tsx
│
├── lib/                          # Utilidades y configuración
│   ├── supabase/
│   │   ├── client.ts             # Cliente browser
│   │   ├── server.ts             # Cliente server
│   │   └── types.ts
│   ├── actions/
│   │   ├── reservations.ts
│   │   ├── auth.ts
│   │   └── inventory.ts          # NUEVO
│   ├── queries/
│   │   ├── rooms.ts
│   │   ├── reservations.ts
│   │   └── inventory.ts          # NUEVO
│   ├── validations/
│   │   ├── booking.ts
│   │   └── inventory.ts          # NUEVO
│   ├── utils.ts                  # Utilidades generales
│   └── constants.ts              # Constantes del proyecto
│
├── hooks/                        # Custom hooks
│   ├── use-auth.ts
│   ├── use-booking.ts
│   └── use-inventory.ts          # NUEVO
│
├── types/                        # TypeScript types
│   ├── database.ts               # Types generados de Supabase
│   ├── booking.ts
│   └── inventory.ts              # NUEVO
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
│   │   ├── 001_initial_schema.sql
│   │   └── 002_inventory.sql     # NUEVO
│   └── seed.sql                  # Datos iniciales
│
├── proxy.ts                      # Auth proxy (reemplaza middleware)
├── postcss.config.mjs            # Tailwind v4
├── next.config.ts
├── .env.local                    # Variables de entorno
└── package.json
```

---

## 3. Configuración del Proyecto

### 3.1 package.json

```json
{
  "name": "hotel-sauna-belen",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^16.0.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.1",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "tw-animate-css": "^1.2.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "lucide-react": "^0.555.0",
    "date-fns": "^4.1.0",
    "zod": "^3.24.1",
    "react-hook-form": "^7.54.2",
    "@hookform/resolvers": "^3.9.1",
    "sonner": "^1.7.1"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "eslint": "^9.16.0",
    "eslint-config-next": "^16.0.6"
  }
}
```

### 3.2 postcss.config.mjs (Tailwind v4)

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 3.3 next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

export default nextConfig
```

### 3.4 Variables de Entorno (.env.local)

```env
# Supabase - NOTA: Usar PUBLISHABLE_KEY (no ANON_KEY)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.5 globals.css (Tailwind CSS v4)

```css
/* app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* Variables CSS del Hotel Sauna Belén */
:root {
  /* Colores del hotel */
  --navy: oklch(0.32 0.05 250);
  --navy-light: oklch(0.42 0.06 250);
  --navy-dark: oklch(0.22 0.04 250);
  --gold: oklch(0.75 0.12 85);
  --gold-light: oklch(0.82 0.10 85);
  --cream: oklch(0.96 0.01 90);

  /* shadcn/ui variables (OKLCH) */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.32 0.05 250);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.96 0.01 90);
  --secondary-foreground: oklch(0.32 0.05 250);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.75 0.12 85);
  --accent-foreground: oklch(0.32 0.05 250);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.32 0.05 250);
  --radius: 0.5rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.17 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.75 0.12 85);
  --primary-foreground: oklch(0.145 0 0);
}

/* Theme mapping para Tailwind v4 */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  
  /* Colores personalizados del hotel */
  --color-navy: var(--navy);
  --color-navy-light: var(--navy-light);
  --color-navy-dark: var(--navy-dark);
  --color-gold: var(--gold);
  --color-gold-light: var(--gold-light);
  --color-cream: var(--cream);
  
  /* Radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

/* Base styles */
body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

---

## 4. Modelo de Datos

### 4.1 Diagrama Entidad-Relación

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     rooms       │     │   reservations  │     │     guests      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ room_id (FK)    │     │ id (PK)         │
│ name            │     │ id (PK)         │>────│ user_id (FK)    │
│ slug            │     │ guest_id (FK)   │     │ full_name       │
│ type            │     │ check_in        │     │ email           │
│ price_per_night │     │ check_out       │     │ phone           │
│ capacity        │     │ total_price     │     │ document_number │
│ amenities       │     │ status          │     └─────────────────┘
│ images          │     │ booking_code    │
└─────────────────┘     └─────────────────┘
                              │
┌─────────────────────────────┼─────────────────────────────┐
│                             │                             │
│         INVENTARIO (NUEVO)  │                             │
│                             │                             │
│  ┌──────────────────┐      │      ┌──────────────────┐   │
│  │ inventory_       │      │      │ inventory_       │   │
│  │ categories       │      │      │ movements        │   │
│  ├──────────────────┤      │      ├──────────────────┤   │
│  │ id (PK)          │      │      │ id (PK)          │   │
│  │ name             │──────┼─────>│ product_id (FK)  │   │
│  │ description      │      │      │ movement_type    │   │
│  │ icon             │      │      │ quantity         │   │
│  └──────────────────┘      │      │ room_id (FK)     │───┘
│           │                │      │ reservation_id  │
│           │                │      │ created_by      │
│           ▼                │      └──────────────────┘
│  ┌──────────────────┐      │
│  │ inventory_       │      │
│  │ products         │──────┘
│  ├──────────────────┤
│  │ id (PK)          │
│  │ category_id (FK) │
│  │ name             │
│  │ current_stock    │
│  │ min_stock        │
│  │ cost_per_unit    │
│  └──────────────────┘
│
└───────────────────────────────────────────────────────────┘
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

### 4.2 Esquemas SQL

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
    -- Capacidad detallada por tipo de huésped (NULL = sin límite específico)
    max_adults INTEGER NULL,      -- Máximo de adultos (13+ años)
    max_youths INTEGER NULL,       -- Máximo de jóvenes (8-12 años)
    max_children INTEGER NULL,    -- Máximo de niños (3-7 años)
    max_infants INTEGER NULL,     -- Máximo de bebés (0-2 años)
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
    -- Desglose detallado de huéspedes
    adults INTEGER NOT NULL DEFAULT 1,      -- Adultos (13+ años)
    youths INTEGER NOT NULL DEFAULT 0,       -- Jóvenes (8-12 años)
    children INTEGER NOT NULL DEFAULT 0,    -- Niños (3-7 años)
    infants INTEGER NOT NULL DEFAULT 0,     -- Bebés (0-2 años)
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (check_out > check_in),
    CONSTRAINT valid_guests CHECK (adults >= 1 AND (adults + youths + children) >= 1)
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
-- Función mejorada que valida disponibilidad de fechas Y capacidad por tipo de huésped
CREATE OR REPLACE FUNCTION check_room_availability(
    p_room_id UUID,
    p_check_in DATE,
    p_check_out DATE,
    p_adults INTEGER DEFAULT 1,
    p_youths INTEGER DEFAULT 0,
    p_children INTEGER DEFAULT 0,
    p_infants INTEGER DEFAULT 0,
    p_exclude_reservation_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    is_booked BOOLEAN;
    room_capacity INTEGER;
    room_max_adults INTEGER;
    room_max_youths INTEGER;
    room_max_children INTEGER;
    room_max_infants INTEGER;
    total_guests_excluding_infants INTEGER := p_adults + p_youths + p_children;
BEGIN
    -- Verificar si la habitación está reservada en las fechas dadas
    SELECT EXISTS (
        SELECT 1 FROM public.reservations
        WHERE room_id = p_room_id
        AND status IN ('pending', 'confirmed')
        AND (p_exclude_reservation_id IS NULL OR id != p_exclude_reservation_id)
        AND (
            (check_in < p_check_out AND check_out > p_check_in)
        )
    ) INTO is_booked;

    IF is_booked THEN
        RETURN FALSE;
    END IF;

    -- Obtener la capacidad de la habitación
    SELECT capacity, max_adults, max_youths, max_children, max_infants
    INTO room_capacity, room_max_adults, room_max_youths, room_max_children, room_max_infants
    FROM public.rooms
    WHERE id = p_room_id;

    -- Validar que haya al menos 1 adulto
    IF p_adults < 1 THEN
        RETURN FALSE;
    END IF;

    -- Validar capacidad total (excluyendo bebés)
    IF room_capacity IS NOT NULL AND total_guests_excluding_infants > room_capacity THEN
        RETURN FALSE;
    END IF;

    -- Validar capacidades específicas por tipo de huésped si están definidas
    IF room_max_adults IS NOT NULL AND p_adults > room_max_adults THEN
        RETURN FALSE;
    END IF;
    IF room_max_youths IS NOT NULL AND p_youths > room_max_youths THEN
        RETURN FALSE;
    END IF;
    IF room_max_children IS NOT NULL AND p_children > room_max_children THEN
        RETURN FALSE;
    END IF;
    IF room_max_infants IS NOT NULL AND p_infants > room_max_infants THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

```sql
-- ============================================
-- MIGRACIÓN 002: Sistema de Inventarios
-- ============================================

-- TABLA: inventory_categories (Categorías de inventario)
CREATE TABLE public.inventory_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50), -- nombre del icono de lucide
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: inventory_products (Productos)
CREATE TABLE public.inventory_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.inventory_categories(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    sku VARCHAR(50) UNIQUE, -- código interno
    unit VARCHAR(50) NOT NULL DEFAULT 'unidad', -- 'unidad', 'caja', 'litro', 'kg', 'rollo'
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 0,
    cost_per_unit DECIMAL(10,2),
    supplier VARCHAR(200),
    location VARCHAR(100), -- 'almacén', 'recepción', etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLA: inventory_movements (Movimientos de inventario)
CREATE TABLE public.inventory_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.inventory_products(id) ON DELETE RESTRICT NOT NULL,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('entrada', 'salida', 'ajuste')),
    quantity DECIMAL(10,2) NOT NULL,
    previous_stock DECIMAL(10,2) NOT NULL,
    new_stock DECIMAL(10,2) NOT NULL,
    reason VARCHAR(100), -- 'compra', 'uso_habitacion', 'merma', 'ajuste_inventario', 'devolucion'
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para inventario
CREATE INDEX idx_inventory_products_category ON public.inventory_products(category_id);
CREATE INDEX idx_inventory_products_active ON public.inventory_products(is_active) WHERE is_active = true;
CREATE INDEX idx_inventory_low_stock ON public.inventory_products(current_stock, min_stock) 
    WHERE current_stock <= min_stock AND is_active = true;
CREATE INDEX idx_inventory_movements_product ON public.inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_date ON public.inventory_movements(created_at DESC);
CREATE INDEX idx_inventory_movements_type ON public.inventory_movements(movement_type);

-- Función: Actualizar stock automáticamente
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
DECLARE
    current DECIMAL(10,2);
BEGIN
    -- Obtener stock actual
    SELECT current_stock INTO current 
    FROM public.inventory_products 
    WHERE id = NEW.product_id;
    
    NEW.previous_stock := current;
    
    -- Calcular nuevo stock según tipo de movimiento
    IF NEW.movement_type = 'entrada' THEN
        NEW.new_stock := current + NEW.quantity;
    ELSIF NEW.movement_type = 'salida' THEN
        IF current < NEW.quantity THEN
            RAISE EXCEPTION 'Stock insuficiente. Disponible: %, Solicitado: %', current, NEW.quantity;
        END IF;
        NEW.new_stock := current - NEW.quantity;
    ELSE -- ajuste
        NEW.new_stock := NEW.quantity;
    END IF;
    
    -- Actualizar stock en productos
    UPDATE public.inventory_products 
    SET current_stock = NEW.new_stock, 
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock
    BEFORE INSERT ON public.inventory_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

-- Vista: Productos con stock bajo
CREATE OR REPLACE VIEW public.low_stock_products AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.unit,
    p.current_stock,
    p.min_stock,
    p.cost_per_unit,
    c.name as category_name,
    c.icon as category_icon,
    (p.min_stock - p.current_stock) as units_needed,
    CASE 
        WHEN p.current_stock = 0 THEN 'critical'
        WHEN p.current_stock <= p.min_stock * 0.5 THEN 'low'
        ELSE 'warning'
    END as alert_level
FROM public.inventory_products p
LEFT JOIN public.inventory_categories c ON p.category_id = c.id
WHERE p.current_stock <= p.min_stock 
  AND p.is_active = true
ORDER BY 
    CASE WHEN p.current_stock = 0 THEN 0 ELSE 1 END,
    (p.current_stock / NULLIF(p.min_stock, 0));

-- Vista: Resumen de inventario por categoría
CREATE OR REPLACE VIEW public.inventory_summary AS
SELECT 
    c.id as category_id,
    c.name as category_name,
    c.icon,
    COUNT(p.id) as total_products,
    SUM(CASE WHEN p.current_stock <= p.min_stock THEN 1 ELSE 0 END) as low_stock_count,
    SUM(p.current_stock * COALESCE(p.cost_per_unit, 0)) as total_value
FROM public.inventory_categories c
LEFT JOIN public.inventory_products p ON c.id = p.category_id AND p.is_active = true
GROUP BY c.id, c.name, c.icon
ORDER BY c.name;
```

### 4.3 Row Level Security (RLS)

```sql
-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Habilitar RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

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

-- INVENTORY: Solo admin
CREATE POLICY "Admin views inventory categories"
    ON public.inventory_categories FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin manages inventory categories"
    ON public.inventory_categories FOR ALL TO authenticated
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin views inventory products"
    ON public.inventory_products FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin manages inventory products"
    ON public.inventory_products FOR ALL TO authenticated
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin views inventory movements"
    ON public.inventory_movements FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin creates inventory movements"
    ON public.inventory_movements FOR INSERT TO authenticated
    WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
```

### 4.4 Gestión de Roles

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

## 5. Autenticación y Autorización

### 6.1 Server Actions (Recomendado en Next.js 16)

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
  // Desglose detallado de huéspedes
  guests: z.object({
    adults: z.number().min(1, 'Debe haber al menos 1 adulto').max(6, 'Máximo 6 adultos'),
    youths: z.number().min(0).max(6, 'Máximo 6 jóvenes'),
    children: z.number().min(0).max(6, 'Máximo 6 niños'),
    infants: z.number().min(0).max(6, 'Máximo 6 bebés'),
  }).refine(data => {
    const totalGuests = data.adults + data.youths + data.children;
    return totalGuests >= 1 && totalGuests <= 6;
  }, {
    message: 'El número total de adultos, jóvenes y niños debe ser entre 1 y 6.',
    path: ['adults']
  }),
  guest: z.object({
    fullName: z.string().min(2).max(200),
    email: z.string().email(),
    phone: z.string().regex(/^9\d{8}$/),
    documentType: z.enum(['DNI', 'CE', 'PASAPORTE']),
    documentNumber: z.string().min(8).max(20),
  }),
  createAccount: z.boolean().optional(),
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
  
  // Verificar disponibilidad (incluyendo validación de capacidad por tipo de huésped)
  const { data: isAvailable } = await supabase
    .rpc('check_room_availability', {
      p_room_id: validatedData.roomId,
      p_check_in: validatedData.checkIn,
      p_check_out: validatedData.checkOut,
      p_adults: validatedData.guests.adults,
      p_youths: validatedData.guests.youths,
      p_children: validatedData.guests.children,
      p_infants: validatedData.guests.infants,
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
  
  // Crear reserva (incluyendo desglose de huéspedes)
  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      room_id: validatedData.roomId,
      guest_id: guest.id,
      check_in: validatedData.checkIn,
      check_out: validatedData.checkOut,
      total_price: totalPrice,
      adults: validatedData.guests.adults,
      youths: validatedData.guests.youths,
      children: validatedData.guests.children,
      infants: validatedData.guests.infants,
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

### 6.2 API Routes (Para integraciones externas)

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

### 6.3 Endpoints Necesarios

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

## 6. APIs y Endpoints

### 5.1 Configuración Supabase Auth

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!  // Actualizado: PUBLISHABLE_KEY en lugar de ANON_KEY
  )
}

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,  // Actualizado: PUBLISHABLE_KEY
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar errores en Server Components
          }
        },
      },
    }
  )
}
```

### 5.2 Proxy de Autenticación (Next.js 16)

**Nota:** En Next.js 16, `proxy.ts` reemplaza `middleware.ts` para el manejo de autenticación.

```typescript
// proxy.ts (reemplaza middleware.ts en Next.js 16)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,  // Actualizado: PUBLISHABLE_KEY
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Proteger rutas admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', '/admin')
      return NextResponse.redirect(url)
    }
    
    const role = user.user_metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Proteger rutas cliente
  if (request.nextUrl.pathname.startsWith('/mis-reservas')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', '/mis-reservas')
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/mis-reservas/:path*'],
}
```

---

## 7. SEO y Performance

### 7.1 Metadata (Next.js 16)

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

### 7.2 Schema.org Markup

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
    telephone: '+51948924822',
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

## 8. Deployment

### 8.1 Variables de Entorno

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

### 8.2 Configuración Vercel

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

### 8.3 Checklist de Deployment

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

## 9. Datos Seed

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
-- Ejemplo de reserva futura (incluyendo desglose de huéspedes)
INSERT INTO public.reservations (room_id, guest_id, check_in, check_out, total_price, adults, youths, children, infants, status)
SELECT 
  r.id,
  g.id,
  CURRENT_DATE + 7,
  CURRENT_DATE + 9,
  r.price_per_night * 2,
  2,  -- 2 adultos
  0,  -- 0 jóvenes
  0,  -- 0 niños
  0,  -- 0 bebés
  'confirmed'
FROM public.rooms r, public.guests g
WHERE r.slug = 'suite-king-sauna' AND g.email = 'maria.garcia@email.com';

-- ============================================
-- DATOS SEED: INVENTARIO
-- ============================================

-- Categorías de inventario
INSERT INTO public.inventory_categories (name, description) VALUES
('Amenidades', 'Productos de tocador para huéspedes'),
('Blancos', 'Sábanas, toallas y ropa de cama'),
('Limpieza', 'Productos de limpieza y desinfección'),
('Papelería', 'Papel higiénico, pañuelos, servilletas'),
('Sauna', 'Insumos específicos para el sauna'),
('Mantenimiento', 'Repuestos y artículos de mantenimiento');

-- Productos de ejemplo
INSERT INTO public.inventory_products (category_id, name, unit, current_stock, min_stock, cost_per_unit) VALUES
-- Amenidades
((SELECT id FROM inventory_categories WHERE name = 'Amenidades'), 'Jabón tocador 30g', 'unidad', 45, 20, 0.80),
((SELECT id FROM inventory_categories WHERE name = 'Amenidades'), 'Shampoo sachet 15ml', 'unidad', 38, 30, 0.50),
((SELECT id FROM inventory_categories WHERE name = 'Amenidades'), 'Acondicionador sachet 15ml', 'unidad', 42, 30, 0.50),
((SELECT id FROM inventory_categories WHERE name = 'Amenidades'), 'Cepillo dental', 'unidad', 25, 15, 1.00),
((SELECT id FROM inventory_categories WHERE name = 'Amenidades'), 'Pasta dental mini', 'unidad', 28, 15, 0.80),

-- Blancos
((SELECT id FROM inventory_categories WHERE name = 'Blancos'), 'Toalla de baño grande', 'unidad', 24, 12, 25.00),
((SELECT id FROM inventory_categories WHERE name = 'Blancos'), 'Toalla de mano', 'unidad', 30, 15, 12.00),
((SELECT id FROM inventory_categories WHERE name = 'Blancos'), 'Sábana 2 plazas', 'juego', 12, 6, 45.00),
((SELECT id FROM inventory_categories WHERE name = 'Blancos'), 'Funda de almohada', 'unidad', 20, 10, 8.00),

-- Limpieza
((SELECT id FROM inventory_categories WHERE name = 'Limpieza'), 'Desinfectante multiusos', 'litro', 8, 5, 12.00),
((SELECT id FROM inventory_categories WHERE name = 'Limpieza'), 'Limpia vidrios', 'litro', 4, 3, 8.00),
((SELECT id FROM inventory_categories WHERE name = 'Limpieza'), 'Ambientador spray', 'unidad', 6, 4, 15.00),

-- Papelería
((SELECT id FROM inventory_categories WHERE name = 'Papelería'), 'Papel higiénico doble hoja', 'rollo', 48, 24, 1.50),
((SELECT id FROM inventory_categories WHERE name = 'Papelería'), 'Pañuelos faciales caja', 'caja', 15, 8, 3.00),

-- Sauna
((SELECT id FROM inventory_categories WHERE name = 'Sauna'), 'Esencia de eucalipto', 'frasco', 5, 3, 18.00),
((SELECT id FROM inventory_categories WHERE name = 'Sauna'), 'Toalla de sauna especial', 'unidad', 8, 4, 35.00);
```

---

## 10. Dependencias del Proyecto

```json
{
  "dependencies": {
    "next": "^16.0.6",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.1",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "tw-animate-css": "^1.2.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0",
    "lucide-react": "^0.555.0",
    "date-fns": "^4.1.0",
    "zod": "^3.24.1",
    "react-hook-form": "^7.54.2",
    "@hookform/resolvers": "^3.9.1",
    "sonner": "^1.7.1"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "eslint": "^9.16.0",
    "eslint-config-next": "^16.0.6"
  }
}
```

---

## 11. Mejoras Implementadas (Diciembre 2025)

### 11.1 Sistema de Desglose de Huéspedes

**Descripción:** Implementación de un sistema detallado de clasificación de huéspedes por edad para mejorar la gestión de capacidad de habitaciones y la experiencia de reserva.

**Cambios en Base de Datos:**
- **Tabla `rooms`:** Agregadas columnas `max_adults`, `max_youths`, `max_children`, `max_infants` para definir capacidad específica por tipo de huésped
- **Tabla `reservations`:** Agregadas columnas `adults`, `youths`, `children`, `infants` para registrar el desglose de huéspedes en cada reserva
- **Función `check_room_availability()`:** Actualizada para validar capacidad por tipo de huésped además de disponibilidad de fechas

**Clasificación de Huéspedes:**
- **Adultos:** 13+ años (mínimo 1 requerido)
- **Jóvenes:** 8-12 años
- **Niños:** 3-7 años
- **Bebés:** 0-2 años (no cuentan para capacidad total)

**Validaciones:**
- Mínimo 1 adulto por reserva
- Máximo 6 personas (adultos + jóvenes + niños)
- Validación de capacidad específica por habitación
- Los bebés no cuentan para la capacidad total pero tienen límite máximo

**Archivos Modificados:**
- `lib/validations/booking.ts`: Schema Zod actualizado con desglose de huéspedes
- `lib/utils/room-capacity.ts`: Nuevas funciones `canRoomAccommodateGuests()`, `getRoomCapacityDisplay()`, `getRoomCapacityDetails()`
- `components/home/guests-selector.tsx`: Nuevo componente para selección de huéspedes por tipo
- `components/booking/step-dates.tsx`: Integración del selector de huéspedes
- `supabase/migrations/003_add_room_capacity_by_type.sql`: Migración SQL para nuevas columnas

### 11.2 Mejoras en el Flujo de Reserva

**Widget de Búsqueda en Hero:**
- Widget integrado en la sección Hero de la página de inicio
- Búsqueda rápida con fechas y desglose de huéspedes
- Redirección automática a `/reservar` con parámetros prellenados
- Salto automático al Paso 2 (selección de habitación) cuando se viene desde el Hero

**Mejoras en el Wizard de Reserva:**
- Paso 1: Selección de fechas y huéspedes (con desglose detallado)
- Paso 2: Selección de habitación (filtrada por capacidad y disponibilidad)
- Paso 3: Datos del huésped principal
- Paso 4: Resumen completo con desglose de huéspedes

**Archivos Modificados:**
- `components/home/hero.tsx`: Rediseño con widget de búsqueda integrado
- `components/home/booking-widget.tsx`: Nuevo componente de búsqueda rápida
- `app/(public)/reservar/page.tsx`: Lógica para leer parámetros de URL y saltar pasos

### 11.3 Rediseño del Portal del Cliente

**Dashboard del Cliente (`/mi-cuenta`):**
- Nueva página de inicio para clientes autenticados
- Cards interactivos para acceso rápido a "Mis Reservas" y "Mi Perfil"
- Acciones rápidas: Nueva Reserva, Ver Habitaciones
- Bienvenida personalizada con nombre del usuario

**Navegación Mejorada:**
- Barra de navegación clara con pestañas: Mi Cuenta, Mis Reservas, Mi Perfil
- Estado activo visual (fondo azul cuando está seleccionado)
- Responsive: labels completos en desktop, abreviados en móvil
- Scroll horizontal en móvil para mejor UX
- Un solo botón de logout visible (centralizado en el layout del cliente)

**Mejoras en el Header:**
- Botón 'Mi Cuenta' ahora lleva a `/mi-cuenta` (dashboard)
- Ocultar botón de logout del Header cuando está en portal del cliente
- Evitar duplicación de controles

**Redirección Después del Login:**
- Si no hay redirect específico, ir a `/mi-cuenta` (dashboard)
- Si hay redirect, respetarlo
- Admin sigue yendo a `/admin`

**Archivos Modificados:**
- `app/(cliente)/mi-cuenta/page.tsx`: Nueva página de dashboard
- `app/(cliente)/layout.tsx`: Navegación mejorada con sub-navegación
- `app/(auth)/login/page.tsx`: Redirección mejorada
- `components/layout/header.tsx`: Lógica condicional para ocultar controles duplicados

### 11.4 Mejoras en el Panel de Administración

**Dashboards Mejorados:**
- Botones de "Accesos Rápidos" rediseñados para diferenciarse claramente de los cards de estadísticas
- Diseño de botones con variant="outline", flechas indicadoras, y efectos hover marcados
- Título de sección "Accesos Rápidos" para mejor organización visual
- Iconos en contenedores con colores que cambian al hover
- Transiciones suaves y feedback visual claro

**Calendario de Ocupación:**
- Vista semanal implementada además de mensual
- Navegación mejorada (anterior/siguiente mes/semana, botón "Hoy")
- Columna de habitaciones sticky para mejor navegación horizontal
- Vista responsive: cards en móvil, tabla en desktop
- Scroll horizontal optimizado

**CRUD Completo:**
- Páginas de detalle, edición y creación para Reservas, Habitaciones, Productos y Categorías
- Formularios completos con validación
- Integración del desglose de huéspedes en formularios de habitaciones y reservas

**Archivos Modificados:**
- `app/admin/page.tsx`: Dashboard principal con botones mejorados
- `app/admin/inventario/page.tsx`: Dashboard de inventario con botones mejorados
- `app/admin/calendario/page.tsx`: Vista semanal y mejoras de navegación
- Múltiples páginas de CRUD creadas en `app/admin/reservas/[id]`, `app/admin/habitaciones/[id]`, etc.

### 11.5 Mejoras de Diseño y Responsividad

**Hero Section Rediseñado:**
- Imagen de fondo con fallback a gradiente
- Widget de búsqueda integrado
- Elementos de confianza (calificación, badges)
- Texto más conciso y directo
- Diseño responsive optimizado para móviles

**Páginas Legales:**
- Página de "Términos y Condiciones" (`/terminos`)
- Página de "Política de Cancelación" (`/politica-cancelacion`)
- Enlaces en el footer bajo sección "Legal"

**Footer Mejorado:**
- Sección "Legal" con enlaces a términos y políticas
- Crédito de desarrollo: "Desarrollado por Edwin W. Mendez Echevarria"

**Responsividad Completa:**
- Todas las páginas públicas y administrativas son completamente responsive
- Tablas convertidas a cards en móvil
- Grids adaptativos (1 columna móvil, 2-3 columnas desktop)
- Textos y espaciados adaptativos
- Navegación móvil optimizada

**Archivos Modificados:**
- `components/home/hero.tsx`: Rediseño completo
- `components/layout/footer.tsx`: Sección Legal y créditos
- `app/(public)/terminos/page.tsx`: Nueva página
- `app/(public)/politica-cancelacion/page.tsx`: Nueva página
- Múltiples páginas: Mejoras de responsividad aplicadas sistemáticamente

### 11.6 Mejoras Técnicas

**Componentes UI:**
- Corrección del componente `Button` para manejar correctamente el prop `asChild` con `@radix-ui/react-slot`
- Mejoras en manejo de errores de imágenes con fallbacks

**Autenticación:**
- Soporte para mock authentication cuando Supabase no está configurado
- `lib/supabase/mock.ts`: Cliente mock completo para desarrollo local

**Migraciones SQL:**
- `003_add_room_capacity_by_type.sql`: Migración para nuevas columnas de capacidad y desglose de huéspedes

---

*Especificación técnica para Hotel Sauna Belén - Versión 2.1*
