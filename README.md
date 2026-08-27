# CrossGuard — Real-Time Cross-Border B2B Anti-Fraud Engine
System Design Document (SDD)
Last Updated: 26 Aug 2026
Version: v1.0 (Base)
Author: Michael Lumanga, DevOps Engineer

## Brief Project Description
CrossGuard is a fraud-detection platform for cross-border B2B wire transfers.
A treasury manager logs in, uploads a batch of invoices (PDF), and the system
extracts vendor and banking details from each document, cross-checks them
against known vendor records, and flags each invoice Green (approved), Yellow
(review required), or Red (high risk / blocked). This document describes the
v1 architecture: rule-based verification against a vendor database, with a
clear roadmap toward registry integration and ML-based detection in later
versions.

---

## M — Model (Requirements & Constraints)

### 1. Functional Requirements
- User can log in (v1: seeded credentials; v2 roadmap: real identity provider).
- User can upload a batch of invoices as PDFs (up to 10 at a time in v1).
- System extracts vendor name, bank country, routing/SWIFT number, sender email
  domain, and amount from each PDF.
- System evaluates each invoice against stored vendor records and assigns a
  status: Green (approved), Yellow (review required), Red (blocked).
- User can view the batch as a list with status indicators.
- User can click a Red or Yellow invoice and see a detail view: vendor info,
  the specific mismatch found, and a recommended action (e.g. "Cancel Payment").
- If extraction fails to find a required field, the invoice is automatically
  routed to Yellow ("manual review — extraction incomplete") rather than
  silently guessing.

### 2. Non-Functional Requirements (v1)
- Availability: single DEV environment; no formal uptime SLA at this stage.
- Security: auth required to view the dashboard; secrets never hardcoded in
  source, managed via environment variables and CI/CD secrets.
- Observability: basic structured logging (Render logs) — dedicated
  monitoring stack (Datadog/Grafana) is a v2 roadmap item.
- Cost: low-tier managed services (Vercel, Render, Neon) suited to current
  invoice volume.

### 3. Constraints
- Single engineer building v1, ~10 working days for initial platform.
- Tech stack: TypeScript across frontend and backend.
- Invoice extraction targets structured/semi-structured PDF invoices in v1;
  arbitrary scanned-document OCR is a later phase (see Roadmap).
- No live integration with government corporate registries or SWIFT
  verification networks in v1 — vendor records are maintained internally and
  verification runs against that internal dataset. Registry integration is a
  v2 roadmap item (see Roadmap).

### 4. Success Metrics (v1)
- A merged PR flows automatically through CI → build → DEV deployment with no
  manual steps.
- A new developer can clone the repo and be running the app locally within a
  documented, repeatable process.
- End-to-end flow (upload → extraction → rule evaluation → dashboard) runs
  without manual database intervention.

**Scope note:** Formal traffic/latency/throughput targets are not defined for
v1 — invoice volume is low and manually reviewed at this stage. Section S
covers what changes if volume grows.

### 5. Roadmap (out of scope for v1, tracked intentionally)
- Government corporate registry integration for live vendor verification.
- SWIFT network cross-checks.
- ML-based anomaly detection layered on top of the rule engine.
- OCR for scanned/unstructured invoices.
- Production-grade identity provider (SSO/OAuth) in place of seeded credentials.

---

## A — Architecture (High-Level)

### System Components
- **Frontend** — Next.js (TypeScript), deployed on Vercel. Login screen, invoice
  batch dashboard, invoice detail view.
- **Backend/API** — Express (TypeScript), deployed on Render as a Docker
  container. Handles auth check, invoice ingestion, rule evaluation, data
  retrieval.
- **Database** — PostgreSQL via Neon (managed, shared DEV instance).
- **Local dev database** — PostgreSQL via Docker Compose (per-developer, disposable).

### Data Model (initial)
- `Vendor` — id, name, country, known_bank_country, known_routing_number,
  known_email_domain, tax_id
- `Invoice` — id, vendor_id (nullable if no match found), extracted_bank_country,
  extracted_routing_number, extracted_email_domain, amount, extraction_status
  (complete/incomplete), status (green/yellow/red), created_at
- `Alert` — id, invoice_id, reason, recommended_action

### Invoice Ingestion & Extraction
1. User uploads a batch of PDF invoices (up to 10 in v1).
2. Backend runs each PDF through a text-extraction step (`pdf-parse`) to pull
   raw text content.
3. A field parser looks for expected labels (vendor name, bank country,
   routing/SWIFT number, sender email, amount) within that text. v1 targets
   structured/semi-structured invoice formats where these fields are
   reliably labeled.
4. If a required field can't be found, `extraction_status` is set to
   "incomplete" and the invoice is routed to Yellow for manual review rather
   than guessing.
5. Successfully extracted invoices are passed to the rule engine.

