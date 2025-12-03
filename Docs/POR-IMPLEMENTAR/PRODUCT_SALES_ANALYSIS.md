# Análisis y Propuesta: Sistema de Venta de Productos al Público
## Hotel Sauna Belén

**Versión:** 1.0  
**Fecha:** Diciembre 2025  
**Autor:** Análisis Técnico  
**Estado:** Propuesta de Investigación

---

## 1. Resumen Ejecutivo

### 1.1 Situación Actual
El Hotel Sauna Belén actualmente gestiona la venta de productos al público (shampoo, gaseosas, agua, jaboncillo, afeitadoras, etc.) mediante **registro manual en cuaderno**. Este proceso presenta las siguientes limitaciones:

- **Ineficiencia operativa:** Registro manual propenso a errores
- **Falta de trazabilidad:** Difícil rastrear qué productos se vendieron, cuándo y a quién
- **Control de inventario deficiente:** No hay sincronización automática entre ventas y stock
- **Facturación compleja:** Cargar productos a la cuenta de la habitación requiere trabajo manual
- **Análisis limitado:** No hay reportes de productos más vendidos, ingresos por ventas, etc.

### 1.2 Objetivo
Diseñar e implementar un sistema integrado de venta de productos que:
- Digitalice el proceso de venta
- Integre con el sistema de inventario existente
- Permita cargar productos a la cuenta de la habitación
- Facilite el pago inmediato o diferido
- Genere reportes y análisis de ventas

---

## 2. Investigación: Mejores Prácticas de Hotelería

### 2.1 Modelos de Venta de Productos en Hoteles

#### Modelo 1: Minibar Automático
- Productos pre-posicionados en la habitación
- Sensor de peso o RFID para detectar consumo
- Carga automática a la cuenta al check-out
- **Ventajas:** Automatizado, sin intervención del personal
- **Desventajas:** Requiere hardware especializado, inversión inicial alta

#### Modelo 2: Tienda/Recepción (Modelo Actual del Hotel)
- Productos disponibles en recepción o tienda del hotel
- Cliente solicita productos al personal
- Pago inmediato o carga a cuenta
- **Ventajas:** Flexibilidad, control directo, sin hardware adicional
- **Desventajas:** Requiere personal disponible, registro manual

#### Modelo 3: Híbrido (Recomendado)
- Productos disponibles en recepción
- Sistema POS (Point of Sale) para registro de ventas
- Integración con PMS para cargar a cuenta
- **Ventajas:** Balance entre automatización y flexibilidad
- **Desventajas:** Requiere capacitación del personal

### 2.2 Funcionalidades Clave Identificadas

Basado en la investigación de sistemas como **HotelFriend**, **WISK**, y **OsmoVentes**, las funcionalidades esenciales son:

1. **Punto de Venta (POS)**
   - Registro rápido de ventas
   - Múltiples métodos de pago
   - Impresión de tickets/recibos

2. **Integración con Inventario**
   - Descuento automático de stock al vender
   - Alertas de stock bajo
   - Sincronización en tiempo real

3. **Carga a Cuenta de Habitación**
   - Vincular ventas a reservas activas
   - Consolidación en factura final
   - Historial de cargos por habitación

4. **Reportes y Análisis**
   - Productos más vendidos
   - Ingresos por ventas
   - Análisis de rentabilidad

---

## 3. Análisis del Sistema Actual

### 3.1 Módulo de Inventario Existente

El sistema ya cuenta con:

```typescript
// Estructura actual
inventory_products {
  id, name, category_id, current_stock, min_stock, 
  cost_per_unit, unit, is_active
}

inventory_movements {
  id, product_id, movement_type ('entrada'|'salida'|'ajuste'),
  quantity, previous_stock, new_stock,
  reason, room_id, reservation_id, created_by
}
```

**Fortalezas:**
- ✅ Control de stock ya implementado
- ✅ Sistema de movimientos funcional
- ✅ Alertas de stock bajo
- ✅ Categorización de productos

**Limitaciones para Venta:**
- ❌ No distingue entre "uso interno" y "venta al público"
- ❌ No tiene precio de venta (solo costo)
- ❌ No registra transacciones de venta
- ❌ No integra con facturación de reservas

### 3.2 Sistema de Reservas

```typescript
reservations {
  id, booking_code, room_id, guest_id,
  check_in, check_out, total_price, status
}
```

