import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from './components/HeroSection';
import { ChatDemo } from './components/ChatDemo';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
export function App() {
  return <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <ChatDemo />
        <Features />
        <Footer />
      </div>
    </div>;
}