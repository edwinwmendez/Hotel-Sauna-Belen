# Actualizaciones del Proyecto
## Hotel Sauna Belén - Cambios y Nuevos Requerimientos

**Fecha:** 02 Diciembre 2025  
**Versión:** 1.1  

---

## 1. Información Actualizada de la Empresa

### 1.1 Datos de la Entrevista

| Campo | Información |
|-------|-------------|
| **Representante** | Alessandra Jimena Vera Salazar (Administradora) |
| **Propuesta de valor** | Espacio cómodo, accesible, diseño simple y funcional |
| **Pilares diferenciadores** | Excelente servicio, limpieza continua, tarifas justas |
| **Herramientas actuales** | Excel para control de reservas |

### 1.2 Canales de Marketing Actuales
- Facebook e Instagram
- Afiches físicos
- Google Maps
- Boca a boca (recomendaciones)

### 1.3 Problemas Identificados (Prioritarios)
1. **Control de inventarios** - Necesita mejora urgente
2. **Registro de huéspedes** - Proceso manual ineficiente
3. **Escasez de personal** - En temporadas altas causa retrasos

### 1.4 Prácticas de Sostenibilidad
- Reducción de plásticos
- Ahorro de agua y energía
- Productos de limpieza locales
- Materiales reciclables
- **Planes futuros:** Duchas solares, mejor clasificación de residuos

---

## 2. Nuevo Módulo: Control de Inventarios

### 2.1 ¿Qué es el Control de Inventarios en un Hotel?

El control de inventarios en hotelería se refiere a la gestión de todos los suministros consumibles y equipamiento que el hotel necesita para operar:

**Categorías de Inventario:**

| Categoría | Ejemplos | Frecuencia de Reposición |
|-----------|----------|-------------------------|
| **Amenidades** | Jabones, shampoo, acondicionador, cremas, cepillos | Diaria/Por huésped |
| **Blancos** | Sábanas, toallas, almohadas, cobertores | Semanal |
| **Limpieza** | Detergentes, desinfectantes, ambientadores | Semanal |
| **Minibar** | Agua, gaseosas, snacks, bebidas | Por consumo |
| **Papelería** | Papel higiénico, pañuelos, bolsas | Diaria |
| **Sauna** | Esencias, piedras, toallas especiales | Semanal |
| **Mantenimiento** | Focos, pilas, repuestos menores | Según necesidad |

### 2.2 Funcionalidades del Módulo de Inventarios

#### Funcionalidades Core (MVP)

| ID | Funcionalidad | Prioridad | Descripción |
|----|---------------|-----------|-------------|
| INV01 | Catálogo de productos | Alta | Lista de todos los productos con categoría, unidad, stock mínimo |
| INV02 | Registro de stock actual | Alta | Cantidad disponible de cada producto |
| INV03 | Alertas de stock bajo | Alta | Notificación cuando un producto está bajo el mínimo |
| INV04 | Registro de entradas | Media | Cuando llegan nuevos productos (compras) |
| INV05 | Registro de salidas | Media | Consumo por habitación o área |
| INV06 | Dashboard de inventario | Media | Vista general del estado del inventario |
| INV07 | Historial de movimientos | Baja | Log de todas las entradas y salidas |
| INV08 | Reportes básicos | Baja | Consumo mensual, productos más usados |

### 2.3 Modelo de Datos Adicional

```sql
-- ============================================
-- TABLA: inventory_categories (Categorías)
-- ============================================
CREATE TABLE public.inventory_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: inventory_products (Productos)
-- ============================================
CREATE TABLE public.inventory_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.inventory_categories(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL, -- 'unidad', 'caja', 'litro', 'kg'
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 0, -- Alerta cuando llegue a este nivel
    cost_per_unit DECIMAL(10,2),
    supplier VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLA: inventory_movements (Movimientos)
-- ============================================
CREATE TABLE public.inventory_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.inventory_products(id) NOT NULL,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('entrada', 'salida', 'ajuste')),
    quantity DECIMAL(10,2) NOT NULL,
    previous_stock DECIMAL(10,2) NOT NULL,
    new_stock DECIMAL(10,2) NOT NULL,
    reason VARCHAR(200), -- 'compra', 'uso_habitacion', 'uso_areas_comunes', 'merma', 'ajuste_inventario'
    room_id UUID REFERENCES public.rooms(id), -- Si aplica
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_inventory_products_category ON public.inventory_products(category_id);
CREATE INDEX idx_inventory_products_low_stock ON public.inventory_products(current_stock) WHERE current_stock <= min_stock;
CREATE INDEX idx_inventory_movements_product ON public.inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_date ON public.inventory_movements(created_at);

-- ============================================
-- FUNCIÓN: Actualizar stock automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Guardar stock anterior
    NEW.previous_stock := (SELECT current_stock FROM public.inventory_products WHERE id = NEW.product_id);
    
    -- Calcular nuevo stock
    IF NEW.movement_type = 'entrada' THEN
        NEW.new_stock := NEW.previous_stock + NEW.quantity;
    ELSIF NEW.movement_type = 'salida' THEN
        NEW.new_stock := NEW.previous_stock - NEW.quantity;
    ELSE -- ajuste
        NEW.new_stock := NEW.quantity; -- El ajuste establece el stock directamente
    END IF;
    
    -- Actualizar stock en productos
    UPDATE public.inventory_products 
    SET current_stock = NEW.new_stock, updated_at = NOW()
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock
    BEFORE INSERT ON public.inventory_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_product_stock();

-- ============================================
-- VISTA: Productos con stock bajo
-- ============================================
CREATE VIEW public.low_stock_products AS
SELECT 
    p.*,
    c.name as category_name,
    (p.min_stock - p.current_stock) as units_needed
FROM public.inventory_products p
LEFT JOIN public.inventory_categories c ON p.category_id = c.id
WHERE p.current_stock <= p.min_stock AND p.is_active = true;
```

