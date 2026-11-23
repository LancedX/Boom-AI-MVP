# Boom AI — Student Enrollment Recovery & Success Platform
### Foothill Community College MVP & Design Partner Prototype

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing-success.svg)]()

> **Boom AI** is an intelligent operational layer sitting alongside a college’s existing systems of record (Banner SIS, Canvas LMS, and Element451/Slate CRM). It empowers academic counselors to identify at-risk continuing students, prioritize outreach deterministically, approve communications with 100% human-in-the-loop control, and track enrollment recovery into the next quarter.

---

## Executive Summary

- **Design Partner:** Foothill Community College (Foothill-De Anza Community College District)
- **Pilot Scope:** Spring 2027 Quarter ($15,000 fixed-fee proposed pilot)
- **Target Population:** 2,000 at-risk continuing students facing registration holds or disenrollment
- **Core Thesis:** Recover stopout students before the census drop deadline using explainable, rule-based alerts and human-in-the-loop counselor outreach.

---

## Key Product Capabilities

### 1. Explainable, Deterministic Risk Engine
- **Zero Black-Box AI Decisions:** No generative AI model ranks or decides on student records. Every score is mathematically calculated from 7 transparent, versioned institutional rules.
- **Auditable Contributing Factors:** Each student’s score displays explicit factor breakdowns (Registration holds, Unregistered for Spring, Financial aid/FAFSA issues, LMS inactivity, Missing coursework, Credit drops under 12 units, Academic notice).
- **Interactive Rules Manager:** Authorized staff can adjust rule point weights (0–50 pts), configure priority thresholds (High ≥ 50, Medium 30–49, Watch < 30), and save/rollback versioned rule sets.

### 2. Counselor-Controlled Outreach & SMS Simulator
- **Human-in-the-Loop Guarantee:** No message is dispatched without explicit counselor approval.
- **Pre-Compiled 8th-Grade Reading Level Drafts:** Messages are drafted to be clear, supportive, and accessible. Counselors can edit drafts in real-time with character count and SMS segment calculators.
- **On-Screen Smartphone SMS Simulator:** Built-in graphical smartphone panel with interactive student reply shortcuts (`Sent Form`, `Need Advisor`, `Just registered!`, plus freeform reply input) that mimic incoming Telnyx webhooks without page reloads.

### 3. Weekly Counselor Digest (Monday 7:00 AM)
- Modeled after Microsoft Outlook 365 briefings delivered every Monday at 7:00 AM.
- Curates the **Top 15 priority students** for each counselor's caseload with 1 next step per student and 1-click Approve, Edit, or Defer actions.

### 4. Comprehensive 10-Section Student Profile
Deep, fact-checked student profile drawers covering:
1. Personal & Contact Records
2. Enrollment Load & Modality
3. Academic Standing & GPA
4. Canvas LMS Telemetry (properly distinguishing unknown telemetry from zero activity)
5. Financial Aid & Registration Holds
6. Advisor Assignment
7. Outreach History
8. Explainable Score Breakdown
9. Recommended Action Step
10. Immutable Activity Timeline

### 5. Institutional System Previews
- **Ellucian Banner 9 SIS:** Read-only snapshot model previewing nightly 2:00 AM synchronization (`SZASTDN`, `SFAREGS`, `SOAHOLD`) with strict zero direct database writes.
- **Canvas LMS:** Early-warning indicators (logins in last 14 days, missing course assignments) and Phase 2 Canvas Inbox counselor message previews.
- **CRM Timeline:** Element451 / Slate CRM integration preview synchronizing touchpoint events and student IDs without PII.

### 6. Executive & President Dashboard
- Executive Friday 8:00 AM briefing for the College President & VP of Student Success.
- Tracks verified Banner registrations, holds cleared, and ROI metrics (Cost per registration against the $15,000 pilot fee vs ~$4,600/FTES California state apportionment preserved).
- Strictly separates verified session records from projected targets.

### 7. IT Administration & FERPA Compliance
- Transactional audit log recording every CSV import, rule change, counselor approval, deferral, and status change.
- **Outbound Reconciliation CSV Export:** Generates and downloads `enrollment_recovery_results.csv` for bulk SIS updates.
- 10-step **Guided Demo Tour** with auto-play capabilities for stakeholder presentations.

