import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquareIcon, MicIcon, BrainIcon } from 'lucide-react';
export function HeroSection() {
  return <section className="py-20 relative overflow-hidden">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} className="text-center">
        <div className="flex justify-center mb-6">
          <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.2
        }} className="bg-purple-600 p-4 rounded-full">
            <BrainIcon size={32} />
          </motion.div>
        </div>
        <motion.h1 initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.3,
        duration: 0.8
      }} className="text-5xl md:text-6xl font-bold mb-6">
          Chat with <span className="text-purple-500">Hitesh</span> &{' '}
          <span className="text-blue-500">Piyush</span>
        </motion.h1>
        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.5,
        duration: 0.8
      }} className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Experience AI-powered conversations with your favorite personas. Now
          with voice capabilities for a more natural interaction.
        </motion.p>
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.7,
        duration: 0.8
      }} className="flex flex-wrap justify-center gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all">
            <MessageSquareIcon size={18} />
            Start Chatting
          </button>
          <button className="bg-transparent border border-gray-500 hover:border-white text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all">
            <MicIcon size={18} />
            Try Voice Chat
          </button>
        </motion.div>
      </motion.div>
      {/* Decorative elements */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-900/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-900/20 rounded-full filter blur-3xl"></div>
    </section>;
}