### Rule Engine (v1 — deterministic, explainable)
```
1. Vendor match:     look up Vendor by name/tax_id
                      → no match found              => RED (unknown vendor)
2. Bank country:      extracted_bank_country vs Vendor.known_bank_country
3. Routing number:    extracted_routing_number vs Vendor.known_routing_number
4. Sender domain:      extracted_email_domain vs Vendor.known_email_domain

Scoring:
   bank_country_mismatch AND domain_mismatch        => RED   (classic hijack pattern)
   any single mismatch (country / domain / routing)  => YELLOW (needs human review)
   all fields match                                  => GREEN
```
This is a deterministic, explainable rule set — every status can be traced
back to the specific field(s) that triggered it, which the Alert record
stores for the detail view. This rule layer is the v1 detection method;
ML-based scoring is a v2 addition layered on top, not a replacement.

### Request Flow
```
User (browser)
   → Vercel (Next.js frontend)
       → upload batch → Render (Express API)
           → extract fields from each PDF
           → run rule engine against Vendor records
           → Neon (Postgres) read/write
       ← JSON response (status + reason per invoice)
   ← Dashboard renders traffic-light list
```

### Deployment Architecture
```
GitHub (source, Actions, GHCR)
   → Render (API container, connects to Neon)
   → Vercel (frontend, calls Render's public API URL)
   → Neon (managed Postgres, DEV)
```

---

## T — Tradeoffs

| Decision | Choice | Reasoning |
|---|---|---|
| Frontend framework | Next.js | TypeScript-native, deploys cleanly to Vercel, familiar patterns |
| Backend framework | Express | Lightweight, minimal setup, well understood, fast to iterate on |
| Database | PostgreSQL (Neon) | Relational data fits invoices/vendors well; managed service removes ops overhead |
| API protocol | REST | Simple, sufficient for current endpoint count; GraphQL would be premature complexity |
| Invoice extraction | Template-based text parsing (v1) vs. full OCR/ML | Full OCR is a larger investment better justified once invoice formats diversify; template parsing covers the common case now |
| Fraud detection | Deterministic rule engine (v1) vs. ML from day one | Rules are explainable and fast to ship; ML needs a labeled dataset this system doesn't have yet — natural v2 addition once real usage data exists |
| Deployment (API) | Docker container on Render | Portable, avoids vendor lock-in, matches standard containerized deployment practice |
| Deployment (frontend) | Vercel native (no Docker) | Vercel's native build pipeline is simpler and standard for Next.js; Docker adds no benefit here |
| Auth | Seeded credentials (v1) | Real identity provider (e.g. Clerk/Auth0) is a near-term roadmap item, not needed to validate the core workflow first |

---

## S — Scale (planned path, not built in v1)

Current volume doesn't justify this investment yet. As usage grows, the
planned scaling path is:
- Read replicas / connection pooling on Postgres as invoice volume grows.
- Queue-based processing (e.g. SQS/RabbitMQ) once batch sizes grow beyond a
  few hundred invoices, so evaluation doesn't block the request/response cycle.
- Caching vendor lookups (Redis) once the same vendors are checked repeatedly
  at meaningful frequency.
- Rate limiting on the upload endpoint.

These are sequenced by trigger condition (e.g. "add read replicas once p99
query latency exceeds X"), not built speculatively ahead of need.

---

## E — Execution Plan (DevOps, Hosting, CI/CD)

This is the core of what this project demonstrates.

### Environments
- **Local** — Docker Compose Postgres, app run natively via `pnpm dev`.
- **DEV** — Vercel (frontend) + Render (API, Docker) + Neon (shared DB).

### Repositories (GitHub Org: SMARTCCMDEV)
- `smartccm-crossguard-web` — Next.js frontend
- `smartccm-crossguard-api` — Express backend

### CI/CD Pipeline (per merge to `develop`)
```
Push / PR → develop
   → Lint (ESLint)
   → Typecheck (tsc --noEmit)
   → Unit tests (Vitest)
   → Run Prisma migrations against Neon DEV
   → Build Docker image (API)
   → Push image to GHCR
   → Trigger Render deploy hook
   → Vercel auto-deploys frontend from the same merge
```

### Task Tracking
ClickUp workspace, one list per component (Frontend / Backend / Infra), status
flow: Backlog → In Development → Code Review → QA → Released.

### Access Control (see separate Access-Control Matrix doc)
- Neon DEV credentials held only in GitHub Actions secrets + Render env vars.
- Schema changes only via committed Prisma migration files, applied through CI.

---

## R — Resilience (v1)

- **Backups**: Neon provides automatic point-in-time recovery on its managed
  tier — no custom backup process needed at this stage.
- **Rollback**: Render retains previous deploys; rollback is a dashboard
  action, documented in the runbook.
- **Error handling**: API returns clear error responses on invalid or
  unparseable invoice data rather than failing silently or guessing values.
- **Deferred to a later phase**: load balancers, multi-region failover,
  circuit breakers, formal SLOs — not yet justified at current scale, listed
  in the Roadmap (Section M.5) rather than treated as gaps.
