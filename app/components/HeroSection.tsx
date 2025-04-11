'use client'

import { motion } from 'framer-motion'
import { Bot, Mic } from 'lucide-react'
import { scrollToChatAndFocus } from './ChatDemo'

export function HeroSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-8 pb-6" // Adjusted padding
    >
      <motion.div 
        className="max-w-4xl mx-auto px-4 text-center"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute top-8 left-1/2 -translate-x-1/2"> {/* Added top-8 for logo padding */}
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20" // Adjusted spacing from logo to heading
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Chat with <span className="text-purple-500">Hitesh</span> & <span className="text-blue-500">Piyush</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6"> {/* Reduced bottom margin */}
            Experience AI-powered conversations with your favorite personas. Now with voice capabilities for a more natural interaction.
          </p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12" // Added bottom margin
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button 
              onClick={scrollToChatAndFocus}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
            >
              <Bot size={20} />
              Start Chatting
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
              <Mic size={20} />
              Try Voice Chat
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
