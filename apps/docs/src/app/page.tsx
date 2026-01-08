import { Hero } from '@/components/home/hero'
import { BentoGrid } from '@/components/home/bento-grid'
import { Features } from '@/components/home/features'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <BentoGrid />
      <Features />
    </main>
  )
}
