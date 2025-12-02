'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RESERVATION_STATUS } from '@/lib/constants'
import { Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'

// Mock de reservas
const MOCK_RESERVATIONS = [
  {
    id: '1',
    booking_code: 'HSB-20251215-4521',
    room: {
      name: 'Habitación Matrimonial con Sauna',
      slug: 'habitacion-matrimonial-sauna',
    },
    check_in: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    check_out: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nights: 2,
    total_price: 360,
    status: 'confirmed' as const,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    booking_code: 'HSB-20251210-3892',
    room: {
      name: 'Suite King con Sauna',
      slug: 'suite-king-sauna',
    },
    check_in: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    check_out: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nights: 2,
    total_price: 500,
    status: 'completed' as const,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function MisReservasPage() {
  const [reservations] = useState(MOCK_RESERVATIONS)

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
      <div className="container px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">Mis Reservas</h1>
          <p className="text-sm sm:text-base text-gray-600">Gestiona y revisa todas tus reservas</p>
        </div>

        {reservations.length === 0 ? (
          <Card>
            <CardContent className="py-8 sm:py-12 text-center">
              <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
                No tienes reservas aún
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Cuando hagas una reserva, aparecerá aquí
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/reservar">Hacer una Reserva</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl mb-2">{reservation.room.name}</CardTitle>
                      <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm">{reservation.booking_code}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(reservation.status)}`}>
                          {RESERVATION_STATUS[reservation.status]}
                        </span>
                      </CardDescription>
                    </div>
                    <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {RESERVATION_STATUS[reservation.status]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Check-in</p>
                        <p className="text-sm sm:text-base font-semibold">{formatDate(reservation.check_in)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Check-out</p>
                        <p className="text-sm sm:text-base font-semibold">{formatDate(reservation.check_out)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Total</p>
                        <p className="text-base sm:text-lg font-semibold">{formatCurrency(reservation.total_price)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t">
                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                      <Link href={`/mis-reservas/${reservation.id}`}>Ver Detalles</Link>
                    </Button>
                    {reservation.status === 'confirmed' && (
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-red-600 hover:text-red-700">
                        Solicitar Cancelación
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

