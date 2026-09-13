# Deslop — Project Scope & Specification Document

> **"Stop shipping AI slop. Start shipping design."**  
> *Transform any live website into a production-grade, version-controlled `design.md` file that constrains and guides AI coding tools (Cursor, v0, Bolt, Claude Code, Windsurf).*

---

## 1. Executive Summary

### 1.1 The Problem: "AI Slop"
Modern AI code generators (Cursor, v0, Bolt, Windsurf, Claude Code) can rapidly write frontend code, but without strict, machine-readable design constraints, they routinely output **"AI slop"**:
- Inconsistent color scales with dozens of near-duplicate hex codes.
- Arbitrary margins, paddings, and font sizes that break spatial rhythm.
- Hallucinated styles (such as generic purple gradient glows, centered hero boxes, and repetitive 3-column card rows).
- Component disharmony where buttons, inputs, and cards use conflicting corner radii and contrast levels.

### 1.2 The Solution: `design.md`
**Deslop** is an automated design system extractor and synthesis engine. It inspects live websites or curated presets and generates a clean, standardized **`design.md`** file that:
1. Lives directly in a Git repository alongside application code.
2. Integrates directly into `.cursorrules`, Claude Code `.agents/skills`, or system prompts.
3. Provides deterministic rules and tokens so AI tools generate visually cohesive, on-brand interfaces on the first attempt.

---

## 2. Target Audience & Use Cases

| User Group | Primary Friction | Deslop Value Proposition |
| :--- | :--- | :--- |
| **Solo Founders & Indie Hackers** | Don't have a dedicated design team; want their product to look as polished as Linear or Stripe. | One-click extraction of high-craft design tokens into their codebase without manual CSS auditing. |
| **Frontend & Design Engineers** | Spend hours manually documenting tokens and correcting AI-generated styling hallucinations in PRs. | Standardized `design.md` drops into `.cursorrules` to force model adherence during development. |
| **Agencies & Consultancies** | Need to rapidly spin up brand-faithful MVPs and prototypes for clients. | Instant extraction of client branding directly from their existing marketing sites. |
| **Teams Migrating Frameworks** | Rebuilding legacy sites in Next.js / Tailwind without losing brand identity. | Accurate extraction of computed tokens, fonts, and spatial rules. |

---

## 3. Core Architecture & System Pipeline

Deslop operates as a four-stage pipeline:

```
┌─────────────────┐      ┌─────────────────────────┐      ┌───────────────────────┐      ┌────────────────────────┐
│  1. Ingestion   │ ───► │  2. DOM & CSS Analysis  │ ───► │ 3. AI Token Synthesis │ ───► │  4. Output & Delivery  │
│  - Live URL     │      │  - Computed Styles      │      │  - Semantic Clustering│      │  - design.md           │
│  - Brand Presets│      │  - Font Face Inspector  │      │  - Noise Elimination  │      │  - .cursorrules drop-in│
│  - User Prompt  │      │  - Bounding Box Scales  │      │  - Taste Skill Audits │      │  - CLI / Web Export    │
└─────────────────┘      └─────────────────────────┘      └───────────────────────┘      └────────────────────────┘
```

### Stage 1: Ingestion
- **URL Crawler**: Accepts any publicly accessible URL (supporting SPAs, server-rendered sites, and static pages).
- **Template Presets**: Built-in baseline systems (Minimal Obsidian, Hyper-Bold Crimson, Enterprise Cobalt, Expressive Iris).

### Stage 2: Headless DOM & Computed Style Extraction
Instead of merely parsing raw minified CSS files (which contain dead code and utility bloat), Deslop runs a headless browser instance (Playwright / Puppeteer) to measure **live computed properties**:
- **Palette Harvesting**: Inspects computed `backgroundColor`, `color`, `borderColor`, and CSS variables across all rendered nodes.
- **Typography Inspection**: Resolves actual rendered font families (including fallbacks), letter-spacing (`tracking`), line-heights, and responsive scale ratios.
- **Spatial Geometry**: Measures real margins, paddings, gap dimensions, and `border-radius` values across interactive components (buttons, cards, inputs).
- **Elevation & Shadows**: Extracts box-shadow layers and backdrop filters.

### Stage 3: AI Token Synthesis & Noise Pruning
Raw extraction produces hundreds of accidental micro-variations. Deslop applies semantic clustering and design taste heuristics:
- **Color Clustering**: Consolidates 40+ raw hex codes into 4-6 semantic roles (`canvas`, `surface`, `accent`, `stroke`, `text-primary`, `text-muted`).
- **Contrast Audit**: Checks WCAG AA / AAA compliance against background colors.
- **Ramp Normalization**: Snaps arbitrary paddings (e.g. 13px, 17px) onto an 8pt / 4pt grid system.
- **Behavioral Directives (Taste Skill Rules)**: Injects negative constraints that forbid generic AI defaults (bans random neon glows, specifies descender clearance, limits eyebrow tags, enforces single-accent consistency).

### Stage 4: Output Generation
Emits a human-readable and LLM-optimized Markdown document:
- Drop-in `.cursorrules` snippet.
- Tailwind v4 `@theme` configuration.
- Standalone `design.md` file.

---

## 4. The `design.md` Specification Schema

Every generated `design.md` follows a standardized schema tailored for AI context windows:

