'use strict';

const STORAGE_KEY = 'promptMuseSunoLibrary.v3';
const LEGACY_STORAGE_KEYS = ['promptMuseSunoHistory.v2'];

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));
let currentEntryId = null;
let lastBundle = null;

const genres = [
  'Mediterranean acoustic beach lounge',
  'Mediterranean deep house',
  'Brass-led Latin Mediterranean lounge',
  'Cinematic coastal ballad',
  'Arabian fusion pop',
  'Balearic global lounge',
  'Sophisti-pop jazz lounge',
  'Organic house with oud and darbuka',
  'French-Arabic café chanson',
  'Instrumental luxury lounge',
  'Levantine jazz-pop lounge',
  'Trip-hop coastal noir',
  'Afro-Cuban Mediterranean lounge',
  'Minimal luxury electro-lounge',
  'Custom'
];

const styles = [
  'sunset terrace luxury',
  'moonlit coastal lounge',
  'warm analog café polish',
  'late-night velvet intimacy',
  'premium hospitality background',
  'Balearic island calm',
  'organic melodic house pulse',
  'cinematic romantic glow',
  'global lounge fusion',
  'editorial fashion reel sleekness',
  'earthy acoustic warmth',
  'minimal hypnotic groove',
  'Custom'
];

const countries = [
  'Lebanon', 'Greece', 'Egypt', 'France', 'Spain', 'Italy', 'Morocco', 'UAE',
  'Brazil', 'Cuba', 'Cape Verde', 'Turkey', 'United Kingdom', 'United States', 'Global / mixed', 'Custom'
];

const energies = [
  'low, elegant background',
  'low-medium, conversation-friendly',
  'medium, premium lounge movement',
  'medium-high, sunset lift',
  'high, controlled dance energy',
  'cinematic, emotional build'
];

const moods = [
  'sun-kissed', 'coastal', 'premium', 'intimate', 'euphoric', 'melancholic', 'romantic',
  'cinematic', 'earthy', 'after-dark', 'breezy', 'hypnotic', 'nostalgic', 'serene', 'festive',
  'minimal', 'smoky', 'luxury', 'island', 'polished', 'welcoming', 'sleek', 'noir', 'warm'
];

const vocalDirections = [
  'warm male vocal, natural phrasing, emotionally restrained',
  'intimate female vocal, breathy but clear, elegant vibrato',
  'male-female duet, call-and-response, soft harmonies',
  'group chorus with tasteful backing vocals',
  'spoken-sung verses with melodic chorus',
  'instrumental only, no lead vocal',
  'Arabic lead vocal with English ad-libs',
  'French-English lounge vocal',
  'wordless vocal textures and choral pads',
  'close-mic soft pop vocal with minimal ornamentation',
  'romantic Arabic crooner phrasing with restrained drama',
  'low velvet vocal with late-night intimacy'
];

const languages = [
  'English', 'Arabic', 'English + Arabic', 'French', 'French + Arabic',
  'English + French', 'Spanish', 'Spanish + Arabic', 'Portuguese',
  'Instrumental / no lyrics', 'Wordless vocal textures only'
];

const intensityLabels = { 1: 'subtle', 2: 'light', 3: 'balanced', 4: 'strong', 5: 'dominant' };

