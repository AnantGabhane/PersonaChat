# Commit Guide

Use this guide to generate clean, consistent Git commit messages like the examples in the screenshot.

## Format

```text
<emoji> <type>(<scope>): <short summary>
```

### Examples

```text
🐛 fix(api): enhance error handling for Gemini API key validation
📚 docs(readme): update README
📸 docs: add application screenshots to documentation
♻️ refactor(app): restructure components and pages
🧹 chore(lint): update ESLint configuration and dependencies
🔧 config(vite): remove Vite configuration in favor of Next.js
✨ feat(chat): add interactive chat interface with multiple personas
🤖 feat(ai): implement Gemini AI chat API with persona support
🚀 init(nextjs): initialize Next.js project with AI chat capabilities
⚡ perf(ai): set default temperature to 0.6 for consistent responses
🎨 style(global): update global styles with dark theme and gradients
🖼️ assets: add application favicon
```

## Commit Types

| Type | Emoji | Use when |
|---|---:|---|
| `feat` | ✨ | Adding a new feature |
| `fix` | 🐛 | Fixing a bug |
| `docs` | 📚 | Updating documentation |
| `style` | 🎨 | UI/CSS/formatting changes without logic changes |
| `refactor` | ♻️ | Restructuring code without changing behavior |
| `perf` | ⚡ | Improving performance |
| `test` | ✅ | Adding or updating tests |
| `chore` | 🧹 | Maintenance, tooling, dependency updates |
| `config` | 🔧 | Config changes |
| `init` | 🚀 | Initial project setup |
| `assets` | 🖼️ | Images, icons, fonts, static assets |
| `build` | 📦 | Build system or package changes |
| `ci` | 👷 | CI/CD workflow changes |
| `security` | 🔒 | Security fixes or hardening |
| `revert` | ⏪ | Reverting a previous commit |

## Scope Suggestions

Use a short scope when it helps explain the area changed.

Common scopes:

```text
api
auth
chat
ai
gemini
readme
docs
app
components
pages
lint
vite
nextjs
setup
global
theme
assets
favicon
```

## Writing Rules

1. Use present tense.
   - Good: `add Gemini API validation`
   - Bad: `added Gemini API validation`

2. Keep the summary short.
   - Aim for 50–72 characters when possible.

3. Do not end with a period.

4. Use lowercase type and scope.

5. Make the commit message explain what changed, not how long it took.

## Quick Templates

### Feature

```text
✨ feat(<scope>): add <feature>
```

Example:

```text
✨ feat(chat): add interactive chat interface with personas
```

### Bug Fix

```text
🐛 fix(<scope>): fix <issue>
```

Example:

```text
🐛 fix(api): handle invalid Gemini API keys gracefully
```

### Documentation

```text
📚 docs(<scope>): update <document>
```

Example:

```text
📚 docs(readme): update setup instructions
```

### Refactor

```text
♻️ refactor(<scope>): simplify <area>
```

Example:

```text
♻️ refactor(app): simplify page structure
```

### Styling

```text
🎨 style(<scope>): update <style area>
```

Example:

```text
🎨 style(global): update dark theme gradients
```

### Configuration

```text
🔧 config(<scope>): update <config>
```

Example:

```text
🔧 config(vite): remove unused Vite configuration
```

### Chore

```text
🧹 chore(<scope>): update <maintenance item>
```

Example:

```text
🧹 chore(lint): update ESLint dependencies
```

## Prompt for AI Commit Generation

Use this prompt when asking an AI tool to generate commits:

```text
Generate a Git commit message for the following changes.

Rules:
- Follow this format: <emoji> <type>(<scope>): <summary>
- Use conventional commit style
- Use present tense
- Keep the summary concise
- No period at the end
- Choose the best emoji and type
- Use a scope only when useful

Changed files:
<paste changed files here>

Diff summary:
<paste diff or summary here>
```

## Batch Commit Prompt

Use this when you want multiple commit suggestions:

```text
Generate separate Git commit messages for these changes.

Style examples:
🐛 fix(api): enhance error handling for Gemini API key validation
📚 docs(readme): update README
✨ feat(chat): add interactive chat interface with multiple personas
♻️ refactor(app): restructure components and pages
🎨 style(global): update global styles with dark theme and gradients

Rules:
- One commit per logical change
- Format: <emoji> <type>(<scope>): <summary>
- Use present tense
- Keep each summary short
- No period at the end
- Group related files together

Changes:
<paste git status and diff summary here>
```

## Command Helpers

Show changed files:

```bash
git status --short
```

Show staged diff:

```bash
git diff --cached
```

Show unstaged diff:

```bash
git diff
```

Create commit:

```bash
git commit -m "✨ feat(chat): add interactive chat interface"
```
