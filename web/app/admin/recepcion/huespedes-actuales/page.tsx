import { getActiveReservations } from '@/lib/queries/reception'
import HuespedesActualesClient from '@/components/reception/huespedes-actuales-client'

export default async function HuespedesActualesPage() {
  const activeGuests = await getActiveReservations()

  return <HuespedesActualesClient activeGuests={activeGuests} />
}

