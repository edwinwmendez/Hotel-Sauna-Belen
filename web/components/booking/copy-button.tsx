'use client'

import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Código copiado al portapapeles')
    } catch (error) {
      toast.error('Error al copiar el código')
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
    >
      <Copy className="h-4 w-4 mr-2" />
      Copiar
    </Button>
  )
}

