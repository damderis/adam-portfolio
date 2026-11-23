import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';

// Anonymous, read-only public examples. Never submit booking or RSVP forms.
const require = createRequire(import.meta.url);
let modulePath;
try { modulePath = require.resolve('playwright'); } catch {
  modulePath = [process.env.PLAYWRIGHT_MODULE,
    path.join(tmpdir(), 'adam-portfolio-browser/node_modules/playwright/index.mjs'),
    path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs')].filter(Boolean).find(existsSync);
}
if (!modulePath) throw new Error('Set PLAYWRIGHT_MODULE to an installed Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(modulePath).href);
const installed = path.join(homedir(), 'AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (existsSync(installed) ? installed : undefined) });
await mkdir('artifacts/browser', { recursive: true });
const records = [];
const previousRecords = await readFile('src/assets/images/capture-provenance.json', 'utf8').then(JSON.parse).catch(() => []);
const ready = async page => {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter(i => {
      const r = i.getBoundingClientRect();
      return r.width && r.height && r.bottom > 0 && r.top < innerHeight;
    }).map(i => i.decode()));
  });
  await page.waitForTimeout(1200); // Allow the product's own entrance transitions to settle.
};
try {
  for (const product of ['bokkeh', 'momenloka']) {
    for (const [device, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: device === 'mobile', hasTouch: device === 'mobile', reducedMotion: 'reduce' });
      const page = await context.newPage();
      const root = product === 'bokkeh' ? 'https://bokkeh.app' : 'https://momenloka.com';
      try {
        await page.goto(root, { waitUntil: 'networkidle', timeout: 60000 });
        // Inspect and retain the public route inventory as capture evidence.
        const links = await page.locator('a[href]').evaluateAll(nodes => nodes.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') })));
         const homepage = page.url();
         const homepageFile = `src/assets/images/${product}-${device}.png`;
         await ready(page);
         await page.screenshot({ path: homepageFile, animations: 'disabled' });
         await page.screenshot({ path: `artifacts/browser/${product}-${device}-homepage-review.png`, animations: 'disabled' });
         let purpose, interaction;
        if (product === 'bokkeh') {
          await page.goto(new URL('/explore', root).href, { waitUntil: 'networkidle' });
          await page.getByRole('link', { name: 'View Page', exact: true }).click();
          await page.getByText('Example vendor page · Demo', { exact: true }).waitFor();
          await page.getByRole('button', { name: 'Book a Session', exact: true }).click();
          await page.getByText('Select a Service', { exact: true }).waitFor();
          purpose = 'Demo vendor booking: real public service selection, durations and pricing. No booking submitted or customer data entered.';
          interaction = 'Homepage → Explore Vendors → labeled demo Bokkeh Studio → Book a Session. Booking panel is intentional product UI, not an overlay removed for capture.';
        } else {
          const preview = links.find(a => a.href?.includes('/templates/') && a.href.endsWith('/preview'));
          if (!preview) throw new Error('No public invitation template preview found');
          await page.goto(new URL(preview.href, root).href, { waitUntil: 'networkidle' });
          await page.getByText('IKATAN KELUARGA', { exact: true }).waitFor();
          purpose = 'Actual public Ikatan Keluarga invitation template with illustrative names, artwork and event details; no live guest invitation or RSVP records.';
          interaction = 'Explored homepage below hero and followed its public invitation template preview link. Invitation cover is the product, retained as displayed.';
        }
        await ready(page);
         const detailFile = `src/assets/images/${product}-${device}-detail.png`;
         await page.screenshot({ path: detailFile, animations: 'disabled' });
         await page.screenshot({ path: `artifacts/browser/${product}-${device}-detail-review.png`, animations: 'disabled' });
         records.push({ file: homepageFile, detailFile, requestedURL: root, homepageURL: homepage, finalURL: page.url(), capturedAt: new Date().toISOString(), viewport: { width, height }, crop: { x: 0, y: 0, width, height }, purpose, interaction, preparation: 'Fresh anonymous context; homepage captured before deeper public flow; network idle; fonts ready; visible images decoded; reduced motion; entrance transitions settled. No overlays dismissed, DOM content changed, authentication or form submission.', publicLinksExplored: links.filter(l => /explore|templates|docs/.test(l.href)), review: 'Homepage asset is the primary image; detail asset follows it in case-study content.' });
        console.log(`Captured ${product} ${device}: ${page.url()}`);
      } catch (error) {
        // Retain authentic local imagery on access failures; never manufacture product UI.
        const file = `src/assets/images/${product}-${device}.png`;
        records.push({ ...previousRecords.find(record => record.file === file), file, requestedURL: root, attemptedAt: new Date().toISOString(), retainedExistingAsset: true, reason: String(error), fallbackPurpose: 'Existing authentic local product capture retained; original source metadata preserved.' });
        console.error(`Retained ${product} ${device}: ${error}`);
      } finally { await context.close(); }
    }
  }
  await writeFile('src/assets/images/capture-provenance.json', JSON.stringify(records, null, 2) + '\n');
} finally { await browser.close(); }
