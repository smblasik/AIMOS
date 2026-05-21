---
name: cowork-install
description: Install AIMOS into a user-selected folder using Claude Cowork — no terminal or npm needed.
tags:
  - AI
  - skill
---

Install AIMOS into a user-selected folder using Claude Cowork's native tools. No terminal, Node.js, or npm required. Follow these steps exactly and in order.

---

## Step 1 — Gather user information

Use `AskUserQuestion` to collect the following in two calls:

**Call 1 — About you (4 questions):**
- First name (required — text input)
- Email address (optional — text input)
- Role / title (optional — text input)
- Organization (optional — text input)

**Call 2 — Preferences (4 questions):**
- Response length: `Short — brief by default, expand when asked` / `Detailed — thorough by default`
- Tone: `Casual and direct` / `Formal and professional`
- Pushback: `Push back when you disagree` / `Follow my lead, flag concerns briefly`
- Email sign-off (text input, default: `Best,`)

---

## Step 2 — Confirm install folder

If the user has a workspace folder already selected in Cowork, install there.

If not, use `mcp__cowork__request_cowork_directory` to prompt them to select one.

The install creates:
```
{target}/
├── CLAUDE.md
└── AIMOS/
    ├── agent.md
    ├── index.md
    ├── memory.md
    ├── operations.md
    └── skills/
        ├── cowork-install/SKILL.md
        ├── feedback/SKILL.md
        ├── meeting-notes/SKILL.md
        ├── skill-creator/SKILL.md
        └── writing-style/SKILL.md
```

---

## Step 3 — Write CLAUDE.md

Write to `{target}/CLAUDE.md`. Do not overwrite if it already exists — warn the user instead and tell them to add `@AIMOS/agent.md` manually.

```
@AIMOS/agent.md

# userEmail
The user's email address is {email}.
```

Omit the `# userEmail` block entirely if no email was provided.

---

## Step 4 — Write AIMOS/agent.md

Write the following to `{target}/AIMOS/agent.md`, substituting all `{placeholders}` with the user's answers per the rules below the template.

```markdown
This is your briefing on who I am, how I think, and how to interact with me.

- [agent](AIMOS/agent.md) — Your briefing. Read this file every time.
- [memory](AIMOS/memory.md) — Read before every session. Write things I should remember here.
- [index](AIMOS/index.md) — Vault/project navigation guide.
- [operations](AIMOS/operations.md) — Current projects and active context.
- [skills](AIMOS/skills/) — All defined skills you can use on my behalf.

# My Working Preferences

## Preferences
- Address me by my first name [{name}]
- {response_length_rule}
- Values authenticity — don't perform, be real
- Wants a collaborator, not just a tool

## Vibe
- Skip "Great question!" and "I'd be happy to help!" — just help
- {pushback_rule}
- Be resourceful before asking. Read the file, check the context, search for it — then ask if stuck
- Don't end messages with a question unless it's crucial to completing the task. Just land the thought

## Rules
- Plain markdown only — use `[label](relative/path.md)`, no `[[wikilinks]]`
- Time-stamped files must use the format `YYYY-MM-DD Description.ext`
- New files go in `+/` unless a specific location is given
- Always ask before making changes to existing files
- Always draft emails and show them before sending — never send without approval
- Ask before any external/public-facing action (emails, publishing, posting)
- Be bold with internal actions (reading, organizing, learning)
- When starting fresh, state what context you have and confirm you have no prior conversation history

## Writing Style

### Tone
{tone_lines}

### Structure
- Open with brief, purposeful context for why I'm writing
- State clearly what I am asking for or clarifying
- Avoid filler and emotional language
- End with: {sign_off}

### Voice
- First-person ownership ("I am responsible for…", "I am referring specifically to…")
- Solution-oriented and direct

## Skills
Read the [index](AIMOS/index.md) before processing any involved request.
When I ask you to do something, check the index first to see if there's a skill for it.
```

**Placeholder substitution rules:**

| Placeholder | Value |
|---|---|
| `{name}` | User's first name |
| `{response_length_rule}` | Short → `Keep responses short unless I ask for more, or the task truly requires it` / Detailed → `Default to thorough, detailed responses unless I ask you to be brief` |
| `{pushback_rule}` | Push back → `Give honest pushback when you disagree — push back when something seems off` / Follow lead → `Follow my direction; flag concerns briefly, then proceed` |
| `{tone_lines}` | Casual → `- Clear, concise, and direct` + newline + `- Confident without being stiff` + newline + `- Conversational but purposeful` / Formal → `- Clear, concise, and respectful` + newline + `- Calm, confident, and accountability-driven` + newline + `- Direct without sounding abrupt or confrontational` |
| `{sign_off}` | User's chosen sign-off, default `Best,` |

---

## Step 5 — Write AIMOS/index.md

Write the following to `{target}/AIMOS/index.md`:

```markdown
# Vault Map

## Structure


Root/
├── +/                        # inbox — default drop location for all new files
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


## Skills

Located in `AIMOS/skills/` — each is a subfolder with a `SKILL.md`:

| Skill | Description |
|---|---|
| `cowork-install` | Install AIMOS into a folder via Claude Cowork |
| `feedback` | Draft structured feedback using the SBI framework |
| `meeting-notes` | Meeting note structure and formatting |
| `skill-creator` | Create new skills in the correct format |
| `writing-style` | Tone, structure, and voice guidance |
```

---

## Step 6 — Write AIMOS/operations.md

Write the following to `{target}/AIMOS/operations.md`, substituting user answers:

```markdown
# Operations

Update this file with your current projects and active work context.
Claude references this file whenever you discuss project work.

## Active Context

- **Name:** {name}
- **Role:** {role}
- **Organization:** {org}
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
```

Leave `{role}` and `{org}` blank if not provided.

---

## Step 7 — Write AIMOS/memory.md

Write the following to `{target}/AIMOS/memory.md` (static — no substitution needed):

```markdown
> [!note]
> Please edit this freely when I tell you to remember something.
```

---

## Step 8 — Copy skill files

Fetch each file from the URLs below and write to the corresponding path under `{target}/AIMOS/skills/`. These are static files — write them exactly as fetched without modification.

| Target path | Source URL |
|---|---|
| `AIMOS/skills/feedback/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/skills/feedback/SKILL.md |
| `AIMOS/skills/meeting-notes/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/skills/meeting-notes/SKILL.md |
| `AIMOS/skills/skill-creator/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/skills/skill-creator/SKILL.md |
| `AIMOS/skills/writing-style/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/skills/writing-style/SKILL.md |
| `AIMOS/skills/cowork-install/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/skills/cowork-install/SKILL.md |

---

## Step 9 — Confirm completion

Tell the user:
- Where AIMOS was installed (folder path)
- What was created (brief file list)
- Next step: open `AIMOS/operations.md` and fill in current projects and stakeholders

Do not link to internal file paths or expose system directories. Use plain folder names only.
