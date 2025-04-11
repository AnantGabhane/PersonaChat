import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { SendIcon, MicIcon, UserIcon } from 'lucide-react';
export function ChatDemo() {
  const [activePersona, setActivePersona] = useState('hitesh');
  return <motion.section initial={{
    opacity: 0,
    y: 40
  }} whileInView={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.8
  }} viewport={{
    once: true
  }} className="py-16 relative">
      <h2 className="text-3xl font-bold text-center mb-12">
        Experience the Conversation
      </h2>
      <div className="grid md:grid-cols-5 gap-8 items-center">
        <div className="md:col-span-2">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex gap-6">
              <PersonaButton name="hitesh" active={activePersona === 'hitesh'} onClick={() => setActivePersona('hitesh')} color="purple" imageUrl="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" />
              <PersonaButton name="piyush" active={activePersona === 'piyush'} onClick={() => setActivePersona('piyush')} color="blue" imageUrl="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                Currently chatting with{' '}
                {activePersona === 'hitesh' ? 'Hitesh sir' : 'Piyush sir'}
              </h3>
              <p className="text-gray-400">
                {activePersona === 'hitesh' ? 'Expert in web development and JavaScript fundamentals' : 'Specializes in React, Next.js and modern frontend'}
              </p>
            </div>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700 shadow-xl">
            <div className="h-80 overflow-y-auto mb-4 space-y-4 p-2">
              {activePersona === 'hitesh' ? <>
                  <ChatMessage persona="hitesh" message="Hello! I'm Hitesh. How can I help you with web development today?" color="purple" imageUrl="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" />
                  <ChatMessage isUser message="Can you explain promises in JavaScript?" />
                  <ChatMessage persona="hitesh" message="Sure! Promises in JavaScript are objects representing the eventual completion or failure of an asynchronous operation. They allow you to write cleaner code by chaining .then() and .catch() methods instead of nesting callbacks." color="purple" imageUrl="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" />
                </> : <>
                  <ChatMessage persona="piyush" message="Hi there! I'm Piyush. Need help with React or Next.js?" color="blue" imageUrl="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" />
                  <ChatMessage isUser message="What are React hooks?" />
                  <ChatMessage persona="piyush" message="React Hooks are functions that let you use state and other React features without writing a class. Popular hooks include useState for managing state, useEffect for side effects, and useContext for consuming context. They make your code more reusable and easier to understand." color="blue" imageUrl="https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" />
                </>}
            </div>
            <div className="flex items-center gap-2 bg-gray-900/70 rounded-full px-4 py-2 border border-gray-700">
              <input type="text" placeholder={`Ask ${activePersona === 'hitesh' ? 'Hitesh' : 'Piyush'} anything...`} className="bg-transparent border-none focus:outline-none flex-grow text-white" />
              <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                <MicIcon size={20} />
              </button>
              <button className={`p-2 rounded-full ${activePersona === 'hitesh' ? 'bg-purple-600' : 'bg-blue-600'} text-white`}>
                <SendIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>;
}
function PersonaButton({
  name,
  active,
  onClick,
  color,
  imageUrl
}) {
  return <motion.button whileHover={{
    scale: 1.05
  }} whileTap={{
    scale: 0.95
  }} onClick={onClick} className={`relative p-1 rounded-full ${active ? `ring-2 ring-${color}-500 ring-offset-2 ring-offset-gray-900` : ''}`}>
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden">
        <img src={imageUrl} alt={`${name} persona`} className="w-full h-full object-cover" />
      </div>
      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-${color}-500 flex items-center justify-center ${active ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>
    </motion.button>;
}
function ChatMessage({
  persona,
  message,
  isUser = false,
  color,
  imageUrl
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0">
        {isUser ? <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <UserIcon size={16} />
          </div> : <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src={imageUrl} alt={persona} className="w-full h-full object-cover" />
          </div>}
      </div>
      <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${isUser ? 'bg-gray-700' : color === 'purple' ? 'bg-purple-900/40' : 'bg-blue-900/40'}`}>
        <p className="text-sm">{message}</p>
      </div>
    </motion.div>;
}