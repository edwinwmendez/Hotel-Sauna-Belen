import { Database } from '@/lib/supabase/types'
import { ReservationWithDetails } from '@/lib/queries/reception'

type Room = Database['public']['Tables']['rooms']['Row']
type Guest = Database['public']['Tables']['guests']['Row']

export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance'

/**
 * Determina el estado actual de una habitación
 * Considera reservas activas (checked-in pero no checked-out)
 */
export function getRoomStatus(
  room: Room,
  activeReservations: ReservationWithDetails[]
): RoomStatus {
  // Si la habitación está inactiva, considerarla en mantenimiento
  if (!room.is_active) {
    return 'maintenance'
  }

  // Buscar si hay una reserva activa para esta habitación
  const activeReservation = activeReservations.find(
    (res) => res.reservation.room_id === room.id
  )

  if (activeReservation) {
    // Si hay una reserva activa (checked-in sin checked-out), está ocupada
    return 'occupied'
  }

  // Por defecto, disponible
  return 'available'
}

/**
 * Verifica si una habitación está ocupada
 */
export function isRoomOccupied(
  roomId: string,
  activeReservations: ReservationWithDetails[]
): boolean {
  return activeReservations.some(
    (res) => res.reservation.room_id === roomId
  )
}

/**
 * Obtiene información del huésped actual en una habitación
 */
export function getOccupiedRoomInfo(
  roomId: string,
  activeReservations: ReservationWithDetails[]
): { guest: Guest; checkoutDate: string } | null {
  const activeReservation = activeReservations.find(
    (res) => res.reservation.room_id === roomId
  )

  if (!activeReservation) {
    return null
  }

  return {
    guest: activeReservation.guest,
    checkoutDate: activeReservation.reservation.check_out,
  }
}

/**
 * Obtiene el color/estilo para mostrar el estado de una habitación
 */
export function getRoomStatusColor(status: RoomStatus): {
  bg: string
  text: string
  border: string
} {
  switch (status) {
    case 'available':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300',
      }
    case 'occupied':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-300',
      }
    case 'cleaning':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300',
      }
    case 'maintenance':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-300',
      }
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-300',
      }
  }
}

/**
 * Obtiene el texto legible para el estado de una habitación
 */
export function getRoomStatusLabel(status: RoomStatus): string {
  switch (status) {
    case 'available':
      return 'Disponible'
    case 'occupied':
      return 'Ocupada'
    case 'cleaning':
      return 'Limpieza'
    case 'maintenance':
      return 'Mantenimiento'
    default:
      return 'Desconocido'
  }
}

/**
 * Obtiene el ícono para el estado de una habitación (lucide-react)
 */
export function getRoomStatusIcon(status: RoomStatus): string {
  switch (status) {
    case 'available':
      return 'CheckCircle' // Verde
    case 'occupied':
      return 'UserCheck' // Rojo
    case 'cleaning':
      return 'Sparkles' // Amarillo
    case 'maintenance':
      return 'Wrench' // Gris
    default:
      return 'HelpCircle'
  }
}

