# `@enzosoti/agents` — AI Agent Skills Directory

This directory contains the reusable operational skills and domain knowledge bases available to AI agents across any project consuming `@enzosoti/agents`.

Specialized agent personas are also available in [`.agents/agents/`](../agents/).

---

## Core Skills Catalog

| Skill Name | Category | Primary Focus & Capabilities |
|---|---|---|
| **[`universal-dev-orchestrator`](universal-dev-orchestrator/SKILL.md)** | `orchestration` | Universal engineering operating system covering specification, planning, TDD, verification gates, two-stage review, and multi-agent coordination. |
| **[`codebase-audit-pre-push`](codebase-audit-pre-push/SKILL.md)** | `quality-assurance` | Deep audit before GitHub push: eliminates junk files, dead code, secrets, and prepares production release. |
| **[`poka-yoke`](poka-yoke/SKILL.md)** | `engineering-safety` | Mistake-proofing principles: URL de-duplication, defensive payload sanitization, self-announcing errors, and compile-time boundaries. |
| **[`diagnosing-bugs`](diagnosing-bugs/SKILL.md)** | `debugging` | Systematic root-cause isolation loop for complex regressions, race conditions, and network failures. |
| **[`bug-hunter`](bug-hunter/SKILL.md)** | `debugging` | Methodical defect identification, trace analysis, patch creation, and regression prevention. |
| **[`five-axis-code-review`](five-axis-code-review/SKILL.md)** | `code-review` | Rigorous five-axis checklist: Correctness, Security, Readability, Performance, and Test Coverage. |
| **[`tdd`](tdd/SKILL.md)** | `testing` | Test-driven development methodology: red-green-refactor cycles, unit tests, and integration coverage. |
| **[`performance-optimizer`](performance-optimizer/SKILL.md)** | `optimization` | Bottleneck profiling, payload size reduction, bundle chunking, and cache tuning. |
| **[`api-endpoint-builder`](api-endpoint-builder/SKILL.md)** | `backend-integration` | REST API endpoint design with validation, error formatting, RBAC authentication, and OpenAPI/Swagger alignment. |
| **[`ui-ux-pro-max`](ui-ux-pro-max/SKILL.md)** | `ui-ux-design` | Comprehensive UI/UX design intelligence: design styles, palettes, typography pairings, and usability heuristics. |
| **[`ui-styling`](ui-styling/SKILL.md)** | `styling` | Tailwind CSS utility patterns, Radix/shadcn-inspired components, responsive grid layouts, and dark mode theming. |
| **[`design-system`](design-system/SKILL.md)** | `design-system` | Three-layer design tokens (primitive -> semantic -> component), CSS custom properties, and component specs. |
| **[`brand`](brand/SKILL.md)** | `branding` | Visual identity, brand voice, asset management, and corporate consistency. |
| **[`banner-design`](banner-design/SKILL.md)** | `creative-assets` | Social media banners, hero graphics, and creative marketing layout generation. |
| **[`design`](design/SKILL.md)** | `creative-assets` | Comprehensive design toolkit: logo generation, CIP assets, presentation slides, and vector graphics. |
| **[`slides`](slides/SKILL.md)** | `presentations` | Strategic HTML slide decks with Chart.js visualizations, responsive tables, and executive summaries. |
| **[`prototype`](prototype/SKILL.md)** | `prototyping` | Rapid throwaway prototyping for validating state logic in terminal apps or experimenting with UI variants. |
| **[`improve-codebase-architecture`](improve-codebase-architecture/SKILL.md)** | `architecture` | Codebase deepening opportunities, seam analysis, coupling reduction, and visual HTML architecture reports. |
| **[`technical-change-tracker`](technical-change-tracker/SKILL.md)** | `session-continuity` | Structured JSON change records, state machine tracking, and cross-session bot handoffs. |

## Additional Engineering Lifecycle Skills (26)

`accessibility-engineering`, `api-and-interface-design`, `browser-testing-with-devtools`, `ci-cd-and-automation`, `code-review-and-quality`, `code-simplification`, `constraint-driven-development`, `context-engineering`, `debugging-and-error-recovery`, `deprecation-and-migration`, `documentation-and-adrs`, `doubt-driven-development`, `frontend-ui-engineering`, `git-workflow-and-versioning`, `idea-refine`, `incremental-implementation`, `interview-me`, `observability-and-instrumentation`, `performance-optimization`, `planning-and-task-breakdown`, `security-and-hardening`, `shipping-and-launch`, `source-driven-development`, `spec-driven-development`, `test-driven-development`, and `using-agent-skills`.

---

## Operating Guidelines for Agents

1. **Understand Before Editing**: Read relevant code, tests, and documentation before making changes.
2. **Apply Poka-Yoke Defaults**: Prevent avoidable errors at the boundary with validation and defensive defaults.
3. **Verify Before Concluding**: Run the repository's build, lint, and test suites before declaring any task complete.
