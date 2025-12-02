# Product Requirements Document (PRD)
## Hotel Sauna Belén - Plataforma Web de Reservas

**Versión:** 1.0  
**Fecha:** Diciembre 2025  
**Autor:** Edwin Mendez - CTO  
**Cliente:** Hotel Sauna Belén  

---

## 1. Resumen Ejecutivo

### 1.1 Descripción del Proyecto
Desarrollo de una plataforma web moderna para Hotel Sauna Belén, un hotel 3 estrellas ubicado en Moquegua, Perú. La plataforma permitirá a los clientes realizar reservas online 24/7 y al hotel gestionar su ocupación de manera eficiente.

### 1.2 Problema a Resolver
- **Baja visibilidad digital:** El hotel no aparece en búsquedas de Google
- **Sistema de reservas obsoleto:** Solo acepta reservas telefónicas, perdiendo clientes potenciales
- **Diferenciador desaprovechado:** El servicio de sauna privado no se comunica efectivamente

### 1.3 Solución Propuesta
Plataforma web con sistema de reservas online que incluye:
- Catálogo visual de habitaciones
- Reservas 24/7 con calendario de disponibilidad
- Panel administrativo para gestión de reservas
- Portal de cliente para seguimiento de reservas

---

## 2. Objetivos de Negocio

| Objetivo | Métrica | Meta |
|----------|---------|------|
| Aumentar reservas online | % de reservas digitales | 40% en 6 meses |
| Reducir carga operativa | Llamadas de reserva | -50% |
| Mejorar visibilidad | Posición en Google | Top 5 "hotel Moquegua" |
| Promocionar diferenciador | Menciones de sauna | 80% de visitantes |

---

## 3. Usuarios Objetivo

### 3.1 Persona 1: Cliente - "María Turista"

- **Edad:** 28-45 años
- **Perfil:** Profesional que viaja por trabajo o turismo
- **Necesidades:** Reservar rápido, ver fotos, confirmar disponibilidad
- **Frustraciones:** Llamar para reservar, incertidumbre de disponibilidad
- **Dispositivo:** 70% móvil, 30% desktop

### 3.2 Persona 2: Administrador - "Carlos Recepcionista"
- **Edad:** 25-50 años
- **Perfil:** Personal del hotel encargado de reservas
- **Necesidades:** Ver calendario de ocupación, gestionar reservas, contactar clientes
- **Frustraciones:** Gestión manual en cuadernos, doble booking
- **Dispositivo:** 80% desktop, 20% tablet

---

## 4. Funcionalidades Core (MVP)

### 4.1 Módulo Público (Sin autenticación)

| ID | Funcionalidad | Prioridad | Descripción |
|----|---------------|-----------|-------------|
| F01 | Home Page | Alta | Landing con información del hotel, galería y CTA de reserva |
| F02 | Catálogo de Habitaciones | Alta | Lista de habitaciones con fotos, amenidades y precios |
| F03 | Detalle de Habitación | Alta | Página individual con galería completa y botón reservar |
| F04 | Página de Sauna | Media | Información del servicio diferenciador |
| F05 | Página de Contacto | Media | Formulario, mapa, datos de contacto |
| F06 | Buscador de Disponibilidad | Alta | Widget para verificar fechas disponibles |

### 4.2 Módulo de Reservas (Requiere datos de cliente)

| ID | Funcionalidad | Prioridad | Descripción |
|----|---------------|-----------|-------------|
| F07 | Flujo de Reserva | Alta | Wizard: fechas → habitación → datos → confirmación |
| F08 | Calendario de Disponibilidad | Alta | Visualización de fechas disponibles/ocupadas |
| F09 | Cálculo de Precio | Alta | Precio total según noches y tipo de habitación |
| F10 | Confirmación de Reserva | Alta | Resumen + envío de confirmación (email/WhatsApp) |
| F11 | Registro de Cliente | Alta | Crear cuenta para gestionar reservas |
| F12 | Login de Cliente | Alta | Acceso a portal de cliente |

### 4.3 Módulo Portal Cliente (Autenticado)

| ID | Funcionalidad | Prioridad | Descripción |
|----|---------------|-----------|-------------|
| F13 | Dashboard Cliente | Media | Resumen de reservas activas y pasadas |
| F14 | Detalle de Reserva | Media | Ver información completa de una reserva |
| F15 | Cancelar Reserva | Media | Solicitar cancelación según políticas |
| F16 | Historial de Reservas | Baja | Lista de todas las reservas realizadas |

