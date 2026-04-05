# RV Camping Insurance PWA

## Project Overview
Offline-first Progressive Web App for generating RV insurance quotes. Users sign in, enter vehicle details via a step-by-step wizard, and receive a downloadable PDF quote. Designed to work in remote camping areas with limited connectivity.

## Architecture
- **Frontend**: React 19 + Vite 8 (in `app/` directory)
- **Routing**: HashRouter (for GitHub Pages compatibility)
- **PDF**: jsPDF for client-side PDF generation
- **Hosting**: GitHub Pages at `https://qashsolutions.github.io/RVCamping/`
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`) auto-deploys on push to `main`

## Key Directories
```
app/src/pages/       # Login, Wizard (4-step), Quote certificate
app/src/utils/       # mockApi.js (insurance quote), generatePdf.js
app/src/data/        # synthetic-users.json, users.js (auth)
app/public/          # sw.js (service worker), manifest.json, icons
mockups/             # SVG wireframes for all 6 screens
data/                # Source synthetic user data (50 users)
```

## Design System (Blue Theme)
- Background gradient: `#0f1b2d` to `#1e3a5f`
- Primary CTA: `#2563eb`
- Card background: `#f0f4ff`
- Accent light: `#dbeafe`, `#60a5fa`
- Text: `#0f1b2d` (dark), `#64748b` (muted), `#94a3b8` (subtle)

## App Flow
1. **Login** — Email + password (show/hide toggle, validation: 8+ chars, alphanumeric, 2 special)
2. **Step 1** — Vehicle Number (required)
3. **Step 2** — VIN (optional, skippable)
4. **Step 3** — Mileage (quick-select chips: 10k/25k/50k/100k)
5. **Step 4** — Deductible slider ($20–$500, live premium estimate)
6. **Quote** — Certificate preview + PDF download

## Offline Strategy
- Service worker caches entire app shell (cache-first)
- All UI works offline
- Only the "Get Quote" API call requires network (currently mocked with 1.5s delay)
- Future: real 3rd-party insurance API replaces mock

## Test Credentials
- **Email**: `ramanac+1@gmail.com` through `ramanac+50@gmail.com`
- **Password**: `Abc1234$$` (same for all 50 demo users)

## Commands
```bash
cd app
npm install          # Install dependencies
npm run dev          # Dev server (localhost:5173)
npm run build        # Production build to app/dist/
npm run preview      # Preview production build
```

## Password Rules
- Minimum 8 characters
- Must contain letters AND numbers (alphanumeric)
- Must contain at least 2 special characters
- Demo password `Abc1234$$` satisfies all rules

## Notes
- VIN field is optional — users can skip step 2
- Vite base path is `/RVCamping/` for github.io subdirectory hosting
- The 3rd-party insurance API does not exist yet — `mockApi.js` generates synthetic quotes
- Premium formula: `max(basePremium * (1 + mileage/200000) - basePremium * (deductible/1000), 45)`
