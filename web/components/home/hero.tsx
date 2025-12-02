import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { HOTEL_INFO } from '@/lib/constants'

export function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy to-navy-light">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920')] bg-cover bg-center opacity-30" />
      <div className="relative z-10 container text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">
          {HOTEL_INFO.name}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          {HOTEL_INFO.slogan}
        </p>
        <p className="text-lg mb-10 text-gray-300 max-w-xl mx-auto">
          Descubre la experiencia única de tener un sauna privado en tu habitación.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="gold" className="text-lg px-8">
            <Link href="/reservar">Reservar Ahora</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white text-white hover:bg-white/20">
            <Link href="/habitaciones">Ver Habitaciones</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