const traitLibrary = {
  'fairuz': {
    overall: ['Levantine elegance', 'poetic restraint', 'timeless Mediterranean warmth'],
    vocal: ['clear mezzo tone', 'ornamental Arabic phrasing used sparingly', 'dignified emotional delivery'],
    groove: ['unhurried pulse', 'folk-rooted sway', 'space for lyrical phrasing'],
    instrumentation: ['accordion or strings as nostalgic color', 'soft oud touches', 'choral warmth without clutter'],
    arrangement: ['orchestral folk-pop lift', 'graceful refrain placement', 'measured emotional build'],
    production: ['natural room warmth', 'clear vocal center', 'not overly compressed'],
    lyric: ['poetic place imagery', 'longing, sea, city, and memory'],
    performance: ['dignified, restrained, timeless']
  },
  'ziad rahbani': {
    overall: ['Levantine jazz-theater wit', 'urban Beirut sophistication', 'subtle harmonic twists'],
    vocal: ['conversational phrasing', 'dry understated delivery'],
    groove: ['laid-back jazz pocket', 'off-center swing', 'Rhodes-led groove'],
    instrumentation: ['Rhodes, upright bass, brushed drums, and brass punctuation'],
    arrangement: ['unexpected jazz chords', 'small ensemble interplay', 'urban lounge transitions'],
    production: ['dry intimate mix', 'live-room jazz texture'],
    lyric: ['observational, conversational, bittersweet urban tone'],
    performance: ['clever, relaxed, lightly ironic']
  },
  'sade': {
    overall: ['silky late-night elegance', 'understated romantic restraint', 'sophisticated smoothness'],
    vocal: ['low intimate vocal focus', 'soft phrasing with emotional economy'],
    groove: ['slow-burn sophisti-pop pocket', 'laid-back bass-led swing'],
    instrumentation: ['warm electric bass, brushed drums, muted guitar, soft saxophone'],
    arrangement: ['minimal verse space', 'subtle chorus lift', 'tasteful instrumental replies'],
    production: ['velvet midrange', 'clean reverb tails', 'polished but not glossy'],
    lyric: ['adult romantic simplicity', 'private longing without melodrama'],
    performance: ['cool, composed, intimate']
  },
  'black coffee': {
    overall: ['organic afro-house depth', 'elegant club restraint', 'spiritual nighttime lift'],
    vocal: ['soulful fragments', 'call-like melodic phrases'],
    groove: ['deep house pulse', 'polyrhythmic percussion', 'hypnotic forward motion'],
    instrumentation: ['warm sub bass, shakers, hand percussion, atmospheric synths'],
    arrangement: ['long-form groove evolution', 'controlled drops', 'percussion-led bridges'],
    production: ['wide club mix', 'rounded kick', 'deep low-end control'],
    lyric: ['minimal emotional phrases', 'mantra-like repetition'],
    performance: ['restrained, grounded, magnetic']
  },
  'nora en pure': {
    overall: ['melodic deep-house serenity', 'nature-luxury atmosphere', 'sunset elegance'],
    vocal: ['airy vocal textures', 'minimal lead phrases'],
    groove: ['steady deep-house pulse', 'clean four-on-floor glide'],
    instrumentation: ['plucked motifs, soft piano, strings, airy pads'],
    arrangement: ['gradual melodic reveal', 'clean breakdown', 'uplifting return'],
    production: ['polished stereo image', 'smooth high end', 'controlled sub'],
    lyric: ['short emotional phrases', 'open-sky imagery'],
    performance: ['serene, lifted, refined']
  },
  'rufus du sol': {
    overall: ['cinematic electronic melancholy', 'wide emotional dance space'],
    vocal: ['vulnerable male vocal texture', 'long reverb emotional bloom'],
    groove: ['pulsing electronic groove', 'anthemic but restrained lift'],
    instrumentation: ['analog synth arps, deep bass, wide pads, tight kick'],
    arrangement: ['slow build', 'expansive chorus', 'breakdown into final lift'],
    production: ['large atmospheric depth', 'clean club-ready low end'],
    lyric: ['yearning, night travel, emotional release'],
    performance: ['vulnerable, cinematic, immersive']
  },
  'thievery corporation': {
    overall: ['downtempo global lounge', 'dub-inflected sophistication'],
    vocal: ['soft multilingual phrases', 'relaxed delivery'],
    groove: ['downtempo breakbeat pocket', 'dub bass sway'],
    instrumentation: ['sitar or oud colors, congas, Rhodes, dub bass, airy pads'],
    arrangement: ['layered texture entry', 'instrumental motif focus', 'smoky transitions'],
    production: ['warm dub space', 'tape-like saturation', 'wide lounge ambience'],
    lyric: ['cosmopolitan travel mood', 'minimal poetic fragments'],
    performance: ['cool, worldly, relaxed']
  },
  'cafe del mar': {
    overall: ['Balearic sunset chillout', 'ocean-air serenity', 'luxury island calm'],
    vocal: ['wordless airy voices', 'distant soft phrases'],
    groove: ['slow lounge pulse', 'relaxed percussion', 'open breathing tempo'],
    instrumentation: ['nylon guitar, pads, soft trumpet, gentle percussion, ocean ambience'],
    arrangement: ['ambient intro', 'main motif', 'gentle groove', 'long fade'],
    production: ['soft horizon-like width', 'smooth ambience', 'non-intrusive master'],
    lyric: ['sea, horizon, afterglow, memory'],
    performance: ['calm, weightless, luxurious']
  },
  'ibrahim maalouf': {
    overall: ['lyrical trumpet-led Mediterranean emotion', 'brass warmth with cinematic drama'],
    vocal: ['instrumental voice-like trumpet phrasing'],
    groove: ['jazz pulse with Levantine accents', 'ceremonial rhythmic lift'],
    instrumentation: ['warm trumpet or flugelhorn, piano, frame drums, strings'],
    arrangement: ['brass theme', 'call-and-response sections', 'dramatic bridge'],
    production: ['live-room brass focus', 'cinematic brass reverb'],
    lyric: ['instrumental storytelling arc', 'melodic longing'],
    performance: ['expressive, noble, emotional']
  },
  'gotan project': {
    overall: ['electro-tango noir', 'smoky dancefloor sophistication'],
    vocal: ['spoken fragments', 'dramatic low-register phrasing'],
    groove: ['tango pulse over electronic beat', 'syncopated bandoneon feel'],
    instrumentation: ['bandoneon-like accordion, strings, upright bass, electronic drums'],
    arrangement: ['noir intro', 'rhythmic motif', 'dramatic break', 'dance return'],
    production: ['dark polished ambience', 'cinematic low light'],
    lyric: ['night streets, longing, elegance'],
    performance: ['dramatic, sensual, controlled']
  },
  'gipsy kings': {
    overall: ['festive nylon-guitar Mediterranean fire', 'sunny communal joy'],
    vocal: ['raspy group response', 'passionate but loose phrasing'],
    groove: ['rumba-flamenca strum pulse', 'clapping drive'],
    instrumentation: ['nylon guitars, palmas, hand percussion, bright chorus shouts'],
    arrangement: ['immediate guitar hook', 'call-response chorus', 'percussion break'],
    production: ['live acoustic energy', 'bright guitar presence'],
    lyric: ['simple celebratory romance', 'summer movement'],
    performance: ['fiery, festive, human']
  },
  'bebel gilberto': {
    overall: ['soft bossa nova sophistication', 'breathy tropical intimacy'],
    vocal: ['gentle close-mic vocal', 'soft Portuguese phrasing'],
    groove: ['light bossa pulse', 'laid-back syncopation'],
    instrumentation: ['nylon guitar, brushes, soft percussion, warm bass'],
    arrangement: ['minimal verse', 'gentle chorus sway', 'small instrumental answer'],
    production: ['soft airy room', 'warm acoustic polish'],
    lyric: ['breeze, water, private romance'],
    performance: ['soft, elegant, intimate']
  },
  'buena vista social club': {
    overall: ['vintage Cuban warmth', 'communal acoustic joy'],
    vocal: ['weathered human vocal texture', 'call-and-response warmth'],
    groove: ['son cubano sway', 'clave-informed pulse'],
    instrumentation: ['piano montuno, trumpet, tres-like guitar, congas, upright bass'],
    arrangement: ['live ensemble interplay', 'instrumental solos', 'chorus responses'],
    production: ['vintage room feel', 'organic ensemble balance'],
    lyric: ['nostalgia, place, dance, social warmth'],
    performance: ['warm, lived-in, communal']
  },
  'cesaria evora': {
    overall: ['melancholic island saudade', 'barefoot coastal dignity'],
    vocal: ['smoky alto warmth', 'unhurried emotional gravity'],
    groove: ['morna sway', 'gentle island rhythm'],
    instrumentation: ['nylon guitar, cavaquinho-like sparkle, accordion, soft percussion'],
    arrangement: ['patient verse-led storytelling', 'small ensemble support'],
    production: ['natural acoustic warmth', 'simple vocal-centered mix'],
    lyric: ['sea, distance, homesickness, memory'],
    performance: ['dignified, wistful, unhurried']
  },
  'daft punk': {
    overall: ['sleek electronic-pop polish', 'robotic-funk precision translated into original traits'],
    vocal: ['processed backing textures', 'tight vocoder-like color without imitation'],
    groove: ['clean dance pocket', 'funk bass discipline'],
    instrumentation: ['analog synths, tight bass, crisp drums, glossy pads'],
    arrangement: ['loop discipline with evolving layers', 'breakdown and clean return'],
    production: ['high-definition electronic sheen', 'precise transient control'],
    lyric: ['simple memorable phrases', 'futuristic romantic minimalism'],
    performance: ['polished, controlled, futuristic']
  },
  'massive attack': {
    overall: ['trip-hop shadow and cinematic tension', 'slow nocturnal atmosphere'],
    vocal: ['intimate whispered gravity', 'restrained emotional darkness'],
    groove: ['slow breakbeat pocket', 'heavy but spacious bass'],
    instrumentation: ['sub bass, dusty drums, dark pads, sparse guitar accents'],
    arrangement: ['moody intro', 'slow accumulation', 'textural bridge'],
    production: ['dark spacious mix', 'gritty low-end atmosphere'],
    lyric: ['urban night, tension, ambiguity'],
    performance: ['cool, shadowed, restrained']
  },
  'jamiroquai': {
    overall: ['acid-jazz funk movement', 'bright urban groove confidence'],
    vocal: ['agile rhythmic phrasing', 'playful ad-libs'],
    groove: ['syncopated funk bassline', 'danceable live pocket'],
    instrumentation: ['wah guitar, clavinet-like keys, slap-style bass, brass stabs'],
    arrangement: ['bass hook intro', 'groove verse', 'chorus lift', 'instrumental break'],
    production: ['clean funk presence', 'live drums with polish'],
    lyric: ['movement, nightlife, playful confidence'],
    performance: ['energetic, stylish, groove-led']
  },
  'lana del rey': {
    overall: ['cinematic vintage melancholy', 'slow romantic atmosphere'],
    vocal: ['low intimate vocal presence', 'dreamy sustained phrasing'],
    groove: ['slow ballad pulse', 'wide cinematic pacing'],
    instrumentation: ['piano, strings, tremolo guitar, soft drums'],
    arrangement: ['slow reveal', 'chorus bloom', 'cinematic bridge'],
    production: ['vintage haze', 'lush reverb, warm saturation'],
    lyric: ['nostalgia, desire, night, glamour, memory'],
    performance: ['dreamy, tragic, intimate']
  },
  'coldplay': {
    overall: ['anthemic melodic uplift', 'broad emotional accessibility'],
    vocal: ['clear earnest vocal line', 'simple singable phrasing'],
    groove: ['steady pop-rock pulse', 'building rhythmic lift'],
    instrumentation: ['piano, chiming guitars, warm bass, stadium-like pads'],
    arrangement: ['quiet intro', 'big chorus lift', 'final communal refrain'],
    production: ['wide uplifting mix', 'bright emotional polish'],
    lyric: ['hope, light, return, human connection'],
    performance: ['earnest, open, uplifting']
  }
};