**Oportunidad de Integración:**
- Las reservas tienen `total_price` que solo incluye alojamiento
- No hay sistema de "cargos adicionales" o "extras"
- Necesitamos agregar capacidad de facturación de productos

---

## 4. Propuesta de Solución

### 4.1 Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────┐
│              SISTEMA DE VENTA DE PRODUCTOS              │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   Módulo     │   │   Módulo      │   │   Módulo     │
│   POS        │   │   Facturación │   │   Reportes   │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌──────────────┐                      ┌──────────────┐
│  Inventario  │                      │  Reservas    │
│  Existente   │                      │  Existente   │
└──────────────┘                      └──────────────┘
```

### 4.2 Nuevas Tablas de Base de Datos

#### Tabla: `product_sales` (Ventas de Productos)

```sql
CREATE TABLE public.product_sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_code VARCHAR(20) UNIQUE NOT NULL, -- VTA-YYYYMMDD-XXXX
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
    
    -- Información de la venta
    sale_type VARCHAR(20) NOT NULL CHECK (sale_type IN ('direct', 'room_charge')),
    -- 'direct' = pago inmediato, 'room_charge' = carga a cuenta
    
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'charged', 'cancelled')),
    
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    payment_method VARCHAR(20), -- 'cash', 'card', 'room_charge'
    payment_reference TEXT, -- número de transacción, etc.
    
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `product_sale_items` (Items de Venta)

```sql
CREATE TABLE public.product_sale_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID REFERENCES public.product_sales(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.inventory_products(id) ON DELETE RESTRICT NOT NULL,
    
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL, -- Precio de venta al momento de la venta
    subtotal DECIMAL(10,2) NOT NULL, -- quantity * unit_price
    
    -- Trazabilidad
    movement_id UUID REFERENCES public.inventory_movements(id) ON DELETE SET NULL,
    -- Vincula con el movimiento de inventario generado
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `room_charges` (Cargos a Habitación)

```sql
CREATE TABLE public.room_charges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE NOT NULL,
    charge_type VARCHAR(50) NOT NULL DEFAULT 'product_sale',
    -- 'product_sale', 'service', 'penalty', 'other'
    
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    
    -- Referencia a la venta si aplica
    sale_id UUID REFERENCES public.product_sales(id) ON DELETE SET NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'paid', 'cancelled')),
    
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Modificaciones a Tablas Existentes

**Agregar a `inventory_products`:**
```sql
ALTER TABLE public.inventory_products
ADD COLUMN sale_price DECIMAL(10,2), -- Precio de venta al público
ADD COLUMN is_for_sale BOOLEAN DEFAULT false; -- ¿Se vende al público?
```

**Modificar `inventory_movements`:**
```sql
-- Agregar referencia a venta
ALTER TABLE public.inventory_movements
ADD COLUMN sale_id UUID REFERENCES public.product_sales(id) ON DELETE SET NULL;

-- Ampliar razones de salida
-- Ya existe 'reason' VARCHAR(100), podemos usar valores como:
-- 'venta_directa', 'venta_habitacion', 'uso_interno', 'merma', etc.
```

**Modificar `reservations`:**
```sql
-- Agregar campo para total con cargos
ALTER TABLE public.reservations
ADD COLUMN additional_charges DECIMAL(10,2) DEFAULT 0,
ADD COLUMN final_total DECIMAL(10,2) GENERATED ALWAYS AS 
    (total_price + COALESCE(additional_charges, 0)) STORED;
```

### 4.3 Funciones y Triggers

#### Función: Generar código de venta
```sql
CREATE OR REPLACE FUNCTION generate_sale_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        new_code := 'VTA-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                    LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT EXISTS(SELECT 1 FROM public.product_sales WHERE sale_code = new_code) 
        INTO code_exists;
        EXIT WHEN NOT code_exists;
    END LOOP;
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;
```

#### Trigger: Auto-generar código de venta
```sql
CREATE OR REPLACE FUNCTION set_sale_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sale_code IS NULL THEN
        NEW.sale_code := generate_sale_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_sale_code
    BEFORE INSERT ON public.product_sales
    FOR EACH ROW
    EXECUTE FUNCTION set_sale_code();
```

