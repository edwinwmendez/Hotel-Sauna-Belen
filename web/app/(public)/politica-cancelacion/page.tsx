import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { HOTEL_INFO } from '@/lib/constants'

export const metadata = {
  title: 'Política de Cancelación | Hotel Sauna Belén',
  description: 'Política de cancelación y reembolsos del Hotel Sauna Belén en Moquegua, Perú.',
}

export default function PoliticaCancelacionPage() {
  return (
    <div className="py-8 sm:py-12 bg-gray-50 min-h-screen">
      <div className="container px-4 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6 text-sm sm:text-base">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>

        <Card>
          <CardHeader className="p-6 sm:p-8">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy">
              Política de Cancelación
            </CardTitle>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Hotel Sauna Belén
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Última actualización: Diciembre 2025
            </p>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-0 space-y-6 sm:space-y-8">
            {/* Introducción */}
            <section>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Entendemos que los planes pueden cambiar. Por eso, hemos diseñado una política de cancelación 
                clara y justa que te permite modificar o cancelar tu reserva según tus necesidades, siempre 
                respetando los plazos establecidos.
              </p>
            </section>

            {/* Política de Cancelación */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-4 sm:mb-6">Política de Cancelación</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Cancelación Gratuita */}
                <div className="border-l-4 border-green-500 bg-green-50 p-4 sm:p-6 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2">
                        Cancelación Gratuita
                      </h3>
                      <p className="text-sm sm:text-base text-green-800 mb-2">
                        <strong>Plazo:</strong> Hasta 48 horas antes del check-in
                      </p>
                      <p className="text-sm sm:text-base text-green-800">
                        Puedes cancelar tu reserva sin ningún cargo adicional si lo haces con al menos 
                        48 horas de anticipación a la fecha de check-in. El reembolso se procesará 
                        según el método de pago utilizado.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cancelación Tardía */}
                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 sm:p-6 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-yellow-900 mb-2">
                        Cancelación Tardía
                      </h3>
                      <p className="text-sm sm:text-base text-yellow-800 mb-2">
                        <strong>Plazo:</strong> Entre 24 y 48 horas antes del check-in
                      </p>
                      <p className="text-sm sm:text-base text-yellow-800 mb-2">
                        <strong>Cargo:</strong> 50% del costo de la primera noche
                      </p>
                      <p className="text-sm sm:text-base text-yellow-800">
                        Si cancelas tu reserva entre 24 y 48 horas antes del check-in, se aplicará 
                        un cargo equivalente al 50% del costo de la primera noche. El resto del 
                        monto será reembolsado.
                      </p>
                    </div>
                  </div>
                </div>

                {/* No-show o Cancelación Muy Tardía */}
                <div className="border-l-4 border-red-500 bg-red-50 p-4 sm:p-6 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-2">
                        No-show o Cancelación Muy Tardía
                      </h3>
                      <p className="text-sm sm:text-base text-red-800 mb-2">
                        <strong>Plazo:</strong> Menos de 24 horas antes del check-in o no-show
                      </p>
                      <p className="text-sm sm:text-base text-red-800 mb-2">
                        <strong>Cargo:</strong> 100% del costo de la primera noche
                      </p>
                      <p className="text-sm sm:text-base text-red-800">
                        Si cancelas tu reserva con menos de 24 horas de anticipación o no te presentas 
                        en la fecha de check-in (no-show), se aplicará un cargo equivalente al 100% 
                        del costo de la primera noche. No habrá reembolso en estos casos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cómo Cancelar */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">¿Cómo Cancelar mi Reserva?</h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  Para cancelar tu reserva, puedes contactarnos a través de los siguientes medios:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Teléfono:</strong>{' '}
                    <a href={`tel:${HOTEL_INFO.phone}`} className="text-gold hover:underline">
                      {HOTEL_INFO.phone}
                    </a>
                  </li>
                  <li>
                    <strong>WhatsApp:</strong>{' '}
                    <a href={`https://wa.me/${HOTEL_INFO.phone.replace(/-/g, '')}`} className="text-gold hover:underline" target="_blank" rel="noopener noreferrer">
                      {HOTEL_INFO.phone}
                    </a>
                  </li>
                  <li>
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${HOTEL_INFO.email}`} className="text-gold hover:underline">
                      {HOTEL_INFO.email}
                    </a>
                  </li>
                </ul>
                <p className="mt-4">
                  <strong>Importante:</strong> Debes proporcionar tu código de reserva al momento de cancelar. 
                  El código de reserva se encuentra en el email de confirmación que recibiste al hacer tu reserva.
                </p>
              </div>
            </section>

            {/* Modificaciones */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">Modificaciones de Reserva</h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  Si necesitas modificar tu reserva (cambiar fechas, número de huéspedes, tipo de habitación), 
                  puedes contactarnos con al menos 24 horas de anticipación, sujeto a disponibilidad.
                </p>
                <p>
                  Las modificaciones pueden estar sujetas a diferencias de precio según la disponibilidad 
                  y tarifas vigentes en las nuevas fechas.
                </p>
              </div>
            </section>

            {/* Reembolsos */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">Proceso de Reembolso</h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  Los reembolsos se procesarán según el método de pago utilizado:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Tarjeta de crédito/débito:</strong> El reembolso aparecerá en tu estado de cuenta en un plazo de 5 a 10 días hábiles.</li>
                  <li><strong>Yape/Plin:</strong> El reembolso se realizará en un plazo de 24 a 48 horas.</li>
                  <li><strong>Efectivo:</strong> Si pagaste en efectivo, el reembolso se coordinará directamente con el hotel.</li>
                </ul>
              </div>
            </section>

            {/* Casos Especiales */}
            <section className="bg-cream p-4 sm:p-6 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">Casos Especiales</h2>
              <div className="space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  En casos de emergencia médica, fallecimiento de un familiar directo, o situaciones de fuerza mayor, 
                  evaluaremos cada caso de manera individual y podremos hacer excepciones a esta política. 
                  Por favor, contáctanos lo antes posible para que podamos ayudarte.
                </p>
              </div>
            </section>

            {/* Contacto */}
            <section className="bg-navy text-white p-4 sm:p-6 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">¿Tienes Preguntas?</h2>
              <p className="text-sm sm:text-base mb-4">
                Si tienes alguna duda sobre nuestra política de cancelación, no dudes en contactarnos:
              </p>
              <div className="space-y-2 text-sm sm:text-base">
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${HOTEL_INFO.email}`} className="text-gold hover:underline">
                    {HOTEL_INFO.email}
                  </a>
                </p>
                <p>
                  <strong>Teléfono:</strong>{' '}
                  <a href={`tel:${HOTEL_INFO.phone}`} className="text-gold hover:underline">
                    {HOTEL_INFO.phone}
                  </a>
                </p>
              </div>
            </section>

            {/* Enlace a Términos */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Para más información, consulta nuestros{' '}
                <Link href="/terminos" className="text-gold hover:underline font-semibold">
                  Términos y Condiciones
                </Link>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

