# Pharma Care Gap — Codebase Understanding

## 1. Project Overview & Business Domain

**Project Name:** Care Gap Rule Authoring Platform
**Organization:** ProcDNA Analytics Pvt. Ltd
**Purpose:** AI-assisted generation, refinement, and validation of evidence-grounded business rules for identifying clinical care gaps in patient populations.

**Business Problem Solved:**
Translating clinical guidelines into executable business rules that accurately identify patients with unmet clinical needs (care gaps) in claims, EMR, and lab data traditionally takes 8–13 weeks through multiple handoffs (Medical Affairs → Scientists → Consultants → Analytics → SQL developers). This platform reduces it to minutes through live, interactive rule authoring.

**Primary Use Case:**
Identify IBD (Inflammatory Bowel Disease) patients with chronic/recurrent corticosteroid (OCS) overuse who should be initiated on biologic therapy. The system uses a composite metric framework (M1–M7) to flag eligible patients across HCP, Account, Territory, and Demographic levels.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.5 (App Router) |
| UI | React 18.3.1 |
| Language | TypeScript 5.5.4 |
| Styling | Tailwind CSS 3.4.10 |
| In-Browser DB | sql.js 1.12.0 (SQLite via WASM) |
| CSV Parsing | Papa Parse 5.4.1 |
| Excel Parsing | XLSX 0.18.5 |
| Icons | Lucide React 0.441.0 |
| CSS Utils | clsx 1.2.1, tailwind-merge 2.5.2 |
| Fonts | DM Serif Display (display), Inter (body) |
| Deployment | Docker (standalone Next.js build) |
| Backend | Mock API only (no real backend) |

---

## 3. Project Structure

```
pharma-care-gap/
├── app/                             # Next.js App Router
│   ├── page.tsx                     # Landing/login page
│   ├── layout.tsx                   # Root layout
│   ├── globals.css                  # Global styles
│   ├── error.tsx                    # Error boundary
│   ├── not-found.tsx                # 404 page
│   └── care-gaps/
│       ├── page.tsx                 # Upload + care gap selector
│       ├── _components/
│       │   ├── CareGapUploadClient.tsx
│       │   └── CareGapSelectorClient.tsx
│       └── [id]/
│           ├── page.tsx             # Rule details layout
│           ├── _components/
│           │   └── RuleDetailsClient.tsx
│           └── insights/
│               ├── page.tsx
│               └── _components/
│                   └── InsightsClient.tsx
│
├── components/
│   ├── auth/LoginModal.tsx
│   ├── layout/AppHeader.tsx, Breadcrumb.tsx
│   ├── care-gap-selector/           # Care gap list, cards, filters
│   ├── rule-details/                # Rule editing panel components
│   ├── insights/                    # Analytics dashboard components
│   └── ui/                          # Button, Card, Badge, Tabs, etc.
│
├── hooks/
│   ├── useCareGaps.ts               # Fetch & filter care gap list
│   ├── useRulePackage.ts            # Fetch rule details, manage export
│   ├── useParameterState.ts         # Manage configurable parameters
│   └── usePatientDb.ts              # SQLite DB + analytics queries
│
├── lib/
│   ├── api/                         # API functions (all mocked)
│   ├── db/                          # SQLite singleton, ruleEngine, kpiEngine
│   ├── mocks/                       # Mock data for all API calls
│   ├── types/                       # TypeScript domain types
│   └── utils/                       # cn, delay, aggregations, parseExcel
│
├── public/
│   ├── background_image.png
│   ├── ProcDNA_Logo.svg
│   └── demo-patients.csv            # Auto-loaded demo dataset
│
└── Config: package.json, tsconfig.json, tailwind.config.ts,
            next.config.js, .env.local, Dockerfile, docker-compose.yml
```

---

## 4. Screens & Pages

### A. Landing / Login (`/`)
**File:** [app/page.tsx](app/page.tsx)