#### Función: Procesar venta y actualizar inventario
```sql
CREATE OR REPLACE FUNCTION process_product_sale(
    p_sale_id UUID
)
RETURNS VOID AS $$
DECLARE
    sale_record RECORD;
    item_record RECORD;
    movement_id UUID;
BEGIN
    -- Obtener información de la venta
    SELECT * INTO sale_record
    FROM public.product_sales
    WHERE id = p_sale_id;
    
    -- Si es venta directa (pago inmediato), no hacer nada más
    -- Si es carga a habitación, crear cargo
    IF sale_record.sale_type = 'room_charge' THEN
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
            sale_record.total,
            p_sale_id,
            'pending'
        );
        
        -- Actualizar additional_charges en reserva
        UPDATE public.reservations
        SET additional_charges = COALESCE(additional_charges, 0) + sale_record.total
        WHERE id = sale_record.reservation_id;
    END IF;
    
    -- Para cada item, crear movimiento de inventario
    FOR item_record IN 
        SELECT * FROM public.product_sale_items WHERE sale_id = p_sale_id
    LOOP
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
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Flujos de Negocio

### 5.1 Flujo: Venta Directa (Pago Inmediato)

```
1. Cliente solicita productos en recepción
2. Personal selecciona productos en POS
3. Sistema calcula total
4. Cliente paga (efectivo/tarjeta)
5. Sistema registra venta (sale_type = 'direct', payment_status = 'paid')
6. Sistema descuenta stock automáticamente
7. Sistema genera ticket/recibo
8. FIN
```

**Casos de Uso:**
- Cliente no hospedado (walk-in)
- Cliente hospedado que prefiere pagar inmediato
- Venta de productos sin vinculación a reserva

### 5.2 Flujo: Carga a Cuenta de Habitación

```
1. Cliente solicita productos (identificado por habitación/reserva)
2. Personal selecciona productos en POS
3. Sistema vincula a reserva activa
4. Sistema registra venta (sale_type = 'room_charge', payment_status = 'charged')
5. Sistema crea cargo en room_charges
6. Sistema actualiza additional_charges en reserva
7. Sistema descuenta stock automáticamente
8. Al check-out: sistema consolida total (alojamiento + cargos)
9. Cliente paga total consolidado
10. Sistema marca cargos como 'paid'
11. FIN
```

**Casos de Uso:**
- Cliente hospedado que prefiere pagar al final
- Productos consumidos durante la estadía
- Conveniencia para el cliente

### 5.3 Flujo: Check-out con Cargos

```
1. Cliente solicita check-out
2. Sistema muestra:
   - Total alojamiento (total_price)
   - Cargos adicionales (additional_charges)
   - Desglose de cargos (productos, servicios, etc.)
   - Total final (final_total)
3. Cliente revisa y confirma
4. Cliente paga total
5. Sistema marca:
   - Reserva como 'completed'
   - Cargos como 'paid'
   - Ventas relacionadas como 'paid'
6. Sistema genera factura/recibo consolidado
7. FIN
```

---

## 6. Interfaz de Usuario Propuesta

### 6.1 Módulo POS (Punto de Venta)

**Ubicación:** `/admin/ventas/pos`

**Componentes:**
- **Selector de Cliente/Habitación:** Buscar por nombre, habitación, o código de reserva
- **Catálogo de Productos:** Grid con productos disponibles para venta (filtrado por `is_for_sale = true`)
- **Carrito de Compras:** Lista de productos seleccionados con cantidades
- **Selector de Tipo de Venta:** Radio buttons "Pago Inmediato" / "Cargar a Habitación"
- **Resumen de Venta:** Subtotal, impuestos, total
- **Botón "Procesar Venta"**

### 6.2 Vista de Cargos por Habitación

**Ubicación:** `/admin/reservas/[id]/cargos`

**Componentes:**
- Lista de cargos pendientes
- Botón "Agregar Cargo Manual" (para servicios, penalizaciones, etc.)
- Total consolidado
- Botón "Marcar como Pagado"

### 6.3 Reportes de Ventas

**Ubicación:** `/admin/ventas/reportes`

**Métricas:**
- Ventas del día/mes
- Productos más vendidos
- Ingresos por categoría
- Comparativa venta directa vs. carga a habitación
- Tasa de conversión (productos disponibles vs. vendidos)

---

## 7. Integración con Sistema Existente

### 7.1 Extensión del Módulo de Inventario

**No romper funcionalidad existente:**
- El sistema actual de inventario sigue funcionando igual
- Los movimientos de "uso interno" siguen usando `reason = 'uso_habitacion'` o similar
- Las ventas usan nuevos valores de `reason`: 'venta_directa', 'venta_habitacion'

**Nuevas funcionalidades:**
- Agregar campo `is_for_sale` y `sale_price` a productos
- Filtro en lista de productos: "Solo productos para venta"
- Vista de productos con precio de venta

### 7.2 Extensión del Módulo de Reservas

**En detalle de reserva:**
- Nueva pestaña/sección "Cargos Adicionales"
- Lista de cargos pendientes
- Botón "Agregar Productos" que abre el POS pre-configurado con la reserva

**En check-out:**
- Mostrar desglose completo de cargos
- Calcular total final automáticamente

---

## 8. Consideraciones Técnicas

### 8.1 Seguridad y Permisos

```sql
-- RLS para product_sales
ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manages product sales"
    ON public.product_sales FOR ALL TO authenticated
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- RLS para room_charges
ALTER TABLE public.room_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manages room charges"
    ON public.room_charges FOR ALL TO authenticated
    USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
