exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY is not configured on the server.' }) };
    }
    const body = JSON.parse(event.body || '{}');
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
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
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
    if (!response.ok) return { statusCode: response.status, body: JSON.stringify({ error: data.error || data }) };
    const text = data.output_text || (data.output && data.output[0] && data.output[0].content && data.output[0].content[0] && data.output[0].content[0].text) || '{}';
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(JSON.parse(text)) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || String(error) }) };
  }
};
