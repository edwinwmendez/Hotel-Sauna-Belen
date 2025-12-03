# 📋 Plan de Desarrollo: Sistema de Venta de Productos
## Hotel Sauna Belén - Lista de Tareas Completa

**Fecha:** Diciembre 2025  
**Estado:** Listo para Desarrollo  
**Total de Tareas:** 68

---

## 📊 Resumen por Categorías

| Categoría | Tareas | Prioridad |
|-----------|--------|-----------|
| **Base de Datos** | 17 | 🔴 ALTA |
| **Validaciones** | 5 | 🔴 ALTA |
| **Server Actions** | 12 | 🔴 ALTA |
| **Queries** | 5 | 🟡 MEDIA |
| **Types** | 2 | 🟡 MEDIA |
| **Componentes POS** | 5 | 🔴 ALTA |
| **Componentes Online** | 4 | 🟢 BAJA |
| **Componentes Compartidos** | 3 | 🟡 MEDIA |
| **Páginas Admin** | 8 | 🔴 ALTA |
| **Páginas Públicas** | 4 | 🟢 BAJA |
| **Páginas Cliente** | 1 | 🟢 BAJA |
| **Integraciones** | 6 | 🟡 MEDIA |
| **UI/UX** | 5 | 🟡 MEDIA |
| **Testing** | 8 | 🟡 MEDIA |

---

## 🗄️ FASE 1: BASE DE DATOS (17 tareas)

### Migraciones SQL

#### Tareas DB-001 a DB-005: Tablas Principales
- [ ] **db-001**: Crear tabla `product_sales` con campos base
- [ ] **db-002**: Crear tabla `product_sale_items`
- [ ] **db-003**: Crear tabla `room_charges`
- [ ] **db-004**: Crear tabla `product_promotions`
- [ ] **db-005**: Crear tabla `product_sale_promotions`

#### Tareas DB-006 a DB-009: Modificaciones a Tablas Existentes
- [ ] **db-006**: Agregar campos de venta a `inventory_products`
  - `sale_price`, `is_for_sale`, `sale_price_online`
  - `is_available_online`, `image_url`, `description_public`
  - `tags`, `display_order`
- [ ] **db-007**: Agregar campos adicionales a `product_sales`
  - `source`, `discount_amount`, `discount_reason`
  - `customer_notes`, `delivery_status`, `delivery_room_id`
- [ ] **db-008**: Agregar `additional_charges` y `final_total` a `reservations`
- [ ] **db-009**: Agregar `sale_id` a `inventory_movements`

#### Tareas DB-010 a DB-012: Funciones y Triggers
- [ ] **db-010**: Crear función `generate_sale_code()`
- [ ] **db-011**: Crear trigger `trigger_set_sale_code`
- [ ] **db-012**: Crear función `process_product_sale()` mejorada

#### Tareas DB-013 a DB-017: Índices, RLS y Seed
- [ ] **db-013**: Crear índices de performance
- [ ] **db-014**: Configurar RLS para `product_sales`
- [ ] **db-015**: Configurar RLS para `room_charges`
- [ ] **db-016**: Configurar RLS para `product_promotions`
- [ ] **db-017**: Crear datos seed (marcar productos para venta)

**Archivo:** `supabase/migrations/004_product_sales_system.sql`

---

## ✅ FASE 2: VALIDACIONES (5 tareas)

### Schemas Zod

- [ ] **validations-001**: `SaleItemSchema` (productId, quantity, unitPrice)
- [ ] **validations-002**: `CreateSaleSchema` (venta completa)
- [ ] **validations-003**: `UpdateSaleSchema` (edición de ventas)
- [ ] **validations-004**: `RoomChargeSchema` (cargos a habitación)
- [ ] **validations-005**: `PromotionSchema` (promociones)

**Archivo:** `web/lib/validations/sales.ts`

---

## ⚙️ FASE 3: SERVER ACTIONS (12 tareas)

### Ventas (sales.ts)

- [ ] **actions-001**: `createSale()` - Crear venta completa
- [ ] **actions-002**: `getSaleById()` - Obtener venta por ID
- [ ] **actions-003**: `getSalesByReservation()` - Ventas de una reserva
- [ ] **actions-004**: `getSalesByDateRange()` - Para reportes
- [ ] **actions-005**: `updateSaleStatus()` - Actualizar estado
- [ ] **actions-006**: `cancelSale()` - Cancelar y revertir stock

### Cargos a Habitación (room-charges.ts)

- [ ] **actions-007**: `getRoomCharges()` - Obtener cargos pendientes
- [ ] **actions-008**: `markChargesAsPaid()` - Marcar como pagados
- [ ] **actions-009**: `createManualCharge()` - Crear cargo manual

### Promociones (promotions.ts)

- [ ] **actions-010**: `createPromotion()` - Crear promoción
- [ ] **actions-011**: `getActivePromotions()` - Obtener activas
- [ ] **actions-012**: `applyPromotionsToSale()` - Aplicar automáticas