### 2.4 Estructura de Carpetas Adicional

```
app/
├── admin/
│   ├── inventario/
│   │   ├── page.tsx              # Dashboard de inventario
│   │   ├── productos/
│   │   │   ├── page.tsx          # Lista de productos
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx      # Crear producto
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Editar producto
│   │   ├── movimientos/
│   │   │   ├── page.tsx          # Historial de movimientos
│   │   │   └── nuevo/
│   │   │       └── page.tsx      # Registrar entrada/salida
│   │   ├── categorias/
│   │   │   └── page.tsx          # Gestión de categorías
│   │   └── reportes/
│   │       └── page.tsx          # Reportes de consumo

components/
├── inventory/
│   ├── product-card.tsx
│   ├── stock-alert.tsx
│   ├── movement-form.tsx
│   ├── inventory-table.tsx
│   └── stock-chart.tsx
```

### 2.5 Wireframe: Dashboard de Inventario

```
┌─────────────────────────────────────────────────────────────────────┐
│  [LOGO]  Hotel Sauna Belén - Admin              👤 Admin  [Salir]  │
├────────────┬────────────────────────────────────────────────────────┤
│            │                                                        │
│  Dashboard │  Control de Inventario                                │
│  Reservas  │                                                        │
│  Calendario│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐         │
│  ─────────│  │   45   │ │    8   │ │   12   │ │ S/2.5K │         │
│  📦 Invent.│  │Product.│ │  Bajo  │ │Movim.  │ │ Valor  │         │
│    • Produc│  │ Total  │ │ Stock  │ │  Hoy   │ │ Total  │         │
│    • Movim.│  └────────┘ └────────┘ └────────┘ └────────┘         │
│    • Report│                                                        │
│  ─────────│  ⚠️ ALERTAS DE STOCK BAJO                              │
│  Habitac.  │  ┌────────────────────────────────────────────────┐   │
│  Config    │  │ 🔴 Jabón tocador (3 uds) - Mín: 20            │   │
│            │  │ 🔴 Shampoo sachet (5 uds) - Mín: 30           │   │
│            │  │ 🟡 Papel higiénico (8 uds) - Mín: 10          │   │
│            │  └────────────────────────────────────────────────┘   │
│            │                                                        │
│            │  📊 MOVIMIENTOS RECIENTES                             │
│            │  ┌────────────────────────────────────────────────┐   │
│            │  │ ↓ Salida: 2x Jabón - Hab. King - Hace 2h      │   │
│            │  │ ↑ Entrada: 50x Shampoo - Compra - Hace 5h     │   │
│            │  │ ↓ Salida: 4x Toallas - Hab. Matri - Ayer      │   │
│            │  └────────────────────────────────────────────────┘   │
│            │                                                        │
│            │  [+ Registrar Entrada]  [+ Registrar Salida]         │
│            │                                                        │
└────────────┴────────────────────────────────────────────────────────┘
```

---

## 3. Stack Tecnológico Actualizado (Diciembre 2025)

### 3.1 Cambios Principales

| Tecnología | Versión Anterior | Versión Actual | Cambios Importantes |
|------------|------------------|----------------|---------------------|
| **Next.js** | 14.x | **16.0.6** | Turbopack por defecto, Cache Components, proxy.ts reemplaza middleware |
| **React** | 18.x | **19.2.0** | Activity component, useEffectEvent, Performance Tracks |
| **Tailwind CSS** | 3.4.x | **4.x** | CSS-first config, @theme directive, sin tailwind.config.js |
| **shadcn/ui** | v3 | **v4** | Soporte Tailwind v4, React 19, sin forwardRef |
| **Supabase** | - | Latest | Nueva variable: `PUBLISHABLE_KEY` en lugar de `ANON_KEY` |

