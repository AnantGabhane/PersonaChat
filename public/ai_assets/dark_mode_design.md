---
name: HPersona Dark Mode (Polished)
colors:
  surface: '#110e0d'
  surface-dim: '#0c0a09'
  surface-bright: '#1e1b1a'
  surface-container-lowest: '#080706'
  surface-container-low: '#110e0d'
  surface-container: '#161312'
  surface-container-high: '#1e1b1a'
  surface-container-highest: '#2d2928'
  on-surface: '#ede0db'
  on-surface-variant: '#d8c2bb'
  outline: '#53433e'
  outline-variant: '#413d3c'
  primary: '#e8742a'
  on-primary: '#ffffff'
  primary-container: '#883700'
  on-primary-container: '#ffdbcc'
  secondary: '#d5c790'
  on-secondary: '#393006'
  secondary-container: '#51471b'
  on-secondary-container: '#f2e2a7'
  error: '#ffb4ab'
  on-error: '#690005'
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

# HPersona Polished Dark Mode Design System

## Visual Identity
The polished dark theme for HPersona prioritizes depth, high contrast, and brand consistency. It utilizes a deep charcoal foundation (#110e0d) with vibrant primary orange accents to maintain the brand's "Warmth & Energy" even in low-light environments.

## Core Components

### 1. Navigation Sidebar
- **Background:** `surface-container-low` (#110e0d) with a subtle `outline` border (#53433e) for separation.
- **Persona Cards:** 
  - Active state uses a `surface-container-high` background with a `primary` left-accent border.
  - Avatars feature a 2px `outline-variant` border.
- **Config Section:** Sliders and toggles use `primary` (#e8742a) for active tracks/thumbs and `outline-variant` for inactive states.

### 2. Chat Workspace
- **Layout:** Centered 800px width within the 1280px desktop frame.
- **Message Bubbles:**
  - **AI Responses:** `surface-container-high` (#1e1b1a) background with `on-surface` text. These sit at a higher elevation to feel approachable.
  - **User Prompts:** `primary` (#e8742a) background with `on-primary` (#ffffff) text, creating a strong focal point for user input.
- **Input Area:** Floating `surface-container-highest` bar with a `primary` send button and clear `on-surface-variant` placeholder text.

## Interaction & Depth
- **Elevations:** Layering is achieved through progressive surface-container tokens. The deeper the element, the lower the container token number.
- **Borders:** 1px `outline` or `outline-variant` borders are used instead of heavy shadows to maintain a "technical tool" aesthetic.
- **Transitions:** Standard 200ms ease-out for all hover and active states.
