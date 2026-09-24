#!/usr/bin/env node
/**
 * Regenerate production buyer-package PDFs from HTML in this folder.
 *
 *   npm install playwright
 *   npx playwright install chromium
 *   node build-pdfs.mjs
 */
let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Install playwright first: npm install playwright && npx playwright install chromium");
  process.exit(1);
}
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const dir = path.dirname(fileURLToPath(import.meta.url));

const docs = [
  ["cityplace-financial-summary.html", "cityplace-financial-summary.pdf"],
  ["cityplace-operations-summary.html", "cityplace-operations-summary.pdf"],
];

for (const [html] of docs) {
  const htmlPath = path.join(dir, html);
  if (!fs.existsSync(htmlPath)) {
    console.error(`Missing ${htmlPath}`);
    process.exit(1);
  }
}

const browser = await chromium.launch({ headless: true });

try {
  for (const [html, pdf] of docs) {
    const htmlPath = path.join(dir, html);
    const pdfPath = path.join(dir, pdf);
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: "load" });
    await page.pdf({
      path: pdfPath,
      format: "Letter",
      printBackground: true,
      margin: { top: "0.55in", right: "0.6in", bottom: "0.55in", left: "0.6in" },
    });
    await page.close();
    const stat = fs.statSync(pdfPath);
    console.log(`Wrote ${pdf} (${stat.size} bytes)`);
  }
} finally {
  await browser.close();
}
