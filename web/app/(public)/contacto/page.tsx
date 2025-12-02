import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HOTEL_INFO } from '@/lib/constants'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export const metadata = {
  title: 'Contacto',
  description: 'Contáctanos para reservas y consultas. Calle Huánuco 120, Moquegua. Teléfono y WhatsApp: 943-924-822.',
}

export default function ContactoPage() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4 font-serif">
            Estamos aquí para ayudarte
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            ¿Tienes preguntas sobre nuestras habitaciones, disponibilidad o servicios?
            Contáctanos por el medio que prefieras. Responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Información de contacto */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-gold" />
                  Dirección
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{HOTEL_INFO.address}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-6 w-6 text-gold" />
                  Teléfono
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={`tel:${HOTEL_INFO.phone}`}
                  className="text-lg text-navy hover:text-gold transition-colors"
                >
                  {HOTEL_INFO.phone}
                </a>
                <p className="text-sm text-gray-600 mt-2">
                  También disponible en WhatsApp
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-6 w-6 text-gold" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={`mailto:${HOTEL_INFO.email}`}
                  className="text-lg text-navy hover:text-gold transition-colors"
                >
                  {HOTEL_INFO.email}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-6 w-6 text-gold" />
                  Horario de atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Recepción:</strong> 24 horas, los 7 días</p>
                  <p><strong>Administración:</strong> Lunes a Sábado, 8:00 - 18:00</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mapa */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.1234567890123!2d-70.93512345678901!3d-17.19567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDExJzQ0LjQiUyA3MMKwNTYnMDYuNCJX!5e0!3m2!1ses!2spe!4v1234567890123!5m2!1ses!2spe"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Calle Huánuco 120, Moquegua, Perú
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Información adicional */}
        <Card className="bg-cream">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-navy">
                ¿Prefieres reservar directamente?
              </h3>
              <p className="text-gray-700">
                Puedes hacer tu reserva online las 24 horas del día desde nuestra página de reservas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/reservar"
                  className="inline-flex items-center justify-center rounded-md bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light transition-colors"
                >
                  Reservar Online
                </a>
                <a
                  href={`https://wa.me/51${HOTEL_INFO.phone.replace(/-/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-navy px-6 py-3 text-sm font-medium text-navy hover:bg-navy hover:text-white transition-colors"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

