import { notFound } from 'next/navigation'
import { getRoomBySlug } from '@/lib/queries/rooms'
import { RoomGallery } from '@/components/rooms/room-gallery'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { getRoomCapacityDisplay } from '@/lib/utils/room-capacity'
import Link from 'next/link'
import { ArrowLeft, Users, Check } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const room = await getRoomBySlug(slug)

  if (!room) {
    return {
      title: 'Habitación no encontrada',
    }
  }

  return {
    title: room.name,
    description: room.description || `Reserva ${room.name} en Hotel Sauna Belén`,
  }
}

export default async function RoomDetailPage({ params }: PageProps) {
  const { slug } = await params
  const room = await getRoomBySlug(slug)

  if (!room) {
    notFound()
  }

  const amenities = Array.isArray(room.amenities) ? room.amenities : []

  return (
    <div className="py-8 sm:py-12 bg-gray-50">
      <div className="container px-4">
        <Button asChild variant="ghost" className="mb-4 sm:mb-6 text-sm sm:text-base">
          <Link href="/habitaciones">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a habitaciones
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Galería */}
          <div>
            <RoomGallery images={room.images || []} roomName={room.name} />
          </div>

          {/* Información */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-3 sm:mb-4 font-serif">
                {room.name}
              </h1>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                {room.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm sm:text-base text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span><strong>Capacidad:</strong> {getRoomCapacityDisplay(room)}</span>
              </div>
            </div>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Amenidades</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{String(amenity)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-gold">
                  {formatCurrency(room.price_per_night)}
                </span>
                <span className="text-sm sm:text-base text-gray-600">/ noche</span>
              </div>

              <Button asChild size="lg" className="w-full" variant="default">
                <Link href={`/reservar?room=${room.slug}`}>
                  Reservar Ahora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