const sparkIdeas = [
  {
    title: 'Ras Beirut Afterglow', country: 'Lebanon', genre: 'Mediterranean acoustic beach lounge', style: 'sunset terrace luxury', bpm: '104', key: 'A minor',
    coreIdea: 'A warm Mediterranean lounge song for golden-hour dining by the sea in Ras Beirut.', hook: 'Sporting Club by the sea',
    instruments: 'oud, nylon guitar, Rhodes, brushed drums, soft trumpet, light sea ambience',
    artists: [{ name: 'Sade', aspect: 'vocal', intensity: '3', notes: 'silky restraint' }, { name: 'Fairuz', aspect: 'lyric', intensity: '2', notes: 'Levantine place imagery' }, { name: 'Ziad Rahbani', aspect: 'arrangement', intensity: '2', notes: 'subtle jazz harmony' }]
  },
  {
    title: 'Mykonos Moon Current', country: 'Greece', genre: 'Balearic global lounge', style: 'Balearic island calm', bpm: '106', key: 'B minor',
    coreIdea: 'A luxury island lounge cue with Mediterranean-Arabian textures and ocean-night atmosphere.', hook: 'under the moon, we move slow',
    instruments: 'oud, qanun, darbuka, marimba, Rhodes, ambient pads, soft congas, distant ney flute',
    artists: [{ name: 'Cafe del Mar', aspect: 'overall', intensity: '4', notes: 'sunset chillout horizon' }, { name: 'Thievery Corporation', aspect: 'production', intensity: '3', notes: 'global lounge depth' }, { name: 'Nora En Pure', aspect: 'groove', intensity: '2', notes: 'clean deep-house glide' }]
  },
  {
    title: 'Trumpet on the Corniche', country: 'Lebanon', genre: 'Brass-led Latin Mediterranean lounge', style: 'warm analog café polish', bpm: '112', key: 'D minor',
    coreIdea: 'A brass-led lounge track with Latin percussion, Levantine warmth, and an elegant seaside dinner groove.', hook: 'lights on the corniche',
    instruments: 'trumpet, flugelhorn, marimba, nylon guitar, bongos, shakers, upright bass, Rhodes',
    artists: [{ name: 'Ibrahim Maalouf', aspect: 'instrumentation', intensity: '4', notes: 'lyrical brass motif' }, { name: 'Buena Vista Social Club', aspect: 'groove', intensity: '2', notes: 'organic ensemble warmth' }]
  },
  {
    title: 'After Dark Oud House', country: 'Global / mixed', genre: 'Organic house with oud and darbuka', style: 'organic melodic house pulse', bpm: '122', key: 'F minor',
    coreIdea: 'A rooftop-friendly deep house track that blends oud motifs, hand percussion, and a refined late-night club pulse.', hook: 'we rise with the night',
    instruments: 'rounded kick, warm sub bass, plucked oud phrase, darbuka, tight shakers, airy vocal chops, muted brass pads',
    artists: [{ name: 'Black Coffee', aspect: 'groove', intensity: '4', notes: 'deep organic house pocket' }, { name: 'Rufus Du Sol', aspect: 'production', intensity: '2', notes: 'cinematic electronic width' }]
  }
];

