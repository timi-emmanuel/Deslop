import { RawColorObservation } from "@deslop/tokens";

export interface InBrowserHarvestResult {
  pageTitle: string;
  rawObservations: RawColorObservation[];
  typography: {
    fontFamilies: string[];
    observedFontSizes: number[];
  };
  geometry: {
    observedPaddings: number[];
    observedRadii: number[];
    observedShadows: string[];
  };
}

/**
 * LESSON: Bundler-Safe In-Browser Execution
 * -----------------------------------------
 * When TypeScript is transpiled with esbuild/tsx, named functions are rewritten with
 * a Node-scoped helper `__name(fn, "name")`.
 * If you pass a compiled function to `page.evaluate(fn)`, Chrome throws:
 * `ReferenceError: __name is not defined` because `__name` only exists in Node.
 *
 * Senior Pattern:
 * Passing a raw JavaScript string guarantees that zero bundler helpers or polyfills
 * are injected into the browser context.
 */
export const HARVEST_DOM_SCRIPT = `
(() => {
  const pageTitle = document.title || "";

  function rgbToHex(rgbStr) {
    if (!rgbStr || rgbStr === "transparent" || rgbStr.includes("rgba(0, 0, 0, 0)")) {
      return null;
    }
    const match = rgbStr.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/i);
    if (!match) return null;

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    const toHex = (n) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, "0");
    return ("#" + toHex(r) + toHex(g) + toHex(b)).toUpperCase();
  }

  const observationMap = new Map();

  function addObservation(hex, element, weight) {
    weight = weight || 1;
    const norm = hex.toUpperCase();
    if (!observationMap.has(norm)) {
      observationMap.set(norm, {
        hex: norm,
        occurrences: 0,
        elements: []
      });
    }
    const obs = observationMap.get(norm);
    obs.occurrences += weight;
    if (obs.elements.length < 10) {
      obs.elements.push(element);
    }
  }

  // A. CSS variables on root
  const rootStyle = window.getComputedStyle(document.documentElement);
  const commonVars = [
    "--primary",
    "--background",
    "--foreground",
    "--accent",
    "--muted",
    "--card",
    "--surface",
    "--border",
    "--brand",
    "--color-primary",
    "--color-background"
  ];

  for (const varName of commonVars) {
    const val = rootStyle.getPropertyValue(varName).trim();
    if (val) {
      const hex = rgbToHex(val) || (val.startsWith("#") ? val.toUpperCase() : null);
      if (hex) {
        addObservation(
          hex,
          { selector: ":root { " + varName + " }", property: varName },
          15
        );
      }
    }
  }

  // B. Harvest visible elements
  const elements = document.querySelectorAll(
    "body, header, nav, main, footer, section, article, h1, h2, h3, h4, p, a, button, input, [role='button']"
  );

  const fontFamilies = new Set();
  const fontSizes = new Set();
  const paddings = [];
  const radii = [];
  const shadows = [];

  const maxScan = Math.min(elements.length, 300);

  for (let i = 0; i < maxScan; i++) {
    const el = elements[i];
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    const style = window.getComputedStyle(el);

    // 1. Background
    const bgHex = rgbToHex(style.backgroundColor);
    if (bgHex) {
      const isButton =
        el.tagName === "BUTTON" ||
        el.getAttribute("role") === "button" ||
        (el.className && typeof el.className === "string" && (el.className.includes("btn") || el.className.includes("button")));

      addObservation(
        bgHex,
        {
          selector: el.tagName.toLowerCase(),
          property: "background-color",
          tagName: el.tagName
        },
        isButton ? 8 : 2
      );
    }

    // 2. Text
    const textHex = rgbToHex(style.color);
    if (textHex) {
      addObservation(
        textHex,
        {
          selector: el.tagName.toLowerCase(),
          property: "color",
          hasTextChildren: el.children.length === 0 && (el.textContent || "").trim().length > 0
        },
        3
      );
    }

    // 3. Border
    const borderHex = rgbToHex(style.borderColor);
    if (borderHex && parseFloat(style.borderWidth) > 0) {
      addObservation(
        borderHex,
        {
          selector: el.tagName.toLowerCase(),
          property: "border-color"
        },
        1
      );
    }

    // 4. Typography
    if (style.fontFamily) {
      const cleanFont = style.fontFamily.split(",")[0].replace(/['"]/g, "").trim();
      if (cleanFont && cleanFont !== "inherit") {
        fontFamilies.add(cleanFont);
      }
    }
    const fSize = parseFloat(style.fontSize);
    if (!isNaN(fSize) && fSize > 0) {
      fontSizes.add(Math.round(fSize));
    }

    // 5. Geometry
    const padTop = parseFloat(style.paddingTop);
    if (!isNaN(padTop) && padTop > 0) paddings.push(Math.round(padTop));

    const bRadius = parseFloat(style.borderRadius);
    if (!isNaN(bRadius) && bRadius > 0) radii.push(Math.round(bRadius));

    if (style.boxShadow && style.boxShadow !== "none") {
      shadows.push(style.boxShadow);
    }
  }

  return {
    pageTitle: pageTitle,
    rawObservations: Array.from(observationMap.values()),
    typography: {
      fontFamilies: Array.from(fontFamilies).slice(0, 3),
      observedFontSizes: Array.from(fontSizes).sort((a, b) => a - b)
    },
    geometry: {
      observedPaddings: paddings.slice(0, 40),
      observedRadii: radii.slice(0, 40),
      observedShadows: shadows.slice(0, 10)
    }
  };
})()
`;
