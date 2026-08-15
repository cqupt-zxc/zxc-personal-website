# Project plan of record

This document is the authoritative Product / Phase plan-of-record for Zhang Xuancheng's personal website. It defines what may be done, why it matters, the acceptance required, and which decisions remain human-owned. It does not replace engineering evidence in [`HANDOFF.md`](HANDOFF.md) or agent operating rules in [`AGENTS.md`](AGENTS.md).

> **Document status:** Living plan-of-record. Last revised 2026-08-15.
>
> **Current Overall Phase:** **Phase 1 — Portfolio Product Foundation & Selective Rebuild (Active)**
>
> **Current Authorized Phase:** **Phase 1 — Portfolio Product Foundation & Selective Rebuild**
>
> **Current Authorized Engineering Task:** **None — Phase 1B-0 is closed**
>
> **Current Engineering Task Status:** **No active task**
>
> **Phase 0 release-readiness track:** **Open; not closed. Phase 0G-1 remains Not Yet Authorized.**

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
- [Phase 1B-0 closure record](#phase-1b-0-closure-record)
- [Closed phase contract](#closed-phase-contract)
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

Work/User accepted and closed Phase 1A, then accepted the evidence for and closed **Phase 1B-0 — Source Protection and Inventory** on 2026-08-15. Phase 1B-0 established a privacy-safe source inventory and recorded the user's public-use decision for the currently retained material.

This closure does not close Phase 0, authorize Phase 0G-1 or Phase 0G-2, permit UI implementation or any code or website-content change, publish personal material, permit production configuration or deployment, or authorize Phase 1B-2, Phase 1B-3, or any later Phase 1 task.

Action: no engineering task is active. Wait for a new explicit Work/User authorization.

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
| Phase 0 | Resolve release blockers through authorized repository work and separately approved external verification. | Open release-readiness track; no active Phase 0 subtask authorized. |
| Phase 0G-1 | Production Content & Placeholder Audit. | Planned; not yet authorized. |
| Phase 0G-2 | Any follow-on production-content work after an approved audit. | Not executed; not authorized. |
| Phase 1 | Build a clear, credible, responsive Chinese-first portfolio through selective rebuilding while preserving the established identity and security boundaries. | Active; no current engineering task authorized. |
| Phase 1A | Rebuild the homepage product foundation: narrative, responsive composition, selected work, interaction hierarchy, content integrity, and accessibility. | Closed by Work/User. |
| Phase 1B | Establish a privacy-safe content foundation and develop approved material toward portfolio case studies through separately authorized tasks. | Phase 1B-0 closed; no later Phase 1B task authorized. |
| Phase 1B-0 | Protect source material, create a privacy-safe inventory, and classify content for later human decisions. | Closed by Work/User on 2026-08-15. |
| Phase 1B-2 | Information architecture and case-study specification based only on approved content. | Draft / roadmap; not authorized. |
| Phase 1B-3 | UI implementation and publication work. | Not authorized. |
| Phase 2 | Establish the deployment gate: non-interactive quality checks, CI, and focused integration/E2E coverage. | Draft / roadmap; not authorized. |
| Phase 3 | Restore static public delivery and reduce payload. | Draft / roadmap; not authorized. |
| Phase 4 | Responsive, accessibility, and SEO improvements. | Draft / roadmap; not authorized. |
| Phase 5 | Controlled cleanup after stabilization. | Draft / roadmap; not authorized. |

Action: create a complete phase contract only when Work/User authorizes a specific task.

## Current overall phase

**Phase 1 — Portfolio Product Foundation & Selective Rebuild is Active.** The accepted Website Product Discovery & Experience Audit, Phase 1A result, and closed Phase 1B-0 evidence are the current product basis. No Phase 1B task is currently authorized; no later Phase 1B task is implied.

The Phase 0 release-readiness track remains Open. Deferred RLS actor checks, production-provider verification, private-access verification, and the separately planned Phase 0G-1 content audit are not completed or superseded by Phase 1.

Action: treat Phase 1 product construction and the still-open Phase 0 release-readiness gates as separate tracks; neither closes the other automatically.

## Current authorized phase and engineering task

**Current Authorized Phase: Phase 1 — Portfolio Product Foundation & Selective Rebuild.**

**Current Authorized Engineering Task: None.**

**Status: No active engineering task.**

Work/User closed Phase 1B-0 on 2026-08-15 after accepting its evidence and results. UI implementation, code or website-content changes, personal-material publication, Phase 1B-2, Phase 1B-3, Phase 0G-1, Phase 0G-2, production operations, deployment, release, push, and merge remain unauthorized.

Action: preserve the closed record and wait for a new explicit Work/User authorization.

## Phase 1B-0 closure record

### Phase 1B-0 — Source Protection and Inventory

**Authorization:** Work/User approved the Phase 1B contract and authorized Phase 1B-0 on 2026-08-15. For this authorization, Phase 1B-0 includes source protection, privacy-safe inventory, and read-only content classification analysis. It does not authorize automatic progression to any later Phase 1B task.

**Goal:** Establish a trustworthy, privacy-safe content foundation from the user's personal-material source set before any material is adapted, implemented, or published.

**Permitted scope:**

- Calibrate the current repository, Git state, and the location and tracking risk of the personal-material source set without changing application behavior.
- Inspect the source set only as needed to create a bounded inventory of file groups, formats, provenance, likely portfolio relevance, duplication, and review priority.
- Assign privacy-safe source identifiers so later analysis can cite evidence without copying sensitive contents into repository documentation.
- Classify candidate material as **Confirmed public content**, **Private content**, or **Need user confirmation**, recording the basis and uncertainty for each classification.
- Produce a content-review summary and a concise list of decisions that require Work/User confirmation.
- Update `PROJECT_PLAN.md` or `HANDOFF.md` only when needed to preserve approved authorization or factual engineering evidence; do not reproduce private source contents in either file.
- Use subagents for bounded, read-only inventory, content analysis, or independent review when they add value and comply with `AGENTS.md`.

**Source-protection boundary:**

- Treat the personal-material source directory as sensitive input, not project content. If repository calibration finds it inside the Git working tree, it must remain untracked and uncommitted unless Work/User explicitly approves a different protection measure.
- Codex may inspect the source set, identify exposure risks, propose protections, and take only reversible, non-destructive protection steps that do not relocate, rename, delete, batch-copy, publish, or commit the source material.
- If adequate protection requires choosing between moving the source set outside the repository and changing ignore policy, or requires another material file operation, Codex must stop and request explicit Work/User approval.

**Classification rules:**

- **Confirmed public content** requires a reliable source and explicit Work/User approval for public use; prior public availability alone is not sufficient permission for this site.
- **Private content** must not be copied into public drafts, repository content, screenshots, logs, prompts, or implementation artifacts.
- **Need user confirmation** is the default whenever ownership, accuracy, sensitivity, intended audience, or publication permission is uncertain.
- A source's existence, an AI-generated summary, or a plausible inference does not convert it into an approved personal fact.

**Constraints:**

- Preserve every stable product, privacy, authorization, security, and production constraint in this plan and `AGENTS.md`.
- Use minimum necessary access and minimum necessary quotation. Prefer metadata, source IDs, and short neutral summaries over reproducing source content.
- Keep public/private classification explicit and traceable. Never downgrade uncertainty to create a more complete portfolio narrative.
- Do not stage or commit personal source files. Do not add a dependency, change schema or migration state, or alter production configuration.
- Multiple agents must not process or copy the same sensitive source batch without a coordination boundary; the lead Codex owns the final classification and evidence synthesis.

**Non-goals:**

- UI implementation, component or style work, application-code changes, website-content changes, or publication of any personal material.
- Drafting a finished public biography or portfolio case study, even when source material appears sufficient.
- Phase 1B-2 information architecture, Phase 1B-3 UI implementation, or any later Phase 1B task.
- Phase 0G-1, Phase 0G-2, production content replacement, production verification, deployment, release, push, or merge.
- Moving, deleting, renaming, or bulk-copying the personal-material source directory without renewed explicit approval.

**Production permissions:** None. No Supabase, GitHub OAuth, Vercel, Storage, deployment, domain, release, or other production operation is authorized.

**Release impact:** None. Phase 1B-0 creates a private analysis and decision foundation only. It does not change the website, establish production readiness, or approve any content for publication by itself.

**Human decisions resolved for this task:**

- Work/User confirmed that every item retained in the current source set may be publicly used.
- Work/User selected the precise root-directory ignore rule; no relocation is required for this closed task.
- Any later use still requires separate authorization and source-specific validation of factual claims, rights, third-party consent, and contextual redaction.

**Acceptance criteria:**

1. The source set's Git exposure and handling risks are calibrated and reported without destructive or unauthorized file operations.
2. A privacy-safe inventory covers the relevant source groups and uses source identifiers rather than exposing sensitive contents in repository documentation.
3. Candidate content is clearly separated into **Confirmed public content**, **Private content**, and **Need user confirmation**, with no unverified item promoted to public fact.
4. Private content is excluded from public drafts, repository content, screenshots, logs, and implementation artifacts.
5. A decision list identifies the exact Work/User confirmations required before any later content or UI task.
6. The final repository diff contains no application code, dependency, schema, migration, production configuration, website-content, personal-source publication, Phase 0G-1, or Phase 1B-3 change.
7. The work stops after Phase 1B-0 evidence is presented; no later Phase 1B task begins automatically.

**Required evidence:**

- Initial and final branch, HEAD, and working-tree calibration, including whether personal source files remain untracked and uncommitted.
- A privacy-safe inventory summary with source groups, source IDs, formats, review priority, and known limitations.
- A classification matrix covering **Confirmed public content**, **Private content**, and **Need user confirmation**, with supporting basis and uncertainty but without unnecessary sensitive quotations.
- A Work/User decision list and a record of any material that could not be safely classified.
- `git status`, `git diff --check`, and full diff-scope review proving that only explicitly authorized documentation evidence changed, if any repository file changed at all.
- Independent read-only review proportionate to the sensitivity and breadth of the inventory.
- A factual `HANDOFF.md` update only if repository evidence or task status needs recording; private source content must not be copied into it.

**Verification plan:** Complete the phase bootstrap; calibrate Git and source exposure; define privacy-safe source IDs and bounded review batches; inventory and classify with minimum necessary access; independently review the classification and scope; inspect the final Git diff and tracking state; record factual evidence without private details; report limitations and human decisions; and stop.

**Stop / escalation conditions:** Stop and request Work/User direction if source handling requires a destructive or material file operation, a source contains highly sensitive material that cannot be safely summarized, public permission is ambiguous, source ownership or accuracy is disputed, adequate analysis would expose private data, or the work would require code, website content, a later Phase 1B task, Phase 0G-1, or production access.

**Closure authority:** Work/User only.

**Status:** Closed by Work/User on 2026-08-15.

Action: retain this accepted record as historical scope and evidence context. Its closure does not authorize Phase 1B-2, Phase 1B-3, Phase 0G-1, production work, deployment, release, push, or merge.

## Closed phase contract

### Phase 1A — Homepage Product Foundation & Selective Rebuild

**Authorization:** Work/User authorization issued 2026-08-14 after acceptance of the Website Product Discovery & Experience Audit.

**Goal:** Transform the current visually distinctive but product-incomplete homepage into a clear, credible, responsive Chinese-first portfolio foundation. The result should communicate identity, selected work, working approach, supporting evidence, and a next action without losing the established dark creator direction.

**Permitted scope:**

- Investigate and modify the public homepage route, homepage-specific components, homepage styles, and homepage assets.
- Modify shared navigation, layout, typography, or motion utilities only where required for the homepage experience, while preserving the behavior of routes outside this contract.
- Selectively rebuild the homepage narrative around identity promise, selected work, project evidence, research/development journey, capabilities or working method, conditional recognition, beyond-work context, and contact.
- Recompose the hero and project presentation for desktop, tablet, and mobile rather than compressing the desktop layout.
- Remove duplicated homepage focus targets, no-op controls, public placeholder presentation, and homepage-only dead or superseded presentation code when repository evidence proves removal is safe.
- Use currently installed dependencies and existing verified project data. Add or update focused tests needed to prove the Phase 1A acceptance criteria.
- Use subagents when they add bounded exploration, implementation, review, accessibility, or verification value under the rules in `AGENTS.md`.

**Design references:**

| Reference | Authorized use | Boundary |
|:--|:--|:--|
| [`提示词.txt`](提示词.txt) | Original design specification and historical composition reference for the current creator-portfolio direction. | The names, biography, services, projects, external images, GIF URLs, code choices, and other example content are not user facts or automatically approved assets. |
| [MotionSites](https://motionsites.ai/) | Inspiration for high-impact landing-page composition, motion pacing, section transitions, and visual storytelling. | Inspiration only; do not clone a page, reproduce branding, hotlink preview assets, or treat prompts and media as project-owned. |
| [React Bits](https://reactbits.dev/) | Inspiration for focused React interactions and motion primitives. | Evaluate each idea against accessibility, reduced motion, performance, maintenance cost, and the existing stack; do not add components merely for spectacle. |
| [Aceternity UI](https://ui.aceternity.com/) | Inspiration for premium landing-page patterns, micro-interactions, typography, cards, and spatial effects. | Inspiration only; do not copy a template or create a visually derivative site. Any code or asset reuse would require separate license and technical review. |

These references are visual and interaction inputs, not fidelity targets. The accepted product direction remains **Editorial Tech / Research Studio × restrained 3D**. Product clarity, authentic evidence, Chinese-first communication, responsive composition, accessibility, and the site's own identity outrank resemblance to any reference.

**Constraints:**

- Preserve the researcher · independent developer identity, Chinese-first presentation, dark creator direction, and explicit public/private separation.
- Use only user-confirmed personal facts and assets. Absence of information requires hiding, deferring, or preserving a neutral structure—not invention.
- GitHub enrichment remains optional; the homepage must retain baseline value when enrichment is unavailable, partial, or disabled.
- Preserve UID-based authorization, server-only secrets, private Storage, least privilege, fail-closed production behavior, and every other security invariant in `AGENTS.md`.
- Prefer a small number of purposeful interactions. Provide reduced-motion behavior and avoid motion that blocks reading, navigation, or touch use.
- Do not introduce or upgrade dependencies without renewed Work/User authorization.
- Follow the installed Next.js version's repository documentation before changing framework-sensitive code.

**Non-goals:**

- Phase 0G-1, Phase 0G-2, production content replacement, or completion of unresolved Phase 0 gates.
- Changes to `/us`, `/us/private`, `/admin`, `/auth`, private APIs, Supabase schema or migrations, authentication, authorization, Storage, OAuth, or production configuration, except a minimal shared-layout adjustment that does not alter route behavior and is necessary for the homepage.
- Production deployment, release, push, merge, or remote repository operations.
- A complete CMS rebuild, new project-detail route, portfolio-wide redesign, or later Phase 1 work.
- Copying reference sites, external branding, copyrighted media, example biographies, or example project content.

**Production permissions:** None. No Supabase, GitHub OAuth, Vercel, Storage, deployment, domain, release, or other production operation is authorized.

**Release impact:** Phase 1A may produce a locally verified homepage candidate. It does not establish production readiness, close Phase 0, or authorize release or deployment.

**Human decisions required:**

- Work/User must supply or confirm any personal biography, education, honors, contact information, project claims, project media, or external links that are not already established as approved content.
- If the current portrait or another personal asset would be materially changed, replaced, or newly published, Codex must stop for approval.
- If credible homepage completion requires a new project-detail route, paid/reference asset, new dependency, or scope outside the homepage, Codex must request a separate decision.

**Acceptance criteria:**

1. The homepage communicates identity, direction, selected evidence, and a clear next action within its first meaningful browsing sequence.
2. The narrative follows the accepted Discovery structure without requiring every optional section to render when confirmed content is absent.
3. Desktop, tablet, and mobile use intentionally composed layouts; the mobile hero and project areas have no destructive clipping, overlap, or desktop-only interaction dependency.
4. Selected work prioritizes a small number of credible projects and does not use repeated cards or duplicated focusable links to simulate volume.
5. Placeholder biography, school, honors, contact, projects, or other unconfirmed personal content is not presented as fact. Optional sections hide cleanly when confirmed content is unavailable.
6. Navigation, primary calls to action, keyboard interaction, touch targets, contrast, and reduced-motion behavior are usable.
7. Motion and 3D effects support hierarchy and storytelling without overwhelming reading, degrading core navigation, or becoming required for comprehension.
8. Baseline homepage value remains available when GitHub enrichment is missing, partial, or fails.
9. Routes and security-sensitive behavior outside the permitted scope remain unchanged unless an explicitly documented minimal shared-layout adjustment was required.
10. The final diff contains no dependency, schema, migration, production configuration, deployment, Phase 0G-1, or unconfirmed personal-content change.

**Required evidence:**

- Before/after screenshots of the homepage at representative desktop, tablet, and mobile viewports.
- A keep/rebuild/remove implementation summary mapped to the accepted Discovery findings.
- Keyboard, focus, touch-target, contrast, and reduced-motion review results.
- Evidence that duplicated interactive links, placeholder presentation, and conditional empty sections meet the acceptance criteria.
- `npm test`, `npx tsc --noEmit --incremental false`, and `npm run build` results.
- Focused tests for materially changed homepage behavior where practical.
- `git status`, `git diff --check`, full diff review, and confirmation that unrelated pre-existing working-tree changes were preserved.
- Independent review proportionate to the breadth of the homepage rebuild.
- Updated `HANDOFF.md` containing factual implementation, verification, limitations, and remaining blockers.

**Verification plan:** Calibrate the current branch, HEAD, working tree, homepage implementation, and Next.js guidance; capture the pre-change baseline; implement in bounded slices; check desktop/tablet/mobile and accessibility behavior; run focused tests and the repository baseline commands; perform an independent review; fix confirmed findings; re-run affected verification; review the final diff; update `HANDOFF.md`; and stop for Work/User acceptance.

**Stop / escalation conditions:** Stop and request renewed Work/User direction if implementation requires personal facts or assets that are not confirmed, a dependency change, a new route, production access, a security-model change, external asset licensing assumptions, a material change to the approved product identity, or scope beyond the public homepage foundation. Also stop if unrelated working-tree changes prevent a safe bounded diff.

**Closure authority:** Work/User only.

**Status:** Closed by Work/User on 2026-08-15.

Action: retain this accepted contract as historical scope and acceptance context. Its closure does not authorize further work.

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
| Website Product Discovery & Experience Audit | Verified completed / accepted | Work/User accepted the read-only audit on 2026-08-14 as the product basis for Phase 1. |
| Phase 1 | Active; no current engineering task authorized | Phase 1A and Phase 1B-0 are closed. No later Phase 1B task may be inferred or started. |
| Phase 1A — Homepage Product Foundation & Selective Rebuild | Closed | Work/User accepted Phase 1A; implementation evidence remains in `HANDOFF.md` and repository history. |
| Phase 1B — Content Foundation & Portfolio Case Study | Phase 1B-0 closed; no later task authorized | The broader contract remains a roadmap; later work requires a new authorization. |
| Phase 1B-0 — Source Protection and Inventory | Closed by Work/User | Work/User accepted the evidence and results on 2026-08-15. Closure does not authorize content publication or UI work. |
| Phase 1B-2 / Phase 1B-3 | Not executed / not authorized | Information architecture, case-study implementation, UI work, and publication require separate authorization. |

Action: use `HANDOFF.md` rather than this register for commit, test, and external-verification detail.

## Human decisions and open product questions

The following decisions need Work/User direction; Codex must not infer them.

1. Whether and when to authorize Phase 0G-1, including the approved source for every personal-content replacement.
2. The production change window and owners for Supabase, GitHub OAuth, Vercel, and private Storage verification.
3. The canonical administrator Auth UID(s) after identity-linking inspection.
4. Whether the private archive is a launch requirement, a later feature, or should remain hidden until complete.
5. The source-specific factual claims, rights, third-party consent, and contextual redaction required by any later use of the user-approved material.
6. Whether the personal-material source set should later be moved outside the repository or protected through an approved ignore-policy change.
7. Any later information-architecture, case-study, UI, personal-asset, new-route, asset-license, or dependency decision beyond Phase 1B-0.

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
| 2026-08-14 | Accepted the Website Product Discovery & Experience Audit, established the product-led Phase 1 direction, and authorized Phase 1A homepage implementation without closing Phase 0 or authorizing production work. |
| 2026-08-15 | Recorded Work/User acceptance and closure of Phase 1A; approved Phase 1B and authorized only Phase 1B-0 source protection, inventory, and read-only content classification. UI implementation, publication, Phase 0G-1, and production work remain unauthorized. |
| 2026-08-15 | Work/User accepted the Phase 1B-0 evidence and results, confirmed public use for the currently retained source set, and closed Phase 1B-0. No later Phase 1B task, UI work, publication, production operation, deployment, release, push, or merge was authorized. |

---

*Created 2026-08-12. Revised 2026-08-15 (Phase 1B-0 closure). Maintained by Work/User as the authorization record, with Codex updating it only under explicit direction.*