- Hero page with "Care Gap Rule Authoring" tagline and ProcDNA branding
- Feature pills: Evidence-Grounded, Live Parameter Editing, Impact Analysis, Export Ready
- "Get Started" opens a login modal
- Demo credentials: `admin` / `admin123`
- After login: full-screen loader → routes to `/care-gaps`

### B. Upload & Care Gap Selector (`/care-gaps`)
**File:** [app/care-gaps/page.tsx](app/care-gaps/page.tsx)

- **Step 1:** Drag-and-drop file upload (PDF, DOCX, PPT, TXT) with file preview
- **Step 2:** Optional reference URL input
- **Processing:** Simulates AI analysis (1.8s) + rule generation (2.5s) → redirects to `/care-gaps/{id}`
- **After upload:** Shows list of care gaps with:
  - Left sidebar: Filters (therapy area, status, search)
  - Main area: Grid of `CareGapCard` components — each links to the detail page

### C. Rule Details & Editing (`/care-gaps/[id]`)
**File:** [app/care-gaps/[id]/page.tsx](app/care-gaps/%5Bid%5D/page.tsx)
**Client:** [app/care-gaps/[id]/_components/RuleDetailsClient.tsx](app/care-gaps/%5Bid%5D/_components/RuleDetailsClient.tsx)

Two-column layout:

**Left Panel — Scrollable rule definition with 7 sticky tabs:**
1. Summary — Clinical background & sources
2. Eligibility — Inclusion criteria (M1, M2)
3. Exclusions — Patient exclusions (M3)
4. Temporal — Time-based rules (M4–M6)
5. Data — Required data elements
6. Evidence — Clinical evidence mapping
7. Logic — Composite rule logic

Scroll-spy: Tab highlights auto-update as user scrolls through sections.

**Right Panel — Configurable Parameters Panel:**
- Dropdowns for each M1–M6 threshold
- Real-time impact summary preview
- "Generate Insights" button → stores params to localStorage, routes to insights

Export button in header downloads the rule as a PDF.

### D. Analytics & Insights Dashboard (`/care-gaps/[id]/insights`)
**File:** [app/care-gaps/[id]/insights/page.tsx](app/care-gaps/%5Bid%5D/insights/page.tsx)
**Client:** [app/care-gaps/[id]/insights/_components/InsightsClient.tsx](app/care-gaps/%5Bid%5D/insights/_components/InsightsClient.tsx)

- CSV/Excel file uploader; demo dataset (`public/demo-patients.csv`) auto-loaded on mount
- SQLite database runs in the browser; re-queries on every parameter change (350ms debounce)
- Top row: Global KPI cards (total patients, overuse counts, rates)
- **6 aggregation tabs:**
  1. HCP Level — Prescriber rankings by M7 overuse rate
  2. Account Level — Sales territory account performance
  3. Geography Level — Territory / region aggregation
  4. Demographic Level — Age band × gender breakdown
  5. Payer Level — (Stub, unavailable)
  6. Temporal Trend — (Stub, unavailable)
- Each table: Sortable columns, 10 rows/page pagination, color-coded risk badges
- Right panel: Parameter adjustment (same as rule details) with live recalculation

---

## 5. Domain Model (Key Types)

### CareGap ([lib/types/careGap.ts](lib/types/careGap.ts))
```typescript
interface CareGap {
  id: string                      // e.g. "ibd-biologic-initiation"
  title: string
  description: string
  therapyArea: TherapyArea        // Gastroenterology | Endocrinology | Rheumatology | ...
  status: CareGapStatus           // Draft | Active | Archived
  guidelineVersion: string
  lastUpdated: string
  evidenceConfidence: number      // 0–100
}
```

