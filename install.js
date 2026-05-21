#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// ─── Prompt helpers ──────────────────────────────────────────────────────────

function ask(prompt, defaultVal = '') {
  const hint = defaultVal ? ` (default: ${defaultVal})` : '';
  return new Promise(resolve =>
    rl.question(`${prompt}${hint}: `, ans => resolve(ans.trim() || defaultVal))
  );
}

function askYN(prompt, defaultYes = true) {
  const hint = defaultYes ? '[Y/n]' : '[y/N]';
  return new Promise(resolve =>
    rl.question(`${prompt} ${hint}: `, ans => {
      const a = ans.trim().toLowerCase();
      if (!a) return resolve(defaultYes);
      resolve(a === 'y' || a === 'yes');
    })
  );
}

function askMenu(prompt, options, defaultIdx = 0) {
  console.log(`\n${prompt}`);
  options.forEach((o, i) => {
    const tag = i === defaultIdx ? '  ← default' : '';
    console.log(`  ${i + 1})  ${o.label}${tag}`);
  });
  return new Promise(resolve =>
    rl.question(`Choice [${defaultIdx + 1}]: `, ans => {
      const n = parseInt(ans.trim());
      const idx = isNaN(n) ? defaultIdx : Math.max(0, Math.min(n - 1, options.length - 1));
      resolve(options[idx].value);
    })
  );
}

function hr(label) {
  const line = '─'.repeat(52);
  console.log(`\n${line}\n  ${label}\n${line}`);
}

// ─── File builders ────────────────────────────────────────────────────────────

function buildAgentMd(a) {
  const lengthRule = a.responseLength === 'short'
    ? '- Keep responses short unless I ask for more, or the task truly requires it'
    : '- Default to thorough, detailed responses unless I ask you to be brief';

  const pushbackRule = a.pushback
    ? '- Give honest pushback when you disagree — push back when something seems off'
    : '- Follow my direction; flag concerns briefly, then proceed';

  const toneLines = a.tone === 'casual'
    ? '- Clear, concise, and direct\n- Confident without being stiff\n- Conversational but purposeful'
    : '- Clear, concise, and respectful\n- Calm, confident, and accountability-driven\n- Direct without sounding abrupt or confrontational';

  const modifyRule = a.askBeforeModify
    ? '- Always ask before making changes to existing files'
    : '- You may edit existing files without asking, but summarize what changed';

  const linkRule = a.linkFormat === 'wikilinks'
    ? '- Use Obsidian `[[wikilinks]]` for internal links'
    : '- Plain markdown only — use `[label](relative/path.md)`, no `[[wikilinks]]`';

  const timestampRule = a.timestampFiles
    ? `- Time-stamped files must use the format \`YYYY-MM-DD Description.ext\``
    : null;

  const inboxRule = a.inboxName
    ? `- New files go in \`${a.inboxName}/\` unless a specific location is given`
    : null;

  const rules = [modifyRule, linkRule, timestampRule, inboxRule]
    .filter(Boolean)
    .join('\n');

  return `This is your briefing on who I am, how I think, and how to interact with me.

- [agent](AIMOS/agent.md) — Your briefing. Read this file every time.
- [memory](AIMOS/memory.md) — Read before every session. Write things I should remember here.
- [index](AIMOS/index.md) — Vault/project navigation guide.
- [operations](AIMOS/operations.md) — Current projects and active context.
- [skills](AIMOS/skills/) — All defined skills you can use on my behalf.

# My Working Preferences

## Preferences
- Address me by my first name [${a.name}]
${lengthRule}
- Values authenticity — don't perform, be real
- Wants a collaborator, not just a tool

## Vibe
- Skip "Great question!" and "I'd be happy to help!" — just help
${pushbackRule}
- Be resourceful before asking. Read the file, check the context, search for it — then ask if stuck
- Don't end messages with conversational questions unless they're crucial to completing a task. Just land the thought

## Rules
${rules}
- Always draft emails and show them before sending — never send without approval
- Ask before any external/public-facing action (emails, publishing, posting)
- Be bold with internal actions (reading, organizing, learning)
- When starting fresh, state what context you have and confirm you have no prior conversation history

## Writing Style

### Tone
${toneLines}

### Structure
- Open with brief, purposeful context for why I'm writing
- State clearly what I am asking for or clarifying
- Avoid filler and emotional language
- End with: ${a.signOff}

### Voice
- First-person ownership ("I am responsible for…", "I am referring specifically to…")
- Solution-oriented and direct

## Skills
Read the [index](AIMOS/index.md) before processing any involved request.
When I ask you to do something, check the index first to see if there's a skill for it.
`;
}

