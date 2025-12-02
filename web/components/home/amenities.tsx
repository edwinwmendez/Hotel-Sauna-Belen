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
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-3 md:mb-4 font-serif px-4">
            Todo lo que necesitas para una estadía perfecta
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            Servicios y comodidades pensados para tu máximo confort
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon
            return (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{amenity.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <CardDescription className="text-sm sm:text-base">
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

