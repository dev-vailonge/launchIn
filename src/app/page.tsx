import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Problems } from '@/components/sections/Problems'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Pricing } from '@/components/sections/Pricing'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problems />
        <HowItWorks />
        <Pricing />
        <Footer />
      </main>
    </>
  )
}
