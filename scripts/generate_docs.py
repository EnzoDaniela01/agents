import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)


def code_box(command_text, code_style):
    """Render a clean, padded, copy-paste-ready command block."""
    tbl = Table(
        [[Paragraph(command_text, code_style)]],
        colWidths=[7.2 * inch]
    )
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F1F5F9')),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#CBD5E1')),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    return tbl


def create_pdf(output_path="docs/instructions.pdf"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=42,
        bottomMargin=42
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#475569'),
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor('#1E40AF'),
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    note_style = ParagraphStyle(
        'Note',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1E3A8A')
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Code'],
        fontName='Courier-Bold',
        fontSize=8.8,
        leading=12.5,
        textColor=colors.HexColor('#0F172A')
    )

    table_header_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TD',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor('#1E293B')
    )

    story = []

    # Header
    story.append(Paragraph("@enzosoti/agents — Installation & Usage Guide", title_style))
    story.append(Paragraph(
        "Drop-in AI agent skills (45) and specialized agent personas (5) for any software engineering project",
        subtitle_style
    ))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=12))

    # Section 1: Quick Start (Copy & Paste)
    story.append(Paragraph("1. Quick Start — Copy & Paste Install", h1_style))
    story.append(Paragraph(
        "Open your terminal in the root folder of your project, copy one of the commands below, and press Enter. "
        "The installer automatically copies <b>.agents/skills/</b> (45 skills) and <b>.agents/agents/</b> (5 personas) "
        "into your project without overwriting your existing files.",
        body_style
    ))

    story.append(Paragraph("Step 1 — Install into your project (Recommended):", h2_style))
    story.append(code_box("npm install https://github.com/EnzoSoti/agents.git --save-dev", code_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Or try it once without adding to package.json:", h2_style))
    story.append(code_box("npx https://github.com/EnzoSoti/agents.git", code_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Step 2 — Connect your AI IDE (Cursor / Claude / Antigravity):", h2_style))
    story.append(code_box("npx agents link", code_style))
    story.append(Spacer(1, 8))

    tip_tbl = Table(
        [[Paragraph(
            "<b>Tip:</b> Using Yarn or pnpm? Run <b>yarn add https://github.com/EnzoSoti/agents.git --dev</b> "
            "or <b>pnpm add -D https://github.com/EnzoSoti/agents.git</b>. Both trigger the automatic setup.",
            note_style
        )]],
        colWidths=[7.2 * inch]
    )
    tip_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#EFF6FF')),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#93C5FD')),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(tip_tbl)
    story.append(Spacer(1, 6))

    # Section 2: Copy & Paste CLI Cheat Sheet
    story.append(Paragraph("2. Everyday Commands (Copy & Paste)", h1_style))
    story.append(Paragraph(
        "Use the built-in CLI to list skills, install only what you need, or pull the latest updates:",
        body_style
    ))

    cli_rows = [
        [
            Paragraph("<b>Goal</b>", table_header_style),
            Paragraph("<b>Copy & Paste Command</b>", table_header_style)
        ],
        [
            Paragraph("List all 45 available skills", table_cell_style),
            Paragraph("<b>npx agents list</b>", table_cell_style)
        ],
        [
            Paragraph("Install specific skill(s) only", table_cell_style),
            Paragraph("<b>npx agents add tdd bug-hunter ui-styling</b>", table_cell_style)
        ],
        [
            Paragraph("Install a preset bundle (core, ui, qa, app)", table_cell_style),
            Paragraph("<b>npx agents install --preset=core</b>", table_cell_style)
        ],
        [
            Paragraph("Sync all skills & agent personas", table_cell_style),
            Paragraph("<b>npx agents install --all</b>", table_cell_style)
        ],
        [
            Paragraph("Pull latest updates from GitHub", table_cell_style),
            Paragraph("<b>npm update https://github.com/EnzoSoti/agents.git</b>", table_cell_style)
        ],
        [
            Paragraph("Force overwrite local .agents/ with latest", table_cell_style),
            Paragraph("<b>npx agents install --force</b>", table_cell_style)
        ],
        [
            Paragraph("Generate IDE pointer files (.cursorrules / CLAUDE.md)", table_cell_style),
            Paragraph("<b>npx agents link</b>", table_cell_style)
        ],
    ]

    cli_tbl = Table(cli_rows, colWidths=[2.7 * inch, 4.5 * inch])
    cli_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(cli_tbl)
    story.append(Spacer(1, 8))

    # Section 3: What Gets Installed
    story.append(Paragraph("3. What Gets Installed in Your Project", h1_style))
    story.append(Paragraph(
        "• <b>.agents/agents/ (5 Specialized Personas):</b> <code>accessibility-auditor.md</code>, "
        "<code>code-reviewer.md</code>, <code>security-auditor.md</code>, <code>test-engineer.md</code>, "
        "and <code>web-performance-auditor.md</code>.<br/>"
        "• <b>.agents/skills/ (45 Modular Skills):</b> Engineering playbooks covering architecture, TDD, "
        "debugging, security, accessibility, UI/UX design systems, CI/CD, and release workflows.<br/>"
        "• <b>Non-Destructive Safety:</b> Automatic <code>npm install</code> never overwrites your customized "
        "files unless you explicitly pass <code>--force</code>.",
        body_style
    ))

    # Section 4: Core Skills Catalog
    story.append(Paragraph("4. Skills Catalog (45 Total)", h1_style))

    skills_data = [
        [
            Paragraph("<b>Skill</b>", table_header_style),
            Paragraph("<b>Category</b>", table_header_style),
            Paragraph("<b>Capabilities & Focus</b>", table_header_style)
        ],
        [
            Paragraph("<b>universal-dev-orchestrator</b>", table_cell_style),
            Paragraph("Orchestration", table_cell_style),
            Paragraph("End-to-end engineering pipeline: spec, vertical slicing, TDD, multi-agent handoffs, verification gates.", table_cell_style)
        ],
        [
            Paragraph("<b>codebase-audit-pre-push</b>", table_cell_style),
            Paragraph("QA & Security", table_cell_style),
            Paragraph("Pre-push hygiene audit: removes dead code, junk files, exposed secrets, and formatting anomalies.", table_cell_style)
        ],
        [
            Paragraph("<b>poka-yoke</b>", table_cell_style),
            Paragraph("Safety", table_cell_style),
            Paragraph("Mistake-proofing conventions: defensive boundaries, payload sanitization, and self-announcing errors.", table_cell_style)
        ],
        [
            Paragraph("<b>diagnosing-bugs / bug-hunter</b>", table_cell_style),
            Paragraph("Debugging", table_cell_style),
            Paragraph("Systematic root-cause isolation, trace analysis, minimal fixes, and regression prevention.", table_cell_style)
        ],
        [
            Paragraph("<b>five-axis-code-review</b>", table_cell_style),
            Paragraph("Code Review", table_cell_style),
            Paragraph("Structured review across Correctness, Security, Readability, Performance, and Test Coverage.", table_cell_style)
        ],
        [
            Paragraph("<b>tdd / test-driven-development</b>", table_cell_style),
            Paragraph("Testing", table_cell_style),
            Paragraph("Red-green-refactor cycles, unit & integration test design, and coverage verification.", table_cell_style)
        ],
        [
            Paragraph("<b>api-endpoint-builder</b>", table_cell_style),
            Paragraph("Backend", table_cell_style),
            Paragraph("Production REST API design with validation, error handling, RBAC auth, and OpenAPI alignment.", table_cell_style)
        ],
        [
            Paragraph("<b>ui-ux-pro-max / ui-styling</b>", table_cell_style),
            Paragraph("UI / UX", table_cell_style),
            Paragraph("Design intelligence, palettes, typography pairings, Tailwind CSS, and accessible Radix/shadcn patterns.", table_cell_style)
        ],
        [
            Paragraph("<b>design-system / brand / slides</b>", table_cell_style),
            Paragraph("Design", table_cell_style),
            Paragraph("Three-layer design tokens, brand voice consistency, banners, and executive HTML slide decks.", table_cell_style)
        ],
        [
            Paragraph("<b>accessibility-engineering</b>", table_cell_style),
            Paragraph("Accessibility", table_cell_style),
            Paragraph("WCAG 2.2 AA compliance, semantic HTML, ARIA patterns, contrast, and keyboard navigation.", table_cell_style)
        ],
        [
            Paragraph("<b>security-and-hardening</b>", table_cell_style),
            Paragraph("Security", table_cell_style),
            Paragraph("OWASP defense, threat modeling, input validation, session safety, and dependency auditing.", table_cell_style)
        ],
        [
            Paragraph("<b>spec-driven-development</b>", table_cell_style),
            Paragraph("Planning", table_cell_style),
            Paragraph("Specification-first design, capability decomposition, and structured task breakdown.", table_cell_style)
        ],
        [
            Paragraph("<b>+ 29 Additional Skills</b>", table_cell_style),
            Paragraph("Full Lifecycle", table_cell_style),
            Paragraph(
                "api-and-interface-design, banner-design, browser-testing-with-devtools, ci-cd-and-automation, "
                "code-review-and-quality, code-simplification, constraint-driven-development, context-engineering, "
                "debugging-and-error-recovery, deprecation-and-migration, design, documentation-and-adrs, "
                "doubt-driven-development, frontend-ui-engineering, git-workflow-and-versioning, idea-refine, "
                "improve-codebase-architecture, incremental-implementation, interview-me, "
                "observability-and-instrumentation, performance-optimization, performance-optimizer, "
                "planning-and-task-breakdown, prototype, shipping-and-launch, source-driven-development, "
                "technical-change-tracker, using-agent-skills.",
                table_cell_style
            )
        ]
    ]

    t = Table(skills_data, colWidths=[1.9 * inch, 1.15 * inch, 4.15 * inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))

    story.append(t)
    story.append(Spacer(1, 10))

    # Section 5: Document Landing Taxonomy
    story.append(Paragraph("5. Document Landing Taxonomy Policy", h1_style))
    story.append(Paragraph(
        "To prevent loose files from cluttering repository roots, AI agents must follow the landing taxonomy defined in <code>AGENTS.md</code>:<br/>"
        "• <b>docs/01-user-manuals/</b> — End-user manuals & SOP guides<br/>"
        "• <b>docs/02-testing-and-uat/</b> — UAT test matrices & acceptance sign-offs<br/>"
        "• <b>docs/03-system-specifications/</b> — System & module architecture specs<br/>"
        "• <b>docs/04-workflow-and-feature-guides/</b> — Workflow & feature guides<br/>"
        "• <b>docs/05-integration-and-api-specs/</b> — External integration & API contracts<br/>"
        "• <b>docs/06-developer-guides/</b> — Developer handbooks, tokens & guides<br/>"
        "• <b>docs/07-sprints-and-releases/</b> — Release notes & sprint deployment logs",
        body_style
    ))

    doc.build(story)
    print(f"Successfully generated PDF: {output_path}")


if __name__ == "__main__":
    create_pdf()
