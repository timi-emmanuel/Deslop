import { validateTargetUrl } from "../lib/extractor/security.ts";

console.log("1. Testing SSRF security...");
const testUrls = [
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  "http://192.168.1.1",
  "https://linear.app",
  "https://stripe.com",
];

for (const u of testUrls) {
  const res = validateTargetUrl(u);
  console.log(`URL: ${u.padEnd(25)} -> Valid: ${res.isValid ? "YES" : "NO"} (${res.error || res.sanitizedUrl})`);
}
