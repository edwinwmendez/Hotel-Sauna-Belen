'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, calculateNights } from '@/lib/utils'
import { getRoomCapacityDisplay } from '@/lib/utils/room-capacity'
import { checkAvailability } from '@/lib/actions/availability'
import { Database } from '@/lib/supabase/types'
import Image from 'next/image'
import { Loader2, Users, Home } from 'lucide-react'

type Room = Database['public']['Tables']['rooms']['Row']

interface RoomSelectorReceptionProps {
  checkIn: string
  checkOut: string
  guests?: { adults: number; youths: number; children: number; infants: number }
  onRoomSelect: (room: Room) => void
  selectedRoomId?: string | null
}

export function RoomSelectorReception({
  checkIn,
  checkOut,
  guests,
  onRoomSelect,
  selectedRoomId,
}: RoomSelectorReceptionProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true)
        setError('')
        
        const result = await checkAvailability(checkIn, checkOut, guests)
        
        if (result.success && result.rooms) {
          setRooms(result.rooms)
        }
        
        if (!result.success || !result.rooms || result.rooms.length === 0) {
          const totalGuests = guests ? guests.adults + guests.youths + guests.children + guests.infants : 0
          if (guests && totalGuests > 0) {
            setError('No hay habitaciones disponibles para las fechas y número de huéspedes seleccionados')
          } else {
            setError('No hay habitaciones disponibles para las fechas seleccionadas')
          }
        }
      } catch (err) {
        console.error('Error cargando habitaciones:', err)
        setError('Error al cargar habitaciones disponibles')
      } finally {
        setLoading(false)
      }
    }

    if (checkIn && checkOut) {
      fetchRooms()
    }
  }, [checkIn, checkOut, guests])

  const nights = calculateNights(checkIn, checkOut)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <span className="ml-3 text-gray-600">Buscando habitaciones disponibles...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Sin habitaciones disponibles</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">No se encontraron habitaciones disponibles</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
          Habitaciones Disponibles
        </h3>
        <p className="text-sm text-gray-600">
          {nights} {nights === 1 ? 'noche' : 'noches'} • {rooms.length} {rooms.length === 1 ? 'habitación disponible' : 'habitaciones disponibles'}
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {rooms.map((room) => {
          const totalPrice = room.price_per_night * nights
          const isSelected = selectedRoomId === room.id
          const firstImage = room.images && room.images.length > 0 
            ? room.images[0] 
            : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'

          return (
            <Card
              key={room.id}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-gold border-gold bg-gold/5' : 'hover:shadow-lg'
              }`}
              onClick={() => onRoomSelect(room)}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-48 sm:h-auto sm:w-48 md:w-64 flex-shrink-0">
                  <Image
                    src={firstImage}
                    alt={room.name}
                    fill
                    className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">{room.name}</CardTitle>
                    <CardDescription className="text-sm sm:text-base line-clamp-2">
                      {room.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-gold">
                        {formatCurrency(room.price_per_night)}
                      </span>
                      <span className="text-sm sm:text-base text-gray-600">/ noche</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span><strong>Capacidad:</strong> {getRoomCapacityDisplay(room)}</span>
                      </div>
                      <p>
                        <strong>Total ({nights} {nights === 1 ? 'noche' : 'noches'}):</strong>{' '}
                        <span className="text-base sm:text-lg font-semibold text-navy">
                          {formatCurrency(totalPrice)}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 sm:p-6 pt-0">
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRoomSelect(room)
                      }}
                    >
                      {isSelected ? '✓ Seleccionada' : 'Seleccionar'}
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

