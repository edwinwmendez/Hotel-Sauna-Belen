import { Hero } from '@/components/home/hero'
import { RoomPreview } from '@/components/home/room-preview'
import { SaunaSection } from '@/components/home/sauna-section'
import { AmenitiesSection } from '@/components/home/amenities'
import { TestimonialsSection } from '@/components/home/testimonials'
import { LocationSection } from '@/components/home/location'

export default function HomePage() {
  return (
    <>
      <Hero />
      <RoomPreview />
      <SaunaSection />
      <AmenitiesSection />
      <TestimonialsSection />
      <LocationSection />
    </>
  )
}