---

## Tech Stack & Architecture

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Build System:** Vite 5 (production build under 1.1s, HMR)
- **Data Engineering:** PapaParse CSV ingestion with schema validation (26 columns), duplicate detection, and missing-value handling
- **Persistence:** Client-side local storage ledger (`boom_ai_foothill_state_v2`) with reset-demo functionality
- **Testing:** Vitest automated test suite for scoring math and CSV ingestion

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22.18)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/ADITYASHARMACODER/boom-ai-mvp.git
cd boom-ai-mvp

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:3000/` in your browser.

### Available Scripts

- `npm run dev` — Launch Vite local development server with HMR
- `npm run build` — TypeScript type-check and optimized production build
- `npm test` — Run Vitest unit tests for risk engine and CSV parser
- `npm run preview` — Locally preview the production build

---

## Project Structure

```
Boom MVP/
├── public/
│   └── boom_test_students_50.csv     # Sample 50-student Foothill dataset
├── src/
│   ├── components/
│   │   ├── CanvasLMSPreview.tsx      # Canvas early warning & Inbox preview
│   │   ├── CounselorDashboard.tsx    # Counselor operational KPIs & priority queue
│   │   ├── CRMPreview.tsx            # Element451/Slate touchpoint timeline
│   │   ├── CSVImportModal.tsx        # File drag-and-drop & schema validation
│   │   ├── ExecutiveDashboard.tsx    # Friday 8 AM VP/President outcome briefing
│   │   ├── Header.tsx                # Foothill brand banner & counselor switcher
│   │   ├── ITAuditCenter.tsx         # FERPA architecture & reconciliation export
│   │   ├── Navigation.tsx            # Global multi-section responsive tabs
│   │   ├── OutreachCenter.tsx        # Approval workbench & Smartphone SMS Simulator
│   │   ├── PilotProposal.tsx         # Foothill Spring 2027 $15k pilot proposal
│   │   ├── RulesManager.tsx          # Configurable deterministic scoring engine
│   │   ├── SettingsView.tsx          # District preferences & dispatch schedule
│   │   ├── SISBannerPreview.tsx      # Ellucian Banner 9 read-only sync preview
│   │   ├── StudentDirectory.tsx      # Full cohort directory with multi-filters
│   │   ├── StudentProfileModal.tsx   # 10-section comprehensive student profile
│   │   ├── WalkthroughBanner.tsx     # 10-step guided demo tour controller
│   │   ├── WeeklyDigest.tsx          # Outlook Monday 7 AM Top 15 briefing
│   │   └── WeekTwoWorkflow.tsx       # Post-outreach lifecycle & hold resolution
│   ├── context/
│   │   └── AppContext.tsx            # Central state machine & local persistence
│   ├── services/
│   │   ├── csvParser.ts              # Robust CSV ingestion & reconciliation export
│   │   ├── defaultData.ts            # Foothill initial cohort & pilot settings
│   │   ├── rawCsvData.ts             # Typed baseline student records
│   │   └── riskEngine.ts             # Deterministic mathematical scoring logic
│   ├── types/
│   │   └── index.ts                  # Comprehensive TypeScript domain interfaces
│   ├── App.tsx                       # Root view router & layout container
│   ├── index.css                     # Tailwind CSS custom styles & animations
│   └── main.tsx                      # React root entry point
├── boom_test_students_50 (1).csv     # Baseline Foothill student CSV dataset
├── tailwind.config.js                # Custom Foothill & Boom AI color tokens
├── vite.config.ts                    # Vite configuration with remote host support
└── tsconfig.json                     # Strict TypeScript compiler options
```

---

## Data Privacy & Ethics

1. **FERPA Protection:** Student data is processed locally within the in-memory presentation ledger; no student records or transcripts are transmitted to external generative AI services.
2. **Auditability:** Every intervention, approval, and configuration adjustment is permanently logged with timestamps and student IDs (excluding sensitive message text).
3. **Institutional Autonomy:** The platform enforces strict advisor agency—counselors maintain full discretion to approve, edit, or defer outreach at all times.

---

## License

Proprietary prototype developed for demonstration to Foothill Community College. All rights reserved.
