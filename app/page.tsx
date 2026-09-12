import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* ============================================================
          1. Navigation Bar
          ============================================================ */}
      <nav className="nav" id="nav">
        <div className="nav-inner">
          <a href="/" className="nav-logo" id="nav-logo">
            deslop
          </a>
          <ul className="nav-links" id="nav-links">
            <li>
              <a href="#how-it-works">How it works</a>
            </li>
            <li>
              <a href="#templates">Templates</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
          </ul>
          <div className="nav-actions">
            <a href="#" className="btn btn-tertiary" id="nav-signin">
              Sign in
            </a>
            <a href="#cta" className="btn btn-primary" id="nav-cta">
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* ============================================================
          2. Hero Section
          ============================================================ */}
      <section className="hero" id="hero">
        <div className="container hero-container">
          {/* Floating decorative blobs */}
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />

          <div className="hero-badge animate-fade-in-up">
            <span className="chip chip-glow">✨ Now in beta</span>
          </div>

          <h1
            className="text-display hero-title animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Stop shipping AI&nbsp;slop.
            <br />
            <span className="hero-title-accent">Start shipping design.</span>
          </h1>

          <p
            className="text-body-lg hero-subtitle animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Paste any live URL and get a complete design.md — colors,
            typography, spacing, components — ready for your AI&nbsp;tools.
          </p>

          <div
            className="hero-actions animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="#cta"
              className="btn btn-primary btn-lg"
              id="hero-cta-primary"
            >
              <span className="btn-icon">→</span>
              Generate your design.md
            </a>
            <a
              href="#templates"
              className="btn btn-secondary btn-lg"
              id="hero-cta-secondary"
            >
              Browse templates
            </a>
          </div>

          <div
            className="hero-visual animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <Image
              src="/hero-clay.jpg"
              alt="Playful 3D clay shapes representing creative design"
              width={560}
              height={560}
              className="hero-clay-image"
              priority
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          3. Logo Wall (Social Proof)
          ============================================================ */}
      <section className="logo-wall" id="social-proof">
        <div className="container">
          <p className="text-body-sm logo-wall-label">
            Trusted by 2,000+ teams building better products
          </p>
          <div className="logo-wall-track">
            {[
              "Vercel",
              "Linear",
              "Notion",
              "Figma",
              "Stripe",
              "Supabase",
              "Railway",
              "Resend",
              "Clerk",
              "Convex",
            ].map((name) => (
              <span key={name} className="logo-wall-item">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. How It Works (3-Step Process)
          ============================================================ */}
      <section className="section-xl how-it-works" id="how-it-works">
        <div className="container">
          <div className="how-it-works-header">
            <h2 className="text-headline-lg">
              Three steps. <span className="text-accent">Zero slop.</span>
            </h2>
            <p className="text-body-lg">
              From live site to design system in under a minute.
            </p>
          </div>

          <div className="steps-grid">
            <div className="card step-card" id="step-1">
              <div className="step-number">1</div>
              <div className="step-icon-img">
                <Image
                  src="/icon-paste-url.jpg"
                  alt="Paste your URL"
                  width={120}
                  height={120}
                  className="step-clay-icon"
                />
              </div>
              <h3>Paste your URL</h3>
              <p>
                Drop in any live website URL. We support every framework, CMS,
                and static site out there.
              </p>
            </div>

            <div className="card step-card" id="step-2">
              <div className="step-number">2</div>
              <div className="step-icon-img">
                <Image
                  src="/icon-ai-analyze.jpg"
                  alt="AI analyzes your site"
                  width={120}
                  height={120}
                  className="step-clay-icon"
                />
              </div>
              <h3>AI analyzes your site</h3>
              <p>
                Our engine crawls your pages, extracting colors, fonts, spacing,
                border radii, and component patterns.
              </p>
            </div>

            <div className="card step-card" id="step-3">
              <div className="step-number">3</div>
              <div className="step-icon-img">
                <Image
                  src="/icon-design-md.jpg"
                  alt="Get your design.md"
                  width={120}
                  height={120}
                  className="step-clay-icon"
                />
              </div>
              <h3>Get your design.md</h3>
              <p>
                Download a structured design system file ready for Cursor, v0,
                Bolt, or any AI-powered tool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. Product Demo / Live Preview
          ============================================================ */}
      <section className="section demo-section" id="demo">
        <div className="container">
          <div className="demo-header">
            <h2 className="text-headline-lg">See what deslop extracts</h2>
            <p className="text-body-lg">
              From messy live sites to clean, structured design tokens.
            </p>
          </div>

          <div className="demo-visual">
            <Image
              src="/demo-before-after.jpg"
              alt="Before: messy website. After: clean design.md with structured tokens"
              width={900}
              height={506}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          6. Template Gallery
          ============================================================ */}
      <section className="section-xl templates-section" id="templates">
        <div className="container">
          <div className="templates-header">
            <h2 className="text-headline-lg">Start with a template</h2>
            <p className="text-body-lg">
              Curated design systems for every brand personality.
            </p>
          </div>

          <div className="templates-grid">
            <TemplateCard
              name="Minimal"
              desc="Clean, monochrome, spacious"
              colors={["#1A1A1A", "#666666", "#E8E8E8", "#F5F5F5"]}
              headingFont="Inter"
              accent="#1A1A1A"
              bgTint="#FAFAFA"
            />
            <TemplateCard
              name="Bold"
              desc="High contrast, saturated, punchy"
              colors={["#FF3366", "#1A0533", "#FFD6E4", "#FFF0F5"]}
              headingFont="Space Grotesk"
              accent="#FF3366"
              bgTint="#FFF5F8"
            />
            <TemplateCard
              name="Enterprise"
              desc="Professional, trustworthy, polished"
              colors={["#0052CC", "#172B4D", "#B3D4FF", "#F4F5F7"]}
              headingFont="IBM Plex Sans"
              accent="#0052CC"
              bgTint="#F0F5FF"
            />
            <TemplateCard
              name="Playful"
              desc="Vibrant, rounded, expressive"
              colors={["#7C3AED", "#FF6B35", "#FBBF24", "#10B981"]}
              headingFont="Outfit"
              accent="#7C3AED"
              bgTint="#F5F0FF"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          7. Feature Highlights
          ============================================================ */}
      <section className="section-xl features-section" id="features">
        <div className="container">
          <div className="feature-row">
            <div className="feature-text">
              <span className="chip feature-chip">⚡ AI-powered</span>
              <h3 className="text-headline-md">
                Extracts tokens from any live&nbsp;site
              </h3>
              <p>
                Our AI doesn't just read CSS — it understands visual patterns.
                It identifies your actual design system from how your site
                looks, not just what the code says.
              </p>
              <a href="#cta" className="btn btn-tertiary feature-link">
                Learn more →
              </a>
            </div>
            <div className="feature-visual">
              <div className="feature-illustration-wrapper">
                <Image
                  src="/feature-ai-extraction.jpg"
                  alt="AI extracting design tokens from a website"
                  width={500}
                  height={375}
                  className="feature-img"
                />
              </div>
            </div>
          </div>

          <div className="feature-row reverse">
            <div className="feature-text">
              <span className="chip feature-chip">🔧 Compatible</span>
              <h3 className="text-headline-md">
                Works with your AI&nbsp;tools
              </h3>
              <p>
                Output is a plain markdown file that works perfectly with
                Cursor, v0, Bolt, Claude, ChatGPT, and any LLM. No
                proprietary format, no vendor lock-in.
              </p>
              <a href="#cta" className="btn btn-tertiary feature-link">
                See integrations →
              </a>
            </div>
            <div className="feature-visual">
              <div className="feature-illustration-wrapper">
                <Image
                  src="/feature-integrations.jpg"
                  alt="Tool integrations connected together"
                  width={500}
                  height={375}
                  className="feature-img"
                />
              </div>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-text">
              <span className="chip feature-chip">📝 Markdown-first</span>
              <h3 className="text-headline-md">
                Version-controlled, human-readable
              </h3>
              <p>
                design.md lives in your repo alongside your code. It's plain
                text — diff it, review it, commit it. Your design system
                evolves with your codebase.
              </p>
              <a href="#cta" className="btn btn-tertiary feature-link">
                View sample output →
              </a>
            </div>
            <div className="feature-visual">
              <div className="feature-illustration-wrapper">
                <Image
                  src="/feature-markdown.jpg"
                  alt="Markdown document with git version control"
                  width={500}
                  height={375}
                  className="feature-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          8. Testimonials
          ============================================================ */}
      <section className="section-xl testimonials-section" id="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <h2 className="text-headline-lg">Loved by builders</h2>
          </div>

          <div className="testimonials-grid">
            <div className="card testimonial-card" id="testimonial-1">
              <div className="testimonial-quote">
                I was spending hours manually documenting my design tokens.
                deslop did it in 30 seconds. The AI actually understood my
                color scale.
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <span>SK</span>
                </div>
                <div>
                  <p className="testimonial-name">Sarah Kim</p>
                  <p className="testimonial-role">
                    Design Engineer at Vercel
                  </p>
                </div>
              </div>
            </div>

            <div className="card testimonial-card" id="testimonial-2">
              <div className="testimonial-quote">
                Finally, my v0 outputs actually match our brand. I just paste
                the design.md and everything is consistent. Game changer for
                our team.
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <span>MR</span>
                </div>
                <div>
                  <p className="testimonial-name">Marcus Rivera</p>
                  <p className="testimonial-role">Founder at Shipfast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. Bottom CTA Section
          ============================================================ */}
      <section className="bottom-cta" id="cta">
        <div className="cta-blob cta-blob-1" />
        <div className="cta-blob cta-blob-2" />
        <div className="cta-blob cta-blob-3" />
        <div className="cta-glow" />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <h2 className="text-headline-lg">
            Ready to deslop your&nbsp;product?
          </h2>
          <p className="text-body-lg">
            Start generating your design system in seconds. Free during beta.
          </p>
          <a href="#" className="btn btn-primary btn-lg btn-glow" id="cta-button">
            Get started free
          </a>
        </div>
      </section>

      {/* ============================================================
          10. Footer
          ============================================================ */}
      <footer className="footer" id="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <a href="/" className="nav-logo">
                deslop
              </a>
              <p>
                Generate design systems from live websites. Stop shipping AI
                slop.
              </p>
            </div>

            <div className="footer-column">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#how-it-works">How it works</a>
                </li>
                <li>
                  <a href="#templates">Templates</a>
                </li>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li>
                  <a href="#">Documentation</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Changelog</a>
                </li>
                <li>
                  <a href="#">API</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#">Privacy</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
                <li>
                  <a href="#">Cookies</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2025 deslop Inc. All rights reserved.</span>
            <div className="footer-socials">
              <a href="#">Twitter</a>
              <a href="#">GitHub</a>
              <a href="#">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ============================================================
   Template Card Component
   ============================================================ */
