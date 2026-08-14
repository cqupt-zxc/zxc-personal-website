# Engineering state and evidence ledger

This is the handoff record for maintainers and incoming Codex sessions. It records repository facts, completed evidence, unresolved engineering gates, and historical technical context. It does **not** authorize product work or close phases; see [`PROJECT_PLAN.md`](PROJECT_PLAN.md) for the plan-of-record and [`AGENTS.md`](AGENTS.md) for working rules.

## Current engineering status

| Field | Verified state |
|:--|:--|
| Evidence timestamp | 2026-08-14; documentation-governance work-acceptance repair. Historical checks retain their own dates. |
| Repository | `https://github.com/cqupt-zxc/zxc-personal-website` |
| Branch / HEAD at calibration | `security/phase-0a-rls` / `710f3639ed12a046233b6e556051cde098c019f0` |
| Working tree at latest calibration | Documentation-only modifications are limited to `AGENTS.md`, `PROJECT_PLAN.md`, and `HANDOFF.md`; re-check `git status` before any later work. |
| Plan reference | [`PROJECT_PLAN.md`](PROJECT_PLAN.md) is authoritative for phase and task authorization. |
| Current authorization | Phase 0 remains open; no phase or engineering task is currently authorized. |
| Implementation headline | Repository-side RLS, OAuth guidance, environment handling, and dependency-remediation work have recorded evidence. Production acceptance remains blocked by the gates below. |
| Latest recorded verification | Phase 0F records unit tests, TypeScript, local/fake-production builds, Turbopack startup, no-service route smoke tests, and `npm audit` with zero vulnerabilities on 2026-08-12. This is historical evidence, not a fresh verification of the current tree. |
| Recommended handoff point | Do not start Phase 0G-1 automatically. Obtain explicit authorization, then calibrate again and preserve the deferred production gates. |

## Contents

