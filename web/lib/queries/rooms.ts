import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'
import { MOCK_ROOMS } from '@/lib/supabase/mock'

type Room = Database['public']['Tables']['rooms']['Row']

export async function getRooms(): Promise<Room[]> {
  const supabase = await createClient()
  
  // Si no hay Supabase configurado, usar mocks
  if (!supabase) {
    return MOCK_ROOMS as Room[]
  }
  
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_active', true)
    .order('price_per_night', { ascending: true })
  
  if (error) {
    console.error('Error fetching rooms:', error)
    return MOCK_ROOMS as Room[]
  }
  
  return data || MOCK_ROOMS as Room[]
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const supabase = await createClient()
  
  // Si no hay Supabase configurado, usar mocks
  if (!supabase) {
    const room = MOCK_ROOMS.find(r => r.slug === slug)
    return room as Room | null
  }
  
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Error fetching room:', error)
    const room = MOCK_ROOMS.find(r => r.slug === slug)
    return room as Room | null
  }
  
  return data
}

export async function getRoomById(id: string): Promise<Room | null> {
  const supabase = await createClient()
  
  // Si no hay Supabase configurado, usar mocks
  if (!supabase) {
    const room = MOCK_ROOMS.find(r => r.id === id)
    return room as Room | null
  }
  
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Error fetching room:', error)
    const room = MOCK_ROOMS.find(r => r.id === id)
    return room as Room | null
  }
  
  return data
}

export async function getAvailableRooms(
  checkIn: string,
  checkOut: string,
  guests?: { adults: number; youths: number; children: number; infants: number }
): Promise<Room[]> {
  const supabase = await createClient()
  
  // Si no hay Supabase configurado, retornar todas las habitaciones mock
  if (!supabase) {
    const mockRooms = MOCK_ROOMS as Room[]
    // Si hay información de huéspedes, filtrar por capacidad
    if (guests) {
      const { canRoomAccommodateGuests } = await import('@/lib/utils/room-capacity')
      return mockRooms.filter(room => canRoomAccommodateGuests(room, guests))
    }
    return mockRooms
  }
  
  // Obtener todas las habitaciones activas
  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_active', true)
  
  if (roomsError || !rooms) {
    console.error('Error fetching rooms:', roomsError)
    return MOCK_ROOMS as Room[]
  }
  
  // Verificar disponibilidad para cada habitación
  const availableRooms: Room[] = []
  
  for (const room of rooms) {
    // Verificar disponibilidad de fechas
    const { data: isAvailable } = await supabase.rpc('check_room_availability', {
      p_room_id: room.id,
      p_check_in: checkIn,
      p_check_out: checkOut,
    })
    
    if (isAvailable) {
      // Si hay información de huéspedes, verificar capacidad
      if (guests) {
        const { canRoomAccommodateGuests } = await import('@/lib/utils/room-capacity')
        if (canRoomAccommodateGuests(room, guests)) {
          availableRooms.push(room)
        }
      } else {
        availableRooms.push(room)
      }
    }
  }
  
  return availableRooms.length > 0 ? availableRooms : []
}
