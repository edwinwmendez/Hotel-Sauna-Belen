'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RESERVATION_STATUS } from '@/lib/constants'
import { Edit, CheckCircle, XCircle, Calendar, Users, CreditCard, Mail, Phone, FileText } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import Link from 'next/link'

// Mock de reserva detallada
const getMockReservation = (id: string) => ({
  id,
  booking_code: 'HSB-20251215-4521',
  guest_name: 'María García López',
  guest_email: 'maria@example.com',
  guest_phone: '987654321',
  guest_document_type: 'DNI',
  guest_document_number: '12345678',
  room_name: 'Suite King con Sauna',
  room_id: '1',
  check_in: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  check_out: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  nights: 2,
  total_price: 500,
  status: 'pending' as const,
  notes: 'Cliente solicita check-in temprano si es posible',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
})

export default function ReservaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [reservation] = useState(getMockReservation(id))

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

  const handleConfirm = () => {
    // TODO: Implementar confirmación
    console.log('Confirmar reserva', id)
  }

  const handleCancel = () => {
    // TODO: Implementar cancelación
    console.log('Cancelar reserva', id)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Detalle de Reserva"
        description={`Código: ${reservation.booking_code}`}
        backHref="/admin/reservas"
      >
        <div className="flex gap-2">
          {reservation.status === 'pending' && (
            <>
              <Button variant="outline" size="sm" onClick={handleConfirm} className="text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel} className="text-red-600">
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </>
          )}
          <Button asChild size="sm">
            <Link href={`/admin/reservas/${id}/editar`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Estado */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Estado de la Reserva</CardTitle>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
              {RESERVATION_STATUS[reservation.status]}
            </span>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Información del Huésped */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Users className="h-5 w-5 text-gold" />
              Información del Huésped
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Nombre completo</p>
              <p className="text-sm sm:text-base font-semibold">{reservation.guest_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Email</p>
                <p className="text-sm sm:text-base font-semibold">{reservation.guest_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Teléfono</p>
                <p className="text-sm sm:text-base font-semibold">{reservation.guest_phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Documento</p>
                <p className="text-sm sm:text-base font-semibold">
                  {reservation.guest_document_type}: {reservation.guest_document_number}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de la Reserva */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="h-5 w-5 text-gold" />
              Información de la Reserva
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Habitación</p>
              <p className="text-sm sm:text-base font-semibold">{reservation.room_name}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Check-in</p>
              <p className="text-sm sm:text-base font-semibold">{formatDate(reservation.check_in)}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Check-out</p>
              <p className="text-sm sm:text-base font-semibold">{formatDate(reservation.check_out)}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Noches</p>
              <p className="text-sm sm:text-base font-semibold">{reservation.nights} {reservation.nights === 1 ? 'noche' : 'noches'}</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t">
              <CreditCard className="h-5 w-5 text-gold" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gold">{formatCurrency(reservation.total_price)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notas */}
      {reservation.notes && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Notas</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base text-gray-700">{reservation.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Información del Sistema */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Creada el:</span>
            <span className="font-semibold">{formatDate(reservation.created_at)}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Última actualización:</span>
            <span className="font-semibold">{formatDate(reservation.updated_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

