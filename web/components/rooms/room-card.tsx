import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { ROOM_TYPES } from '@/lib/constants'
import { Database } from '@/lib/supabase/types'

type Room = Database['public']['Tables']['rooms']['Row']

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const amenities = Array.isArray(room.amenities) ? room.amenities : []
  const firstImage = room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      <div className="relative h-48 sm:h-56 md:h-64 w-full">
        <Image
          src={firstImage}
          alt={room.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">{room.name}</CardTitle>
        <CardDescription className="text-sm sm:text-base line-clamp-2">
          {room.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-gold">{formatCurrency(room.price_per_night)}</span>
            <span className="text-sm sm:text-base text-gray-600">/ noche</span>
          </div>
          
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="text-xs bg-cream px-2 py-1 rounded-full text-gray-700"
                >
                  {String(amenity)}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-xs text-gray-500">+{amenities.length - 3} más</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row gap-2">
        <Button asChild variant="outline" className="w-full sm:flex-1">
          <Link href={`/habitaciones/${room.slug}`}>Ver detalles</Link>
        </Button>
        <Button asChild variant="default" className="w-full sm:flex-1">
          <Link href={`/reservar?room=${room.slug}`}>Reservar</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

