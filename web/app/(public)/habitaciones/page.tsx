import { getRooms } from '@/lib/queries/rooms'
import { RoomCard } from '@/components/rooms/room-card'

export const metadata = {
  title: 'Habitaciones',
  description: 'Descubre nuestras habitaciones con sauna privado incluido. Suite King, Matrimonial y Simple. Desde S/120 por noche en Moquegua.',
}

export default async function HabitacionesPage() {
  const rooms = await getRooms()

  return (
    <div className="py-12 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-navy mb-4 font-serif">
            Nuestras Habitaciones
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Todas incluyen sauna privado para tu confort
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay habitaciones disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

