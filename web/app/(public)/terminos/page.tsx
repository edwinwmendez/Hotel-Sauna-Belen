import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { HOTEL_INFO } from '@/lib/constants'

export const metadata = {
  title: 'Términos y Condiciones | Hotel Sauna Belén',
  description: 'Términos y condiciones de reserva del Hotel Sauna Belén en Moquegua, Perú.',
}

export default function TerminosPage() {
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
              Términos y Condiciones de Reserva
            </CardTitle>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Hotel Sauna Belén
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Última actualización: Diciembre 2025
            </p>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-0 space-y-6 sm:space-y-8">
            {/* Sección 1: Reservas */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">1. RESERVAS</h2>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  <strong>1.1.</strong> Las reservas se confirman al recibir la confirmación por email con un código de reserva único.
                </p>
                <p>
                  <strong>1.2.</strong> La disponibilidad está sujeta a confirmación en tiempo real.
                </p>
                <p>
                  <strong>1.3.</strong> Los precios mostrados son en Soles Peruanos (S/) e incluyen IGV.
                </p>
              </div>
            </section>

            {/* Sección 2: Pagos */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">2. PAGOS</h2>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  <strong>2.1.</strong> El pago se realiza al momento del check-in.
                </p>
                <p>
                  <strong>2.2.</strong> Aceptamos efectivo, tarjetas de débito/crédito, Yape y Plin.
                </p>
                <p>
                  <strong>2.3.</strong> El huésped principal debe coincidir con el titular del pago.
                </p>
              </div>
            </section>

            {/* Sección 3: Check-in / Check-out */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">3. CHECK-IN / CHECK-OUT</h2>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  <strong>3.1.</strong> Hora de check-in: desde las 14:00 horas.
                </p>
                <p>
                  <strong>3.2.</strong> Hora de check-out: hasta las 12:00 horas.
                </p>
                <p>
                  <strong>3.3.</strong> Early check-in y late check-out sujetos a disponibilidad y pueden tener cargo adicional.
                </p>
                <p>
                  <strong>3.4.</strong> Se requiere documento de identidad válido al momento del check-in.
                </p>
              </div>
            </section>

            {/* Sección 4: Cancelaciones */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">4. CANCELACIONES</h2>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  <strong>4.1.</strong> Cancelación gratuita: hasta 48 horas antes del check-in.
                </p>
                <p>
                  <strong>4.2.</strong> Cancelación tardía (24-48 horas): cargo del 50% de primera noche.
                </p>
                <p>
                  <strong>4.3.</strong> No-show o cancelación &lt; 24 horas: cargo del 100% de primera noche.
                </p>
                <p>
                  <strong>4.4.</strong> Las cancelaciones deben realizarse por teléfono o WhatsApp.
                </p>
                <p className="mt-4">
                  Para más detalles, consulta nuestra{' '}
                  <Link href="/politica-cancelacion" className="text-gold hover:underline font-semibold">
                    Política de Cancelación
                  </Link>.
                </p>
              </div>
            </section>

            {/* Sección 5: Responsabilidades del Huésped */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">5. RESPONSABILIDADES DEL HUÉSPED</h2>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  <strong>5.1.</strong> Cuidar las instalaciones y mobiliario de la habitación.
                </p>
                <p>
                  <strong>5.2.</strong> Reportar cualquier daño o desperfecto.
                </p>
                <p>
                  <strong>5.3.</strong> No fumar en las habitaciones (hotel 100% libre de humo).
                </p>
                <p>
                  <strong>5.4.</strong> No realizar fiestas ni eventos sin autorización.
                </p>
                <p>
                  <strong>5.5.</strong> Usar el sauna siguiendo las instrucciones de seguridad.
                </p>
              </div>
            </section>

            {/* Sección 6: Responsabilidades del Hotel */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">6. RESPONSABILIDADES DEL HOTEL</h2>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  <strong>6.1.</strong> Garantizar la limpieza y funcionamiento de las instalaciones.
                </p>
                <p>
                  <strong>6.2.</strong> Proteger la información personal de los huéspedes.
                </p>
                <p>
                  <strong>6.3.</strong> Atender consultas y reclamos en tiempo razonable.
                </p>
              </div>
            </section>

            {/* Sección 7: Uso del Sauna */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">7. USO DEL SAUNA</h2>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  <strong>7.1.</strong> El sauna es de uso exclusivo del huésped de la habitación.
                </p>
                <p>
                  <strong>7.2.</strong> No recomendado para embarazadas, personas con problemas cardíacos o presión arterial alta.
                </p>
                <p>
                  <strong>7.3.</strong> Se recomienda hidratarse adecuadamente antes y después del uso.
                </p>
                <p>
                  <strong>7.4.</strong> El hotel no se hace responsable por mal uso del sauna.
                </p>
              </div>
            </section>

            {/* Sección 8: Privacidad */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">8. PRIVACIDAD</h2>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <p>
                  <strong>8.1.</strong> Los datos personales se usan únicamente para gestionar la reserva.
                </p>
                <p>
                  <strong>8.2.</strong> No compartimos información con terceros sin consentimiento.
                </p>
                <p>
                  <strong>8.3.</strong> Puedes solicitar la eliminación de tus datos contactándonos.
                </p>
              </div>
            </section>

            {/* Sección 9: Contacto */}
            <section className="bg-cream p-4 sm:p-6 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 sm:mb-4">9. CONTACTO</h2>
              <p className="text-sm sm:text-base text-gray-700 mb-3">
                Para consultas sobre estos términos:
              </p>
              <div className="space-y-2 text-sm sm:text-base text-gray-700">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

