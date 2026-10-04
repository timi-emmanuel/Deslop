# 🗺️ Deslop Product & Engineering Roadmap

> **Mission:** Turn any public or production website into clean, production-grade design tokens and unambiguous AI rules (`design.md`, Tailwind v4, DTCG JSON) so tools like Cursor, Claude Code, and v0 build on-brand UI on the first prompt.

---

## 🧭 Guiding Philosophy: Adoption First, Monetize Workflows Later

1. **Frictionless Core Utility:** Core extraction (`URL ➔ design.md / Tailwind CSS v4`) must remain **100% free and open-source**. Developer tooling thrives on word-of-mouth adoption (`shadcn/ui`, `Biome`, `Supabase`).
2. **No Artificial Paywalls in Beta:** Artificial barriers (e.g. 3-scan guest limits, dummy checkout modals) have been removed to build user trust, encourage exploration, and gather edge-case telemetry.
3. **Monetize Team & Automated Workflows:** When paid tiers launch, monetization will focus on **CI/CD automation, authenticated enterprise crawling, and multi-repo team governance**—capabilities engineering organizations actively budget for.

---

## 📊 Roadmap Overview

| Phase | Milestone | Focus Area | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Core Engine & Free Beta** | Real DOM inspection, 6-role color clustering, 8pt grid, Tailwind v4, smooth animations | 🟢 **Shipped / Active** |
| **Phase 2** | **Frictionless Auth & Identity** | Google OAuth 2.0, account linking, persistent scan history, cloud sync | 🟡 **Next Up** |
| **Phase 3** | **Advanced Style Intelligence** | Dark mode detection, component specimens, font pairing resolver, responsive breakpoints | 🔵 **Planned** |
| **Phase 4** | **Developer Ecosystem & CLI** | `npx deslop` CLI, Cursor/VSCode extensions, `.windsurfrules` & `AGENTS.md` exports | 🔵 **Planned** |
| **Phase 5** | **Monetization & Team Tiers** | GitHub CI/CD PR Bot, behind-login crawling, team governance, developer API | 🟣 **Future Phase** |

---

## 🚀 Phase 1: Core Engine & Free Beta *(Shipped / Current)*

- [x] **Headless Browser Runtime:** Real-time Playwright worker measuring live computed DOM styles after full hydration.
- [x] **Zero-Slop Color Synthesizer:** Groups 50+ messy hex codes into 6 semantic roles (`canvas`, `surface`, `keyline`, `text`, `text-muted`, `accent`) with WCAG contrast scoring.
- [x] **Spatial Baseline:** Modular 8pt spacing grid and border radius normalization.
- [x] **Multi-Engine Export:**
  - AI-optimized `design.md` with explicit negative guardrails.
  - Tailwind CSS v4 `@theme` configuration block.
  - Standard CSS custom properties (`:root`).
  - W3C DTCG-compliant design tokens (JSON).
- [x] **Developer-First Editorial UI:** Warm technical drafting grid, crosshair cards, and silky smooth scroll-entrance transitions.
- [x] **Removed Artificial Gating:** Unlocked unconstrained public scanning; removed dummy Stripe paywall modals.

---

## 🔐 Phase 2: Frictionless Auth & Identity *(Next Up)*

### 1. Google OAuth 2.0 Integration
- **Objective:** Give developers instant, 1-click authentication without managing separate passwords.
- **Frontend Experience:**
  - Branded *"Continue with Google"* button on `/login` and `/register`.
  - Automatic redirect back to the user's active scan or studio session.
- **Backend Architecture (Fastify + Drizzle ORM):**
  - Adjust `apps/api/src/db/schema.ts` to make `password_hash` nullable for OAuth accounts.
  - Add `google_id` (unique varchar) and optional `avatar_url` (text) to `users` table.
  - Endpoints:
    - `GET /api/auth/google` ➔ Redirects to Google consent screen.
    - `GET /api/auth/google/callback` ➔ Exchanges auth code for Google profile, upserts user in PostgreSQL, generates `deslop_session_token`, and issues `httpOnly` secure cookie.
- **Account Linking:** If a user previously signed up via email/password, signing in with the same verified Google email automatically links the account.

### 2. Cloud Scan History & Workspace Persistence
- Re-run past scans with 1 click to detect website redesigns and token drifts.
- Pin favorite design systems (e.g. Linear, Stripe, Raycast) for quick reference.
- Custom naming and project categorization for design audits.

---

## 🧠 Phase 3: Advanced Style Intelligence *(Mid-Term)*

- [ ] **Dual-Theme / Dark Mode Harvesting:**
  - Detect `prefers-color-scheme: dark`, `.dark` classes, or `[data-theme="dark"]` selectors.
  - Extract both Light & Dark semantic token pairs simultaneously in a single scan.
- [ ] **Component Specimen Extraction:**
  - Automatically identify primary buttons, secondary buttons, input fields, badges, and card containers.
  - Generate ready-to-copy React/Tailwind specimen snippets for each component.
- [ ] **Web Font Stack Resolver:**
  - Detect proprietary vs open-source fonts.
  - If a Google Font is detected, auto-generate the HTML `<link>` or Next.js `next/font/google` import.
  - If a proprietary font is detected (e.g. Söhne, Circular, Roobert), provide the closest high-quality open-source fallback (Inter, Geist, Plus Jakarta Sans).
