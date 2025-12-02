'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RESERVATION_STATUS } from '@/lib/constants'
import { ArrowLeft, Calendar, Users, CreditCard, Mail, Phone, FileText, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Mock de reserva detallada
const getMockReservation = (id: string) => ({
  id,
  booking_code: 'HSB-20251215-4521',
  room: {
    name: 'Habitación Matrimonial con Sauna',
    slug: 'habitacion-matrimonial-sauna',
    price_per_night: 180,
  },
  guest: {
    full_name: 'María García López',
    email: 'maria@example.com',
    phone: '987654321',
    document_type: 'DNI',
    document_number: '12345678',
  },
  check_in: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  check_out: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  nights: 2,
  total_price: 360,
  status: 'confirmed' as const,
  notes: null,
  created_at: new Date().toISOString(),
})

export default function ReservaDetailPage() {
  const params = useParams()
  const [reservation] = useState(getMockReservation(params.id as string))

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
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="py-6 sm:py-8 md:py-12">
      <div className="container max-w-4xl px-4">
        <Button asChild variant="ghost" className="mb-4 sm:mb-6 text-sm sm:text-base">
          <Link href="/mis-reservas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a mis reservas
          </Link>
        </Button>

        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl sm:text-2xl mb-2">{reservation.room.name}</CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="font-mono text-sm sm:text-base">{reservation.booking_code}</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(reservation.status)}`}>
                      {RESERVATION_STATUS[reservation.status]}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Fechas y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                  Fechas de Estadía
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Check-in</p>
                  <p className="text-sm sm:text-base font-semibold">{formatDate(reservation.check_in)}</p>
                  <p className="text-xs text-gray-500">Desde las 14:00</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Check-out</p>
                  <p className="text-sm sm:text-base font-semibold">{formatDate(reservation.check_out)}</p>
                  <p className="text-xs text-gray-500">Hasta las 12:00</p>
                </div>
                <div className="pt-2 sm:pt-3 border-t">
                  <p className="text-xs sm:text-sm text-gray-600">Duración</p>
                  <p className="text-sm sm:text-base font-semibold">{reservation.nights} {reservation.nights === 1 ? 'noche' : 'noches'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                  Detalles de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">
                    {reservation.room.name} ({reservation.nights} {reservation.nights === 1 ? 'noche' : 'noches'})
                  </span>
                  <span className="font-semibold">{formatCurrency(reservation.total_price)}</span>
                </div>
                <div className="pt-2 sm:pt-3 border-t flex justify-between items-center">
                  <span className="font-semibold text-base sm:text-lg">Total</span>
                  <span className="font-bold text-lg sm:text-xl text-navy">{formatCurrency(reservation.total_price)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  El pago se realiza al momento del check-in
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Datos del Huésped */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                Datos del Huésped
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Nombre completo</p>
                  <p className="text-sm sm:text-base font-semibold">{reservation.guest.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Email</p>
                  <p className="text-sm sm:text-base font-semibold break-all">{reservation.guest.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Teléfono</p>
                  <p className="text-sm sm:text-base font-semibold">{reservation.guest.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Documento</p>
                  <p className="text-sm sm:text-base font-semibold">
                    {reservation.guest.document_type} - {reservation.guest.document_number}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          {reservation.status === 'confirmed' && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 sm:p-6 pt-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-yellow-800 mb-2">¿Necesitas cancelar?</h3>
                    <p className="text-xs sm:text-sm text-yellow-700 mb-3 sm:mb-4">
                      Puedes solicitar la cancelación de tu reserva. La cancelación es gratuita hasta 48 horas antes del check-in.
                    </p>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto text-red-600 hover:text-red-700">
                      Solicitar Cancelación
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

