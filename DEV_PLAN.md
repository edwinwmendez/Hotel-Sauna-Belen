# Plan de Desarrollo
## Hotel Sauna Belén - Roadmap de Implementación

**Versión:** 1.0  
**Fecha inicio:** Diciembre 2025  
**Duración estimada:** 6 días (objetivo: 1 día intensivo)  
**Metodología:** Desarrollo iterativo con entregables incrementales  

---

## 1. Resumen del Plan

### 1.1 Visión General

```
Día 1 (Actual)     → Documentación completa + Setup inicial
Día 2              → Frontend público (Home, Habitaciones, Sauna)
Día 3              → Sistema de reservas completo
Día 4              → Panel administrativo
Día 5              → Portal cliente + Auth
Día 6              → Testing, ajustes, deploy final
```

### 1.2 Objetivos por Entregable

| Entregable | Descripción | Criterio de Éxito |
|------------|-------------|-------------------|
| E1 | Sitio navegable | Home + páginas estáticas funcionando |
| E2 | Reservas MVP | Flujo completo de reserva funcional |
| E3 | Admin básico | Dashboard + lista de reservas |
| E4 | Portal cliente | Login + gestión de reservas propias |
| E5 | Producción | Deploy en Vercel con datos de prueba |

---

## 2. Fases del Proyecto

### FASE 0: Setup y Configuración (2-3 horas)

```
┌─────────────────────────────────────────────────────────────────┐
│  TAREAS DE SETUP                                                │
├─────────────────────────────────────────────────────────────────┤
│  □ Crear proyecto Next.js 16 con App Router                    │
│  □ Configurar Tailwind CSS + shadcn/ui                         │
│  □ Crear proyecto en Supabase                                  │
│  □ Ejecutar migraciones SQL (tablas, funciones, RLS)           │
│  □ Configurar variables de entorno                             │
│  □ Conectar Supabase con Next.js (client + server)             │
│  □ Setup repositorio Git + primera commit                      │
│  □ Crear estructura de carpetas según spec                     │
└─────────────────────────────────────────────────────────────────┘
```

**Comandos iniciales:**
```bash
npx create-next-app@latest hotel-sauna-belen --typescript --tailwind --eslint --app --src-dir=false
cd hotel-sauna-belen
npx shadcn@latest init
npx shadcn@latest add button card input label form calendar dialog select
npm install @supabase/supabase-js @supabase/ssr date-fns lucide-react
npm install zod react-hook-form @hookform/resolvers
```

---

### FASE 1: Frontend Público (4-5 horas)

#### 1.1 Layout Base y Navegación

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Header responsive | `components/layout/header.tsx` | 45 min |
| Footer | `components/layout/footer.tsx` | 30 min |
| Root layout | `app/layout.tsx` | 20 min |
| Mobile menu | `components/layout/mobile-nav.tsx` | 30 min |

#### 1.2 Home Page

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Hero section | `components/home/hero.tsx` | 45 min |
| Buscador disponibilidad | `components/booking/availability-search.tsx` | 60 min |
| Preview habitaciones | `components/home/rooms-preview.tsx` | 45 min |
| Sección sauna | `components/home/sauna-section.tsx` | 30 min |
| Servicios/amenidades | `components/home/amenities.tsx` | 20 min |
| Integrar en page | `app/(public)/page.tsx` | 20 min |

#### 1.3 Páginas de Habitaciones

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Room card component | `components/rooms/room-card.tsx` | 30 min |
| Lista habitaciones | `app/(public)/habitaciones/page.tsx` | 45 min |
| Galería de imágenes | `components/rooms/room-gallery.tsx` | 45 min |
| Detalle habitación | `app/(public)/habitaciones/[slug]/page.tsx` | 60 min |
| Fetch de datos Supabase | `lib/queries/rooms.ts` | 30 min |

#### 1.4 Páginas Adicionales

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Página Sauna | `app/(public)/sauna/page.tsx` | 30 min |
| Página Contacto | `app/(public)/contacto/page.tsx` | 45 min |
| Página 404 | `app/not-found.tsx` | 15 min |

---

### FASE 2: Sistema de Reservas (5-6 horas)

