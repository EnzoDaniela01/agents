const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Starting @enzosoti/agents repository validation...\n');

let hasErrors = false;

function check(title, fn) {
  process.stdout.write(`• ${title.padEnd(60)} `);
  try {
    fn();
    console.log('✅ PASS');
  } catch (err) {
    console.log('❌ FAIL');
    console.error(`  Error: ${err.message}`);
    hasErrors = true;
  }
}

// 1. Syntax check on bin/install.js
check('Verify bin/install.js JavaScript syntax', () => {
  execSync('node -c bin/install.js', { stdio: 'pipe' });
});

// 2. CLI Help execution
check('Execute CLI help command (node bin/install.js help)', () => {
  const output = execSync('node bin/install.js help', { encoding: 'utf8' });
  if (!output.includes('@enzosoti/agents CLI')) {
    throw new Error('CLI help output does not contain expected header');
  }
});

// 3. CLI List execution
check('Execute CLI list command (node bin/install.js list)', () => {
  const output = execSync('node bin/install.js list', { encoding: 'utf8' });
  if (!output.includes('Available Agent Skills:') || !output.includes('Total:')) {
    throw new Error('CLI list output unexpected');
  }
});

// 4. Antigravity Manifest Parity
const skillsDir = path.resolve(__dirname, '../.agents/skills');
const manifestPath = path.join(skillsDir, '.antigravity-install-manifest.json');

check('Verify .antigravity-install-manifest.json existence and parity', () => {
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Missing .antigravity-install-manifest.json');
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const actualDirs = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const manifestEntries = [...manifest.entries].sort();

  if (actualDirs.length !== manifestEntries.length) {
    throw new Error(`Directory count (${actualDirs.length}) does not match manifest count (${manifestEntries.length})`);
  }

  const missing = actualDirs.filter((d) => !manifestEntries.includes(d));
  if (missing.length > 0) {
    throw new Error(`Skills missing from manifest: ${missing.join(', ')}`);
  }
});

// 5. Check all skills have SKILL.md with valid YAML frontmatter
check('Verify all skills contain SKILL.md with valid YAML frontmatter', () => {
  const dirs = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const errors = [];
  for (const skillName of dirs) {
    const skillMd = path.join(skillsDir, skillName, 'SKILL.md');
    if (!fs.existsSync(skillMd)) {
      errors.push(`${skillName}: Missing SKILL.md`);
      continue;
    }
    const content = fs.readFileSync(skillMd, 'utf8');
    if (!content.startsWith('---')) {
      errors.push(`${skillName}: SKILL.md missing frontmatter start '---'`);
    } else if (!content.includes('name:') || !content.includes('description:')) {
      errors.push(`${skillName}: SKILL.md frontmatter missing name or description`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }
});

// 6. Check documentation taxonomy directories exist
const requiredDocsDirs = [
  'docs/01-user-manuals',
  'docs/02-testing-and-uat',
  'docs/03-system-specifications',
  'docs/04-workflow-and-feature-guides',
  'docs/05-integration-and-api-specs',
  'docs/06-developer-guides',
  'docs/07-sprints-and-releases'
];

check('Verify documentation taxonomy structure in docs/', () => {
  const missing = [];
  for (const relDir of requiredDocsDirs) {
    const fullDir = path.resolve(__dirname, '..', relDir);
    if (!fs.existsSync(fullDir)) {
      missing.push(relDir);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing taxonomy directory: ${missing.join(', ')}`);
  }
});

// 7. Check docs/README.md existence
check('Verify docs/README.md master index existence', () => {
  const readmePath = path.resolve(__dirname, '../docs/README.md');
  if (!fs.existsSync(readmePath)) {
    throw new Error('Missing docs/README.md');
  }
});

// 8. Check .agents/agents personas existence
check('Verify .agents/agents personas directory contains markdown definitions', () => {
  const agentsDir = path.resolve(__dirname, '../.agents/agents');
  if (!fs.existsSync(agentsDir)) {
    throw new Error('Missing .agents/agents directory');
  }
  const mdFiles = fs.readdirSync(agentsDir).filter((f) => f.endsWith('.md'));
  if (mdFiles.length === 0) {
    throw new Error('.agents/agents directory has no .md agent definitions');
  }
});

console.log('\n------------------------------------------------------------');
if (hasErrors) {
  console.error('❌ Validation FAILED. Please resolve errors listed above.');
  process.exit(1);
} else {
  console.log('🎉 All repository checks passed successfully!');
  process.exit(0);
}

