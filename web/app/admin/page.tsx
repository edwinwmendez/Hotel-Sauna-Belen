'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Mock data
const MOCK_STATS = {
  checkInsToday: 3,
  checkOutsToday: 2,
  pendingReservations: 1,
  occupancyRate: 67,
}

const MOCK_TODAY_RESERVATIONS = [
  {
    id: '1',
    booking_code: 'HSB-20251215-4521',
    guest_name: 'María García López',
    room_name: 'Suite King',
    status: 'confirmed',
    check_in: new Date().toISOString().split('T')[0],
  },
  {
    id: '2',
    booking_code: 'HSB-20251215-3892',
    guest_name: 'Carlos Rodríguez',
    room_name: 'Matrimonial',
    status: 'pending',
    check_in: new Date().toISOString().split('T')[0],
  },
  {
    id: '3',
    booking_code: 'HSB-20251214-2156',
    guest_name: 'Ana Torres',
    room_name: 'Simple',
    status: 'confirmed',
    check_out: new Date().toISOString().split('T')[0],
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(MOCK_STATS)
  const [reservations, setReservations] = useState(MOCK_TODAY_RESERVATIONS)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Dashboard</h1>
        <p className="text-gray-600">Resumen de operaciones del hotel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Check-ins Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">{stats.checkInsToday}</div>
            <p className="text-xs text-gray-500 mt-1">Reservas que llegan hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Check-outs Hoy</CardTitle>
            <Users className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">{stats.checkOutsToday}</div>
            <p className="text-xs text-gray-500 mt-1">Reservas que salen hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">{stats.pendingReservations}</div>
            <p className="text-xs text-gray-500 mt-1">Reservas por confirmar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ocupación</CardTitle>
            <TrendingUp className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">{stats.occupancyRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Tasa de ocupación actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Reservas de Hoy */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reservas de Hoy</CardTitle>
              <CardDescription>Check-ins y check-outs programados para hoy</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/reservas">Ver Todas</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay reservas para hoy</p>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-gray-600">
                        {reservation.booking_code}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reservation.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 mt-1">{reservation.guest_name}</p>
                    <p className="text-sm text-gray-600">{reservation.room_name}</p>
                  </div>
                  <div className="text-right">
                    {reservation.check_in && (
                      <div className="text-sm">
                        <p className="text-gray-600">Check-in</p>
                        <p className="font-semibold">
                          {new Date(reservation.check_in).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                    )}
                    {reservation.check_out && (
                      <div className="text-sm">
                        <p className="text-gray-600">Check-out</p>
                        <p className="font-semibold">
                          {new Date(reservation.check_out).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/reservas">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" />
                Gestión de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Ver, confirmar y gestionar todas las reservas
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/calendario">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gold" />
                Calendario de Ocupación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Vista mensual de ocupación por habitación
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link href="/admin/inventario">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gold" />
                Control de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Gestiona productos y alertas de stock
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}

