# Engineering state and evidence ledger

This is the handoff record for maintainers and incoming Codex sessions. It records repository facts, completed evidence, unresolved engineering gates, and historical technical context. It does **not** authorize product work or close phases; see [`PROJECT_PLAN.md`](PROJECT_PLAN.md) for the plan-of-record and [`AGENTS.md`](AGENTS.md) for working rules.

## Current engineering status

| Field | Verified state |
|:--|:--|
| Evidence timestamp | 2026-08-15; Repository Hygiene and Accepted Work Recording. Historical checks retain their own dates. |
| Repository | `https://github.com/cqupt-zxc/zxc-personal-website` |
| Branch / HEAD at hygiene calibration | `codex/site-foundation` / `1abcfa0`; the branch was renamed locally from `security/phase-0a-rls` after confirming that it has no upstream. The repository remains a normal, non-bare Git repository. |
| Commit boundaries | `2c64e0f` contains only the accepted Phase 1A homepage files and `tests/homepage-content.test.ts`; `1abcfa0` contains only the accepted `.gitignore` private-source root rule; this governance record is the only intended content of the following documentation commit. |
| Working tree at documentation-commit staging | Only `AGENTS.md`, `PROJECT_PLAN.md`, and `HANDOFF.md` remain for the documentation-governance commit. `next-env.d.ts` returned to its HEAD content after the final Next.js build and is not staged. |
| Plan reference | [`PROJECT_PLAN.md`](PROJECT_PLAN.md) is authoritative for phase and task authorization. |
| Current authorization | No engineering task is active. Work/User closed Phase 1B-0; Phase 0 remains open and all later Phase 1B tasks remain unauthorized. See [`PROJECT_PLAN.md`](PROJECT_PLAN.md). |
| Implementation headline | Phase 1A is closed by Work/User. Phase 1B-0 added no application, UI, dependency, schema, migration, production-configuration, or website-content change; its only Phase 1B-0 tracked files are `.gitignore` and this factual evidence update. |
| Latest recorded verification | 2026-08-15: `npm test` passed 7 files and 59 tests; `npx tsc --noEmit --incremental false` passed; and `npm run build` passed. The staged commit boundaries and `git diff --check` were reviewed before each commit. |
| Recommended handoff point | Phase 1B-0 is closed by Work/User. The hygiene task must finish with a clean working tree, a locally excluded design-reference file, no tracked/staged private source material, and no push, merge, deployment, or later Phase 1B work. Wait for a new explicit authorization. |

## Contents

