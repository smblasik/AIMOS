# AIMOS — AI Operating System

A personalized Claude Code setup you can drop into any project or Obsidian vault. One command installs and configures it around your preferences, working style, and folder structure.

---

## Install

```bash
npx github:smblasik/AIMOS
```

Requires Node.js 16+. No npm account needed.

---

## What it does

The installer walks you through four short sections and generates a set of configuration files tailored to your answers:

```
1 / 4   About You          name, email, role, organization
2 / 4   Preferences        response length, tone, pushback style
3 / 4   Rules & Conventions  file conventions, link format, sign-off, folder structure
4 / 4   Install Location   where to put the files
```

Everything has a sensible default — most installs take under two minutes.

---

## What gets installed

```
your-directory/
├── CLAUDE.md              # entry point — Claude reads this automatically
└── AIMOS/
    ├── agent.md           # your preferences, rules, and working style
    ├── index.md           # vault/project structure and skill directory
    ├── operations.md      # current projects and active context
    ├── memory.md          # persistent session memory
    └── skills/
        ├── feedback/      # SBI-structured feedback drafting
        ├── meeting-notes/ # meeting note formatting
        ├── skill-creator/ # scaffold new skills
        ├── weekly-update/ # weekly status synthesis
        └── writing-style/ # tone and voice guidance
```

`CLAUDE.md` imports `agent.md` so Claude Code picks up your preferences automatically in every session.

---

## How it works with Claude Code

Open any session in your project or vault directory. Claude reads `CLAUDE.md` on startup, which loads your `agent.md` preferences. From there it knows your name, communication style, rules, and which skills are available.

To use a skill, just ask — or reference it directly:

```
/weekly-update
/meeting-notes
/feedback
```

---

## Adding skills

Skills live in `AIMOS/skills/` — each is a folder with a `SKILL.md` file. Use the built-in skill creator to scaffold new ones:

```
/skill-creator
```

Or create manually:

```
AIMOS/skills/my-skill/SKILL.md
```

```yaml
---
name: my-skill
description: One sentence describing what this skill does.
tags:
  - AI
  - skill
---

Your skill instructions here.
```

Then add it to `AIMOS/index.md` so Claude knows it exists.

---

## Updating your preferences

Edit `AIMOS/agent.md` directly at any time. Changes take effect in the next Claude Code session.

For project context (current clients, active work), update `AIMOS/operations.md`.

---

## Re-running the installer

The installer will not overwrite an existing `CLAUDE.md`. To reconfigure from scratch, delete the `AIMOS/` folder and re-run:

```bash
npx github:smblasik/AIMOS
```
