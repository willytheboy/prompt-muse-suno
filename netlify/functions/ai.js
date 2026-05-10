exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY is not configured on the server.' }) };
    const body = JSON.parse(event.body || '{}');
    const model = process.env.OPENAI_MODEL || body?.settings?.model || 'gpt-5.5';
    const schema = {
      type: 'object', additionalProperties: false,
      properties: {
        notes: { type: 'string' },
        composition: { type: 'object', additionalProperties: false, properties: {
          title: { type: 'string' }, stylePrompt: { type: 'string' }, promptLyrics: { type: 'string' }, negativePrompt: { type: 'string' }
        }, required: ['title','stylePrompt','promptLyrics','negativePrompt'] },
        variants: { type: 'array', maxItems: 3, items: { type: 'object', additionalProperties: false, properties: {
          kind: { type: 'string' }, title: { type: 'string' }, stylePrompt: { type: 'string' }, promptLyrics: { type: 'string' }, negativePrompt: { type: 'string' }, notes: { type: 'string' }
        }, required: ['kind','title','stylePrompt','promptLyrics','negativePrompt','notes'] } },
        album: { type: 'object', additionalProperties: false, properties: {
          id: { type: 'string' }, albumTitle: { type: 'string' }, artist: { type: 'string' }, type: { type: 'string' }, trackCount: { type: 'number' }, moodArc: { type: 'string' }, variation: { type: 'string' }, genres: { type: 'array', items: { type: 'string' } }, createdAt: { type: 'string' },
          tracks: { type: 'array', maxItems: 12, items: { type: 'object', additionalProperties: false, properties: {
            id: { type: 'string' }, trackNumber: { type: 'number' }, role: { type: 'string' }, title: { type: 'string' }, genre: { type: 'string' }, bpm: { type: 'number' }, country: { type: 'string' }, artist: { type: 'string' }, type: { type: 'string' }, stylePrompt: { type: 'string' }, promptLyrics: { type: 'string' }, negativePrompt: { type: 'string' }
          }, required: ['id','trackNumber','role','title','genre','bpm','country','artist','type','stylePrompt','promptLyrics','negativePrompt'] } }
        }, required: ['id','albumTitle','artist','type','trackCount','moodArc','variation','genres','createdAt','tracks'] }
      }, required: ['notes','composition','variants','album']
    };
    const prompt = [
      'You are Prompt Muse AI Studio for Suno. Return strict JSON only.',
      'Generate release-safe, original Suno fields. Hard rule: every promptLyrics value must be actual finished lyrics, never writing instructions, never a scaffold, never placeholders.',
      'Every promptLyrics must start with [Intro] or [Verse 1] and include at least [Verse 1], [Chorus], [Verse 2], and [Bridge] or [Outro].',
      'Do not write phrases like write, generate, include, add, four concise lines, use imagery, or make the chorus inside promptLyrics.',
      'Keep direct artist names out of title, stylePrompt, promptLyrics, and negativePrompt. Artist names may be used only as private metadata in the user brief.',
      'For action polish, fill variants and composition. For action album, fill album with 1 to 12 tracks. Still provide all required keys.',
      JSON.stringify(body, null, 2)
    ].join('\n\n');
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, input: prompt, text: { format: { type: 'json_schema', name: 'prompt_muse_ai_studio', strict: true, schema } } })
    });
    const data = await response.json();
    if (!response.ok) return { statusCode: response.status, body: JSON.stringify({ error: data.error || data }) };
    const text = data.output_text || (data.output && data.output[0] && data.output[0].content && data.output[0].content[0] && data.output[0].content[0].text) || '{}';
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(JSON.parse(text)) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || String(error) }) };
  }
};
