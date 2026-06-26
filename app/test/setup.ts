import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock IntersectionObserver
global.IntersectionObserver = class {
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
} as unknown as typeof IntersectionObserver

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill: _fill, ...rest } = props
    return React.createElement('img', rest)
  },
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Clerk
vi.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isSignedIn: false,
    userId: 'test-user-id',
  }),
  useUser: () => ({
    user: null,
    isLoaded: true,
  }),
  SignInButton: ({ children, ...props }: any) => React.createElement('button', { ...props, 'data-testid': 'sign-in-button' }, children),
  SignUpButton: ({ children, ...props }: any) => React.createElement('button', { ...props, 'data-testid': 'sign-up-button' }, children),
  UserButton: (props: any) => React.createElement('div', { 'data-testid': 'user-button', ...props }),
  ClerkProvider: ({ children }: any) => React.createElement(React.Fragment, null, children),
  Show: ({ children, when }: any) => {
    if (when === 'signed-out') return React.createElement(React.Fragment, null, children)
    return null
  },
}))
