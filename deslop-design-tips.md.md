# Deslop — AI Development & Design Guide

> **Stop shipping AI slop. Start shipping design.**

## 1. Product

**Deslop** transforms a live website into a production-grade, version-controlled `design.md` that constrains and guides AI coding tools such as Cursor, v0, Bolt, Claude Code, and Windsurf.

The product exists to solve a specific problem: AI coding tools can produce functional interfaces quickly, but without strong design constraints they tend to produce visually generic, inconsistent interfaces ("AI slop").

Deslop extracts the visual language of an existing website, removes accidental styling noise, synthesizes a coherent design system, and outputs machine-readable design rules.

The product specification is the source of truth for product scope and architecture.

---

## 2. Core Product Idea

### Input

- Live website URL
- Curated design preset
- Optional user prompt/context

### Processing

1. Ingest the website
2. Inspect the rendered DOM and computed CSS
3. Extract visual properties
4. Cluster and normalize the raw data
5. Apply design-taste heuristics
6. Generate a clean design system

### Output

- `design.md`
- `.cursorrules` snippet
- Tailwind v4 `@theme` configuration
- Future Claude Code skill package
- Future CLI output

The core promise:

> **Deslop turns a website's visual identity into explicit rules that AI coding tools can actually follow.**

---

# 3. Brand & Landing Page Philosophy

## The most important design principle

**Deslop must not look like AI slop.**

The landing page is itself a demonstration of the product's philosophy.

Avoid the visual language commonly associated with generic AI/SaaS landing pages:

- Generic purple/blue gradient glows
- Giant centered hero boxes
- Stock "developer sitting at laptop" illustrations
- Generic 3-column feature cards
- Excessive glassmorphism
- Random blobs used only as decoration
- Excessive rounded cards
- Uncalibrated spacing
- Too many competing colors
- Generic AI sparkles everywhere
- Random illustrations from unrelated visual styles
- Excessive animation without purpose

The interface should feel **designed, intentional, playful, technical, and handcrafted**.

### Desired visual direction

**Playful technical editorial.**

The target feeling is:

- Smooth
- Cute
- Technical
- Slightly weird
- Polished
- Developer-native
- Approachable
- Visually distinctive

The landing page should feel closer to a carefully crafted developer tool/product studio than a generic SaaS template.

---

# 4. Illustration & Asset Strategy

Do NOT default to conventional SaaS illustration packs.

The preferred approach is to make **the product's own concepts become the illustrations**.

Deslop already has visually interesting concepts:

- Website → DOM → CSS → tokens
- Raw styles → semantic tokens
- Hundreds of values → a small design system
- AI slop → structured design rules
- Website → `design.md`
- Browser → extractor → synthesis → output
- Before/after design systems
- Token extraction
- Color clustering
- Typography inspection
- Spatial geometry
- Contrast audits

These should become visual artifacts in the landing page.

## Preferred asset types

Use:

- Abstract technical diagrams
- Browser/UI fragments
- DOM trees
- Token grids
- Code snippets
- Design-token cards
- Hand-drawn arrows
- Small doodles
- Tiny annotations
- Stickers
- Geometric shapes
- Cursor/pointer motifs
- Browser inspection overlays
- Before/after comparisons
- Floating UI fragments
- Small playful icons
- Subtle technical diagrams

The product UI itself can function as the illustration.

### Example visual concept

Instead of a generic developer illustration:

    WEBSITE
       ↓
    DOM + CSS
       ↓
    TOKEN EXTRACTION
       ↓
    DESIGN.MD

Turn that process into a polished visual composition containing browser fragments, tiny labels, tokens, annotations, arrows, and subtle motion.

The landing page should make visitors understand the product visually without relying on generic decorative artwork.

---

# 5. Illustration Consistency

If external illustration assets are used:

**Use one coherent visual family per page/section.**

Never combine unrelated:

- 3D characters
- flat SaaS illustrations
- hand-drawn characters
- gradient illustrations
- pixel art

unless the combination is deliberately part of the design system.

Prefer:

1. Custom product-generated visuals
2. Consistent SVG assets
3. One illustration family
4. Simple supporting doodles/icons

External assets should support the brand, not define it.

Useful inspiration/resources include:

- DrawKit
- Blush
- Storyset
- Vector UI Studio
- SVG Repo
- Icons8 Ouch!

Always verify licensing before using an external asset in a production or commercial project.

---

# 6. Landing Page Visual Language

The landing page should communicate:

> "We care about design enough to build a tool that prevents bad design."

## Visual hierarchy

Prioritize:

1. Strong typography
2. Product demonstration
3. Visual storytelling
4. Interaction
5. Small decorative details

Do not let illustrations overpower the product.

## Motion

