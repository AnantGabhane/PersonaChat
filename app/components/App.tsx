'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useAuth, useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

interface Message {
  text: string
  isUser: boolean
  persona?: string
}

interface AISettings {
  temperature: number
  tone: 'default' | 'funny' | 'advice' | 'educational'
}

function getDisplayName(user: any): string {
  if (user?.firstName) return user.firstName
  if (user?.username) return user.username
  const email = user?.emailAddresses?.[0]?.emailAddress
  if (email) {
    const local = email.split('@')[0]
    // john.doe → John Doe, john_doe → John Doe, johndoe → Johndoe
    return local
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
  }
  return 'Guest Learner'
}

const PERSONAS = {
  hitesh: {
    name: 'Hitesh Choudhary',
    subtitle: 'Web & JavaScript',
    imageUrl: '/hitesh.jpeg',
    placeholder: 'Puchiye apna sawaal...',
    welcome: 'Hanji, to chaliye shuru karte hain! Kya seekhna hai aaj aapko web development mein?',
  },
  piyush: {
    name: 'Piyush Garg',
    subtitle: 'Systems & DevOps',
    imageUrl: '/piyush.jpg',
    placeholder: 'Ask about systems, architecture or full stack...',
    welcome: 'Haan bhai, welcome! Kya sikhna chahoge aaj? Seedha point pe aate hain.',
  },
}

function parseMarkdown(text: string): string {
  let html = text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered lists
    .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Paragraphs - split by double newlines
    .split(/\n\n+/)
    .map(p => {
      p = p.trim()
      if (!p) return ''
      if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<ul') || p.startsWith('<ol') ||
          p.startsWith('<blockquote') || p.startsWith('<hr') || p.startsWith('<li')) {
        return p
      }
      // Single newlines within a paragraph become <br>
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>'
    })
    .filter(Boolean)
    .join('\n')

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')

  return html
}

