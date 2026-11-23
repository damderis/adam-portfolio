// Other ERP work at WinWin Food Industries. Sources: the portfolio export README (project catalog,
// numbers from git history) and the 2026 resume. Screens contain real company data, so none are shown.
export const numbers = [
  ['2,323', 'commits across five company repos'],
  ['693', 'pull requests merged'],
  ['~50', 'full Vue pages inside the ERP'],
  ['171', 'new data models (doctypes)'],
];

export const groups = [
  {
    title: 'AI and DevOps',
    items: [
      { name: 'AI Workspace', slug: 'ai-workspace', text: 'An “Ask IT” assistant inside the ERP. It reads ERP records with the current page as context, falls back across model providers, runs a sandboxed tool per reply, generates images from attachments and keeps a task inbox. A ChatGPT-style interface runs through Playwright with per-user conversation isolation and a bridge to Codex.', tags: 'Python · Playwright · LLM APIs' },
      { name: 'Deployment page and Telegram bot', slug: 'deploy-bot', text: 'One deployment page and a Telegram bot for six production servers. A deploy takes about five clicks or one authorised message, and access is restricted by Telegram user ID.', tags: 'Linux · Telegram Bot API · CI' },
      { name: 'Cross-site integration and worker queues', slug: 'worker-queues', text: 'Stock entries and documents pushed between the distribution and manufacturing company sites through background worker queues.', tags: 'Frappe · Redis / RQ' },
      { name: 'Production restores and agent workflows', slug: 'agent-workflows', text: 'Restoring a production backup from S3 into a local site and rewiring its integrations, packaged as reusable Claude Code and Codex workflows alongside project standards and memory.', tags: 'Docker · S3 · Claude Code · Codex' },
      { name: 'AI OCR for purchase orders', slug: 'po-ocr', text: 'Customer purchase orders arrive as PDFs and spreadsheets in many layouts. One parser per layout, multi-PO PDF splitting, and AI OCR for inconsistent formats and salesperson annotations turn them into delivery orders.', tags: 'Python · OCR · PDF parsing' },
      { name: 'Retailer slot-booking bot', slug: 'slot-booking-bot', text: 'A Playwright bot that books delivery slots on a retailer’s supplier portal, where one booking covers many purchase orders. Rebuilt when the portal’s interface changed.', tags: 'Playwright' },
    ],
  },
  {
    title: 'Logistics and fleet',
    items: [
      { name: 'Delivery Trip Planner', text: 'A drag-and-drop board and calendar that assigns delivery orders, returns and collections to lorries, with realtime collaboration and a touch-first mobile view.', tags: 'Vue · Python', link: '/work/delivery-workflow/' },
      { name: 'Driver App', slug: 'driver-app', text: 'A mobile-first app for lorry drivers: trips, proof of delivery, offline sync, an allowance tab, lorry checklists, tyre diagrams per lorry type with photos and last replacement dates, and repair requests with an approval loop. React Native apps for drivers and warehouse terminals add in-app update detection.', tags: 'Vue · React Native' },
      { name: 'Driver Allowance Monitor', slug: 'driver-allowance', text: 'A rules engine for driver and assistant trip allowances: outstation or local by address, per-collection rating, deduction rules and a monthly pool that carries forward.', tags: 'Python' },
      { name: 'Fuel monitoring', slug: 'fuel-monitoring', text: 'Fuel receipts scanned with OCR and checked against GPS tank-level telemetry to flag suspicious refuels.', tags: 'OCR · Telemetry API' },
      { name: 'Pick Lot kiosk', slug: 'pick-lot-kiosk', text: 'A warehouse picking scanner on a shop-floor terminal, with its own kiosk login.', tags: 'Vue · Barcode / QR' },
    ],
  },
  {
    title: 'Manufacturing and quality',
    items: [
      { name: 'Production Planner and manpower', text: 'A machine-line timeline for production orders, plus a manpower checklist that places workers on lines per shift with absences and a printable roster, and a head-count review for output rates.', tags: 'Vue · Python', link: '/work/production-planning/' },
      { name: 'Non-conformance and corrective actions', slug: 'ncr-car', text: 'A five-area quality workflow that posts stock on confirmation and holds it with a real reservation, with per-product actions (dispose, repack, showroom) and a dashboard for repeat offenders. Corrective action requests include a public supplier form; the end-to-end record passed 56 of 56 stages. 1,354 legacy paper reports were imported from Excel.', tags: 'Python · Vue · MariaDB' },
      { name: 'Equipment and maintenance checklists', slug: 'equipment-checklists', text: 'Paper maintenance forms turned into a phone-friendly hub: daily, weekly and monthly sheets, a month grid, a sign-off chain, photo evidence and prints that match the paper form.', tags: 'Vue · Print CSS' },
      { name: 'Facility maintenance requests', slug: 'facility-maintenance', text: 'Requester, approver, engineering manager and engineer in one flow, with a photo annotator, dark mode and a print form.', tags: 'Vue · Python' },
      { name: 'Goods receipt with supplier DO OCR', slug: 'goods-receipt-ocr', text: 'A receiving page that scans supplier delivery orders instead of retyping them.', tags: 'OCR' },
    ],
  },
  {
    title: 'Sales and purchasing',
    items: [
      { name: 'Sales Person Home', slug: 'sales-person-home', text: 'The salesperson’s mobile hub: sales requests, returns, forecasts, customer surveys, stock takes and expense claims, plus GPS visit clock-in with display types and commission rules.', tags: 'Vue · Geolocation' },
      { name: 'Inventory System', slug: 'inventory-system', text: 'A separate purchasing app: quotations, approvals and purchase orders as PDF and Excel, a department-scoped desk, batched approval emails with one-click approve or reject, and material gate passes with a public QR supplier form and partial returns.', tags: 'Frappe app · Python · Vue' },
      { name: 'Back-office batch tools', slug: 'batch-tools', text: 'Batch processing of salespeople’s requests into delivery orders, batch credit notes and journals, statements, reminders and pricing consoles.', tags: 'Python · Vue' },
    ],
  },
];

export const process = [
  'A written standards pack for AI coding agents (UI rules, checklist, mistakes log), packaged as a Claude skill so every page follows the house design.',
  'Around 150 persistent agent memory notes, each a non-obvious lesson with the reason behind it.',
  'One git worktree per feature, each shipped as a pull request.',
  'Playwright end-to-end proof for UI changes at phone and desktop widths, in light and dark mode.',
];