### 3.2 Package.json Actualizado

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
    "@supabase/ssr": "^0.6.x",
    "@supabase/supabase-js": "^2.79.x",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "tw-animate-css": "^1.x",
    "lucide-react": "^0.555.x",
    "date-fns": "^4.x",
    "zod": "^3.24.x",
    "react-hook-form": "^7.54.x",
    "@hookform/resolvers": "^3.9.x",
    "sonner": "^1.7.x"
  },
  "devDependencies": {
    "typescript": "^5.7.x",
    "@types/node": "^22.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "eslint": "^9.x",
    "eslint-config-next": "^16.x"
  }
}
```

### 3.3 Configuración CSS (globals.css) - Tailwind v4

```css
/* app/globals.css - Tailwind CSS v4 */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* Variables CSS del Hotel */
:root {
  /* Colores primarios */
  --navy: oklch(0.32 0.05 250);
  --navy-light: oklch(0.42 0.06 250);
  --navy-dark: oklch(0.22 0.04 250);
  --gold: oklch(0.75 0.12 85);
  --gold-light: oklch(0.82 0.10 85);
  --cream: oklch(0.96 0.01 90);

  /* shadcn/ui variables */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: var(--navy);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: var(--cream);
  --secondary-foreground: var(--navy);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: var(--gold);
  --accent-foreground: var(--navy);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: var(--navy);
  --radius: 0.5rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... resto de variables dark */
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
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  
  /* Colores del hotel */
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
```

### 3.4 PostCSS Config (postcss.config.mjs)

```javascript
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 3.5 Variables de Entorno Actualizadas

```env
# .env.local

# Supabase - NOTA: Ahora usa PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Opcional)
RESEND_API_KEY=re_xxxxx
```

### 3.6 Cliente Supabase Actualizado

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!  // <- Cambio importante
  )
}

// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,  // <- Cambio importante
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
            // Ignorar en Server Components
          }
        },
      },
    }
  )
}
```

### 3.7 Proxy (Reemplaza Middleware en Next.js 16)

```typescript
// proxy.ts (antes middleware.ts)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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

### 3.8 Comandos de Instalación Actualizados

```bash
# Crear proyecto Next.js 16
npx create-next-app@latest hotel-sauna-belen --typescript --eslint --app

cd hotel-sauna-belen

# Instalar Tailwind CSS v4
npm install tailwindcss @tailwindcss/postcss

# Instalar shadcn/ui (versión actualizada)
npx shadcn@latest init

# Agregar componentes shadcn
npx shadcn@latest add button card input label calendar dialog select form

# Instalar Supabase
npm install @supabase/supabase-js @supabase/ssr

# Instalar utilidades
npm install date-fns lucide-react sonner
npm install zod react-hook-form @hookform/resolvers
npm install clsx tailwind-merge class-variance-authority
```

---

## 4. Plan de Desarrollo Actualizado

### 4.1 Tareas Adicionales por el Módulo de Inventarios

| Fase | Tarea | Tiempo Estimado |
|------|-------|-----------------|
| DB | Crear tablas de inventario | 30 min |
| Admin | Dashboard de inventario | 2 horas |
| Admin | CRUD de productos | 2 horas |
| Admin | Registro de movimientos | 1.5 horas |
| Admin | Alertas de stock bajo | 1 hora |
| Admin | Reportes básicos | 1 hora |
| **Total adicional** | | **8 horas** |

### 4.2 Nueva Distribución de Tiempo

```
TIEMPO TOTAL ESTIMADO: 28-34 horas

Distribución sugerida (2-3 días intensivos):

DÍA 1 (10-12 horas):
├── Setup proyecto con stack actualizado (2h)
├── Frontend público completo (5h)
└── Sistema de reservas (5h)

DÍA 2 (10-12 horas):
├── Panel admin - Dashboard y reservas (4h)
├── Calendario de ocupación (2h)
├── Auth + Portal cliente (3h)
└── Testing básico (2h)

DÍA 3 (8-10 horas):
├── Módulo de inventarios completo (6h)
├── Testing e2e (1h)
├── Deploy y ajustes finales (2h)
└── Documentación para entrega (1h)
```

---

## 5. Datos Seed Actualizados

```sql
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

## 6. Checklist Actualizado

### ✅ MVP Original
- [ ] Todo lo del PRD original

### ✅ Módulo de Inventarios (Nuevo)
- [ ] Tablas en Supabase
- [ ] Dashboard de inventario
- [ ] Lista de productos con stock
- [ ] Alertas de stock bajo
- [ ] Registrar entrada de productos
- [ ] Registrar salida/consumo
- [ ] Historial de movimientos

### ✅ Stack Actualizado
- [ ] Next.js 16 con Turbopack
- [ ] React 19.2
- [ ] Tailwind CSS v4 (CSS-first)
- [ ] shadcn/ui actualizado
- [ ] Supabase con PUBLISHABLE_KEY

---

*Actualizaciones v1.1 - Hotel Sauna Belén*
