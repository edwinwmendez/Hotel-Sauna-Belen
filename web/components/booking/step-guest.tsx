'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookingSchema, type BookingFormData } from '@/lib/validations/booking'
import { DOCUMENT_TYPES } from '@/lib/constants'

interface StepGuestProps {
  guestData: Partial<BookingFormData['guest']> | null
  onCreateAccount: boolean
  onGuestDataChange: (data: BookingFormData['guest'], createAccount: boolean) => void
  onNext: () => void
  onBack: () => void
}

export function StepGuest({
  guestData,
  onCreateAccount,
  onGuestDataChange,
  onNext,
  onBack,
}: StepGuestProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BookingFormData['guest'] & { createAccount: boolean }>({
    resolver: zodResolver(
      BookingSchema.shape.guest.extend({ 
        createAccount: z.boolean().optional() 
      })
    ),
    defaultValues: {
      fullName: guestData?.fullName || '',
      email: guestData?.email || '',
      phone: guestData?.phone || '',
      documentType: guestData?.documentType || 'DNI',
      documentNumber: guestData?.documentNumber || '',
      createAccount: onCreateAccount,
    },
  })

  // const createAccount = watch('createAccount') // Usado en el formulario

  const onSubmit = (data: BookingFormData['guest'] & { createAccount: boolean }) => {
    const { createAccount, ...guest } = data
    onGuestDataChange(guest, createAccount)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2">¿Quién se hospeda?</h2>
        <p className="text-sm sm:text-base text-gray-600">Ingresa los datos del huésped principal</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Nombre completo *
          </label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder="Juan Pérez García"
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Correo electrónico *
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="tu@email.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-xs sm:text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Teléfono (WhatsApp) *
            </label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="987654321"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-xs sm:text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label htmlFor="documentType" className="text-sm font-medium text-gray-700">
              Tipo de documento
            </label>
            <select
              id="documentType"
              {...register('documentType')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="documentNumber" className="text-sm font-medium text-gray-700">
              Número de documento *
            </label>
            <Input
              id="documentNumber"
              {...register('documentNumber')}
              placeholder="12345678"
              className={errors.documentNumber ? 'border-red-500' : ''}
            />
            {errors.documentNumber && (
              <p className="text-sm text-red-600">{errors.documentNumber.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="createAccount"
            {...register('createAccount')}
            className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
          />
          <label htmlFor="createAccount" className="text-sm text-gray-700">
            Deseo crear una cuenta para gestionar mis futuras reservas
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
        <Button type="button" onClick={onBack} variant="outline" className="w-full sm:w-auto order-2 sm:order-1">
          ← Atrás
        </Button>
        <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2">Continuar →</Button>
      </div>
    </form>
  )
}

