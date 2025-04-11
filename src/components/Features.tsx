import React from 'react';
import { motion } from 'framer-motion';
import { MicIcon, BrainIcon, MessageSquareIcon, ZapIcon } from 'lucide-react';
export function Features() {
  const features = [{
    icon: <MicIcon className="w-6 h-6" />,
    title: 'Voice Interaction',
    description: 'Talk naturally with both personas using advanced speech recognition.'
  }, {
    icon: <BrainIcon className="w-6 h-6" />,
    title: 'Distinct Personalities',
    description: 'Each persona has unique knowledge, speaking style, and expertise.'
  }, {
    icon: <MessageSquareIcon className="w-6 h-6" />,
    title: 'Text Chat',
    description: "Type your questions when voice interaction isn't convenient."
  }, {
    icon: <ZapIcon className="w-6 h-6" />,
    title: 'Instant Responses',
    description: 'Get immediate, accurate answers to your technical questions.'
  }];
  return <motion.section initial={{
    opacity: 0
  }} whileInView={{
    opacity: 1
  }} transition={{
    duration: 0.8
  }} viewport={{
    once: true
  }} className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why Choose Our AI Personas?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Learn from the best with our AI-powered personas that bring expert
          knowledge directly to you.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => <motion.div key={index} initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: index * 0.1
      }} viewport={{
        once: true
      }} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>)}
      </div>
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8,
      delay: 0.4
    }} viewport={{
      once: true
    }} className="mt-16 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-gray-700 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to start learning?</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Begin your journey with Hitesh and Piyush today and accelerate your
          web development skills.
        </p>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all">
          Get Started Now
        </button>
      </motion.div>
    </motion.section>;
}