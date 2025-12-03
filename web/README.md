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

Copia `env.example.txt` a `.env.local` y configura tus credenciales de Supabase:

```bash
cp env.example.txt .env.local
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

## 🚀 Deploy en Vercel

### Prerrequisitos

1. **Cuenta de GitHub**: Asegúrate de que tu código esté en un repositorio de GitHub
2. **Cuenta de Vercel**: Crea una cuenta en [vercel.com](https://vercel.com) (puedes usar tu cuenta de GitHub)

### Pasos para Desplegar

#### 1. Preparar el Repositorio

```bash
# Asegúrate de estar en la rama main
git checkout main

# Verifica que todos los cambios estén commiteados
git status

# Si hay cambios, commitea y push
git add .
git commit -m "Preparar proyecto para despliegue"
git push origin main
```

#### 2. Conectar con Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Haz clic en **"Import Git Repository"**
3. Selecciona tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js

#### 3. Configurar el Proyecto en Vercel

**Configuración del Framework:**
- **Framework Preset**: Next.js (se detecta automáticamente)
- **Root Directory**: `web` (si el proyecto está en una subcarpeta)
- **Build Command**: `pnpm build` (o `npm run build`)
- **Output Directory**: `.next` (por defecto)
- **Install Command**: `pnpm install` (o `npm install`)

**Variables de Entorno (OPCIONAL para prototipo):**

⚠️ **Para el prototipo con mocks, NO necesitas configurar variables de entorno.** El sistema funcionará automáticamente con datos de ejemplo.

Si más adelante quieres conectar Supabase, agrega estas variables en **"Environment Variables"**:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-publishable-key-here
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-here
NEXT_PUBLIC_APP_URL=https://tu-proyecto.vercel.app
```

**Nota:** 
- El sistema detecta automáticamente si hay configuración de Supabase
- Si no hay variables, funciona en modo mock con datos de ejemplo
- Las variables con `NEXT_PUBLIC_` son accesibles en el cliente
- `SUPABASE_SERVICE_ROLE_KEY` es solo para el servidor (nunca se expone al cliente)

#### 4. Desplegar

1. Haz clic en **"Deploy"** (¡sin necesidad de configurar variables de entorno!)
2. Vercel construirá y desplegará tu aplicación
3. Una vez completado, recibirás una URL como: `https://tu-proyecto.vercel.app`
4. La aplicación funcionará inmediatamente con datos mock

#### 5. Configurar Dominio Personalizado (Opcional)

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar los registros DNS

**Nota:** Para el prototipo, no necesitas configurar nada más. El sistema funcionará con mocks automáticamente.

### Deploy Automático

Vercel configurará automáticamente:
- ✅ Deploy en cada push a `main`
- ✅ Preview deployments para Pull Requests
- ✅ Rollback automático si el build falla

### Verificar el Deploy

1. Visita la URL proporcionada por Vercel
2. Verifica que la aplicación carga correctamente
3. Prueba las funcionalidades principales:
   - Navegación pública
   - Autenticación (si está configurada)
   - Funcionalidades del admin

### Troubleshooting

**Error de Build:**
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel
- Asegúrate de que `pnpm-lock.yaml` esté commiteado

**Variables de Entorno:**
- Verifica que todas las variables estén configuradas
- Asegúrate de que no haya espacios extra en los valores
- Las variables deben estar en mayúsculas

**Errores de Runtime:**
- Revisa los logs de función en Vercel Dashboard
- Verifica que Supabase esté configurado correctamente
- Asegúrate de que las URLs de Supabase sean correctas

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