### RulePackage ([lib/types/rulePackage.ts](lib/types/rulePackage.ts))
Full rule definition:
```typescript
interface RulePackage {
  careGapId, careGapTitle, careGapDescription, status, guidelineVersion,
  lastGenerated, evidenceConfidence,
  clinicalSummary: { text: string; sources: string[] }
  eligibilityCriteria: EligibilityCriterion[]
  exclusionCriteria:  ExclusionCriterion[]
  temporalRules:      TemporalRule[]
  dataRequirements:   DataRequirement[]
  evidenceMapping:    EvidenceMapping[]
  ruleLogic:          RuleLogicStep[]
  evidenceReferences: EvidenceReference[]
  impactSummary:      ImpactSummary
}
```

### ParameterValues ([lib/types/parameters.ts](lib/types/parameters.ts))
Configurable thresholds:
```typescript
interface ParameterValues {
  // M1 — IBD Cohort denominator
  measurementMonths: number        // 6–36 months rolling window
  ibdMinClaims: number             // 1–3 min IBD diagnosis claims
  ibdGapDays: number               // 14–90 max gap between claims

  // M2 — Chronic OCS Use
  ocsDurationThreshold: number     // 60–180 cumulative OCS days

  // M3 — High-Dose OCS
  highDoseDurationDays: number     // 30–90 consecutive days
  highDoseMg: number               // 5–20 mg/day threshold
  highDoseCumulativeMg: number     // 300–900 mg cumulative

  // M4 — Repeat OCS Course
  courseGapDays: number            // 14–60 days gap = new course

  // M5 — Steroid Taper Failure
  taperFailMonths: number          // 1–6 months window
  taperDoseThresholdMg: number     // 5–15 mg threshold

  // M6 — Post-Discontinuation Relapse
  relapseWindowMonths: number      // 1–6 months post-OCS

  // M8/M9 — Additional (less exposed)
  transitionWindowDays: number
  boneAssessYears: number
}
```

### Insights Types ([lib/types/insights.ts](lib/types/insights.ts))
```typescript
interface GlobalKpis {
  totalPatients, ocsUse, ocsUseRate, ocsOveruse, ocsOveruseRate,
  m7Rate, chronicOcs, chronicOcsRate, highDose, highDoseRate,
  repeatCourse, repeatCourseRate, taperFailure, taperFailureRate,
  relapse, relapseRate
}

interface HcpAgg { npi, name, specialty, account, territory, region,
                   totalPatients, ocsOveruse, m7Rate, ... }
interface AccountAgg { ... }
interface TerritoryAgg { ... }
interface DemographicAgg { ageBand, gender, totalPatients, m7Rate, ... }
```

---

## 6. Business Logic — Care Gap Metric Framework (M1–M7)

| Metric | Name | Default Threshold | Meaning |
|---|---|---|---|
| M1 | IBD Cohort | ≥2 claims, ≥30 days apart | Patient qualifies for denominator |
| M2 | Chronic OCS Use | ≥90 cumulative OCS days | Chronic steroid exposure |
| M3 | High-Dose OCS | ≥10 mg/day for ≥60 days OR ≥600 mg cumulative | High-dose exposure |
| M4 | Repeat OCS Course | >1 distinct course in 12 months | Recurring steroid dependency |
| M5 | Steroid Taper Failure | Unable to taper below threshold within window | Steroid-dependent |
| M6 | Post-Discontinuation Relapse | New IBD claim within 3 months of OCS end | Relapse after stopping |
| M7 | Composite Flag (Primary KPI) | M2 OR M3 OR M4 OR M5 OR M6 | Any overuse flag = care gap patient |

All thresholds in M1–M6 are configurable via the Parameters Panel. M7 is always derived from the others.

---

## 7. In-Browser SQLite Database

**Why:** Allows instant analytics without a backend. Users upload patient data and get live aggregations.

**Setup** ([lib/db/sqlite-singleton.ts](lib/db/sqlite-singleton.ts)): Loads `sql.js` (SQLite compiled to WebAssembly) from CDN as a singleton.

