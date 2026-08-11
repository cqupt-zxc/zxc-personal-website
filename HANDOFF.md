# Project handoff and baseline audit

**Last updated**: 2026-08-11 (audited application baseline commit `71e1625`; Phase 0C disposable migration/catalog/privilege verification completed, while real actor verification remains pending).
**Repository**: `https://github.com/cqupt-zxc/zxc-personal-website`.
**Status**: production build succeeds without service configuration, but production deployment is blocked by the P0 items below.

This document is the project handoff for maintainers returning to the portfolio site. It records the current architecture, verified baseline, prioritized risks, and the staged path to a production deployment. The repository did not contain `AGENTS.md` or `HANDOFF.md` when the audit began; both files now exist, with `AGENTS.md` providing the concise agent-facing maintenance contract.

## Contents

- [Current architecture](#current-architecture)
- [Verified baseline](#verified-baseline)
- [P0 — security and deployment blockers](#p0--security-and-deployment-blockers)
- [P1 — correctness and reliability](#p1--correctness-and-reliability)
- [P2 — architecture and code quality](#p2--architecture-and-code-quality)
- [P3 — performance](#p3--performance)
- [P4 — UI, UX, and accessibility](#p4--ui-ux-and-accessibility)
- [P5 — optional improvements](#p5--optional-improvements)
- [Production configuration checklist](#production-configuration-checklist)
- [Phased implementation plan](#phased-implementation-plan)
- [Next-session starting point](#next-session-starting-point)

## Current architecture

The application is a Next.js App Router site with server-rendered pages, client-side motion components, Supabase-backed editable content, and optional GitHub repository enrichment.

```text
app/
├── page.tsx                    public portfolio home
├── us/page.tsx                 public relationship timeline
├── us/private/page.tsx         password gate and signed-cookie issuance
├── admin/login/page.tsx        email/password and GitHub OAuth entry
├── admin/page.tsx              allowlisted content editor and save action
├── auth/callback/route.ts      Supabase OAuth code exchange
└── api/private/media/route.ts  service-role signed Storage URL redirect
components/                     home presentation, motion, and admin form UI
lib/
├── content.ts                  demo → Supabase → GitHub content pipeline
├── github.ts                   GitHub REST metadata enrichment
├── site-logic.ts               admin allowlist and private-cookie primitives
└── supabase/server.ts          cookie-aware Supabase SSR client
supabase/schema.sql             site_content table and RLS policies
tests/                          Vitest unit tests for pure helpers
```

The public content flow is `demoContent` fallback → row `public.site_content(id = 1)` → GitHub API enrichment for selected repository names. The admin flow authenticates with Supabase, checks `ADMIN_EMAILS` on page render and again in the server action, then upserts the JSON content row. The private archive flow compares `PRIVATE_ARCHIVE_PASSWORD` on the server, issues a 12-hour HMAC-signed HttpOnly cookie, and uses a service-role client to mint a 60-second Storage signed URL.

The Server/Client boundary is directionally sound at the route level: pages, authentication, database access, GitHub tokens, and Storage signing remain server-side. Most homepage sections are Client Components because of Framer Motion; this is a performance and maintainability concern rather than a current secret-leak finding.

## Verified baseline

These facts were verified on 2026-08-10 and may drift after dependency or code changes.

| Check | Result | Evidence |
|:---|:---|:---|
| Audited application baseline commit | Pass | `71e1625` on `main`, before Codex maintenance and business modifications |
| Tracked secret scan | Pass | No GitHub token, Supabase JWT, or service-role-shaped secret found in the current tree or the two-commit history |
| Install | Pass | `npm ci` completed with the committed lockfile |
| Unit tests | Pass | 4 files, 16 tests |
| TypeScript | Pass | `npx tsc --noEmit` exited 0 |
| Production build | Pass with caveats | Next.js 15.5.22 compiled and generated all routes |
| Lint | Fail | `next lint` enters an interactive setup prompt; no ESLint configuration exists |
| Dependency audit | Fail | 4 high-severity advisories reported by `npm audit` |
| Runtime routes without Supabase | Partial | `/`, `/us`, `/admin/login`, `/us/private` return 200; `/admin` returns 500; protected media returns 401 |
| SEO endpoints | Fail | `/robots.txt`, `/sitemap.xml`, and `/favicon.ico` return 404 |
| Responsive smoke test | Partial | No page-level horizontal overflow at 1440, 834, or 390 px; mobile/tablet hero composition and touch targets need work |

Local-only screenshots from this audit are stored under `audit/baseline-2026-08-10/`, which is intentionally ignored by Git.

## P0 — security and deployment blockers

### P0-1 — Database authorization bypasses the admin allowlist

- **Audited baseline problem**: At audited application baseline commit `71e1625`, `site_content` granted `FOR ALL` access to every `authenticated` user. `ADMIN_EMAILS` was checked only in the Next.js application, so it was not a database authorization boundary.
- **Why it matters**: An authenticated user can bypass page-level checks by calling the Supabase Data API directly if database privileges and RLS remain permissive. This is a public-site defacement and data-integrity risk.
- **Phase 0A design (2026-08-10)**: The approved architecture is `public.site_content`, `app_private.admin_users(user_id uuid)`, and the hardened `app_private.is_site_admin()` `SECURITY DEFINER` helper. The target is public `SELECT`, admin-only `INSERT`/`UPDATE`, and no `DELETE`; authorization is based on `auth.uid()`, not `ADMIN_EMAILS`.
- **Phase 0B repository implementation**: Commit `08909276e48c8f19e14e61dba6a0c933c6e9580b` adds `supabase/migrations/20260810143000_harden_site_content_rls.sql`, synchronizes the fresh-install `supabase/schema.sql`, and adds the static contract and integration-test plan.
- **Phase 0C-1 disposable verification (2026-08-11)**: In the non-production disposable project `zxc-portfolio-rls-test`, the committed migration executed successfully. `app_private.admin_users` and `app_private.is_site_admin()` exist; the three replacement `site_content` policies exist; the legacy authenticated `FOR ALL` policy is absent; `anon` has only `SELECT`; `authenticated` has `SELECT`/`INSERT`/`UPDATE` with no `DELETE` or `TRUNCATE`; ordinary API roles cannot directly access `admin_users`; and `app_private` is not exposed through the Data API. Normal and admin test users were created, and one exact test UID was inserted as an admin membership. No production project was changed and no production admin was seeded.
- **Current status (2026-08-11)**: **P0-1 implementation complete; disposable migration/catalog/privilege verification passed; real authenticated actor matrix and membership revoke/re-add verification remain pending before production deployment.** This is not a claim that P0-1 is fully closed, fully verified, secure, or production-ready.
- **Mandatory production-deployment verification still pending**: (1) Phase 0C-2 direct Data API matrix using publishable/anon key and separately authenticated anonymous, normal, and admin actors; and (2) Phase 0C-3 removal and re-addition of a membership, proving the same live admin session loses and regains write access on its next database request. The in-app Browser could not execute the temporary Data API request page because of its safety policy; the tests were deliberately deferred, not failed.
- **Bootstrap prerequisite (unresolved)**: Before any production bootstrap, manually inspect Supabase Auth and confirm the canonical UUID or UUIDs for the intended Email and GitHub identities, whether identities are linked, and which exact UID(s) receive membership. Do not derive membership dynamically from an email match.

### P0-2 — GitHub OAuth setup instructions conflate two callbacks

- **Problem**: [`README.md`](README.md) tells the maintainer to configure the GitHub OAuth callback as the website route `/auth/callback`.
- **Why it matters**: For Supabase GitHub Auth, the callback registered in the GitHub OAuth App is `https://<project-ref>.supabase.co/auth/v1/callback`. The website `/auth/callback` is instead the post-auth `redirectTo` destination that belongs in Supabase's Redirect URLs allowlist. Following the current text literally can block GitHub login.
- **Severity**: P0 — authentication deployment blocker.
- **Recommended fix**: Split the deployment instructions into GitHub OAuth App callback, Supabase Site URL, Supabase Redirect URLs, and application `NEXT_PUBLIC_SITE_URL`. Use exact production URLs; keep local and preview patterns separate.
- **Modification risk**: Low for documentation, medium for dashboard configuration because changing callbacks affects live login.
- **Verification**: Complete a fresh GitHub login from `/admin/login`, observe return through `/auth/callback`, confirm a non-admin is signed out, and confirm an allowlisted admin lands on `/admin`.
- **Phase 0D repository status (2026-08-11)**: The application flow was reviewed without changing application code. With a valid `NEXT_PUBLIC_SITE_URL`, `signInWithOAuth` uses `<site-origin>/auth/callback`, and that route exchanges the code, rejects a non-allowlisted user at the application layer, and redirects an allowed user to `/admin`. README and `.env.example` now distinguish the provider callback, Supabase Site URL, Redirect URLs, and application `redirectTo`. No GitHub, Supabase, Vercel, or production configuration has been changed; the live OAuth verification above remains required.

### P0-3 — Locked dependencies have known high-severity advisories

- **Problem**: As of 2026-08-10, `npm audit` reports four high-severity dependency findings. The important paths are Next.js 15.5.22 → nested PostCSS 8.4.31, Next.js → Sharp 0.34.5, and root PostCSS → Nano ID 3.3.16.
- **Why it matters**: The current site does not accept untrusted CSS and does not send admin-provided remote images through Next Image, which lowers practical exploitability, but a clean production security baseline should not knowingly ship high advisories. The Sharp advisory is most relevant whenever untrusted image decoding is introduced.
- **Severity**: P0 — dependency security gate before public launch, with currently limited observed exploit paths.
- **Recommended fix**: Test a controlled Next.js 16 upgrade on a branch, update the lint workflow at the same time, and use the smallest safe override/update for Nano ID if compatible. Do not run `npm audit fix --force` blindly.
- **Modification risk**: High. Next.js 16 is a major upgrade and may require framework, lint, and runtime changes.
- **Verification**: Require `npm audit` to have no high/critical production findings, then rerun tests, typecheck, lint, build, route smoke tests, image rendering, and OAuth/Supabase integration tests.

### P0-4 — Production readiness depends on unvalidated environment and placeholder content

- **Problem**: There is no central environment validation. Without Supabase variables, `/admin` throws a server exception, while the public site silently publishes demo values such as `hello@example.com`, `你的学校`, and a placeholder honor. Phase 0D standardized the documented local origin to port 3001, but it does not add runtime validation.
- **Why it matters**: A Vercel deployment can appear successful while admin is broken, metadata points at the wrong origin, and placeholder personal content is public.
- **Severity**: P0 — release-readiness blocker.
- **Recommended fix**: Add server-only environment parsing with clear required/optional groups, a controlled unavailable state for admin/private features, consistent local origin handling, and a pre-launch content checklist. Keep service-role, private password, and GitHub token variables server-only.
- **Modification risk**: Medium. Making every variable mandatory could prevent useful demo builds; separate public fallback mode from production mode.
- **Verification**: Test three matrices: no-service demo, valid preview services, and production configuration. Each should have explicit expected routes, metadata origins, and failure messages.

## P1 — correctness and reliability

### P1-1 — Admin save can report success after a failed write

- **Problem**: [`app/admin/page.tsx`](app/admin/page.tsx) ignores the Supabase `upsert` error, catches all exceptions without feedback, and redirects to `?saved=1` whenever no JavaScript exception was thrown.
- **Why it matters**: RLS, network, schema, or validation failures can silently discard an administrator's edits.
- **Severity**: P1.
- **Recommended fix**: Check `error`, return a typed action state, show pending/success/error UI, and log a sanitized server-side diagnostic.
- **Modification risk**: Medium because the server-action signature and client form state will change.
- **Verification**: Force an RLS denial and network failure; ensure the form preserves edits, shows failure, and never shows success. Verify one successful save and re-read.

### P1-2 — Stored and submitted content has no runtime schema validation

- **Problem**: Admin JSON is passed from `JSON.parse` into TypeScript-only types, while Supabase JSON is shallow-merged into `demoContent`. Arrays, URLs, required strings, and numeric values are not validated at runtime.
- **Why it matters**: Malformed or partial data can crash `.map()` calls, publish unsafe link schemes, produce `NaN`/`null` mismatches, or break layouts.
- **Severity**: P1.
- **Recommended fix**: Introduce one shared runtime schema for read and write boundaries. Validate `https:` project/media URLs and `mailto` source data, bound lengths/counts, coerce stars safely, and fall back per field rather than trusting an arbitrary JSON object.
- **Modification risk**: Medium. Existing stored content may need a migration or compatibility parser.
- **Verification**: Add malformed-row, missing-array, invalid-URL, oversized-input, and invalid-number tests; prove public pages render a safe fallback instead of throwing.

### P1-3 — Authentication and private-gate failures are opaque

- **Problem**: Password login ignores Supabase errors and always redirects to `/admin`; GitHub login does nothing when no URL is returned; OAuth exchange errors are not distinguished; an incorrect private password returns the same page with no message.
- **Why it matters**: Users cannot tell invalid credentials from configuration, network, or authorization failures, making the most sensitive flows hard to operate.
- **Severity**: P1.
- **Recommended fix**: Add typed error states, generic security-safe copy, pending/disabled states, and clear navigation back to the public site. Validate `NEXT_PUBLIC_SITE_URL` before starting OAuth.
- **Modification risk**: Medium because server actions and page query-state handling change.
- **Verification**: Exercise invalid password, non-admin account, provider error, expired OAuth code, missing configuration, and successful login cases.

### P1-4 — Private archive is only a gate and signing primitive, not a complete feature

- **Problem**: After unlock, [`app/us/private/page.tsx`](app/us/private/page.tsx) renders instructions rather than private entries or media. Nothing calls `/api/private/media`, and there is no upload/listing UI.
- **Why it matters**: The README describes a private archive experience that is not presently usable except through manual Storage operations.
- **Severity**: P1 if this feature is required for launch; otherwise P5 with the route hidden until implemented.
- **Recommended fix**: Define the archive data model and object-prefix rules, render only explicit allowed objects through the protected route, add logout/lock, and either implement admin upload or document dashboard-only management. Add rate limiting/lockout to the password action.
- **Modification risk**: High because it introduces sensitive-data lifecycle decisions and Storage authorization.
- **Verification**: Test locked, wrong-password, unlocked, expired-cookie, missing-object, disallowed-prefix, signed-URL-expiry, logout, and brute-force controls. Confirm the bucket remains private.

### P1-5 — Partial GitHub API failures remove otherwise valid projects

- **Problem**: [`lib/github.ts`](lib/github.ts) returns only successful repository fetches, and [`lib/content.ts`](lib/content.ts) replaces the full project list whenever at least one fetch succeeds.
- **Why it matters**: A deleted/private/rate-limited repository can make individual portfolio cards disappear instead of retaining manually curated data.
- **Severity**: P1.
- **Recommended fix**: Merge enrichment by repository name, preserving the original project for each failed request. Add timeout and sanitized diagnostics.
- **Modification risk**: Low.
- **Verification**: Mock a mix of 200, 404, 403, timeout, and malformed JSON responses; preserve order and every manual project.

### P1-6 — Deployment checks do not provide a reliable gate

- **Problem**: `npm run lint` is interactive and there is no ESLint config, CI workflow, route test, RLS test, browser test, or coverage threshold. Current Vitest tests cover pure helpers only.
- **Why it matters**: The passing 16 tests do not exercise authentication, server actions, Supabase authorization, APIs, error states, or responsive behavior.
- **Severity**: P1.
- **Recommended fix**: Configure ESLint CLI, add a non-interactive `typecheck` script, create CI for install/lint/typecheck/test/build/audit, and add targeted integration/E2E tests for the deployment-critical flows.
- **Modification risk**: Medium; introducing lint may surface a broad initial backlog.
- **Verification**: Run the exact CI pipeline on a clean checkout and require all checks before deployment.

### P1-7 — Sensitive utility pages are indexable and share homepage metadata

- **Problem**: There is no `robots` metadata or route-specific metadata for `/admin`, `/admin/login`, or `/us/private`; `robots.txt` is also missing.
- **Why it matters**: Login/private-gate URLs can appear in search results even though their protected content is not exposed.
- **Severity**: P1 privacy/operational concern.
- **Recommended fix**: Add page-level `noindex, nofollow` metadata for sensitive routes and a root `robots.ts` that disallows them. Keep authorization as the real control; robots is not security.
- **Modification risk**: Low.
- **Verification**: Inspect rendered `<meta name="robots">`, fetch `/robots.txt`, and confirm protected content remains inaccessible regardless of crawler behavior.

## P2 — architecture and code quality

### P2-1 — Legacy and current presentation systems are interleaved globally

- **Problem**: [`app/globals.css`](app/globals.css) imports [`app/legacy.css`](app/legacy.css), which mixes still-used admin/timeline rules with obsolete home styles and broad global `h3`, `input`, and `button` selectors. [`app/admin-fixes.css`](app/admin-fixes.css) globally patches `.private-gate form:first-of-type`.
- **Why it matters**: Small page changes can produce cross-route regressions; the login and private gate already depend on selector order rather than explicit component styles.
- **Severity**: P2.
- **Recommended fix**: During a dedicated cleanup, split shared tokens/reset from route styles, move login/private styles beside their routes, and remove selectors proven unused. Do not redesign while doing this.
- **Modification risk**: Medium to high because CSS order is load-bearing.
- **Verification**: Screenshot-diff `/`, `/us`, `/admin/login`, `/admin`, and `/us/private` at desktop/mobile before and after.

### P2-2 — Dead or superseded code remains in the active tree

- **Problem**: `HonorCarousel` and its helper/tests are superseded by `HonorsRail`; `SceneController` and `scene-navigation` are not used by a route; `misty-valley.png` has no reference; parts of `motion.css` target absent legacy classes.
- **Why it matters**: Duplicate concepts confuse future maintenance and keep tests passing for code users never execute.
- **Severity**: P2.
- **Recommended fix**: Confirm no planned reuse, then remove dead components, helpers, tests, selectors, and the unused asset in one reviewable cleanup.
- **Modification risk**: Low to medium; verify imports and visual snapshots first.
- **Verification**: `rg` finds no references, test/build pass, and route screenshots are unchanged.

### P2-3 — Source formatting and boundary types hinder review

- **Problem**: Several TSX and CSS files are compressed into very long lines; `AdminContentForm.updateItem` falls back to `Record<string, unknown>` and assertions.
- **Why it matters**: Security-sensitive diffs are harder to review and field-name mistakes bypass compiler help.
- **Severity**: P2.
- **Recommended fix**: Add Prettier/format checks and replace stringly collection updates with discriminated typed helpers after runtime schemas exist.
- **Modification risk**: Medium if formatting is mixed with behavior; use a formatting-only commit.
- **Verification**: Formatting check passes, semantic diff is empty for the formatting commit, and invalid field names fail TypeScript.

### P2-4 — Long-term project instructions established

- **Status**: Resolved on 2026-08-10 in a separate, user-approved documentation task.
- **Change**: Root `AGENTS.md` now defines project identity, session protocol, security controls, testing evidence, UI safeguards, Git constraints, and Chinese-first communication.
- **Residual risk**: Future sessions must follow and keep the instructions current; this does not resolve any P0 business or deployment issue.
- **Verification**: The document was cross-checked against this handoff's current P0 baseline and Git/deployment constraints.

## P3 — performance

### P3-1 — Supabase configuration turns public pages from ISR into per-request SSR

- **Problem**: Public reads use the cookie-aware client in [`lib/supabase/server.ts`](lib/supabase/server.ts). A synthetic production build with Supabase variables changed `/` and `/us` from static/ISR to dynamic routes, despite `revalidate = 60`.
- **Why it matters**: Every public request can pay a server render and Supabase query; the intended page revalidation no longer applies.
- **Severity**: P3.
- **Recommended fix**: Use a stateless server-only anonymous client for public content, add explicit Next cache/tag invalidation, and reserve the cookie-aware SSR client for authenticated routes.
- **Modification risk**: Medium because stale-content behavior changes.
- **Verification**: Production build marks public routes static/ISR with Supabase configured; a save invalidates or refreshes content within the documented interval.

### P3-2 — Homepage hydration is broad for mostly presentational content

- **Problem**: The homepage first-load JavaScript is 159 kB in the audited build. Most homepage sections are Client Components, Framer Motion is used in several small wrappers, and the root layout wraps every route in a client Motion provider.
- **Why it matters**: More JavaScript, hydration, observers, and scroll listeners are loaded than the static content alone requires.
- **Severity**: P3.
- **Recommended fix**: Keep section markup server-rendered, isolate client motion islands, lazy-load noncritical interactions, and remove the global provider if component-level reduced-motion handling is sufficient.
- **Modification risk**: Medium to high because animation behavior and hydration boundaries change.
- **Verification**: Compare route bundle reports, Lighthouse/Web Vitals, hydration warnings, and visual motion behavior including reduced motion.

### P3-3 — Image payload and layout behavior are not production-tuned

- **Problem**: Four PNG assets total roughly 7.2 MB; `quiet-coast.png` is a direct 1.8 MB CSS background; `misty-valley.png` is an unused 2.3 MB asset; the 1.5 MB OG image is larger than needed. Admin-provided timeline/honor/project images use raw `<img>`, and some lack dimensions or lazy loading.
- **Why it matters**: Mobile bandwidth, LCP, CLS, and memory can degrade, especially once real gallery content is added.
- **Severity**: P3.
- **Recommended fix**: Remove unused media, create appropriately sized AVIF/WebP variants, keep the OG asset near its target dimensions, and require dimensions/lazy loading for remote content or use a validated image proxy strategy.
- **Modification risk**: Low for compression/removal after visual review; medium for remote image architecture.
- **Verification**: Compare transfer sizes, LCP/CLS, responsive crops, and broken-image fallbacks on slow mobile throttling.

### P3-4 — Font intent is not implemented deterministically

- **Problem**: CSS and Tailwind refer to Kanit and Noto Serif SC, but there is no `next/font`, `@font-face`, or defined `--font-kanit` variable.
- **Why it matters**: Typography varies by operating system and the Tailwind theme token is ineffective.
- **Severity**: P3/P4.
- **Recommended fix**: Choose a licensed font strategy, subset only needed weights/scripts, and load it through `next/font` or self-hosted assets with fallbacks.
- **Modification risk**: Medium because Chinese font files can be very large and typography changes layout.
- **Verification**: Confirm no layout shift, correct fallback behavior, and acceptable font transfer size on Chinese and Latin text.

## P4 — UI, UX, and accessibility

### P4-1 — Mobile and tablet hero composition obscures identity content

- **Problem**: At 834 px the portrait extends beyond the right edge; at 390 px roughly half the portrait is clipped and the large Chinese name overlaps the portrait/heading. No horizontal document overflow occurs, but key content is visually crowded.
- **Why it matters**: The first screen is the site's identity anchor and becomes harder to parse on common mobile widths.
- **Severity**: P4.
- **Recommended fix**: Art-direct portrait position/scale by breakpoint, reserve a readable heading layer, and test 320–1024 px rather than only two max-width breakpoints.
- **Modification risk**: Medium because the current overlap may be intentional art direction.
- **Verification**: Approve screenshots at 320, 375/390, 768/834, 1024, 1440, and 200% zoom with no clipped essential content.

### P4-2 — Form semantics, focus, feedback, and touch targets need remediation

- **Problem**: Login/private inputs rely on placeholders instead of persistent labels; legacy CSS removes input outlines; failure text is absent; buttons are about 24–31 px high; the mobile home nav text boxes are about 22×15 px; the private gate has no back link.
- **Why it matters**: Keyboard, low-vision, cognitive, and touch users receive weak affordances and error recovery.
- **Severity**: P4, with P1 reliability overlap.
- **Recommended fix**: Add `<label>` elements, visible focus states, inline error/status regions, 44 px-class touch targets, autocomplete attributes, and return navigation.
- **Modification risk**: Low to medium.
- **Verification**: Keyboard-only pass, 200% zoom, screen-reader name/description check, and automated accessibility scan; verify every error is announced and focus moves predictably.

### P4-3 — Marquee clones duplicate interactive content for assistive technology

- **Problem**: `ProjectMarquee` renders three copies of each project as focusable links. The captured accessibility tree exposes nine links for three projects.
- **Why it matters**: Keyboard and screen-reader users must traverse repeated destinations with no new value.
- **Severity**: P4.
- **Recommended fix**: Keep one semantic link set and mark visual clones `aria-hidden` with `tabIndex={-1}`, or implement the visual loop without duplicating interactive nodes.
- **Modification risk**: Medium because animation continuity may change.
- **Verification**: The accessibility tree and Tab order contain each project once while the marquee remains visually continuous.

### P4-4 — Several small-text colors miss normal-text contrast targets

- **Problem**: Frost text at 35–50% opacity over `#0c0c0c` measures approximately 2.68:1–4.32:1; legacy muted text on the paper background is about 4.26:1. Many affected labels are small.
- **Why it matters**: Normal-size text generally needs 4.5:1 contrast for WCAG AA.
- **Severity**: P4.
- **Recommended fix**: Raise opacity/lightness for semantic text while retaining lower contrast only for decorative, nonessential marks.
- **Modification risk**: Low, with visual-brand review required.
- **Verification**: Run a contrast audit on computed colors and retest screenshots in light/dark displays.

### P4-5 — Motion handling is considerate but interaction load remains high

- **Problem**: Reduced-motion handling exists in both CSS and Framer Motion, which is a strength. In normal mode the site combines scroll-driven marquees, many fade-ins, sticky scaling, portrait looping, and wheel-driven honor changes; the one-item honor state still shows previous/next controls.
- **Why it matters**: Dense motion and no-op controls can distract or make scrolling feel busy.
- **Severity**: P4.
- **Recommended fix**: Keep reduced-motion behavior, remove no-op controls for one honor, debounce wheel interactions, and prioritize a smaller number of signature motions.
- **Modification risk**: Medium because motion is part of the brand.
- **Verification**: Test mouse, trackpad, touch, keyboard, and `prefers-reduced-motion`; ensure the page remains understandable with animation disabled.

## P5 — optional improvements

### P5-1 — SEO coverage is only partial

- **Problem**: Root title, description, Open Graph, and Twitter summary are present, but canonical URL, `og:url`, sitemap, robots, favicon/app icons, and route-specific public metadata are absent. The fallback metadata origin is localhost when `NEXT_PUBLIC_SITE_URL` is missing.
- **Why it matters**: Search indexing, duplicate URL consolidation, browser branding, and social preview reliability are incomplete.
- **Severity**: P5, except sensitive-route indexing covered in P1-7.
- **Recommended fix**: Add canonical/alternates, route metadata, `robots.ts`, `sitemap.ts`, app icons, and a production-origin helper. Optionally add Person/WebSite structured data after public identity fields are final.
- **Modification risk**: Low.
- **Verification**: Fetch the metadata endpoints, inspect rendered head tags on each public route, validate the sitemap, and test social previews against the production domain.

### P5-2 — Dependency/tooling scope can be simplified after stabilization

- **Problem**: Tailwind is configured but the site relies almost entirely on custom CSS; Tailwind currently contributes mainly its base layer. Autoprefixer and custom CSS remain useful.
- **Why it matters**: The build toolchain carries capability that may not be used intentionally.
- **Severity**: P5.
- **Recommended fix**: Decide explicitly whether future work will use Tailwind. Keep it with conventions, or remove it only after replacing the base reset and snapshot-testing all routes.
- **Modification risk**: Medium because Tailwind preflight affects default element styling.
- **Verification**: Compare computed styles and screenshots before/after, then run build and browser smoke tests.

### P5-3 — Security headers and operational observability are minimal

- **Problem**: The local production response exposes `X-Powered-By: Next.js` and has no application-defined CSP or other explicit security-header policy. There is also no structured error monitoring.
- **Why it matters**: Defense in depth and production diagnosis are weaker than they could be.
- **Severity**: P5 now; raise priority before accepting user-generated media or broader accounts.
- **Recommended fix**: Disable the powered-by header, design a CSP compatible with Next/Supabase/GitHub assets, add conservative headers, and add sanitized server error monitoring.
- **Modification risk**: Medium to high for CSP because incorrect directives can break scripts, images, OAuth, or previews.
- **Verification**: Run a header scan and exercise every route, asset, OAuth redirect, and remote-media case under the deployed CSP.

## Production configuration checklist

This checklist separates provider callbacks, application redirects, secrets, and release content.

1. Set the production domain in Vercel and set `NEXT_PUBLIC_SITE_URL=https://<production-domain>` for Production. For local development, use the documented `http://localhost:3001` origin.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and the Supabase publishable/anon key to the required Vercel environments.
3. Keep the Supabase secret/service-role key, `ADMIN_EMAILS`, `PRIVATE_ARCHIVE_PASSWORD`, and optional `GITHUB_TOKEN` server-only. Never add `NEXT_PUBLIC_` to them.
4. In Supabase Auth URL Configuration, set Site URL to the production origin. Add exact `http://localhost:3001/auth/callback` and `https://<production-domain>/auth/callback` entries to Redirect URLs. For OAuth-enabled previews, use a deliberately assigned stable preview origin and its exact callback; do not add an unconstrained preview wildcard by default.
5. In the GitHub OAuth App, use the callback shown by Supabase: `https://<project-ref>.supabase.co/auth/v1/callback`. Do not use the website `/auth/callback` route there; that route is the application's post-auth `redirectTo` target.
6. Apply the corrected RLS only through a controlled production rollout after the mandatory Phase 0C-2 actor matrix and Phase 0C-3 membership revoke/re-add tests pass. Prefer invite-only accounts for a personal admin surface.
7. Create `private-archive` as a private bucket with explicit file-size and MIME restrictions. Do not add public-read policies. Define object prefixes before adding real private files.
8. Seed and review real public content so no demo email, school, honor, or relationship placeholder is deployed.
9. Add favicon, robots, sitemap, canonical metadata, and noindex rules for sensitive routes.
10. Run the clean release gate: install, lint, typecheck, unit/integration/E2E tests, production build with real-shaped environment, dependency audit, route smoke test, and responsive/accessibility review.

Useful official references:

- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) — database roles and safe authorization claims.
- [Supabase GitHub login](https://supabase.com/docs/guides/auth/social-login/auth-github) — provider callback and application redirect flow.
- [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls) — Site URL, local URLs, and Vercel preview patterns.
- [Supabase private Storage buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals) — private access and signed URLs.
- [Next.js metadata files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) — icons, robots, sitemap, and social metadata conventions.
- [Vercel environment variables](https://vercel.com/docs/environment-variables) — Production, Preview, and Development scoping.

## Phased implementation plan

The sequence keeps security and release correctness ahead of refactoring and visual polish.

1. **Phase 0 — close release blockers**: implement and verify RLS with database-level admin authorization; correct OAuth documentation/dashboard settings; add environment validation and explicit unavailable states; plan and execute the dependency upgrade; replace placeholder content. Exit only when the Phase 0C-2 anonymous/normal/admin Data API actor matrix and Phase 0C-3 membership revoke/re-add test pass in a disposable or preview project, OAuth works end-to-end, high/critical production advisories are cleared or formally accepted, and no placeholder content is public.
2. **Phase 1 — make critical flows trustworthy**: add runtime content schemas, reliable admin action states, auth/private error handling, GitHub partial-failure preservation, and decide whether to complete or hide the private archive. Exit when all failure paths are visible, tested, and recoverable.
3. **Phase 2 — establish the deployment gate**: configure ESLint/formatting, scripts, CI, Supabase/RLS integration tests, route/API tests, and focused browser E2E tests. Exit when a clean checkout passes the full non-interactive pipeline.
4. **Phase 3 — restore static public delivery and reduce payload**: split public/authenticated Supabase clients, add cache invalidation, narrow Client Components, optimize/remove images, and settle the font strategy. Exit when public routes retain static/ISR behavior with production-shaped configuration and measured bundle/media costs improve.
5. **Phase 4 — responsive, accessibility, and SEO pass**: art-direct the hero, fix labels/focus/touch targets/contrast/marquee semantics, tune motion, add metadata files and route metadata. Exit after desktop/tablet/mobile screenshots, keyboard/screen-reader checks, and metadata endpoint validation.
6. **Phase 5 — controlled cleanup**: remove superseded components/assets/selectors, split legacy CSS, and decide Tailwind's future. The reviewed root `AGENTS.md` maintenance contract was established on 2026-08-10. Exit with no visual regressions and a concise maintenance contract.

## Next-session starting point

Phase 0D repository documentation is complete, but no provider or deployment dashboard has been changed. Before a production rollout, complete the mandatory Phase 0C-2 direct Data API actor matrix and Phase 0C-3 membership revoke/re-add test in a disposable or preview project, then perform the GitHub OAuth / Supabase Auth / Vercel configuration checklist through a separately approved manual change window. Do not treat the P0-1 migration as production-ready until those actor tests pass.

---

*Created 2026-08-10. Revised 2026-08-11 (Phase 0C disposable RLS verification status and Phase 0D OAuth documentation status). Revise the date and verified-baseline facts whenever dependencies, deployment configuration, or security posture changes.*
