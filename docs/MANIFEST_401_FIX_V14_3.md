# Manifest 401 Fix — Prompt Muse v14.3

## Symptom

Browser console shows:

```text
manifest.webmanifest failed, code 401
```

## Cause

This usually means Vercel Deployment Protection / Vercel Authentication is protecting the deployment. Browsers may fetch the web app manifest without the authentication credentials needed by protected preview deployments.

## App-side mitigation

The manifest link now uses:

```html
<link rel="manifest" href="/manifest.webmanifest" crossorigin="use-credentials">
```

This can help protected preview deployments send credentials with the manifest request.

## Hosting-side fix

For the cleanest iPhone/PWA experience, use a public production Vercel deployment or disable Deployment Protection for the environment/domain you are testing.

## Lyrics-first behavior

This build keeps v14.2 behavior: Spark, Generate, and Write Lyrics force the Prompt / Lyrics field to actual sectioned lyrics, not instructions.
