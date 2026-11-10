# QA Universe

A separate React + TypeScript + Vite workspace for QA learning, hands-on testing utilities, career development and a future secured admin control center.

## Local development
```bash
cd qa-universe
npm install
npm run dev
npm run build
```

## Current implementation
- QA dashboard and navigation
- Bug report builder and copy/export
- Test case builder
- Boundary-value and equivalence-partition helper
- JSON formatter and API response comparison
- Test data generator
- QA learning library and knowledge cards
- Career roadmap and challenge board
- Resource templates
- Admin control-center shell (intentionally locked until server-side authentication and role policies are configured)

## Backend
The UI is deliberately isolated from the existing Veriqraft and portfolio backends. Configure a dedicated Supabase project, Auth, database migrations and Row Level Security before enabling persistent learner accounts, community, AI provider calls, notifications, admin operations or analytics.

Never place service-role keys or AI provider secrets in browser code.