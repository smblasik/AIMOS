---
name: agentic-install
description: Install AIMOS into a user-selected folder — no terminal or npm needed.
tags:
  - AI
  - skill
---

Install AIMOS into a user-selected folder using native tools. No terminal, Node.js, or npm required. Follow these steps exactly and in order.

> **Re-install behavior:** Step 3 guards `{config_file}` against overwrite. Steps 4-8 will overwrite existing `AIMOS/*` files without prompting. If the user is reinstalling, warn them before proceeding.

---

## Step 0 — Detect AI platform

Identify yourself and set `{config_file}` from the table below. Do not ask the user unless you cannot determine your own identity.

| AI | `{config_file}` |
|---|---|
| Claude | `CLAUDE.md` |
| Codex | `AGENTS.md` |
| OpenCode | `AGENTS.md` |

If you cannot identify yourself with confidence, use `AskUserQuestion`:

> "Which AI assistant are you installing AIMOS for?"

Options: **Claude**, **Codex**, **OpenCode**, **Other**

For **Other**, ask what filename they want and use that as `{config_file}`. Treat content behavior the same as Codex (inline).

---

## Step 1 — Gather user information

Use `AskUserQuestion` to collect the following. `AskUserQuestion` caps at 4 questions per call, so split into two calls. If your platform doesn't support `AskUserQuestion`, ask these questions conversationally instead.

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

Ask the user which folder they want to install AIMOS into.

- **Most platforms:** Ask the user to provide the target folder path directly (e.g., `"Where would you like AIMOS installed?"`), then use that path as `{target}`.
- **Claude Cowork:** If a workspace folder is already selected, use it. Otherwise, use `mcp__cowork__request_cowork_directory` to prompt the user to select one.

The install creates:
```
{target}/
├── {config_file}             # CLAUDE.md for Claude, AGENTS.md for Codex
├── +/                        # default drop folder for new files
├── [framework folders]/      # created based on chosen framework (PARA, ACE, or Corder)
└── AIMOS/
    ├── agent.md
    ├── index.md
    ├── memory.md
    ├── operations.md
    └── skills/
        ├── agentic-install/SKILL.md
        ├── feedback/SKILL.md
        ├── meeting-notes/SKILL.md
        ├── skill-creator/SKILL.md
        └── writing-style/SKILL.md
```

---

## Step 3 — Write `{config_file}`

Write to `{target}/{config_file}`. **Do not overwrite if it already exists** — warn the user and tell them to add the briefing reference manually.

**Content depends on platform:**

- **Claude:** Use this exact template. Omit the `# userEmail` block entirely if no email was provided.
  ```
  @AIMOS/agent.md
  # userEmail
  The user's email address is {email}.
  ```
  Claude resolves the reference at runtime — `AIMOS/agent.md` (Step 4) is the live source.

- **Codex / Other:** Write `{target}/AGENTS.md` as the Step 3 template with the `@AIMOS/agent.md` reference expanded inline — that is, replace the `@` reference with the full Step 4 content, all substitutions applied. Prefix the file with a sync comment, and append the `# userEmail` block if an email was provided:
  ```
  <!-- Source of truth: AIMOS/agent.md — sync changes here when that file is updated -->
  [full Step 4 content with substitutions]

  # userEmail
  The user's email address is {email}.
  ```
  Still complete Step 4 to write the canonical `AIMOS/agent.md`.

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

| Placeholder              | Value                                                                                                                                                                                                                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{name}`                 | User's first name                                                                                                                                                                                                                                                                                              |
| `{response_length_rule}` | Short → `Keep responses short unless I ask for more, or the task truly requires it` / Detailed → `Default to thorough, detailed responses unless I ask you to be brief`                                                                                                                                        |
| `{pushback_rule}`        | Push back → `Give honest pushback when you disagree — push back when something seems off` / Follow lead → `Follow my direction; flag concerns briefly, then proceed`                                                                                                                                           |
| `{tone_lines}`           | See **Tone line variants** below                                                                                                                                                                                                                                                                               |
| `{sign_off}`             | User's chosen sign-off, default `Best,`                                                                                                                                                                                                                                                                        |

**Tone line variants** — paste the matching block verbatim into the template:

*Casual:*
```
- Clear, concise, and direct
- Confident without being stiff
- Conversational but purposeful
```

*Formal:*
```
- Clear, concise, and respectful
- Calm, confident, and accountability-driven
- Direct without sounding abrupt or confrontational
```

---

## Step 5 — Define folder structure in AIMOS/index.md

This step determines the `## Structure` section of `{target}/AIMOS/index.md`. It is the most important part of the install because your AI uses this map to navigate the project directory and know where to read from and write to.