function TemplateCard({
  name,
  desc,
  colors,
  headingFont,
  accent,
  bgTint,
}: {
  name: string;
  desc: string;
  colors: string[];
  headingFont: string;
  accent: string;
  bgTint: string;
}) {
  return (
    <div className="card template-card" id={`template-${name.toLowerCase()}`}>
      <div className="template-preview" style={{ backgroundColor: bgTint }}>
        <div className="template-colors">
          {colors.map((color, i) => (
            <div
              key={i}
              className="template-color-dot"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="template-typography">
          <span className="template-type-heading" style={{ color: accent }}>
            Aa
          </span>
          <span className="template-type-body">{headingFont}</span>
        </div>
        <div className="template-layout-preview">
          <div
            className="template-layout-block"
            style={{ backgroundColor: accent, opacity: 0.85 }}
          />
          <div
            className="template-layout-block"
            style={{ backgroundColor: accent, opacity: 0.35 }}
          />
          <div
            className="template-layout-block"
            style={{ backgroundColor: accent, opacity: 0.12 }}
          />
        </div>
      </div>
      <div className="template-info">
        <h3 className="template-name">{name}</h3>
        <p className="template-desc">{desc}</p>
        <span className="template-link" style={{ color: accent }}>
          Use template →
        </span>
      </div>
    </div>
  );
}
