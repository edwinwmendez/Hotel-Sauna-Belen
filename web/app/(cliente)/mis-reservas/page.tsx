'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RESERVATION_STATUS } from '@/lib/constants'
import { Calendar, MapPin, Users, CreditCard, AlertCircle } from 'lucide-react'
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
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS)

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
    <div className="py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Mis Reservas</h1>
          <p className="text-gray-600">Gestiona y revisa todas tus reservas</p>
        </div>

        {reservations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No tienes reservas aún
              </h3>
              <p className="text-gray-600 mb-6">
                Cuando hagas una reserva, aparecerá aquí
              </p>
              <Button asChild>
                <Link href="/reservar">Hacer una Reserva</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{reservation.room.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="font-mono text-sm">{reservation.booking_code}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {RESERVATION_STATUS[reservation.status]}
                        </span>
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {RESERVATION_STATUS[reservation.status]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold">{formatDate(reservation.check_in)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-semibold">{formatDate(reservation.check_out)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-semibold text-lg">{formatCurrency(reservation.total_price)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/mis-reservas/${reservation.id}`}>Ver Detalles</Link>
                    </Button>
                    {reservation.status === 'confirmed' && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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

