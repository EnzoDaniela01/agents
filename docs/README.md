# Documentation Repository Index

This directory enforces the structured document taxonomy required by the AI agent operating rules outlined in [AGENTS.md](../AGENTS.md).

Every document must be authored or placed into its designated taxonomy category.

---

## 🗺️ Taxonomy Directory Map

| Folder | Purpose & File Types | Permitted File Extensions |
|---|---|---|
| [`01-user-manuals/`](./01-user-manuals/) | End-User Manuals, Operations & Standard Operating Procedures (SOPs) | `.docx`, `.pdf`, `.md` |
| [`02-testing-and-uat/`](./02-testing-and-uat/) | Test Matrices, QA Runbooks, UAT Sign-Off Documents | `.docx`, `.md`, `.xlsx` |
| [`03-system-specifications/`](./03-system-specifications/) | System & Module Architecture Specs, Data Schemas, Topology | `.docx`, `.md` |
| [`04-workflow-and-feature-guides/`](./04-workflow-and-feature-guides/) | Workflow diagrams, Feature Implementation Guides, Return/Disapproval flows | `.md`, `.docx` |
| [`05-integration-and-api-specs/`](./05-integration-and-api-specs/) | API Contracts, SharePoint/Power Apps integration specs, webhooks | `.md`, `.json`, `.yaml` |
| [`06-developer-guides/`](./06-developer-guides/) | Developer onboarding, token definitions, setup and automation guides | `.md` |
| [`07-sprints-and-releases/`](./07-sprints-and-releases/) | Sprint deployment notes, change logs, version release summaries | `.md` |

---

## 📑 Root Documents

Under `docs/`, only the following files are permitted directly at root:
* `docs/README.md` (this master index)
* `docs/instructions.pdf` (compiled printable documentation manual)

To regenerate `instructions.pdf`, run:
```bash
npm run docs
```

