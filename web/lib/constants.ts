export const HOTEL_INFO = {
  name: 'Hotel Sauna Belén',
  slogan: 'Tu oasis de relajación en Moquegua',
  address: 'Calle Huánuco 120, Moquegua, Perú',
  phone: '948-924-822',
  email: 'reservas@hotelsaunabelen.com',
  category: 'Hotel 3 estrellas',
} as const

export const ROOM_TYPES = {
  king: 'Suite King con Sauna',
  matrimonial: 'Habitación Matrimonial con Sauna',
  simple: 'Habitación Simple con Sauna',
} as const

export const RESERVATION_STATUS = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
  no_show: 'No Show',
} as const

export const INVENTORY_MOVEMENT_TYPES = {
  entrada: 'Entrada',
  salida: 'Salida',
  ajuste: 'Ajuste',
} as const

export const DOCUMENT_TYPES = ['DNI', 'CE', 'PASAPORTE'] as const

