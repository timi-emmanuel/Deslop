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

## 🗺️ Project Architecture & Directory Map

```
Deslop/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication handlers (Supabase integration)
│   │   ├── export/        # Multi-format token exporter (design.md, Tailwind, CSS)
│   │   ├── extract/       # Ingestion and computed style extraction API
│   │   └── history/       # Saved scan history and user token library
│   ├── history/           # User dashboard for saved design systems
│   ├── inspect/           # Token Studio with live preview & contrast audits
│   ├── login/             # Authenticated sign-in with tactile form animations
│   ├── register/          # User registration with decaying error shake
│   ├── globals.css        # Warm editorial theme tokens and crafting grid styles
│   ├── layout.tsx         # Root layout with Geist & Editorial Serif typography
│   └── page.tsx           # Deslop landing page
├── components/
│   ├── auth/              # CrosshairFrame and interactive PeekingMascot
│   ├── home/              # Landing page sections (Hero, HowItWorks, FeatureMatrix,
│   │                      # TemplateGallery, Faq, SocialProof, Pricing, Navbar)
│   ├── inspect/           # TokenTabs, Swatches, ContrastChecker, and ExportDialog
│   └── ui/                # CrosshairCard, Modal, Glossy buttons, Badges
├── lib/
│   ├── api/               # Centralized client API with SWR caching
│   ├── auth/              # Supabase auth context and session providers
│   ├── config/            # Application constants and security boundaries
│   ├── exporters/         # Token synthesizers (design-md.ts, tailwind.ts, css.ts)
│   ├── extractor/         # Live URL crawler, Cheerio DOM parser, and SSRF security
│   ├── limits/            # Rate limiting and abuse prevention
│   └── synthesizer/       # Delta-E color clustering and 8pt grid quantizer
└── public/                # Static assets, badges, and brand icons
```

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16 (Turbopack)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion (`motion/react` v13)](https://motion.dev/) — springs, decaying error shakes, and fluid accordion dynamics inspired by [animations.dev](https://animations.dev/)
- **Parsing & Extraction:** [Cheerio](https://cheerio.js.org/) + Native Fetch
- **Database & Auth:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Iconography:** [Phosphor Icons](https://phosphoricons.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `20.x` or higher
- npm / pnpm / yarn

### 2. Installation
```bash
# Clone repository
git clone https://github.com/timi-emmanuel/deslop.git
cd deslop

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the project root:
```env
# Supabase Configuration (Optional for local testing; fallback mode supported)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Extraction Safety
MAX_EXTRACTION_DEPTH=1
EXTRACTION_TIMEOUT_MS=12000
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
# Type check and build
npm run build

# Start production server
npm run start
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
