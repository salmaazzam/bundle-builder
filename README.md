# Bundle Builder

A multi-step security system bundle builder with a live review panel. Built with React + TypeScript (frontend) and Express (backend).

## Quick Start

Open two terminals:

```bash
# Terminal 1 — backend (port 3001)
cd backend
npm install
npm run dev

# Terminal 2 — frontend (port 5173)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Architecture

```
bundle-builder/
├── backend/
│   ├── src/
│   │   ├── index.js          Express app, CORS, routes
│   │   └── routes/products.js GET /api/products
│   └── data/
│       └── products.json     Product catalog (source of truth)
└── frontend/
    └── src/
        ├── types/index.ts    Shared TypeScript interfaces
        ├── store/bundleStore.ts  Zustand store (selections, state)
        ├── hooks/useProducts.ts  Fetch + init defaults
        ├── assets/
        │   └── icons/            SVG icons (accordion, camera, fast-shipping, plan, protection, satisfaction-badge, sensor)
        └── components/
            ├── Builder/          4-step accordion wrapper
            ├── StepAccordion/    Individual accordion step
            ├── ProductCard/      Product card (camera/sensor/plan/accessory)
            ├── QuantityStepper/  − qty + control
            ├── VariantSelector/  Color chip row
            ├── ReviewPanel/      Sticky right-side summary
            └── ReviewItem/       Single review line item
```

## Key Decisions

**State management:** Zustand with `persist` middleware. Selections auto-save to `localStorage` on every change. "Save my system for later" shows a confirmation — data is always persisted. On reload the state is restored exactly.

**Variant model:** Each variant has its own quantity slot (`selections[productId][variantId]`). Switching color chips changes the _active_ variant; the stepper reads/writes that variant's count. Review panel renders one line per variant with qty > 0. Non-variant products use `'default'` as the variant key.

**Plans (single-select):** Step 2 products have `singleSelect: true`. Selecting a plan zeroes all others in the step. No quantity stepper — just selected/unselected state.

**Initial state:** `products.json` carries `defaultQty` and `defaultSelected` fields. On first load (empty store), `initDefaults` seeds the store so the review panel pre-populates — matching the design exactly.

**Prices in review:** Review shows line totals (`qty × unit_price`). Product cards show unit prices.

**API proxy:** Vite dev server proxies `/api` → `http://localhost:3001`, eliminating CORS issues entirely.

**Images:** Placeholder images via `placehold.co`. In production, replace `image` URLs in `products.json` with actual Wyze CDN assets.

## What I'd add with more time

- Skeleton loaders during product fetch
- Animated accordion open/close
- Mobile-optimized review panel (collapsible bottom drawer)
- Real product images
- Quantity sync animation when review stepper is used
