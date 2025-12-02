import { MapPin, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HOTEL_INFO } from '@/lib/constants'
import Link from 'next/link'

export function LocationSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-gold flex-shrink-0" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy font-serif">
                Encuéntranos en el corazón de Moquegua
              </h2>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              Ubicados estratégicamente en {HOTEL_INFO.address}, a pocos minutos
              del centro histórico y los principales atractivos de la ciudad.
            </p>
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-gray-900">Dirección</p>
                  <p className="text-sm sm:text-base text-gray-700">{HOTEL_INFO.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Navigation className="h-4 w-4 sm:h-5 sm:w-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-gray-900">Acceso</p>
                  <p className="text-sm sm:text-base text-gray-700">
                    Fácil acceso desde la carretera Panamericana Sur. A 5 minutos del centro de Moquegua.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
                <Link href="/contacto">Ver en el mapa</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL_INFO.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Google Maps
                </a>
              </Button>
            </div>
          </div>
          <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden order-first lg:order-last">
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
        </div>
      </div>
    </section>
  )
}

