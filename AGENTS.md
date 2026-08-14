# AGENTS.md

This file is the long-term operating contract for AI coding agents working on this repository. It defines **how to work**; it is not the source of truth for current phase authorization, branch state, test results, or production configuration.

## Document authority and conflict resolution

The governance documents have distinct responsibilities:

- [`PROJECT_PLAN.md`](PROJECT_PLAN.md) is the product and phase plan-of-record. It answers **what work is authorized, why, and what acceptance requires**.
- [`HANDOFF.md`](HANDOFF.md) is the engineering state and evidence ledger. It answers **what repository and external evidence currently proves**.
- `AGENTS.md` defines **how agents must work**.

When they differ, do not silently reconcile them. Current repository, Git, test, and runtime evidence outrank stale engineering prose in `HANDOFF.md`; the newest explicit Work/User direction and `PROJECT_PLAN.md` govern product and phase authorization. Engineering evidence never grants a new phase, and an authorization never substitutes for evidence.

## Project identity and stable product constraints

- This is Zhang Xuancheng's Chinese-first personal website, with the identity thread: researcher · independent developer.
- Preserve the dark 3D Creator Portfolio visual direction. Do not redesign the overall identity without explicit user approval.
- Do not invent, infer, replace, or publish personal profile facts, media, relationship content, or biography details that the user has not confirmed.

## Required phase bootstrap protocol

Before starting a new Codex phase or engineering task:

1. Read `AGENTS.md`, `PROJECT_PLAN.md`, and `HANDOFF.md`.
2. Inspect the repository, current branch, HEAD, and working tree.
3. Locate `Current Authorized Phase` and `Current Authorized Engineering Task` in `PROJECT_PLAN.md`.
4. Check the task's scope, non-goals, stop conditions, acceptance criteria, and human decisions.
5. Implement only work that is explicitly authorized.
6. Preserve evidence while working; on completion, run proportionate verification, review the diff, and update `HANDOFF.md` with factual engineering status.
7. Report the evidence and wait for Work/User acceptance.
8. Do not automatically enter the next phase, close a phase, push, merge, release, deploy, or alter production systems.

If no phase or engineering task is authorized, stop after read-only calibration and request direction. Documentation-only work must not be used to imply authorization for product, security, deployment, or content work.

## Security and production invariants

Treat Supabase RLS, Supabase Auth, GitHub OAuth, `ADMIN_EMAILS`, `SUPABASE_SERVICE_ROLE_KEY`, `PRIVATE_ARCHIVE_PASSWORD`, `GITHUB_TOKEN`, private-archive Storage, signed URLs, `/admin`, `/auth`, `/us/private`, and `/api/private` as security-sensitive.

- Never expose a service-role key, private password, token, or other secret through `NEXT_PUBLIC_*`, source control, logs, or client-side code.
- Use deny-by-default and least-privilege database authorization. Ordinary authenticated actors must not receive unapproved CMS write access.
- Database administrator authorization must be based on controlled Auth UID membership. `ADMIN_EMAILS` is an application-level guard and cannot be the sole database authorization boundary.
- Keep private-archive Storage private. Access must remain behind authorization and short-lived signed URLs; never add public-read access for convenience.
- Before release, resolve or explicitly accept every high/critical production dependency blocker and retain evidence for that decision.
- Never disable RLS, weaken authorization, expose a secret, or modify Supabase, OAuth, Storage, Vercel, or other production configuration without explicit user approval and the applicable phase authorization.
- Confirm canonical administrator UID(s) and identity-linking status through a controlled administrative process; never derive database membership dynamically from an email match.

## Change discipline and authorization boundaries

- Do not perform a project-wide rewrite, unrelated refactor during a focused task, or large formatting change mixed with business changes.
- Split material changes into small, reviewable phases.
- Do not run `npm audit fix --force`, perform an unapproved major upgrade, force-push, delete history, push, merge, create a release, deploy, or alter remote `main` history without explicit user approval.
- Never treat a planned, skipped, deferred, partially verified, or agent-reported item as completed, accepted, or closed without the required evidence and Work/User authority.
- Do not expand scope because a related issue is visible. Record it in `HANDOFF.md` if it is a supported engineering fact, then wait for authorization.

## Subagent governance

- The lead Codex decides whether subagents add real value based on task boundaries, independence, and verification needs; do not use them merely to increase agent count.
- A subagent's self-report is not completion evidence. High-risk, security-sensitive, or broad changes require independent review or verification appropriate to the risk.
- Do not allow multiple agents to edit the same file concurrently without an explicit coordination plan.
- The lead Codex owns final scope control, conflict resolution, diff review, evidence synthesis, and user-facing reporting.
- Subagents may not expand scope, authorize a later phase, perform unapproved production actions, or close a phase. Phase closure belongs only to Work/User.

## Verification and evidence

Choose verification proportionate to the authorized change. For code-affecting work, the baseline commands are:

```bash
npm test
npx tsc --noEmit --incremental false
npm run build
```

For documentation-only work, at minimum inspect `git status`, run `git diff --check`, review `git diff`, and verify that changed files stay inside the authorized scope. Run additional checks when the documentation changes executable instructions or claims current engineering evidence.

`npm run lint` is not a reliable gate unless a non-interactive lint command has actually completed successfully. Claims such as “fixed”, “secure”, “production-ready”, or “deployment-ready” require matching, current verification evidence recorded in `HANDOFF.md`.

## UI and accessibility

For UI changes, evaluate desktop, tablet, mobile, accessibility, reduced motion, keyboard operation, touch-target size, and contrast. Preserve the established visual identity rather than changing it merely to look more modern.

## Handoff, Git, and communication

- Keep `HANDOFF.md` factual, concise, dated, and evidence-based; never turn it into a chat log or a second phase contract.
- Report primarily in Chinese. Clearly distinguish confirmed issues, hypotheses, recommendations, implemented changes, verified results, and unverified gates.
- After each substantial task, report what changed, what was verified, what remains unverified, and the recommended next step.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