**Archivos:**
- `web/lib/actions/sales.ts`
- `web/lib/actions/room-charges.ts`
- `web/lib/actions/promotions.ts`

---

## 📊 FASE 4: QUERIES (5 tareas)

### Reportes y Análisis

- [ ] **queries-001**: `getSalesReport()` - Reporte completo
- [ ] **queries-002**: `getTopProducts()` - Productos más vendidos
- [ ] **queries-003**: `getSalesByCategory()` - Por categoría
- [ ] **queries-004**: `getSalesBySource()` - POS vs Online
- [ ] **queries-005**: `getDailySalesStats()` - Estadísticas diarias

**Archivo:** `web/lib/queries/sales.ts`

---

## 📝 FASE 5: TYPES (2 tareas)

### TypeScript Types

- [ ] **types-001**: Actualizar `types/database.ts` con nuevas tablas
- [ ] **types-002**: Crear `types/sales.ts` con interfaces completas

**Archivos:**
- `web/types/database.ts` (actualizar)
- `web/types/sales.ts` (nuevo)

---

## 🎨 FASE 6: COMPONENTES POS (5 tareas)

### Componentes para Punto de Venta

- [ ] **components-pos-001**: `pos-client-search.tsx` - Búsqueda cliente/habitación
- [ ] **components-pos-002**: `pos-product-catalog.tsx` - Catálogo de productos
- [ ] **components-pos-003**: `pos-cart.tsx` - Carrito de compras
- [ ] **components-pos-004**: `pos-sale-form.tsx` - Formulario de venta
- [ ] **components-pos-005**: `pos-confirmation.tsx` - Confirmación de venta

**Directorio:** `web/components/sales/`

---

## 🌐 FASE 7: COMPONENTES ONLINE (4 tareas)

### Componentes para Tienda Online

- [ ] **components-online-001**: `online-product-card.tsx` - Card de producto
- [ ] **components-online-002**: `online-product-grid.tsx` - Grid de productos
- [ ] **components-online-003**: `online-cart-sidebar.tsx` - Sidebar de carrito
- [ ] **components-online-004**: `online-checkout-form.tsx` - Formulario checkout

**Directorio:** `web/components/sales/`

---

## 🔄 FASE 8: COMPONENTES COMPARTIDOS (3 tareas)

### Componentes Reutilizables

- [ ] **components-shared-001**: `sale-item-list.tsx` - Lista de items
- [ ] **components-shared-002**: `room-charges-list.tsx` - Lista de cargos
- [ ] **components-shared-003**: `promotion-banner.tsx` - Banner promociones

**Directorio:** `web/components/sales/`

---

## 🖥️ FASE 9: PÁGINAS ADMIN (8 tareas)

### Páginas Administrativas

- [ ] **pages-admin-001**: `/admin/ventas/page.tsx` - Dashboard de ventas
- [ ] **pages-admin-002**: `/admin/ventas/pos/page.tsx` - Página POS principal
- [ ] **pages-admin-003**: `/admin/ventas/[id]/page.tsx` - Detalle de venta
- [ ] **pages-admin-004**: `/admin/ventas/reportes/page.tsx` - Reportes
- [ ] **pages-admin-005**: `/admin/ventas/promociones/page.tsx` - CRUD promociones
- [ ] **pages-admin-006**: Actualizar `/admin/reservas/[id]/page.tsx` - Agregar sección cargos
- [ ] **pages-admin-007**: Actualizar `/admin/recepcion/page.tsx` - Botón venta rápida
- [ ] **pages-admin-008**: Actualizar `/admin/inventario/productos/[id]/page.tsx` - Campos de venta

**Directorio:** `web/app/admin/ventas/`

---

## 🌍 FASE 10: PÁGINAS PÚBLICAS (4 tareas)

### Tienda Online Pública

- [ ] **pages-public-001**: `/(public)/tienda/page.tsx` - Catálogo principal
- [ ] **pages-public-002**: `/(public)/tienda/[id]/page.tsx` - Detalle producto
- [ ] **pages-public-003**: `/(public)/tienda/carrito/page.tsx` - Carrito
- [ ] **pages-public-004**: `/(public)/tienda/checkout/page.tsx` - Checkout

**Directorio:** `web/app/(public)/tienda/`

---

## 👤 FASE 11: PÁGINAS CLIENTE (1 tarea)

### Portal del Cliente

- [ ] **pages-client-001**: `/(cliente)/mis-compras/page.tsx` - Historial de compras

**Directorio:** `web/app/(cliente)/mis-compras/`

---

## 🔗 FASE 12: INTEGRACIONES (6 tareas)

### Integraciones con Sistema Existente

