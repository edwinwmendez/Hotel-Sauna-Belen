'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { MOCK_ROOMS } from '@/lib/supabase/mock'
import { ArrowLeft, Edit, CheckCircle, XCircle, Bed, Users, DollarSign, Wifi } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HabitacionDetailPage() {
  const params = useParams()
  const id = params.id as string
  const room = MOCK_ROOMS.find(r => r.id === id)

  if (!room) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Habitación no encontrada</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/admin/habitaciones">Volver a Habitaciones</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/habitaciones">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy">{room.name}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{room.type}</p>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href={`/admin/habitaciones/${id}/editar`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Imágenes */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Imágenes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {room.images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${room.name} - Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Información Principal */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Información Principal</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Precio por noche</p>
                <p className="text-xl sm:text-2xl font-bold text-gold">
                  {formatCurrency(room.price_per_night)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gold" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Capacidad</p>
                <p className="text-sm sm:text-base font-semibold">
                  {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-gold" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Estado</p>
                <p className="text-sm sm:text-base font-semibold">
                  {room.is_active ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Activa
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      Inactiva
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Descripción */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Descripción</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <p className="text-sm sm:text-base text-gray-700">{room.description}</p>
        </CardContent>
      </Card>

      {/* Amenidades */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Wifi className="h-5 w-5 text-gold" />
            Amenidades
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {room.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Creada el:</span>
            <span className="font-semibold">{new Date(room.created_at).toLocaleDateString('es-PE')}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Última actualización:</span>
            <span className="font-semibold">{new Date(room.updated_at).toLocaleDateString('es-PE')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

