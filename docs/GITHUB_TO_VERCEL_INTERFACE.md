# GitHub → Vercel interface design

The interface is not an OAuth dashboard. It is a safe workflow layer that turns the app into a repo-managed product. It provides:

- an in-app upgrade brief generator,
- Git command scaffolds,
- a repo instruction system for coding LLMs,
- GitHub PR templates,
- CI checks,
- Vercel project configuration.

This avoids storing GitHub or Vercel tokens in the browser. For actual repository edits, use GitHub, Codex, Cursor, local terminal, or a cloud development environment.
