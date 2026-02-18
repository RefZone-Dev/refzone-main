---
description: Stage changes, generate a smart commit message, and push to GitHub
---

1. Run `git status` to see which files changed.
2. Run `git diff --cached` to understand the specific code updates.
3. Generate a concise, professional commit message based on these changes.
4. Execute the following sequence:
   - `git add .`
   - `git commit -m "[your generated message]"`
   - `git push origin $(git rev-parse --abbrev-ref HEAD)`
5. Confirm once the push is successful and show the commit hash.
