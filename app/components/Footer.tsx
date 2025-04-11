'use client'

import { Github, Linkedin, X } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-8 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-1">AI Persona Chat</h3>
            <p className="text-gray-400 text-sm">Learn from the experts, virtually</p>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://x.com/AnantGabhane" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </a>
            <a 
              href="https://github.com/AnantGabhane" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/anantgabhane/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2024 AI Persona Chat. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
