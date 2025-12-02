import { Hero } from '@/components/home/hero'
import { SaunaSection } from '@/components/home/sauna-section'
import { RoomPreview } from '@/components/home/room-preview'
import { AmenitiesSection } from '@/components/home/amenities'
import { LocationSection } from '@/components/home/location'

export default function HomePage() {
  return (
    <>
      <Hero />
      <SaunaSection />
      <RoomPreview />
      <AmenitiesSection />
      <LocationSection />
    </>
  )
}

