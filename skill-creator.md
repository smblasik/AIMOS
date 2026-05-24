---
name: skill-creator
description: Helps create new skills in the correct format with proper YAML frontmatter and directory structure.
tags:
  - AI
  - skill
---

Guide the creation of a new skill.

## Step 1: Gather skill requirements

Ask the user for:
- **Skill name** (lowercase, hyphenated format like "meeting-notes")
- **Description** (one sentence summarizing what the skill does)
- **Purpose** (what problem it solves, when to use it)

## Step 2: Create the directory structure

Create the skill folder at:
```
AIMOS/skills/<skill-name>/SKILL.md
```

Use bash to create the directory:
```bash
mkdir -p "AIMOS/skills/<skill-name>"
```

## Step 3: Generate the SKILL.md file

Create the file with this exact YAML frontmatter structure:

```yaml
---
name: <skill-name>
tags:
  - AI
  - skill
description: <10 word or less description>
---
```

Then add the skill instructions below the frontmatter in markdown format.

## Step 4: Skill content guidelines

Help the user write clear skill instructions:

- Use numbered steps for sequential processes
- Use bullet points for lists of rules or options
- Include code blocks (`markdown or yaml`) for examples
- Keep instructions concise and actionable
- Reference specific folders using the vault path format (e.g., `4 Notes/Meeting Notes`)
- Mention any output file locations with exact paths
- Include any relevant rules or constraints

## Step 5: Validate and confirm

Before finalizing:
1. Read back the created file to verify YAML frontmatter is correct
2. Confirm the skill name in the frontmatter matches the directory name
3. Ensure the description is clear and matches the skill's purpose
4. Show the user the final SKILL.md content for approval

## Step 6: Write to the index file

After content is finalized, update the `AIMOS/index.md` file with the new skill.

## Example structure

```markdown
---
name: example-skill
tags:
  - AI
  - skill
description: Brief one-sentence description here.
---

1. First step of the skill process
2. Second step with details

## Subsection if needed

- Bullet point rules
- More rules

## Output

Save results to:
`folder/path/filename.md`
```
