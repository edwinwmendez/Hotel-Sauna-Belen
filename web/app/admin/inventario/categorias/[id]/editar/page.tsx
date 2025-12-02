'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Mock de categoría
const getMockCategory = (id: string) => ({
  id,
  name: 'Amenidades',
  description: 'Productos de tocador para huéspedes',
})

export default function EditarCategoriaPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [category, setCategory] = useState(getMockCategory(id))
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: Implementar actualización real
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Categoría actualizada correctamente')
    setLoading(false)
    router.push(`/admin/inventario/categorias/${id}`)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/inventario/categorias/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy">Editar Categoría</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{category.name}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Información de la Categoría</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                Nombre *
              </label>
              <Input
                value={category.name}
                onChange={(e) => setCategory({ ...category, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
                Descripción *
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={category.description}
                onChange={(e) => setCategory({ ...category, description: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/admin/inventario/categorias/${id}`}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

