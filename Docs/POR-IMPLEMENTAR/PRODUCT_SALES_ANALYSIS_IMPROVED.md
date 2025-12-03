# Análisis Mejorado: Sistema de Venta de Productos al Público
## Hotel Sauna Belén - Propuesta Refinada y Completa

**Versión:** 2.0  
**Fecha:** Diciembre 2025  
**Autor:** Análisis Técnico Mejorado  
**Estado:** Propuesta Refinada - Lista para Implementación

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Validación de Investigación Previa](#2-validación-de-investigación-previa)
3. [Mejoras y Refinamientos Propuestos](#3-mejoras-y-refinamientos-propuestos)
4. [Integración con Sistema de Recepción](#4-integración-con-sistema-de-recepción)
5. [Venta Online de Productos](#5-venta-online-de-productos)
6. [Arquitectura Técnica Mejorada](#6-arquitectura-técnica-mejorada)
7. [Flujos de Negocio Completos](#7-flujos-de-negocio-completos)
8. [Plan de Implementación Priorizado](#8-plan-de-implementación-priorizado)

---

## 1. Resumen Ejecutivo

### 1.1 Situación Actual (Validada)

✅ **Confirmado:** El análisis previo identificó correctamente:
- Registro manual en cuaderno (ineficiente)
- Falta de trazabilidad
- Control de inventario deficiente
- Facturación compleja
- Sin análisis de ventas

### 1.2 Solución Propuesta (Mejorada)

La propuesta original es **sólida y completa**. Este documento agrega:

1. ✅ **Refinamientos técnicos** basados en mejores prácticas de la industria
2. ✅ **Integración con sistema de recepción** (check-in/check-out)
3. ✅ **Módulo de venta online** para clientes
4. ✅ **Mejoras en UX/UI** para el personal
5. ✅ **Optimizaciones de base de datos** y performance
6. ✅ **Consideraciones de seguridad** adicionales

---

## 2. Validación de Investigación Previa

### 2.1 ✅ Arquitectura Propuesta (Validada)

La arquitectura propuesta en `PRODUCT_SALES_ANALYSIS.md` es **correcta y completa**:

- ✅ Separación de módulos (POS, Facturación, Reportes)
- ✅ Integración con inventario existente
- ✅ Integración con reservas
- ✅ Tablas bien diseñadas (`product_sales`, `product_sale_items`, `room_charges`)

### 2.2 ✅ Flujos de Negocio (Validados)

Los flujos propuestos son **adecuados**:
- ✅ Venta directa (pago inmediato)
- ✅ Carga a cuenta de habitación
- ✅ Check-out con cargos consolidados

### 2.3 🔄 Mejoras Identificadas

**Áreas de mejora detectadas:**

1. **Venta Online:** No contemplada en análisis original
2. **Integración con Recepción:** No conectada con flujos de check-in/check-out
3. **Gestión de Precios:** Falta estrategia de precios dinámicos
4. **Notificaciones:** No hay alertas automáticas
5. **Reportes Avanzados:** Se pueden mejorar con más métricas

---

## 3. Mejoras y Refinamientos Propuestos

### 3.1 Mejoras en Base de Datos

#### 3.1.1 Campos Adicionales en `inventory_products`

```sql
-- Agregar campos para venta (mejora del análisis original)
ALTER TABLE public.inventory_products
ADD COLUMN sale_price DECIMAL(10,2), -- Precio de venta al público
ADD COLUMN is_for_sale BOOLEAN DEFAULT false, -- ¿Se vende al público?
ADD COLUMN sale_price_online DECIMAL(10,2), -- Precio especial para venta online (opcional)
ADD COLUMN is_available_online BOOLEAN DEFAULT false, -- ¿Disponible en tienda online?
ADD COLUMN image_url TEXT, -- Imagen del producto para catálogo
ADD COLUMN description_public TEXT, -- Descripción para clientes
ADD COLUMN tags TEXT[], -- Tags para búsqueda: ['bebidas', 'snacks', 'higiene']
ADD COLUMN display_order INTEGER DEFAULT 0; -- Orden de visualización en catálogo
```

**Justificación:**
- `sale_price_online`: Permite precios diferenciados (descuentos online)
- `is_available_online`: Control granular de qué productos se muestran online
- `image_url`: Necesario para catálogo visual
- `tags`: Facilita búsqueda y categorización
- `display_order`: Control de orden en catálogo

#### 3.1.2 Mejoras en `product_sales`

```sql
-- Agregar campos adicionales
ALTER TABLE public.product_sales
ADD COLUMN source VARCHAR(20) DEFAULT 'pos' 
    CHECK (source IN ('pos', 'online', 'mobile_app')), -- Origen de la venta
ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0, -- Descuentos aplicados
ADD COLUMN discount_reason TEXT, -- Razón del descuento
ADD COLUMN customer_notes TEXT, -- Notas del cliente (solo para ventas online)
ADD COLUMN delivery_status VARCHAR(20), -- 'pending', 'preparing', 'delivered' (solo online)
ADD COLUMN delivery_room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL; -- Habitación de entrega
```

**Justificación:**
- `source`: Trazabilidad de canal de venta
- `discount_amount`: Gestión de promociones
- `delivery_status`: Para ventas online con entrega a habitación

#### 3.1.3 Nueva Tabla: `product_promotions`

```sql
-- Gestión de promociones y descuentos
CREATE TABLE public.product_promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'buy_x_get_y')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    applicable_products UUID[] DEFAULT '{}', -- Array de product_ids (vacío = todos)
    applicable_categories UUID[] DEFAULT '{}', -- Array de category_ids
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    max_uses_per_customer INTEGER, -- Límite de usos por cliente
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_promotions_active ON public.product_promotions(is_active, start_date, end_date)
    WHERE is_active = true;
```

**Justificación:**
- Permite promociones tipo "2x1", descuentos por categoría, etc.
- Facilita marketing y aumento de ventas

#### 3.1.4 Nueva Tabla: `product_sale_promotions`

```sql
-- Relación entre ventas y promociones aplicadas
CREATE TABLE public.product_sale_promotions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID REFERENCES public.product_sales(id) ON DELETE CASCADE NOT NULL,
    promotion_id UUID REFERENCES public.product_promotions(id) ON DELETE RESTRICT NOT NULL,
    discount_applied DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(sale_id, promotion_id)
);
```

### 3.2 Mejoras en Funciones SQL

#### 3.2.1 Función Mejorada: `process_product_sale`

```sql
-- Versión mejorada que incluye promociones y validaciones adicionales
CREATE OR REPLACE FUNCTION process_product_sale(
    p_sale_id UUID,
    p_apply_promotions BOOLEAN DEFAULT true
)
RETURNS JSONB AS $$
DECLARE
    sale_record RECORD;
    item_record RECORD;
    movement_id UUID;
    total_discount DECIMAL(10,2) := 0;
    promotion_applied JSONB := '[]'::jsonb;
    final_total DECIMAL(10,2);
BEGIN
    -- Obtener información de la venta
    SELECT * INTO sale_record
    FROM public.product_sales
    WHERE id = p_sale_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Venta no encontrada');
    END IF;
    
    -- Aplicar promociones si está habilitado
    IF p_apply_promotions THEN
        -- Lógica de aplicación de promociones
        -- (ver sección de promociones más abajo)
    END IF;
    
    -- Si es venta directa (pago inmediato), no crear cargo
    -- Si es carga a habitación, crear cargo
    IF sale_record.sale_type = 'room_charge' THEN
        -- Validar que la reserva esté activa
        IF NOT EXISTS (
            SELECT 1 FROM public.reservations 
            WHERE id = sale_record.reservation_id 
            AND status IN ('confirmed', 'checked-in')
        ) THEN
            RETURN jsonb_build_object('error', 'Reserva no está activa');
        END IF;
        
        INSERT INTO public.room_charges (
            reservation_id,
            charge_type,
            description,
            amount,
            sale_id,
            status
        ) VALUES (
            sale_record.reservation_id,
            'product_sale',
            'Productos vendidos - ' || sale_record.sale_code,
            sale_record.total - total_discount,
            p_sale_id,
            'pending'
        );
        
        -- Actualizar additional_charges en reserva
        UPDATE public.reservations
        SET additional_charges = COALESCE(additional_charges, 0) + (sale_record.total - total_discount)
        WHERE id = sale_record.reservation_id;
    END IF;
    
    -- Para cada item, crear movimiento de inventario
    FOR item_record IN 
        SELECT * FROM public.product_sale_items WHERE sale_id = p_sale_id
    LOOP
        -- Validar stock disponible
        IF NOT EXISTS (
            SELECT 1 FROM public.inventory_products
            WHERE id = item_record.product_id
            AND current_stock >= item_record.quantity
        ) THEN
            RETURN jsonb_build_object('error', 'Stock insuficiente para producto: ' || item_record.product_id);
        END IF;
        
        -- Crear movimiento de salida
        INSERT INTO public.inventory_movements (
            product_id,
            movement_type,
            quantity,
            reason,
            room_id,
            reservation_id,
            sale_id,
            created_by
        ) VALUES (
            item_record.product_id,
            'salida',
            item_record.quantity,
            CASE 
                WHEN sale_record.sale_type = 'direct' THEN 'venta_directa'
                WHEN sale_record.source = 'online' THEN 'venta_online'
                ELSE 'venta_habitacion'
            END,
            sale_record.room_id,
            sale_record.reservation_id,
            p_sale_id,
            sale_record.created_by
        ) RETURNING id INTO movement_id;
        
        -- Actualizar referencia en sale_item
        UPDATE public.product_sale_items
        SET movement_id = movement_id
        WHERE id = item_record.id;
    END LOOP;
    
    -- Actualizar total de la venta con descuentos
    final_total := sale_record.total - total_discount;
    UPDATE public.product_sales
    SET total = final_total,
        discount_amount = total_discount
    WHERE id = p_sale_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'sale_id', p_sale_id,
        'total', final_total,
        'discount_applied', total_discount,
        'promotions', promotion_applied
    );
END;
$$ LANGUAGE plpgsql;
```

### 3.3 Mejoras en Seguridad

#### 3.3.1 RLS Mejorado

```sql
-- RLS para product_sales (mejorado)
ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;

-- Admin puede ver todas las ventas
CREATE POLICY "Admin views all product sales"
    ON public.product_sales FOR SELECT TO authenticated
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Admin puede crear ventas
CREATE POLICY "Admin creates product sales"
    ON public.product_sales FOR INSERT TO authenticated
    WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Clientes pueden ver sus propias ventas online
CREATE POLICY "Customers view own online sales"
    ON public.product_sales FOR SELECT TO authenticated
    USING (
        source = 'online' 
        AND guest_id IN (
            SELECT id FROM public.guests WHERE user_id = auth.uid()
        )
    );

-- RLS para room_charges (mejorado)
ALTER TABLE public.room_charges ENABLE ROW LEVEL SECURITY;

-- Admin gestiona todos los cargos
CREATE POLICY "Admin manages room charges"
    ON public.room_charges FOR ALL TO authenticated
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Clientes pueden ver cargos de sus reservas
CREATE POLICY "Customers view own room charges"
    ON public.room_charges FOR SELECT TO authenticated
    USING (
        reservation_id IN (
            SELECT r.id FROM public.reservations r
            JOIN public.guests g ON r.guest_id = g.id
            WHERE g.user_id = auth.uid()
        )
    );
```

---

## 4. Integración con Sistema de Recepción

### 4.1 Flujo Integrado: Check-in + Venta de Productos

```
┌─────────────────────────────────────────────────────────┐
│  CHECK-IN DE CLIENTE                                     │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│  Recepcionista realiza check-in                          │
│  Sistema marca habitación como ocupada                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│  ¿Cliente quiere comprar productos ahora?                │
│  [Sí] [No]                                               │
└────────────────────────────┬────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
            [Sí]                [No]
                    │                 │
                    │                 └──→ [Continuar check-in normal]
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  ABRIR POS PRE-CONFIGURADO                               │
│  - Habitación ya seleccionada                            │
│  - Reserva ya vinculada                                  │
│  - Modo: "Cargar a Habitación" activado                  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│  Cliente selecciona productos                            │
│  Sistema muestra total                                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│  [Procesar Venta]                                        │
│  Sistema:                                                │
│  ✅ Registra venta                                        │
│  ✅ Crea cargo en room_charges                           │
│  ✅ Actualiza additional_charges en reserva              │
│  ✅ Descuenta stock                                      │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│  ✅ Check-in + Venta completados                        │
│  Cliente recibe productos + llaves                      │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Flujo Integrado: Check-out con Cargos

```
┌─────────────────────────────────────────────────────────┐
│  CHECK-OUT DE CLIENTE                                    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│  Sistema muestra resumen completo:                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ ESTANCIA                                         │   │
│  │ • 2 noches × S/ 250 = S/ 500                    │   │
│  │                                                  │   │
│  │ CARGOS ADICIONALES                              │   │
│  │ • Productos (15 Dic): S/ 25                     │   │
│  │ • Productos (16 Dic): S/ 15                     │   │
│  │ • Servicio extra: S/ 10                         │   │
│  │                                                  │   │
│  │ ──────────────────────────────────────────────  │   │
│  │ TOTAL: S/ 550                                    │   │
│  │ Pagado: S/ 500                                   │   │
│  │ PENDIENTE: S/ 50                                 │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│  Cliente revisa y confirma                              │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│  Cliente paga total pendiente                           │
│  Sistema:                                                │
│  ✅ Marca cargos como 'paid'                            │
│  ✅ Marca ventas relacionadas como 'paid'                │
│  ✅ Libera habitación                                    │
│  ✅ Cambia estado de reserva a 'completed'              │
│  ✅ Genera factura/comprobante consolidado               │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Acciones Rápidas en Recepción

**En el dashboard de recepción (`/admin/recepcion`):**

```
┌─────────────────────────────────────────────────────────┐
│  🏨 RECEPCIÓN - Hotel Sauna Belén                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ⚡ ACCIONES RÁPIDAS                                    │
│                                                          │
│  [🔍 Check-in de Reserva]                               │
│  [➕ Cliente Walk-in]                                    │
│  [🚪 Check-out]                                         │
│  [🛒 Venta de Productos]  ← NUEVO                      │
│  [👥 Buscar Cliente]                                    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Botón "Venta de Productos" abre:**
- POS con búsqueda rápida de habitación/reserva
- Pre-configurado para carga a habitación si hay reserva activa
- Opción de cambio a "pago inmediato" si el cliente prefiere

---

## 5. Venta Online de Productos

### 5.1 Casos de Uso

1. **Pre-compra antes de llegar:**
   - Cliente compra productos antes de su estadía
   - Se entregan al hacer check-in
   - Se cargan a la reserva o se pagan por adelantado

2. **Compra durante la estadía:**
   - Cliente desde su habitación (móvil/tablet)
   - Selecciona productos
   - Opción: "Entregar a mi habitación"
   - Se carga a cuenta o pago online

3. **Compra sin hospedaje:**
   - Cliente no hospedado compra productos
   - Retiro en recepción o entrega (si aplica)

### 5.2 Estructura de Venta Online

#### 5.2.1 Nueva Ruta: `/tienda` (Pública)

```
┌─────────────────────────────────────────────────────────┐
│  🛒 TIENDA - Hotel Sauna Belén                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Buscar productos...]                                  │
│                                                          │
│  CATEGORÍAS:                                            │
│  [Bebidas] [Snacks] [Higiene] [Otros]                  │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ [Imagen] │  │ [Imagen] │  │ [Imagen] │             │
│  │ Gaseosa  │  │ Agua     │  │ Shampoo  │             │
│  │ S/ 3.00  │  │ S/ 2.00  │  │ S/ 5.00  │             │
│  │ [Agregar]│  │ [Agregar]│  │ [Agregar]│             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 🛒 Carrito (3 items)                              │ │
│  │ • Gaseosa x2 = S/ 6.00                            │ │
│  │ • Agua x1 = S/ 2.00                                │ │
│  │ • Shampoo x1 = S/ 5.00                             │ │
│  │ ────────────────────────────────────────────────    │ │
│  │ Total: S/ 13.00                                    │ │
│  │                                                    │ │
│  │ ¿Tienes reserva activa?                           │ │
│  │ [Sí, cargar a mi cuenta] [No, pagar ahora]        │ │
│  │                                                    │ │
│  │ [Continuar compra]                                 │ │
│  └──────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 5.2.2 Flujo de Compra Online

```
1. Cliente navega a /tienda
   ↓
2. Cliente selecciona productos
   ↓
3. Cliente hace click en "Continuar compra"
   ↓
4. Sistema pregunta:
   - ¿Tienes reserva activa? [Sí] [No]
   ↓
   CASO A: Tiene reserva activa
   ├─→ Sistema busca reserva por user_id
   ├─→ Muestra opciones:
   │   • Cargar a cuenta (pagar al check-out)
   │   • Pagar ahora (descuento 5%)
   └─→ Cliente elige
   
   CASO B: No tiene reserva
   ├─→ Opciones:
   │   • Pagar ahora (retiro en recepción)
   │   • Crear cuenta y pagar
   └─→ Cliente elige
   ↓
5. Cliente completa checkout:
   - Si pago inmediato: Procesa pago (Stripe/PayPal)
   - Si carga a cuenta: Vincula a reserva
   ↓
6. Sistema:
   ✅ Crea venta (source = 'online')
   ✅ Si carga a cuenta: Crea room_charge
   ✅ Si pago inmediato: Marca como 'paid'
   ✅ Descuenta stock
   ✅ Envía confirmación por email
   ↓
7. Si entrega a habitación:
   - Sistema notifica a recepción
   - Recepcionista prepara pedido
   - Marca como 'delivered' cuando entrega
```

### 5.3 Integración con Autenticación

**Para clientes autenticados:**
- Acceso a historial de compras
- Pre-compra vinculada a reserva
- Carga automática a cuenta

**Para clientes no autenticados:**
- Pueden comprar como "invitado"
- Opción de crear cuenta al finalizar compra
- Pago inmediato requerido

### 5.4 Componentes Necesarios

1. **`/app/(public)/tienda/page.tsx`** - Catálogo de productos
2. **`/app/(public)/tienda/[id]/page.tsx`** - Detalle de producto
3. **`/app/(public)/tienda/carrito/page.tsx`** - Carrito de compras
4. **`/app/(public)/tienda/checkout/page.tsx`** - Proceso de pago
5. **`/app/(cliente)/mis-compras/page.tsx`** - Historial de compras del cliente

---

## 6. Arquitectura Técnica Mejorada

### 6.1 Server Actions Propuestos

#### 6.1.1 `lib/actions/sales.ts`

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema de validación
const SaleItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
})

const CreateSaleSchema = z.object({
  items: z.array(SaleItemSchema).min(1),
  saleType: z.enum(['direct', 'room_charge']),
  reservationId: z.string().uuid().optional(),
  roomId: z.string().uuid().optional(),
  guestId: z.string().uuid().optional(),
  paymentMethod: z.enum(['cash', 'card', 'room_charge']).optional(),
  source: z.enum(['pos', 'online', 'mobile_app']).default('pos'),
  notes: z.string().optional(),
})

export async function createSale(data: z.infer<typeof CreateSaleSchema>) {
  const supabase = await createClient()
  
  // Validar datos
  const validated = CreateSaleSchema.parse(data)
  
  // Validar stock disponible
  for (const item of validated.items) {
    const { data: product } = await supabase
      .from('inventory_products')
      .select('current_stock, is_for_sale')
      .eq('id', item.productId)
      .single()
    
    if (!product?.is_for_sale) {
      return { error: `Producto ${item.productId} no está disponible para venta` }
    }
    
    if (product.current_stock < item.quantity) {
      return { error: `Stock insuficiente para producto ${item.productId}` }
    }
  }
  
  // Calcular totales
  const subtotal = validated.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const tax = subtotal * 0.18 // IGV 18% (ajustar según país)
  const total = subtotal + tax
  
  // Crear venta
  const { data: sale, error: saleError } = await supabase
    .from('product_sales')
    .insert({
      reservation_id: validated.reservationId,
      room_id: validated.roomId,
      guest_id: validated.guestId,
      sale_type: validated.saleType,
      payment_status: validated.saleType === 'direct' ? 'paid' : 'charged',
      payment_method: validated.paymentMethod,
      source: validated.source,
      subtotal,
      tax,
      total,
      notes: validated.notes,
    })
    .select()
    .single()
  
  if (saleError) return { error: 'Error al crear venta' }
  
  // Crear items de venta
  const saleItems = validated.items.map(item => ({
    sale_id: sale.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
  }))
  
  const { error: itemsError } = await supabase
    .from('product_sale_items')
    .insert(saleItems)
  
  if (itemsError) return { error: 'Error al crear items de venta' }
  
  // Procesar venta (función SQL)
  const { error: processError } = await supabase
    .rpc('process_product_sale', { p_sale_id: sale.id })
  
  if (processError) return { error: 'Error al procesar venta' }
  
  revalidatePath('/admin/ventas')
  revalidatePath('/admin/inventario')
  
  return { success: true, saleId: sale.id, saleCode: sale.sale_code }
}

export async function getSalesByReservation(reservationId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('product_sales')
    .select(`
      *,
      items:product_sale_items(
        *,
        product:inventory_products(name, unit, image_url)
      )
    `)
    .eq('reservation_id', reservationId)
    .order('created_at', { ascending: false })
  
  if (error) return { error: error.message }
  return { data }
}
```

#### 6.1.2 `lib/actions/room-charges.ts`

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRoomCharges(reservationId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('room_charges')
    .select('*')
    .eq('reservation_id', reservationId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  
  if (error) return { error: error.message }
  return { data }
}

export async function markChargesAsPaid(reservationId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('room_charges')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('reservation_id', reservationId)
    .eq('status', 'pending')
  
  if (error) return { error: error.message }
  
  // Actualizar ventas relacionadas
  await supabase
    .from('product_sales')
    .update({ payment_status: 'paid' })
    .eq('reservation_id', reservationId)
    .eq('payment_status', 'charged')
  
  revalidatePath(`/admin/reservas/${reservationId}`)
  return { success: true }
}
```

### 6.2 Queries para Reportes

#### 6.2.1 `lib/queries/sales.ts`

```typescript
import { createClient } from '@/lib/supabase/server'

export async function getSalesReport(startDate: Date, endDate: Date) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('product_sales')
    .select(`
      *,
      items:product_sale_items(
        quantity,
        unit_price,
        subtotal,
        product:inventory_products(name, category_id)
      )
    `)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  // Procesar datos para reporte
  const totalSales = data.reduce((sum, sale) => sum + sale.total, 0)
  const totalItems = data.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  )
  
  // Productos más vendidos
  const productSales = new Map()
  data.forEach(sale => {
    sale.items.forEach(item => {
      const current = productSales.get(item.product.name) || 0
      productSales.set(item.product.name, current + item.quantity)
    })
  })
  
  const topProducts = Array.from(productSales.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)
  
  return {
    period: { start: startDate, end: endDate },
    totalSales,
    totalItems,
    totalTransactions: data.length,
    topProducts,
    salesByType: {
      direct: data.filter(s => s.sale_type === 'direct').length,
      roomCharge: data.filter(s => s.sale_type === 'room_charge').length,
    },
    salesBySource: {
      pos: data.filter(s => s.source === 'pos').length,
      online: data.filter(s => s.source === 'online').length,
    },
  }
}
```

---

## 7. Flujos de Negocio Completos

### 7.1 Flujo: Venta en Recepción (POS)

```
1. Recepcionista abre POS (/admin/ventas/pos)
   ↓
2. Busca cliente/habitación (opcional):
   - Por número de habitación
   - Por código de reserva
   - Por DNI del cliente
   - O dejar vacío (venta directa)
   ↓
3. Si encuentra reserva activa:
   - Pre-selecciona "Cargar a Habitación"
   - Muestra datos del cliente
   ↓
4. Recepcionista selecciona productos del catálogo
   - Filtrado por categoría
   - Búsqueda por nombre
   - Solo productos con is_for_sale = true
   ↓
5. Sistema muestra carrito:
   - Lista de productos
   - Cantidades
   - Precios unitarios
   - Subtotal, impuestos, total
   ↓
6. Recepcionista puede:
   - Agregar más productos
   - Eliminar productos
   - Aplicar descuento manual (si autorizado)
   ↓
7. Selecciona tipo de venta:
   - Pago Inmediato (efectivo/tarjeta)
   - Cargar a Habitación
   ↓
8. Click "Procesar Venta"
   ↓
9. Sistema valida:
   - Stock disponible ✅
   - Reserva activa (si aplica) ✅
   - Datos completos ✅
   ↓
10. Sistema procesa:
    - Crea registro en product_sales
    - Crea items en product_sale_items
    - Crea movimientos de inventario
    - Si room_charge: Crea cargo y actualiza reserva
    ↓
11. Muestra confirmación:
    - Código de venta
    - Total pagado/cargado
    - Opción de imprimir ticket
    ↓
12. FIN
```

### 7.2 Flujo: Venta Online

```
1. Cliente navega a /tienda
   ↓
2. Cliente selecciona productos
   - Ve catálogo con imágenes
   - Filtra por categoría
   - Busca productos
   ↓
3. Agrega productos al carrito
   ↓
4. Click "Continuar compra"
   ↓
5. Sistema pregunta autenticación:
   - ¿Está logueado? [Sí] [No]
   ↓
   CASO A: No está logueado
   ├─→ Opciones:
   │   • Continuar como invitado
   │   • Crear cuenta
   │   • Iniciar sesión
   └─→ Cliente elige
   
   CASO B: Está logueado
   ├─→ Sistema busca reserva activa
   └─→ Muestra opciones de pago
   ↓
6. Cliente completa checkout:
   - Revisa productos
   - Selecciona método de pago:
     • Cargar a cuenta (si tiene reserva)
     • Pagar ahora (Stripe/PayPal)
   - Ingresa datos de entrega (si aplica)
   ↓
7. Si pago inmediato:
   - Procesa pago con gateway
   - Valida pago exitoso
   ↓
8. Sistema crea venta:
   - source = 'online'
   - delivery_status = 'pending'
   - Si carga a cuenta: Crea room_charge
   ↓
9. Sistema notifica:
   - Email de confirmación al cliente
   - Notificación a recepción (si entrega a habitación)
   ↓
10. Si entrega a habitación:
    - Recepcionista ve pedido pendiente
    - Prepara productos
    - Marca como 'delivered' cuando entrega
    ↓
11. FIN
```

### 7.3 Flujo: Check-out con Productos

```
1. Cliente solicita check-out
   ↓
2. Recepcionista abre check-out
   - Busca reserva por habitación/DNI
   ↓
3. Sistema muestra resumen completo:
   ┌─────────────────────────────────────┐
   │ ESTANCIA                            │
   │ • 2 noches × S/ 250 = S/ 500        │
   │                                     │
   │ PRODUCTOS COMPRADOS                 │
   │ • 15 Dic - VTA-001: S/ 25           │
   │   - Gaseosa x2, Agua x1             │
   │ • 16 Dic - VTA-002: S/ 15           │
   │   - Shampoo x1                       │
   │                                     │
   │ OTROS CARGOS                        │
   │ • Servicio extra: S/ 10             │
   │                                     │
   │ ─────────────────────────────────   │
   │ SUBTOTAL: S/ 550                     │
   │ IGV (18%): S/ 99                    │
   │ TOTAL: S/ 649                       │
   │                                     │
   │ Pagado: S/ 500                      │
   │ PENDIENTE: S/ 149                   │
   └─────────────────────────────────────┘
   ↓
4. Cliente revisa y confirma
   ↓
5. Cliente paga total pendiente
   ↓
6. Sistema:
   ✅ Marca todos los cargos como 'paid'
   ✅ Marca todas las ventas como 'paid'
   ✅ Libera habitación
   ✅ Cambia reserva a 'completed'
   ✅ Genera factura/comprobante
   ↓
7. Cliente recibe factura y sale
   ↓
8. FIN
```

---

## 8. Plan de Implementación Priorizado

### Fase 1: Base de Datos y Backend (3-4 días)

**Prioridad: ALTA**

- [ ] Crear migración SQL con todas las tablas mejoradas
- [ ] Agregar campos adicionales a tablas existentes
- [ ] Crear funciones SQL mejoradas (con promociones)
- [ ] Configurar RLS completo
- [ ] Crear índices para performance
- [ ] Datos seed: Marcar productos como `is_for_sale`

**Entregables:**
- Migración SQL completa
- Funciones SQL probadas
- RLS configurado

### Fase 2: Server Actions y Validaciones (2 días)

**Prioridad: ALTA**

- [ ] `lib/actions/sales.ts` - Crear, listar, obtener ventas
- [ ] `lib/actions/room-charges.ts` - Gestionar cargos
- [ ] `lib/validations/sales.ts` - Schemas Zod
- [ ] `lib/queries/sales.ts` - Queries para reportes

**Entregables:**
- Server Actions funcionales
- Validaciones completas

### Fase 3: Frontend - POS (3 días)

**Prioridad: ALTA**

- [ ] `/admin/ventas/pos` - Página principal de POS
- [ ] Componente de búsqueda de cliente/habitación
- [ ] Componente de catálogo de productos
- [ ] Componente de carrito
- [ ] Formulario de procesamiento de venta
- [ ] Integración con recepción (botón rápido)

**Entregables:**
- POS funcional para recepción
- Integrado con sistema de recepción

### Fase 4: Frontend - Integración con Reservas (2 días)

**Prioridad: MEDIA**

- [ ] Sección de cargos en detalle de reserva
- [ ] Modificar check-out para mostrar cargos
- [ ] Botón "Agregar Productos" en detalle de reserva
- [ ] Vista de historial de compras por reserva

**Entregables:**
- Reservas integradas con ventas
- Check-out mejorado

### Fase 5: Reportes de Ventas (2 días)

**Prioridad: MEDIA**

- [ ] `/admin/ventas/reportes` - Página de reportes
- [ ] Gráficos de ventas (día/mes)
- [ ] Top productos vendidos
- [ ] Comparativa venta directa vs. carga a habitación
- [ ] Ingresos por categoría

**Entregables:**
- Dashboard de reportes completo

### Fase 6: Venta Online (5-6 días)

**Prioridad: BAJA (Post-MVP)**

- [ ] `/tienda` - Catálogo público
- [ ] `/tienda/carrito` - Carrito de compras
- [ ] `/tienda/checkout` - Proceso de pago
- [ ] Integración con gateway de pago (Stripe/PayPal)
- [ ] `/mis-compras` - Historial del cliente
- [ ] Notificaciones de pedidos

**Entregables:**
- Tienda online funcional
- Proceso de pago integrado

### Fase 7: Promociones y Descuentos (2-3 días)

**Prioridad: BAJA (Post-MVP)**

- [ ] CRUD de promociones
- [ ] Aplicación automática de promociones
- [ ] Banner de promociones en tienda online

**Entregables:**
- Sistema de promociones funcional

---

## 9. Consideraciones Adicionales

### 9.1 Performance

- **Índices críticos:**
  ```sql
  CREATE INDEX idx_product_sales_date_source ON product_sales(created_at DESC, source);
  CREATE INDEX idx_product_sales_reservation ON product_sales(reservation_id) WHERE reservation_id IS NOT NULL;
  CREATE INDEX idx_product_sale_items_sale ON product_sale_items(sale_id);
  CREATE INDEX idx_inventory_products_for_sale ON inventory_products(is_for_sale, is_active) WHERE is_for_sale = true;
  ```

### 9.2 Seguridad

- Validar permisos en cada acción
- Sanitizar inputs de usuario
- Validar stock antes de procesar venta
- Auditoría de cambios (opcional: tabla `audit_log`)

### 9.3 UX/UI

- **POS debe ser rápido:**
  - Búsqueda instantánea de productos
  - Atajos de teclado
  - Interfaz táctil-friendly (tablets)
  
- **Tienda online debe ser intuitiva:**
  - Imágenes de productos
  - Filtros y búsqueda
  - Carrito persistente (localStorage)

### 9.4 Integración con Sistema Existente

- ✅ No rompe funcionalidad existente
- ✅ Extiende inventario sin modificar lógica actual
- ✅ Integra con reservas de forma aditiva
- ✅ Compatible con sistema de recepción propuesto

---

## 10. Métricas de Éxito

| Métrica | Baseline | Meta | Cómo Medir |
|---------|----------|------|------------|
| Tiempo de registro de venta | 5-10 min (manual) | < 1 min | Tiempo promedio en POS |
| Errores en facturación | ~10% (estimado) | < 1% | % de cargos corregidos |
| Productos sin stock | No medido | Alertas automáticas | % de ventas rechazadas por stock |
| Ingresos por ventas | No medido | Reportes mensuales | Total en reportes |
| Satisfacción del personal | N/A | 4/5+ | Encuesta post-implementación |
| Ventas online | 0 | 10-20% del total | % de ventas con source='online' |

---

## 11. Próximos Pasos

1. ✅ **Revisar esta propuesta mejorada** con el cliente
2. ✅ **Validar prioridades** de implementación
3. ✅ **Aprobar plan de implementación** - Confirmar timeline
4. ✅ **Iniciar Fase 1** - Base de datos

---

## 12. Conclusión

Esta propuesta mejora y complementa el análisis original con:

✅ **Refinamientos técnicos** basados en mejores prácticas  
✅ **Integración completa** con sistema de recepción  
✅ **Módulo de venta online** para expansión futura  
✅ **Mejoras en UX/UI** para mejor experiencia  
✅ **Optimizaciones** de performance y seguridad  

La propuesta original era **sólida**, y estas mejoras la hacen **completa y lista para producción**.

---

*Documento de Análisis Mejorado - Sistema de Venta de Productos - Hotel Sauna Belén - Diciembre 2025*

