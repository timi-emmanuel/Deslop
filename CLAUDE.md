@AGENTS.md

# 🎨 Deslop — The Vibe Coder's Guide & Project Handbook

> **"Stop letting AI generate ugly websites. Turn any site you love into clean design rules your AI can follow."**

---

## ⚡ What is Deslop in Plain English?

When you ask AI tools (like **Cursor, Claude, Lovable, v0, or Bolt**) to build a website, they often make it look cheap:
- Ugly random purple/pink gradients
- Buttons with weird corner roundness
- 13px or 17px random margins that look misaligned
- Inconsistent colors everywhere

**Deslop fixes this in 3 simple steps:**
1. **You give it a website URL** (like `linear.app`, `stripe.com`, or `raycast.com`).
2. **Deslop inspects the live site** and pulls out the exact colors, fonts, and clean 8px spacing.
3. **It gives you a single `design.md` file**. You copy and paste this into Cursor (`.cursorrules`), Claude Project Knowledge, or your Lovable/v0 prompt. Now your AI builds beautiful, on-brand interfaces every time!

---

## 🗺️ Where Everything Is (The Plain English Project Map)

If you want to change or tweak something in this repo, here is where to look:

### 🌟 1. The Landing Page (`components/`)
- **`components/Hero.tsx`**  
  The top of the landing page. Has the website URL input, the live preview card, the scissors extractor bridge, and the **⚡ Deslopped Craft vs ⚠️ AI Slop** toggle.
- **`components/HowItWorks.tsx`**  
  The 3-step walkthrough explaining how Deslop works (Scan ➔ Clean ➔ Drop into AI).
- **`components/FeatureMatrix.tsx`**  
  Interactive mini-cards showing off color swatches, font scales, and button inspectors.
- **`components/TemplateGallery.tsx`**  
  Pre-built design presets (Linear, Stripe, Raycast, Supabase).
- **`components/Faq.tsx`**  
  Common questions and plain-English answers for users.
- **`components/Navbar.tsx`**  
  The top navigation bar with the logo and quick links.

### 🔍 2. The Live Token Studio (`app/inspect/` & `components/inspect/`)
- **`app/inspect/page.tsx`**  
  The interactive page where users inspect a scanned site.
- **`components/inspect/TokenTabs.tsx`**  
  The tab switcher to view colors, typography, spacing, and the copyable `design.md` output.

### ⚙️ 3. The Extraction Engine (`lib/`)
- **`lib/extractor/crawler.ts`**  
  The engine that visits a website and reads its real computed CSS colors and fonts.
- **`lib/synthesizer/color-clustering.ts`**  
  The cleanup tool that takes 50 messy near-duplicate colors and cleans them down to 5 neat brand tokens.
- **`lib/synthesizer/grid-quantizer.ts`**  
  Snaps random spacing (like 13px) to clean 8px multiples (8, 16, 24px).
- **`lib/exporters/design-md.ts`**  
  Assembles the final `design.md` markdown file for the user to copy.

### 📖 4. The Sacred Design Bible
- **`deslop-design-tips.md.md`**  
  The master rules for Deslop's own visual identity (Section 22: Cute Technical Editorial, Woblo-inspired, hand-drawn stickers & scribbles, strict single-accent `#FF4800`).

---

## 🛡️ Golden Rules for Building in this Repo

1. **NEVER run `npm run dev` in the background**: The user explicitly controls running the dev server.
2. **Keep the Design Warm, Cute & Technical**:
   - Use our glossy buttons (`btn-gloss-orange`, `btn-gloss-neutral`).
   - Use brand orange `#FF4800` as the primary accent.
   - Dark high-contrast text is `#0A0D14`. Background is `#FAFAFA` or `#FFFFFF`.
   - Never use generic AI purple glows or sterile dark cyberpunk themes.
3. **Chrome vs. Data Philosophy**:
   - **Chrome** (modals, nav, cards, hero, stickers): Glassmorphism, tactile borders, subtle hover animations, and playful accents are encouraged.
   - **Data** (token tables, code editors, contrast ratios, hex values): Strict legibility. Solid high-contrast backgrounds with zero blur or opacity behind numbers and text.
4. **Tailwind v4 & Class Composition (`cn`)**:
   - Always use `cn(...)` from `lib/utils.ts` for dynamic conditional classes.
   - Do NOT extract utility classes into `@layer components` with `@apply` directives, as Tailwind v4 compilation strips them.
5. **Standardized 3-Part Modal Architecture**:
   - All modals must follow the 3-part layout (`components/ui/Modal.tsx`):
     - **Fixed Header**: Duotone icon container (`p-2 rounded-lg bg-[#FFF1EB] border border-[#FFD6C7] text-[#FF4800]`), title, subtitle, and close button.
     - **Scrollable Body**: `overflow-y-auto max-h-[85vh] space-y-4`.
     - **Fixed Footer**: Secondary Cancel + Primary CTA.
     - **Post-Action Hero State**: Success checkmark hero with an instant 1-click copyable card (`<ModalSuccessHero>`).
6. **Centralized API & SWR Caching Policy (`lib/api/`)**:
   - All external/backend calls route through `lib/api/client.ts`.
   - Domain hooks (e.g. `useExtraction`) implement SWR caching with a 2-second deduping interval (`dedupingInterval: 2000`) and zero background polling loops.
7. **No Heavy Computer Science Jargon in the UI**:
   - Don't say *"AST Bounding Box Extraction"* ➔ Say *"Inspect Real Screen Styles"*.
   - Don't say *"Semantic Token Cluster Quantizer"* ➔ Say *"Clean Up Messy Duplicate Colors"*.
   - Speak directly to vibe coders who want gorgeous UI fast.
8. **Always Test with TypeScript**:
   - Run `npx tsc --noEmit` before finishing any change to make sure there are 0 errors.

---

## 💡 Quick Vibe Coder Glossary

| Jargon Term | What It Actually Means for You |
| :--- | :--- |
| **Tokens** | The basic design ingredients: your primary color, font name, button roundness, and spacing numbers. |
| **design.md** | A single Markdown cheat sheet that you paste into Cursor or Claude so it stops making ugly designs. |
| **AI Slop** | The generic purple gradients, weird 13px margins, and mismatched buttons that AI makes when it has no rules. |
| **8pt Grid** | Spacing in multiples of 8 (8px, 16px, 24px, 32px) so buttons and cards align neatly on the screen. |
| **WCAG AAA** | A guarantee that text is high contrast and super easy to read on top of background colors. |

