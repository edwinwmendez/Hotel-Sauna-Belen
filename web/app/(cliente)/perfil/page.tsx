'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/client-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function PerfilPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    documentType: 'DNI' as 'DNI' | 'CE' | 'PASAPORTE',
    documentNumber: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock: Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Perfil actualizado correctamente')
    setLoading(false)
  }

  return (
    <div className="py-12">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Actualiza tu información de contacto y datos personales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">El email no se puede modificar</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="987654321"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="documentType" className="text-sm font-medium text-gray-700">
                    Tipo de documento
                  </label>
                  <select
                    id="documentType"
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value as 'DNI' | 'CE' | 'PASAPORTE' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="PASAPORTE">PASAPORTE</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="documentNumber" className="text-sm font-medium text-gray-700">
                    Número de documento
                  </label>
                  <Input
                    id="documentNumber"
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    placeholder="12345678"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

