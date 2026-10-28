// Genera el PDF del folleto y la imagen para redes (og-image.jpg).
// Uso: sirve la carpeta con "python3 -m http.server 8765" y corre: node tools/render.js
const { chromium } = require("playwright");

(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: "localhost,127.0.0.1" } : undefined;
  const browser = await chromium.launch({ proxy });
  const base = process.env.BASE_URL || "http://localhost:8765/";

  const page = await browser.newPage();
  await page.goto(base + "folleto.html", { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: "assets/folleto-empanadas-del-eje.pdf", format: "Letter", printBackground: true, preferCSSPageSize: true });
  console.log("assets/folleto-empanadas-del-eje.pdf listo");

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.goto(base + "tools/og-card.html", { waitUntil: "networkidle" });
  await og.screenshot({ path: "assets/og-image.jpg", type: "jpeg", quality: 88 });
  console.log("assets/og-image.jpg listo");

  await browser.close();
})();
