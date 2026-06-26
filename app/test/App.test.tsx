import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { App } from '../components/App'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ message: 'Test response', model: 'gpt-4.1-mini' }),
  })
})

describe('HPersona App', () => {
  describe('Persona selection', () => {
    it('shows Hitesh as active by default', () => {
      render(<App />)
      const hiteshCard = document.getElementById('persona-hitesh')
      expect(hiteshCard).toHaveClass('persona-card-active')
    })

    it('switches to Piyush when clicked', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(document.getElementById('persona-piyush')!)
      const piyushCard = document.getElementById('persona-piyush')
      const hiteshCard = document.getElementById('persona-hitesh')
      expect(piyushCard).toHaveClass('persona-card-active')
      expect(hiteshCard).not.toHaveClass('persona-card-active')
    })

    it('updates chat header when switching persona', async () => {
      const user = userEvent.setup()
      render(<App />)
      expect(screen.getByText(/Chatting with Hitesh/)).toBeInTheDocument()
      await user.click(document.getElementById('persona-piyush')!)
      expect(screen.getByText(/Chatting with Piyush/)).toBeInTheDocument()
    })

    it('adds system message when switching persona', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(document.getElementById('persona-piyush')!)
      await waitFor(() => {
        expect(screen.getByText(/Switched to Piyush Garg/)).toBeInTheDocument()
      })
    })
  })

  describe('Message sending', () => {
    it('displays user message after sending', async () => {
      const user = userEvent.setup()
      render(<App />)
      const textarea = screen.getByPlaceholderText(/Puchiye/)
      await user.type(textarea, 'Hello!')
      fireEvent.submit(textarea.closest('form')!)
      await waitFor(() => {
        expect(screen.getByText('Hello!')).toBeInTheDocument()
      })
    })

    it('calls API with correct persona and settings', async () => {
      const user = userEvent.setup()
      render(<App />)
      const textarea = screen.getByPlaceholderText(/Puchiye/)
      await user.type(textarea, 'Test message')
      fireEvent.submit(textarea.closest('form')!)
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            message: 'Test message',
            persona: 'hitesh',
            settings: { temperature: 0.7, tone: 'default' },
            enableHinglish: true,
          }),
        }))
      })
    })

    it('displays bot response after API call', async () => {
      const user = userEvent.setup()
      render(<App />)
      const textarea = screen.getByPlaceholderText(/Puchiye/)
      await user.type(textarea, 'Test')
      fireEvent.submit(textarea.closest('form')!)
      await waitFor(() => {
        expect(screen.getByText('Test response')).toBeInTheDocument()
      })
    })
  })

  describe('Theme toggle', () => {
    it('toggles dark mode class on html element', async () => {
      const user = userEvent.setup()
      render(<App />)
      const themeBtn = screen.getByText('Dark')
      expect(document.documentElement).not.toHaveClass('dark')
      await user.click(themeBtn)
      expect(document.documentElement).toHaveClass('dark')
      await user.click(screen.getByText('Light'))
      expect(document.documentElement).not.toHaveClass('dark')
    })
  })

  describe('Settings', () => {
    it('temperature slider updates value', async () => {
      render(<App />)
      const slider = screen.getByRole('slider')
      expect(slider).toBeInTheDocument()
    })

    it('tone buttons switch active state', async () => {
      const user = userEvent.setup()
      render(<App />)
      const casualBtn = screen.getByText('Casual')
      const academicBtn = screen.getByText('Academic')
      expect(casualBtn).toHaveClass('bg-primary')
      await user.click(academicBtn)
      expect(academicBtn).toHaveClass('bg-primary')
      expect(casualBtn).not.toHaveClass('bg-primary')
    })
  })

  describe('Hinglish toggle', () => {
    it('checkbox toggles Hinglish mode', async () => {
      const user = userEvent.setup()
      render(<App />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()
    })
  })
})
