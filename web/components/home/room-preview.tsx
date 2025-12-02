import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { ROOM_TYPES } from '@/lib/constants'

const previewRooms = [
  {
    slug: 'suite-king-sauna',
    type: 'king' as const,
    price: 250,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    description: 'Nuestra habitación más espaciosa con cama King Size y sauna privado de madera.',
  },
  {
    slug: 'habitacion-matrimonial-sauna',
    type: 'matrimonial' as const,
    price: 180,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
    description: 'Perfecta para parejas. Habitación acogedora con cama matrimonial y sauna privado.',
  },
  {
    slug: 'habitacion-simple-sauna',
    type: 'simple' as const,
    price: 120,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    description: 'Ideal para viajeros solos. Compacta pero confortable, con todas las amenidades esenciales.',
  },
]

export function RoomPreview() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-3 md:mb-4 font-serif px-4">
            Nuestras Habitaciones
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            Espacios diseñados para tu descanso, todos con sauna privado incluido.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
          {previewRooms.map((room) => (
            <Card key={room.slug} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 sm:h-56 md:h-64 w-full">
                <Image
                  src={room.image}
                  alt={ROOM_TYPES[room.type]}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-xl sm:text-2xl">{ROOM_TYPES[room.type]}</CardTitle>
                <CardDescription className="text-sm sm:text-base">{room.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-gold">{formatCurrency(room.price)}</span>
                  <span className="text-sm sm:text-base text-gray-600">/ noche</span>
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
          ))}
        </div>

        <div className="text-center px-4">
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/habitaciones">Ver todas las habitaciones</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

