import { z } from 'zod'

export const BookingSchema = z.object({
  roomId: z.string().uuid('ID de habitación inválido'),
  checkIn: z.string().date('Fecha de check-in inválida'),
  checkOut: z.string().date('Fecha de check-out inválida'),
  guests: z.object({
    adults: z.number().min(1, 'Debe haber al menos 1 adulto').max(6, 'Máximo 6 adultos'),
    youths: z.number().min(0, 'No puede ser negativo').max(6, 'Máximo 6 jóvenes').default(0),
    children: z.number().min(0, 'No puede ser negativo').max(6, 'Máximo 6 niños').default(0),
    infants: z.number().min(0, 'No puede ser negativo').max(6, 'Máximo 6 bebés').default(0),
  }),
  guest: z.object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200, 'El nombre es demasiado largo'),
    email: z.string().email('Email inválido'),
    phone: z.string().regex(/^9\d{8}$/, 'El teléfono debe tener 9 dígitos y empezar con 9'),
    documentType: z.enum(['DNI', 'CE', 'PASAPORTE'], {
      errorMap: () => ({ message: 'Tipo de documento inválido' }),
    }),
    documentNumber: z.string().min(8, 'El documento debe tener al menos 8 caracteres').max(20, 'El documento es demasiado largo'),
  }),
  createAccount: z.boolean().optional(),
})

export type BookingFormData = z.infer<typeof BookingSchema>

