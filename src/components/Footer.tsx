import React from 'react';
import { GithubIcon, TwitterIcon, YoutubeIcon } from 'lucide-react';
export function Footer() {
  return <footer className="py-12 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-1">AI Persona Chat</h3>
          <p className="text-gray-400">Learn from the experts, virtually.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <TwitterIcon size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <GithubIcon size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <YoutubeIcon size={20} />
          </a>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} AI Persona Chat. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </footer>;
}