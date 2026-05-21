# AIMOS — AI Operating System

A personalized Agentic AI setup you can drop into any folder or Obsidian vault. Answer a few questions and it configures itself around your name, working style, and folder structure.

---

## Install via Claude Cowork

Open Claude Cowork and say:

```
install this https://github.com/smblasik/AIMOS
```

Claude will ask a few short questions, then write everything to the folder you choose. No terminal, Node.js, or npm required.

---

## What gets installed

```
your-folder/
├── CLAUDE.md              # entry point — Claude reads this automatically
└── AIMOS/
    ├── agent.md           # your preferences, rules, and working style
    ├── index.md           # folder structure and skill directory
    ├── operations.md      # current projects and active context
    ├── memory.md          # persistent session memory
    └── skills/
        ├── cowork-install/  # this installer
        ├── feedback/        # SBI-structured feedback drafting
        ├── meeting-notes/   # meeting note formatting
        ├── skill-creator/   # scaffold new skills
        └── writing-style/   # tone and voice guidance
```

`CLAUDE.md` imports `agent.md` so Claude picks up your preferences automatically at the start of every session.

---

## How it works

Open any session in your project or vault folder. Claude reads `CLAUDE.md` on startup, which loads your `agent.md` preferences. From there it knows your name, communication style, rules, and which skills are available.

To use a skill, just ask — or reference it directly:

```
/meeting-notes
/feedback
/skill-creator
```

---

## Adding skills

Skills live in `AIMOS/skills/` — each is a folder with a `SKILL.md` file. Use the built-in skill creator:

```
/skill-creator
```

Or create one manually:

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

Edit `AIMOS/agent.md` directly at any time. Changes take effect in the next session.

For project context (current clients, active work), update `AIMOS/operations.md`.

---

## Reinstalling

The installer will not overwrite an existing `CLAUDE.md`. To reconfigure from scratch, delete the `AIMOS/` folder and run the install again.