**Schema** ([lib/db/ruleEngine.ts](lib/db/ruleEngine.ts)):
```sql
CREATE TABLE patient_fact (
  Pat_ID TEXT, NPI TEXT, Specialty TEXT, Account TEXT,
  Territory TEXT, Region TEXT, Pat_Age INTEGER, Pat_Gender TEXT,
  M1 REAL, M2 REAL, M3 REAL, M4 REAL, M5 REAL, M6 REAL, M7 REAL
)
```

**Dynamic View** (rebuilt on every parameter change):
```sql
CREATE VIEW patient_metrics AS
SELECT *,
  CASE WHEN M1 >= {ibdMinClaims}           THEN 1 ELSE 0 END AS M1_flag,
  CASE WHEN M2 >= {ocsDurationThreshold}   THEN 1 ELSE 0 END AS M2_flag,
  -- ... M3_flag through M6_flag ...
  CASE WHEN (M2_flag=1 OR M3_flag=1 OR M4_flag=1 OR M5_flag=1 OR M6_flag=1)
       THEN 1 ELSE 0 END AS M7_flag
FROM patient_fact WHERE Pat_Age >= 18
```

**KPI Queries** ([lib/db/kpiEngine.ts](lib/db/kpiEngine.ts)):
- `GLOBAL_KPIS_SQL` — Total counts across all patients
- `HCP_AGG_SQL` — Grouped by NPI
- `ACCOUNT_AGG_SQL` — Grouped by Account
- `TERRITORY_AGG_SQL` — Grouped by Territory
- `DEMOGRAPHIC_AGG_SQL` — Grouped by age band + gender

All use `SUM(CASE WHEN ... THEN 1 ELSE 0 END)` for SQLite compatibility (no `COUNT FILTER`).

---

## 8. Data Flow

### Rule Details Page Flow
```
User navigates to /care-gaps/[id]
  → RuleDetailsClient mounts
    → useRulePackage(id) fetches rule (mock, 1.2s delay)
    → useParameterState() initializes default parameter values
    → Renders: RuleHeader, sticky RuleTabs, 7 section cards, ConfigurableParametersPanel
    → Scroll-spy listener: updates active tab as user scrolls
    → Tab click: smooth-scrolls to section, suppresses re-trigger with flag
    → Parameter change: setParameter() → state update → ImpactSummaryCard recalculates
    → "Generate Insights" click:
        → startInsightsTransition()
        → Save params to localStorage
        → router.push(`/care-gaps/${id}/insights`)
```

### Insights Page Flow
```
InsightsClient mounts
  → usePatientDb(parameters) initializes
    → sql.js loads from CDN
    → CREATE TABLE patient_fact
    → Auto-load demo-patients.csv (fetch → Papa Parse → batch INSERT)
    → buildMetricsViewSQL(parameters) → CREATE VIEW patient_metrics
    → Run 5 KPI queries → populate state
  → Renders: KPI cards, SummaryInsightCards, 6-tab InsightsTable

User changes parameter
  → setParameter() → useParameterState state update
  → usePatientDb detects change (dependency array)
  → 350ms debounce → runQueries()
    → DROP + recreate patient_metrics view with new thresholds
    → Re-run all 5 KPI queries
    → State update → UI re-renders with new values

User uploads CSV/Excel
  → FilterBar calls loadFile()
    → Papa Parse (CSV) or xlsx (Excel) parses file
    → DELETE FROM patient_fact
    → Batch INSERT new rows in transaction
    → runQueries() → update tables
```

---

## 9. Custom Hooks

| Hook | File | Responsibility |
|---|---|---|
| `useCareGaps()` | [hooks/useCareGaps.ts](hooks/useCareGaps.ts) | Fetch + filter care gap list (search, therapy area, status) |
| `useRulePackage(id)` | [hooks/useRulePackage.ts](hooks/useRulePackage.ts) | Fetch rule package, manage export and recalculation |
| `useParameterState()` | [hooks/useParameterState.ts](hooks/useParameterState.ts) | In-memory configurable parameter values + `setParameter()` |
| `usePatientDb(params)` | [hooks/usePatientDb.ts](hooks/usePatientDb.ts) | SQLite init, data load, KPI queries, debounced re-query |

