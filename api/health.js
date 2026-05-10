module.exports = async function handler(req, res) {
  res.status(200).json({
    ok: true,
    app: 'Prompt Muse for Suno',
    version: 'v14.1-vercel-fix',
    message: 'Vercel API function is reachable.'
  });
};
