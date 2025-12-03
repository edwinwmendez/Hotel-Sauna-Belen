'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PageHeader } from '@/components/reception/page-header'
import { Users } from 'lucide-react'
import { ReservationWithDetails } from '@/lib/queries/reception'
import ActiveGuestsList from '@/components/reception/active-guests-list'

interface HuespedesActualesClientProps {
  activeGuests: ReservationWithDetails[]
}

export default function HuespedesActualesClient({ activeGuests }: HuespedesActualesClientProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Huéspedes Actuales"
        description={`${activeGuests.length} huésped${activeGuests.length !== 1 ? 'es' : ''} hospedado${activeGuests.length !== 1 ? 's' : ''} actualmente en el hotel`}
        icon={Users}
        backHref="/admin/recepcion"
      />

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div>
            <CardTitle className="text-lg sm:text-xl">Lista de Huéspedes Actuales</CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Todos los clientes que están hospedados en este momento. Puedes ver su estado, extender su estancia o realizar check-out.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <ActiveGuestsList activeGuests={activeGuests} />
        </CardContent>
      </Card>
    </div>
  )
}