```

### 8.2 Validaciones

- **Stock disponible:** No permitir venta si `current_stock < quantity`
- **Reserva activa:** Solo cargar a habitación si `reservation.status IN ('confirmed', 'pending')`
- **Precios:** Validar que `sale_price > 0` para productos `is_for_sale = true`

### 8.3 Performance

- **Índices:**
  ```sql
  CREATE INDEX idx_product_sales_reservation ON public.product_sales(reservation_id);
  CREATE INDEX idx_product_sales_date ON public.product_sales(created_at DESC);
  CREATE INDEX idx_room_charges_reservation ON public.room_charges(reservation_id);
  CREATE INDEX idx_product_sale_items_sale ON public.product_sale_items(sale_id);
  ```

---

## 9. Plan de Implementación

### Fase 1: Base de Datos (Día 1)
- [ ] Crear migración SQL con nuevas tablas
- [ ] Agregar campos a tablas existentes
- [ ] Crear funciones y triggers
- [ ] Configurar RLS
- [ ] Datos seed: Marcar algunos productos como `is_for_sale = true`

### Fase 2: Backend (Día 2)
- [ ] Server Actions para ventas (`lib/actions/sales.ts`)
- [ ] Server Actions para cargos (`lib/actions/room-charges.ts`)
- [ ] Validaciones con Zod
- [ ] Queries para reportes

### Fase 3: Frontend - POS (Día 3)
- [ ] Página `/admin/ventas/pos`
- [ ] Componente de selector de cliente/habitación
- [ ] Componente de catálogo de productos
- [ ] Componente de carrito
- [ ] Formulario de procesamiento de venta

### Fase 4: Frontend - Integración (Día 4)
- [ ] Sección de cargos en detalle de reserva
- [ ] Modificar check-out para mostrar cargos
- [ ] Reportes de ventas

### Fase 5: Testing y Ajustes (Día 5)
- [ ] Pruebas de flujos completos
- [ ] Validación con cliente
- [ ] Ajustes según feedback

---

## 10. Métricas de Éxito

| Métrica | Baseline | Meta |
|---------|----------|------|
| Tiempo de registro de venta | 5-10 min (manual) | < 1 min (digital) |
| Errores en facturación | ~10% (estimado) | < 1% |
| Productos sin stock | No medido | Alertas automáticas |
| Ingresos por ventas | No medido | Reportes mensuales |
| Satisfacción del personal | N/A | 4/5+ |

---

## 11. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|--------|------------|
| Resistencia del personal al cambio | Medio | Capacitación, UI intuitiva |
| Errores en migración de datos | Alto | Testing exhaustivo, rollback plan |
| Sobrecomplejidad del sistema | Medio | MVP primero, iterar según necesidad |
| Problemas de integración | Medio | Testing de integración, documentación |

---

## 12. Próximos Pasos

1. **Revisar propuesta con cliente** - Validar flujos y requisitos
2. **Ajustar según feedback** - Refinar detalles técnicos
3. **Aprobar plan de implementación** - Confirmar timeline
4. **Iniciar Fase 1** - Base de datos

---

*Documento de Análisis - Sistema de Venta de Productos - Hotel Sauna Belén - Diciembre 2025*

