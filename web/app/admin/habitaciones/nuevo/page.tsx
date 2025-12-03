'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ROOM_TYPES } from '@/lib/constants'
import { Save } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NuevaHabitacionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [room, setRoom] = useState<{
    name: string
    type: 'king' | 'matrimonial' | 'simple'
    description: string
    price_per_night: number
    capacity: number
    max_adults: number | null
    max_youths: number | null
    max_children: number | null
    max_infants: number | null
    amenities: string
    is_active: boolean
  }>({
    name: '',
    type: 'simple',
    description: '',
    price_per_night: 0,
    capacity: 1,
    max_adults: null,
    max_youths: null,
    max_children: null,
    max_infants: null,
    amenities: '',
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: Implementar creación real
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Habitación creada correctamente')
    setLoading(false)
    router.push('/admin/habitaciones')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Nueva Habitación"
        description="Crear una nueva habitación"
        backHref="/admin/habitaciones"
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Información Básica */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Nombre *
                </label>
                <Input
                  value={room.name}
                  onChange={(e) => setRoom({ ...room, name: e.target.value })}
                  placeholder="Ej: Suite King con Sauna"
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Tipo *
                </label>
                <Select
                  value={room.type}
                  onChange={(e) => setRoom({ ...room, type: e.target.value as any })}
                  required
                >
                  {Object.entries(ROOM_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Precio por noche (S/) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={room.price_per_night}
                  onChange={(e) => setRoom({ ...room, price_per_night: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Capacidad Total *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={room.capacity}
                  onChange={(e) => setRoom({ ...room, capacity: parseInt(e.target.value) || 1 })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Capacidad máxima total (adultos + jóvenes + niños)</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">Capacidad por Tipo (Opcional)</p>
                <p className="text-xs text-gray-500 mb-3">Si dejas estos campos vacíos, se usará la capacidad total. Si los defines, se validará contra estos límites específicos.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Máx. Adultos
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={room.max_adults ?? ''}
                      onChange={(e) => setRoom({ ...room, max_adults: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="Sin límite"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Máx. Jóvenes
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={room.max_youths ?? ''}
                      onChange={(e) => setRoom({ ...room, max_youths: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="Sin límite"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Máx. Niños
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={room.max_children ?? ''}
                      onChange={(e) => setRoom({ ...room, max_children: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="Sin límite"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">
                      Máx. Bebés
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={room.max_infants ?? ''}
                      onChange={(e) => setRoom({ ...room, max_infants: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="Sin límite"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Estado *
                </label>
                <Select
                  value={room.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setRoom({ ...room, is_active: e.target.value === 'active' })}
                  required
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Descripción y Amenidades */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">Descripción y Amenidades</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Descripción *
                </label>
                <textarea
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={room.description}
                  onChange={(e) => setRoom({ ...room, description: e.target.value })}
                  placeholder="Describe la habitación..."
                  required
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                  Amenidades (separadas por comas)
                </label>
                <Input
                  value={room.amenities}
                  onChange={(e) => setRoom({ ...room, amenities: e.target.value })}
                  placeholder="Ej: WiFi, TV, Aire acondicionado, Sauna privado"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separa cada amenidad con una coma
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creando...' : 'Crear Habitación'}
          </Button>
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/admin/habitaciones">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

