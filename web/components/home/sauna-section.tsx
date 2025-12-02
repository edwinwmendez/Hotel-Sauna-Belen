import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spade, Heart, Droplets, Moon } from 'lucide-react'

export function SaunaSection() {
  const benefits = [
    {
      icon: Heart,
      title: 'Relajación Muscular',
      description: 'Alivia tensiones después de un largo viaje o día de trabajo.',
    },
    {
      icon: Droplets,
      title: 'Mejora la Circulación',
      description: 'El calor dilata los vasos sanguíneos, mejorando la oxigenación.',
    },
    {
      icon: Spade,
      title: 'Desintoxicación Natural',
      description: 'Elimina toxinas acumuladas a través del sudor.',
    },
    {
      icon: Moon,
      title: 'Mejora el Sueño',
      description: 'Una sesión antes de dormir mejora significativamente tu descanso.',
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="container px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-3 md:mb-4 font-serif px-4">
            Sauna Privado en Cada Habitación
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            Lo que nos hace únicos: cada una de nuestras habitaciones cuenta con su propio sauna privado.
            Disfruta de los beneficios del vapor en la intimidad de tu espacio, a cualquier hora.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <CardDescription className="text-sm sm:text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center px-4">
          <Button asChild size="lg" variant="default" className="w-full sm:w-auto">
            <Link href="/sauna">Conoce más sobre nuestro sauna</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

