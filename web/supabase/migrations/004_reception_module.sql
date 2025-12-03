-- ============================================
-- MIGRACIÓN 004: Módulo de Recepción - Check-in/Check-out
-- ============================================
-- Fecha: 2025-12-15
-- Descripción: Agrega soporte para check-in/check-out de reservas y búsqueda rápida de clientes por DNI
--              Incluye índices para optimización y campos para tracking de check-in/check-out

-- ============================================
-- ÍNDICES PARA BÚSQUEDA RÁPIDA
-- ============================================

-- Índice único para búsqueda ultra-rápida de clientes por documento
-- Permite búsqueda instantánea por DNI, CE o Pasaporte
CREATE UNIQUE INDEX IF NOT EXISTS idx_guests_document_unique 
ON public.guests(document_type, document_number)
WHERE document_type IS NOT NULL AND document_number IS NOT NULL;

-- Índice adicional para búsqueda solo por número de documento (más flexible)
CREATE INDEX IF NOT EXISTS idx_guests_document_number 
ON public.guests(document_number)
WHERE document_number IS NOT NULL;

-- Comentarios para documentación
COMMENT ON INDEX idx_guests_document_unique IS 'Índice único para búsqueda rápida de clientes por tipo y número de documento';
COMMENT ON INDEX idx_guests_document_number IS 'Índice para búsqueda flexible por número de documento';

-- ============================================
-- CAMPOS DE CHECK-IN/CHECK-OUT EN RESERVATIONS
-- ============================================

-- Agregar campos para tracking de check-in y check-out
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS checked_out_at TIMESTAMPTZ NULL;

-- Comentarios para documentación
COMMENT ON COLUMN public.reservations.checked_in_at IS 'Fecha y hora exacta cuando se realizó el check-in. NULL = aún no se ha hecho check-in';
COMMENT ON COLUMN public.reservations.checked_out_at IS 'Fecha y hora exacta cuando se realizó el check-out. NULL = aún no se ha hecho check-out';

-- Índices para consultas frecuentes de recepción
CREATE INDEX IF NOT EXISTS idx_reservations_checked_in_at 
ON public.reservations(checked_in_at)
WHERE checked_in_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reservations_checked_out_at 
ON public.reservations(checked_out_at)
WHERE checked_out_at IS NOT NULL;

-- Índice compuesto para consultas de huéspedes actuales (checked-in pero no checked-out)
CREATE INDEX IF NOT EXISTS idx_reservations_active 
ON public.reservations(checked_in_at, checked_out_at)
WHERE checked_in_at IS NOT NULL AND checked_out_at IS NULL;

-- ============================================
-- TABLA OPCIONAL: CHECK_INS (AUDITORÍA)
-- ============================================

-- Tabla para auditoría completa de check-ins y check-outs
-- Permite tracking de quién realizó cada operación y notas adicionales
CREATE TABLE IF NOT EXISTS public.check_ins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE NOT NULL,
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checked_out_at TIMESTAMPTZ NULL,
    checked_in_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    checked_out_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    additional_charges DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT check_checkout_after_checkin CHECK (
        checked_out_at IS NULL OR checked_out_at >= checked_in_at
    ),
    CONSTRAINT check_additional_charges_positive CHECK (
        additional_charges >= 0
    )
);

-- Índices para la tabla check_ins
CREATE INDEX IF NOT EXISTS idx_check_ins_reservation 
ON public.check_ins(reservation_id);

CREATE INDEX IF NOT EXISTS idx_check_ins_dates 
ON public.check_ins(checked_in_at, checked_out_at);

CREATE INDEX IF NOT EXISTS idx_check_ins_active 
ON public.check_ins(checked_in_at)
WHERE checked_out_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_check_ins_user_in 
ON public.check_ins(checked_in_by)
WHERE checked_in_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_check_ins_user_out 
ON public.check_ins(checked_out_by)
WHERE checked_out_by IS NOT NULL;

-- Comentarios para la tabla check_ins
COMMENT ON TABLE public.check_ins IS 'Auditoría completa de check-ins y check-outs. Permite tracking de quién realizó cada operación.';
COMMENT ON COLUMN public.check_ins.reservation_id IS 'Reserva asociada al check-in/check-out';
COMMENT ON COLUMN public.check_ins.checked_in_at IS 'Fecha y hora exacta del check-in';
COMMENT ON COLUMN public.check_ins.checked_out_at IS 'Fecha y hora exacta del check-out. NULL = aún no se ha hecho check-out';
COMMENT ON COLUMN public.check_ins.checked_in_by IS 'Usuario que realizó el check-in';
COMMENT ON COLUMN public.check_ins.checked_out_by IS 'Usuario que realizó el check-out';
COMMENT ON COLUMN public.check_ins.additional_charges IS 'Cargos adicionales (minibar, servicios extra) registrados al check-out';
COMMENT ON COLUMN public.check_ins.notes IS 'Notas adicionales sobre el check-in/check-out';

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_check_ins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_ins_updated_at
    BEFORE UPDATE ON public.check_ins
    FOR EACH ROW
    EXECUTE FUNCTION update_check_ins_updated_at();

