import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type Guest = Database['public']['Tables']['guests']['Row']
type Reservation = Database['public']['Tables']['reservations']['Row']
type Room = Database['public']['Tables']['rooms']['Row']

export type GuestWithHistory = Guest & {
  stay_count: number
  last_stay: string | null
}

export type GuestStayHistory = {
  reservation: Reservation
  room: Room
  check_in: string | null
  check_out: string | null
}

/**
 * Busca un cliente por tipo y número de documento
 * Usa el índice único para búsqueda ultra-rápida
 */
export async function searchGuestByDocument(
  documentType: 'DNI' | 'CE' | 'PASAPORTE',
  documentNumber: string
): Promise<Guest | null> {
  const supabase = await createClient()

  if (!supabase) {
    console.warn('Supabase no configurado, no se puede buscar cliente')
    return null
  }

  // Normalizar número de documento (eliminar espacios, convertir a mayúsculas si es necesario)
  const normalizedDocNumber = documentNumber.trim().toUpperCase()

  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('document_type', documentType)
    .eq('document_number', normalizedDocNumber)
    .single()

  if (error) {
    // Si no se encuentra (código PGRST116), retornar null (no es error)
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error buscando cliente por documento:', error)
    return null
  }

  return data
}

/**
 * Obtiene el historial completo de estancias de un cliente
 * Incluye información de reservas y habitaciones
 */
export async function getGuestHistory(
  guestId: string
): Promise<GuestStayHistory[]> {
  const supabase = await createClient()

  if (!supabase) {
    console.warn('Supabase no configurado, no se puede obtener historial')
    return []
  }

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      room:rooms(*)
    `)
    .eq('guest_id', guestId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error obteniendo historial del cliente:', error)
    return []
  }

  if (!data) {
    return []
  }

  // Transformar los datos al formato esperado
  return data.map((reservation: any) => ({
    reservation: {
      id: reservation.id,
      booking_code: reservation.booking_code,
      room_id: reservation.room_id,
      guest_id: reservation.guest_id,
      check_in: reservation.check_in,
      check_out: reservation.check_out,
      nights: reservation.nights,
      total_price: reservation.total_price,
      adults: reservation.adults,
      youths: reservation.youths,
      children: reservation.children,
      infants: reservation.infants,
      status: reservation.status,
      notes: reservation.notes,
      checked_in_at: reservation.checked_in_at,
      checked_out_at: reservation.checked_out_at,
      created_at: reservation.created_at,
      updated_at: reservation.updated_at,
    },
    room: reservation.room,
    check_in: reservation.checked_in_at,
    check_out: reservation.checked_out_at,
  }))
}

/**
 * Obtiene información completa de un cliente incluyendo estadísticas básicas
 */
export async function getGuestWithStats(
  guestId: string
): Promise<GuestWithHistory | null> {
  const supabase = await createClient()

  if (!supabase) {
    return null
  }

  // Obtener datos del cliente
  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .select('*')
    .eq('id', guestId)
    .single()

  if (guestError || !guest) {
    console.error('Error obteniendo cliente:', guestError)
    return null
  }

  // Obtener estadísticas de estancias
  const { count, error: countError } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('guest_id', guestId)
    .in('status', ['completed', 'checked-in'])

  const stayCount = count || 0

  // Obtener última estancia
  const { data: lastReservation } = await supabase
    .from('reservations')
    .select('created_at')
    .eq('guest_id', guestId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return {
    ...guest,
    stay_count: stayCount,
    last_stay: lastReservation?.created_at || null,
  }
}