export function App() {
  const [activePersona, setActivePersona] = useState<'hitesh' | 'piyush'>('hitesh')
  const [hiteshMessages, setHiteshMessages] = useState<Message[]>([])
  const [piyushMessages, setPiyushMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [settings, setSettings] = useState<AISettings>({
    temperature: 0.7,
    tone: 'default',
  })
  const [enableHinglish, setEnableHinglish] = useState(true)
  const [promptCount, setPromptCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messageAreaRef = useRef<HTMLDivElement>(null)

  const { isSignedIn } = useAuth()
  const { user } = useUser()

  const currentMessages = activePersona === 'hitesh' ? hiteshMessages : piyushMessages
  const setCurrentMessages = activePersona === 'hitesh' ? setHiteshMessages : setPiyushMessages
  const persona = PERSONAS[activePersona]

  const requiresAuth = promptCount >= 3 && !isSignedIn

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight
    }
  }, [currentMessages])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }, [])

  const addSystemMessage = useCallback((text: string, targetPersona: 'hitesh' | 'piyush') => {
    const setter = targetPersona === 'hitesh' ? setHiteshMessages : setPiyushMessages
    setter(prev => [...prev, { text, isUser: false, persona: 'system' }])
  }, [])

  const selectPersona = useCallback((p: 'hitesh' | 'piyush') => {
    setActivePersona(prev => {
      if (p === prev) return prev
      const targetMessages = p === 'hitesh' ? hiteshMessages : piyushMessages
      if (targetMessages.length === 0) {
        const setter = p === 'hitesh' ? setHiteshMessages : setPiyushMessages
        setter([{
          text: PERSONAS[p].welcome,
          isUser: false,
          persona: p,
        }])
      }
      setTimeout(() => {
        addSystemMessage(`Switched to ${PERSONAS[p].name}. ${p === 'hitesh' ? 'JavaScript aur Chai mode ON.' : 'Systems and Logic mode ON.'}`, p)
      }, 0)
      return p
    })
  }, [hiteshMessages, piyushMessages, addSystemMessage])

  const handleSend = useCallback(async () => {
    const textarea = textareaRef.current
    const message = textarea?.value.trim()
    if (!message || isLoading) return

    if (requiresAuth) return

    setCurrentMessages(prev => [...prev, { text: message, isUser: true }])
    if (textarea) {
      textarea.value = ''
      textarea.style.height = 'auto'
    }
    setPromptCount(prev => prev + 1)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          persona: activePersona,
          settings,
          enableHinglish,
        }),
      })
      const data = await response.json()
      if (!response.ok || data.error) {
        throw new Error(data.userMessage ?? data.error ?? 'Something went wrong')
      }
      setCurrentMessages(prev => [...prev, { text: data.message, isUser: false, persona: activePersona }])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sorry, something went wrong.'
      setCurrentMessages(prev => [...prev, { text: errorMessage, isUser: false, persona: activePersona }])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, activePersona, settings, enableHinglish, setCurrentMessages, requiresAuth])

  const handleTextareaInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 192) + 'px'
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleSuggestionClick = useCallback((s: string) => {
    if (textareaRef.current) {
      textareaRef.current.value = s
      handleSend()
    }
  }, [handleSend])

  const renderedMessages = useMemo(() => {
    return currentMessages.map((msg, idx) => {
      if (msg.persona === 'system') {
        return (
          <div key={idx} className="w-full flex justify-center items-center gap-4 py-4 animate-fade-in">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-outline-variant/30" />
            <span className="px-4 py-1 bg-surface-container-high rounded-full text-[10px] text-on-surface-variant font-label-sm uppercase tracking-widest">
              {msg.text}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-outline-variant/30" />
          </div>
        )
      }
      const isBot = !msg.isUser
      const accent = activePersona === 'hitesh' ? 'hitesh-orange' : 'piyush-teal'
      return (
        <div key={idx} className={`flex gap-4 max-w-[85%] group animate-fade-in ${msg.isUser ? 'self-end flex-row-reverse' : ''}`}>
          {isBot ? (
            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${accent}/10 flex items-center justify-center overflow-hidden border border-${accent}/20 shadow-sm`}>
              <img className="w-full h-full object-cover" src={persona.imageUrl} alt="" loading="lazy" />
            </div>
          ) : (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container border shadow-sm">
              <span className="text-lg">👤</span>
            </div>
          )}
          <div className={`space-y-1 ${msg.isUser ? 'text-right' : ''}`}>
            <div className={`px-4 py-3 rounded-2xl shadow-sm border border-outline-variant/10 ${
              msg.isUser
                ? 'bg-primary text-on-primary rounded-tr-xs shadow-md'
                : 'bg-surface-container-low rounded-tl-xs'
            }`}>
              {isBot ? (
                <div
                  className="msg-content text-on-surface text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                />
              ) : (
                <p className="leading-relaxed text-sm">{msg.text}</p>
              )}
            </div>
            <span className="text-[10px] text-on-surface-variant font-label-sm px-1">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      )
    })
  }, [currentMessages, activePersona, persona])

  return (
    <>
      <div className="grainy-overlay" />
      <div className="flex h-screen w-full overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 bg-surface-container-low border-r border-outline-variant/30 flex flex-col">
          <div className="p-6 border-b border-outline-variant/30">
            <span className="font-display text-headline-md font-bold text-primary">HPersona</span>
            <p className="text-label-sm text-on-surface-variant mt-1">AI Learning Companion</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Persona Selection */}
            <div>
              <h4 className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4 px-1">Mentors</h4>
              <div className="space-y-2">
                {(['hitesh', 'piyush'] as const).map(p => (
                  <div
                    key={p}
                    id={`persona-${p}`}
                    onClick={() => selectPersona(p)}
                    className={`cursor-pointer group p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                      activePersona === p
                        ? 'persona-card-active shadow-sm'
                        : 'border-transparent bg-surface-container hover:bg-surface-container-high'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0 ${
                      p === 'hitesh' ? 'border-hitesh-orange' : 'border-piyush-teal'
                    }`}>
                      <img className="w-full h-full object-cover" src={PERSONAS[p].imageUrl} alt={PERSONAS[p].name} loading="lazy" />
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="font-display text-[16px] text-on-surface truncate">{PERSONAS[p].name}</h5>
                      <p className="text-label-sm text-on-surface-variant truncate">{PERSONAS[p].subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Config Section */}
            <div className="pt-6 border-t border-outline-variant/30">
              <h4 className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4 px-1">AI Config</h4>
              <div className="space-y-5 px-1">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">
                    Creativity <span className="text-on-surface font-bold">{settings.temperature}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => setSettings(s => ({ ...s, temperature: parseFloat(e.target.value) }))}
                    className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">Learning Tone</label>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { key: 'default' as const, label: 'Casual' },
                      { key: 'educational' as const, label: 'Academic' },
                    ].map(t => (
                      <button
                        key={t.key}
                        onClick={() => setSettings(s => ({ ...s, tone: t.key }))}
                        className={`py-1.5 rounded-lg text-label-sm transition-colors duration-200 ${
                          settings.tone === t.key
                            ? 'bg-primary text-on-primary'
                            : 'border border-outline text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={enableHinglish}
                    onChange={(e) => setEnableHinglish(e.target.checked)}
                    className="w-5 h-5 rounded border-outline text-primary focus:ring-primary bg-surface"
                  />
                  <span className="text-label-md text-on-surface">Enable Hinglish</span>
                </label>
                <div className="space-y-3 mt-4">
                  <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/30 shadow-sm">
                    <h5 className="text-label-sm font-bold text-primary uppercase tracking-wider mb-1">Pro Tip</h5>
                    <p className="text-label-sm text-on-surface-variant">Ask Hitesh about &apos;chai and code&apos; to unlock special Easter eggs!</p>
                  </div>
                  <div className="p-4 bg-surface-container rounded-lg border border-outline-variant/30 shadow-sm">
                    <h5 className="text-label-sm font-bold text-primary uppercase tracking-wider mb-1">Pro Tip</h5>
                    <p className="text-label-sm text-on-surface-variant">Ask Piyush about the latest AI trends to see how he simplifies complex concepts!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile & Bottom Actions */}
          <div className="p-5 bg-surface-container-highest/20 border-t border-outline-variant/30">
            {isSignedIn ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <UserButton />
                  <div className="min-w-0">
                    <p className="text-label-md font-bold text-on-surface truncate">
                      {getDisplayName(user)}
                    </p>
                    <p className="text-[11px] text-on-surface-variant truncate">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <SignInButton mode="modal">
                  <button className="w-full py-2 px-4 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:bg-primary-container transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full py-2 px-4 border border-outline text-on-surface-variant rounded-lg text-label-sm hover:bg-surface-container-high transition-colors duration-200">
                    Create Account
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-surface relative">
          {/* Header */}
          <header className="h-16 border-b border-outline-variant/30 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
              <h2 className="font-display text-headline-md text-on-surface" id="chat-header-name">
                Chatting with {persona.name.split(' ')[0]}
              </h2>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors duration-200"
            >
              <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
              <span className="text-label-sm">{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </header>

          {/* Chat Interface */}
          <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full">
            {/* Messages Area */}
            <div ref={messageAreaRef} className="flex-1 overflow-y-auto p-8 space-y-5 no-scrollbar">
              {currentMessages.length === 0 && (
                <div className="flex-1 flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💬</span>
                    </div>
                    <p className="text-on-surface-variant">Start a conversation with {persona.name}</p>
                  </div>
                </div>
              )}
              {renderedMessages}
              {isLoading && (
                <div className="flex gap-4 max-w-[85%] animate-fade-in">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-${activePersona === 'hitesh' ? 'hitesh-orange' : 'piyush-teal'}/10 flex items-center justify-center border shadow-sm`}>
                    <img className="w-full h-full object-cover" src={persona.imageUrl} alt="" loading="lazy" />
                  </div>
                  <div className="bg-surface-container-low px-4 py-3 rounded-2xl rounded-tl-xs shadow-sm border border-outline-variant/10">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Required Banner */}
            {requiresAuth && (
              <div className="mx-6 mb-2 p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔒</span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Sign in to continue chatting</p>
                    <p className="text-xs text-on-surface-variant">You&apos;ve used 3 free prompts. Create an account to keep learning!</p>
                  </div>
                </div>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:bg-primary-container transition-colors duration-200 whitespace-nowrap">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 bg-surface">
              <div className="max-w-3xl mx-auto w-full bg-surface-container-highest/30 rounded-3xl p-3 border border-outline-variant/30 shadow-lg">
                <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="relative">
                  <textarea
                    ref={textareaRef}
                    onInput={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder={requiresAuth ? 'Sign in to continue...' : persona.placeholder}
                    rows={1}
                    disabled={requiresAuth}
                    className="w-full bg-white dark:bg-surface-container-low py-3 pl-4 pr-16 rounded-xl border-none focus:ring-2 focus:ring-primary/20 text-on-surface text-body-md shadow-inner min-h-[48px] max-h-48 resize-none no-scrollbar placeholder:text-on-surface-variant/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 bottom-2 w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center hover:bg-primary-container transition-all duration-200 active:scale-95 shadow-md disabled:opacity-50"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar items-center">
                  <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider whitespace-nowrap mr-1">Try:</span>
                  {['What is React?', 'Node.js backend', 'JS Engine'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="whitespace-nowrap px-3 py-1 bg-white/60 hover:bg-primary/5 rounded-full text-label-sm text-on-surface-variant transition-all duration-200 border border-outline-variant/30 hover:border-primary/30"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-center text-[10px] text-on-surface-variant mt-3">HPersona can make mistakes. Consider checking important information.</p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
