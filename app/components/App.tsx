'use client'

import { motion } from 'framer-motion'
import { HeroSection } from './HeroSection'
import { ChatDemo } from '@/app/components/ChatDemo'
import { Features } from '@/app/components/Features'
import { Footer } from '@/app/components/Footer'

export function App() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen pt-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <HeroSection />
        <ChatDemo />
        <Features />
        <Footer />
      </main>
    </div>
  )
}
