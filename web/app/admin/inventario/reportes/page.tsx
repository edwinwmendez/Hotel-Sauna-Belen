'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react'

// Mock de reportes
const MOCK_REPORTS = {
  monthlyConsumption: [
    { month: 'Enero', value: 12500 },
    { month: 'Febrero', value: 13200 },
    { month: 'Marzo', value: 11800 },
    { month: 'Abril', value: 14500 },
  ],
  topProducts: [
    { name: 'Jabón tocador 30g', consumption: 450, category: 'Amenidades' },
    { name: 'Papel higiénico', consumption: 320, category: 'Papelería' },
    { name: 'Toalla de baño', consumption: 180, category: 'Blancos' },
  ],
  totalValue: 12500,
  monthlySpend: 14500,
}

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Reportes de Inventario</h1>
        <p className="text-gray-600">Análisis y estadísticas de consumo</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gold" />
              Valor Total del Inventario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">
              S/ {MOCK_REPORTS.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold" />
              Gasto Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">
              S/ {MOCK_REPORTS.monthlySpend.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productos Más Usados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gold" />
            Productos Más Consumidos (Este Mes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_REPORTS.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-navy">{product.consumption}</p>
                  <p className="text-xs text-gray-500">unidades</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consumo Mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Consumo Mensual (Últimos 4 Meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_REPORTS.monthlyConsumption.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{item.month}</span>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gold h-4 rounded-full"
                      style={{
                        width: `${(item.value / 15000) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-semibold w-20 text-right">
                    S/ {item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