---

## 10. API Layer

**Location:** [lib/api/](lib/api/)

All API calls are currently mocked — no real backend exists. The mock layer adds artificial delays to simulate network latency.

| Function | Delay | Returns |
|---|---|---|
| `getCareGaps()` | 1000ms | `ApiResult<CareGap[]>` |
| `getRulePackage(id)` | 1200ms | `ApiResult<RulePackage>` |
| `recalculatePopulation(payload)` | ~300ms | `ApiResult<ImpactSummary>` |
| `exportRules(careGapId)` | 500ms | `ApiResult<{ url: string }>` |

**API Result pattern:**
```typescript
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string; status: number } }
```

**Environment variable:** `NEXT_PUBLIC_API_BASE_URL` in `.env.local` — leave empty for mocks, set for a real backend.

---

## 11. Mock Data

| Mock File | Contents |
|---|---|
| [lib/mocks/careGaps.mock.ts](lib/mocks/careGaps.mock.ts) | 6 care gaps across Gastro, Endo, Rheumatology, Pulmonology, Cardiology |
| [lib/mocks/rulePackage.mock.ts](lib/mocks/rulePackage.mock.ts) | Full IBD biologic initiation rule package |
| [lib/mocks/insights.mock.ts](lib/mocks/insights.mock.ts) | Pre-generated HCP (20), Account (5), Territory (3), Demographic (8) rows |
| [lib/mocks/recalculate.mock.ts](lib/mocks/recalculate.mock.ts) | `computeMockImpact()` — adjusts population counts by parameter diffs |
| [public/demo-patients.csv](public/demo-patients.csv) | Synthetic patient records auto-loaded into SQLite on insights page |

**Mock Care Gaps:**
1. Biologic Therapy Initiation for IBD — Gastroenterology (Active)
2. GLP-1 Therapy Initiation in T2D — Endocrinology (Active)
3. T2D Therapy Escalation — Endocrinology (Draft)
4. Biologic Escalation in RA — Rheumatology (Active)
5. COPD Maintenance Therapy — Pulmonology (Draft)
6. ARNI Therapy in HFrEF — Cardiology (Active)

---

## 12. Key Components

### Authentication
- **[LoginModal](components/auth/LoginModal.tsx)** — Modal with username/password. Demo: `admin` / `admin123`. On success: shows loader → routes to `/care-gaps`.

### Layout
- **[AppHeader](components/layout/AppHeader.tsx)** — Fixed top bar with ProcDNA logo, "Clinical Intelligence Platform" tagline, breadcrumbs.

### Care Gap Selection
- **[CareGapUploadClient](app/care-gaps/_components/CareGapUploadClient.tsx)** — Two-step wizard: file upload + reference link. Simulates AI processing before routing.
- **[CareGapSelectorClient](app/care-gaps/_components/CareGapSelectorClient.tsx)** — Manages filter state; computes filtered list.
- **[CareGapCard](components/care-gap-selector/CareGapCard.tsx)** — Card showing title, description, therapy area, status, confidence. Clickable link to rule detail.

### Rule Details
- **[RuleDetailsClient](app/care-gaps/[id]/_components/RuleDetailsClient.tsx)** — Main orchestrator: manages `activeTab`, `parameters`, `sectionRefs`, scroll-spy listener.
- **[ConfigurableParametersPanel](components/rule-details/ConfigurableParametersPanel.tsx)** — Right sidebar with parameter dropdowns, impact preview, "Generate Insights" button.
- **[ParameterField](components/rule-details/ParameterField.tsx)** — Dropdown selector per parameter with label, tooltip, unit.
- **[ImpactSummaryCard](components/rule-details/ImpactSummaryCard.tsx)** — Live estimated population impact display.

