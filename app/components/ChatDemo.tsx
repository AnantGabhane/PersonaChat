'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { SendIcon, MicIcon } from 'lucide-react'
import Image from 'next/image'

interface Message {
  text: string;
  isUser: boolean;
  persona?: string;
}

function PersonaButton({ name, active, onClick, color, imageUrl, title, description, skills }: {
  name: string;
  active: boolean;
  onClick: () => void;
  color: string;
  imageUrl: string;
  title: string;
  description: string;
  skills: string[];
}) {
  return (
    <div 
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all w-1/2 ${
        active ? `bg-gray-800/50` : 'hover:bg-gray-800/30'
      }`}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-full overflow-hidden relative ${
        active ? `ring-2 ring-${color}-500` : ''
      }`}>
        <Image
          src={imageUrl}
          alt={`${name} persona`}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-400 mb-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full bg-${color}-600/30 text-${color}-300`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ persona, message, isUser, color, imageUrl }: {
  persona?: string;
  message: string;
  isUser?: boolean;
  color?: string;
  imageUrl?: string;
}) {
  // Function to format the message with proper line breaks
  const formatMessage = (text: string) => {
    return text
      .split('**')
      .map((part, index) => {
        // Bold text handling
        if (index % 2 === 1) {
          return `<strong>${part}</strong>`;
        }
        
        // Handle bullet points and line breaks
        return part
          .replace(/\* /g, '\n• ') // Convert * to bullet points with line break
          .replace(/\n\n/g, '\n') // Remove double line breaks
          .replace(/([!?।]) /g, '$1\n\n') // Add line break after sentences
          .trim();
      })
      .join('');
  };

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
        <p 
          className="text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
        />
      </div>
    </div>
  )
}

export function ChatDemo() {
  const [activePersona, setActivePersona] = useState('hitesh')
  // Maintain separate message histories for each persona
  const [hiteshMessages, setHiteshMessages] = useState<Message[]>([{
    text: "Hanji, to chaliye shuru karte hain! Kya seekhna hai aaj?",
    isUser: false,
    persona: 'hitesh'
  }])
  const [piyushMessages, setPiyushMessages] = useState<Message[]>([{
    text: "Hey, welcome! Kya sikhna chahoge?",
    isUser: false,
    persona: 'piyush'
  }])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const personas = {
    hitesh: {
      title: "Hitesh Choudhary",
      subtitle: "Tech Educator & Entrepreneur",
      description: "Passionate about teaching programming with a focus on practical knowledge and real-world applications.",
      skills: ["JavaScript", "Python", "Web Development", "DSA", "AI"],
      color: "purple",
      imageUrl: "/hitesh.jpeg"
    },
    piyush: {
      title: "Piyush Garg",
      subtitle: "Educator & Content Creator",
      description: "Content creator, educator, and entrepreneur known for his expertise in the tech industry.",
      skills: ["Docker", "React", "Node.js", "Gen AI", "Career Advice"],
      color: "blue",
      imageUrl: "/piyush.jpg"
    }
  }

  // Get current messages based on active persona
  const currentMessages = activePersona === 'hitesh' ? hiteshMessages : piyushMessages
  const setCurrentMessages = activePersona === 'hitesh' ? setHiteshMessages : setPiyushMessages

  const handlePersonaChange = (newPersona: string) => {
    setActivePersona(newPersona)
  }

  const handleSend = async () => {
    const message = inputRef.current?.value.trim()
    if (!message || isLoading) return

    // Add user message to the current persona's chat
    setCurrentMessages(prev => [...prev, { text: message, isUser: true }])
    const inputElement = inputRef.current
    if (inputElement) {
      inputElement.value = ''
    }
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, persona: activePersona }),
      })

      const data = await response.json()
      
      if (data.error) throw new Error(data.error)

      setCurrentMessages(prev => [...prev, {
        text: data.message,
        isUser: false,
        persona: activePersona
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setCurrentMessages(prev => [...prev, {
        text: "Sorry, something went wrong. Please try again.",
        isUser: false,
        persona: activePersona
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section className="py-2" id="chat-section">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4">Experience the Conversation</h2>
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
          <div className="flex flex-row gap-4 mb-6">
            {Object.entries(personas).map(([key, persona]) => (
              <PersonaButton
                key={key}
                name={key}
                active={activePersona === key}
                onClick={() => handlePersonaChange(key)}
                color={persona.color}
                imageUrl={persona.imageUrl}
                title={persona.title}
                description={persona.description}
                skills={persona.skills}
              />
            ))}
          </div>
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {currentMessages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                persona={msg.persona}
                message={msg.text}
                isUser={msg.isUser}
                color={msg.persona === 'hitesh' ? 'purple' : 'blue'}
                imageUrl={msg.persona === 'hitesh' ? '/hitesh.jpeg' : '/piyush.jpg'}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700/50 rounded-full p-2 animate-pulse">
                  <div className="w-6 h-6" />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 bg-gray-700/30 rounded-xl p-3">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Ask ${activePersona === 'hitesh' ? 'Hitesh' : 'Piyush'} anything...`}
              className="bg-transparent border-none focus:outline-none flex-grow text-white"
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50"
              onClick={handleSend}
              disabled={isLoading}
            >
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
