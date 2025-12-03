'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Package, BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'

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
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Reportes de Inventario"
        description="Análisis y estadísticas de consumo"
        icon={BarChart3}
        backHref="/admin/inventario"
      />

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
              Valor Total del Inventario
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy">
              S/ {MOCK_REPORTS.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
              Gasto Mensual
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-navy">
              S/ {MOCK_REPORTS.monthlySpend.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productos Más Usados */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
            Productos Más Consumidos (Este Mes)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {MOCK_REPORTS.topProducts.map((product, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-semibold">{product.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xl sm:text-2xl font-bold text-navy">{product.consumption}</p>
                  <p className="text-xs text-gray-500">unidades</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consumo Mensual */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Consumo Mensual (Últimos 4 Meses)</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-2 sm:space-y-3">
            {MOCK_REPORTS.monthlyConsumption.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <span className="text-sm sm:text-base text-gray-700">{item.month}</span>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex-1 sm:w-48 bg-gray-200 rounded-full h-3 sm:h-4">
                    <div
                      className="bg-gold h-3 sm:h-4 rounded-full"
                      style={{
                        width: `${(item.value / 15000) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm sm:text-base font-semibold w-20 sm:w-24 text-right">
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

