import { getRooms } from '@/lib/queries/rooms'
import { RoomCard } from '@/components/rooms/room-card'

export const metadata = {
  title: 'Habitaciones',
  description: 'Descubre nuestras habitaciones con sauna privado incluido. Suite King, Matrimonial y Simple. Desde S/120 por noche en Moquegua.',
}

export default async function HabitacionesPage() {
  const rooms = await getRooms()

  return (
    <div className="py-8 sm:py-12 bg-gray-50">
      <div className="container px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-3 md:mb-4 font-serif px-4">
            Nuestras Habitaciones
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            Todas incluyen sauna privado para tu confort
          </p>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-600">No hay habitaciones disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