- [Engineering architecture](#engineering-architecture)
- [Phase 1B-0 source protection and inventory evidence](#phase-1b-0-source-protection-and-inventory-evidence)
- [Phase 1A implementation evidence](#phase-1a-implementation-evidence)
- [Repository hygiene and accepted-work recording](#repository-hygiene-and-accepted-work-recording)
- [Historical baseline and completed repository evidence](#historical-baseline-and-completed-repository-evidence)
- [Open production and external verification gates](#open-production-and-external-verification-gates)
- [Engineering backlog retained for future authorization](#engineering-backlog-retained-for-future-authorization)
- [Production configuration evidence status](#production-configuration-evidence-status)
- [Handoff rules and next checkpoint](#handoff-rules-and-next-checkpoint)

## Phase 1B-0 source protection and inventory evidence

This entry records the remediated metadata-only protection, inventory, classification, Work/User public-use decision, independent review, and Work/User closure completed on 2026-08-15. It contains no source contents, filenames, paths, previews, or source-ID mapping, and it does not publish material.

### Verified

- The exact root-directory ignore rule in `.gitignore` matches the sensitive source set and its private review directory. Fresh `git check-ignore`, `git status`, tracked-file, reachable-history, and global `git add --all --dry-run` checks found zero source entries staged, tracked, or candidate for staging.
- The independent Git review found no source-path evidence in the checked reflogs, unreachable-tree metadata, repository configuration references, logs, screenshots, or build-output references. It could not perform a content-level identity comparison against isolated blobs with no directory context, which remains a stated limitation.
- Work/User subsequently reduced the local source set and explicitly confirmed that every item currently retained may be publicly used. Codex did not move, rename, delete, or copy any original source file.
- The current source set contains 115 files in 33 subdirectories (121,956,271 bytes, about 116.3 MiB) across 9 file formats. The rebuilt private metadata inventory assigns every current original file one stable, unique Source ID; no duplicate group remains. No source content was opened, copied into repository files, website content, screenshots, logs, prompts, or public drafts.
- The classification matrix covers all 115 current Source IDs exactly once. Confirmed public content is 115; Private and Need user confirmation are both 0, based on the explicit Work/User public-use decision. This records permission for future use only; it does not publish material or independently verify every factual claim, copyright/licence, third-party consent, or contextual redaction requirement.
- The ignored private review directory holds the inventory, two non-overlapping batch lists, two classification matrices, a decision list, a review report, and reproducible local generation scripts. All are ignored, untracked, and unstaged.

### Human Gate A outcome and remaining decisions

- Work/User selected the precise ignore-rule approach. `.gitignore` is the Phase 1B-0 tracked protection change; the source directory itself was not moved, renamed, deleted, copied, staged, or committed.
- The private, Source-ID-only decision list records Work/User's `Approve public` decision for every current Source ID. Before any later use, retain the separate phase-authorization boundary and validate source-specific facts, rights, third-party consent, and any needed redaction.
- The earlier independent reviewer established the inventory/batch/Git-boundary process. After Work/User reduced the source set and supplied the public-use decision, the lead re-ran the current inventory/classification/Git reconciliation locally. It found complete Source-ID coverage, the recorded Work/User approval on every current item, no private locator field in classification output, and no new scope creep. The pre-existing Phase 1A code/test diff remains outside this task and is not evidence of a Phase 1B-0 application change.
- Work/User accepted the Phase 1B-0 evidence and results and closed the task on 2026-08-15. The closure creates no authorization for Phase 1B-2, Phase 1B-3, publication, production work, deployment, release, push, or merge.

## Repository hygiene and accepted-work recording

This entry records the local Git-history cleanup authorized on 2026-08-15. It preserves the accepted Phase 1A and Phase 1B-0 boundaries without extending their authorization.

- The local branch is `codex/site-foundation`; it has no upstream. No remote branch, push, merge, pull request, deployment, release, or production configuration action occurred.
- The local design-reference file remains unchanged, untracked, and protected only by an exact local `.git/info/exclude` entry. The local rule is intentionally not part of the public `.gitignore`.
- The accepted Phase 1A homepage foundation is recorded in `2c64e0f` and includes `tests/homepage-content.test.ts`. The accepted Phase 1B-0 protection rule is recorded in `1abcfa0` and is limited to `.gitignore`.
- The final build restored `next-env.d.ts` to its HEAD content. It is intentionally excluded from all three hygiene commits.
- Before the documentation-governance commit, the only remaining changes are `AGENTS.md`, `PROJECT_PLAN.md`, and this ledger. The final closeout check must confirm that the working tree is clean and no private material is tracked or staged.

## Engineering architecture

The application is a Next.js App Router portfolio site with server-rendered routes, client-side motion presentation, Supabase-backed editable content, optional GitHub enrichment, and a private-archive access primitive.

```text
app/                         public, admin, auth, private, and media routes
components/                  homepage presentation, motion, and admin form UI
lib/                         content pipeline, GitHub enrichment, site logic, Supabase clients
supabase/                    fresh schema, migration, authorization documentation, RLS test plan
tests/                       Vitest tests for pure helpers
```

Base public content uses a demo fallback, then `public.site_content(id = 1)`, with the pre-Phase-1A GitHub enrichment behavior retained for non-homepage callers. The homepage alone applies selected-GitHub metadata enrichment with a partial/rejected-response fallback that preserves configured project content. A demo biography is not public homepage content; an intro appears there only when the stored content explicitly supplies it. The admin and private routes remain security-sensitive: application checks do not replace database authorization, and private Storage must remain private.

## Phase 1A implementation evidence

This entry records the local homepage implementation and verification completed on 2026-08-15. It is evidence for Work/User review, not phase closure or production authorization.

### Changed

- Reworked the public homepage's hierarchy around the confirmed name and role, a single selected-project destination, an optional decorative project rail, and optional content sections.
- Prevented unconfirmed or placeholder personal content from rendering on the homepage: the demo email, default demo biography, school/education placeholders, and honor placeholders are filtered and their sections hide when empty. Homepage biography display requires a non-empty intro explicitly supplied by stored content; no replacement or generated copy is used.
- Limited selected work to three unique project URLs. The decorative rail is `aria-hidden` and non-interactive; sticky project cards remain the sole project-link targets.
- Made homepage GitHub enrichment resilient to partial and rejected responses while preserving configured project order. The homepage-specific path remains isolated, while `getPublicContent()` now restores its pre-Phase-1A observable behavior for `/admin` and other base-content callers: after a successful content read, non-empty GitHub results replace `projects`; no result keeps the base content.
- Adjusted responsive Hero positioning, navigation target sizing, focus targets, visual contrast, and reduced-motion behavior. The public homepage no longer links to `/admin`.

### Verified

- `npm test` completed with 7 files and 59 tests passing on 2026-08-15, including regression coverage that the default `demoContent.intro` is not public homepage content, an explicitly confirmed intro is displayed, homepage enrichment preserves configured projects on partial/rejected responses, and base-content enrichment retains the `/admin` behavior described above.
- `npx tsc --noEmit --incremental false` completed successfully on 2026-08-15.
- `npm run build` completed successfully on 2026-08-15. The build classified `/` as static with a one-minute revalidation interval.
- The same build enumerated `/admin` as a static route. Source review confirms `/admin` continues to call `getPublicContent()`; the restored base-content function follows the pre-Phase-1A enrichment branch and is covered by the focused regression test.
- Independent QA reloaded and inspected the homepage at 1440×1000, 768×1024, and 390×844. It reported no document horizontal overflow, no Hero clipping, unique project links, and no known placeholder content in the rendered page.
- QA confirmed at least 44px-high navigation and project action targets, visible focus order without duplicate project destinations, no application console errors, and static reduced-motion coverage in CSS and motion components.
- `git diff --check` completed without whitespace errors. Git emitted CRLF conversion warnings for existing working-copy files.

### Unverified

- Reduced-motion behavior was reviewed from CSS and component logic; no browser session was available to force the operating-system media preference at runtime.
- No live Supabase or GitHub configuration was used for this local verification. Placeholder filtering and partial/rejected enrichment fallback are covered by focused unit tests, not a provider integration test.
- Real-device touch and screen-reader testing were not performed.

### Remaining risks

- Public email, biography, education, honors, project media, and any new project claims remain hidden until Work/User confirms them. In particular, the prior record incorrectly implied that the default demo biography was already filtered; bounded rework now enforces that rule. No personal placeholder was replaced with invented content.
- The Phase 0C-2/0C-3, administrator-identity, provider configuration, private Storage, and release gates remain unresolved and outside Phase 1A.
- `next build` regenerated `next-env.d.ts`; its pre-existing `.next-dev` references were restored exactly after the final build so the initial working-tree state is retained. A later Next.js build may regenerate this file again.

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