### 4.4 Módulo Administrativo (Solo staff)

| ID | Funcionalidad | Prioridad | Descripción |
|----|---------------|-----------|-------------|
| F17 | Dashboard Admin | Alta | Resumen de ocupación, reservas del día, métricas |
| F18 | Lista de Reservas | Alta | Tabla con todas las reservas, filtros y búsqueda |
| F19 | Calendario de Ocupación | Alta | Vista mensual de ocupación por habitación |
| F20 | Gestión de Reserva | Alta | Ver, confirmar, cancelar reservas |
| F21 | Gestión de Habitaciones | Media | CRUD de habitaciones y precios |

---

## 5. User Stories

### 5.1 Como Cliente

```
US01: Como cliente, quiero ver las habitaciones disponibles con fotos y precios 
      para elegir la que mejor se adapte a mis necesidades.
      
US02: Como cliente, quiero seleccionar fechas de check-in y check-out 
      para verificar disponibilidad antes de reservar.
      
US03: Como cliente, quiero completar una reserva online 
      para no tener que llamar por teléfono.
      
US04: Como cliente, quiero recibir confirmación de mi reserva 
      para tener seguridad de que mi habitación está apartada.
      
US05: Como cliente, quiero crear una cuenta 
      para ver y gestionar mis reservas fácilmente.
      
US06: Como cliente, quiero cancelar mi reserva online 
      para no tener que llamar si cambian mis planes.
      
US07: Como cliente, quiero conocer los beneficios del sauna 
      para decidir si este hotel es mejor que otros.
```

### 5.2 Como Administrador

```
US08: Como administrador, quiero ver todas las reservas del día 
      para preparar las habitaciones correspondientes.
      
US09: Como administrador, quiero ver un calendario de ocupación 
      para saber qué habitaciones están disponibles en cada fecha.
      
US10: Como administrador, quiero confirmar o rechazar reservas 
      para gestionar la disponibilidad real del hotel.
      
US11: Como administrador, quiero ver los datos de contacto del cliente 
      para comunicarme si hay algún problema con su reserva.
      
US12: Como administrador, quiero actualizar precios de habitaciones 
      para ajustar según temporada o demanda.
```

---

## 6. Casos de Uso Detallados

### CU01: Realizar Reserva Online

**Actor Principal:** Cliente  
**Precondiciones:** Habitación disponible en fechas solicitadas  
**Postcondiciones:** Reserva creada y confirmación enviada  

**Flujo Principal:**
1. Cliente accede a la página de reservas
2. Sistema muestra buscador de disponibilidad
3. Cliente selecciona fechas de check-in y check-out
4. Sistema muestra habitaciones disponibles con precios
5. Cliente selecciona tipo de habitación
6. Sistema muestra formulario de datos personales
7. Cliente completa: nombre, email, teléfono, documento
8. Sistema muestra resumen con precio total
9. Cliente confirma la reserva
10. Sistema crea la reserva con estado "Pendiente"
11. Sistema envía confirmación por email
12. Sistema muestra página de confirmación con código de reserva

**Flujos Alternativos:**
- 4a. No hay disponibilidad: Sistema sugiere fechas alternativas
- 7a. Cliente ya tiene cuenta: Sistema permite login para autocompletar datos
- 9a. Cliente cancela: Sistema descarta la reserva temporal

### CU02: Gestionar Reserva (Admin)

**Actor Principal:** Administrador  
**Precondiciones:** Admin autenticado  

**Flujo Principal:**
1. Admin accede al panel administrativo
2. Sistema muestra dashboard con reservas pendientes
3. Admin selecciona una reserva
4. Sistema muestra detalles completos
5. Admin puede: confirmar, rechazar, o contactar cliente
6. Sistema actualiza estado y notifica al cliente

---

## 7. Criterios de Aceptación

### CA01: Búsqueda de Disponibilidad
- [ ] El buscador muestra calendario para seleccionar fechas
- [ ] No permite seleccionar fechas pasadas
- [ ] Check-out debe ser posterior a check-in
- [ ] Muestra solo habitaciones disponibles en el rango
- [ ] Calcula correctamente el número de noches

