module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' });
      return;
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const fields = body.fields || {};
    const model = process.env.OPENAI_MODEL || 'gpt-5.5';
    const prompt = [
      'You are polishing a Suno prompt bundle. Return strict JSON only with variants array.',
      'Each variant must include kind, title, stylePrompt, promptLyrics, negativePrompt, notes.',
      'Do not include direct artist names in Suno-facing fields. Preserve originality and character limits.',
      JSON.stringify(fields, null, 2)
    ].join('\n\n');
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        input: prompt,
        text: { format: { type: 'json_schema', name: 'suno_polish', strict: true, schema: {
          type: 'object', additionalProperties: false,
          properties: { variants: { type: 'array', minItems: 1, maxItems: 3, items: { type: 'object', additionalProperties: false, properties: {
            kind: { type: 'string' }, title: { type: 'string' }, stylePrompt: { type: 'string' }, promptLyrics: { type: 'string' }, negativePrompt: { type: 'string' }, notes: { type: 'string' }
          }, required: ['kind','title','stylePrompt','promptLyrics','negativePrompt','notes'] } } }, required: ['variants']
        } } }
      })
    });
    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data.error || data });
      return;
    }
    const text = data.output_text || (data.output && data.output[0] && data.output[0].content && data.output[0].content[0] && data.output[0].content[0].text) || '{}';
    res.status(200).json(JSON.parse(text));
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
};
