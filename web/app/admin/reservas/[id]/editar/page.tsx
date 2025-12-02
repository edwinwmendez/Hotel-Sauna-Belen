'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { RESERVATION_STATUS } from '@/lib/constants'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Mock de reserva
const getMockReservation = (id: string) => ({
  id,
  booking_code: 'HSB-20251215-4521',
  guest_name: 'María García López',
  guest_email: 'maria@example.com',
  guest_phone: '987654321',
  guest_document_type: 'DNI',
  guest_document_number: '12345678',
  room_id: '1',
  room_name: 'Suite King con Sauna',
  check_in: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  check_out: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  nights: 2,
  total_price: 500,
  status: 'confirmed' as const,
  notes: 'Cliente solicita check-in temprano si es posible',
})

export default function EditarReservaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [reservation, setReservation] = useState(getMockReservation(id))
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: Implementar actualización real
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Reserva actualizada correctamente')
    setLoading(false)
    router.push(`/admin/reservas/${id}`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/reservas/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy">Editar Reserva</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Código: <span className="font-mono">{reservation.booking_code}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Información del Huésped */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Información del Huésped</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Nombre completo
                </label>
                <Input
                  value={reservation.guest_name}
                  onChange={(e) => setReservation({ ...reservation, guest_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Email
                </label>
                <Input
                  type="email"
                  value={reservation.guest_email}
                  onChange={(e) => setReservation({ ...reservation, guest_email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  value={reservation.guest_phone}
                  onChange={(e) => setReservation({ ...reservation, guest_phone: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                    Tipo de documento
                  </label>
                  <Select
                    value={reservation.guest_document_type}
                    onChange={(e) => setReservation({ ...reservation, guest_document_type: e.target.value })}
                    required
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="PASAPORTE">Pasaporte</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                    Número de documento
                  </label>
                  <Input
                    value={reservation.guest_document_number}
                    onChange={(e) => setReservation({ ...reservation, guest_document_number: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Reserva */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Información de la Reserva</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Habitación
                </label>
                <Input value={reservation.room_name} disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                    Check-in
                  </label>
                  <Input
                    type="date"
                    value={reservation.check_in}
                    onChange={(e) => setReservation({ ...reservation, check_in: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                    Check-out
                  </label>
                  <Input
                    type="date"
                    value={reservation.check_out}
                    onChange={(e) => setReservation({ ...reservation, check_out: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Estado
                </label>
                <Select
                  value={reservation.status}
                  onChange={(e) => setReservation({ ...reservation, status: e.target.value as any })}
                  required
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="completed">Completada</option>
                </Select>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Precio total
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={reservation.total_price}
                  onChange={(e) => setReservation({ ...reservation, total_price: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notas */}
        <Card className="mt-4 sm:mt-6">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Notas</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={reservation.notes || ''}
              onChange={(e) => setReservation({ ...reservation, notes: e.target.value })}
              placeholder="Notas adicionales sobre la reserva..."
            />
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/admin/reservas/${id}`}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