- [Engineering architecture](#engineering-architecture)
- [Historical baseline and completed repository evidence](#historical-baseline-and-completed-repository-evidence)
- [Open production and external verification gates](#open-production-and-external-verification-gates)
- [Engineering backlog retained for future authorization](#engineering-backlog-retained-for-future-authorization)
- [Production configuration evidence status](#production-configuration-evidence-status)
- [Handoff rules and next checkpoint](#handoff-rules-and-next-checkpoint)

## Engineering architecture

The application is a Next.js App Router portfolio site with server-rendered routes, client-side motion presentation, Supabase-backed editable content, optional GitHub enrichment, and a private-archive access primitive.

```text
app/                         public, admin, auth, private, and media routes
components/                  homepage presentation, motion, and admin form UI
lib/                         content pipeline, GitHub enrichment, site logic, Supabase clients
supabase/                    fresh schema, migration, authorization documentation, RLS test plan
tests/                       Vitest tests for pure helpers
```

Public content uses a demo fallback, then `public.site_content(id = 1)`, then selected GitHub metadata enrichment. The admin and private routes remain security-sensitive: application checks do not replace database authorization, and private Storage must remain private.

## Historical baseline and completed repository evidence

This section records dated evidence only. “Completed” means the stated repository-side or historical verification was recorded; it never means production rollout, Work/User acceptance, or all external gates are complete.

| Item | Status | Evidence and retained limitation |
|:--|:--|:--|
| Audited application baseline | Historical baseline recorded | `71e1625` on `main` preceded Codex maintenance work. On 2026-08-10 the baseline recorded a clean tracked-secret scan, `npm ci`, 16 unit tests, TypeScript, and a production build; lint, dependency audit, SEO endpoints, and some route/UI checks still had gaps. |
| Phase 0A — RLS design | Verified completed (repository evidence) | Commit `3b5f561` records the UID-membership authorization design. |
| Phase 0B — RLS implementation | Verified completed (repository evidence) | Commit `0890927` adds the migration, fresh-install schema alignment, and RLS test plan. |
| Phase 0C overall | Partially completed | Phase 0C-1 is complete only within its non-production verification scope. Phase 0C-2 and Phase 0C-3 remain deferred/pending, so Phase 0C is not closed. |
| Phase 0C-1 — disposable catalog/privilege verification | Verified completed (historical external evidence; disposable / non-production only) | A disposable non-production project recorded completed migration/catalog/privilege checks on 2026-08-11. This is not production verification and does not close Phase 0C. |
| Phase 0D — OAuth guidance | Verified completed (repository guidance) | Commit `4d0bafc` and current README guidance distinguish the provider callback from the application callback. No production OAuth configuration or end-to-end verification is recorded. |
| Phase 0E — environment hardening | Verified completed (repository evidence) | Commits `eed15b7` and `352c69b` add validation, controlled unavailable states, and production-environment commands. Real production configuration remains unverified. |
| Phase 0F — dependency remediation | Verified completed (repository evidence) | Commits `82ff423` and `710f363` record Nano ID and Next.js remediation. The recorded final audit had zero vulnerabilities; re-run before any release. |

### Retained RLS evidence

The recorded Phase 0B/0C-1 design is `public.site_content`, `app_private.admin_users(user_id uuid)`, and `app_private.is_site_admin()` with public read, administrator-only insert/update, and no delete. `ADMIN_EMAILS` remains only an application-level guard. The disposable verification recorded that `app_private` was not API-exposed, ordinary roles had no direct membership-table access, and no production project or administrator was changed.

## Open production and external verification gates

These gates are current engineering facts and must not be described as completed, even where related repository implementation is complete.

| Gate | Status | Required evidence before a production rollout |
|:--|:--|:--|
| Phase 0C-2 direct Data API actor matrix | Deferred / pending | Test anonymous, normal authenticated, and administrator actors against the real policy behavior in a disposable or preview environment. |
| Phase 0C-3 membership revoke/re-add | Deferred / pending | Prove that a live administrator session loses and regains database write access on its next request after membership removal and restoration. |
| Canonical administrator identity | Not verified | Manually inspect Supabase Auth, confirm canonical UUID(s), determine whether Email and GitHub identities are linked, and seed only confirmed UID membership. |
| Supabase production configuration and RLS rollout | Not verified / not authorized by this handoff | Perform only in an explicitly approved change window after the 0C gates pass. |
| GitHub OAuth production configuration | Not verified | Confirm the provider callback, Supabase Site URL and Redirect URLs, then complete an allowlisted and non-allowlisted live-login test. |
| Vercel production configuration | Not verified | Enter and validate the required production environment values without exposing secrets. |
| Private Storage and access flow | Not verified | Keep the bucket private; verify policy, object-prefix restrictions, short-lived signed URLs, and authenticated access behavior before use with real private media. |
| Production content and placeholder review | Blocked pending an authorized Phase 0G-1 | Do not infer or replace personal data. Before release, user-confirmed public content must replace/review demo or placeholder material. |
| Release gate | Not yet satisfied | Re-run current install, non-interactive lint once configured, typecheck, tests, build, audit, route/browser checks, accessibility review, and applicable integration tests with production-shaped configuration. |

## Engineering backlog retained for future authorization

The following is a compact technical backlog, not a phase contract. It preserves the audited concerns and their evidence expectations without authorizing implementation.

| Area | Confirmed engineering concern | Expected evidence when authorized |
|:--|:--|:--|
| P1 reliability | Admin writes can report success after failed upserts; runtime content validation is absent; auth/private errors are opaque; partial GitHub failures can remove curated cards. | Failure-path integration tests, safe fallback rendering, preserved form state, and successful re-read. |
| P1 private/archive and delivery | The archive is a gate/signing primitive rather than a complete feature; no reliable CI/lint/E2E release gate exists; sensitive utility pages lack noindex metadata. | Authorization, expiry, object-prefix, and rate-limit tests; clean CI; route metadata and robots inspection. |
| P2 maintainability | Legacy/current CSS overlap, dead code/assets may remain, and formatting/boundary types hinder review. | Import/reference proof, focused visual regression evidence, formatting checks, and type safety. |
| P3 performance | Public reads may become dynamic with configured Supabase; homepage hydration, image payloads, and font loading need measurement. | Production-shaped build classification, cache behavior, bundle/media metrics, and visual checks. |
| P4 accessibility and responsive UI | Hero composition, labels/focus/touch targets, duplicated marquee links, contrast, and interaction load need remediation. | Desktop/tablet/mobile screenshots, keyboard and screen-reader checks, contrast audit, and reduced-motion testing. |
| P5 SEO, tooling, and hardening | Metadata files, canonical URLs, dependency/tooling decisions, headers, and observability remain candidates after stabilization. | Endpoint/head inspection, visual/regression checks, dependency rationale, and route-wide header validation. |

## Production configuration evidence status

No provider dashboard was changed as part of the recorded repository work or this documentation-governance task. The following instructions are evidence requirements, not authorization to make an external change:

- Vercel must hold the real production site origin and required public/server environment groups; run `npm run validate:production-env` and `npm run build:production` only with approved, non-disclosed configuration.
- GitHub OAuth must use Supabase's provider callback (`https://<project-ref>.supabase.co/auth/v1/callback`); the application's `/auth/callback` is the post-auth redirect target and belongs in Supabase Redirect URLs.
- Supabase Auth Site URL and Redirect URLs must use explicitly approved production/local/controlled-preview origins.
- `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS`, `PRIVATE_ARCHIVE_PASSWORD`, and optional `GITHUB_TOKEN` remain server-only. Private Storage must not receive public-read policies.

## Handoff rules and next checkpoint

Update this ledger when repository state, verification evidence, blockers, or external verification status changes. Record dates, commands, commits, environments, and limitations; do not duplicate authorization, acceptance criteria, or a full phase contract from `PROJECT_PLAN.md`.

The next authorized engineering session should first re-run calibration. It must retain the Phase 0C-2/0C-3 gates, canonical-UID/identity-linking prerequisite, production provider verification, private Storage verification, and user-confirmed content/placeholder blocker.

---

*Created 2026-08-10. Re-governed 2026-08-12 as the Engineering State & Evidence Ledger. Revised 2026-08-14 (documentation-governance work-acceptance repair); historical claims retain their original evidence dates.*