Motion should reinforce the product story.

Good examples:

- Tokens appearing during extraction
- DOM nodes connecting
- Values being consolidated
- Browser styles transforming into semantic tokens
- `design.md` lines being generated
- Small cursor interactions
- Subtle spring-based hover states
- Before/after transitions

Avoid:

- Constant floating animations
- Excessive parallax
- Random bouncing elements
- Animation everywhere
- Motion that exists only because it looks impressive

The page should still feel polished with animations disabled.

---

# 7. Product UI / Existing Scope

Phase 1 includes:

- Interactive URL extractor simulator
- Preset switching
- Computed color swatches
- Typography ramps
- Raw `design.md` preview
- Asymmetric "How It Works" showcase
- Interactive pipeline schemas
- Curated template gallery
- Spring-loaded hover depth
- Feature bento
- Monochrome social proof

Presets currently include:

- Linear
- Stripe
- Supabase
- Raycast

Built-in design baselines include:

- Minimal Obsidian
- Hyper-Bold Crimson
- Enterprise Cobalt
- Expressive Iris

---

# 8. Current Tech Stack

The landing page is built with:

- Next.js 16
- React 19
- Tailwind CSS v4
- Phosphor Icons

The broader extraction engine is expected to use:

- Playwright / Chromium
- Headless browser DOM inspection
- Computed CSS extraction
- AI/LLM synthesis

Future integrations include:

- npm CLI
- Cursor
- v0
- Claude Code
- Tailwind
- GitHub Actions

Do not introduce additional libraries without a clear reason.

Prefer native platform capabilities and the existing stack where practical.

---

# 9. Design System Baseline

The example `design.md` specification defines this baseline:

### Colors

- Canvas / Background: `#08090A`
- Primary Surface: `#121316`
- Brand Accent: `#5E6AD2`
- Borders / Dividers: `#222326`
- Text Primary: `#F7F8F8`
- Text Muted: `#8A8F98`

### Typography

- Display / H1: Geist Sans
- Headings: Geist Sans
- Body: Inter
- Code / Tokens: Geist Mono or JetBrains Mono

Typography should feel crisp, compact, and developer-oriented.

### Geometry

Base spacing:

- 4px / 8px multiples

Radii:

- Buttons / inputs: 6px
- Cards / dialogs: 8–12px
- Status pills: full pill

Interactive feedback:

- Use subtle `active:scale-[0.98]` behavior where appropriate.

These values are a baseline, not an excuse to mechanically apply them everywhere. Design decisions should remain intentional.

---

# 10. Anti-Slop Rules

These rules apply especially to the landing page.

### Never

- Invent arbitrary colors when an existing token works
- Add purple/blue glowing shadows to make something "AI-looking"
- Build repetitive 3-equal-card layouts by default
- Use desktop CTA labels that wrap unnecessarily
- Add decorative elements without a visual purpose
- Mix illustration styles randomly
- Use generic stock illustrations when the product itself can communicate the concept
- Add gradients merely because modern SaaS sites use gradients
- Add animation merely to make the page feel "premium"
- Overuse rounded containers
- Turn every section into a card
- Make every element compete for attention
- Use excessive emojis/sparkles in product UI

### Prefer

- Asymmetry
- Strong composition
- Whitespace
- Small technical details
- Controlled contrast
- Subtle borders
- Product UI as visual storytelling
- Carefully chosen motion
- Reusable visual motifs
- Consistent illustration language
- Visual explanations of technical concepts
- Purposeful imperfection where appropriate

---

# 11. Hero Direction

The hero should communicate three things immediately:

1. What Deslop does
2. Who it is for
3. Why it matters

The visual should demonstrate the transformation rather than merely decorate the headline.

Potential conceptual structure:

    LIVE WEBSITE
          ↓
    Extract visual system
          ↓
    Remove noise
          ↓
    design.md
          ↓
    AI builds with constraints

The hero can use a live interactive extractor as the primary visual.

The visual should feel like a **real product interaction**, not a fake dashboard screenshot.

---

# 12. "AI Slop" Visual Storytelling

Deslop should be comfortable showing bad design as a contrast.

A useful visual pattern:

### Before

- Random spacing
- Inconsistent colors
- Arbitrary radius
- Purple glow
- Generic card layout
- Random typography

### After

- Semantic color roles
- Consistent spacing scale
- Controlled radius
- Defined typography
- Clear hierarchy
- Explicit AI directives

This contrast can be playful.

For example, annotations such as:

- "13px?"
- "Why this radius?"
- "Another purple gradient..."
- "40 shades of blue"
- "Please stop."

can be used sparingly as visual commentary.

The humor should support the brand without turning the product into a meme.

---

# 13. Product Personality

