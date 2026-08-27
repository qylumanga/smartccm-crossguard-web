# smartccm-crossguard-web

Frontend for CrossGuard, built with Next.js (App Router), TypeScript, and
Tailwind CSS. This is the v1 client-side build — data is simulated via
`localStorage` so the full flow (login → upload → verification → alert
detail) is interactive without a backend yet.

## Run locally

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000`. Demo login: `treasury@smartccm.dev` /
`crossguard-demo`.

## Structure

```
app/
  page.tsx            → landing + login
  dashboard/page.tsx   → verification queue (protected)
components/            → all UI, no business logic or mock data inline
lib/
  types.ts             → shared types, match the SDD data model
  mockVendors.ts        → simulated vendor registry (→ GET /api/vendors)
  sampleBatch.ts         → simulated PDF extraction output (→ POST /api/invoices/extract)
  ruleEngine.ts           → the v1 rule engine from the SDD, pure function
  store.ts                 → localStorage persistence + simulated auth
```

## Swapping in the real backend

Only `lib/store.ts`, `lib/mockVendors.ts`, and `lib/sampleBatch.ts` need to
change once the API exists — none of the components read from
`localStorage` or mock data directly. `ruleEngine.ts` is a pure function and
can move server-side unchanged once extraction happens via a real API route.
