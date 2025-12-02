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
    <section className="py-20 bg-cream">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4 font-serif">
            Sauna Privado en Cada Habitación
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Lo que nos hace únicos: cada una de nuestras habitaciones cuenta con su propio sauna privado.
            Disfruta de los beneficios del vapor en la intimidad de tu espacio, a cualquier hora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="default">
            <Link href="/sauna">Conoce más sobre nuestro sauna</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

