# Bundle Builder

Multi-step bundle builder with live review panel.

## Structure

```
bundle-builder/
├── frontend/   # React + Vite + TypeScript
└── backend/    # Node + Express (serves products.json)
```

## Running locally

### Backend

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Decisions & tradeoffs

- Backend is a thin Express server serving a static JSON file. Swap `data/products.json` to connect a real DB.
- Frontend fetches from `http://localhost:3001/api/products` in dev; set `VITE_API_URL` env var for production.
- Client-side state managed with [state solution TBD].
- `localStorage` used for "Save my system for later" persistence.