#### 2.1 Flujo de Reserva (Wizard)

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Wizard container | `app/(public)/reservar/page.tsx` | 30 min |
| Step 1: Fechas | `components/booking/step-dates.tsx` | 60 min |
| Step 2: Habitación | `components/booking/step-room.tsx` | 60 min |
| Step 3: Datos huésped | `components/booking/step-guest.tsx` | 60 min |
| Step 4: Resumen | `components/booking/step-summary.tsx` | 45 min |
| Progress indicator | `components/booking/progress-bar.tsx` | 20 min |
| Booking state (Zustand/Context) | `lib/stores/booking-store.ts` | 30 min |

#### 2.2 Lógica de Negocio

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Verificar disponibilidad | `lib/actions/availability.ts` | 45 min |
| Crear reserva (Server Action) | `lib/actions/reservations.ts` | 60 min |
| Validaciones Zod | `lib/validations/booking.ts` | 30 min |
| Generar código reserva | En Supabase (ya hecho) | - |

#### 2.3 Confirmación

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Página de éxito | `app/(public)/reservar/confirmacion/page.tsx` | 45 min |
| Email de confirmación (mock) | `lib/services/email.ts` | 30 min |

---

### FASE 3: Panel Administrativo (4-5 horas)

#### 3.1 Layout Admin

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Sidebar navigation | `components/admin/sidebar.tsx` | 45 min |
| Admin layout | `app/admin/layout.tsx` | 30 min |
| Header admin | `components/admin/admin-header.tsx` | 20 min |

#### 3.2 Dashboard

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Stats cards | `components/admin/stats-card.tsx` | 30 min |
| Reservas del día | `components/admin/today-reservations.tsx` | 45 min |
| Mini calendario ocupación | `components/admin/occupancy-preview.tsx` | 45 min |
| Dashboard page | `app/admin/page.tsx` | 30 min |
| Queries dashboard | `lib/queries/admin-stats.ts` | 30 min |

#### 3.3 Gestión de Reservas

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Tabla de reservas | `components/admin/reservations-table.tsx` | 60 min |
| Filtros y búsqueda | `components/admin/reservation-filters.tsx` | 30 min |
| Lista reservas page | `app/admin/reservas/page.tsx` | 30 min |
| Detalle reserva | `app/admin/reservas/[id]/page.tsx` | 45 min |
| Cambiar estado reserva | `lib/actions/admin-reservations.ts` | 30 min |

#### 3.4 Calendario de Ocupación

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Calendario mensual | `components/admin/occupancy-calendar.tsx` | 90 min |
| Vista por habitación | En mismo componente | - |
| Calendario page | `app/admin/calendario/page.tsx` | 20 min |

---

### FASE 4: Autenticación y Portal Cliente (3-4 horas)

#### 4.1 Autenticación

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Login page | `app/(auth)/login/page.tsx` | 45 min |
| Registro page | `app/(auth)/registro/page.tsx` | 45 min |
| Auth actions | `lib/actions/auth.ts` | 30 min |
| Middleware protección | `middleware.ts` | 30 min |
| Auth context/hook | `hooks/use-auth.ts` | 20 min |

#### 4.2 Portal Cliente

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Layout cliente | `app/(cliente)/layout.tsx` | 20 min |
| Mis reservas | `app/(cliente)/mis-reservas/page.tsx` | 45 min |
| Detalle mi reserva | `app/(cliente)/mis-reservas/[id]/page.tsx` | 45 min |
| Cancelar reserva | En detalle (action) | 20 min |

---

### FASE 5: Finalización y Deploy (2-3 horas)

#### 5.1 Testing y QA

| Tarea | Descripción | Tiempo |
|-------|-------------|--------|
| Test flujo reserva | Completo, diferentes escenarios | 30 min |
| Test admin | Dashboard, gestión reservas | 20 min |
| Test cliente | Login, ver reservas | 20 min |
| Test responsive | Mobile, tablet, desktop | 30 min |
| Fix bugs críticos | Según hallazgos | 60 min |

#### 5.2 Datos Seed

| Tarea | Archivo | Tiempo |
|-------|---------|--------|
| Insertar habitaciones | `supabase/seed.sql` | 10 min |
| Crear usuario admin | Supabase Dashboard | 5 min |
| Insertar reservas ejemplo | `supabase/seed.sql` | 10 min |
| Verificar datos | Query manual | 10 min |

#### 5.3 Deploy

| Tarea | Descripción | Tiempo |
|-------|-------------|--------|
| Crear proyecto Vercel | Conectar repo | 10 min |
| Configurar env vars | Supabase keys | 5 min |
| Deploy inicial | Push to main | 10 min |
| Verificar producción | Test en URL pública | 15 min |
| Ajustes finales | Según necesidad | 30 min |