function populateSelect(selector, values) {
  const select = $(selector);
  select.innerHTML = '';
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function initMoodChips() {
  const container = $('#moodChips');
  container.innerHTML = '';
  moods.forEach(mood => {
    const label = document.createElement('label');
    label.className = 'chip';
    label.innerHTML = `<input type="checkbox" value="${escapeAttr(mood)}" /> ${escapeHtml(mood)}`;
    container.appendChild(label);
  });
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function unique(values) {
  const seen = new Set();
  return values
    .map(value => String(value || '').trim())
    .filter(Boolean)
    .filter(value => {
      const key = normalize(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function sentenceJoin(values, max = 10) {
  return unique(values).slice(0, max).join(', ');
}

function fallback(value, defaultValue) {
  return value && String(value).trim() ? String(value).trim() : defaultValue;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function updateIntensityLabel(row) {
  const value = row.querySelector('.artist-intensity').value;
  row.querySelector('.artist-intensity-label').textContent = intensityLabels[value] || 'balanced';
}

function addArtistRow(data = {}) {
  const template = $('#artistRowTemplate');
  const row = template.content.firstElementChild.cloneNode(true);
  row.querySelector('.artist-name').value = data.name || '';
  row.querySelector('.artist-aspect').value = data.aspect || 'overall';
  row.querySelector('.artist-intensity').value = data.intensity || '3';
  row.querySelector('.artist-notes').value = data.notes || '';
  updateIntensityLabel(row);
  row.querySelector('.artist-intensity').addEventListener('input', () => updateIntensityLabel(row));
  row.querySelector('.remove-artist').addEventListener('click', () => {
    const rows = $$('.artist-row');
    if (rows.length > 1) row.remove();
    else {
      row.querySelector('.artist-name').value = '';
      row.querySelector('.artist-notes').value = '';
      row.querySelector('.artist-aspect').value = 'overall';
      row.querySelector('.artist-intensity').value = '3';
      updateIntensityLabel(row);
    }
  });
  $('#artistRows').appendChild(row);
}

function setArtistRows(artists) {
  $('#artistRows').innerHTML = '';
  (artists && artists.length ? artists : [{}]).forEach(addArtistRow);
}

function getState() {
  return {
    title: $('#title').value.trim(),
    useCase: $('#useCase').value,
    coreIdea: $('#coreIdea').value.trim(),
    hookPhrase: $('#hookPhrase').value.trim(),
    promptMode: $('#promptMode').value,
    genre: $('#genre').value,
    customGenre: $('#customGenre').value.trim(),
    style: $('#style').value,
    customStyle: $('#customStyle').value.trim(),
    country: $('#country').value,
    customCountry: $('#customCountry').value.trim(),
    bpm: $('#bpm').value.trim(),
    key: $('#songKey').value.trim(),
    energy: $('#energy').value,
    moods: $$('#moodChips input:checked').map(input => input.value),
    safeMode: $('#artistSafeMode').checked,
    artists: $$('.artist-row').map(row => ({
      name: row.querySelector('.artist-name').value.trim(),
      aspect: row.querySelector('.artist-aspect').value,
      intensity: row.querySelector('.artist-intensity').value,
      notes: row.querySelector('.artist-notes').value.trim()
    })).filter(item => item.name || item.notes),
    vocalDirection: $('#vocalDirection').value,
    language: $('#language').value,
    instruments: $('#instruments').value.trim(),
    arrangement: $('#arrangement').value.trim(),
    negativePrompt: $('#negativePrompt').value.trim()
  };
}

function setFormState(state = {}) {
  $('#title').value = state.title || '';
  $('#useCase').value = state.useCase || 'Single / release candidate';
  $('#coreIdea').value = state.coreIdea || '';
  $('#hookPhrase').value = state.hookPhrase || '';
  $('#promptMode').value = state.promptMode || 'lyric-scaffold';
  ensureOption('#genre', state.genre || genres[0]);
  $('#genre').value = state.genre || genres[0];
  $('#customGenre').value = state.customGenre || '';
  ensureOption('#style', state.style || styles[0]);
  $('#style').value = state.style || styles[0];
  $('#customStyle').value = state.customStyle || '';
  ensureOption('#country', state.country || 'Lebanon');
  $('#country').value = state.country || 'Lebanon';
  $('#customCountry').value = state.customCountry || '';
  $('#bpm').value = state.bpm || '';
  $('#songKey').value = state.key || '';
  ensureOption('#energy', state.energy || energies[1]);
  $('#energy').value = state.energy || energies[1];
  $('#artistSafeMode').checked = state.safeMode !== false;
  $$('#moodChips input').forEach(input => { input.checked = (state.moods || []).includes(input.value); });
  setArtistRows(state.artists || [{}]);
  ensureOption('#vocalDirection', state.vocalDirection || vocalDirections[0]);
  $('#vocalDirection').value = state.vocalDirection || vocalDirections[0];
  ensureOption('#language', state.language || 'English');
  $('#language').value = state.language || 'English';
  $('#instruments').value = state.instruments || '';
  $('#arrangement').value = state.arrangement || '';
  $('#negativePrompt').value = state.negativePrompt || '';
}

function ensureOption(selector, value) {
  const select = $(selector);
  if (!select || !value || [...select.options].some(option => option.value === value)) return;
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  select.appendChild(option);
}

function genreLabel(state) {
  return fallback(state.customGenre, state.genre === 'Custom' ? '' : state.genre) || 'original contemporary music';
}

function styleLabel(state) {
  return fallback(state.customStyle, state.style === 'Custom' ? '' : state.style) || 'polished original style';
}

function countryLabel(state) {
  return fallback(state.customCountry, state.country === 'Custom' ? '' : state.country) || 'Global / mixed';
}

function findTraitMap(artistName) {
  const normalized = normalize(artistName);
  if (!normalized) return null;
  if (traitLibrary[normalized]) return traitLibrary[normalized];
  const key = Object.keys(traitLibrary).find(item => normalized.includes(item) || item.includes(normalized));
  return key ? traitLibrary[key] : null;
}

function categoriesForAspect(aspect) {
  if (aspect === 'overall') return ['overall', 'vocal', 'groove', 'production', 'lyric'];
  if (aspect === 'performance') return ['performance', 'vocal', 'overall'];
  return [aspect, 'overall'];
}

function sanitizeCreativeNote(note, state) {
  let text = String(note || '');
  if (!state.safeMode) return text;
  state.artists.forEach(artist => {
    if (!artist.name) return;
    const pattern = new RegExp(escapeRegExp(artist.name), 'ig');
    text = text.replace(pattern, 'private inspiration reference');
  });
  return text;
}

function traitsForArtist(artist, state) {
  const map = findTraitMap(artist.name);
  const categories = categoriesForAspect(artist.aspect || 'overall');
  const traits = [];
  if (map) {
    categories.forEach(category => {
      if (map[category]) traits.push(...map[category].slice(0, artist.aspect === 'overall' ? 2 : 3));
    });
  } else if (artist.name) {
    traits.push(`private reference translated into ${String(artist.aspect || 'overall').replace('-', ' ')} traits only`);
  }
  if (artist.notes) traits.push(sanitizeCreativeNote(artist.notes, state));
  const label = intensityLabels[artist.intensity] || 'balanced';
  if (traits.length) traits.push(`${label} influence level, used as color rather than imitation`);
  return unique(traits);
}

function expandTraitMap(state) {
  const map = {
    overall: [], vocal: [], groove: [], instrumentation: [], arrangement: [], production: [], lyric: [], performance: [], notes: []
  };
  state.artists.forEach(artist => {
    const library = findTraitMap(artist.name);
    const aspect = artist.aspect || 'overall';
    const intensity = Number(artist.intensity || 3);
    const take = intensity >= 4 ? 3 : intensity <= 2 ? 1 : 2;
    if (library) {
      const categories = aspect === 'overall' ? ['overall', 'vocal', 'groove', 'production', 'lyric'] : [aspect, 'overall'];
      categories.forEach(category => {
        if (library[category]) map[category].push(...library[category].slice(0, take));
      });
    } else if (artist.name) {
      const category = map[aspect] ? aspect : 'overall';
      map[category].push(`private reference translated into original ${aspect} traits only`);
    }
    if (artist.notes) map.notes.push(`${sanitizeCreativeNote(artist.notes, state)} (${intensityLabels[artist.intensity] || 'balanced'} influence)`);
  });
  Object.keys(map).forEach(key => { map[key] = unique(map[key]); });
  return map;
}

function defaultNegative(state) {
  const base = [
    'no direct artist names',
    'no impersonation',
    'no soundalike request',
    'no copied melodies',
    'no copied lyrics',
    'no copyrighted hooks',
    'no muddy low end',
    'no harsh cymbals',
    'no generic stock-music feel',
    'no over-compressed master'
  ];
  const user = state.negativePrompt ? state.negativePrompt.split(/[,;\n]+/) : [];
  return sentenceJoin(base.concat(user), 20);
}

function buildStyleField(ctx) {
  const { state, genre, style, country, bpm, key, traits } = ctx;
  const vocal = state.language.includes('Instrumental') || state.language.includes('Wordless')
    ? 'instrumental only, no lead vocal'
    : state.vocalDirection;
  return [
    `Original ${genre}; ${style}; ${bpm} BPM; ${key}; ${country} influence; use case: ${state.useCase}.`,
    `Mood/energy: ${sentenceJoin(state.moods, 8) || 'warm, polished, emotionally specific'}; ${state.energy}.`,
    `Vocal/language: ${vocal}; ${state.language}.`,
    `Instrumentation: ${fallback(state.instruments, 'tasteful live-feeling instrumentation and polished electronic support')}.`,
    `Trait blend from private inspirations: ${sentenceJoin([].concat(traits.overall, traits.vocal, traits.groove, traits.production, traits.instrumentation, traits.notes), 18) || 'premium, original, polished, hook-aware, human-feeling'}.`,
    `Arrangement: ${fallback(state.arrangement, 'clear intro, verse, chorus, bridge, final lift, clean outro')}.`,
    `Mix: warm mids, controlled low end, smooth highs, clear vocal center, wide but not washed-out, iPhone-friendly and venue-friendly.`,
    `Originality: use inspirations only as descriptive traits; do not name or imitate real artists; keep melody, topline, lyrics, and arrangement original.`
  ].join('\n');
}

function buildPromptField(ctx) {
  const { state, title, genre, style, country, traits } = ctx;
  const languageNote = state.language.includes('+')
    ? `Use a natural ${state.language} blend; keep code-switching elegant and not forced.`
    : state.language.includes('Instrumental') || state.language.includes('Wordless')
      ? 'No sung lyrics; use instrumental motifs and wordless textures only.'
      : `Write in ${state.language}.`;
  const hook = state.hookPhrase
    ? `Tastefully use this original refrain: “${state.hookPhrase}”.`
    : 'Create one concise original refrain that is memorable after one listen.';
  const lyricWorld = sentenceJoin(traits.lyric.concat(traits.performance, traits.notes), 10) || 'place, movement, sea air, light, memory, and emotional clarity';

  if (state.promptMode === 'minimal-suno') {
    return `Create an original song titled “${title}”. Core idea: ${state.coreIdea}. ${genre}; ${style}; ${country} influence. ${hook} ${languageNote}`;
  }

  if (state.promptMode === 'instrumental-structure' || state.language.includes('Instrumental')) {
    return [
      '[Intro]',
      '*Instrumental opening; establish the main motif, ambience, and tempo without vocals.*',
      '',
      '[A Section]',
      '*Main groove enters; feature the lead instrument with a clear melodic phrase.*',
      '',
      '[B Section]',
      '*Harmonic lift; add counter-melody, tasteful percussion variation, and more width.*',
      '',
      '[Bridge]',
      '*Break down to texture, hand percussion, bass, and atmosphere; avoid losing the pulse.*',
      '',
      '[Final Section]',
      '*Return with fuller instrumentation, a stronger motif, and a clean ending or elegant fade.*'
    ].join('\n');
  }

  if (state.promptMode === 'full-writing-brief') {
    return [
      `Write an original ${genre} song titled “${title}” with ${style} character and ${country} emotional color.`,
      `Core idea: ${state.coreIdea}.`,
      `Lyric worldview: ${lyricWorld}. ${languageNote}`,
      `${hook}`,
      'Structure: [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Bridge], [Final Chorus], [Outro].',
      'Keep lyrics singable, image-led, and original. Avoid direct artist references and avoid copying known melodic or lyrical phrases.'
    ].join('\n');
  }

  return [
    '[Intro]',
    '*Short instrumental intro; establish the atmosphere without singing production notes.*',
    '',
    '[Verse 1]',
    `4 concise lines about: ${fallback(state.coreIdea, 'the central emotional scene')}`,
    `Lyric worldview: ${lyricWorld}.`,
    languageNote,
    '',
    '[Pre-Chorus]',
    '2 lines that move from private feeling to open horizon; increase melodic lift.',
    '',
    '[Chorus]',
    hook,
    'Keep the hook original; do not echo a known lyric or melody.',
    '',
    '[Verse 2]',
    'Add a second image, new detail, or time-of-night shift. Do not repeat Verse 1.',
    '',
    '[Bridge]',
    'Create contrast: softer, more cinematic, rhythmically stripped back, or harmonically surprising.',
    '',
    '[Final Chorus]',
    'Return bigger with backing vocals, a melodic variation, or call-and-response.',
    '',
    '[Outro]',
    '*Elegant ending; let the last image or instrumental motif breathe.*'
  ].join('\n');
}

function buildPrivateNotes(ctx) {
  const { state, traits } = ctx;
  const inspirations = state.artists.length
    ? state.artists.map((artist, index) => `${index + 1}. ${artist.name || 'Unnamed reference'} — aspect: ${artist.aspect}; intensity: ${intensityLabels[artist.intensity] || 'balanced'}; notes: ${artist.notes || 'none'}; translated traits: ${traitsForArtist(artist, state).join(', ') || 'none'}`).join('\n')
    : 'No private inspirations entered.';
  return [
    'PRIVATE INSPIRATION NOTES — DO NOT PASTE INTO SUNO UNLESS YOU WANT REFERENCE-ONLY NOTES',
    '',
    inspirations,
    '',
    'Expanded trait map:',
    `Overall: ${sentenceJoin(traits.overall, 12) || '—'}`,
    `Vocal: ${sentenceJoin(traits.vocal, 12) || '—'}`,
    `Groove: ${sentenceJoin(traits.groove, 12) || '—'}`,
    `Instrumentation: ${sentenceJoin(traits.instrumentation, 12) || '—'}`,
    `Arrangement: ${sentenceJoin(traits.arrangement, 12) || '—'}`,
    `Production: ${sentenceJoin(traits.production, 12) || '—'}`,
    `Lyric: ${sentenceJoin(traits.lyric, 12) || '—'}`,
    `Performance: ${sentenceJoin(traits.performance, 12) || '—'}`,
    `User notes: ${sentenceJoin(traits.notes, 12) || '—'}`
  ].join('\n');
}

function buildPacket(fields, ctx) {
  return [
    '# Suno Fields',
    '',
    '## Title',
    fields.title,
    '',
    '## Prompt / Lyrics',
    fields.prompt,
    '',
    '## Style',
    fields.style,
    '',
    '## Negative Prompt',
    fields.negative,
    '',
    '## Metadata',
    `Genre: ${ctx.genre}`,
    `Style: ${ctx.style}`,
    `Country / market: ${ctx.country}`,
    `BPM: ${ctx.bpm}`,
    `Inspired by: ${ctx.state.artists.map(a => a.name).filter(Boolean).join(', ') || 'none'}`,
    `Created: ${new Date().toLocaleString()}`
  ].join('\n');
}

function scoreBundle(ctx, fields) {
  const { state, genre, style, country, bpm, traits } = ctx;
  const flags = [];
  let originality = 100;
  let suno = 100;
  let library = 100;

  if (!state.safeMode) { originality -= 20; flags.push('Artist-safe mode is off'); }
  const directNames = state.artists.map(a => a.name).filter(Boolean).filter(name => {
    const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b`, 'i');
    return pattern.test(fields.style) || pattern.test(fields.prompt) || pattern.test(fields.negative);
  });
  if (directNames.length) { originality -= 35; flags.push(`Direct artist names detected in Suno fields: ${directNames.join(', ')}`); }
  if (!state.artists.length) { originality -= 5; flags.push('No artist inspirations entered'); }
  if (!Object.values(traits).flat().length) { originality -= 5; flags.push('Trait expansion is thin'); }

  if (!state.title) { suno -= 8; flags.push('Title is empty'); }
  if (!state.coreIdea) { suno -= 12; flags.push('Core idea is empty'); }
  if (!genre || genre === 'original contemporary music') { suno -= 8; flags.push('Genre is vague'); }
  if (!style || style === 'polished original style') { suno -= 5; flags.push('Style is vague'); }
  if (!bpm || bpm === 'medium tempo') { suno -= 8; flags.push('BPM is missing'); }
  if (!state.instruments) { suno -= 7; flags.push('Instrument palette missing'); }
  if (fields.style.length > 1400) { suno -= 5; flags.push('Style field is long; shorten before pasting'); }

  if (!country) { library -= 7; flags.push('Country/market is missing'); }
  if (!state.moods.length) { library -= 5; flags.push('No mood tags selected'); }
  if (!state.bpm) { library -= 8; }
  if (!state.genre && !state.customGenre) { library -= 8; }
  if (!state.style && !state.customStyle) { library -= 8; }

  return {
    originality: clampScore(originality),
    suno: clampScore(suno),
    library: clampScore(library),
    total: clampScore((originality + suno + library) / 3),
    flags: unique(flags)
  };
}

function buildQa(ctx, fields, scores) {
  return [
    'PROMPT MUSE v3 QA / RELEASE LOG',
    `Title: ${fields.title}`,
    `Generated: ${new Date().toLocaleString()}`,
    `Genre / style / country / BPM: ${ctx.genre}; ${ctx.style}; ${ctx.country}; ${ctx.bpm}`,
    `Use case: ${ctx.state.useCase}`,
    `Language / vocal: ${ctx.state.language}; ${ctx.state.vocalDirection}`,
    `Scores: originality ${scores.originality}/100; Suno clarity ${scores.suno}/100; library detail ${scores.library}/100; total ${scores.total}/100.`,
    `QA flags: ${scores.flags.length ? scores.flags.join('; ') : 'No major flags.'}`,
    '',
    'Copy workflow:',
    '1. Copy Title into Suno title field.',
    '2. Copy Style into Suno style field.',
    '3. Copy Prompt/Lyrics into Suno lyrics or prompt field.',
    '4. Copy Negative Prompt only if the target workflow supports it; otherwise keep it as an edit checklist.',
    '5. Save the prompt to the library before generating versions.'
  ].join('\n');
}

function buildBundle(state) {
  const title = fallback(state.title, 'Untitled Suno Concept');
  const genre = genreLabel(state);
  const style = styleLabel(state);
  const country = countryLabel(state);
  const bpm = fallback(state.bpm, 'medium tempo');
  const key = fallback(state.key, 'open key');
  const traits = expandTraitMap(state);
  const ctx = { state, title, genre, style, country, bpm, key, traits };
  const fields = {
    title,
    style: buildStyleField(ctx),
    prompt: buildPromptField(ctx),
    negative: defaultNegative(state)
  };
  const scores = scoreBundle(ctx, fields);
  const privateNotes = buildPrivateNotes(ctx);
  const packet = buildPacket(fields, ctx);
  const qa = buildQa(ctx, fields, scores);
  const metadata = buildMetadata(state, fields, scores);
  return { fields, scores, privateNotes, packet, qa, metadata, title };
}

function buildMetadata(state, fields, scores) {
  const genre = genreLabel(state);
  const style = styleLabel(state);
  const country = countryLabel(state);
  const bpmNumber = Number(String(state.bpm || '').match(/\d+/)?.[0] || 0);
  const inspiredBy = state.artists.map(artist => artist.name).filter(Boolean);
  const tags = unique([genre, style, country, ...state.moods, state.useCase, ...inspiredBy]);
  return {
    genre,
    style,
    country,
    bpm: bpmNumber,
    bpmText: state.bpm || '',
    inspiredBy,
    moods: state.moods || [],
    useCase: state.useCase,
    score: scores.total,
    tags
  };
}

function renderBundle(bundle) {
  lastBundle = bundle;
  $('#sunoTitleOutput').value = bundle.fields.title;
  $('#sunoStyleOutput').value = bundle.fields.style;
  $('#sunoPromptOutput').value = bundle.fields.prompt;
  $('#sunoNegativeOutput').value = bundle.fields.negative;
  $('#packetOutput').value = bundle.packet;
  $('#privateNotesOutput').value = bundle.privateNotes;
  $('#qaOutput').value = bundle.qa;
  $('#originalityScore').textContent = bundle.scores.originality;
  $('#sunoScore').textContent = bundle.scores.suno;
  $('#libraryScore').textContent = bundle.scores.library;
  const badge = $('#qualityBadge');
  badge.textContent = `${bundle.scores.total}/100 QA`;
  badge.classList.toggle('muted', bundle.scores.total < 82);
}

function generate(event) {
  if (event) event.preventDefault();
  const state = getState();
  const bundle = buildBundle(state);
  renderBundle(bundle);
  $('#outputSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  return { state, bundle };
}

async function copyText(text) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
  }
  flashBadge('Copied');
}

function flashBadge(text) {
  const badge = $('#qualityBadge');
  const previous = badge.textContent;
  badge.textContent = text;
  setTimeout(() => { badge.textContent = previous; }, 1100);
}

function getSunoFieldsText(bundle = lastBundle) {
  if (!bundle) return '';
  return [
    'TITLE:', bundle.fields.title,
    '',
    'STYLE:', bundle.fields.style,
    '',
    'PROMPT / LYRICS:', bundle.fields.prompt,
    '',
    'NEGATIVE PROMPT:', bundle.fields.negative
  ].join('\n');
}

function loadLibraryRaw() {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(current) && current.length) return current;
  } catch {}
  return migrateLegacyLibrary();
}

function saveLibraryRaw(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function migrateLegacyLibrary() {
  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      const legacy = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(legacy) && legacy.length) {
        const migrated = legacy.map(item => migrateLegacyItem(item)).filter(Boolean);
        saveLibraryRaw(migrated);
        return migrated;
      }
    } catch {}
  }
  return [];
}

function migrateLegacyItem(item) {
  if (!item) return null;
  const state = item.state || {};
  const importedState = {
    title: state.title || item.title || 'Imported Suno Prompt',
    useCase: state.useCase || 'Single / release candidate',
    coreIdea: state.coreIdea || '',
    hookPhrase: state.hookPhrase || '',
    promptMode: 'lyric-scaffold',
    genre: state.genreSpine || genres[0],
    customGenre: state.customGenre || '',
    style: styles[0],
    customStyle: '',
    country: 'Global / mixed',
    customCountry: '',
    bpm: state.bpm || '',
    key: state.key || '',
    energy: 'medium, premium lounge movement',
    moods: state.moods || [],
    safeMode: state.safeMode !== false,
    artists: state.artists || [],
    vocalDirection: state.vocalDirection || vocalDirections[0],
    language: state.language || 'English',
    instruments: state.instruments || '',
    arrangement: state.arrangementArc || '',
    negativePrompt: state.exclusions || ''
  };
  const bundle = buildBundle(importedState);
  return {
    id: item.id || cryptoId(),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.createdAt || new Date().toISOString(),
    favorite: false,
    title: bundle.title,
    state: importedState,
    fields: bundle.fields,
    metadata: bundle.metadata,
    scores: bundle.scores
  };
}

function saveToLibrary(forceNew = false) {
  const state = getState();
  const bundle = buildBundle(state);
  renderBundle(bundle);
  const library = loadLibraryRaw();
  const now = new Date().toISOString();
  const id = !forceNew && currentEntryId ? currentEntryId : cryptoId();
  const existing = library.find(item => item.id === id);
  const entry = {
    id,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    favorite: existing?.favorite || false,
    title: bundle.title,
    state,
    fields: bundle.fields,
    metadata: bundle.metadata,
    scores: bundle.scores
  };
  const next = [entry, ...library.filter(item => item.id !== id)].slice(0, 300);
  currentEntryId = id;
  saveLibraryRaw(next);
  updateEditBadge();
  renderLibrary();
  flashBadge(forceNew ? 'Saved new' : 'Saved');
}

function updateEditBadge() {
  const badge = $('#editBadge');
  if (currentEntryId) {
    badge.textContent = 'Editing saved item';
    badge.classList.remove('muted');
  } else {
    badge.textContent = 'New prompt';
    badge.classList.add('muted');
  }
}

function filterLibrary(items) {
  const search = normalize($('#librarySearch').value);
  const genre = $('#filterGenre').value;
  const style = $('#filterStyle').value;
  const inspired = $('#filterInspired').value;
  const country = $('#filterCountry').value;
  const min = Number($('#filterBpmMin').value || 0);
  const max = Number($('#filterBpmMax').value || 0);
  const favorites = $('#favoritesOnly').checked;

  return items.filter(item => {
    const meta = item.metadata || buildMetadata(item.state || {}, { title: item.title }, item.scores || {});
    const haystack = normalize([
      item.title,
      meta.genre,
      meta.style,
      meta.country,
      meta.bpmText,
      ...(meta.inspiredBy || []),
      ...(meta.moods || []),
      item.state?.coreIdea,
      item.state?.hookPhrase,
      item.state?.instruments,
      item.state?.negativePrompt,
      item.fields?.style,
      item.fields?.prompt,
      item.fields?.negative
    ].join(' '));
    if (search && !haystack.includes(search)) return false;
    if (genre && meta.genre !== genre) return false;
    if (style && meta.style !== style) return false;
    if (country && meta.country !== country) return false;
    if (inspired && !(meta.inspiredBy || []).includes(inspired)) return false;
    if (favorites && !item.favorite) return false;
    const bpm = Number(meta.bpm || 0);
    if (min && (!bpm || bpm < min)) return false;
    if (max && (!bpm || bpm > max)) return false;
    return true;
  });
}

function sortLibrary(items) {
  const mode = $('#librarySort').value;
  const sorted = [...items];
  sorted.sort((a, b) => {
    const am = a.metadata || {};
    const bm = b.metadata || {};
    if (mode === 'title-asc') return String(a.title || '').localeCompare(String(b.title || ''));
    if (mode === 'bpm-asc') return Number(am.bpm || 0) - Number(bm.bpm || 0);
    if (mode === 'bpm-desc') return Number(bm.bpm || 0) - Number(am.bpm || 0);
    if (mode === 'genre-asc') return String(am.genre || '').localeCompare(String(bm.genre || ''));
    if (mode === 'created-desc') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });
  return sorted;
}

function refreshFilterOptions(items) {
  const current = {
    genre: $('#filterGenre').value,
    style: $('#filterStyle').value,
    inspired: $('#filterInspired').value,
    country: $('#filterCountry').value
  };
  const metaValues = key => unique(items.map(item => item.metadata?.[key]).filter(Boolean)).sort((a, b) => a.localeCompare(b));
  const inspirations = unique(items.flatMap(item => item.metadata?.inspiredBy || [])).sort((a, b) => a.localeCompare(b));
  setFilterOptions('#filterGenre', 'All genres', metaValues('genre'), current.genre);
  setFilterOptions('#filterStyle', 'All styles', metaValues('style'), current.style);
  setFilterOptions('#filterInspired', 'All inspirations', inspirations, current.inspired);
  setFilterOptions('#filterCountry', 'All countries', metaValues('country'), current.country);
}

function setFilterOptions(selector, label, values, currentValue) {
  const select = $(selector);
  select.innerHTML = `<option value="">${escapeHtml(label)}</option>`;
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  if (currentValue && values.includes(currentValue)) select.value = currentValue;
}

function renderActiveFilters() {
  const chips = [];
  if ($('#librarySearch').value) chips.push(`search: ${$('#librarySearch').value}`);
  if ($('#filterGenre').value) chips.push(`genre: ${$('#filterGenre').value}`);
  if ($('#filterStyle').value) chips.push(`style: ${$('#filterStyle').value}`);
  if ($('#filterInspired').value) chips.push(`inspired by: ${$('#filterInspired').value}`);
  if ($('#filterCountry').value) chips.push(`country: ${$('#filterCountry').value}`);
  if ($('#filterBpmMin').value) chips.push(`BPM ≥ ${$('#filterBpmMin').value}`);
  if ($('#filterBpmMax').value) chips.push(`BPM ≤ ${$('#filterBpmMax').value}`);
  if ($('#favoritesOnly').checked) chips.push('favorites only');
  $('#activeFilters').innerHTML = chips.map(chip => `<span class="filter-chip">${escapeHtml(chip)}</span>`).join('');
}

function renderLibrary() {
  const library = loadLibraryRaw();
  refreshFilterOptions(library);
  const filtered = sortLibrary(filterLibrary(library));
  $('#libraryCount').textContent = `${filtered.length}/${library.length} shown`;
  renderActiveFilters();
  const container = $('#libraryList');
  container.innerHTML = '';
  if (!library.length) {
    container.innerHTML = '<p class="empty-state">No prompts saved yet. Generate Suno fields, then tap Save to library.</p>';
    return;
  }
  if (!filtered.length) {
    container.innerHTML = '<p class="empty-state">No saved prompts match these filters.</p>';
    return;
  }
  filtered.forEach(item => {
    const meta = item.metadata || {};
    const created = formatDate(item.updatedAt || item.createdAt);
    const artists = (meta.inspiredBy || []).join(', ') || 'none';
    const card = document.createElement('div');
    card.className = 'library-item';
    card.innerHTML = `
      <div class="library-item-header">
        <div>
          <h3>${escapeHtml(item.title || 'Untitled')}</h3>
          <p>${escapeHtml(meta.genre || 'No genre')} · ${escapeHtml(meta.style || 'No style')} · ${escapeHtml(meta.country || 'No country')} · ${escapeHtml(meta.bpmText || (meta.bpm ? String(meta.bpm) : 'no BPM'))} BPM</p>
          <p>Inspired by: ${escapeHtml(artists)} · Updated ${escapeHtml(created)}</p>
        </div>
        <button class="ghost small star-button ${item.favorite ? 'active' : ''}" data-favorite="${escapeAttr(item.id)}" type="button" aria-label="Toggle favorite">★</button>
      </div>
      <div class="meta-row">
        ${(meta.moods || []).slice(0, 8).map(mood => `<span class="meta-pill">${escapeHtml(mood)}</span>`).join('')}
        <span class="meta-pill">QA ${escapeHtml(meta.score || item.scores?.total || '—')}</span>
      </div>
      <div class="button-row wrap">
        <button class="secondary small" data-load="${escapeAttr(item.id)}" type="button">Load</button>
        <button class="primary small" data-copy-all="${escapeAttr(item.id)}" type="button">Copy all fields</button>
        <button class="secondary small" data-copy-title="${escapeAttr(item.id)}" type="button">Title</button>
        <button class="secondary small" data-copy-style="${escapeAttr(item.id)}" type="button">Style</button>
        <button class="secondary small" data-copy-prompt="${escapeAttr(item.id)}" type="button">Prompt</button>
        <button class="secondary small" data-copy-negative="${escapeAttr(item.id)}" type="button">Negative</button>
        <button class="secondary small" data-duplicate="${escapeAttr(item.id)}" type="button">Duplicate</button>
        <button class="danger small" data-delete="${escapeAttr(item.id)}" type="button">Delete</button>
      </div>`;
    container.appendChild(card);
  });
}

function findLibraryItem(id) {
  return loadLibraryRaw().find(item => item.id === id);
}

function loadLibraryItem(id) {
  const item = findLibraryItem(id);
  if (!item) return;
  currentEntryId = id;
  setFormState(item.state || {});
  const bundle = buildBundle(getState());
  renderBundle(bundle);
  updateEditBadge();
  $('#promptForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function deleteLibraryItem(id) {
  const next = loadLibraryRaw().filter(item => item.id !== id);
  saveLibraryRaw(next);
  if (currentEntryId === id) {
    currentEntryId = null;
    updateEditBadge();
  }
  renderLibrary();
}

function duplicateLibraryItem(id) {
  const item = findLibraryItem(id);
  if (!item) return;
  const nextItem = {
    ...item,
    id: cryptoId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    title: `${item.title || 'Untitled'} copy`,
    favorite: false,
    state: { ...(item.state || {}), title: `${item.state?.title || item.title || 'Untitled'} copy` }
  };
  const bundle = buildBundle(nextItem.state);
  nextItem.fields = bundle.fields;
  nextItem.metadata = bundle.metadata;
  nextItem.scores = bundle.scores;
  saveLibraryRaw([nextItem, ...loadLibraryRaw()]);
  renderLibrary();
  flashBadge('Duplicated');
}

function toggleFavorite(id) {
  const next = loadLibraryRaw().map(item => item.id === id ? { ...item, favorite: !item.favorite, updatedAt: new Date().toISOString() } : item);
  saveLibraryRaw(next);
  renderLibrary();
}

function copyFieldFromItem(id, field) {
  const item = findLibraryItem(id);
  if (!item) return;
  if (field === 'all') {
    copyText(getSunoFieldsText({ fields: item.fields }));
  } else {
    copyText(item.fields?.[field] || '');
  }
}

function clearFilters() {
  $('#librarySearch').value = '';
  $('#filterGenre').value = '';
  $('#filterStyle').value = '';
  $('#filterInspired').value = '';
  $('#filterCountry').value = '';
  $('#filterBpmMin').value = '';
  $('#filterBpmMax').value = '';
  $('#favoritesOnly').checked = false;
  renderLibrary();
}

function exportLibrary() {
  const data = {
    app: 'Prompt Muse for Suno',
    version: '3.0',
    exportedAt: new Date().toISOString(),
    items: loadLibraryRaw()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `prompt-muse-suno-library-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importLibrary(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const incoming = Array.isArray(parsed) ? parsed : parsed.items;
      if (!Array.isArray(incoming)) throw new Error('No items array found');
      const normalized = incoming.map(item => ({
        ...item,
        id: item.id || cryptoId(),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        fields: item.fields || buildBundle(item.state || {}).fields,
        metadata: item.metadata || buildBundle(item.state || {}).metadata,
        scores: item.scores || buildBundle(item.state || {}).scores
      }));
      const existing = loadLibraryRaw();
      const byId = new Map([...normalized, ...existing].map(item => [item.id, item]));
      saveLibraryRaw(Array.from(byId.values()));
      renderLibrary();
      flashBadge('Imported');
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function downloadMarkdown() {
  const bundle = lastBundle || buildBundle(getState());
  const text = [bundle.packet, '', '## Private Notes', bundle.privateNotes, '', '## QA', bundle.qa].join('\n');
  const nameBase = (bundle.fields.title || 'suno-prompt').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${nameBase || 'suno-prompt'}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function sparkIdea() {
  const idea = sparkIdeas[Math.floor(Math.random() * sparkIdeas.length)];
  currentEntryId = null;
  setFormState({
    title: idea.title,
    useCase: idea.bpm >= 118 ? 'Beach sunset set' : 'Venue background playlist',
    coreIdea: idea.coreIdea,
    hookPhrase: idea.hook,
    promptMode: idea.bpm >= 118 ? 'full-writing-brief' : 'lyric-scaffold',
    genre: idea.genre,
    customGenre: '',
    style: idea.style,
    customStyle: '',
    country: idea.country,
    customCountry: '',
    bpm: idea.bpm,
    key: idea.key,
    energy: idea.bpm >= 118 ? 'medium-high, sunset lift' : 'low-medium, conversation-friendly',
    moods: idea.bpm >= 118 ? ['after-dark', 'hypnotic', 'premium'] : ['coastal', 'warm', 'premium'],
    safeMode: true,
    artists: idea.artists,
    vocalDirection: idea.bpm >= 118 ? 'wordless vocal textures and choral pads' : vocalDirections[0],
    language: idea.bpm >= 118 ? 'English + Arabic' : 'English',
    instruments: idea.instruments,
    arrangement: idea.bpm >= 118 ? 'DJ-friendly intro → motif reveal → controlled lift → percussion bridge → final hook → mixable outro' : 'gentle intro → verse → pre-chorus lift → memorable chorus → bridge → final chorus → elegant outro',
    negativePrompt: 'no direct artist names, no impersonation, no copied hooks, no harsh EDM drops, no muddy low end, no over-compressed master'
  });
  updateEditBadge();
  generate();
}

function loadSportingTrio() {
  setArtistRows([
    { name: 'Sade', aspect: 'vocal', notes: 'silky late-night restraint, no imitation', intensity: '3' },
    { name: 'Fairuz', aspect: 'lyric', notes: 'Levantine place imagery and dignified nostalgia', intensity: '2' },
    { name: 'Ziad Rahbani', aspect: 'arrangement', notes: 'subtle Beirut jazz harmony and Rhodes warmth', intensity: '2' }
  ]);
}

function startNewPrompt() {
  currentEntryId = null;
  setFormState(defaultState());
  updateEditBadge();
  renderBundle(buildBundle(getState()));
  $('#promptForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function defaultState() {
  return {
    title: 'Ras Beirut Afterglow',
    useCase: 'Venue background playlist',
    coreIdea: 'A warm Mediterranean lounge track for golden-hour dining by the sea in Ras Beirut.',
    hookPhrase: 'Sporting Club by the sea',
    promptMode: 'lyric-scaffold',
    genre: 'Mediterranean acoustic beach lounge',
    customGenre: '',
    style: 'sunset terrace luxury',
    customStyle: '',
    country: 'Lebanon',
    customCountry: 'Ras Beirut, Lebanon',
    bpm: '104',
    key: 'A minor',
    energy: 'low-medium, conversation-friendly',
    moods: ['coastal', 'warm', 'premium', 'romantic'],
    safeMode: true,
    artists: [
      { name: 'Sade', aspect: 'vocal', intensity: '3', notes: 'silky restraint' },
      { name: 'Fairuz', aspect: 'lyric', intensity: '2', notes: 'Levantine place imagery' },
      { name: 'Ziad Rahbani', aspect: 'arrangement', intensity: '2', notes: 'subtle jazz harmony' }
    ],
    vocalDirection: 'warm male vocal, natural phrasing, emotionally restrained',
    language: 'English + Arabic',
    instruments: 'oud, nylon guitar, Rhodes, brushed drums, soft trumpet, upright bass, light sea ambience',
    arrangement: 'gentle intro → verse → pre-chorus lift → memorable chorus → trumpet answer → bridge → final chorus → elegant sea-air outro',
    negativePrompt: 'no direct artist names, no impersonation, no copied hooks, no harsh EDM drops, no muddy low end, no over-compressed master'
  };
}

function wireEvents() {
  $('#promptForm').addEventListener('submit', generate);
  $('#installHelpBtn').addEventListener('click', () => { $('#installHelp').hidden = !$('#installHelp').hidden; });
  $('#aboutBtn').addEventListener('click', () => { $('#aboutPanel').hidden = !$('#aboutPanel').hidden; });
  $('#addArtistBtn').addEventListener('click', () => addArtistRow());
  $('#presetArtistsBtn').addEventListener('click', loadSportingTrio);
  $('#sparkBtn').addEventListener('click', sparkIdea);
  $('#copySunoFieldsBtn').addEventListener('click', () => copyText(getSunoFieldsText(lastBundle || buildBundle(getState()))));
  $('#saveLibraryBtn').addEventListener('click', () => saveToLibrary(false));
  $('#saveAsNewBtn').addEventListener('click', () => saveToLibrary(true));
  $('#downloadMdBtn').addEventListener('click', downloadMarkdown);
  $('#newPromptBtn').addEventListener('click', startNewPrompt);

  $$('[data-copy-output]').forEach(button => {
    button.addEventListener('click', () => copyText($(`#${button.dataset.copyOutput}`).value));
  });

  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(item => item.classList.remove('active'));
      $$('.tab-panel').forEach(panel => panel.classList.remove('active'));
      tab.classList.add('active');
      $(`#panel-${tab.dataset.tab}`).classList.add('active');
    });
  });

  ['librarySearch', 'filterGenre', 'filterStyle', 'filterInspired', 'filterCountry', 'filterBpmMin', 'filterBpmMax', 'librarySort', 'favoritesOnly'].forEach(id => {
    $(`#${id}`).addEventListener(id === 'librarySearch' || id.startsWith('filterBpm') ? 'input' : 'change', renderLibrary);
  });

  $('#clearFiltersBtn').addEventListener('click', clearFilters);
  $('#exportLibraryBtn').addEventListener('click', exportLibrary);
  $('#importLibraryInput').addEventListener('change', event => importLibrary(event.target.files[0]));
  $('#clearLibraryBtn').addEventListener('click', () => {
    if (confirm('Clear the entire prompt library stored on this device?')) {
      saveLibraryRaw([]);
      currentEntryId = null;
      updateEditBadge();
      renderLibrary();
    }
  });

  $('#libraryList').addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.load) loadLibraryItem(target.dataset.load);
    if (target.dataset.favorite) toggleFavorite(target.dataset.favorite);
    if (target.dataset.copyAll) copyFieldFromItem(target.dataset.copyAll, 'all');
    if (target.dataset.copyTitle) copyFieldFromItem(target.dataset.copyTitle, 'title');
    if (target.dataset.copyStyle) copyFieldFromItem(target.dataset.copyStyle, 'style');
    if (target.dataset.copyPrompt) copyFieldFromItem(target.dataset.copyPrompt, 'prompt');
    if (target.dataset.copyNegative) copyFieldFromItem(target.dataset.copyNegative, 'negative');
    if (target.dataset.duplicate) duplicateLibraryItem(target.dataset.duplicate);
    if (target.dataset.delete && confirm('Delete this saved prompt?')) deleteLibraryItem(target.dataset.delete);
  });
}

function cryptoId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(value) {
  try { return new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); }
  catch { return 'unknown date'; }
}

function escapeHtml(text) {
  return String(text || '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[char]));
}

function escapeAttr(text) {
  return escapeHtml(text).replace(/`/g, '&#096;');
}

function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function init() {
  populateSelect('#genre', genres);
  populateSelect('#style', styles);
  populateSelect('#country', countries);
  populateSelect('#energy', energies);
  populateSelect('#vocalDirection', vocalDirections);
  populateSelect('#language', languages);
  initMoodChips();
  setFormState(defaultState());
  updateEditBadge();
  wireEvents();
  renderBundle(buildBundle(getState()));
  renderLibrary();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
}

document.addEventListener('DOMContentLoaded', init);
