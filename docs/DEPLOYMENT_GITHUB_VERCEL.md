# GitHub to Vercel deployment guide

## Recommended setup

1. Create a new GitHub repository, for example `prompt-muse-suno`.
2. Upload the contents of this project ZIP so `index.html` is at the repository root.
3. In Vercel, create a new project and import that GitHub repository.
4. Use these settings for this static app:
   - Framework preset: Other
   - Build command: leave blank
   - Output directory: `.`
5. Add server-side environment variables only if using AI polish:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
6. Every pull request should create a Vercel Preview Deployment. Test that preview on iPhone before merging.

## Production update workflow

```bash
git checkout main
git pull origin main
git checkout -b upgrade/v15-next
# edit files with any LLM
npm test
git add .
git commit -m "Upgrade Prompt Muse"
git push -u origin upgrade/v15-next
```

Open a PR in GitHub. Test the Vercel preview. Merge only after the iPhone checklist passes.

## Cache policy

v14 intentionally avoids service-worker caching. `vercel.json` sends no-store headers for HTML and manifest files to reduce stale app-shell failures during development.
