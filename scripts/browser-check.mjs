import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';

// Use installed automation or an external temporary installation; no project dependency.
const require = createRequire(import.meta.url);
const candidates = [process.env.PLAYWRIGHT_MODULE,
  path.join(tmpdir(), 'adam-portfolio-browser/node_modules/playwright/index.mjs'),
  path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs')].filter(Boolean);
let modulePath;
try { modulePath = require.resolve('playwright'); } catch { modulePath = candidates.find(existsSync); }
if (!modulePath) throw new Error('Install Playwright outside this project and set PLAYWRIGHT_MODULE to its index.mjs. See README.');
const { chromium } = await import(pathToFileURL(modulePath).href);
const installedChromium = path.join(homedir(), 'AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (existsSync(installedChromium) ? installedChromium : undefined) });
const origin = process.env.VERIFY_URL || 'http://127.0.0.1:4321';
const output = 'artifacts/browser';
await mkdir(output, { recursive: true });
const slugs = ['bokkeh', 'momenloka', 'delivery-workflow', 'production-planning', 'aifiqh', 'amjohor', 'driveboard', 'little-things'];
const SPREADS = slugs.length + 3; // contents, projects, about, back cover
const results = [];

// Scroll through the page so lazy images load, then return to the top.
const loadAll = async page => {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(50); }
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => Promise.all([...document.images].filter(i => i.checkVisibility()).map(i => i.decode().catch(() => {}))));
  await page.evaluate(() => scrollTo(0, 0));
};
const common = async (page, label) => {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: no horizontal scroll`);
  assert.equal(await page.locator('h1').count(), 1, `${label}: exactly one h1`);
  const broken = await page.evaluate(() => [...document.images].filter(i => i.checkVisibility() && !(i.complete && i.naturalWidth > 0)).map(i => i.currentSrc));
  assert.deepEqual(broken, [], `${label}: visible images load`);
  const tiny = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => el.checkVisibility() && !el.closest('.sr-only')
    && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 12).map(el => el.textContent.trim().slice(0, 30)));
  assert.deepEqual(tiny, [], `${label}: no visible text under 12px`);
};

try {
  if (process.argv.includes('--capture')) await import('./capture-products.mjs');
  if (process.argv.includes('--capture-only')) process.exit(0);
  for (const [width, height] of [[320, 640], [390, 844], [768, 1024], [1024, 768], [1280, 720], [1280, 800], [1366, 650], [1440, 900], [1536, 864]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/');
    const label = `${width}x${height}`;
    if (width >= 1001) assert.equal(await page.locator('.book.is-closed').count(), 1, `${label}: first visit shows the cover`);
    await loadAll(page);
    await common(page, `home ${width}`);

    if (width >= 1001) {
      assert.equal(await page.locator('.book.is-book').count(), 1, `${label}: book built`);
      await page.waitForFunction(() => !document.querySelector('.book.is-closed'), null, { timeout: 4000 });
      assert.match(await page.locator('.book-tabs a[aria-current]').textContent(), /Index/, `${label}: cover opens itself to the contents`);
      const next = page.locator('[data-direction="1"]');
      for (let spread = 0; spread < SPREADS; spread++) {
        if (spread) { await next.click(); await page.waitForTimeout(520); }
        // Content must fit the page and stay clear of the folio (absolutely positioned, so scrollHeight misses it).
        const fit = await page.evaluate(() => [...document.querySelectorAll('.sheet-face:not([aria-hidden]) > .paper')].filter(p => {
          if (p.scrollHeight > p.clientHeight + 1) return true;
          const folio = p.querySelector(':scope > .folio');
          if (!folio || !folio.checkVisibility()) return false;
          const last = [...p.children].filter(c => c !== folio && c.checkVisibility()).pop();
          return last && last.getBoundingClientRect().bottom > folio.getBoundingClientRect().top - 4;
        }).map(p => p.className));
        assert.deepEqual(fit, [], `${label} spread ${spread}: content fits the page`);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label} spread ${spread}: no horizontal scroll`);
        const bar = await page.locator('.book-controls').boundingBox();
        assert.ok(bar.y + bar.height <= height, `${label} spread ${spread}: page controls visible without scrolling (${bar.y + bar.height})`);
        if (spread < SPREADS - 1) assert.match(await next.textContent(), /Next: [A-Z]/, `${label}: Next names the next spread`);
        assert.equal(await page.locator('.book-tabs a[aria-current]').count(), 1, `${label} spread ${spread}: one current tab`);
        await page.screenshot({ path: `${output}/home-${width}-spread-${spread}.png` });
      }
      assert.ok(await next.isDisabled(), `${label}: Next disabled on the last spread`);
      assert.match(page.url(), /#journey$/, `${label}: URL tracks the spread`);
      assert.equal(await page.locator('.book.is-back').count(), 1, `${label}: the last page is the back cover`);
      const blocked = await page.evaluate(() => [...document.querySelectorAll('.book-tabs a, .book-controls button:not(:disabled)')].filter(el => {
        const r = el.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return r.height && r.top >= 0 && r.bottom <= innerHeight && !(hit && (el === hit || el.contains(hit)));
      }).map(el => el.textContent.trim()));
      assert.deepEqual(blocked, [], `${label}: tabs and controls are clickable on the back cover`);
      await page.goBack(); await page.waitForTimeout(520);
      assert.match(await page.locator('.book-tabs a[aria-current]').textContent(), /About/, `${label}: Back steps to the previous spread`);
      await page.locator('.book-tabs a[title="MomenLoka"]').click(); await page.waitForTimeout(520);
      assert.match(page.url(), /#page-momenloka$/);
      await page.keyboard.press('ArrowRight'); await page.waitForTimeout(520);
      assert.match(page.url(), /#page-delivery-workflow$/, `${label}: arrow keys turn pages`);
      await page.goto(`${origin}/#page-momenloka`); await page.waitForTimeout(300);
      assert.equal(await page.locator('.book-tabs a[aria-current]').getAttribute('title'), 'MomenLoka', `${label}: deep link opens its spread`);
      await page.goto(`${origin}/#cover`); await page.waitForTimeout(700);
      assert.ok(await page.evaluate(() => { const f = document.querySelector('.sheet-face:not([aria-hidden]) .cover-frame'); return f && f.scrollHeight <= f.clientHeight + 1; }), `${label}: cover content fits its frame`);
      await page.screenshot({ path: `${output}/home-${width}-cover.png` });
      await page.setViewportSize({ width: 800, height });
      await page.waitForTimeout(100);
      assert.equal(await page.locator('.book.is-book').count(), 0, `${label}: book tears down below 1001px`);
      assert.equal(await page.locator('.book > .spread').count(), SPREADS, `${label}: stacked sections restored`);
      results.push(`${label}: cover intro opens itself, cover and every spread (incl. back cover) fit with Next visible, tabs, URL/Back, keys, deep link, resize teardown`);
    } else {
      assert.equal(await page.locator('.book.is-book').count(), 0, `${label}: no page-turning`);
      assert.equal(await page.locator('.book-controls:visible, .book-tabs:visible').count(), 0, `${label}: no book controls`);
      for (const slug of slugs) assert.ok(await page.locator(`#title-${slug}`).isVisible(), `${label}: ${slug} visible in the stacked page`);
      if (width < 700) assert.equal(await page.locator('.shot-desktop:visible').count(), 0, `${label}: phones show mobile captures only`);
      await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
      results.push(`${label}: stacked layout, all ${slugs.length} projects, no book controls${width < 700 ? ', mobile captures only' : ''}`);
    }

    for (const slug of slugs) {
      await page.goto(`${origin}/work/${slug}/`);
      await loadAll(page);
      await common(page, `${slug} ${width}`);
      assert.equal(await page.locator('.back-link').getAttribute('href'), `/#page-${slug}`);
      assert.equal(await page.locator('.glance > div').count(), 3, `${slug}: at a glance`);
      if (width < 700 && ['bokkeh', 'momenloka'].includes(slug)) {
        assert.match(await page.locator('.case-image img').first().evaluate(i => i.currentSrc), /-mobile/, `${slug} ${width}: phone gets the mobile capture`);
      }
      if (slug === 'bokkeh' || slug === 'delivery-workflow') await page.screenshot({ path: `${output}/${slug}-${width}.png`, fullPage: true });
    }
    assert.deepEqual(errors, [], `${label}: no page errors`);
    console.log(`${label} passed`);
    await context.close();
  }

  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await reduced.newPage(); await page.goto(origin + '/');
  assert.ok(await page.locator('.book-sheet').evaluateAll(sheets => sheets.every(s => parseFloat(getComputedStyle(s).transitionDuration) === 0)));
  await page.getByRole('button', { name: /^Next/ }).click();
  assert.match(page.url(), /#page-bokkeh$/);
  results.push('Reduced motion: no turn animation, navigation still works');
  await reduced.close();

  const fallback = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const plain = await fallback.newPage(); await plain.goto(origin + '/');
  assert.equal(await plain.locator('.spread:visible').count(), SPREADS);
  assert.equal(await plain.locator('.book-controls:visible, .book-tabs:visible').count(), 0);
  assert.ok(await plain.locator('.contents a[href^="/work/"]').count() >= slugs.length);
  results.push('No JavaScript: all sections, contents and every case-study link readable at desktop width');
  await fallback.close();

  await writeFile(`${output}/results.json`, JSON.stringify({ checkedAt: new Date().toISOString(), origin, results }, null, 2) + '\n');
  console.log(results.join('\n'));
} finally { await browser.close(); }
