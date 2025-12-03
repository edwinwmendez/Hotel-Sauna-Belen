-- ============================================
-- MIGRACIÓN 003: Agregar capacidad por tipo de huésped a habitaciones
-- ============================================
-- Fecha: 2025-12-03
-- Descripción: Agrega campos opcionales para definir capacidad específica por tipo de huésped
--              (adultos, jóvenes, niños, bebés) en la tabla rooms

-- Agregar columnas para capacidad por tipo de huésped
ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS max_adults INTEGER NULL,
  ADD COLUMN IF NOT EXISTS max_youths INTEGER NULL,
  ADD COLUMN IF NOT EXISTS max_children INTEGER NULL,
  ADD COLUMN IF NOT EXISTS max_infants INTEGER NULL;

-- Comentarios para documentación
COMMENT ON COLUMN public.rooms.max_adults IS 'Máximo número de adultos (13+ años) permitidos. NULL = sin límite específico, usar capacity total';
COMMENT ON COLUMN public.rooms.max_youths IS 'Máximo número de jóvenes (8-12 años) permitidos. NULL = sin límite específico';
COMMENT ON COLUMN public.rooms.max_children IS 'Máximo número de niños (3-7 años) permitidos. NULL = sin límite específico';
COMMENT ON COLUMN public.rooms.max_infants IS 'Máximo número de bebés (0-2 años) permitidos. NULL = sin límite específico. Los bebés generalmente no cuentan para capacity total';

-- Agregar constraints para validación
ALTER TABLE public.rooms
  ADD CONSTRAINT check_max_adults_positive CHECK (max_adults IS NULL OR max_adults >= 0),
  ADD CONSTRAINT check_max_youths_positive CHECK (max_youths IS NULL OR max_youths >= 0),
  ADD CONSTRAINT check_max_children_positive CHECK (max_children IS NULL OR max_children >= 0),
  ADD CONSTRAINT check_max_infants_positive CHECK (max_infants IS NULL OR max_infants >= 0);

-- Actualizar reservas para incluir información de huéspedes
ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS youths INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS infants INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_guests INTEGER GENERATED ALWAYS AS (adults + youths + children + infants) STORED;

-- Comentarios para reservas
COMMENT ON COLUMN public.reservations.adults IS 'Número de adultos (13+ años) en la reserva';
COMMENT ON COLUMN public.reservations.youths IS 'Número de jóvenes (8-12 años) en la reserva';
COMMENT ON COLUMN public.reservations.children IS 'Número de niños (3-7 años) en la reserva';
COMMENT ON COLUMN public.reservations.infants IS 'Número de bebés (0-2 años) en la reserva';
COMMENT ON COLUMN public.reservations.total_guests IS 'Total de huéspedes (calculado automáticamente)';

-- Constraints para reservas
ALTER TABLE public.reservations
  ADD CONSTRAINT check_adults_min CHECK (adults >= 1),
  ADD CONSTRAINT check_youths_non_negative CHECK (youths >= 0),
  ADD CONSTRAINT check_children_non_negative CHECK (children >= 0),
  ADD CONSTRAINT check_infants_non_negative CHECK (infants >= 0);

