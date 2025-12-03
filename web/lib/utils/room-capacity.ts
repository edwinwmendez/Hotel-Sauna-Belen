import { Database } from '@/lib/supabase/types'

type Room = Database['public']['Tables']['rooms']['Row']
type Guests = {
  adults: number
  youths: number
  children: number
  infants: number
}

/**
 * Verifica si una habitación puede acomodar el desglose de huéspedes especificado
 * 
 * Lógica:
 * - Si la habitación tiene campos específicos (max_adults, etc.), validar contra esos
 * - Si no tiene campos específicos, usar capacity total (adultos + jóvenes + niños)
 * - Los bebés generalmente no cuentan para capacidad (pero pueden tener límite)
 */
export function canRoomAccommodateGuests(room: Room, guests: Guests): boolean {
  const { adults, youths, children, infants } = guests
  const totalGuests = adults + youths + children

  // Si la habitación tiene capacidad específica definida, validar contra esos límites
  if (room.max_adults !== null || room.max_youths !== null || room.max_children !== null || room.max_infants !== null) {
    // Validar cada tipo de huésped contra su límite específico
    if (room.max_adults !== null && adults > room.max_adults) {
      return false
    }
    if (room.max_youths !== null && youths > room.max_youths) {
      return false
    }
    if (room.max_children !== null && children > room.max_children) {
      return false
    }
    if (room.max_infants !== null && infants > room.max_infants) {
      return false
    }
    
    // Validar que haya al menos 1 adulto
    if (adults < 1) {
      return false
    }
    
    return true
  }

  // Si no tiene capacidad específica, usar capacity total
  // Los bebés no cuentan para capacidad total (pero pueden tener límite si está definido)
  if (room.max_infants !== null && infants > room.max_infants) {
    return false
  }

  // Validar capacidad total (adultos + jóvenes + niños)
  if (totalGuests > room.capacity) {
    return false
  }

  // Validar que haya al menos 1 adulto
  if (adults < 1) {
    return false
  }

  return true
}

/**
 * Obtiene la capacidad de una habitación en formato legible
 */
export function getRoomCapacityDisplay(room: Room): string {
  // Si tiene capacidad específica, mostrar desglose
  if (room.max_adults !== null || room.max_youths !== null || room.max_children !== null || room.max_infants !== null) {
    const parts: string[] = []
    
    if (room.max_adults !== null) {
      parts.push(`${room.max_adults} adulto${room.max_adults > 1 ? 's' : ''}`)
    }
    if (room.max_youths !== null && room.max_youths > 0) {
      parts.push(`${room.max_youths} joven${room.max_youths > 1 ? 'es' : ''}`)
    }
    if (room.max_children !== null && room.max_children > 0) {
      parts.push(`${room.max_children} niño${room.max_children > 1 ? 's' : ''}`)
    }
    if (room.max_infants !== null && room.max_infants > 0) {
      parts.push(`${room.max_infants} bebé${room.max_infants > 1 ? 's' : ''}`)
    }
    
    if (parts.length > 0) {
      return parts.join(', ')
    }
  }

  // Si no tiene capacidad específica, mostrar capacidad total
  return `${room.capacity} ${room.capacity === 1 ? 'persona' : 'personas'}`
}

/**
 * Obtiene la capacidad detallada de una habitación para mostrar en UI
 */
export function getRoomCapacityDetails(room: Room): {
  adults: number | null
  youths: number | null
  children: number | null
  infants: number | null
  total: number
} {
  return {
    adults: room.max_adults ?? room.capacity, // Si no tiene específico, usar capacity
    youths: room.max_youths ?? 0,
    children: room.max_children ?? 0,
    infants: room.max_infants ?? 0,
    total: room.capacity,
  }
}

