'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate, calculateNights } from '@/lib/utils'
import { createReservation } from '@/lib/actions/reservations'
import { Database } from '@/lib/supabase/types'
import { BookingFormData } from '@/lib/validations/booking'
import { Loader2, Check } from 'lucide-react'
import Image from 'next/image'

type Room = Database['public']['Tables']['rooms']['Row']

interface StepSummaryProps {
  room: Room
  checkIn: string
  checkOut: string
  guest: BookingFormData['guest']
  onBack: () => void
}

export function StepSummary({ room, checkIn, checkOut, guest, onBack }: StepSummaryProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const nights = calculateNights(checkIn, checkOut)
  const totalPrice = room.price_per_night * nights
  const firstImage = room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones')
      return
    }

    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('roomId', room.id)
    formData.append('checkIn', checkIn)
    formData.append('checkOut', checkOut)
    formData.append('fullName', guest.fullName)
    formData.append('email', guest.email)
    formData.append('phone', guest.phone)
    formData.append('documentType', guest.documentType)
    formData.append('documentNumber', guest.documentNumber)

    try {
      const result = await createReservation(formData)

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      if (result.success && result.bookingCode) {
        router.push(`/reservar/confirmacion?code=${result.bookingCode}`)
      }
    } catch {
      setError('Error al procesar la reserva. Por favor, intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2">Confirma tu reserva</h2>
        <p className="text-sm sm:text-base text-gray-600">Revisa los detalles antes de confirmar</p>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative h-32 sm:h-24 w-full sm:w-32 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={firstImage}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-xl">{room.name}</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {formatDate(checkIn)} → {formatDate(checkOut)} ({nights} {nights === 1 ? 'noche' : 'noches'})
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-gray-700 mb-2">Datos del huésped</h3>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p><strong>Nombre:</strong> {guest.fullName}</p>
              <p><strong>Email:</strong> {guest.email}</p>
              <p><strong>Teléfono:</strong> {guest.phone}</p>
              <p><strong>Documento:</strong> {guest.documentType} - {guest.documentNumber}</p>
            </div>
          </div>

          <div className="border-t pt-3 sm:pt-4">
            <div className="flex justify-between items-center mb-2 text-sm sm:text-base">
              <span className="text-gray-700">
                Habitación ({nights} {nights === 1 ? 'noche' : 'noches'})
              </span>
              <span className="font-semibold">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-base sm:text-lg font-bold text-navy border-t pt-2 mt-2">
              <span>TOTAL</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy mt-1 flex-shrink-0"
        />
        <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
          He leído y acepto los{' '}
          <a href="/terminos" target="_blank" className="text-navy hover:underline">
            términos y condiciones
          </a>{' '}
          y la{' '}
          <a href="/politica-cancelacion" target="_blank" className="text-navy hover:underline">
            política de cancelación
          </a>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
        <Button onClick={onBack} variant="outline" disabled={loading} className="w-full sm:w-auto order-2 sm:order-1">
          ← Atrás
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !acceptedTerms} size="lg" className="w-full sm:w-auto order-1 sm:order-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Confirmar Reserva
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