- [ ] **integration-001**: Integrar POS con check-in (oferta rápida)
- [ ] **integration-002**: Integrar cargos en check-out (mostrar consolidado)
- [ ] **integration-003**: Actualizar función check-out (marcar cargos pagados)
- [ ] **integration-004**: Agregar enlace tienda en header/footer
- [ ] **integration-005**: Email de confirmación para ventas online
- [ ] **integration-006**: Notificación recepción para pedidos pendientes

---

## 🎨 FASE 13: UI/UX (5 tareas)

### Mejoras de Interfaz

- [ ] **ui-ux-001**: Aplicar estilos consistentes (design system)
- [ ] **ui-ux-002**: Implementar responsive design (tablet/mobile)
- [ ] **ui-ux-003**: Agregar loading states y error handling
- [ ] **ui-ux-004**: Implementar toast notifications (sonner)
- [ ] **ui-ux-005**: Agregar confirmaciones modales

---

## 🧪 FASE 14: TESTING (8 tareas)

### Pruebas y Validación

- [ ] **testing-001**: Probar flujo completo POS
- [ ] **testing-002**: Probar flujo carga a cuenta
- [ ] **testing-003**: Probar flujo venta online
- [ ] **testing-004**: Probar validaciones (stock, reservas, datos)
- [ ] **testing-005**: Probar sistema de promociones
- [ ] **testing-006**: Probar reportes (generación, filtros)
- [ ] **testing-007**: Probar RLS (permisos admin/cliente)
- [ ] **testing-008**: Probar integración completa end-to-end

---

## 📅 Orden de Implementación Recomendado

### Sprint 1: Base Sólida (Días 1-3)
1. ✅ FASE 1: Base de Datos (17 tareas)
2. ✅ FASE 2: Validaciones (5 tareas)
3. ✅ FASE 5: Types (2 tareas)

### Sprint 2: Backend Completo (Días 4-5)
4. ✅ FASE 3: Server Actions (12 tareas)
5. ✅ FASE 4: Queries (5 tareas)

### Sprint 3: POS Funcional (Días 6-8)
6. ✅ FASE 6: Componentes POS (5 tareas)
7. ✅ FASE 9: Páginas Admin POS (3 tareas: 001, 002, 003)
8. ✅ FASE 12: Integraciones básicas (001, 002, 003)
9. ✅ FASE 13: UI/UX básico (001, 002, 003)

### Sprint 4: Reportes y Cargos (Días 9-10)
10. ✅ FASE 9: Páginas Admin restantes (004, 006, 007, 008)
11. ✅ FASE 8: Componentes compartidos (001, 002)

### Sprint 5: Tienda Online (Días 11-15)
12. ✅ FASE 7: Componentes Online (4 tareas)
13. ✅ FASE 10: Páginas Públicas (4 tareas)
14. ✅ FASE 11: Páginas Cliente (1 tarea)
15. ✅ FASE 12: Integraciones online (004, 005, 006)

### Sprint 6: Promociones y Pulido (Días 16-17)
16. ✅ FASE 9: Promociones (005)
17. ✅ FASE 8: Banner promociones (003)
18. ✅ FASE 13: UI/UX completo (004, 005)

### Sprint 7: Testing Final (Días 18-19)
19. ✅ FASE 14: Testing completo (8 tareas)

---

## 📝 Notas de Implementación

### Consideraciones Técnicas

1. **Mantener consistencia con código existente:**
   - Seguir estructura de `lib/actions/reservations.ts`
   - Usar mismo patrón de validaciones con Zod
   - Mantener estilo de componentes UI

2. **Design System:**
   - Usar colores del tema (navy, gold, cream)
   - Seguir componentes shadcn/ui existentes
   - Mantener responsive design patterns

3. **Base de Datos:**
   - Todas las migraciones en un solo archivo SQL
   - Probar migraciones en desarrollo primero
   - Backup antes de aplicar en producción

4. **Testing:**
   - Probar cada flujo completo
   - Validar edge cases (stock 0, reserva cancelada, etc.)
   - Verificar permisos RLS

### Dependencias entre Tareas

- **FASE 1** debe completarse antes de cualquier otra
- **FASE 2** y **FASE 5** son necesarias para **FASE 3**
- **FASE 3** es necesaria para **FASE 6** y **FASE 7**
- **FASE 6** es necesaria para **FASE 9** (POS)
- **FASE 7** es necesaria para **FASE 10**

---

## ✅ Checklist de Finalización

Al completar todas las tareas, verificar:

- [ ] Todas las migraciones SQL aplicadas
- [ ] RLS configurado y probado
- [ ] Server Actions funcionando
- [ ] POS operativo en recepción
- [ ] Tienda online funcional
- [ ] Reportes generando correctamente
- [ ] Integraciones con recepción funcionando
- [ ] Testing completo pasado
- [ ] Documentación actualizada
- [ ] Capacitación al personal realizada

---

*Plan de Desarrollo - Sistema de Venta de Productos - Hotel Sauna Belén*

