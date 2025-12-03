'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ReservationWithDetails } from '@/lib/queries/reception'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RESERVATION_STATUS, ROOM_TYPES } from '@/lib/constants'
import {
  Calendar,
  Users,
  CreditCard,
  Mail,
  Phone,
  FileText,
  Hash,
  Home,
  CheckCircle,
  Plus,
  DollarSign,
} from 'lucide-react'

interface CheckoutDetailCardProps {
  reservation: ReservationWithDetails
  onCheckout: (additionalCharges: number, notes?: string) => void
  disabled?: boolean
}

export function CheckoutDetailCard({
  reservation,
  onCheckout,
  disabled = false,
}: CheckoutDetailCardProps) {
  const { reservation: res, guest, room } = reservation
  const [additionalCharges, setAdditionalCharges] = useState<string>('0')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const basePrice = Number(res.total_price) || 0
  const additionalChargesNum = parseFloat(additionalCharges) || 0
  const totalFinal = basePrice + additionalChargesNum

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      await onCheckout(additionalChargesNum, notes.trim() || undefined)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'checked-in':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'no_show':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="border-2">
      <CardHeader className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Hash className="h-5 w-5 text-navy" />
              {res.booking_code}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1 flex items-center gap-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(res.status)}`}
              >
                {RESERVATION_STATUS[res.status as keyof typeof RESERVATION_STATUS] || res.status}
              </span>
              {res.checked_in_at && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Check-in realizado
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del cliente */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-navy" />
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Nombre completo</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                    {guest.full_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Documento</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {guest.document_type}: {guest.document_number}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Email</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 break-all">
                    {guest.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Teléfono</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {guest.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de la reserva */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Home className="h-4 w-4 text-navy" />
              Información de la Reserva
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Habitación</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {room.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ROOM_TYPES[room.type as keyof typeof ROOM_TYPES] || room.type}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">Estadía</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {res.nights} {res.nights === 1 ? 'noche' : 'noches'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(res.check_in)} - {formatDate(res.check_out)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de check-in si existe */}
          {res.checked_in_at && (
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-900">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Check-in realizado:</span>
                <span>
                  {new Date(res.checked_in_at).toLocaleString('es-PE', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Desglose financiero */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-navy" />
              Resumen Financiero
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm sm:text-base text-gray-700">Precio de la reserva</span>
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  {formatCurrency(basePrice)}
                </span>
              </div>

              <div className="space-y-2">
                <label htmlFor="additionalCharges" className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2 mb-2 block">
                  <Plus className="h-4 w-4 text-gray-600" />
                  Cargos adicionales (servicios extra, etc.)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="additionalCharges"
                    type="number"
                    step="0.01"
                    min="0"
                    value={additionalCharges}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
                        setAdditionalCharges(value)
                      }
                    }}
                    placeholder="0.00"
                    className="pl-10"
                    disabled={disabled || isSubmitting}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Ingrese el monto de servicios adicionales si aplica (ej: minibar, lavandería, etc.)
                </p>
              </div>

              <div className="flex items-center justify-between py-3 border-t-2 border-gray-300">
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  Total a pagar
                </span>
                <span className="text-xl sm:text-2xl font-bold text-navy">
                  {formatCurrency(totalFinal)}
                </span>
              </div>
            </div>
          </div>

          {/* Campo de notas */}
          <div className="border-t pt-4">
            <label htmlFor="notes" className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-2 mb-2 block">
              <FileText className="h-4 w-4 text-gray-600" />
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar notas sobre el check-out..."
              rows={3}
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              disabled={disabled || isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Información adicional sobre el check-out o servicios utilizados
            </p>
          </div>

          {/* Botón de acción */}
          <div className="border-t pt-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={disabled || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Procesando check-out...
                </>
              ) : (
                <>
                  Realizar Check-out - {formatCurrency(totalFinal)}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

