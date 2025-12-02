'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, calculateNights } from '@/lib/utils'
import { checkAvailability } from '@/lib/actions/availability'
import { Database } from '@/lib/supabase/types'
import Image from 'next/image'
import { Loader2, Check } from 'lucide-react'

type Room = Database['public']['Tables']['rooms']['Row']

interface StepRoomProps {
  checkIn: string
  checkOut: string
  selectedRoomId: string | null
  onRoomSelect: (roomId: string) => void
  onNext: () => void
  onBack: () => void
}

export function StepRoom({ checkIn, checkOut, selectedRoomId, onRoomSelect, onNext, onBack }: StepRoomProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true)
        const result = await checkAvailability(checkIn, checkOut)
        
        if (result.success && result.rooms) {
          setRooms(result.rooms)
          
          if (result.rooms.length === 0) {
            setError('No hay habitaciones disponibles para las fechas seleccionadas')
          }
        } else {
          setError(result.error || 'Error al cargar habitaciones disponibles')
        }
      } catch (err) {
        setError('Error al cargar habitaciones disponibles')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [checkIn, checkOut])

  const nights = calculateNights(checkIn, checkOut)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
        <Button onClick={onBack} variant="outline">
          ← Atrás
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-navy mb-2">Elige tu habitación</h2>
        <p className="text-gray-600">
          Habitaciones disponibles del {new Date(checkIn).toLocaleDateString('es-PE')} al{' '}
          {new Date(checkOut).toLocaleDateString('es-PE')} ({nights} {nights === 1 ? 'noche' : 'noches'})
        </p>
      </div>

      <div className="space-y-4">
        {rooms.map((room) => {
          const totalPrice = room.price_per_night * nights
          const isSelected = selectedRoomId === room.id
          const firstImage = room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'

          return (
            <Card
              key={room.id}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-gold border-gold' : 'hover:shadow-lg'
              }`}
              onClick={() => onRoomSelect(room.id)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
                  <Image
                    src={firstImage}
                    alt={room.name}
                    fill
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle>{room.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{room.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-gold">
                        {formatCurrency(room.price_per_night)}
                      </span>
                      <span className="text-gray-600">/ noche</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Total ({nights} {nights === 1 ? 'noche' : 'noches'}):</strong>{' '}
                        <span className="text-lg font-semibold text-navy">
                          {formatCurrency(totalPrice)}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRoomSelect(room.id)
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

      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          ← Atrás
        </Button>
        <Button onClick={onNext} disabled={!selectedRoomId}>
          Continuar →
        </Button>
      </div>
    </div>
  )
}