- [ ] **Responsive Breakpoint Profiler:**
  - Measure layout and font-scale differences between Mobile (375px), Tablet (768px), and Desktop (1440px).

---

## 🛠️ Phase 4: Developer Ecosystem & CLI *(Expansion)*

- [ ] **Deslop CLI (`npx deslop`):**
  - Run extractions straight from the terminal:
    ```bash
    npx deslop extract https://linear.app --out ./design.md --tailwind
    ```
  - Perfect for rapid project bootstrapping without opening a browser.
- [ ] **Multi-Agent Prompt Formats:**
  - Dedicated export options for `.cursorrules`, `CLAUDE.md`, `.windsurfrules`, `AGENTS.md`, and `copilot-instructions.md`.
- [ ] **Figma Variables Integration:**
  - Export DTCG JSON formatted for 1-click import into Figma Local Variables.

---

## 💎 Phase 5: Monetization & Pricing Tiers *(Future Launch)*

When Deslop reaches strong developer adoption, paid tiers will be introduced for **teams and advanced automation workflows**. Core extraction will remain free.

### Pricing Structure

```
┌─────────────────────────┐   ┌─────────────────────────┐   ┌─────────────────────────┐
│        FREE CORE        │   │        DESLOP PRO       │   │       DESLOP TEAM       │
│       $0 / forever      │   │    $12 / mo ($9/yr)     │   │    $49 / mo ($39/yr)    │
├─────────────────────────┤   ├─────────────────────────┤   ├─────────────────────────┤
│ • Public URL extractions│   │ • Everything in Free    │   │ • Everything in Pro     │
│ • design.md, CSS, TW v4 │   │ • Behind-auth crawls    │   │ • GitHub PR Sync Bot    │
│ • 6 semantic color roles│   │ • Dark mode extraction  │   │ • Multi-repo governance │
│ • 8pt grid normalizer   │   │ • Component extraction  │   │ • Team shared presets   │
│ • Scan history (last 10)│   │ • Unlimited history     │   │ • Audit log & changelog │
│ • Community support     │   │ • Priority browser pool │   │ • Dedicated REST API    │
└─────────────────────────┘   └─────────────────────────┘   └─────────────────────────┘
```

### Detailed Tier Features

#### 1. Free Core ($0 / forever)
*Target: Individual developers, open-source builders, and hobbyists.*
- Unlimited manual extractions from any publicly accessible URL.
- AI-ready `design.md` generation with strict negative guardrails.
- Tailwind CSS v4 `@theme` and standard CSS variables export.
- 6-role semantic color clustering with WCAG contrast checks.
- Modular 8pt spatial grid and border radius normalization.
- Google OAuth & Email authentication.
- Last 10 scans saved to Cloud History.

#### 2. Deslop Pro ($12 / month or $9 / month billed annually)
*Target: Freelancers, UI/UX engineers, and independent SaaS founders.*
- **Authenticated Crawling:** Secure browser sessions with session cookies/OAuth to extract design tokens from behind staging logins, private admin dashboards, and internal web apps.
- **Dual-Theme Light/Dark Extraction:** Harvests both themes and outputs clean `data-theme` variable maps.
- **Component Specimen Generator:** Automatic extraction of button states, card styles, and input specifications.
- **Unlimited Scan History:** Permanent cloud storage and search across all past scans.
- **Priority Headless Worker Pool:** Instant sub-second extraction without queuing.
- **Asset & SVG Icon Ingestion:** Extracts rendered SVG logo marks, icons, and favicon vectors.

#### 3. Deslop Team & Enterprise ($49 / month or $39 / month billed annually)
*Target: Product design teams, frontend agencies, and engineering organizations.*
- **Automated GitHub PR Sync Bot (Continuous Design Governance):**
  - Monitors live production URLs or Figma token feeds on a schedule or webhook.
  - Automatically opens a clean GitHub Pull Request updating `.cursorrules`, `design.md`, and Tailwind themes whenever brand styles change.
  - Eliminates design-to-code drift across teams.
- **Shared Team Workspace:** Invite designers, frontend leads, and AI developers with role-based permissions (Admin, Editor, Viewer).
- **Multi-Repo Governance:** Push centralized design system tokens across multiple frontend repositories.
- **Programmatic Extraction API:** High-throughput REST API with webhook callbacks for agencies and automated website builders.
- **Design Token Changelog:** Automated diff reports highlighting newly added colors, deprecated tokens, or font changes.
- **SOC2 & Enterprise Privacy:** Self-hosted worker option and zero-retention data policies for proprietary staging environments.

---

## 📌 Implementation Checklist & Next Action

- [ ] **Step 1:** Implement Google OAuth 2.0 (Phase 2) on `/login` and `/register`.
- [ ] **Step 2:** Add `google_id` and nullable `password_hash` to Drizzle schema in `apps/api`.
- [ ] **Step 3:** Deploy Google OAuth credentials via `.env`.
- [ ] **Step 4:** Maintain public beta free-tier messaging on landing page and documentation.
