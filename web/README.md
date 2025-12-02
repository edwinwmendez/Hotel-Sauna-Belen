# Hotel Sauna Belén - Sistema Web

Sistema web completo para la gestión de reservas e inventarios del Hotel Sauna Belén.

## 🚀 Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS v4
- **Componentes:** shadcn/ui
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth (con modo mock para desarrollo)
- **Validación:** Zod + React Hook Form
- **Iconos:** Lucide React
- **Notificaciones:** Sonner

## 📋 Requisitos Previos

- Node.js 18+ 
- pnpm (recomendado) o npm
- Cuenta de Supabase (opcional para desarrollo con mocks)

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd web
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**

Copia `.env.example` a `.env.local` y configura tus credenciales de Supabase:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-publishable-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Nota:** Si no configuras Supabase, el sistema funcionará en modo mock con datos de ejemplo.

## 🎯 Modo Mock

El sistema incluye un modo mock que permite desarrollo sin Supabase:

- **Habitaciones:** 3 habitaciones de ejemplo
- **Autenticación:** Login/Registro simulado
- **Reservas:** Generación de códigos mock
- **Inventario:** Datos de ejemplo

### Credenciales Mock:
- **Cliente:** Cualquier email/password funciona
- **Admin:** `admin@hotelsaunabelen.com` / cualquier password

## 🏃 Ejecutar el Proyecto

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar producción
pnpm start
```

El proyecto estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
web/
├── app/                    # App Router (Next.js 16)
│   ├── (public)/           # Rutas públicas
│   ├── (auth)/            # Autenticación
│   ├── (cliente)/         # Portal cliente
│   └── admin/              # Panel administrativo
├── components/             # Componentes React
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── layout/            # Header, Footer
│   ├── home/              # Componentes del home
│   ├── rooms/             # Componentes de habitaciones
│   ├── booking/           # Componentes de reserva
│   ├── admin/             # Componentes admin
│   └── inventory/         # Componentes inventario
├── lib/                    # Utilidades
│   ├── supabase/          # Clientes Supabase
│   ├── actions/           # Server Actions
│   ├── queries/           # Queries a base de datos
│   └── validations/       # Esquemas Zod
├── hooks/                  # Custom hooks
└── types/                  # TypeScript types
```

## 🎨 Características Implementadas

### ✅ Páginas Públicas
- Home con hero, sauna section y preview de habitaciones
- Lista de habitaciones
- Detalle de habitación con galería
- Página del sauna
- Página de contacto

### ✅ Sistema de Reservas
- Wizard de 4 pasos (Fechas → Habitación → Datos → Confirmación)
- Validación completa con Zod
- Verificación de disponibilidad
- Generación de código de reserva
- Página de confirmación

### ✅ Autenticación (Mock)
- Login (cliente/admin)
- Registro de cliente
- Recuperar contraseña
- Protección de rutas

### ✅ Portal Cliente
- Mis reservas (lista y detalle)
- Perfil editable
- Solicitud de cancelación

### ✅ Panel Administrativo
- Dashboard con estadísticas
- Gestión de reservas (lista, filtros, búsqueda)
- Calendario de ocupación mensual
- Gestión de habitaciones

### ✅ Módulo de Inventarios
- Dashboard con alertas de stock bajo
- Gestión de productos (CRUD)
- Registro de movimientos (entrada/salida/ajuste)
- Gestión de categorías
- Reportes de consumo

## 🔐 Configuración de Supabase (Producción)

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar migraciones SQL desde `TECHNICAL_SPEC.md`
3. Configurar Row Level Security (RLS)
4. Crear usuario admin desde el dashboard
5. Actualizar variables de entorno

## 📝 Notas de Desarrollo

- El sistema funciona completamente en modo mock sin Supabase
- Los datos mock se almacenan en localStorage para la sesión
- Las reservas mock generan códigos únicos
- El inventario usa datos estáticos de ejemplo

## 🚀 Deploy

El proyecto está listo para deploy en Vercel:

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push

## 📚 Documentación

- `PRD.md` - Requisitos del producto
- `TECHNICAL_SPEC.md` - Especificación técnica completa
- `DESIGN_GUIDE.md` - Guía de diseño UI/UX
- `CONTENT_GUIDE.md` - Guía de contenido
- `DEV_PLAN.md` - Plan de desarrollo
- `SYSTEM_DESIGN.md` - Diseño del sistema

## 👨‍💻 Desarrollo

Para desarrollo local sin Supabase, simplemente ejecuta:

```bash
pnpm dev
```

El sistema detectará automáticamente la falta de configuración y usará mocks.

## 📞 Soporte

Para consultas sobre el proyecto, revisa la documentación técnica completa.

---

**Hotel Sauna Belén** - Sistema de Gestión Web v1.0
