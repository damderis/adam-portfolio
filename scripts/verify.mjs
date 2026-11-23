import { readFile, access, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { projects } from '../src/data/projects.js';

// Read-only source checks; set VERIFY_URL to also check every route and local asset over HTTP.
const routes = ['/', ...projects.map(p => `/work/${p.slug}/`)];
assert.equal(new Set(projects.map(p => p.slug)).size, projects.length, 'Unique case studies');
assert.ok(projects.length >= 6, 'At least six case studies');
for (const project of projects) {
  const content = await readFile(`src/pages/work/${project.slug}.md`, 'utf8');
  assert.match(content, new RegExp(`slug: ${project.slug}`));
  assert.match(content, /layout: ..\/..\/layouts\/CaseStudy.astro/);
  for (const field of ['problem', 'role', 'hard', 'notes']) assert.match(content, new RegExp(`\\n${field}:`), `${project.slug} has ${field}`);
  assert.ok(content.split(/\s+/).length > 240, `${project.slug} has substantive content`);
  assert.ok(!/C:\\|localhost|@\w+\.com|WWF-Sdn|damwin|yukafood/i.test(content + JSON.stringify(project)), `${project.slug} has no internal source details`);
  assert.ok(project.hard && project.summary && project.stack, `${project.slug} has homepage copy`);
  const exists = async base => { for (const ext of ['png', 'webp']) { try { await access(`src/assets/images/${base}.${ext}`); return true; } catch {} } return false; };
  if (project.shots) assert.ok(await exists(project.slug === 'driveboard' ? 'driveboard' : `${project.slug}-desktop`), `${project.slug} desktop capture`);
  if (project.shots?.mobile) assert.ok(await exists(`${project.slug}-mobile`), `${project.slug} mobile capture`);
}
for (const file of (await readdir('src/pages/work/winwin')).filter(f => f.endsWith('.md'))) {
  const content = await readFile(`src/pages/work/winwin/${file}`, 'utf8');
  assert.match(content, /layout: ..\/..\/..\/layouts\/ErpCase.astro/, `${file} uses the ERP layout`);
  for (const field of ['title', 'group', 'deck', 'problem', 'role', 'hard', 'stack']) assert.match(content, new RegExp(`\\n${field}:`), `${file} has ${field}`);
  assert.ok(!/C:\\|localhost|@\w+\.com|WWF-Sdn|damwin|yukafood|RM ?\d/i.test(content), `${file} has no internal source details or amounts`);
}
const home = await readFile('src/pages/index.astro', 'utf8');
for (const marker of ['aria-live="polite"', 'data-direction="-1"', 'data-direction="1"', 'book-tabs', 'pushState', 'popstate', '(min-width: 1001px)', 'pointercancel']) assert.ok(home.includes(marker), `homepage has ${marker}`);
const css = await readFile('src/styles/global.css', 'utf8');
for (const marker of ['prefers-reduced-motion', 'focus-visible', '[hidden]', '@media (min-width: 1001px)']) assert.ok(css.includes(marker), `CSS has ${marker}`);
assert.ok(!/rotate\((?!Y|180deg)/.test(css), 'No tilted elements (180deg flips for vertical text are fine)');
assert.equal((css.match(/!important/g) || []).length, 5, '!important only for [hidden], reduced motion and print');
assert.deepEqual((await readdir('src/pages/work')).filter(f => f.endsWith('.md')).sort(), projects.map(p => `${p.slug}.md`).sort());

if (process.env.VERIFY_URL) {
  const origin = new URL(process.env.VERIFY_URL);
  const localLinks = new Set(routes);
  for (const route of routes) {
    const response = await fetch(new URL(route, origin));
    assert.equal(response.status, 200, `${route} responds successfully`);
    const html = await response.text();
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${route} has one h1`);
    assert.match(html, /id="main"/);
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[^" ]*)"/g)) localLinks.add(href);
    for (const [, set] of html.matchAll(/srcset="([^"]+)"/g)) set.split(',').forEach(entry => localLinks.add(entry.trim().split(' ')[0]));
  }
  for (const link of localLinks) {
    const response = await fetch(new URL(link, origin));
    assert.equal(response.status, 200, `Local route/asset ${link} responds successfully`);
  }
  console.log(`HTTP verified ${routes.length} routes and ${localLinks.size} local destinations.`);
}
console.log('Source verification passed: five studies with at-a-glance fields, images, privacy patterns, desktop book and stacked layout markers.');