### Insights
- **[InsightsClient](app/care-gaps/[id]/insights/_components/InsightsClient.tsx)** — Main orchestrator: tab state, sorting, pagination, data load.
- **[InsightsTable](components/insights/InsightsTable.tsx)** — Generic sortable paginated table. Columns: rank, identifier, metrics, risk badge. Page size: 10.
- **[KpiCard](components/insights/KpiCard.tsx)** — Displays metric name + count + rate percentage.
- **[FilterBar](components/insights/FilterBar.tsx)** — File upload input + status indicator.

### UI Library ([components/ui/](components/ui/))
Primitive components: `Button`, `Card`, `Badge`, `Tabs`, `Toggle`, `Select`, `Skeleton`, `Tooltip`, `EmptyState` — all styled with Tailwind.

---

## 13. Styling & Design System

**Color palette:**
- Brand blue: `#004FBA` (primary) with 50–950 tint scale
- Status: Green (Active), Amber (Draft), Gray (Archived)
- Therapy area dots: Distinct color per specialty
- Risk badge: Color-coded by M7 rate (low/medium/high thresholds)

**Typography:**
- Display: DM Serif Display (headings)
- Body: Inter / Segoe UI (UI text)

**Approach:** Tailwind utility classes only. No styled-components or CSS-in-JS. Dark mode not implemented.

---

## 14. Configuration Files

| File | Purpose |
|---|---|
| [package.json](package.json) | Dependencies, scripts (`dev`, `build`, `start`, `lint`, `type-check`) |
| [tsconfig.json](tsconfig.json) | Strict TypeScript, ES2017 target, `@/*` path alias |
| [tailwind.config.ts](tailwind.config.ts) | Brand colors, font stacks, content globs |
| [next.config.js](next.config.js) | `output: 'standalone'` for Docker |
| [.env.local](.env.local) | `NEXT_PUBLIC_API_BASE_URL` — empty = use mocks |
| [Dockerfile](Dockerfile) | Multi-stage Node build, exposes port 3000 |
| [docker-compose.yml](docker-compose.yml) | `web` service on port 3000, dev hot-reload volume |

---

## 15. Authentication & Security

- Simple demo credentials only (`admin` / `admin123`) — hardcoded, no real auth
- No session tokens, no route protection
- Future: Would integrate Azure AD, Okta, or similar
- No real patient data persisted — all in-memory SQLite

---

## 16. Error Handling

- API errors caught in hooks → stored in `error` state → `EmptyState` component displays them
- Loading: Skeletons and spinner states during async operations
- File uploads: Extension + MIME type validation
- SQLite: Try-catch in `usePatientDb`, error message surfaced to UI
- Unhandled routes: `app/not-found.tsx` (Next.js 404), `app/error.tsx` (error boundary)

---

## 17. Deployment

```bash
# Development
npm install && npm run dev        # http://localhost:3000

# Production
npm run build && npm start

# Docker
docker build -t care-gap-authoring .
docker compose up
```

Requires Node.js 18+. Standalone build is self-contained (no external Node server needed).

---

## 18. Summary

The **Care Gap Rule Authoring Platform** lets pharma analytics teams go from clinical guideline PDF → executable, validated patient-identification rule in minutes instead of weeks.

**User journey:**
1. Login (demo: admin/admin123)
2. Upload clinical guideline → AI simulates rule generation
3. Review rule across 7 dimensions (summary, eligibility, exclusions, temporal, data, evidence, logic)
4. Adjust parameter thresholds (OCS days, dose, taper window, etc.) and see live impact estimates
5. Upload real patient data (CSV/Excel) → SQLite runs aggregations in-browser
6. Explore analytics by HCP, account, territory, demographics
7. Export finalized rule as PDF

**Key technical achievement:** Full SQL analytics engine runs in the browser via WebAssembly (sql.js), so parameter changes recalculate patient populations instantly with no server round-trips.

**Current state:** Full-featured frontend with mock data. Ready to wire to a real backend by populating `NEXT_PUBLIC_API_BASE_URL`.
