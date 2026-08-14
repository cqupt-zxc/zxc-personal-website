# Project plan of record

This document is the authoritative Product / Phase plan-of-record for Zhang Xuancheng's personal website. It defines what may be done, why it matters, the acceptance required, and which decisions remain human-owned. It does not replace engineering evidence in [`HANDOFF.md`](HANDOFF.md) or agent operating rules in [`AGENTS.md`](AGENTS.md).

> **Document status:** Living plan-of-record. Last revised 2026-08-14.
>
> **Current Overall Phase:** **Phase 0 — Open**
>
> **Current Authorized Phase:** **None**
>
> **Current Authorized Engineering Task:** **None**
>
> **Planned Next Task:** **Phase 0G-1 — Production Content & Placeholder Audit**
>
> **Planned Next Task Authorization:** **Not Yet Authorized**

## Contents

- [Document authority and ownership](#document-authority-and-ownership)
- [Current authorization summary](#current-authorization-summary)
- [Project identity](#project-identity)
- [Product goals and non-goals](#product-goals-and-non-goals)
- [Stable product constraints](#stable-product-constraints)
- [Governance and status vocabulary](#governance-and-status-vocabulary)
- [Phase roadmap](#phase-roadmap)
- [Current overall phase](#current-overall-phase)
- [Current authorized phase and engineering task](#current-authorized-phase-and-engineering-task)
- [Active phase contract](#active-phase-contract)
- [Historical phase register](#historical-phase-register)
- [Human decisions and open product questions](#human-decisions-and-open-product-questions)
- [Phase approval and closure protocol](#phase-approval-and-closure-protocol)
- [Update and cross-document rules](#update-and-cross-document-rules)
- [Phase contract template](#phase-contract-template)
- [Revision history](#revision-history)

## Document authority and ownership

This section establishes the separation between authorization, evidence, and agent behavior.

| Question | Source of truth | Owner |
|:--|:--|:--|
| What product/phase work is authorized, and what acceptance is required? | `PROJECT_PLAN.md`, supplemented only by newer explicit Work/User decisions not yet synchronized here | Work/User |
| What has repository, Git, test, runtime, or external evidence actually established? | `HANDOFF.md` and current repository evidence | Engineering evidence; maintained by Codex |
| How must Codex and subagents operate? | `AGENTS.md` and the current authorized phase constraints | Work/User policy, maintained in `AGENTS.md` |

An item can be **Authorized but not started**, or implemented with evidence but **Awaiting Acceptance**. Neither condition is a conflict. No engineering fact may grant authorization, and no authorization may convert missing evidence into completion.

## Current authorization summary

No product or engineering phase is currently authorized. The only completed work implied by this document is documentation governance itself; it does not authorize Phase 0G-1, Phase 0G-2, Phase 1, production configuration, deployment, or personal-content changes.

Action: wait for a new explicit Work/User authorization before engineering work begins.

## Project identity

The project is a Chinese-first personal portfolio site for Zhang Xuancheng, presenting the combined identity of researcher and independent developer through a dark 3D Creator Portfolio visual direction.

Action: preserve this identity unless Work/User explicitly approves a product or visual change.

## Product goals and non-goals

The product should present confirmed public work and identity clearly, preserve a distinctive dark 3D creator experience, and support safely managed content where that capability is authorized and verified.

| Goals | Non-goals |
|:--|:--|
| Present user-confirmed portfolio content in Chinese-first form. | Inventing, guessing, or substituting unconfirmed personal facts, media, or relationship information. |
| Maintain a secure, least-privilege path for administration and private content. | Treating app-layer email checks as a substitute for database authorization. |
| Reach a release process supported by evidence, not appearance. | Treating planned work, agent self-reports, or historical commits as production acceptance. |
| Preserve the established visual identity while improving it through authorized work. | An unapproved brand redesign, deployment, or production configuration change. |

Action: use this section to reject scope creep before implementation.

## Stable product constraints

These constraints remain in force across phases unless Work/User explicitly changes them.

- The site remains Chinese-first and retains the researcher · independent developer identity thread.
- The dark 3D Creator Portfolio direction is preserved; UI work includes responsive, keyboard, touch, contrast, and reduced-motion evaluation.
- Private data, private media, secrets, and service-role capabilities remain server-side and protected by least privilege.
- Public and private content must remain explicitly separated in access, presentation, and operational handling; a private route or asset must never become public through fallback behavior or convenience configuration.
- GitHub enrichment is an optional enhancement. The site's baseline content and public value must remain valid when enrichment is disabled, unavailable, partial, or fails.
- In Production, missing or invalid critical configuration must fail closed or enter a controlled unavailable state; sensitive features must not continue in a partially configured state.
- Database administration is UID-membership-based; `ADMIN_EMAILS` cannot be the only authorization boundary.
- Production actions require explicit approval and must not be inferred from repository access or task sequencing.
- Personal content must be user-confirmed; absence of information is not permission to guess.

Action: copy applicable constraints into every future authorized phase contract.

## Governance and status vocabulary

Use the following terms exactly; phase numbers do not prove execution.

| Status | Meaning |
|:--|:--|
| Verified completed | Required work has recorded evidence for the stated scope. It does not imply production acceptance unless that evidence says so. |
| Partially completed | Some scoped work/evidence exists, while named work or verification remains. |
| Deferred | Intentionally postponed; not completed. |
| Superseded | Replaced by a later decision or implementation; retain the historical record and its successor. |
| Not verified | No sufficient evidence supports the required claim. |
| Not executed | No implementation or external action has occurred. |
| Draft / roadmap | A proposal or future direction; it has no implementation authority. |
| Authorized | Work/User has approved the stated scope; it may still be not started. |
| In progress | Authorized work is underway and has not reached its evidence/acceptance checkpoint. |
| Awaiting acceptance | Evidence has been presented, but Work/User has not closed the phase. |
| Closed | Only Work/User may mark a phase closed after accepting the required evidence. |

Action: use the narrowest accurate term and never promote a status without evidence and authority.

## Phase roadmap

The roadmap orders future work but does not authorize it.

| Phase | Intent | Authorization status |
|:--|:--|:--|
| Phase 0 | Resolve release blockers through authorized repository work and separately approved external verification. | Open; no active subtask authorized. |
| Phase 0G-1 | Production Content & Placeholder Audit. | Planned; not yet authorized. |
| Phase 0G-2 | Any follow-on production-content work after an approved audit. | Not executed; not authorized. |
| Phase 1 | Make critical flows trustworthy: runtime schemas, reliable admin states, auth/private failure handling, GitHub partial-failure preservation, and a private-archive decision. | Draft / roadmap; not authorized. |
| Phase 2 | Establish the deployment gate: non-interactive quality checks, CI, and focused integration/E2E coverage. | Draft / roadmap; not authorized. |
| Phase 3 | Restore static public delivery and reduce payload. | Draft / roadmap; not authorized. |
| Phase 4 | Responsive, accessibility, and SEO improvements. | Draft / roadmap; not authorized. |
| Phase 5 | Controlled cleanup after stabilization. | Draft / roadmap; not authorized. |

Action: create a complete phase contract only when Work/User authorizes a specific task.

## Current overall phase

**Phase 0 is Open.** Repository-side security and readiness work has historical evidence, but deferred RLS actor checks, production-provider verification, private-access verification, and a user-confirmed content/placeholder review prevent phase closure.

Action: consult `HANDOFF.md` for the evidence and gates; do not close Phase 0 from this summary.

## Current authorized phase and engineering task

**Current Authorized Phase: None.**

**Current Authorized Engineering Task: None.**

The planned Phase 0G-1 audit remains not yet authorized. A future authorization must state the permitted files/systems, non-goals, production permissions, evidence required, and acceptance owner.

Action: stop rather than beginning the planned task automatically.

## Active phase contract

There is no active phase contract because no phase or engineering task is authorized.

Action: use the template below only after Work/User issues explicit authorization.

## Historical phase register

This register preserves the known phase history without inferring unrecorded execution.

| Phase / item | Status | Evidence boundary |
|:--|:--|:--|
| Phase 0A — RLS design | Verified completed | Repository evidence supports the design record. |
| Phase 0B — repository-side RLS implementation | Verified completed | Migration, schema alignment, and test plan are recorded in repository history. |
| Phase 0C overall | Partially completed | Phase 0C-1 is complete only within its disposable/non-production verification scope; Phase 0C-2 and Phase 0C-3 remain deferred/pending and prevent closure of Phase 0C. |
| Phase 0C-1 — disposable migration/catalog/privilege verification | Verified completed (historical external evidence; disposable / non-production only) | Historical external evidence records the completed verification; it is neither a production verification nor evidence that Phase 0C is closed. |
| Phase 0C-2 — direct actor matrix | Deferred / pending | Not completed. |
| Phase 0C-3 — membership revoke/re-add verification | Deferred / pending | Not completed. |
| Phase 0D — repository-side OAuth guidance | Verified completed | Production provider configuration and live verification are not verified. |
| Phase 0E — repository-side environment hardening | Verified completed | Production configuration and verification are not verified. |
| Phase 0F — dependency remediation | Verified completed | Historical repository verification exists; re-run evidence before release. |
| Phase 0G-1 — content & placeholder audit | Not executed | Planned next task; not yet authorized. |
| Phase 0G-2 | Not executed / not authorized | No execution may be inferred. |
| Phase 1 | Draft / roadmap / not authorized | No execution may be inferred. |

Action: use `HANDOFF.md` rather than this register for commit, test, and external-verification detail.

## Human decisions and open product questions

The following decisions need Work/User direction; Codex must not infer them.

1. Whether and when to authorize Phase 0G-1, including the approved source for every personal-content replacement.
2. The production change window and owners for Supabase, GitHub OAuth, Vercel, and private Storage verification.
3. The canonical administrator Auth UID(s) after identity-linking inspection.
4. Whether the private archive is a launch requirement, a later feature, or should remain hidden until complete.
5. The acceptance criteria and scope for the next authorized engineering phase.

Action: resolve decisions explicitly in a new Work/User authorization or update this plan before implementation.

## Phase approval and closure protocol

Work/User approves a phase by naming the permitted scope, explicit non-goals, production permissions, acceptance criteria, and the authority responsible for acceptance. Codex records the authorization here, executes only that scope, and places evidence in `HANDOFF.md`.

A phase may move to **Awaiting Acceptance** after its required evidence is presented. Only Work/User may mark it **Closed**. Codex and subagents may recommend closure but may not grant it, and must not auto-start the next phase.

Action: treat any missing authorization field as a reason to seek clarification, not as permission to assume.

## Update and cross-document rules

Update this plan when product goals, non-goals, roadmap, authorization, acceptance criteria, or human decisions change. Update `HANDOFF.md` when repository facts, commits, tests, builds, audits, blockers, or verification status change. Update `AGENTS.md` only for stable agent behavior, security invariants, and operating constraints.

When a document conflicts with current repository evidence, correct the evidence ledger without changing authorization. When Work/User makes a newer decision, update this plan without rewriting historical evidence. Audit all three documents after a non-trivial governance change so that none becomes a duplicate source of truth.

Action: preserve uncertainty explicitly; do not fill historical gaps with plausible assumptions.

## Phase contract template

Use this template for a newly authorized phase or engineering task.

```markdown
## Phase <identifier> — <title>

**Authorization:** <explicit Work/User decision and date>
**Goal:** <outcome>
**Permitted scope:** <files, systems, and actions>
**Constraints:** <stable product, security, UX, and technical constraints that apply>
**Non-goals:** <what must not be done>
**Production permissions:** <none, or the exact approved actions>
**Release impact:** <none, or affected release gate, deployment, rollback, and communication implications>
**Human decisions required:** <required inputs, approvals, and owners>
**Acceptance criteria:** <observable outcomes and required evidence>
**Required evidence:** <commits, commands, environments, screenshots, external records, or review artifacts required for acceptance>
**Verification plan:** <commands, environments, and manual checks that produce the required evidence>
**Stop / escalation conditions:** <conditions that require stopping, reporting, or renewed Work/User approval>
**Closure authority:** Work/User only
**Status:** Authorized / In progress / Awaiting acceptance / Closed
```

Action: do not mark this template active until Work/User has approved every material field.

## Revision history

| Date | Change |
|:--|:--|
| 2026-08-12 | Created the Product / Phase plan-of-record during documentation governance. Initial authorization is deliberately none; Phase 0G-1 remains planned and not yet authorized. |
| 2026-08-14 | Work-acceptance repair: added approved stable constraints, completed the phase-contract template fields, and corrected the Phase 0C-1 historical classification without changing authorization. |

---

*Created 2026-08-12. Revised 2026-08-14 (Work-acceptance repair). Maintained by Work/User as the authorization record, with Codex updating it only under explicit direction.*
