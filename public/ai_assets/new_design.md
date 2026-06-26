---
name: HPersona
colors:
  surface: '#fff8f6'
  surface-dim: '#ebd6cd'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffede7'
  surface-container-high: '#f9e2d9'
  surface-container-highest: '#f4d7cc'
  on-surface: '#231a16'
  on-surface-variant: '#53433e'
  outline: '#85736d'
  outline-variant: '#d8c2bb'
  primary: '#e8742a'
  on-primary: '#ffffff'
  primary-container: '#ffdbcc'
  on-primary-container: '#351000'
  secondary: '#77574b'
  on-secondary: '#ffffff'
  secondary-container: '#ffdbcc'
  on-secondary-container: '#2c160d'
  tertiary: '#695e2f'
  on-tertiary: '#ffffff'
  tertiary-container: '#f2e2a7'
  on-tertiary-container: '#221b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#410002'
typography:
  font-family:
    display: 'Plus Jakarta Sans, sans-serif'
    body: 'Plus Jakarta Sans, sans-serif'
  scale:
    headline-lg: '32px/40px 700'
    headline-md: '24px/32px 600'
    title-md: '18px/24px 600'
    body-md: '16px/24px 400'
    label-md: '14px/20px 500'
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
layout:
  sidebar-width: 280px
  max-content-width: 1280px
  border-radius: 12px
---

# HPersona Design System & Implementation Guide

## Visual Identity
HPersona uses a warm, energetic palette centered around `#e8742a` (Orange) to create an approachable learning environment. The interface leverages Material 3 surface containers to create depth and hierarchy.

## Core Components

### 1. Navigation Sidebar
- **Width:** 280px fixed.
- **Background:** `surface-container-low`.
- **Elements:**
  - Branding: HPersona Logo (Headline-MD).
  - Persona Selector: Avatar + Name + Subtitle in a `surface-container-high` active state.
  - AI Configuration: Sliders and Toggles for real-time model tuning.
  - Pro Tips: Contextual cards with `surface-container` background and `outline-variant` borders.

### 2. Chat Workspace
- **Layout:** Flex-grow area with centered max-width (800px) message container.
- **Message Bubbles:**
  - **AI:** Left-aligned, `surface-container-high` background, standard avatar icon.
  - **User:** Right-aligned, `primary` background with `on-primary` text for high contrast.
- **Input Area:** Persistent footer with a large text area and a prominent `primary` send button.

## Interaction Tokens
- **Hover States:** 8% overlay of `on-surface` on containers.
- **Active States:** 12% overlay of `primary` or explicit `primary-container` background.
- **Transitions:** 200ms ease-out for all state changes.

## Responsive Strategy
- **Desktop (1280x1024):** Full sidebar + chat layout.
- **Tablet:** Sidebar becomes a collapsible drawer.
- **Mobile:** Bottom navigation for persona switching; full-screen chat interface.
