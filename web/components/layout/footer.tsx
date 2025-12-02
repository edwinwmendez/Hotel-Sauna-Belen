import Link from 'next/link'
import { HOTEL_INFO } from '@/lib/constants'
import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Hotel Sauna Belén</h3>
            <p className="text-sm text-gray-300 mb-4">{HOTEL_INFO.slogan}</p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gold transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-gold transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-gold transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/habitaciones" className="text-gray-300 hover:text-gold transition-colors">
                  Habitaciones
                </Link>
              </li>
              <li>
                <Link href="/sauna" className="text-gray-300 hover:text-gold transition-colors">
                  Sauna
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-gold transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/reservar" className="text-gray-300 hover:text-gold transition-colors">
                  Reservar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{HOTEL_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <a
                  href={`tel:${HOTEL_INFO.phone}`}
                  className="text-gray-300 hover:text-gold transition-colors"
                >
                  {HOTEL_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <a
                  href={`mailto:${HOTEL_INFO.email}`}
                  className="text-gray-300 hover:text-gold transition-colors"
                >
                  {HOTEL_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
          <p>© {new Date().getFullYear()} Hotel Sauna Belén. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

