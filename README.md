# *deslop* — Anti-Slop AI Design System Engine

> **"Stop shipping AI slop. Start shipping design."**  
> Transform any live website into a production-grade, version-controlled `design.md` file that constrains and guides AI coding tools (Cursor, Claude, Lovable, v0, Bolt, Windsurf).

---

## 🎯 What is Deslop?

When developers ask AI coding tools to build user interfaces, the models routinely generate **"AI slop"**:
- **Palette Hallucinations:** Dozens of near-duplicate, uncalibrated hex codes instead of a cohesive semantic scale.
- **Rhythm Chaos:** Arbitrary margins and paddings (e.g. `13px`, `17px`) breaking layout consistency.
- **Generic Styling Tells:** Monotonous purple-to-pink gradient bubbles, centered hero containers, and unstyled cards.
- **Component Disharmony:** Mismatched border radii, harsh keylines, and failing contrast ratios.

**Deslop solves this with a deterministic four-stage pipeline:**
1. **Inspect:** Ingests any publicly accessible URL or curated preset (Linear, Stripe, Raycast, Supabase).
2. **Extract:** Harvests true computed styles (colors, typography stacks, 8pt spatial scales, corner radii).
3. **Cleanse & Cluster:** Uses CIELAB / Delta-E color clustering and 8pt quantization to eliminate noise and prune accidental micro-variations.
4. **Synthesize:** Outputs a clean, standardized **`design.md`** file, Tailwind v4 `@theme` block, and `.cursorrules` snippet that forces AI tools to build pixel-perfect, on-brand interfaces on the very first prompt.

---

## ⚡ Core Features

- 🌐 **Live Website Ingestion:** Scans public web applications with built-in SSRF protection and DNS resolution safeguards.
- 🎨 **Delta-E Color Clustering:** Consolidates 50+ messy raw hex codes into 5 clean semantic roles (`canvas`, `surface`, `accent`, `border`, `text`).
- 📏 **8pt Modular Spatial Snapping:** Quantizes irregular paddings and margins to an authentic 8-point layout rhythm.
- 🗂️ **Multi-Format Export Engine:**
  - `design.md` (optimized for Cursor `.cursorrules` and Claude Project context)
  - Tailwind CSS v4 `@theme` definitions
  - Native CSS Custom Properties (`:root`)
  - W3C DTCG-compliant JSON design tokens
- 🔬 **Interactive Token Studio (`/inspect`):** Live side-by-side inspection with color swatch copying, WCAG contrast scoring, and live token customization.
- 🔐 **Saved Scan History (`/history`):** Authenticated user workspace backed by Supabase with local storage fallback.
- 🎭 **Craft Visual Identity & Mascots:** Warm editorial technical aesthetic featuring drafting-grid backgrounds, glossy orange triggers, and reactive SVG mascot characters with physics-based spring animations.

---

## 🗺️ Project Architecture & Monorepo Map

Deslop is structured as a clean, modular npm workspace monorepo:

```
Deslop/
├── apps/
│   ├── web/                     # @deslop/web: Next.js 16 Frontend (Port 3000)
│   │   ├── app/                 # App Router (/, /inspect, /history, /login, /register)
│   │   ├── components/          # React components (auth, home, inspect, ui)
│   │   ├── lib/                 # Frontend utilities, hooks & Zorveus AI synthesis
│   │   ├── public/              # Static brand assets and mascots
│   │   └── package.json
│   │
│   └── api/                     # @deslop/api: Fastify Backend (Port 4000)
│       ├── src/
│       │   ├── crawler/         # Playwright Chromium headless crawler & style scraper
│       │   ├── db/              # Neon PostgreSQL schema & Drizzle ORM pool
│       │   ├── plugins/         # CORS, Session Auth, and Swagger OpenAPI plugins
│       │   ├── routes/          # API routes: /health, /api/auth, /api/crawl, /api/scans
│       │   └── server.ts        # Server bootstrap & graceful shutdown
│       ├── openapi.json         # Static OpenAPI 3.1.0 JSON specification
│       └── package.json
│
├── packages/
│   └── tokens/                  # @deslop/tokens: Shared Token Synthesis Engine
│       ├── src/
│       │   ├── color-clustering.ts # CIELAB / Delta-E color clustering
│       │   ├── color-math.ts       # Color conversions & contrast checks
│       │   ├── grid-quantizer.ts   # 8pt/4pt modular rhythm snappers
│       │   └── token-synthesis.ts  # Stage 3 token reduction pipeline
│       └── package.json
│
└── package.json                 # Monorepo root workspace orchestrator
```

---

## 🛠️ Technology Stack

- **Frontend (`@deslop/web`):** [Next.js 16 (Turbopack)](https://nextjs.org/) + [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Motion v13](https://motion.dev/), [Phosphor Icons](https://phosphoricons.com/)
- **Backend (`@deslop/api`):** [Fastify 5](https://fastify.dev/), [Playwright Chromium](https://playwright.dev/), [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), [@fastify/swagger](https://github.com/fastify/fastify-swagger) (OpenAPI 3.1)
- **Database & ORM:** [Neon Serverless PostgreSQL](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/)
- **AI Synthesis:** Zorveus AI Gateway (GPT-OSS-120B) with strict hallucination-sanitizing guards

---

## 🚀 Getting Started

### 1. Installation
```bash
# Clone repository
git clone https://github.com/timi-emmanuel/deslop.git
cd deslop

# Install dependencies across all workspaces
npm install
```

### 2. Running in Development
```bash
# Run BOTH Frontend (3000) and Backend (4000) concurrently:
npm run dev

# Or run services individually:
npm run dev:web    # Starts Next.js on http://localhost:3000
npm run dev:api    # Starts Fastify on http://localhost:4000
```

### 3. API Documentation (Swagger UI)
When the backend is running (`npm run dev:api`), open your browser to:
- **Interactive Swagger UI:** `http://localhost:4000/documentation`
- **Raw OpenAPI 3.1 JSON:** `http://localhost:4000/documentation/json`

### 4. Running Verification & Tests
```bash
# Verify Swagger spec and Token Synthesis rules:
npm test

# Run individual test suites:
npm run test:swagger     # Tests OpenAPI generation in-memory
npm run test:synthesis   # Validates Delta-E clustering & contrast rules
```

### 5. Production Build
```bash
# Build all workspaces:
npm run build
```

---

## 📖 How to Use the Generated `design.md`

1. In Deslop, enter any live website URL (e.g. `linear.app`) or choose a template preset.
2. Review the extracted tokens in the **Token Studio** (`/inspect`).
3. Click **Copy design.md** or **Download**.
4. Drop the file directly into your codebase:
   - **For Cursor:** Place at `.cursorrules` or `.cursor/rules/design.md`.
   - **For Claude Code:** Add to project knowledge or `.agents/skills/`.
   - **For v0 / Lovable / Bolt:** Paste into your initial prompt as system context.

---

## 🛡️ License

Licensed under the MIT License. © 2026 Timilehin Adekunle.
