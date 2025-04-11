'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { SendIcon, MicIcon } from 'lucide-react'
import Image from 'next/image'

function PersonaButton({ name, active, onClick, color, imageUrl }: {
  name: string;
  active: boolean;
  onClick: () => void;
  color: string;
  imageUrl: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-1 rounded-full ${
        active ? `ring-2 ring-${color}-500 ring-offset-2 ring-offset-gray-900` : ''
      }`}
    >
      <div className="w-12 h-12 rounded-full overflow-hidden relative">
        <Image
          src={imageUrl}
          alt={`${name} persona`}
          fill
          className="object-cover"
        />
      </div>
    </motion.button>
  )
}

function ChatMessage({ persona, message, isUser, color, imageUrl }: {
  persona?: string;
  message: string;
  isUser?: boolean;
  color?: string;
  imageUrl?: string;
}) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden relative">
          <Image 
            src={imageUrl || ''} 
            alt={persona || 'Chat persona'} 
            fill 
            className="object-cover" 
          />
        </div>
      )}
      <div
        className={`${
          isUser
            ? 'bg-gray-700/50'
            : `bg-${color}-600/50 backdrop-blur-sm`
        } rounded-2xl p-3 max-w-[80%]`}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}

export function ChatDemo() {
  const [activePersona, setActivePersona] = useState('hitesh')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <section className="py-2" id="chat-section"> {/* Reduced padding */}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4">Experience the Conversation</h2>
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
          <div className="flex gap-4 mb-6">
            <PersonaButton
              name="hitesh"
              active={activePersona === 'hitesh'}
              onClick={() => setActivePersona('hitesh')}
              color="purple"
              imageUrl="/hitesh.jpeg"
            />
            <PersonaButton
              name="piyush"
              active={activePersona === 'piyush'}
              onClick={() => setActivePersona('piyush')}
              color="blue"
              imageUrl="/piyush.jpg"
            />
          </div>
          <div className="space-y-4 mb-6">
            <ChatMessage
              persona="hitesh"
              message="Hello! I'm Hitesh. How can I help you with web development today?"
              color="purple"
              imageUrl="/hitesh.jpeg"
            />
            <ChatMessage 
              isUser 
              message="Can you explain promises in JavaScript?" 
            />
            <ChatMessage
              persona="hitesh"
              message="Sure! Promises in JavaScript are objects representing the eventual completion (or failure) of an asynchronous operation. They allow you to write cleaner code by chaining .then() and .catch() methods instead of nesting callbacks."
              color="purple"
              imageUrl="/hitesh.jpeg"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-700/30 rounded-xl p-3">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Ask ${activePersona === 'hitesh' ? 'Hitesh' : 'Piyush'} anything...`}
              className="bg-transparent border-none focus:outline-none flex-grow text-white"
            />
            <button className="p-2 rounded-full hover:bg-gray-600/50 transition-colors">
              <MicIcon size={20} />
            </button>
            <button className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors">
              <SendIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export const scrollToChatAndFocus = () => {
  const chatSection = document.getElementById('chat-section')
  chatSection?.scrollIntoView({ behavior: 'smooth' })
  const input = document.querySelector('input[type="text"]') as HTMLInputElement
  setTimeout(() => input?.focus(), 500) // Add delay to ensure smooth scroll completes
}
