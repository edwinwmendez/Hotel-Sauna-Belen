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
    <div className="py-8 sm:py-12">
      <div className="container px-4">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-navy mb-4 sm:mb-6 font-serif px-4">
            Tu Sauna Privado: Una Experiencia Única
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            En Hotel Sauna Belén, creemos que el bienestar no debe compartirse con extraños.
            Por eso, cada una de nuestras habitaciones cuenta con su propio sauna privado,
            disponible para ti las 24 horas del día.
          </p>
        </div>

        {/* Beneficios */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-6 sm:mb-8 text-center font-serif px-4">
            Los Beneficios del Sauna para tu Cuerpo y Mente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                  Relajación Muscular
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-sm sm:text-base">
                  El calor del sauna ayuda a relajar los músculos tensos, aliviando
                  dolores y contracturas después de un largo viaje o día de trabajo.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Thermometer className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                  Mejora la Circulación
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-sm sm:text-base">
                  El calor dilata los vasos sanguíneos, mejorando la circulación
                  y ayudando a oxigenar mejor todo tu cuerpo.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                  Desintoxicación Natural
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-sm sm:text-base">
                  A través del sudor, tu cuerpo elimina toxinas acumuladas,
                  dejándote con una sensación de limpieza y renovación.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
                  Reduce el Estrés
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <CardDescription className="text-sm sm:text-base">
                  El ambiente cálido y tranquilo del sauna te ayuda a desconectar,
                  reduciendo los niveles de estrés y ansiedad.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Recomendaciones */}
        <section className="mb-12 sm:mb-16 bg-cream p-4 sm:p-6 md:p-8 rounded-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-navy mb-4 sm:mb-6 text-center font-serif">
            Recomendaciones para Disfrutar tu Sauna
          </h2>
          <ul className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Hidrátate bien antes, durante y después de tu sesión</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Comienza con sesiones de 10-15 minutos</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Temperatura recomendada: 70-80°C</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Espera al menos 1 hora después de comer</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Descansa unos minutos antes de ducharte</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-gray-700">Escucha a tu cuerpo: sal si sientes mareo</span>
            </li>
          </ul>
        </section>

        {/* Advertencia */}
        <Card className="border-yellow-200 bg-yellow-50 mb-8 sm:mb-12">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-yellow-800">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm sm:text-base text-yellow-800">
              No recomendado para embarazadas, personas con problemas cardíacos o presión arterial alta.
              En caso de duda, consulta con tu médico antes de usarlo.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center px-4">
          <h3 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">
            ¿Listo para experimentar el bienestar?
          </h3>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
            Reserva tu habitación con sauna privado hoy mismo.
          </p>
          <Button asChild size="lg" variant="default" className="w-full sm:w-auto">
            <Link href="/reservar">Reservar Ahora</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