-- ============================================
-- VISTAS ÚTILES PARA RECEPCIÓN
-- ============================================

-- Vista: Huéspedes actuales (estadías activas - checked-in pero no checked-out)
CREATE OR REPLACE VIEW public.active_reservations_view AS
SELECT 
    r.id,
    r.booking_code,
    r.room_id,
    r.guest_id,
    r.check_in,
    r.check_out,
    r.nights,
    r.total_price,
    r.status,
    r.checked_in_at,
    r.checked_out_at,
    r.adults,
    r.youths,
    r.children,
    r.infants,
    r.created_at,
    g.full_name as guest_name,
    g.email as guest_email,
    g.phone as guest_phone,
    g.document_type as guest_document_type,
    g.document_number as guest_document_number,
    rm.name as room_name,
    rm.type as room_type,
    rm.price_per_night
FROM public.reservations r
INNER JOIN public.guests g ON r.guest_id = g.id
INNER JOIN public.rooms rm ON r.room_id = rm.id
WHERE r.checked_in_at IS NOT NULL 
  AND r.checked_out_at IS NULL
  AND r.status NOT IN ('cancelled', 'no_show');

COMMENT ON VIEW public.active_reservations_view IS 'Vista de huéspedes actuales (estadías activas - clientes hospedados actualmente en el hotel)';

-- Vista: Check-ins programados para hoy
CREATE OR REPLACE VIEW public.today_check_ins_view AS
SELECT 
    r.id,
    r.booking_code,
    r.room_id,
    r.guest_id,
    r.check_in,
    r.check_out,
    r.nights,
    r.total_price,
    r.status,
    r.checked_in_at,
    r.adults,
    r.youths,
    r.children,
    r.infants,
    g.full_name as guest_name,
    g.email as guest_email,
    g.phone as guest_phone,
    g.document_type as guest_document_type,
    g.document_number as guest_document_number,
    rm.name as room_name,
    rm.type as room_type,
    rm.price_per_night
FROM public.reservations r
INNER JOIN public.guests g ON r.guest_id = g.id
INNER JOIN public.rooms rm ON r.room_id = rm.id
WHERE r.check_in = CURRENT_DATE
  AND r.status IN ('confirmed', 'pending')
  AND r.checked_in_at IS NULL;

COMMENT ON VIEW public.today_check_ins_view IS 'Vista de reservas con check-in programado para hoy que aún no se han realizado';

-- Vista: Check-outs programados para hoy
CREATE OR REPLACE VIEW public.today_check_outs_view AS
SELECT 
    r.id,
    r.booking_code,
    r.room_id,
    r.guest_id,
    r.check_in,
    r.check_out,
    r.nights,
    r.total_price,
    r.status,
    r.checked_in_at,
    r.checked_out_at,
    r.adults,
    r.youths,
    r.children,
    r.infants,
    g.full_name as guest_name,
    g.email as guest_email,
    g.phone as guest_phone,
    g.document_type as guest_document_type,
    g.document_number as guest_document_number,
    rm.name as room_name,
    rm.type as room_type,
    rm.price_per_night
FROM public.reservations r
INNER JOIN public.guests g ON r.guest_id = g.id
INNER JOIN public.rooms rm ON r.room_id = rm.id
WHERE r.check_out = CURRENT_DATE
  AND r.status IN ('confirmed', 'checked-in')
  AND r.checked_out_at IS NULL;

COMMENT ON VIEW public.today_check_outs_view IS 'Vista de reservas con check-out programado para hoy que aún no se han realizado';

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Función: Obtener historial de estancias de un cliente
CREATE OR REPLACE FUNCTION get_guest_stay_history(p_guest_id UUID)
RETURNS TABLE (
    reservation_id UUID,
    booking_code VARCHAR(20),
    room_name VARCHAR(100),
    room_type VARCHAR(50),
    check_in DATE,
    check_out DATE,
    nights INTEGER,
    total_price DECIMAL(10,2),
    status VARCHAR(20),
    checked_in_at TIMESTAMPTZ,
    checked_out_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.booking_code,
        rm.name,
        rm.type,
        r.check_in,
        r.check_out,
        r.nights,
        r.total_price,
        r.status,
        r.checked_in_at,
        r.checked_out_at,
        r.created_at
    FROM public.reservations r
    INNER JOIN public.rooms rm ON r.room_id = rm.id
    WHERE r.guest_id = p_guest_id
    ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_guest_stay_history IS 'Retorna el historial completo de estancias de un cliente, ordenado por fecha de creación descendente';

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================

