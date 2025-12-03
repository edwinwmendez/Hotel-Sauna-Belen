'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NuevaCategoriaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState({
    name: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: Implementar creación real
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Categoría creada correctamente')
    setLoading(false)
    router.push('/admin/inventario/categorias')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Nueva Categoría"
        description="Crear una nueva categoría de inventario"
        backHref="/admin/inventario/categorias"
      />

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
                placeholder="Ej: Amenidades, Limpieza, etc."
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
                placeholder="Describe qué tipo de productos pertenecen a esta categoría..."
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creando...' : 'Crear Categoría'}
          </Button>
          <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/admin/inventario/categorias">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

