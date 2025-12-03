'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RESERVATION_STATUS } from '@/lib/constants'
import { Search, Filter, Eye, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import Link from 'next/link'

// Mock de reservas
const MOCK_RESERVATIONS = [
  {
    id: '1',
    booking_code: 'HSB-20251215-4521',
    guest_name: 'María García López',
    guest_email: 'maria@example.com',
    room_name: 'Suite King con Sauna',
    check_in: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    check_out: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nights: 2,
    total_price: 500,
    status: 'confirmed' as const,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    booking_code: 'HSB-20251215-3892',
    guest_name: 'Carlos Rodríguez',
    guest_email: 'carlos@example.com',
    room_name: 'Habitación Matrimonial con Sauna',
    check_in: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    check_out: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nights: 2,
    total_price: 360,
    status: 'pending' as const,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    booking_code: 'HSB-20251210-2156',
    guest_name: 'Ana Torres',
    guest_email: 'ana@example.com',
    room_name: 'Habitación Simple con Sauna',
    check_in: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    check_out: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nights: 2,
    total_price: 240,
    status: 'completed' as const,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function ReservasPage() {
  const [reservations] = useState(MOCK_RESERVATIONS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guest_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Gestión de Reservas"
        description="Administra todas las reservas del hotel"
        icon={Calendar}
        backHref="/admin"
      />

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="completed">Completada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Reservas */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">
            Reservas ({filteredReservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-4 sm:p-6">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <p className="text-sm sm:text-base text-gray-500">No se encontraron reservas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Vista Desktop - Tabla */}
              <table className="w-full hidden md:table">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Código</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Huésped</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Habitación</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Fechas</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{reservation.booking_code}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-sm">{reservation.guest_name}</p>
                          <p className="text-xs text-gray-600">{reservation.guest_email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{reservation.room_name}</td>
                      <td className="py-3 px-4">
                        <div className="text-xs sm:text-sm">
                          <p>{formatDate(reservation.check_in)}</p>
                          <p className="text-gray-600">→ {formatDate(reservation.check_out)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-sm">
                        {formatCurrency(reservation.total_price)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {RESERVATION_STATUS[reservation.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/reservas/${reservation.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {reservation.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" className="text-green-600">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Vista Mobile - Cards */}
              <div className="md:hidden space-y-3 p-4">
                {filteredReservations.map((reservation) => (
                  <Card key={reservation.id} className="border">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base mb-1">{reservation.guest_name}</CardTitle>
                          <CardDescription className="text-xs">
                            <span className="font-mono">{reservation.booking_code}</span>
                          </CardDescription>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {RESERVATION_STATUS[reservation.status]}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="text-sm">
                        <p className="text-gray-600">Habitación</p>
                        <p className="font-semibold">{reservation.room_name}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Fechas</p>
                        <p className="font-semibold">
                          {formatDate(reservation.check_in)} → {formatDate(reservation.check_out)}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Total</p>
                        <p className="font-semibold text-base">{formatCurrency(reservation.total_price)}</p>
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/admin/reservas/${reservation.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Link>
                        </Button>
                        {reservation.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

