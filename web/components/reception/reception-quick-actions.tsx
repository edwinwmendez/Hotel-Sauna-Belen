'use client'

import { Button } from '@/components/ui/button'
import { LogIn, UserPlus, LogOut, Search, ArrowRight, CalendarPlus } from 'lucide-react'
import Link from 'next/link'

export default function ReceptionQuickActions() {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-navy mb-4 sm:mb-6">
        Accesos Rápidos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <Button
          asChild
          variant="outline"
          className="h-auto p-0 flex-col items-stretch hover:border-gold hover:bg-gold/5 transition-all group"
        >
          <Link href="/admin/recepcion/check-in" className="p-4 sm:p-6 text-left">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 sm:p-3 bg-gold/10 rounded-lg group-hover:bg-gold/20 transition-colors">
                <LogIn className="h-5 w-5 sm:h-6 sm:w-6 text-gold" />
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Check-in</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Registrar llegada de huéspedes con reserva
            </p>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-0 flex-col items-stretch hover:border-gold hover:bg-gold/5 transition-all group"
        >
          <Link href="/admin/recepcion/walk-in" className="p-4 sm:p-6 text-left">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Walk-in</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Registrar cliente sin reserva previa
            </p>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-0 flex-col items-stretch hover:border-gold hover:bg-gold/5 transition-all group"
        >
          <Link href="/admin/recepcion/check-out" className="p-4 sm:p-6 text-left">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 sm:p-3 bg-navy/10 rounded-lg group-hover:bg-navy/20 transition-colors">
                <LogOut className="h-5 w-5 sm:h-6 sm:w-6 text-navy" />
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Check-out</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Registrar salida de huéspedes
            </p>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-0 flex-col items-stretch hover:border-gold hover:bg-gold/5 transition-all group"
        >
          <Link href="/admin/recepcion/check-in?search=true" className="p-4 sm:p-6 text-left">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Buscar Cliente</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Buscar reserva o cliente por DNI
            </p>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-0 flex-col items-stretch hover:border-gold hover:bg-gold/5 transition-all group"
        >
          <Link href="/admin/recepcion/extender-estancia" className="p-4 sm:p-6 text-left">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                <CalendarPlus className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-navy mb-2">Extender Estancia</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Ampliar estadía de huéspedes actuales
            </p>
          </Link>
        </Button>
      </div>
    </div>
  )
}