### CA02: Proceso de Reserva
- [ ] Formulario valida campos obligatorios (nombre, email, teléfono, DNI)
- [ ] Email tiene formato válido
- [ ] Teléfono acepta formato peruano (9 dígitos)
- [ ] DNI acepta 8 dígitos
- [ ] Muestra resumen antes de confirmar
- [ ] Precio total = precio/noche × número de noches
- [ ] Genera código único de reserva (formato: HSB-YYYYMMDD-XXXX)

### CA03: Confirmación de Reserva
- [ ] Muestra página de éxito con código de reserva
- [ ] Envía email de confirmación (o simula en MVP)
- [ ] Email incluye: código, fechas, habitación, precio, datos del hotel
- [ ] Ofrece opción de crear cuenta o continuar como invitado

### CA04: Panel Administrativo
- [ ] Solo accesible con credenciales de admin
- [ ] Dashboard muestra: reservas hoy, check-ins, check-outs, ocupación
- [ ] Lista de reservas permite filtrar por: estado, fecha, habitación
- [ ] Calendario muestra ocupación visual por habitación
- [ ] Permite cambiar estado de reserva

### CA05: Portal Cliente
- [ ] Cliente puede registrarse con email y contraseña
- [ ] Cliente puede ver sus reservas activas
- [ ] Cliente puede ver historial de reservas
- [ ] Cliente puede solicitar cancelación

---

## 8. Requisitos No Funcionales

### 8.1 Performance
- Tiempo de carga inicial: < 3 segundos
- Tiempo de respuesta de APIs: < 500ms
- Lighthouse Performance Score: > 80

### 8.2 Seguridad
- Autenticación segura con Supabase Auth
- Protección de rutas administrativas
- Validación de datos en cliente y servidor
- HTTPS obligatorio en producción

### 8.3 SEO
- Meta tags optimizados para cada página
- Open Graph para compartir en redes
- Sitemap.xml generado automáticamente
- URLs amigables y descriptivas
- Schema.org markup para hotel

### 8.4 Accesibilidad
- WCAG 2.1 nivel AA
- Navegación por teclado
- Contraste de colores adecuado
- Alt text en imágenes
- Labels en formularios

### 8.5 Compatibilidad
- Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- Dispositivos: Desktop, Tablet, Mobile
- Resoluciones: 320px - 1920px

### 8.6 Disponibilidad
- Uptime objetivo: 99.5%
- Hosting en Vercel (CDN global)
- Base de datos en Supabase (alta disponibilidad)

---

## 9. Fuera de Alcance (MVP)

Las siguientes funcionalidades NO se incluyen en esta versión:

- ❌ Pagos online reales (solo simulación)
- ❌ Sistema de reviews/calificaciones
- ❌ Multi-idioma (solo español)
- ❌ Programa de fidelidad/puntos
- ❌ Integración con booking.com/Expedia
- ❌ Chat en vivo
- ❌ Notificaciones push
- ❌ App móvil nativa

---

## 10. Métricas de Éxito

| KPI | Baseline | Meta MVP | Medición |
|-----|----------|----------|----------|
| Reservas online/mes | 0 | 10+ | Supabase Analytics |
| Tasa de conversión | N/A | 3%+ | Visitas → Reservas |
| Tiempo en sitio | N/A | 2+ min | Google Analytics |
| Bounce rate | N/A | < 50% | Google Analytics |
| Satisfacción admin | N/A | 4/5+ | Feedback directo |

---

## 11. Stakeholders

| Rol | Nombre | Responsabilidad |
|-----|--------|-----------------|
| Product Owner | Hotel Sauna Belén | Requisitos, validación, feedback |
| CTO/Developer | Edwin Mendez | Desarrollo, arquitectura, deployment |
| Evaluador | Profesora Universidad | Evaluación académica del prototipo |

---

## 12. Timeline

| Fase | Duración | Entregable |
|------|----------|------------|
| Documentación | Día 1 | PRD, Tech Spec, Design Guide |
| Setup + Base | Día 1-2 | Proyecto, DB, Auth |
| Frontend Público | Día 2-3 | Home, Habitaciones, Sauna |
| Sistema Reservas | Día 3-4 | Flujo completo de reserva |
| Panel Admin | Día 4-5 | Dashboard, gestión reservas |
| Portal Cliente | Día 5 | Login, mis reservas |
| Testing + Deploy | Día 6 | QA, producción, demo |

---

*Documento generado para evaluación académica - Hotel Sauna Belén*
