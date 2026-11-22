#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PRESETS = {
  core: [
    'universal-dev-orchestrator',
    'tdd',
    'poka-yoke',
    'five-axis-code-review',
    'technical-change-tracker'
  ],
  ui: [
    'ui-ux-pro-max',
    'ui-styling',
    'design-system',
    'design',
    'banner-design',
    'slides',
    'brand'
  ],
  qa: [
    'bug-hunter',
    'diagnosing-bugs',
    'performance-optimizer',
    'codebase-audit-pre-push'
  ],
  app: [
    'api-endpoint-builder',
    'api-and-interface-design',
    'prototype',
    'improve-codebase-architecture'
  ]
};

function getTargetProjectRoot(customDest) {
  if (customDest) {
    return path.resolve(customDest);
  }
  if (process.env.INIT_CWD) {
    return process.env.INIT_CWD;
  }
  const parts = __dirname.split(path.sep);
  const nmIndex = parts.lastIndexOf('node_modules');
  if (nmIndex !== -1) {
    return parts.slice(0, nmIndex).join(path.sep);
  }
  return process.cwd();
}

function copyFolderSync(source, target, options = { overwrite: true, dryRun: false }) {
  if (options.dryRun) {
    console.log(`  [dry-run] Would create directory: ${target}`);
  } else if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const items = fs.readdirSync(source, { withFileTypes: true });

  for (const item of items) {
    const srcPath = path.join(source, item.name);
    const destPath = path.join(target, item.name);

    if (item.isDirectory()) {
      copyFolderSync(srcPath, destPath, options);
    } else {
      if (!options.overwrite && fs.existsSync(destPath)) {
        continue;
      }
      if (options.dryRun) {
        console.log(`  [dry-run] Would copy file: ${item.name} -> ${destPath}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

function getAvailableSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) return [];
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function printUsage() {
  console.log(`
@enzosoti/agents CLI

Usage:
  npx agents [command] [options]

Commands:
  install, add <skill...>   Install specific skill(s) or all if none specified
  install --preset=<name>   Install a preset bundle (core, ui, qa, app)
  install --all             Install all available skills
  update                    Pull latest changes and sync updated skills
  list                      List all available agent skills and bundles
  link [options]            Generate IDE agent pointers (.cursorrules, CLAUDE.md, etc.)
  help                      Show this help message

Options:
  --preset=<name>           Select a bundle (core | ui | qa | app)
  --dry-run                 Simulate installation without writing changes
  --force, -f               Overwrite existing files without prompting
  --skip-existing           Preserve existing files in target project (default in postinstall)
  --dest <dir>              Specify custom installation destination directory
  --cursor                  Generate .cursorrules (for 'link')
  --claude                  Generate CLAUDE.md (for 'link')
  --windsurf                Generate .windsurfrules (for 'link')
  --copilot                 Generate .github/copilot-instructions.md (for 'link')
`);
}

function run() {
  const args = process.argv.slice(2);
  const packageRoot = path.resolve(__dirname, '..');
  const sourceAgentsDir = path.join(packageRoot, '.agents');
  const sourceSkillsDir = path.join(sourceAgentsDir, 'skills');

  // Parse dest option if provided (--dest <dir> or --dest=<dir>)
  let customDest = null;
  const destIndex = args.indexOf('--dest');
  if (destIndex !== -1 && args[destIndex + 1]) {
    customDest = args[destIndex + 1];
  } else {
    const destEquals = args.find((a) => a.startsWith('--dest='));
    if (destEquals) {
      customDest = destEquals.split('=')[1];
    }
  }

  const targetProjectRoot = getTargetProjectRoot(customDest);
  const destAgentsDir = path.join(targetProjectRoot, '.agents');
  const destSkillsDir = path.join(destAgentsDir, 'skills');

  const command = args[0] || 'install';

  if (command === 'help' || command === '--help' || command === '-h') {
    printUsage();
    return;
  }

  const availableSkills = getAvailableSkills(sourceSkillsDir);

  if (command === 'list' || command === 'ls') {
    console.log('\nAvailable Agent Skills:');
    console.log('-----------------------');
    availableSkills.forEach((s, idx) => {
      console.log(`  ${String(idx + 1).padStart(2, ' ')}. ${s}`);
    });
    console.log(`\nTotal: ${availableSkills.length} skills`);

    console.log('\nPreset Bundles:');
    console.log('---------------');
    for (const [bundle, skills] of Object.entries(PRESETS)) {
      console.log(`  • ${bundle.toUpperCase()}: ${skills.join(', ')}`);
    }

    console.log('\nInstall with:');
    console.log('  npx agents add <skill-name>');
    console.log('  npx agents add --preset=core\n');
    return;
  }

  // Prevent self-copy if running install inside package source repo without custom dest
  if (!customDest && path.resolve(sourceAgentsDir) === path.resolve(destAgentsDir)) {
    console.log('[agents] Inside package root repository. Skipping copy.');
    return;
  }

  const isDryRun = args.includes('--dry-run');

  if (command === 'link') {
    const hasSpecificFlag =
      args.includes('--cursor') ||
      args.includes('-c') ||
      args.includes('--claude') ||
      args.includes('-cl') ||
      args.includes('--windsurf') ||
      args.includes('--copilot');

    // Default to all standard pointers if no specific flag is passed
    const isCursor = hasSpecificFlag ? (args.includes('--cursor') || args.includes('-c')) : true;
    const isClaude = hasSpecificFlag ? (args.includes('--claude') || args.includes('-cl')) : true;
    const isWindsurf = hasSpecificFlag ? args.includes('--windsurf') : true;
    const isCopilot = hasSpecificFlag ? args.includes('--copilot') : true;

    if (isCursor) {
      const cursorRulesPath = path.join(targetProjectRoot, '.cursorrules');
      const cursorContent = `# AI Agent Skills\nAgent skills and instructions are available in \`.agents/skills/\`.\nRefer to \`.agents/skills/README.md\` for the active catalog.\n`;
      if (!isDryRun) fs.writeFileSync(cursorRulesPath, cursorContent, 'utf8');
      console.log(`✅ ${isDryRun ? '[dry-run] Would create' : 'Created'} ${cursorRulesPath}`);
    }

    if (isClaude) {
      const claudePath = path.join(targetProjectRoot, 'CLAUDE.md');
      const claudeContent = `# Claude Agent Instructions\n\nWhen working on this repository, consult operational skills located in \`.agents/skills/\`.\nPrimary orchestrator: \`.agents/skills/universal-dev-orchestrator/SKILL.md\`.\n`;
      if (!isDryRun) fs.writeFileSync(claudePath, claudeContent, 'utf8');
      console.log(`✅ ${isDryRun ? '[dry-run] Would create' : 'Created'} ${claudePath}`);
    }

    if (isWindsurf) {
      const windsurfPath = path.join(targetProjectRoot, '.windsurfrules');
      const windsurfContent = `# Windsurf / Cascade Agent Instructions\nAgent skills and workflows are configured under \`.agents/skills/\`.\nAlways consult \`.agents/skills/universal-dev-orchestrator/SKILL.md\` before executing code refactors.\n`;
      if (!isDryRun) fs.writeFileSync(windsurfPath, windsurfContent, 'utf8');
      console.log(`✅ ${isDryRun ? '[dry-run] Would create' : 'Created'} ${windsurfPath}`);
    }

    if (isCopilot) {
      const copilotDir = path.join(targetProjectRoot, '.github');
      const copilotPath = path.join(copilotDir, 'copilot-instructions.md');
      const copilotContent = `# GitHub Copilot Workspace Instructions\n\n- Read available engineering skills in \`.agents/skills/\`.\n- Review \`AGENTS.md\` for repository operating standards and quality gates.\n`;
      if (!isDryRun) {
        if (!fs.existsSync(copilotDir)) fs.mkdirSync(copilotDir, { recursive: true });
        fs.writeFileSync(copilotPath, copilotContent, 'utf8');
      }
      console.log(`✅ ${isDryRun ? '[dry-run] Would create' : 'Created'} ${copilotPath}`);
    }
    return;
  }

  const isForce = args.includes('--force') || args.includes('-f') || command === 'update';
  const isPostinstall = process.env.npm_lifecycle_event === 'postinstall';
  // If postinstall and not force, do not overwrite modified files
  const overwrite = isForce || !isPostinstall;

  let selectedSkills = [];

  // Check for preset flag: e.g. --preset=ui or --preset=core
  const presetArg = args.find((arg) => arg.startsWith('--preset='));
  if (presetArg) {
    const presetName = presetArg.split('=')[1].toLowerCase();
    if (PRESETS[presetName]) {
      selectedSkills = [...selectedSkills, ...PRESETS[presetName]];
      console.log(`[agents] Loaded preset '${presetName}': ${PRESETS[presetName].join(', ')}`);
    } else {
      console.warn(`⚠️  [agents] Unknown preset '${presetName}'. Available: ${Object.keys(PRESETS).join(', ')}`);
    }
  }

  if (command === 'add' || command === 'install') {
    const rawSkills = args.slice(1).filter((arg) => !arg.startsWith('-'));
    if (rawSkills.length > 0) {
      selectedSkills = [...selectedSkills, ...rawSkills];
    }
  }

  // Deduplicate skills
  selectedSkills = Array.from(new Set(selectedSkills));

  if (selectedSkills.length > 0) {
    // Install specific skills
    console.log(`[agents] ${isDryRun ? '[dry-run] Simulating install of' : 'Installing'} selected skill(s) into: ${targetProjectRoot}...`);
    if (!isDryRun && !fs.existsSync(destSkillsDir)) {
      fs.mkdirSync(destSkillsDir, { recursive: true });
    }

    for (const skill of selectedSkills) {
      if (!availableSkills.includes(skill)) {
        console.warn(`⚠️  [agents] Skill "${skill}" not found. Run 'npx agents list' to view available skills.`);
        continue;
      }
      const srcSkillDir = path.join(sourceSkillsDir, skill);
      const destSkillDir = path.join(destSkillsDir, skill);
      copyFolderSync(srcSkillDir, destSkillDir, { overwrite, dryRun: isDryRun });
      console.log(`  ✓ ${isDryRun ? 'Validated' : 'Installed'} skill: ${skill}`);
    }

    // Also copy top-level manifest, README, and AGENTS.md rules if missing
    ['.antigravity-install-manifest.json', 'README.md'].forEach((file) => {
      const srcFile = path.join(sourceSkillsDir, file);
      const destFile = path.join(destSkillsDir, file);
      if (fs.existsSync(srcFile) && (!fs.existsSync(destFile) || overwrite)) {
        if (isDryRun) {
          console.log(`  [dry-run] Would copy manifest file: ${file}`);
        } else {
          fs.copyFileSync(srcFile, destFile);
        }
      }
    });

    const rootAgentsMd = path.join(packageRoot, 'AGENTS.md');
    const destAgentsMd = path.join(targetProjectRoot, 'AGENTS.md');
    if (fs.existsSync(rootAgentsMd) && (!fs.existsSync(destAgentsMd) || isForce)) {
      if (isDryRun) {
        console.log(`  [dry-run] Would copy AGENTS.md to root`);
      } else {
        fs.copyFileSync(rootAgentsMd, destAgentsMd);
      }
      console.log('  ✓ Installed AGENTS.md operating rules in project root');
    }

    console.log(isDryRun ? '✅ [agents] Dry-run completed!' : '✅ [agents] Done!');
  } else {
    // Install everything
    console.log(`[agents] ${isDryRun ? '[dry-run] Simulating install of all agents & skills into' : 'Installing all agents & skills into'}: ${targetProjectRoot}...`);
    copyFolderSync(sourceAgentsDir, destAgentsDir, { overwrite, dryRun: isDryRun });

    const rootAgentsMd = path.join(packageRoot, 'AGENTS.md');
    const destAgentsMd = path.join(targetProjectRoot, 'AGENTS.md');
    if (fs.existsSync(rootAgentsMd) && (!fs.existsSync(destAgentsMd) || isForce)) {
      if (isDryRun) {
        console.log(`  [dry-run] Would copy AGENTS.md to root`);
      } else {
        fs.copyFileSync(rootAgentsMd, destAgentsMd);
      }
      console.log('  ✓ Installed AGENTS.md operating rules in project root');
    }

    console.log(`✅ [agents] Successfully synchronized .agents folder to ${targetProjectRoot}`);
  }
}

try {
  run();
} catch (err) {
  console.error('❌ [agents] Error during execution:', err);
  process.exit(1);
}
