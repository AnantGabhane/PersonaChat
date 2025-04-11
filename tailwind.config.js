/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-purple-500',
    'bg-purple-600',
    'bg-purple-600/30',
    'text-purple-300',
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-600/30',
    'text-blue-300',
    'ring-purple-500',
    'ring-blue-500',
    'from-purple-600',
    'to-blue-600',
  ]
}