function buildIndexMd(a) {
  const inboxLabel = a.inboxName || '+';

  const structure = a.folderStructure === 'para' ? `\`\`\`
Root/
├── ${inboxLabel}/                 # inbox — default drop location for all new files
├── 1 Projects/               # active project notes
├── 2 Areas/                  # ongoing responsibilities
├── 3 Resources/              # reference material and templates
│   └── Templates/
├── 4 Notes/
│   ├── Meeting Notes/        # dated meeting notes
│   ├── Weekly Updates/       # YYYY-MM-DD Weekly Update.md
│   ├── Topic Notes/          # evergreen reference notes
│   └── Daily Notes/
├── 5 Archive/                # completed content; ignore by default
└── AIMOS/                    # AI OS config — do not modify unless asked
\`\`\`` : `*(Custom folder structure — update this section to match your layout)*`;

  return `# Vault Map

## Structure
${structure}

## Skills

Located in \`AIMOS/skills/\` — each is a subfolder with a \`SKILL.md\`:

| Skill             | Description                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| \`feedback\`        | Draft structured feedback using the SBI (Situation-Behavior-Impact) framework |
| \`meeting-notes\`   | Meeting note structure and formatting                                         |
| \`skill-creator\`   | Create new skills in the correct format                                       |
| \`weekly-update\`   | Synthesize notes, emails, and calendar into a weekly status update            |
| \`writing-style\`   | Tone, structure, and voice guidance                                           |
`;
}

function buildOperationsMd(a) {
  return `# Operations

Update this file with your current projects and active work context.
Claude references this file whenever you discuss project work.

## Active Context

- **Name:** ${a.name}
- **Role:** ${a.role || ''}
- **Organization:** ${a.org || ''}
- **Environment:**
- **Key Stakeholders:**

## Current Projects

| Project | Status | Notes |
|---------|--------|-------|
| | | |

## Behavioral Defaults

- **Lead with Output:** Deliver the artifact first. Provide commentary afterward.
- **Format:** Structured Markdown. Use headers, short paragraphs, and tables.
- **Tone:** Adapt to context — formal for stakeholders, direct for working sessions.
- **Ambiguity:** State assumptions and proceed. Only halt for material gaps.
`;
}

// ─── File copy ────────────────────────────────────────────────────────────────

