# Prompt Muse v14.2 Vercel Fix

## Fixed

- Removed the explicit `functions` block from `vercel.json` to avoid Vercel's `unmatched-function-pattern` build failure when Vercel cannot match `api/polish.js` during validation.
- Kept `/api/polish.js` in place so Vercel can auto-detect it as a Node.js function.
- Added `/api/health.js` for quick function reachability testing after deployment.
- Added explicit no-store header for `/` during development/testing.

## Why

Vercel validates the `functions` object before deployment. If the configured pattern does not match a detected function source file in the project root's `api` directory, the deployment fails before the static app is published. Removing the explicit function pattern allows zero-configuration function detection for files in `/api`.

## After deploy

Test:

```text
/
/api/health
/api/polish
```

`/api/polish` requires `OPENAI_API_KEY` and must be called with POST, so a browser GET may return 405. That is expected.
