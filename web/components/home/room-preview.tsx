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
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4 font-serif">
            Nuestras Habitaciones
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Espacios diseñados para tu descanso, todos con sauna privado incluido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {previewRooms.map((room) => (
            <Card key={room.slug} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src={room.image}
                  alt={ROOM_TYPES[room.type]}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{ROOM_TYPES[room.type]}</CardTitle>
                <CardDescription className="text-base">{room.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gold">{formatCurrency(room.price)}</span>
                  <span className="text-gray-600">/ noche</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/habitaciones/${room.slug}`}>Ver detalles</Link>
                </Button>
                <Button asChild variant="default" className="flex-1">
                  <Link href={`/reservar?room=${room.slug}`}>Reservar</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/habitaciones">Ver todas las habitaciones</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

