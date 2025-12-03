'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Clock,
} from 'lucide-react'

interface ReservationDetailCardProps {
  reservation: ReservationWithDetails
  onAction: () => void
  actionLabel: string | React.ReactNode
  actionVariant?: 'default' | 'destructive' | 'outline'
  showFullDetails?: boolean
  disabled?: boolean
}

export function ReservationDetailCard({
  reservation,
  onAction,
  actionLabel,
  actionVariant = 'default',
  showFullDetails = true,
  disabled = false,
}: ReservationDetailCardProps) {
  const { reservation: res, guest, room } = reservation

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'no_show':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isCheckedIn = !!res.checked_in_at
  const isCheckedOut = !!res.checked_out_at

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
              {isCheckedIn && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Check-in realizado
                </span>
              )}
              {isCheckedOut && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Check-out realizado
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onAction}
              variant={actionVariant}
              disabled={disabled}
              className="flex-shrink-0"
            >
              {actionLabel}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
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

        {/* Información de la habitación y fechas */}
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

        {/* Desglose de huéspedes */}
        {showFullDetails && (
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-navy" />
              Desglose de Huéspedes
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Adultos</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{res.adults}</p>
                </div>
                {res.youths > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Jóvenes</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{res.youths}</p>
                  </div>
                )}
                {res.children > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Niños</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{res.children}</p>
                  </div>
                )}
                {res.infants > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Bebés</p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">{res.infants}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Información financiera */}
        <div className="border-t pt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Precio Total</p>
                <p className="text-xl sm:text-2xl font-bold text-navy">
                  {formatCurrency(res.total_price)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de check-in/check-out si está disponible */}
        {showFullDetails && (isCheckedIn || isCheckedOut) && (
          <div className="border-t pt-4 space-y-2">
            {isCheckedIn && res.checked_in_at && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Check-in:</span>
                <span>
                  {new Date(res.checked_in_at).toLocaleString('es-PE', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
            {isCheckedOut && res.checked_out_at && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Check-out:</span>
                <span>
                  {new Date(res.checked_out_at).toLocaleString('es-PE', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Notas si existen */}
        {showFullDetails && res.notes && (
          <div className="border-t pt-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Notas</p>
                <p className="text-sm sm:text-base text-gray-900 whitespace-pre-wrap">
                  {res.notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

