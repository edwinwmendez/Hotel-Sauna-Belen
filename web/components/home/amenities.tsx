import { Wifi, Car, Tv, Droplet, Clock, Thermometer } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const amenities = [
  {
    icon: Wifi,
    title: 'WiFi de Alta Velocidad',
    description: 'Conexión gratuita en todas las áreas del hotel',
  },
  {
    icon: Car,
    title: 'Estacionamiento Privado',
    description: 'Sin costo adicional, disponible las 24 horas',
  },
  {
    icon: Tv,
    title: 'TV Smart con Netflix',
    description: 'Entretenimiento incluido en cada habitación',
  },
  {
    icon: Droplet,
    title: 'Agua Caliente 24/7',
    description: 'Servicio continuo de agua caliente',
  },
  {
    icon: Clock,
    title: 'Atención Personalizada',
    description: 'Recepción disponible las 24 horas',
  },
  {
    icon: Thermometer,
    title: 'Sauna Privado',
    description: 'En cada habitación, disponible cuando quieras',
  },
]

export function AmenitiesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4 font-serif">
            Todo lo que necesitas para una estadía perfecta
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Servicios y comodidades pensados para tu máximo confort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon
            return (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle className="text-xl">{amenity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {amenity.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

