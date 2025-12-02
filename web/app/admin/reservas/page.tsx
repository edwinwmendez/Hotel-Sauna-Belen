'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RESERVATION_STATUS } from '@/lib/constants'
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react'
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
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS)
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Gestión de Reservas</h1>
        <p className="text-gray-600">Administra todas las reservas del hotel</p>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
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
              className="flex h-10 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
        <CardHeader>
          <CardTitle>
            Reservas ({filteredReservations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron reservas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Código</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Huésped</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Habitación</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Fechas</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
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
                          <p className="font-semibold">{reservation.guest_name}</p>
                          <p className="text-sm text-gray-600">{reservation.guest_email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{reservation.room_name}</td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p>{formatDate(reservation.check_in)}</p>
                          <p className="text-gray-600">→ {formatDate(reservation.check_out)}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