---

## 3. Tareas Priorizadas (Kanban)

### 🔴 CRÍTICO (MVP mínimo)

```
1. [ ] Setup proyecto completo
2. [ ] Home page con buscador
3. [ ] Lista de habitaciones
4. [ ] Flujo de reserva completo
5. [ ] Confirmación de reserva
6. [ ] Dashboard admin básico
7. [ ] Lista de reservas admin
8. [ ] Deploy funcional
```

### 🟡 IMPORTANTE (MVP completo)

```
9.  [ ] Detalle de habitación con galería
10. [ ] Calendario de ocupación admin
11. [ ] Login/Registro
12. [ ] Portal cliente - mis reservas
13. [ ] Cambiar estado de reserva
14. [ ] Página del sauna
15. [ ] Página de contacto
```

### 🟢 DESEABLE (Nice to have)

```
16. [ ] Perfil de cliente editable
17. [ ] Gestión de habitaciones (CRUD)
18. [ ] Email real con Resend
19. [ ] Animaciones y microinteracciones
20. [ ] SEO completo (Schema.org)
21. [ ] Analytics (Google Analytics)
```

---

## 4. Dependencias entre Tareas

```
SETUP
  │
  ├─→ LAYOUT BASE
  │     │
  │     ├─→ HOME PAGE ─────────────────────┐
  │     │                                   │
  │     ├─→ HABITACIONES                   │
  │     │     │                            │
  │     │     └─→ DETALLE HABITACIÓN       │
  │     │                                   │
  │     └─→ OTRAS PÁGINAS (Sauna, Contact) │
  │                                         │
  ├─→ SUPABASE CONFIG                      │
  │     │                                   │
  │     ├─→ QUERIES HABITACIONES ──────────┤
  │     │                                   │
  │     ├─→ SISTEMA RESERVAS ◄─────────────┘
  │     │     │
  │     │     ├─→ VERIFICAR DISPONIBILIDAD
  │     │     │
  │     │     ├─→ CREAR RESERVA
  │     │     │
  │     │     └─→ CONFIRMACIÓN
  │     │
  │     └─→ AUTH ─────────────────────┐
  │           │                        │
  │           ├─→ LOGIN/REGISTRO       │
  │           │                        │
  │           ├─→ MIDDLEWARE ──────────┤
  │           │                        │
  │           ├─→ PORTAL CLIENTE ◄─────┤
  │           │                        │
  │           └─→ PANEL ADMIN ◄────────┘
  │                 │
  │                 ├─→ DASHBOARD
  │                 │
  │                 ├─→ GESTIÓN RESERVAS
  │                 │
  │                 └─→ CALENDARIO
  │
  └─→ DEPLOY
```

---

## 5. Estimaciones de Tiempo

### 5.1 Por Fase

| Fase | Tiempo Estimado | Tiempo Real* |
|------|-----------------|--------------|
| Setup | 2-3 horas | _____ |
| Frontend público | 4-5 horas | _____ |
| Sistema reservas | 5-6 horas | _____ |
| Panel admin | 4-5 horas | _____ |
| Auth + Cliente | 3-4 horas | _____ |
| Testing + Deploy | 2-3 horas | _____ |
| **TOTAL** | **20-26 horas** | _____ |

*Completar durante desarrollo

### 5.2 Por Componente Clave

| Componente | Complejidad | Estimación |
|------------|-------------|------------|
| Hero + Search | Media | 2h |
| Room Cards/List | Baja | 1.5h |
| Booking Wizard | Alta | 4h |
| Availability Check | Media | 1.5h |
| Admin Dashboard | Media | 2h |
| Reservations Table | Media | 2h |
| Occupancy Calendar | Alta | 2.5h |
| Auth Flow | Media | 2h |

### 5.3 Distribución Intensiva (1 día)

Si el objetivo es completar en 1 día intensivo (~12-14 horas):

```
Hora 0-2:    Setup completo
Hora 2-5:    Frontend público (Home, Habitaciones)
Hora 5-8:    Sistema de reservas
Hora 8-10:   Panel admin (Dashboard + Lista)
Hora 10-12:  Auth + Portal cliente básico
Hora 12-14:  Testing + Deploy + Ajustes
```

**Nota:** Esta distribución asume desarrollo continuo con experiencia en el stack.

---

## 6. Checklist de Funcionalidades MVP

### ✅ Páginas Públicas

