---
name: meeting-notes
description: Outlines how meeting notes should be structured.
tags:
  - AI
  - skill
connections: "[[AIMOS]]"
---

1. Process the input given
2. Format into the following
```markdown
---
title: <title>
date: <date>
description: <short 10 word or less description>
---
## Actions: 
- [ ] Highlight any actions in bullet point format
- [ ] Use "- [ ]"
- Try to assign an owner whenever possible. Format <owner name>: summary of action item
## Overview: 
- 3-5 sentences encompassing the purpose and summary of the meeting
## Notes: 
- Give me bullet point notes outlining the meeting
- Output in markdown format
```

Use today's date in the filename (format: `YYYY-MM-DD Meeting Title.md`).

3. Then output the final update in the chat so I can review it. Do not include source reference links in the output.
4. Ask where to save the new file created.
