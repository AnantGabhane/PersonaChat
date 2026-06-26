# Design System — HPersona

## Product Context
- **What this is:** AI chat app for Hinglish conversations with Hitesh Choudhary and Piyush Garg
- **Who it's for:** Indian tech learners who follow these educators
- **Space/industry:** AI-powered education / persona chat
- **Project type:** Web app (chat-first)

## Aesthetic Direction
- **Direction:** Playful/Approachable
- **Decoration level:** Intentional (subtle grain texture, soft shadows)
- **Mood:** Feels like chatting with a friend, not a corporate AI. Warm, inviting, fun.
- **Memorable thing:** Learning should feel轻松 and enjoyable, not corporate or intimidating

## Typography
- **Display/Hero:** Clash Grotesk — geometric but friendly, breaks from the cold-tech default
- **Body:** DM Sans — warm, readable, human
- **UI/Labels:** DM Sans (same as body)
- **Data/Tables:** DM Sans (tabular-nums)
- **Code:** JetBrains Mono
- **Loading:** Google Fonts CDN (`https://fonts.googleapis.com/css2?family=Clash+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap`)
- **Scale:**
  - h1: clamp(36px, 6vw, 56px) / 1.1
  - h2: clamp(24px, 4vw, 32px) / 1.2
  - h3: 20px / 1.3
  - body: 16px / 1.7
  - small: 14px / 1.5
  - xs: 12px / 1.4

## Color
- **Approach:** warm palette, each persona has its own accent
- **Primary:** #E8742A (amber/orange — energy, warmth, Hitesh's color)
- **Primary Light:** #F59E4C
- **Primary Dark:** #C45D1A
- **Secondary:** #0D9488 (teal — Piyush's color)
- **Neutrals:** cream-to-charcoal warm scale
  - Cream: #FAF7F2
  - Cream Dark: #F0EBE3
  - Gray-100: #F5F5F4
  - Gray-200: #E7E5E4
  - Gray-300: #D6D3D1
  - Gray-400: #A8A29E
  - Gray-500: #78716C
  - Gray-600: #57534E
  - Gray-700: #44403C
  - Gray-800: #292524
  - Gray-900: #1C1917
  - Charcoal: #1C1917
- **Semantic:** success #16A34A, warning #D97706, error #DC2626, info #0D9488
- **Dark mode:** Cream becomes warm dark (#1C1917), charcoal becomes warm light (#FAF7F2). Reduce saturation 10-20% on accent colors.

## Spacing
- **Base unit:** 8px
- **Density:** comfortable
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)

## Layout
- **Approach:** single-column, chat-first
- **Grid:** single column, max-width 960px for content sections
- **Max content width:** 960px
- **Border radius:**
  - sm: 8px (inputs, small elements)
  - md: 12px (cards, modals)
  - lg: 16px (chat bubbles, containers)
  - xl: 24px (hero sections, large cards)
  - full: 9999px (pills, buttons, avatars)

## Motion
- **Approach:** intentional (smooth entrances, meaningful state changes)
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150-250ms) medium(250-400ms) long(400-700ms)

## Persona Visual Identity
- **Hitesh Choudhary:** warm orange (#E8742A), orange-tinted backgrounds
- **Piyush Garg:** friendly teal (#0D9488), teal-tinted backgrounds
- Each persona's chat bubbles, avatar, and accent elements use their color

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-26 | Initial design system created | Created by /design-consultation. Departed from cold-purple AI default to warm amber/orange for approachability. Each persona gets unique accent color for instant recognition. |