```
[ ] Home Page
    [ ] Header responsive
    [ ] Hero con imagen de fondo
    [ ] Buscador de disponibilidad
    [ ] Preview de habitaciones (3 cards)
    [ ] Sección sauna destacada
    [ ] Lista de amenidades
    [ ] Footer con contacto

[ ] Habitaciones
    [ ] Lista de todas las habitaciones
    [ ] Cards con imagen, nombre, precio
    [ ] Botón ver detalles / reservar

[ ] Detalle Habitación
    [ ] Galería de imágenes
    [ ] Descripción completa
    [ ] Lista de amenidades
    [ ] Precio por noche
    [ ] Botón reservar

[ ] Sauna
    [ ] Descripción del servicio
    [ ] Beneficios
    [ ] Imágenes

[ ] Contacto
    [ ] Información de contacto
    [ ] Mapa (embed Google Maps)
    [ ] Formulario de contacto (opcional)
```

### ✅ Sistema de Reservas

```
[ ] Flujo de Reserva
    [ ] Paso 1: Selección de fechas
        [ ] Calendar picker
        [ ] Validación fechas (no pasadas, check-out > check-in)
        [ ] Mostrar número de noches
    [ ] Paso 2: Selección de habitación
        [ ] Mostrar solo disponibles
        [ ] Mostrar precio total
        [ ] Poder seleccionar una
    [ ] Paso 3: Datos del huésped
        [ ] Campos: nombre, email, teléfono, documento
        [ ] Validación en tiempo real
        [ ] Opción crear cuenta
    [ ] Paso 4: Resumen y confirmación
        [ ] Mostrar todos los datos
        [ ] Aceptar términos
        [ ] Botón confirmar

[ ] Confirmación
    [ ] Página de éxito
    [ ] Código de reserva visible
    [ ] Resumen de la reserva
    [ ] Opciones: crear cuenta, volver a inicio
```

### ✅ Panel Administrativo

```
[ ] Dashboard
    [ ] Stats: check-ins hoy, check-outs, pendientes, ocupación
    [ ] Lista de reservas del día
    [ ] Acceso rápido a secciones

[ ] Gestión de Reservas
    [ ] Tabla con todas las reservas
    [ ] Filtros: por estado, por fecha
    [ ] Búsqueda por código o nombre
    [ ] Ver detalle de reserva
    [ ] Cambiar estado (confirmar, cancelar)

[ ] Calendario de Ocupación
    [ ] Vista mensual
    [ ] Ver ocupación por habitación
    [ ] Identificar visualmente días ocupados/libres
```

### ✅ Portal Cliente

```
[ ] Autenticación
    [ ] Login con email/password
    [ ] Registro de cuenta
    [ ] Logout

[ ] Mis Reservas
    [ ] Lista de reservas propias
    [ ] Ver detalle de cada reserva
    [ ] Solicitar cancelación (según políticas)
```

### ✅ Técnico

```
[ ] Base de datos
    [ ] Tablas creadas (rooms, guests, reservations)
    [ ] RLS configurado
    [ ] Funciones (disponibilidad, código reserva)
    [ ] Datos seed insertados

[ ] SEO Básico
    [ ] Meta tags en cada página
    [ ] Open Graph para compartir
    [ ] Títulos descriptivos

[ ] Responsive
    [ ] Mobile (320px - 768px)
    [ ] Tablet (768px - 1024px)
    [ ] Desktop (1024px+)

[ ] Deploy
    [ ] Proyecto en Vercel
    [ ] Variables de entorno configuradas
    [ ] Dominio funcionando
    [ ] HTTPS activo
```

---

## 7. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Supabase RLS complejo | Media | Alto | Probar políticas temprano, simplificar si es necesario |
| Calendario ocupación complejo | Media | Medio | Usar librería existente o simplificar a lista |
| Tiempo insuficiente | Alta | Alto | Priorizar MVP estricto, cortar nice-to-have |
| Bugs en reservas | Media | Alto | Validar en cliente y servidor, testing exhaustivo |
| Imágenes lentas | Baja | Bajo | Usar next/image con optimización |

---

## 8. Recursos Útiles

### Documentación
- [Next.js 16 App Router](https://nextjs.org/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Componentes Recomendados
- Calendar: `react-day-picker` (ya incluido en shadcn)
- Forms: `react-hook-form` + `zod`
- Icons: `lucide-react`
- Date handling: `date-fns`

---

*Plan de desarrollo para Hotel Sauna Belén - Versión 1.0*
