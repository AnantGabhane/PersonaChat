'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { SendIcon, MicIcon, Settings } from 'lucide-react'
import Image from 'next/image'

interface Message {
  text: string;
  isUser: boolean;
  persona?: string;
}

interface AISettings {
  temperature: number;
  tone: 'default' | 'funny' | 'advice' | 'educational';
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
  const getSkillBackground = () => {
    if (name === 'piyush') return 'bg-[#0066FF]/10 text-[#0066FF]';
    return 'bg-purple-500/10 text-purple-400';
  };

  return (
    <div 
      className="flex items-center p-3 rounded-lg cursor-pointer transition-all w-1/2 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/50"
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
      <div className="ml-3 flex-1">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${getSkillBackground()}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ persona, message, isUser, color, imageUrl }: {
  persona?: string;
  message: string;
  isUser?: boolean;
  color?: string;
  imageUrl?: string;
}) {
  const formatMessage = (text: string) => {
    return text
      .split(/\n\s*\n/) // Split on multiple newlines
      .map(paragraph => {
        return paragraph
          .trim()
          // Handle emojis - add spacing
          .replace(/(\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff])/g, ' $1 ')
          // Handle bold text
          .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
          // Handle bullet points
          .replace(/^[•\*]\s+(.+)/gm, '<li>$1</li>')
          // Wrap bullet points in ul
          .replace(/((?:<li>.*<\/li>\n*)+)/g, '<ul class="list-disc ml-4 my-2">$1</ul>')
          // Add paragraph spacing
          .replace(/([!?।])\s+/g, '$1</p><p class="mt-3">')
      })
      .filter(para => para.trim() !== '') // Remove empty paragraphs
      .map(para => `<p class="my-2">${para}</p>`)
      .join('');
  };

  const getBgColor = () => {
    if (isUser) return 'bg-gray-700/50';
    if (persona === 'piyush') return 'bg-[#0066FF]/50 backdrop-blur-sm';
    return `bg-${color}-600/50 backdrop-blur-sm`;
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
        className={`${getBgColor()} rounded-2xl p-4 max-w-[80%]`}
      >
        <div 
          className="text-sm whitespace-pre-wrap prose prose-invert"
          dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
        />
      </div>
    </div>
  )
}

function SettingsModal({ isOpen, onClose, settings, onSettingsChange }: {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 right-0 w-72 bg-gray-800 rounded-2xl p-4 border border-gray-700/30 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">AI Settings</h3>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-300 mb-2">
          Temperature: {settings.temperature}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={settings.temperature}
          onChange={(e) => onSettingsChange({
            ...settings,
            temperature: parseFloat(e.target.value)
          })}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <p className="text-xs text-gray-400 mt-1">
          Lower for consistent, higher for creative responses
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">
          Personality Tone
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['default', 'funny', 'advice', 'educational'].map((tone) => (
            <button
              key={tone}
              onClick={() => onSettingsChange({
                ...settings,
                tone: tone as AISettings['tone']
              })}
              className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                settings.tone === tone
                  ? 'bg-purple-600 border border-purple-500'
                  : 'bg-gray-700 border border-gray-700 hover:border-purple-500/50'
              }`}
            >
              {tone.charAt(0).toUpperCase() + tone.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<AISettings>({
    temperature: 0,  // Changed from 0.7 to 0
    tone: 'default'
  })

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
        body: JSON.stringify({ 
          message, 
          persona: activePersona,
          settings: settings // Add settings to the request
        }),
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

  // Add click handler for the chat container
  const handleContainerClick = (e: React.MouseEvent) => {
    // Check if the click is outside the settings button and settings modal
    const settingsButton = document.querySelector('[data-settings-button]');
    const settingsModal = document.querySelector('[data-settings-modal]');
    
    if (settingsButton && settingsModal) {
      if (!settingsButton.contains(e.target as Node) && !settingsModal.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
  };

  return (
    <section className="py-2" id="chat-section">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4">Experience the Conversation</h2>
        <div 
          className="bg-gray-800 rounded-2xl p-6 border border-gray-700/30"
          onClick={handleContainerClick}
        >
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
                color={personas[msg.persona as keyof typeof personas]?.color || 'gray'}
                imageUrl={personas[msg.persona as keyof typeof personas]?.imageUrl}
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
          <div className="flex items-center gap-2 bg-gray-700 rounded-xl p-3 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Ask ${activePersona === 'hitesh' ? 'Hitesh' : 'Piyush'} anything...`}
              className="bg-transparent border-none focus:outline-none flex-grow text-white"
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              data-settings-button
              className="p-2 rounded-full hover:bg-gray-600 transition-colors relative"
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsOpen(!isSettingsOpen);
              }}
            >
              <Settings size={18} className="text-gray-400 hover:text-gray-300" />
            </button>
            <button 
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50"
              onClick={handleSend}
              disabled={isLoading}
            >
              <SendIcon size={18} />
            </button>
            
            <div data-settings-modal>
              <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onSettingsChange={setSettings}
              />
            </div>
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