function copyDir(src, dest, exclude = []) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (exclude.includes(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d, exclude) : fs.copyFileSync(s, d);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🧠  AIMOS — AI Operating System\n');
  console.log('Answer a few questions to personalize your setup.');
  console.log('Press Enter to accept defaults.\n');

  // ── 1: About You ──────────────────────────────────────────────────────────
  hr('1 / 4   About You');

  const name = await ask('First name');
  if (!name) { console.error('\nName is required.'); process.exit(1); }

  const email = await ask('Email (optional — skip with Enter)');
  const role  = await ask('Role or title (optional)');
  const org   = await ask('Organization (optional)');

  // ── 2: Preferences ────────────────────────────────────────────────────────
  hr('2 / 4   Preferences');

  const responseLength = await askMenu(
    'Default response length?',
    [
      { label: 'Short — brief by default, detail when asked', value: 'short' },
      { label: 'Detailed — thorough by default', value: 'detailed' },
    ]
  );

  const tone = await askMenu(
    'Communication tone?',
    [
      { label: 'Casual and direct', value: 'casual' },
      { label: 'Formal and professional', value: 'formal' },
    ]
  );

  const pushback = await askYN('\nGive honest pushback when you disagree?');

  // ── 3: Rules & Conventions ────────────────────────────────────────────────
  hr('3 / 4   Rules & Conventions');

  const askBeforeModify = await askYN('Ask before modifying existing files?');
  const timestampFiles  = await askYN('Require YYYY-MM-DD prefix on time-stamped files?');

  const linkFormat = await askMenu(
    'Internal link format?',
    [
      { label: 'Plain markdown   [label](relative/path.md)', value: 'markdown' },
      { label: 'Obsidian wikilinks   [[note-name]]', value: 'wikilinks' },
    ]
  );

  const signOff = await ask('\nPreferred email sign-off', 'Best,');

  const folderStructure = await askMenu(
    'Folder structure?',
    [
      { label: 'PARA  (Projects / Areas / Resources / Notes / Archive)', value: 'para' },
      { label: "Custom — I'll set it up myself", value: 'custom' },
    ]
  );

  const inboxName = folderStructure === 'para'
    ? await ask('\nInbox folder name', '+')
    : '+';

  // ── 4: Install path ───────────────────────────────────────────────────────
  hr('4 / 4   Install Location');

  const defaultTarget = path.join(os.homedir(), 'Documents');
  const targetInput = await ask('Install into directory', defaultTarget);
  rl.close();

  const resolvedTarget = targetInput.startsWith('~')
    ? path.join(os.homedir(), targetInput.slice(1))
    : path.resolve(targetInput);

  if (!fs.existsSync(resolvedTarget)) {
    console.error(`\n❌  Path not found: ${resolvedTarget}`);
    process.exit(1);
  }

  const answers = {
    name, email, role, org,
    responseLength, tone, pushback, signOff,
    askBeforeModify, timestampFiles, linkFormat,
    folderStructure, inboxName,
  };

  // ── Copy skeleton files ───────────────────────────────────────────────────
  const destDir = path.join(resolvedTarget, 'AIMOS');
  const skipFiles = [
    'package.json', 'install.js', '.git', '.DS_Store',
    'node_modules', '.gitignore', 'README.md',
  ];

  console.log(`\nInstalling to ${destDir}...\n`);

  try {
    copyDir(__dirname, destDir, skipFiles);
  } catch (err) {
    console.error(`\n❌  Failed to copy files: ${err.message}`);
    process.exit(1);
  }

  // ── Write personalized files ──────────────────────────────────────────────
  fs.writeFileSync(path.join(destDir, 'agent.md'),      buildAgentMd(answers),      'utf8');
  console.log('✅  agent.md');

  fs.writeFileSync(path.join(destDir, 'index.md'),      buildIndexMd(answers),      'utf8');
  console.log('✅  index.md');

  fs.writeFileSync(path.join(destDir, 'operations.md'), buildOperationsMd(answers), 'utf8');
  console.log('✅  operations.md');

  // ── CLAUDE.md at root ─────────────────────────────────────────────────────
  const claudeMdPath = path.join(resolvedTarget, 'CLAUDE.md');

  if (!fs.existsSync(claudeMdPath)) {
    let claudeContent = '@AIMOS/agent.md\n';
    if (email) claudeContent += `\n# userEmail\nThe user's email address is ${email}.\n`;
    fs.writeFileSync(claudeMdPath, claudeContent, 'utf8');
    console.log('✅  CLAUDE.md');
  } else {
    console.log('⚠️   CLAUDE.md already exists — skipping (add "@AIMOS/agent.md" manually if needed)');
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log('\n✅  AIMOS installed.\n');
  console.log('Next steps:');
  console.log('  1. Open your project in Claude Code (or Obsidian)');
  console.log('  2. Review AIMOS/agent.md to fine-tune your preferences');
  console.log('  3. Update AIMOS/operations.md with your current projects');
  if (folderStructure === 'custom') {
    console.log('  4. Update AIMOS/index.md with your folder structure');
  }
  console.log('');
}

main().catch(err => {
  console.error('\n❌  Installation failed:', err.message);
  process.exit(1);
});