Deslop should feel like a developer who has strong design taste and is slightly tired of seeing bad AI-generated interfaces.

Personality:

- Confident
- Witty
- Technical
- Opinionated
- Precise
- Playful

Avoid:

- Corporate marketing language
- Fake enthusiasm
- "Revolutionary AI-powered design transformation"
- Excessive buzzwords
- Generic startup copy

The product can be opinionated because the problem itself is opinionated.

---

# 14. Component & Implementation Principles

Keep components reusable but do not over-engineer.

Prefer:

- Small focused components
- Clear data-driven configuration for repeated visuals
- CSS/Tailwind for simple visual effects
- Framer Motion only where motion materially improves the interaction
- SVG for custom diagrams and decorative technical visuals
- Semantic HTML
- Responsive-first implementation
- Accessible interactive elements

Avoid:

- Huge monolithic components
- Premature abstraction
- Building an internal design framework unnecessarily
- Adding dependencies for trivial UI behavior
- Duplicating visual tokens across files

When implementing a new section, first ask:

> Is this demonstrating the product, strengthening the brand, or merely filling space?

If the answer is only "filling space", reconsider the section.

---

# 15. Responsive Design

The visual concept must survive mobile.

Do not simply shrink desktop layouts.

For complex visual compositions:

- Simplify
- Recompose
- Hide secondary decorative details
- Preserve the primary story
- Maintain readable typography
- Avoid horizontal overflow

Interactive diagrams should have a useful mobile representation rather than becoming unusable.

---

# 16. Development Workflow for AI Agents

When modifying Deslop:

### Step 1 — Understand the intent

Read the existing component and nearby styles before changing anything.

### Step 2 — Preserve the visual language

Do not introduce a new visual style without a deliberate reason.

### Step 3 — Reuse existing primitives

Search for existing components, tokens, utilities, and animation patterns before creating new ones.

### Step 4 — Implement the smallest coherent change

Avoid unrelated refactors.

### Step 5 — Check visual consistency

Ask:

- Does the spacing belong to the system?
- Are colors from the established palette?
- Does the component look like it belongs to Deslop?
- Is the composition too symmetrical?
- Is there unnecessary decoration?
- Does the interaction have a purpose?
- Does this look like something an AI would generate by default?

### Step 6 — Check responsive behavior

Test desktop and mobile compositions separately.

---

# 17. When Creating Illustrations or Visual Assets

Before creating or sourcing an asset, identify its role.

Good roles:

- Explain a product concept
- Demonstrate a transformation
- Reinforce a section's message
- Add personality to an empty state
- Guide the user's eye
- Make an interaction understandable

Bad role:

- "The section looks empty."

If the visual can be constructed from Deslop's own UI/data, prefer that over a generic illustration.

---

# 18. Quality Bar

A successful Deslop landing page should make a frontend developer think:

> "Someone with actual design taste built this."

It should NOT make them think:

> "This looks like an AI-generated SaaS landing page."

The strongest proof of the product should be the landing page itself.

**Deslop sells design constraints. Therefore, the website must demonstrate design restraint.**

---

# 19. Product Roadmap

### Phase 1 — Brand, Positioning & Landing Page

Completed:

- Repository initialization
- Next.js App Router
- Brand identity
- Value proposition
- Dark design system
- Taste Skill / anti-slop rules
- Interactive hero extractor
- Workflow showcase
- Template gallery

### Phase 2 — Live Extraction Engine

Next:

- Headless crawler
- Computed style extractor
- Color matrices and CSS variables
- Font extraction
- Spacing extraction
- Border-radius extraction
- Elevation extraction
- `POST /api/extract`

### Phase 3 — Token Synthesis

- Color clustering
- Delta-E grouping
- LLM synthesis
- `design.md` generation
- Contrast validation
- Taste Skill validator
- Negative constraint generation

### Phase 4 — CLI & Integrations

- `npx deslop <url>`
- `design.md`
- `.cursorrules`
- Tailwind v4 `@theme`
- Claude Code skill
- GitHub Action for design-token changes

---

# 20. Success Criteria

Target quality:

- 95%+ fidelity for primary colors, fonts, and component radii
- Consistent token adherence
- Sub-10-second extraction and token generation
- Zero obvious generic AI styling tells

---

# 21. Final Rule for AI Agents

When in doubt:

> **Do not make Deslop look like an AI-generated SaaS website.**

Before adding any visual element, ask:

1. Does it communicate something?
2. Does it belong to Deslop's visual language?
3. Is it consistent with the existing system?
4. Could it be mistaken for generic AI-generated design?
5. Can the product itself communicate the idea better?

If the answer to #4 is yes, redesign it.

**The landing page is not decoration around Deslop. The landing page is the first demonstration that Deslop works.**