Every `index.md` ends with the **Skills Table** defined in [Appendix A](#appendix-a--skills-table). Insert that block verbatim wherever the template below references `{SKILLS_TABLE}`.

### 5a — Ask the user which option they want

Use `AskUserQuestion` with a single question:

> "How should your AI understand your folder structure?"

Options:
- **Use a framework template** — Choose from PARA, ACE, or the Corder system
- **Read my existing folders** — Scan my selected directory and build the map from what's already there
- **Skip for now** — Leave the structure blank; I'll fill it in later

---

> **Execute exactly one of 5b, 5c, or 5d** based on the user's answer in 5a. Do not proceed to the others.

### 5b — Option 1: Framework template

If the user selects **Use a framework template**, ask a follow-up question:

> "Which framework would you like to use?"

Options: `PARA`, `ACE`, `Corder System`

Execute the matching block below. Each block contains both the `index.md` template and the `mkdir` command — run them together.

---

#### 5b-i — PARA

Write `{target}/AIMOS/index.md`:

```markdown
# Vault Map

## Structure

Root/
├── +/                        # default drop folder for new files
├── 1 Projects/               # active, time-bound work with a clear outcome
├── 2 Areas/                  # ongoing responsibilities (no end date)
├── 3 Resources/              # reference material, templates, topic notes
├── 4 Archive/                # completed or inactive content; ignore by default
└── AIMOS/                    # AI OS config — do not modify unless asked

## Notes
- **Projects** have a deadline or completion state. One folder per project.
- **Areas** represent standards to maintain (e.g., Health, Finance, Career).
- **Resources** are evergreen — reference material you return to over time.
- **Archive** is a cold-storage dump. Ignore it by default unless explicitly asked.

{SKILLS_TABLE}
```

Then create the folders:

```bash
mkdir -p \
  "{target}/+" \
  "{target}/1 Projects" \
  "{target}/2 Areas" \
  "{target}/3 Resources" \
  "{target}/4 Archive"
```

---

#### 5b-ii — ACE

Write `{target}/AIMOS/index.md`:

```markdown
# Vault Map

## Structure

Root/
├── +/                        # default drop folder for new files
├── Atlas/                    # knowledge — notes, references, maps of content
│   ├── Notes/
│   ├── Concepts/
│   └── People/
├── Calendar/                 # time-based — meetings, dailies, weeklies
│   ├── Daily Notes/
│   ├── Weekly Reviews/
│   └── Meetings/
├── Efforts/                  # active work — projects and ongoing responsibilities
│   ├── Projects/
│   └── Areas/
└── AIMOS/                    # AI OS config — do not modify unless asked

## Notes
- **Atlas** is timeless knowledge. Things you learn and want to keep.
- **Calendar** is time-indexed. Anything with a date goes here.
- **Efforts** is where work lives. Active projects and standing responsibilities.

{SKILLS_TABLE}
```

Then create the folders:

```bash
mkdir -p \
  "{target}/+" \
  "{target}/Atlas/Notes" \
  "{target}/Atlas/Concepts" \
  "{target}/Atlas/People" \
  "{target}/Calendar/Daily Notes" \
  "{target}/Calendar/Weekly Reviews" \
  "{target}/Calendar/Meetings" \
  "{target}/Efforts/Projects" \
  "{target}/Efforts/Areas"
```

---

#### 5b-iii — Corder System

Write `{target}/AIMOS/index.md`:

```markdown
# Vault Map

## Structure

Root/
├── 00-Inbox/                 # drop zone for unprocessed notes and quick captures
├── 01-Projects/
│   └── ACTIVE/
│       └── [CLIENT]-[PROJECT]-[YYYY]/   # one folder per engagement; contains Project Hub note
├── 02-Stakeholders/          # one note per key stakeholder; read these to calibrate comms
├── 03-Action-Items/          # all action items as individual notes, queryable across projects
├── 04-Meetings/              # all meeting notes; project-code YAML field links to parent project
├── 05-Status-Reports/        # weekly status reports and sprint artifacts
├── 06-Templates/             # ready-to-use note templates
├── 07-Reference/
│   └── AI-Context/           # context files loaded into every session
├── 08-Daily-Notes/           # daily notes, auto-created each morning
└── AIMOS/                    # AI OS config — do not modify unless asked

## Notes
- New files default to `00-Inbox/` unless a specific folder is given.
- Project folders follow the pattern `[CLIENT]-[PROJECT]-[YYYY]` for consistent sorting.
- `02-Stakeholders/` is read when drafting communications to calibrate tone and context.
- `07-Reference/AI-Context/` is where additional AI context files live beyond AIMOS.

{SKILLS_TABLE}
```

Then create the folders:

```bash
mkdir -p \
  "{target}/00-Inbox" \
  "{target}/01-Projects/ACTIVE" \
  "{target}/02-Stakeholders" \
  "{target}/03-Action-Items" \
  "{target}/04-Meetings" \
  "{target}/05-Status-Reports" \
  "{target}/06-Templates" \
  "{target}/07-Reference/AI-Context" \
  "{target}/08-Daily-Notes"
```

---

### 5c — Option 2: Read existing folder structure

If the user selects **Read my existing folders**:

1. Use `Bash` to list directories two levels deep in the workspace, excluding hidden folders, AIMOS itself, and git internals:
   ```bash
   find "{target}" -maxdepth 2 -type d \
     -not -path '*/.git' -not -path '*/.git/*' \
     -not -path '*/AIMOS' -not -path '*/AIMOS/*' \
     -not -name '.*' | sort
   ```
2. Parse the output into a tree representation.
3. Create the `+/` drop folder if it doesn't already exist:
   ```bash
   mkdir -p "{target}/+"
   ```
4. Write `{target}/AIMOS/index.md` using this structure:

```markdown
# Vault Map

## Structure

[Insert tree here, formatted as a code block with # comments describing each top-level folder]

## Notes
- This structure was scanned from your existing directory on install.
- Update this file any time your folder structure changes so your AI stays accurate.

{SKILLS_TABLE}
```

5. After writing, tell the user: "I mapped your existing folder structure into `AIMOS/index.md`. Review it and add any notes or corrections — your AI will use this to navigate your files."

---

### 5d — Option 3: Skip

If the user selects **Skip for now**, create the `+/` drop folder and write a minimal placeholder.

```bash
mkdir -p "{target}/+"
```

Write `{target}/AIMOS/index.md`:

```markdown
# Vault Map

## Structure

<!-- Add your folder structure here. Your AI uses this to navigate your files. -->

{SKILLS_TABLE}
```

Tell the user: "The index structure section is blank. When you're ready, open `AIMOS/index.md` and describe your folder layout — or ask me to scan your directory and build it automatically."

---

## Step 6 — Write AIMOS/operations.md

Write the following to `{target}/AIMOS/operations.md`, substituting user answers:

```markdown
# Operations

Update this file with your current projects and active work context.
Your AI references this file whenever you discuss project work.

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

Fetch each file from the URLs below and write to the corresponding path under `{target}/AIMOS/skills/`. These are static files — write them exactly as fetched without modification. Fetch all five in parallel if your tools support concurrent calls.

| Target path | Source URL |
|---|---|
| `AIMOS/skills/feedback/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/feedback.md |
| `AIMOS/skills/meeting-notes/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/meeting-notes.md |
| `AIMOS/skills/skill-creator/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/skill-creator.md |
| `AIMOS/skills/writing-style/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/writing-style.md |
| `AIMOS/skills/agentic-install/SKILL.md` | https://raw.githubusercontent.com/smblasik/AIMOS/main/install.md |

> Note: the `agentic-install` skill installs a copy of this very file. That's intentional — it lets the installed AIMOS instance re-run or update its own install procedure. **Maintainer:** the source is `install.md` in the repo; the destination is `agentic-install/SKILL.md`. If you rename either, update the other.

After fetching, verify all files exist before proceeding:

```bash
ls -1 "{target}/AIMOS" && ls -1 "{target}/AIMOS/skills"
```

If any file is missing, retry that fetch before moving to Step 9.

---

## Step 9 — Confirm completion and optionally enrich operations

> **9b runs in both cases.** Whether the user enriches operations in 9a or not, always finish with 9b.

### 9a — Optional: SOW or client summary

Use `AskUserQuestion` with a single question:

> "Do you want to paste in an SOW, project brief, or client summary? I'll use it to pre-populate your operations context."

Options:
- **Yes — paste it in** — Provide the document text and I'll extract key details
- **No — I'll fill it in later** — Skip and move on

---

#### If the user selects Yes

Ask them to paste the content directly into the chat.

Once received, extract the following fields (use best judgment where fields are ambiguous or implied):

| Field | What to look for |
|---|---|
| Client / Organization | Client name, company, or agency |
| Project / Engagement name | Project title or engagement name |
| Engagement type | Implementation, assessment, strategy, transformation, etc. |
| Scope summary | Key deliverables, workstreams, or phases (1–2 sentences) |
| Timeline | Start date, end date, or phase milestones |
| Key stakeholders | Named contacts, sponsors, or decision-makers |
| Environment | Industry, regulatory context, or technical environment |
| Goal | Primary objective or business outcome |

Then **overwrite** `{target}/AIMOS/operations.md` with the enriched version:

```markdown
# Operations

Your AI references this file whenever you discuss project work. Update it as context evolves.

## Identity and Strategic Context

- **Client:** {client}
- **Project:** {project}
- **Engagement Type:** {engagement_type}
- **Name:** {name}
- **Role:** {role}
- **Organization:** {org}
- **Environment:** {environment}
- **Goal:** {goal}

## Current Projects

| Project | Status | Notes |
|---------|--------|-------|
| {project} | Active | {scope_summary} |

## Key Stakeholders

| Name | Role | Notes |
|------|------|-------|
{stakeholder_rows}

## Timeline

{timeline}

## Behavioral Defaults

- **Lead with Output:** Deliver the artifact first. Provide commentary afterward.
- **Format:** Structured Markdown. Use headers, short paragraphs, and tables.
- **Tone:** Adapt to context — formal for stakeholders, direct for working sessions.
- **Ambiguity:** State assumptions and proceed. Only halt for material gaps.
```

**Fill-in rules:**
- `{stakeholder_rows}` — one `| Name | Role | Notes |` row per identified stakeholder; if none found, write `| — | — | — |`
- `{timeline}` — bullet list of milestones or date ranges if found; otherwise write `—`
- Any field that cannot be extracted: leave blank or write `—`
- Carry over `{name}`, `{role}`, `{org}` from Step 1 answers

Tell the user: "I've populated `operations.md` with context from your document. Review and update it as the engagement evolves."

---

#### If the user selects No

Proceed to 9b.

---

### 9b — Confirm install

Tell the user:
- Where AIMOS was installed (folder path)
- What was created (brief file list)

Use the folder name the user selected, not full system paths (e.g., `Notes/Work` not `/Users/name/Library/CloudStorage/...`).

---

## Appendix A — Skills Table

The `{SKILLS_TABLE}` placeholder in any `index.md` template expands to this block verbatim:

```markdown
## Skills

Located in `AIMOS/skills/` — each is a subfolder with a `SKILL.md`:

| Skill | Description |
|---|---|
| `agentic-install` | Install AIMOS into any folder |
| `feedback` | Draft structured feedback using the SBI framework |
| `meeting-notes` | Meeting note structure and formatting |
| `skill-creator` | Create new skills in the correct format |
| `writing-style` | Tone, structure, and voice guidance |
```

When this skill table changes, update this appendix only — all index.md templates pull from here.