```markdown
# [Project Name] — Design System & AI Directives

## 1. Core Visual Identity
- **Canvas / Background**: #08090A (Matte Dark)
- **Primary Surface**: #121316 (Elevated Cards & Containers)
- **Brand Accent**: #5E6AD2 (Key Actions & Interactive States only)
- **Borders & Dividers**: #222326 (1px subtle stroke)
- **Text Primary**: #F7F8F8 (Headlines & Labels)
- **Text Muted**: #8A8F98 (Descriptions & Secondary Meta)

## 2. Typography Hierarchy
- **Display / H1**: Geist Sans (tracking: -0.03em, leading: 1.08, max 2 lines)
- **Headings (H2-H4)**: Geist Sans (tracking: -0.02em, font-weight: 600)
- **Body Text**: Inter (15px / 24px line-height, text-zinc-400)
- **Code / Tokens**: Geist Mono / JetBrains Mono

## 3. Spatial & Geometry Rules
- **Base Spacing Grid**: 4px / 8px multiples (p-2, p-4, p-6, p-8)
- **Border Radii System**:
  - Buttons / Inputs: 6px
  - Cards / Dialogs: 8px to 12px
  - Badges / Status Pills: 9999px (full pill)
- **Tactile Feedback**: active:scale-[0.98] on all interactive triggers

## 4. Strict Negative Constraints (Anti-Slop Directives)
- NEVER invent arbitrary colors outside the tokens above.
- NEVER apply purple/blue glowing drop-shadows to buttons.
- NEVER use 3 equal feature card rows; prefer asymmetric 2-column or bento layouts.
- NEVER wrap desktop primary CTA labels onto multiple lines.
- NEVER use em-dashes (—) in marketing copy or headings.
```

---

## 5. Product Features & User Interface

### 5.1 Landing Page & Brand Foundation (Phase 1 — Current)
- Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Phosphor Icons**.
- **Interactive URL Extractor Simulator**: Real-time preset switching (`Linear`, `Stripe`, `Supabase`, `Raycast`) rendering computed color swatches, typography ramps, and raw `design.md` previews.
- **Asymmetric "How It Works" Showcase**: Interactive stage breakdown showing live DOM logic and pipeline schemas.
- **Curated Template Gallery**: 4 production design baselines with spring-loaded hover depth.
- **Feature Bento**: Varied background cards demonstrating computed DOM extraction, Git versioning, and AI compatibility.
- **Monochrome Social Proof**: Clean SVG brand marks for Vercel, Figma, Linear, Supabase, Stripe, and Cursor.

### 5.2 The CLI Tool (`deslop-cli`)
A lightweight developer CLI that extracts tokens from the terminal:
```bash
# Run against any live website
npx deslop https://linear.app

# Output directly into .cursorrules or design.md
npx deslop https://linear.app --out ./design.md
npx deslop --template minimal --out .cursorrules
```

### 5.3 Web Dashboard & Token Studio (Phase 3)
- Live side-by-side URL visualizer: website on the left, interactive token tree on the right.
- Visual token customizer: tweak extracted accent colors, adjust font scales, and see immediate preview updates.
- One-click export to GitHub, Cursor, and v0.

---

## 6. Technical Roadmap & Milestones

### Phase 1: Brand, Positioning & Landing Page *(Completed)*
- [x] Repository initialization & Next.js App Router setup.
- [x] Brand identity & value proposition definition.
- [x] High-craft dark design system in `globals.css` with DM Sans typography.
- [x] Taste Skill audit and anti-slop rules integration.
- [x] Interactive hero URL extractor component with live token previews.
- [x] Asymmetric workflow showcase & template gallery.

### Phase 2: Live Extraction Engine *(Next Up)*
- [ ] Implement headless crawler service (Playwright / Chromium).
- [ ] Build computed style extractor script to harvest:
  - Computed color matrices and CSS variables.
  - Font families and @font-face declarations.
  - Spacing scales (paddings, margins, grid gaps).
  - Border radii and elevation profiles.
- [ ] Build API route: `POST /api/extract { url: string }`.

### Phase 3: Token Synthesis & AI Reduction Engine
- [ ] Integrate clustering algorithm for color deduplication (grouping within Delta-E threshold).
- [ ] Integrate LLM prompt pipeline to format extracted styles into clean `design.md` markdown.
- [ ] Implement Taste Skill automated validator (contrast checking, font pairing safety, negative constraint injection).

### Phase 4: CLI & Ecosystem Integrations
- [ ] Publish `deslop` CLI package to npm (`npx deslop <url>`).
- [ ] Add one-click export formats:
  - `design.md` (universal markdown)
  - `.cursorrules` (Cursor IDE)
  - `tailwind.config.ts` / `@theme` (Tailwind v4)
  - Claude Code skill package (`.agents/skills/deslop/SKILL.md`)
- [ ] GitHub Action for design token change detection on deployment.

---

## 7. Success Metrics & Quality Standards

1. **Extraction Accuracy**: 95%+ fidelity in capturing primary brand color, font stack, and component radii from top 100 SaaS websites.
2. **AI Model Adherence**: When `design.md` is provided in prompt context, generated components achieve 100% token adherence (zero hallucinated colors or arbitrary spacing).
3. **Speed**: Sub-10 second extraction and token generation from cold URL submission.
4. **Zero Slop Guarantee**: Generated `design.md` files strictly eliminate generic AI styling tells (no default purple button glows, no em-dashes, no uncalibrated margins).
