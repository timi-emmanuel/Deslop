@AGENTS.md

# 🎨 Deslop — Developer & AI Agent Project Handbook

> **"Stop letting AI generate ugly websites. Turn any site you love into clean design rules your AI can follow."**

---

## ⚡ What is Deslop in Plain English?

When developers ask AI tools (like **Cursor, Claude, Lovable, v0, Bolt, or Windsurf**) to build a website, they often make it look cheap and generic ("AI slop"):
- Inconsistent color scales with dozens of near-duplicate hex codes
- Buttons with arbitrary corner roundness and mismatched heights
- 13px or 17px random margins that break spatial rhythm
- Repetitive purple-to-pink gradient halos and unstyled cards

**Deslop fixes this in 3 simple steps:**
1. **You give it a website URL** (e.g. `linear.app`, `stripe.com`, `raycast.com`) or pick a curated template preset.
2. **Deslop inspects the live site** using server-side DOM analysis, extracts real computed colors, rendered typography, and clean 8px spatial intervals, and filters out noise via Delta-E color clustering.
3. **It gives you a single, battle-tested `design.md` file**. You drop this into Cursor (`.cursorrules`), Claude Project Knowledge, or your v0/Lovable system prompt. Now your AI builds beautiful, on-brand interfaces every time!

---

## 🗺️ Where Everything Is (Authoritative Project Map)

### 🌟 1. The Landing Page (`components/home/`)
- **[`components/home/Hero.tsx`](components/home/Hero.tsx)**  
  The top of the landing page. Features the organic hand-drawn scribble underline, tool cycler with motion blur (`Cursor`, `Claude`, `Tailwind`, `shadcn`), and the interactive live URL input bar.
- **[`components/home/HowItWorks.tsx`](components/home/HowItWorks.tsx)**  
  The 3-stage walkthrough explaining the pipeline (Scan ➔ Clean ➔ Drop into AI).
- **[`components/home/FeatureMatrix.tsx`](components/home/FeatureMatrix.tsx)**  
  Interactive feature bento showcasing color swatches, font scales, and button inspectors.
- **[`components/home/TemplateGallery.tsx`](components/home/TemplateGallery.tsx)**  
  Curated production design presets (Linear, Stripe, Raycast, Supabase).
- **[`components/home/SocialProof.tsx`](components/home/SocialProof.tsx)**  
  Clean monochrome brand marks for design-forward engineering companies.
- **[`components/home/Pricing.tsx`](components/home/Pricing.tsx)**  
  Pricing tiers with feature breakdowns.
- **[`components/home/Faq.tsx`](components/home/Faq.tsx)**  
  Fluid accordion powered by Motion spring physics and rotating chevrons.
- **[`components/home/Navbar.tsx`](components/home/Navbar.tsx)**  
  Sticky navigation bar with the editorial italic wordmark (`deslop`), navigation links, and auth state triggers.

### 🔐 2. Authentication & Interactive Mascots (`app/` & `components/auth/`)
- **[`app/login/page.tsx`](app/login/page.tsx)**  
  Sign-in page with physics-based decaying error shake (`[0, -10, 10, -8, 8, -4, 4, -2, 2, 0]`), animated password reveal toggle, and smooth spinner crossfade.
- **[`app/register/page.tsx`](app/register/page.tsx)**  
  Registration page with synchronized field focus tracking and tactile buttons.
- **[`components/auth/PeekingMascot.tsx`](components/auth/PeekingMascot.tsx)**  
  Reactive 4-character SVG stage with natural blinking, caret pupil tracking (`stiffness: 350, damping: 25`), password covering, peeking paw drops, and startled error jolt reactions.
- **[`components/auth/CrosshairFrame.tsx`](components/auth/CrosshairFrame.tsx)**  
  Architectural drafting frame with 10px (`w-2.5 h-2.5`) corner brackets and 1px hairline keylines.

### 🔍 3. The Live Token Studio (`app/inspect/` & `components/inspect/`)
- **[`app/inspect/page.tsx`](app/inspect/page.tsx)**  
  The interactive workbench where users inspect a scanned site.
- **[`components/inspect/TokenTabs.tsx`](components/inspect/TokenTabs.tsx)**  
  Tab switcher to review colors, typography, spacing, contrast audits, and the copyable `design.md` output.

### 📂 4. User Workspace & History (`app/history/`)
- **[`app/history/page.tsx`](app/history/page.tsx)**  
  Saved scan history, token re-exports, and saved design system libraries.

### ⚙️ 5. The Extraction & Synthesis Engine (`lib/`)
- **[`lib/extractor/crawler.ts`](lib/extractor/crawler.ts)**  
  Fetches live HTML, inspects rendered styles, and extracts real computed CSS colors, fonts, and box geometry.
- **[`lib/extractor/security.ts`](lib/extractor/security.ts)**  
  SSRF protection, private IP blocking (RFC 1918), and DNS verification.
- **[`lib/synthesizer/color-clustering.ts`](lib/synthesizer/color-clustering.ts)**  
  Delta-E / CIELAB clustering algorithm that consolidates 50+ messy raw hex colors into 5 core semantic roles.
- **[`lib/synthesizer/grid-quantizer.ts`](lib/synthesizer/grid-quantizer.ts)**  
  Quantizes irregular spatial measurements (e.g. 13px) to an authentic 8pt modular baseline.
- **[`lib/exporters/design-md.ts`](lib/exporters/design-md.ts)**  
  Assembles the final AI-optimized `design.md` markdown document.

### 📖 6. Design System Guide
- **[`deslop-design-tips.md`](deslop-design-tips.md)**  
  Master design guidelines: Warm Editorial Technical identity, drafting-grid canvas, strict single-accent `#f0642f`, and anti-slop rules.

---

## 🛡️ Golden Rules for Building in this Repo

1. **Brand Identity & Typography**:
   - The brand logo text is strictly: `<span className="font-serif-editorial font-medium italic text-accent text-2xl tracking-tight leading-none">deslop</span>`.
   - Primary brand accent token is `#f0642f` (`--color-accent: #f0642f`).
   - Canvas background is `#FAF7F2` with drafting grid styling (`bg-canvas bg-drafting-grid`).
   - Use our glossy buttons (`btn-gloss-orange`, `btn-gloss-neutral`).
   - Corner brackets are small 10px half-squares (`w-2.5 h-2.5`) with 1px hairline borders.
2. **Animations & Physics (animations.dev standards)**:
   - Always use `motion/react` (`import { motion, AnimatePresence } from "motion/react"`).
   - Use springs for fluid interaction: `transition={{ type: "spring", stiffness: 350, damping: 25 }}`.
   - For form errors, use decaying physics shakes with cubic bezier easing: `transition={{ duration: 0.45, ease: [0.36, 0.07, 0.19, 0.97] }}`.
   - For accordions, use `AnimatePresence initial={false}` with `height: "auto"` and `ease: [0.16, 1, 0.3, 1]`.
   - Buttons must have micro-press feedback: `whileTap={{ scale: 0.98 }}` and `whileHover={{ scale: 1.01 }}`.
3. **Tailwind v4 Guidelines**:
   - Always use `cn(...)` from `lib/utils.ts` for dynamic class merging.
   - Do NOT use `@apply` in `@layer components`, as Tailwind v4 compilation strips them.
4. **Never Open Localhost in Browser**:
   - The user rule strictly forbids launching or opening localhost in the browser. Test via automated commands or CLI tools only.
5. **Always Verify with TypeScript**:
   - Validate clean compilation with zero type errors before concluding tasks.
