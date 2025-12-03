import { Star, Shield, Wifi, Car } from 'lucide-react'
import { HOTEL_INFO } from '@/lib/constants'
import { BookingWidget } from './booking-widget'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo - Habitación con sauna */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=80"
          alt="Habitación con sauna privado - Hotel Sauna Belén"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/80 via-navy/70 to-navy-dark/80" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 container px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Título y slogan - Más breve */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6 font-serif drop-shadow-lg">
              {HOTEL_INFO.name}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-100 max-w-3xl mx-auto font-light drop-shadow-md">
              {HOTEL_INFO.slogan}
            </p>
          </div>

          {/* Widget de búsqueda */}
          <div className="mb-8 sm:mb-10">
            <BookingWidget />
          </div>

          {/* Elementos de confianza */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 text-white">
            {/* Calificación */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-base sm:text-lg font-semibold">4.8/5</span>
              <span className="text-sm sm:text-base text-gray-200">(127 reseñas)</span>
            </div>

            {/* Separador */}
            <div className="hidden sm:block w-px h-8 bg-white/30" />

            {/* Badges de confianza */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <Wifi className="h-4 w-4 text-gold" />
                <span className="text-sm sm:text-base font-medium">WiFi Gratis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <Car className="h-4 w-4 text-gold" />
                <span className="text-sm sm:text-base font-medium">Estacionamiento</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <Shield className="h-4 w-4 text-gold" />
                <span className="text-sm sm:text-base font-medium">Reserva Segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

