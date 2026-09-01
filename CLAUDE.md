# CLAUDE.md

## Session naming (mandatory)
If the first message contains a task ID matching [A-Z]{2,5}(-HUM)?-[0-9]{3,4}, your FIRST action is to rename this session to "<task-id> - <short description>" (description from the task title or the line it appears on). Do this before any other tool call. Never leave a session on its auto-generated title. If a later message introduces a different task ID, do not rename; the session belongs to the first.

