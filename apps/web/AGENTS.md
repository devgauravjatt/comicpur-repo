# 🤖 AGENTS.md

## use pnpm

## ⚠️ Next.js Compatibility Warning

This project uses a **non-standard / experimental version of Next.js**.

> 🚫 Do NOT assume default Next.js behavior
> ✅ ALWAYS verify against local docs

### 📚 Source of Truth

All framework behavior must be validated from:

```
node_modules/next/dist/docs/
```

This includes:

- Routing system
- Layouts & nesting
- Server vs Client components
- Data fetching APIs
- Metadata handling
- Config options

---

## 🧠 Agent Rules

### 1. Never Guess Framework Behavior

- Do NOT rely on training data for Next.js
- Do NOT assume App Router / Pages Router behavior
- Always request clarification if unsure

---

### 2. Inspect Before Implementing

Before writing code, the agent should:

- Ask for folder structure (e.g. `app/`, `routes/`, etc.)
- Ask for relevant docs snippet if needed
- Check existing patterns in repo

---

### 3. Follow Existing Conventions

- Match file structure already used
- Reuse utilities, components, and patterns
- Avoid introducing new patterns without reason

---

## 📱 Mobile-First Priority (VERY IMPORTANT)

> 🎯 **Main target users are mobile users**

### Core Rules

- Design **mobile first ALWAYS**
- Start from small screens → then scale up
- UI must work perfectly on:
  - Android devices
  - Low-end phones
  - Slow networks

---

### 📐 Layout Rules

- Use vertical stacking (flex-col)

- Avoid complex grids on mobile

- Prefer:

  ```
  w-full
  p-3 / p-4
  gap-3 / gap-4
  ```

- Max width control:

  ```
  max-w-md mx-auto
  ```

---

### 👆 Touch-Friendly UI

- Minimum touch size: **44px**
- Add spacing between buttons
- Avoid tiny clickable elements

✅ Good:

```
h-11 px-4 rounded-xl
```

❌ Bad:

```
h-6 text-xs
```

---

### ⚡ Performance Rules

- Avoid heavy components on mobile
- Lazy load when possible
- Minimize JS
- Prefer server rendering if supported

---

### 🎨 Styling Rules

- Use Tailwind responsive system:

  ```
  text-sm md:text-base
  p-3 md:p-6
  ```

- Default = mobile

- `md:` and above = enhancements

---

### 🧩 Component Strategy

- Components must be:
  - Compact
  - Scroll-friendly
  - Stackable

- Avoid:
  - Large modals
  - Complex tables (use cards instead)

---

### 📵 Network Awareness

- Optimize for slow internet users
- Avoid large images
- Use optimized assets only

---

## 🎨 shadcn/ui + MCP Setup

### MCP Server Config

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

---

### Component Rules

- Components live in:

  ```
  components/ui/
  ```

- Import pattern:

  ```ts
  import { Button } from '@/components/ui/button';
  ```

- Use **shadcn primitives only**

- Do NOT reinvent components already available

---

## 🧱 UI Guidelines

- Use Tailwind CSS for styling
- Prefer composition over large components
- Keep components small and reusable
- Follow shadcn design patterns

---

## ⚙️ Code Standards

### TypeScript

- Strict types required
- Avoid `any`
- Prefer inference where possible

---

### File Naming

- kebab-case for files
- PascalCase for components

---

### Imports

- Use absolute imports (`@/`)
- Avoid deep relative paths (`../../../`)

---

## 🚫 What NOT to Do

- ❌ Do not assume Next.js APIs
- ❌ Do not introduce random UI libraries
- ❌ Do not bypass shadcn system
- ❌ Do not hardcode data-fetching patterns
- ❌ Do not mix server/client logic incorrectly
- ❌ Do not design desktop-first UI

---

## ✅ What TO Do

- ✅ Ask for clarification when unsure
- ✅ Keep code minimal and clean
- ✅ Follow project patterns strictly
- ✅ Use shadcn components whenever possible
- ✅ Validate behavior against local docs
- ✅ Prioritize mobile UX over desktop

---

## 🧪 When Unsure

If something is unclear:

1. Ask for:
   - Example file
   - Docs snippet
   - Error message

2. Do NOT proceed with assumptions

---

## 🚀 Goal

Produce **correct, minimal, and mobile-first compatible code**
aligned with:

- Experimental Next.js version
- shadcn/ui ecosystem
- Mobile-first UX strategy
- Project-specific patterns

---

## 🧩 Optional Enhancements (If Requested)

- Add new shadcn components via CLI
- Improve DX (dev experience)
- Optimize structure
- Add typing / schema (e.g. Zod)
- Integrate backend (Bun / DB / API)

---

**End of AGENTS.md**
