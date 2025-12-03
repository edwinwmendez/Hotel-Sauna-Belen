'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, AlertCircle, TrendingUp, Package, ArrowRight } from 'lucide-react'
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
  const [stats] = useState(MOCK_STATS)
  const [reservations] = useState(MOCK_TODAY_RESERVATIONS)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Resumen de operaciones del hotel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Check-ins Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy">{stats.checkInsToday}</div>
            <p className="text-xs text-gray-500 mt-1">Reservas que llegan hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Check-outs Hoy</CardTitle>
            <Users className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy">{stats.checkOutsToday}</div>
            <p className="text-xs text-gray-500 mt-1">Reservas que salen hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy">{stats.pendingReservations}</div>
            <p className="text-xs text-gray-500 mt-1">Reservas por confirmar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Ocupación</CardTitle>
            <TrendingUp className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy">{stats.occupancyRate}%</div>
            <p className="text-xs text-gray-500 mt-1">Tasa de ocupación actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Reservas de Hoy */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <CardTitle className="text-lg sm:text-xl">Reservas de Hoy</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Check-ins y check-outs programados para hoy</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
              <Link href="/admin/reservas">Ver Todas</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {reservations.length === 0 ? (
            <p className="text-center text-sm sm:text-base text-gray-500 py-6 sm:py-8">No hay reservas para hoy</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono text-xs sm:text-sm text-gray-600">
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
                    <p className="font-semibold text-sm sm:text-base text-gray-900 mt-1">{reservation.guest_name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{reservation.room_name}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    {reservation.check_in && (
                      <div className="text-xs sm:text-sm">
                        <p className="text-gray-600">Check-in</p>
                        <p className="font-semibold">
                          {new Date(reservation.check_in).toLocaleDateString('es-PE')}
                        </p>
                      </div>
                    )}
                    {reservation.check_out && (
                      <div className="text-xs sm:text-sm">
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
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-navy mb-4 sm:mb-6">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Button
            asChild
            variant="outline"
            className="h-auto p-0 flex-col items-stretch hover:border-gold hover:bg-gold/5 transition-all group"
          >
            <Link href="/admin/reservas" className="p-4 sm:p-6 text-left">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 sm:p-3 bg-gold/10 rounded-lg group-hover:bg-gold/20 transition-colors">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Gestión de Reservas</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Ver, confirmar y gestionar todas las reservas
              </p>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto p-0 flex-col items-stretch hover:border-gold hover:bg-gold/5 transition-all group"
          >
            <Link href="/admin/calendario" className="p-4 sm:p-6 text-left">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 sm:p-3 bg-navy/10 rounded-lg group-hover:bg-navy/20 transition-colors">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-navy" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Calendario de Ocupación</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Vista mensual de ocupación por habitación
              </p>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto p-0 flex-col items-stretch hover:border-gold hover:bg-gold/5 transition-all group"
          >
            <Link href="/admin/inventario" className="p-4 sm:p-6 text-left">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Control de Inventario</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Gestiona productos y alertas de stock
              </p>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

