// Mock data para desarrollo sin Supabase
export const MOCK_ROOMS = [
  {
    id: '1',
    name: 'Suite King con Sauna',
    slug: 'suite-king-sauna',
    type: 'king' as const,
    description: 'Nuestra habitación más espaciosa con cama King Size, sauna privado de madera, y todas las comodidades para una estadía inolvidable.',
    price_per_night: 250,
    capacity: 4, // Capacidad total
    max_adults: 2, // Máximo 2 adultos
    max_youths: 2, // Puede tener hasta 2 jóvenes
    max_children: 2, // Puede tener hasta 2 niños
    max_infants: 2, // Puede tener hasta 2 bebés (no cuentan para capacidad)
    amenities: ['Sauna privado', 'Cama King Size', 'TV Smart 55"', 'WiFi', 'Minibar', 'Caja fuerte', 'Aire acondicionado'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Habitación Matrimonial con Sauna',
    slug: 'habitacion-matrimonial-sauna',
    type: 'matrimonial' as const,
    description: 'Perfecta para parejas. Habitación acogedora con cama matrimonial, sauna privado y ambiente romántico.',
    price_per_night: 180,
    capacity: 3, // Capacidad total
    max_adults: 2, // Máximo 2 adultos
    max_youths: 1, // Puede tener 1 joven
    max_children: 2, // Puede tener hasta 2 niños
    max_infants: 1, // Puede tener 1 bebé
    amenities: ['Sauna privado', 'Cama matrimonial', 'TV Smart 43"', 'WiFi', 'Aire acondicionado'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Habitación Simple con Sauna',
    slug: 'habitacion-simple-sauna',
    type: 'simple' as const,
    description: 'Ideal para viajeros solos. Compacta pero confortable, con todas las amenidades esenciales incluyendo tu sauna privado.',
    price_per_night: 120,
    capacity: 1, // Capacidad total
    max_adults: 1, // Solo 1 adulto
    max_youths: 0, // No admite jóvenes
    max_children: 0, // No admite niños
    max_infants: 0, // No admite bebés
    amenities: ['Sauna privado', 'Cama 1.5 plazas', 'TV Smart 32"', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    ],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const MOCK_USER = {
  id: 'mock-user-1',
  email: 'cliente@example.com',
  role: 'customer' as const,
  name: 'Cliente Demo',
}

export const MOCK_ADMIN = {
  id: 'mock-admin-1',
  email: 'admin@hotelsaunabelen.com',
  role: 'admin' as const,
  name: 'Administrador',
}

