import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type Reservation = Database['public']['Tables']['reservations']['Row']
type Guest = Database['public']['Tables']['guests']['Row']
type Room = Database['public']['Tables']['rooms']['Row']

export type ReservationWithDetails = {
  reservation: Reservation
  guest: Guest
  room: Room
}

type ReservationWithRelations = Reservation & {
  guest: Guest
  room: Room
}

/**
 * Obtiene reservas con check-in programado para hoy
 * Retorna reservas confirmadas o pendientes que aún no han hecho check-in
 */
export async function getTodayCheckIns(): Promise<ReservationWithDetails[]> {
  const supabase = await createClient()

  if (!supabase) {
    console.warn('Supabase no configurado')
    return []
  }

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      guest:guests(*),
      room:rooms(*)
    `)
    .eq('check_in', today)
    .in('status', ['confirmed', 'pending'])
    .is('checked_in_at', null)
    .order('check_in', { ascending: true })

  if (error) {
    console.error('Error obteniendo check-ins de hoy:', error)
    return []
  }

  if (!data) {
    return []
  }

  // Transformar datos al formato esperado
  return (data as unknown as ReservationWithRelations[]).map((item) => ({
    reservation: {
      id: item.id,
      booking_code: item.booking_code,
      room_id: item.room_id,
      guest_id: item.guest_id,
      check_in: item.check_in,
      check_out: item.check_out,
      nights: item.nights,
      total_price: item.total_price,
      adults: item.adults,
      youths: item.youths,
      children: item.children,
      infants: item.infants,
      status: item.status,
      notes: item.notes,
      checked_in_at: item.checked_in_at,
      checked_out_at: item.checked_out_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    },
    guest: item.guest,
    room: item.room,
  }))
}

/**
 * Obtiene reservas con check-out programado para hoy
 * Retorna reservas que están checked-in y aún no han hecho check-out
 */
export async function getTodayCheckOuts(): Promise<ReservationWithDetails[]> {
  const supabase = await createClient()

  if (!supabase) {
    console.warn('Supabase no configurado')
    return []
  }

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      guest:guests(*),
      room:rooms(*)
    `)
    .eq('check_out', today)
    .in('status', ['confirmed', 'checked-in'])
    .is('checked_out_at', null)
    .order('check_out', { ascending: true })

  if (error) {
    console.error('Error obteniendo check-outs de hoy:', error)
    return []
  }

  if (!data) {
    return []
  }

  // Transformar datos al formato esperado
  return (data as unknown as ReservationWithRelations[]).map((item) => ({
    reservation: {
      id: item.id,
      booking_code: item.booking_code,
      room_id: item.room_id,
      guest_id: item.guest_id,
      check_in: item.check_in,
      check_out: item.check_out,
      nights: item.nights,
      total_price: item.total_price,
      adults: item.adults,
      youths: item.youths,
      children: item.children,
      infants: item.infants,
      status: item.status,
      notes: item.notes,
      checked_in_at: item.checked_in_at,
      checked_out_at: item.checked_out_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    },
    guest: item.guest,
    room: item.room,
  }))
}

/**
 * Obtiene huéspedes actuales (estadías activas)
 * Clientes que ya hicieron check-in y están actualmente hospedados en el hotel
 */
export async function getActiveReservations(): Promise<ReservationWithDetails[]> {
  const supabase = await createClient()

  if (!supabase) {
    console.warn('Supabase no configurado')
    return []
  }

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      guest:guests(*),
      room:rooms(*)
    `)
    .not('checked_in_at', 'is', null)
    .is('checked_out_at', null)
    .not('status', 'in', '("cancelled","no_show")')
    .order('checked_in_at', { ascending: false })

  if (error) {
    console.error('Error obteniendo huéspedes actuales:', error)
    return []
  }

  if (!data) {
    return []
  }

  // Transformar datos al formato esperado
  return (data as unknown as ReservationWithRelations[]).map((item) => ({
    reservation: {
      id: item.id,
      booking_code: item.booking_code,
      room_id: item.room_id,
      guest_id: item.guest_id,
      check_in: item.check_in,
      check_out: item.check_out,
      nights: item.nights,
      total_price: item.total_price,
      adults: item.adults,
      youths: item.youths,
      children: item.children,
      infants: item.infants,
      status: item.status,
      notes: item.notes,
      checked_in_at: item.checked_in_at,
      checked_out_at: item.checked_out_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    },
    guest: item.guest,
    room: item.room,
  }))
}

/**
 * Obtiene estadísticas para el dashboard de recepción
 */
export async function getReceptionStats(): Promise<{
  checkInsToday: number
  checkOutsToday: number
  activeReservations: number // Cantidad de huéspedes actuales (estadías activas)
  totalRooms: number
  occupancyRate: number
}> {
  const supabase = await createClient()

  if (!supabase) {
    return {
      checkInsToday: 0,
      checkOutsToday: 0,
      activeReservations: 0,
      totalRooms: 0,
      occupancyRate: 0,
    }
  }

  // Obtener check-ins de hoy
  const todayCheckIns = await getTodayCheckIns()
  
  // Obtener check-outs de hoy
  const todayCheckOuts = await getTodayCheckOuts()
  
  // Obtener huéspedes actuales (estadías activas)
  const activeReservations = await getActiveReservations()

  // Obtener total de habitaciones
  const { count: totalRooms } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const totalRoomsCount = totalRooms || 0
  const activeCount = activeReservations.length
  const occupancyRate = totalRoomsCount > 0 
    ? Math.round((activeCount / totalRoomsCount) * 100) 
    : 0

  return {
    checkInsToday: todayCheckIns.length,
    checkOutsToday: todayCheckOuts.length,
    activeReservations: activeCount,
    totalRooms: totalRoomsCount,
    occupancyRate,
  }
}
