import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Droplets, Thermometer, Clock, AlertCircle, Check } from 'lucide-react'

export const metadata = {
  title: 'Sauna Privado',
  description: 'Disfruta de un sauna privado en tu habitación. Beneficios para tu salud y bienestar. Único en Moquegua.',
}

export default function SaunaPage() {
  return (
    <div className="py-12">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-navy mb-6 font-serif">
            Tu Sauna Privado: Una Experiencia Única
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            En Hotel Sauna Belén, creemos que el bienestar no debe compartirse con extraños.
            Por eso, cada una de nuestras habitaciones cuenta con su propio sauna privado,
            disponible para ti las 24 horas del día.
          </p>
        </div>

        {/* Beneficios */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-navy mb-8 text-center font-serif">
            Los Beneficios del Sauna para tu Cuerpo y Mente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-6 w-6 text-gold" />
                  Relajación Muscular
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  El calor del sauna ayuda a relajar los músculos tensos, aliviando
                  dolores y contracturas después de un largo viaje o día de trabajo.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-6 w-6 text-gold" />
                  Mejora la Circulación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  El calor dilata los vasos sanguíneos, mejorando la circulación
                  y ayudando a oxigenar mejor todo tu cuerpo.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-6 w-6 text-gold" />
                  Desintoxicación Natural
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  A través del sudor, tu cuerpo elimina toxinas acumuladas,
                  dejándote con una sensación de limpieza y renovación.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-gold" />
                  Reduce el Estrés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  El ambiente cálido y tranquilo del sauna te ayuda a desconectar,
                  reduciendo los niveles de estrés y ansiedad.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recomendaciones */}
        <section className="mb-16 bg-cream p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-navy mb-6 text-center font-serif">
            Recomendaciones para Disfrutar tu Sauna
          </h2>
          <ul className="space-y-3 max-w-2xl mx-auto">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Hidrátate bien antes, durante y después de tu sesión</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Comienza con sesiones de 10-15 minutos</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Temperatura recomendada: 70-80°C</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Espera al menos 1 hora después de comer</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Descansa unos minutos antes de ducharte</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Escucha a tu cuerpo: sal si sientes mareo</span>
            </li>
          </ul>
        </section>

        {/* Advertencia */}
        <Card className="border-yellow-200 bg-yellow-50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-6 w-6" />
              Importante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800">
              No recomendado para embarazadas, personas con problemas cardíacos o presión arterial alta.
              En caso de duda, consulta con tu médico antes de usarlo.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-navy mb-4">
            ¿Listo para experimentar el bienestar?
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Reserva tu habitación con sauna privado hoy mismo.
          </p>
          <Button asChild size="lg" variant="default">
            <Link href="/reservar">Reservar Ahora</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

