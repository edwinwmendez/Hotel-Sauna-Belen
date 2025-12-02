'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RoomGalleryProps {
  images: string[]
  roomName: string
}

export function RoomGallery({ images, roomName }: RoomGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 w-full bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Imagen principal */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full rounded-lg overflow-hidden">
        <Image
          src={images[currentIndex]}
          alt={`${roomName} - Imagen ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
        
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8 sm:h-10 sm:w-10"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8 sm:h-10 sm:w-10"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative h-16 sm:h-20 md:h-24 rounded-md overflow-hidden border-2 transition-all',
                currentIndex === index
                  ? 'border-gold ring-2 ring-gold/50'
                  : 'border-transparent hover:border-gray-300'
              )}
            >
              <Image
                src={image}
                alt={`${roomName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

