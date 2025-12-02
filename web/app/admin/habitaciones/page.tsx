'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { MOCK_ROOMS } from '@/lib/supabase/mock'

export default function HabitacionesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Gestión de Habitaciones</h1>
          <p className="text-gray-600">Administra las habitaciones del hotel</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Habitación
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ROOMS.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Tipo</p>
                <p className="font-semibold">{room.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Precio por noche</p>
                <p className="text-2xl font-bold text-gold">
                  {formatCurrency(room.price_per_night)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacidad</p>
                <p className="font-semibold">{room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}</p>
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

