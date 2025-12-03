import { z } from 'zod'

/**
 * Schema para búsqueda de cliente por documento
 */
export const GuestSearchSchema = z.object({
  documentType: z.enum(['DNI', 'CE', 'PASAPORTE'], {
    errorMap: () => ({ message: 'Tipo de documento inválido' }),
  }),
  documentNumber: z
    .string()
    .min(8, 'El documento debe tener al menos 8 caracteres')
    .max(20, 'El documento es demasiado largo')
    .regex(/^[A-Z0-9]+$/i, 'El documento solo puede contener letras y números'),
})

export type GuestSearchData = z.infer<typeof GuestSearchSchema>

/**
 * Schema para realizar check-in
 */
export const CheckInSchema = z.object({
  reservationId: z.string().uuid('ID de reserva inválido'),
  notes: z.string().max(500, 'Las notas son demasiado largas').optional(),
})

export type CheckInData = z.infer<typeof CheckInSchema>

/**
 * Schema para realizar check-out
 */
export const CheckOutSchema = z.object({
  reservationId: z.string().uuid('ID de reserva inválido'),
  additionalCharges: z
    .number()
    .min(0, 'Los cargos adicionales no pueden ser negativos')
    .default(0),
  notes: z.string().max(500, 'Las notas son demasiado largas').optional(),
})

export type CheckOutData = z.infer<typeof CheckOutSchema>

/**
 * Schema para extender estancia
 */
export const ExtendStaySchema = z.object({
  reservationId: z.string().uuid('ID de reserva inválido'),
  newCheckOut: z.string().date('Fecha de check-out inválida'),
  notes: z.string().max(500, 'Las notas son demasiado largas').optional(),
})

export type ExtendStayData = z.infer<typeof ExtendStaySchema>

/**
 * Schema para búsqueda de reserva por código
 */
export const ReservationSearchByCodeSchema = z.object({
  bookingCode: z
    .string()
    .min(1, 'El código de reserva es requerido')
    .regex(/^HSB-\d{8}-\d{4}$/, 'El código de reserva tiene un formato inválido'),
})

export type ReservationSearchByCodeData = z.infer<typeof ReservationSearchByCodeSchema>

/**
 * Schema para búsqueda de reserva por documento del cliente
 */
export const ReservationSearchByDocumentSchema = z.object({
  documentType: z.enum(['DNI', 'CE', 'PASAPORTE']),
  documentNumber: z.string().min(8).max(20),
  onlyActive: z.boolean().optional().default(false),
})

export type ReservationSearchByDocumentData = z.infer<typeof ReservationSearchByDocumentSchema>

/**
 * Schema para búsqueda de reserva por nombre
 */
export const ReservationSearchByNameSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  onlyActive: z.boolean().optional().default(false),
})

export type ReservationSearchByNameData = z.infer<typeof ReservationSearchByNameSchema>

/**
 * Schema para registro walk-in
 * Extiende el BookingSchema pero agrega campos específicos para walk-in
 */
import { BookingSchema } from './booking'

export const WalkInReservationSchema = BookingSchema.extend({
  performCheckIn: z.boolean().default(true),
  checkInDate: z.string().date('Fecha de check-in inválida').optional(),
})

export type WalkInReservationData = z.infer<typeof WalkInReservationSchema>
