import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'María González',
    location: 'Lima, Perú',
    rating: 5,
    text: 'Una experiencia increíble. El sauna privado en la habitación fue el punto destacado de nuestra estadía. El personal es muy atento y las instalaciones están impecables.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Carlos Ramírez',
    location: 'Arequipa, Perú',
    rating: 5,
    text: 'Perfecto para relajarse después de un día de trabajo. El sauna es una maravilla y las habitaciones son muy cómodas. Definitivamente volveremos.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Ana Martínez',
    location: 'Tacna, Perú',
    rating: 5,
    text: 'El mejor hotel en Moquegua. La atención al detalle es excepcional y el sauna privado hace que valga cada sol invertido. Altamente recomendado.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Roberto Silva',
    location: 'Cusco, Perú',
    rating: 5,
    text: 'Excelente ubicación, habitaciones limpias y el sauna es un plus increíble. El WiFi funciona perfecto y el estacionamiento es seguro. Todo perfecto.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="container px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-3 md:mb-4 font-serif px-4">
            Lo que dicen nuestros huéspedes
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            Miles de viajeros han confiado en nosotros para su estadía en Moquegua
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                {/* Calificación */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Testimonio */}
                <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Autor */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

