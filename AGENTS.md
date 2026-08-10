# AGENTS.md

This file is the long-term operating contract for AI coding agents working on this repository. Read it before any substantial task.

## Project identity

- This is Zhang Xuancheng's personal website, Chinese-first, with the identity thread: researcher · independent developer.
- Preserve the dark 3D Creator Portfolio visual direction. Do not redesign the overall visual identity without explicit user approval.

## Required session protocol

Before every substantial task:

1. Read `AGENTS.md` and `HANDOFF.md`.
2. Run `git status`.
3. Read the task-relevant code and configuration.
4. Confirm the current behavior and scope before making changes.

After every substantial task:

1. Run verification appropriate to the change.
2. Review `git diff`.
3. Update `HANDOFF.md` with concise, factual status changes.
4. Report: what changed; what was verified; what remains unverified; and the recommended next step.

## Security and production controls

Treat Supabase RLS, Supabase Auth, GitHub OAuth, `ADMIN_EMAILS`, `SUPABASE_SERVICE_ROLE_KEY`, `PRIVATE_ARCHIVE_PASSWORD`, `GITHUB_TOKEN`, private-archive Storage, signed URLs, `/admin`, `/auth`, `/us/private`, and `/api/private` as security-sensitive.

- Never expose a service-role key through `NEXT_PUBLIC_`, or commit real passwords, tokens, keys, private media, or other secrets.
- Never disable RLS for convenience; use deny-by-default and least-privilege database authorization.
- Database authorization must not rely only on `ADMIN_EMAILS`, client-side checks, or Next.js page checks.
- Never make private-archive Storage public; keep access behind authorization and short-lived signed URLs.
- Do not directly change production Supabase, OAuth, Storage, Vercel, or environment configuration without explicit user confirmation.

### Current release-blocker baseline

Do not lose these known P0 items during later refactors:

- `site_content` RLS currently grants authenticated users excessive write access.
- Database authorization cannot rely on `ADMIN_EMAILS` alone.
- README GitHub OAuth callback guidance is currently incorrect.
- Production dependency advisories are present.
- Production environment validation is missing.

## Change discipline

- Do not perform a project-wide rewrite, unrelated refactor during a bug fix, or large formatting change mixed with business changes.
- Split large work into small, reviewable phases.
- Do not run `npm audit fix --force`, perform an unapproved major upgrade, force-push, delete history, push, merge, create a release, or alter remote `main` history without explicit user approval.
- Do not modify production service configuration without explicit approval.

## Testing and evidence

The current baseline commands are:

```bash
npm test
npx tsc --noEmit --incremental false
npm run build
```

`npm run lint` is not yet a reliable non-interactive gate. Do not report lint as passed unless a non-interactive lint command has actually completed successfully.

Claims such as “fixed”, “secure”, “production-ready”, or “deployment-ready” require corresponding verification evidence.

## UI and accessibility

For UI changes, evaluate desktop, tablet, mobile, accessibility, reduced motion, keyboard operation, touch-target size, and contrast. Preserve the established visual identity rather than changing it merely to look more modern.

## Handoff and Git

- `HANDOFF.md` is the persistent project state: keep it factual, concise, and current; never turn it into a chat log.
- Do not push, merge, force-push, create releases, or modify remote `main` history unless the user explicitly requests it.

## Communication

Report primarily in Chinese. Clearly distinguish confirmed issues, hypotheses, recommendations, implemented changes, and verified results.
