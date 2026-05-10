exports.handler = async function handler() {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      app: 'Prompt Muse for Suno',
      version: 'v15.2.0',
      build: 'v15.2-lyrics-guard',
      api: 'deployed',
      hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.OPENAI_MODEL || 'not set',
      provider: 'netlify',
      timestamp: new Date().toISOString(),
      message: 'Netlify API function is reachable. Secrets are not exposed; hasOpenAIKey is only a boolean.'
    })
  };
};
