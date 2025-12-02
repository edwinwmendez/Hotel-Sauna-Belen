'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { MOCK_ROOMS } from '@/lib/supabase/mock'

export default function HabitacionesPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-2">Gestión de Habitaciones</h1>
          <p className="text-sm sm:text-base text-gray-600">Administra las habitaciones del hotel</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/habitaciones/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Habitación
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {MOCK_ROOMS.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">{room.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Tipo</p>
                <p className="text-sm sm:text-base font-semibold">{room.type}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Precio por noche</p>
                <p className="text-xl sm:text-2xl font-bold text-gold">
                  {formatCurrency(room.price_per_night)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Capacidad</p>
                <p className="text-sm sm:text-base font-semibold">{room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/admin/habitaciones/${room.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

