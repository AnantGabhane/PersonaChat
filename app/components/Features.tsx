'use client'

import { motion } from 'framer-motion'
import { Mic, Brain, MessageSquare, Zap } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Mic className="w-8 h-8 text-purple-500" />,
      title: 'Voice Interaction',
      description:
        'Talk naturally with both personas using advanced speech recognition.',
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      title: 'Distinct Personalities',
      description:
        'Each persona has unique knowledge, speaking style, and expertise.',
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
      title: 'Text Chat',
      description: 'Type your questions when voice interaction isn\'t convenient.',
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      title: 'Instant Responses',
      description: 'Get immediate, accurate answers to your technical questions.',
    },
  ]

  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Our AI Personas?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Learn from the best with our AI-powered personas that bring expert knowledge directly to you.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-gray-900 rounded-xl p-6"
          >
            <div className="mb-4 bg-gray-800 w-12 h-12 rounded-xl flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-8 text-center max-w-6xl mx-auto"
      >
        <h3 className="text-2xl font-bold mb-4">Ready to start learning?</h3>
        <p className="text-gray-300 mb-6">
          Begin your journey with Hitesh and Piyush today and accelerate your web development skills.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium">
          Get Started Now
        </button>
      </motion.div>
    </section>
  )
}
