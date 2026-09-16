# Project consistency repair plan

> **For agentic workers:** Implement the approved fixes independently, then review the combined diff before publishing.

**Goal:** Correct the three issues identified in the initial inspection: official question counts, reproducible Supabase setup, and deployment documentation.

**Architecture:** Preserve the existing static apps and live Supabase authorization behavior. Match Cloudflare configuration to the existing Worker and package only public site assets.

**Tech Stack:** Vanilla JavaScript, Supabase PostgreSQL, Cloudflare Workers static assets.

**Spec:** User request on 2026-09-16 to resolve the three findings reported in this task.

## Constraints

- Preserve question content, existing learner records, authentication, and administrator restrictions.
- Do not enable a new AI feature, redesign the site, or introduce a frontend framework.
- Do not claim automatic deployment unless it is configured and verified.
- Keep secrets and database contents out of source control and deployed static assets.

## Tasks

- [x] Fix junior/intermediate dashboard copy to use `counts().official` for official questions and `counts().generated` for extension questions; verify before and after bank loading. Bump changed app asset URLs and service worker versions.
- [x] Capture the existing `usage_stats()` and `user_attempts(text)` definitions and required grants in `supabase-setup.sql`. Keep administrator checks and anonymous execution restrictions. Validate fresh setup, repeat setup, ordinary-user denial, and authorized administrator responses with synthetic data in an isolated database.
- [x] Correct README to describe the actual Worker, deployment steps, backend setup, and admin data access. Add a reproducible static asset deployment configuration only after verifying current settings.
- [x] Review changes, run focused verification, and publish and verify the website.

## Verification record

- Six tests pass: fresh database setup, admin access, ordinary-user denial, anonymous denial, row isolation, repeat setup (grouped in five database tests), and public asset packaging in a hidden checkout.
- Browser confirms junior 300 official + 943 extension questions and intermediate 300 official + 829 extension questions.
- Wrangler 4.132.0 dry run passes.
- Production version: `4b767a36-afc0-4b6a-a579-7aebf62807aa` (2026-09-16).
- Six updated production files match local bytes; portal, BI and admin respond successfully. SQL, package manifest and legacy Netlify function URLs return 404.
- Existing logging and domain settings verified after publication.
- SQL definitions were recovered from the existing backend and validated using synthetic local data; production learner data was not modified by SQL.
