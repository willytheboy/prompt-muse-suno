module.exports = async function handler(req, res) {
  res.status(200).json({
    ok: true,
    app: 'Prompt Muse for Suno',
    version: 'v15.2.0',
    build: 'v15.2-lyrics-guard',
    api: 'deployed',
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || 'not set',
    vercelEnv: process.env.VERCEL_ENV || 'local',
    commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    timestamp: new Date().toISOString(),
    message: 'Vercel API function is reachable. Secrets are not exposed; hasOpenAIKey is only a boolean.'
  });
};
