const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

const STORAGE_KEY = 'promptMuseSunoHistory.v2';

const venuePresets = {
  'Custom / no preset': {
    bpm: '', key: '', genre: '',
    moods: [], instruments: '',
    arc: 'slow cinematic build → motif reveal → groove development → hook lift → clean ending',
    energy: 'user-defined',
    notes: 'User-defined direction.'
  },
  'Sporting Club · The Deck Café': {
    bpm: '92', key: 'D minor',
    genre: 'Mediterranean acoustic beach lounge',
    moods: ['sun-kissed', 'relaxed', 'premium', 'coastal'],
    instruments: 'nylon guitar, soft oud, Rhodes piano, brushed drums, upright bass, subtle sea ambience',
    arc: 'gentle café intro → warm verse → memorable sunset chorus → instrumental coastal outro',
    energy: 'low-to-medium, conversation-friendly',
    notes: 'Warm daytime-to-golden-hour dining atmosphere for Ras Beirut.'
  },
  'Sporting Club · Sunset Bar': {
    bpm: '118', key: 'A minor',
    genre: 'Mediterranean deep house with organic percussion',
    moods: ['sunset', 'euphoric', 'polished', 'oceanic'],
    instruments: 'deep rounded kick, warm sub bass, plucked oud motifs, darbuka accents, airy pads, soft brass swells',
    arc: 'textural intro → groove lift → euphoric chorus/drop → percussion break → sunset outro',
    energy: 'medium-high, elegant sunset movement',
    notes: 'Elegant sunset energy without aggressive festival EDM.'
  },
  'Sporting Club · Feluka Seafood': {
    bpm: '100', key: 'E minor',
    genre: 'Eastern Mediterranean seafood lounge with folk-jazz colors',
    moods: ['fresh', 'seaside', 'earthy', 'welcoming'],
    instruments: 'qanun, ney flute, acoustic guitar, hand percussion, light upright bass, brushed cymbals',
    arc: 'sea-air intro → storytelling verse → call-and-response hook → instrumental ney outro',
    energy: 'medium-low, organic dinner flow',
    notes: 'Organic, tasteful, conversation-friendly dining music.'
  },
  'Sporting Club · The Loft': {
    bpm: '104', key: 'G minor',
    genre: 'late-night Mediterranean sophisti-pop and jazz lounge',
    moods: ['smoky', 'elegant', 'intimate', 'after-dark'],
    instruments: 'Rhodes, muted trumpet, warm saxophone, upright bass, brushed drums, subtle tape saturation',
    arc: 'noir intro → intimate verse → silky chorus → brass solo → late-night fade',
    energy: 'medium, late-night velvet groove',
    notes: 'Refined evening lounge with jazz-club intimacy.'
  },
  'Mykonos · Global Lounge Fusion': {
    bpm: '106', key: 'B minor',
    genre: 'Balearic global lounge with Mediterranean-Arabian fusion',
    moods: ['luxury', 'serene', 'island', 'cosmopolitan'],
    instruments: 'oud, qanun, darbuka, djembe, marimba, ney flute, shakuhachi, congas, Rhodes, ambient pads',
    arc: 'ocean-wave intro → hypnotic groove → airy chorus → world-percussion bridge → sunset outro',
    energy: 'medium, high-end island lounge',
    notes: 'High-end island lounge with global textures.'
  },
  'Beirut Waterfront · Private Event': {
    bpm: '110', key: 'C minor',
    genre: 'luxury Levantine pop-lounge with soft dance pulse',
    moods: ['premium', 'romantic', 'polished', 'coastal'],
    instruments: 'oud hook, modern bass, hand percussion, satin strings, Rhodes, soft female backing vocals',
    arc: 'elegant intro → vocal statement → polished chorus → instrumental sparkle → final refrain',
    energy: 'medium, upscale social energy',
    notes: 'Event-friendly, memorable, not too intrusive.'
  },
  'Rooftop · After-Dark House': {
    bpm: '122', key: 'F minor',
    genre: 'organic melodic house with Mediterranean motifs',
    moods: ['after-dark', 'hypnotic', 'euphoric', 'minimal'],
    instruments: 'rounded kick, warm sub bass, plucked oud phrase, airy vocal chops, muted brass pads, tight shakers',
    arc: 'DJ intro → bass groove → motif reveal → controlled drop → percussion bridge → mixable outro',
    energy: 'medium-high, rooftop dance momentum',
    notes: 'Club-adjacent without becoming harsh festival EDM.'
  },
  'Luxury Fashion Reel': {
    bpm: '116', key: 'A minor',
    genre: 'minimal luxury electro-lounge with Mediterranean accents',
    moods: ['minimal', 'premium', 'sleek', 'cinematic'],
    instruments: 'tight electronic pulse, tactile percussion, muted oud sample, glassy pads, dry bass, breathy vocal textures',
    arc: 'instant motif → stylish groove → micro hook → textural break → clean logo-friendly ending',
    energy: 'controlled, editorial, short-form ready',
    notes: 'Designed for visual cuts, short hooks, and brand ambience.'
  }
};

const genreSpines = [
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
  'Minimal luxury electro-lounge'
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
  'English + French', 'Spanish', 'Spanish + Arabic', 'Instrumental / no lyrics',
  'Wordless vocal textures only'
];

const arrangementArcs = [
  'gentle intro → verse → pre-chorus lift → memorable chorus → bridge → final chorus → elegant outro',
  'textural intro → groove enters → vocal hook → instrumental break → bigger final hook → clean ending',
  'cinematic intro → intimate first verse → sweeping chorus → instrumental solo → emotional final refrain',
  'DJ-friendly intro → beat drop → verse fragments → chorus motif → percussion break → extended outro',
  'café intro → storytelling verse → soft chorus → acoustic solo → reprise → sea-air fade',
  'minimal intro → bassline focus → half-time bridge → chorus lift → restrained ending',
  'instant hook → groove pocket → vocal motif → short bridge → final hook → logo-safe ending',
  'ocean ambience → oud motif → brushed groove → brass answer → choral lift → moonlit outro'
];

const blendStrategies = [
  'Balanced blend: every reference contributes one or two traits',
  'Primary anchor: first artist sets the emotional center, others add color',
  'Contrast blend: combine opposite traits into a fresh hybrid',
  'Venue polish: reduce extremes and optimize for background luxury',
  'Hook-first: prioritize memorable chorus, vocal identity, and replay value',
  'Experimental fusion: keep originality high and make bolder combinations'
];

const originalityGuards = [
  'Strict commercial-safe: no names, no imitation, no copied melodies or lyrics',
  'Moderate: no names in final prompt; traits may be more specific',
  'Reference-only draft: keep private names only in QA and AI brief',
  'Release ledger mode: include provenance, human edit plan, and risk notes'
];

const releasePostures = [
  'Private demo / concept exploration',
  'Venue playlist candidate',
  'Commercial release candidate',
  'Client presentation draft',
  'Human vocalist demo',
  'Sync / short-form cue candidate'
];

const stemPlans = [
  'No stem plan yet',
  'Export stems for Ableton polish',
  'Export stems for Logic vocal replacement',
  'Export stems for Pro Tools mix/master',
  'Use Suno output as writing demo only',
  'Replace lead vocal and add live instrument overdubs'
];

const intensityLabels = {
  1: 'subtle',
  2: 'light',
  3: 'balanced',
  4: 'strong',
  5: 'dominant'
};

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
  'umm kulthum': {
    overall: ['grand Arabic classicism', 'deep emotional patience', 'ceremonial romantic scale'],
    vocal: ['long-form Arabic ornamentation', 'dramatic dynamic control', 'sustained emotional phrasing'],
    groove: ['slow tarab pulse', 'patient rhythmic cycles'],
    instrumentation: ['strings, qanun, oud, riq, and orchestral percussion'],
    arrangement: ['extended melodic development', 'call-and-response orchestral answers', 'gradual emotional peaks'],
    production: ['large classic ensemble feel', 'warm midrange emphasis'],
    lyric: ['elevated romantic devotion', 'classical Arabic emotional imagery'],
    performance: ['commanding, patient, emotionally expansive']
  },
  'abdel halim hafez': {
    overall: ['golden-era Arabic romance', 'cinematic longing'],
    vocal: ['romantic Arabic crooner phrasing', 'smooth legato', 'dramatic but controlled delivery'],
    groove: ['classic ballad pulse', 'swelling rhythmic drama'],
    instrumentation: ['classic strings, qanun flourishes, swelling percussion'],
    arrangement: ['cinematic intro', 'romantic refrain lift', 'orchestral bridge'],
    production: ['warm vintage orchestral tone'],
    lyric: ['direct romantic longing', 'nostalgic night imagery'],
    performance: ['tender, vulnerable, elegant']
  },
  'amr diab': {
    overall: ['clean Mediterranean pop appeal', 'summer radio confidence'],
    vocal: ['smooth confident male pop vocal', 'melodic Arabic phrasing'],
    groove: ['clean Mediterranean pop groove', 'danceable mid-tempo pulse', 'polished percussion'],
    instrumentation: ['acoustic guitar motifs', 'modern percussion', 'bright synth accents'],
    arrangement: ['verse-to-chorus clarity', 'strong hook repetition', 'radio-ready sections'],
    production: ['bright modern pop mix', 'radio-ready hook clarity'],
    lyric: ['simple romantic immediacy', 'sunny emotional directness'],
    performance: ['confident, relaxed, melodic']
  },
  'nancy ajram': {
    overall: ['friendly Arabic pop charm', 'light danceable brightness'],
    vocal: ['bright playful pop vocal', 'crisp diction', 'light ornamentation'],
    groove: ['uplifting Arabic pop rhythm', 'friendly dance pulse'],
    instrumentation: ['clean pop drums', 'sparkling synths', 'Arabic melodic accents'],
    arrangement: ['quick chorus payoff', 'light bridge', 'catchy final refrain'],
    production: ['glossy chorus lift', 'clean radio-pop finish'],
    lyric: ['playful romance', 'direct memorable phrases'],
    performance: ['bright, approachable, smiling']
  },
  'majida el roumi': {
    overall: ['elegant Lebanese romantic grandeur', 'formal Mediterranean drama'],
    vocal: ['clear dramatic soprano presence', 'wide dynamic emotional lift'],
    groove: ['slow cinematic pulse', 'orchestral ballad movement'],
    instrumentation: ['sweeping strings', 'piano, oud colors, choral lift'],
    arrangement: ['grand intro', 'slow-bloom verse', 'large final chorus'],
    production: ['wide orchestral mix', 'polished ballad finish'],
    lyric: ['elevated romance', 'homeland, sea, memory, devotion'],
    performance: ['formal, powerful, graceful']
  },
  'marcel khalife': {
    overall: ['poetic oud-led Levantine folk artistry', 'literary political-romantic dignity'],
    vocal: ['clear folk-theater delivery', 'melodic Arabic storytelling'],
    groove: ['acoustic folk pulse', 'hand-percussion movement'],
    instrumentation: ['oud lead, qanun, strings, frame drums'],
    arrangement: ['oud motif development', 'poetic refrain', 'ensemble replies'],
    production: ['natural acoustic space', 'live ensemble feel'],
    lyric: ['poetic Arabic imagery, place, longing, social conscience'],
    performance: ['earnest, literary, grounded']
  },
  'sade': {
    overall: ['silky late-night elegance', 'understated sensuality', 'smooth-jazz restraint'],
    vocal: ['velvety low-register vocal', 'unhurried phrasing', 'cool emotional control'],
    groove: ['laid-back sophisti-pop groove', 'soft syncopated bassline'],
    instrumentation: ['soft saxophone touches', 'clean guitar, electric piano, understated drums'],
    arrangement: ['space around every phrase', 'minimal bridge', 'elegant repeatable hook'],
    production: ['warm analog polish', 'space around the vocal'],
    lyric: ['adult romance, restraint, emotional privacy'],
    performance: ['cool, poised, intimate']
  },
  'daft punk': {
    overall: ['futuristic dance precision', 'sleek electronic nostalgia'],
    vocal: ['vocoder-like texture without imitation', 'robotic harmony color'],
    groove: ['precise disco-house pulse', 'robotic-funk bounce', 'four-on-the-floor clarity'],
    instrumentation: ['synth bass, electronic drums, funky guitar accents'],
    arrangement: ['repeating hook motif', 'gradual electronic layering'],
    production: ['glossy electronic sheen', 'tight sidechain movement'],
    lyric: ['minimal repeated phrases, technology-meets-emotion mood'],
    performance: ['controlled, mechanical, dance-focused']
  },
  'billie eilish': {
    overall: ['minimal dark-pop intimacy', 'controlled vulnerability'],
    vocal: ['close-mic intimate vocal', 'soft breath texture', 'controlled vulnerability'],
    groove: ['sparse low-end pulse', 'minimal trap-pop pocket'],
    instrumentation: ['sub bass, muted percussion, tiny atmospheric details'],
    arrangement: ['negative space verse', 'quiet hook impact', 'small sonic surprises'],
    production: ['minimal low-end pop production', 'negative space', 'subtle dark textures'],
    lyric: ['confessional, understated, image-led writing'],
    performance: ['whisper-close, inward, precise']
  },
  'lana del rey': {
    overall: ['cinematic vintage melancholy', 'coastal nocturnal glamour'],
    vocal: ['cinematic alto mood', 'slow-bloom melodic phrasing', 'dreamy melancholy'],
    groove: ['slow ballad pulse', 'half-time sway'],
    instrumentation: ['piano, strings, tremolo guitar, vintage pads'],
    arrangement: ['slow cinematic bloom', 'wide chorus haze', 'melancholic bridge'],
    production: ['vintage reverb haze', 'orchestral-pop atmosphere'],
    lyric: ['nostalgic glamour', 'coastal night imagery', 'romantic fatalism'],
    performance: ['dreamy, languid, cinematic']
  },
  'the weeknd': {
    overall: ['neon night-drive pop-R&B', 'dark polished sensuality'],
    vocal: ['high, sleek pop-R&B vocal energy', 'melismatic hooks used tastefully'],
    groove: ['night-drive synth-pop pulse', 'R&B groove with dance momentum'],
    instrumentation: ['neon synths, pulsing bass, crisp drums'],
    arrangement: ['pre-chorus tension', 'large chorus payoff', 'dark bridge'],
    production: ['neon synth textures', 'wide modern mix', 'dark polished low end'],
    lyric: ['after-dark desire, ambiguity, city lights'],
    performance: ['sleek, dramatic, nocturnal']
  },
  'dua lipa': {
    overall: ['confident disco-pop brightness', 'club-ready polish'],
    vocal: ['cool assertive pop vocal', 'rhythmic hook phrasing'],
    groove: ['confident disco-pop pulse', 'bassline-forward dance groove'],
    instrumentation: ['punchy bass, clean drums, disco strings or stabs'],
    arrangement: ['tight verse economy', 'big chorus impact', 'dance break'],
    production: ['clean modern pop mix', 'bright chorus impact'],
    lyric: ['direct confidence, concise pop slogans'],
    performance: ['cool, assertive, rhythmic']
  },
  'stromae': {
    overall: ['francophone electro-pop theatricality', 'bittersweet dance energy'],
    vocal: ['rhythmic spoken-sung precision', 'theatrical phrasing'],
    groove: ['syncopated electronic dance pulse', 'playful rhythmic phrasing'],
    instrumentation: ['minimal electronic beat, accordion-like color, punchy synths'],
    arrangement: ['verse narrative', 'danceable refrain', 'theatrical break'],
    production: ['clean electro-pop architecture', 'dry rhythmic vocal mix'],
    lyric: ['wry social observation', 'melancholy hidden inside danceability'],
    performance: ['precise, theatrical, bittersweet']
  },
  'buena vista social club': {
    overall: ['vintage Latin warmth', 'social, sunlit, human performance'],
    vocal: ['relaxed ensemble vocal warmth', 'aged human character'],
    groove: ['Afro-Cuban sway', 'clave-informed percussion', 'warm live ensemble feel'],
    instrumentation: ['nylon guitar, trumpet, piano montuno, congas, upright bass'],
    arrangement: ['instrumental solos', 'live band responses', 'social dance flow'],
    production: ['roomy vintage ensemble warmth'],
    lyric: ['simple social warmth, nostalgia, place'],
    performance: ['human, communal, warm']
  },
  'cesaria evora': {
    overall: ['morna-like island melancholy', 'smoky acoustic dignity'],
    vocal: ['weathered intimate vocal character', 'unforced melancholy', 'smoky warmth'],
    groove: ['morna-like sway', 'slow island rhythm'],
    instrumentation: ['acoustic guitar, cavaquinho-like sparkle, soft piano, upright bass'],
    arrangement: ['slow sway', 'instrumental answer phrases', 'unhurried outro'],
    production: ['acoustic room feel', 'guitar-led warmth'],
    lyric: ['homesick sea imagery, saudade-like longing'],
    performance: ['unforced, dignified, weathered']
  },
  'beyonce': {
    overall: ['polished pop-R&B scale', 'commanding modern confidence'],
    vocal: ['powerful polished pop-R&B vocal presence', 'stacked harmony energy', 'dynamic ad-libs'],
    groove: ['tight R&B-pop pocket', 'impactful drum movement'],
    instrumentation: ['modern drums, bass, layered harmonies, cinematic accents'],
    arrangement: ['vocal build from restraint to power', 'anthemic final chorus'],
    production: ['big modern mix', 'impactful drums', 'anthemic chorus scale'],
    lyric: ['empowerment, desire, high-confidence declarations'],
    performance: ['commanding, dynamic, polished']
  },
  'adele': {
    overall: ['soulful emotional ballad force', 'plainspoken heartbreak grandeur'],
    vocal: ['soulful belt potential', 'emotive dynamic arc', 'clear piano-ballad phrasing'],
    groove: ['slow ballad pulse', 'restrained drum entrance'],
    instrumentation: ['piano, strings, warm drums, gospel-tinged backing vocals'],
    arrangement: ['piano-led verse', 'orchestral lift', 'big final chorus'],
    production: ['large warm ballad mix', 'vocal-forward clarity'],
    lyric: ['direct heartbreak language', 'plainspoken emotional honesty'],
    performance: ['open, emotional, powerful']
  },
  'pink floyd': {
    overall: ['dreamlike progressive-rock atmosphere', 'slow immersive scale'],
    vocal: ['detached atmospheric vocal', 'long sustained phrases'],
    groove: ['slow hypnotic rock pulse', 'patient drum development'],
    instrumentation: ['electric guitar textures, analog synth pads, live bass and drums'],
    arrangement: ['extended instrumental passages', 'guitar solo centerpiece', 'cinematic transitions'],
    production: ['wide psychedelic soundstage', 'slow atmospheric build', 'immersive delay textures'],
    lyric: ['existential imagery, distance, dreams, time'],
    performance: ['patient, atmospheric, expansive']
  },
  'coldplay': {
    overall: ['earnest anthemic uplift', 'wide communal emotion'],
    vocal: ['earnest melodic lead vocal', 'communal chorus energy'],
    groove: ['steady pop-rock pulse', 'uplifting four-beat motion'],
    instrumentation: ['simple piano or guitar motif, shimmering pads, wide drums'],
    arrangement: ['anthemic build', 'simple emotional piano/guitar motif', 'wide singalong chorus'],
    production: ['bright stadium-pop lift', 'shimmering guitars and pads'],
    lyric: ['universal hope, light, togetherness'],
    performance: ['open-hearted, uplifting, communal']
  },
  'massive attack': {
    overall: ['noir electronic atmosphere', 'slow shadowy tension'],
    vocal: ['detached intimate vocal', 'understated trip-hop phrasing'],
    groove: ['slow trip-hop pulse', 'heavy dub-influenced bass', 'hypnotic restraint'],
    instrumentation: ['grainy drums, sub bass, dark pads, sparse guitar or strings'],
    arrangement: ['minimal loop evolution', 'cinematic break', 'shadowy reprise'],
    production: ['dark cinematic space', 'grainy textures', 'shadowy low end'],
    lyric: ['urban unease, emotional distance, night imagery'],
    performance: ['cool, restrained, smoky']
  },
  'jamiroquai': {
    overall: ['acid-jazz funk brightness', 'bassline-driven dance polish'],
    vocal: ['agile funk-pop vocal energy', 'rhythmic phrasing'],
    groove: ['acid-jazz funk bassline', 'syncopated dance-funk pocket'],
    instrumentation: ['Rhodes, slap bass accents, brass stabs, tight drums'],
    arrangement: ['groove-first intro', 'funky chorus', 'instrumental pocket break'],
    production: ['bright live funk polish'],
    lyric: ['movement, nightlife, playful confidence'],
    performance: ['elastic, upbeat, funky']
  },
  'bonobo': {
    overall: ['organic downtempo electronic warmth', 'textural travel mood'],
    vocal: ['airy vocal fragments', 'wordless human texture'],
    groove: ['laid-back downtempo pulse', 'organic percussion movement'],
    instrumentation: ['marimba, strings, field recordings, soft synth bass, hand percussion'],
    arrangement: ['gradual layering', 'instrumental motif evolution', 'ambient outro'],
    production: ['wide organic-electronic space', 'warm detailed textures'],
    lyric: ['minimal, image-led, often instrumental'],
    performance: ['calm, textural, patient']
  },
  'fkj': {
    overall: ['smooth live-looped neo-soul lounge', 'sunset instrumental intimacy'],
    vocal: ['soft soulful vocal textures', 'minimal ad-libs'],
    groove: ['laid-back neo-soul pocket', 'human swing', 'warm bass movement'],
    instrumentation: ['Rhodes, guitar, saxophone, warm bass, live drums'],
    arrangement: ['loop-like build with live-feeling solos', 'sax or guitar break'],
    production: ['warm analog bedroom-studio polish', 'intimate stereo field'],
    lyric: ['simple romantic fragments, more vibe than narrative'],
    performance: ['fluid, relaxed, musical']
  },
  'rosalia': {
    overall: ['modern flamenco-pop tension', 'percussive vocal drama'],
    vocal: ['ornamental vocal runs', 'dramatic clipped phrasing'],
    groove: ['handclap-driven rhythmic tension', 'minimal urban pulse'],
    instrumentation: ['palmas, guitar accents, sub bass, sharp percussion'],
    arrangement: ['sudden dropouts', 'rhythmic vocal hooks', 'dramatic contrast'],
    production: ['dry percussive intimacy', 'modern bass pressure'],
    lyric: ['desire, pride, ritual, sharp emotional images'],
    performance: ['dramatic, precise, percussive']
  },
  'gotan project': {
    overall: ['electro-tango lounge sophistication', 'noir dance elegance'],
    vocal: ['spoken or minimal vocal texture', 'smoky cabaret tone'],
    groove: ['tango rhythm fused with downtempo pulse'],
    instrumentation: ['bandoneon-like color, piano, upright bass, electronic beat, strings'],
    arrangement: ['tango motif', 'electronic groove build', 'noir instrumental break'],
    production: ['polished lounge-electronic mix', 'dramatic midrange textures'],
    lyric: ['urban night, longing, elegant restraint'],
    performance: ['stylish, smoky, controlled']
  }
};

const sparkIdeas = [
  {
    title: 'Ras Beirut Afterglow',
    idea: 'A refined golden-hour lounge track for terrace dining above the Mediterranean, nostalgic but not sleepy.',
    venue: 'Sporting Club · The Deck Café',
    genre: 'Mediterranean acoustic beach lounge',
    hook: 'Ras Beirut afterglow',
    artists: [
      { name: 'Sade', aspect: 'overall', notes: 'silky late-night elegance, no imitation', intensity: '3' },
      { name: 'Fairuz', aspect: 'lyric', notes: 'place imagery and Levantine dignity', intensity: '2' },
      { name: 'Ziad Rahbani', aspect: 'arrangement', notes: 'subtle Beirut jazz harmony', intensity: '2' }
    ]
  },
  {
    title: 'Feluka Moon Table',
    idea: 'A seafood dinner soundtrack with Levantine folk colors, soft jazz harmony, and a hook that feels like waves against wood.',
    venue: 'Sporting Club · Feluka Seafood',
    genre: 'Eastern Mediterranean seafood lounge with folk-jazz colors',
    hook: 'by the moonlit sea',
    artists: [
      { name: 'Marcel Khalife', aspect: 'instrumentation', notes: 'oud-led acoustic dignity', intensity: '3' },
      { name: 'Cesaria Evora', aspect: 'overall', notes: 'island melancholy and acoustic warmth', intensity: '2' }
    ]
  },
  {
    title: 'Aegean Oud Signal',
    idea: 'A Mykonos-style global lounge cue blending oud, marimba, soft house percussion, and expensive sunset pads.',
    venue: 'Mykonos · Global Lounge Fusion',
    genre: 'Balearic global lounge with Mediterranean-Arabian fusion',
    hook: 'island lights on the water',
    artists: [
      { name: 'Bonobo', aspect: 'production', notes: 'organic-electronic texture and gradual layering', intensity: '4' },
      { name: 'Daft Punk', aspect: 'groove', notes: 'precise pulse only, no robotic imitation', intensity: '2' }
    ]
  },
  {
    title: 'Late Loft Brass',
    idea: 'A late-night jazz lounge track with muted trumpet, Rhodes, velvet vocals, and a polished urban Beirut mood.',
    venue: 'Sporting Club · The Loft',
    genre: 'late-night Mediterranean sophisti-pop and jazz lounge',
    hook: 'stay a little longer',
    artists: [
      { name: 'Sade', aspect: 'vocal', notes: 'low velvet intimacy and restraint', intensity: '3' },
      { name: 'Ziad Rahbani', aspect: 'groove', notes: 'Rhodes-led Beirut jazz pocket', intensity: '3' },
      { name: 'Buena Vista Social Club', aspect: 'instrumentation', notes: 'human brass warmth', intensity: '2' }
    ]
  }
];

function normalize(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean).map(v => String(v).trim()).filter(Boolean))];
}

function sentenceJoin(values, limit = 16) {
  return unique(values).slice(0, limit).join('; ');
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function populateSelect(id, values) {
  const select = $(id);
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
    label.innerHTML = `<input type="checkbox" value="${escapeHtml(mood)}"><span>${escapeHtml(mood)}</span>`;
    container.appendChild(label);
  });
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

function getState() {
  return {
    title: $('#title').value.trim(),
    useCase: $('#useCase').value,
    coreIdea: $('#coreIdea').value.trim(),
    safeMode: $('#artistSafeMode').checked,
    artists: $$('.artist-row').map(row => ({
      name: row.querySelector('.artist-name').value.trim(),
      aspect: row.querySelector('.artist-aspect').value,
      intensity: row.querySelector('.artist-intensity').value,
      notes: row.querySelector('.artist-notes').value.trim()
    })).filter(item => item.name || item.notes),
    blendStrategy: $('#blendStrategy').value,
    originalityGuard: $('#originalityGuard').value,
    traitInstructions: $('#traitInstructions').value.trim(),
    venuePreset: $('#venuePreset').value,
    genreSpine: $('#genreSpine').value,
    customGenre: $('#customGenre').value.trim(),
    hookPhrase: $('#hookPhrase').value.trim(),
    moods: $$('#moodChips input:checked').map(input => input.value),
    bpm: $('#bpm').value.trim(),
    key: $('#songKey').value.trim(),
    lengthTarget: $('#lengthTarget').value,
    vocalDirection: $('#vocalDirection').value,
    language: $('#language').value,
    arrangementArc: $('#arrangementArc').value,
    promptDepth: $('#promptDepth').value,
    instruments: $('#instruments').value.trim(),
    exclusions: $('#exclusions').value.trim(),
    releasePosture: $('#releasePosture').value,
    stemPlan: $('#stemPlan').value,
    humanEditNotes: $('#humanEditNotes').value.trim()
  };
}

function findTraitMap(artistName) {
  const normalized = normalize(artistName);
  if (!normalized) return null;
  if (traitLibrary[normalized]) return traitLibrary[normalized];
  const exact = Object.keys(traitLibrary).find(key => normalized.includes(key) || key.includes(normalized));
  return exact ? traitLibrary[exact] : null;
}

function categoriesForAspect(aspect) {
  if (aspect === 'overall') return ['overall', 'vocal', 'groove', 'production', 'lyric'];
  if (aspect === 'performance') return ['performance', 'vocal', 'overall'];
  return [aspect, 'overall'];
}

function traitsForArtist(artist) {
  const map = findTraitMap(artist.name);
  const categories = categoriesForAspect(artist.aspect || 'overall');
  const traits = [];
  if (map) {
    categories.forEach(category => {
      if (map[category]) traits.push(...map[category].slice(0, artist.aspect === 'overall' ? 2 : 3));
    });
  } else if (artist.name) {
    traits.push(`broad ${String(artist.aspect || 'overall').replace('-', ' ')} energy from a private inspiration reference, translated into original musical traits`);
  }
  if (artist.notes) traits.push(artist.notes);
  const label = intensityLabels[artist.intensity] || 'balanced';
  if (traits.length) traits.push(`${label} influence level, used as color rather than imitation`);
  return unique(traits);
}

function weightedPush(target, category, values, artist) {
  if (!values || !values.length) return;
  const intensity = Number(artist.intensity || 3);
  const take = intensity >= 4 ? 3 : intensity <= 2 ? 1 : 2;
  target[category].push(...values.slice(0, take));
}

function expandTraitMap(state) {
  const map = {
    overall: [], vocal: [], groove: [], instrumentation: [], arrangement: [], production: [], lyric: [], performance: [], notes: []
  };
  state.artists.forEach(artist => {
    const library = findTraitMap(artist.name);
    const aspect = artist.aspect || 'overall';
    if (library) {
      if (aspect === 'overall') {
        ['overall', 'vocal', 'groove', 'production', 'lyric'].forEach(category => weightedPush(map, category, library[category], artist));
      } else {
        weightedPush(map, aspect, library[aspect], artist);
        weightedPush(map, 'overall', library.overall, { ...artist, intensity: Math.max(1, Number(artist.intensity || 3) - 1) });
      }
    } else if (artist.name) {
      map[aspect === 'performance' ? 'performance' : 'overall'].push(`private reference translated into ${aspect.replace('-', ' ')} traits only`);
    }
    if (artist.notes) map.notes.push(`${sanitizeCreativeNote(artist.notes, state)} (${intensityLabels[artist.intensity] || 'balanced'} influence)`);
  });
  if (state.traitInstructions) map.notes.push(sanitizeCreativeNote(state.traitInstructions, state));
  Object.keys(map).forEach(key => { map[key] = unique(map[key]); });
  return map;
}

function fallback(value, defaultValue) {
  return value && String(value).trim() ? String(value).trim() : defaultValue;
}

function getGenre(state, preset) {
  return fallback(state.customGenre, fallback(state.genreSpine, preset.genre || 'original contemporary music'));
}

function getMoodText(state, preset) {
  const selected = unique([...(state.moods || []), ...(preset.moods || [])]).slice(0, 9);
  return selected.length ? selected.join(', ') : 'clear, focused, emotionally coherent';
}

function escapeRegex(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sanitizeCreativeNote(text, state) {
  let clean = String(text || '');
  const names = unique([
    ...Object.keys(traitLibrary),
    ...(state?.artists || []).map(artist => artist.name)
  ]).filter(name => name && name.length > 2);
  names.forEach(name => {
    clean = clean.replace(new RegExp(`\\b${escapeRegex(name)}\\b`, 'ig'), 'private reference');
  });
  return clean
    .replace(/sound\s*like/ig, 'evoke broad traits from')
    .replace(/copy/ig, 'avoid copying')
    .replace(/clone/ig, 'avoid cloning')
    .replace(/identical/ig, 'distinct from')
    .replace(/impersonate/ig, 'avoid impersonating')
    .replace(/\s+/g, ' ')
    .trim();
}

function getArtistNamesInOutput(output, state) {
  const text = normalize(output);
  return state.artists
    .map(a => a.name)
    .filter(Boolean)
    .filter(name => {
      const n = normalize(name);
      return n.length > 2 && text.includes(n);
    });
}

function hookInstruction(state) {
  return state.hookPhrase
    ? `Tastefully integrate the hook phrase “${state.hookPhrase}” as a memorable refrain without over-repeating it.`
    : 'Create one concise original hook that is memorable after one listen without copying any existing song.';
}

function exclusionText(state) {
  return fallback(
    state.exclusions,
    'no direct artist names, no impersonation, no copied melodies, no copyrighted hooks, no muddy low end, no harsh cymbals, no generic stock-music feel'
  );
}

function originalityLine(state) {
  if (!state.safeMode) return 'Artist-safe mode is off; still avoid impersonation, direct imitation, copied melodies, and copied lyrics.';
  return `${state.originalityGuard}. Use artist references only as private inspiration; final prompt must not name or imitate any real artist.`;
}

function densityLines(state, lines) {
  if (state.promptDepth === 'short') return lines.filter((_, index) => index < 7).join('\n');
  if (state.promptDepth === 'detailed') return lines.join('\n');
  const standardIndexes = [0, 1, 2, 3, 4, 5, 7, 8, 9];
  return standardIndexes.map(index => lines[index]).filter(Boolean).join('\n');
}

function buildSafePrompt(ctx) {
  const { state, title, idea, genre, bpm, key, moodText, vocal, instruments, arc, traits, exclusions, preset } = ctx;
  const lines = [
    `TITLE / BRIEF: ${title} — ${idea}`,
    `STYLE: ${genre}; ${bpm} BPM; ${key}; ${state.lengthTarget}; mood palette: ${moodText}.`,
    `VOCAL: ${vocal}; language: ${state.language}; performance should feel human, tasteful, and emotionally precise.`,
    `INSTRUMENTATION: ${instruments}.`,
    `TRAIT BLEND: overall vibe: ${sentenceJoin(traits.overall.concat(traits.notes), 12) || 'original, polished, emotionally specific'}; vocal: ${sentenceJoin(traits.vocal.concat(traits.performance), 8) || vocal}; groove: ${sentenceJoin(traits.groove, 8) || 'clear rhythmic pocket'}; production: ${sentenceJoin(traits.production, 8) || 'clean premium mix'}.`,
    `ARRANGEMENT: ${arc}. Let the song evolve; avoid flat loop repetition.`,
    `HOOK: ${hookInstruction(state)}`,
    `VENUE / USE CASE: ${state.useCase}; ${preset.energy || 'balanced energy'}; ${preset.notes || 'user-defined context'}.`,
    `MIX / MASTER: clean low end, warm mids, smooth highs, wide but not washed out, vocal intelligible, venue-friendly dynamics.`,
    `ORIGINALITY RULE: ${originalityLine(state)}`,
    `EXCLUDE: ${exclusions}.`
  ];
  return densityLines(state, lines);
}

function buildExperimentalPrompt(ctx) {
  const { state, title, idea, genre, bpm, key, moodText, vocal, instruments, arc, traits, exclusions } = ctx;
  const lines = [
    `CREATIVE EXPERIMENT: ${title} — ${idea}`,
    `Hybridize ${genre} with bold but tasteful contrast; ${bpm} BPM; ${key}; ${state.lengthTarget}; mood: ${moodText}.`,
    `Blend strategy: ${state.blendStrategy}. Prioritize a fresh identity over reference accuracy.`,
    `Vocal character: ${vocal}; use micro-dynamics, human breaths, subtle ad-libs, and natural imperfections where appropriate.`,
    `Groove DNA: ${sentenceJoin(traits.groove, 10) || 'organic pulse, syncopation, controlled lift'}; add one unexpected rhythmic or textural twist.`,
    `Sound palette: ${instruments}; expand with ${sentenceJoin(traits.instrumentation, 8) || 'one distinctive lead color and one subtle atmospheric layer'}.`,
    `Production texture: ${sentenceJoin(traits.production, 10) || 'warm modern depth, detailed stereo field, tactile percussion'}; use contrast between intimate space and cinematic width.`,
    `Arrangement: ${arc}; include a surprising bridge, instrumental answer phrase, or stripped-down breakdown before the final hook.`,
    `Lyric worldview: ${sentenceJoin(traits.lyric, 10) || 'image-led, emotionally specific, not generic'}; avoid clichés and overused rhymes.`,
    `Originality rule: ${originalityLine(state)}`,
    `Avoid: ${exclusions}; no parody, no soundalike request, no copied topline.`
  ];
  return lines.join('\n');
}

function buildVenuePrompt(ctx) {
  const { state, title, idea, genre, bpm, key, moodText, vocal, instruments, arc, traits, exclusions, preset } = ctx;
  const lines = [
    `VENUE-READY PROMPT: ${title}`,
    `Create an original ${genre} track for ${state.useCase}. Core idea: ${idea}`,
    `Tempo/key/length: ${bpm} BPM, ${key}, ${state.lengthTarget}. Energy: ${preset.energy || 'balanced'}; mood: ${moodText}.`,
    `Venue context: ${state.venuePreset}; ${preset.notes || 'fit the user-defined venue context'}.`,
    `Vocal/language: ${vocal}; ${state.language}. Keep intelligibility high and avoid distracting vocal excess for hospitality playback.`,
    `Instruments: ${instruments}. Add venue-fit colors: ${sentenceJoin(traits.instrumentation, 8) || 'tasteful live-feeling melodic accents'}.`,
    `Groove: ${sentenceJoin(traits.groove, 8) || 'steady, elegant, conversation-friendly'}; maintain premium flow without harsh drops.`,
    `Arrangement: ${arc}. Make the intro useful for playlist transitions and the outro clean for crossfades.`,
    `Hook: ${hookInstruction(state)}`,
    `Mix: smooth highs, controlled sub, clear midrange, no piercing percussion, no muddy ambience; works on restaurant, terrace, and phone speakers.`,
    `Originality rule: ${originalityLine(state)}`,
    `Avoid: ${exclusions}.`
  ];
  return lines.join('\n');
}

function buildLyricScaffold(ctx) {
  const { state, idea, traits } = ctx;
  if (state.language.includes('Instrumental') || state.language.includes('Wordless')) {
    return [
      '[Intro]',
      '*Instrumental opening; establish the main motif and ambience.*',
      '',
      '[A Section]',
      '*Main groove enters; feature the lead instrument with a clear melodic phrase.*',
      '',
      '[B Section]',
      '*Harmonic lift; add counter-melody and subtle percussion variation.*',
      '',
      '[Bridge]',
      '*Break down to texture, hand percussion, and atmosphere.*',
      '',
      '[Final Section]',
      '*Return with fuller instrumentation, then fade or end cleanly.*'
    ].join('\n');
  }

  const lyricWorld = sentenceJoin(traits.lyric, 6) || 'place, longing, sea air, night light, and emotional clarity';
  const languageNote = state.language.includes('+') ? `Use a natural ${state.language} blend; keep code-switching elegant and not forced.` : `Write in ${state.language}.`;
  return [
    '[Intro]',
    '*Short instrumental intro; establish the atmosphere without singing production notes.*',
    '',
    '[Verse 1]',
    `4 concise lines about: ${idea}`,
    `Lyric worldview: ${lyricWorld}.`,
    languageNote,
    '',
    '[Pre-Chorus]',
    '2 lines that move from private feeling to open horizon; increase melodic lift.',
    '',
    '[Chorus]',
    state.hookPhrase ? `Use this refrain naturally: ${state.hookPhrase}` : 'Write a simple original refrain that can be remembered after one listen.',
    'Keep it original; do not echo a known lyric or melody.',
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

function buildSimplePrompt(ctx) {
  const { state, title, idea, genre, bpm, key, moodText, vocal, instruments, arc, traits, exclusions } = ctx;
  return [
    `Create an original ${genre} song called “${title}” for ${state.useCase}.`,
    `Core idea: ${idea}`,
    `Tempo/key: ${bpm} BPM, ${key}. Length: ${state.lengthTarget}. Mood: ${moodText}.`,
    `Vocal/language: ${vocal}; ${state.language}.`,
    `Instrumentation: ${instruments}.`,
    `Arrangement: ${arc}.`,
    `Use private artist inspirations only as these traits: ${sentenceJoin([].concat(traits.overall, traits.vocal, traits.groove, traits.production, traits.notes), 18) || 'original, polished, emotionally specific, hook-driven'}.`,
    hookInstruction(state),
    `Avoid: ${exclusions}. Do not imitate or name any real artist, and do not copy existing melodies or lyrics.`
  ].join('\n');
}

function buildAiBrief(ctx) {
  const { state, title, idea, genre, bpm, key, moodText, vocal, instruments, arc, traits, preset } = ctx;
  const inspirationList = state.artists.length
    ? state.artists.map((artist, index) => `${index + 1}. ${artist.name || 'Unnamed reference'} — desired aspect: ${artist.aspect}; intensity: ${intensityLabels[artist.intensity] || 'balanced'}; my notes: ${artist.notes || 'none'}; local traits: ${traitsForArtist(artist).join(', ') || 'none'}`).join('\n')
    : 'No artist references entered.';
  return [
    'You are helping me expand a Suno prompt while keeping it original and artist-safe.',
    '',
    'Task:',
    '- Convert the private artist inspirations below into descriptive musical traits only.',
    '- Do not place artist names in the final Suno prompt.',
    '- Do not request imitation, soundalikes, copied melodies, copied lyrics, or vocal impersonation.',
    '- Output three versions: safe commercial, creative experimental, and venue-ready.',
    '- Keep style prompt separate from lyrics/structure.',
    '',
    `Working title: ${title}`,
    `Core idea: ${idea}`,
    `Use case: ${state.useCase}`,
    `Venue preset: ${state.venuePreset} — ${preset.notes || 'user-defined'}`,
    `Genre: ${genre}`,
    `BPM/key/length: ${bpm} BPM, ${key}, ${state.lengthTarget}`,
    `Mood: ${moodText}`,
    `Vocal/language: ${vocal}; ${state.language}`,
    `Instruments: ${instruments}`,
    `Arrangement: ${arc}`,
    `Hook phrase: ${state.hookPhrase || 'create an original hook'}`,
    `Blend strategy: ${state.blendStrategy}`,
    `Originality guard: ${state.originalityGuard}`,
    `Release posture: ${state.releasePosture}`,
    `Stem/DAW plan: ${state.stemPlan}`,
    '',
    'Private artist inspirations:',
    inspirationList,
    '',
    'Local trait map:',
    formatTraitMap(traits),
    '',
    'Return:',
    '1. Safe commercial Suno style prompt',
    '2. Creative experimental Suno style prompt',
    '3. Venue-ready Suno style prompt',
    '4. Lyrics/structure scaffold',
    '5. QA flags and one-variable revision plan'
  ].join('\n');
}

function formatTraitMap(traits) {
  return [
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

function buildQa(ctx, prompts, scores) {
  const { state, title, genre, bpm, key, traits, preset, exclusions } = ctx;
  const directNames = unique([
    ...getArtistNamesInOutput(prompts.safePrompt, state),
    ...getArtistNamesInOutput(prompts.experimentalPrompt, state),
    ...getArtistNamesInOutput(prompts.venuePrompt, state),
    ...getArtistNamesInOutput(prompts.simplePrompt, state)
  ]);
  const inspirationList = state.artists.length
    ? state.artists.map((artist, index) => `${index + 1}. ${artist.name || 'Unnamed reference'} | aspect: ${artist.aspect} | intensity: ${intensityLabels[artist.intensity] || 'balanced'} | notes: ${artist.notes || 'none'} | translated: ${traitsForArtist(artist).join(', ') || 'none'}`).join('\n')
    : 'No artist references entered.';
  const flags = scorePrompt(ctx, prompts).flags;

  return [
    'PROMPT MUSE v2 QA / RELEASE LOG',
    `Title: ${title}`,
    `Generated: ${new Date().toLocaleString()}`,
    `Genre / BPM / key: ${genre}; ${bpm} BPM; ${key}`,
    `Use case: ${state.useCase}`,
    `Release posture: ${state.releasePosture}`,
    `Venue preset: ${state.venuePreset}`,
    `Venue note: ${preset.notes || 'None'}`,
    `Stem / DAW plan: ${state.stemPlan}`,
    `Human edit notes: ${state.humanEditNotes || 'None'}`,
    '',
    `Scores: originality ${scores.originality}/100; venue fit ${scores.venue}/100; Suno clarity ${scores.suno}/100; total ${scores.total}/100.`,
    `QA flags: ${flags.length ? flags.join('; ') : 'No major flags.'}`,
    `Direct artist names detected inside generated Suno prompts: ${directNames.length ? directNames.join(', ') : 'None'}`,
    '',
    'Private inspiration log:',
    inspirationList,
    '',
    'Expanded local trait map:',
    formatTraitMap(traits),
    '',
    `Exclusions: ${exclusions}`,
    '',
    'One-variable revision plan:',
    '1. Generate 4 Suno versions from the Safe prompt.',
    '2. Save the best two outputs.',
    '3. Revise only one variable at a time: BPM, vocal direction, hook phrase, instrument palette, or arrangement arc.',
    '4. For release candidates, export stems, log the prompt, add human edits, and avoid direct artist names in public metadata.'
  ].join('\n');
}

function scorePrompt(ctx, prompts) {
  const { state, traits, genre, bpm, key, instruments } = ctx;
  const flags = [];
  let suno = 100;
  let originality = 100;
  let venue = 100;

  if (!state.coreIdea) { suno -= 14; flags.push('Core idea is empty'); }
  if (!bpm || bpm === 'medium tempo') { suno -= 8; flags.push('BPM missing'); }
  if (!key || key === 'open key') { suno -= 5; flags.push('Key missing'); }
  if (!instruments || instruments === 'tasteful band and electronic textures') { suno -= 8; flags.push('Instrument palette missing'); }
  if (!genre || genre === 'original contemporary music') { suno -= 8; flags.push('Genre spine is vague'); }
  if (prompts.safePrompt.length > 1400) { suno -= 6; flags.push('Safe prompt is long; try Standard or Short density'); }

  if (!state.safeMode) { originality -= 18; flags.push('Artist-safe mode is off'); }
  if (!state.artists.length) { originality -= 5; flags.push('No artist inspirations entered'); }
  if (!Object.values(traits).flat().length) { originality -= 8; flags.push('Trait expansion is thin'); }
  const directNames = unique([
    ...getArtistNamesInOutput(prompts.safePrompt, state),
    ...getArtistNamesInOutput(prompts.experimentalPrompt, state),
    ...getArtistNamesInOutput(prompts.venuePrompt, state),
    ...getArtistNamesInOutput(prompts.simplePrompt, state)
  ]);
  if (directNames.length) { originality -= 25; flags.push(`Direct artist names found in generated Suno prompts: ${directNames.join(', ')}`); }

  if (state.venuePreset === 'Custom / no preset') { venue -= 8; flags.push('No venue preset selected'); }
  if (!state.moods.length) { venue -= 5; flags.push('No mood chips selected'); }
  if (!state.hookPhrase && !state.language.includes('Instrumental')) { venue -= 4; flags.push('Hook phrase missing'); }
  if (state.useCase.includes('Venue') && !state.stemPlan.includes('Export') && !state.stemPlan.includes('No stem')) { venue -= 3; }

  suno = clampScore(suno);
  originality = clampScore(originality);
  venue = clampScore(venue);
  const total = clampScore((suno + originality + venue) / 3);
  return { suno, originality, venue, total, flags };
}

function buildPromptBundle(state) {
  const preset = venuePresets[state.venuePreset] || venuePresets['Custom / no preset'];
  const title = fallback(state.title, 'Untitled Suno Concept');
  const idea = fallback(state.coreIdea, 'Create an original song with a strong hook, coherent structure, and polished production.');
  const genre = getGenre(state, preset);
  const bpm = fallback(state.bpm, preset.bpm || 'medium tempo');
  const key = fallback(state.key, preset.key || 'open key');
  const instruments = fallback(state.instruments, preset.instruments || 'tasteful band and electronic textures');
  const moodText = getMoodText(state, preset);
  const vocal = state.language.includes('Instrumental') || state.language.includes('Wordless') ? 'instrumental only, no lead vocal' : state.vocalDirection;
  const arc = state.arrangementArc || preset.arc || arrangementArcs[0];
  const exclusions = exclusionText(state);
  const traits = expandTraitMap(state);

  const ctx = { state, preset, title, idea, genre, bpm, key, instruments, moodText, vocal, arc, exclusions, traits };
  const safePrompt = buildSafePrompt(ctx);
  const experimentalPrompt = buildExperimentalPrompt(ctx);
  const venuePrompt = buildVenuePrompt(ctx);
  const lyricScaffold = buildLyricScaffold(ctx);
  const simplePrompt = buildSimplePrompt(ctx);
  const aiBrief = buildAiBrief(ctx);
  const promptSet = { safePrompt, experimentalPrompt, venuePrompt, simplePrompt };
  const scores = scorePrompt(ctx, promptSet);
  const qa = buildQa(ctx, promptSet, scores);

  return { safePrompt, experimentalPrompt, venuePrompt, lyricScaffold, simplePrompt, aiBrief, qa, scores, title };
}

function renderBundle(bundle) {
  $('#safeOutput').value = bundle.safePrompt;
  $('#experimentalOutput').value = bundle.experimentalPrompt;
  $('#venueOutput').value = bundle.venuePrompt;
  $('#lyricsOutput').value = bundle.lyricScaffold;
  $('#simpleOutput').value = bundle.simplePrompt;
  $('#aiBriefOutput').value = bundle.aiBrief;
  $('#qaOutput').value = bundle.qa;
  $('#originalityScore').textContent = bundle.scores.originality;
  $('#venueScore').textContent = bundle.scores.venue;
  $('#sunoScore').textContent = bundle.scores.suno;
  const badge = $('#qualityBadge');
  badge.textContent = `${bundle.scores.total}/100 QA`;
  badge.classList.toggle('muted', bundle.scores.total < 82);
}

function generate(event) {
  if (event) event.preventDefault();
  const state = getState();
  const bundle = buildPromptBundle(state);
  renderBundle(bundle);
  $('#outputSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  return { state, bundle };
}

async function copyText(text) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    flashBadge('Copied');
  } catch {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
    flashBadge('Copied');
  }
}

function flashBadge(text) {
  const badge = $('#qualityBadge');
  const previous = badge.textContent;
  badge.textContent = text;
  setTimeout(() => { badge.textContent = previous; }, 1100);
}

function getCurrentBundleText() {
  return [
    '# Prompt Muse v2 · Suno Prompt Bundle',
    '',
    '## Safe Commercial Style Prompt',
    $('#safeOutput').value,
    '',
    '## Creative Experimental Style Prompt',
    $('#experimentalOutput').value,
    '',
    '## Venue-Ready Style Prompt',
    $('#venueOutput').value,
    '',
    '## Lyrics / Structure Scaffold',
    $('#lyricsOutput').value,
    '',
    '## One-Box Simple Mode Prompt',
    $('#simpleOutput').value,
    '',
    '## Optional AI Expansion Brief',
    $('#aiBriefOutput').value,
    '',
    '## QA / Release Log',
    $('#qaOutput').value
  ].join('\n');
}

function savePrompt() {
  const state = getState();
  const bundle = buildPromptBundle(state);
  renderBundle(bundle);
  const history = loadHistory();
  history.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    title: bundle.title,
    state,
    bundle
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 40)));
  renderHistory();
  flashBadge('Saved');
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function renderHistory() {
  const history = loadHistory();
  $('#historyCount').textContent = `${history.length} saved`;
  const container = $('#historyList');
  container.innerHTML = '';
  if (!history.length) {
    container.innerHTML = '<p class="footer-note">No prompts saved yet. Generate a bundle, then tap Save to history.</p>';
    return;
  }
  history.slice(0, 16).forEach(item => {
    const card = document.createElement('div');
    card.className = 'history-item';
    const date = new Date(item.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    const score = item.bundle?.scores?.total ? `${item.bundle.scores.total}/100` : 'saved';
    card.innerHTML = `
      <h3>${escapeHtml(item.title || 'Untitled')}</h3>
      <p>${escapeHtml(date)} · ${escapeHtml(item.state?.genreSpine || item.state?.customGenre || 'Prompt bundle')} · ${escapeHtml(score)}</p>
      <div class="button-row wrap">
        <button class="secondary small" data-load="${escapeHtml(item.id)}" type="button">Load</button>
        <button class="secondary small" data-copy-history="${escapeHtml(item.id)}" type="button">Copy</button>
        <button class="danger small" data-delete="${escapeHtml(item.id)}" type="button">Delete</button>
      </div>`;
    container.appendChild(card);
  });
}

function escapeHtml(text) {
  return String(text || '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[char]));
}

function setArtistRows(artists) {
  $('#artistRows').innerHTML = '';
  (artists?.length ? artists : [{}]).forEach(addArtistRow);
}

function setFormState(state) {
  $('#title').value = state.title || '';
  $('#useCase').value = state.useCase || 'Single / release candidate';
  $('#coreIdea').value = state.coreIdea || '';
  $('#artistSafeMode').checked = state.safeMode !== false;
  setArtistRows(state.artists || [{}]);
  $('#blendStrategy').value = state.blendStrategy || blendStrategies[0];
  $('#originalityGuard').value = state.originalityGuard || originalityGuards[0];
  $('#traitInstructions').value = state.traitInstructions || '';
  $('#venuePreset').value = state.venuePreset || 'Custom / no preset';
  ensureOption('#genreSpine', state.genreSpine || genreSpines[0]);
  $('#genreSpine').value = state.genreSpine || genreSpines[0];
  $('#customGenre').value = state.customGenre || '';
  $('#hookPhrase').value = state.hookPhrase || '';
  $$('#moodChips input').forEach(input => input.checked = (state.moods || []).includes(input.value));
  $('#bpm').value = state.bpm || '';
  $('#songKey').value = state.key || '';
  $('#lengthTarget').value = state.lengthTarget || '3:00 radio-ready';
  ensureOption('#vocalDirection', state.vocalDirection || vocalDirections[0]);
  $('#vocalDirection').value = state.vocalDirection || vocalDirections[0];
  ensureOption('#language', state.language || 'English');
  $('#language').value = state.language || 'English';
  ensureOption('#arrangementArc', state.arrangementArc || arrangementArcs[0]);
  $('#arrangementArc').value = state.arrangementArc || arrangementArcs[0];
  $('#promptDepth').value = state.promptDepth || 'standard';
  $('#instruments').value = state.instruments || '';
  $('#exclusions').value = state.exclusions || '';
  $('#releasePosture').value = state.releasePosture || releasePostures[0];
  $('#stemPlan').value = state.stemPlan || stemPlans[0];
  $('#humanEditNotes').value = state.humanEditNotes || '';
}

function ensureOption(selector, value) {
  const select = $(selector);
  if (!value || [...select.options].some(option => option.value === value)) return;
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  select.appendChild(option);
}

function downloadMarkdown() {
  const text = getCurrentBundleText();
  const nameBase = ($('#title').value || 'suno-prompt-bundle-v2').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${nameBase || 'suno-prompt-bundle-v2'}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function applyVenuePreset() {
  const preset = venuePresets[$('#venuePreset').value];
  if (!preset) return;
  if (preset.bpm) $('#bpm').value = preset.bpm;
  if (preset.key) $('#songKey').value = preset.key;
  if (preset.genre) {
    ensureOption('#genreSpine', preset.genre);
    $('#genreSpine').value = preset.genre;
  }
  if (preset.instruments) $('#instruments').value = preset.instruments;
  if (preset.arc) {
    ensureOption('#arrangementArc', preset.arc);
    $('#arrangementArc').value = preset.arc;
  }
  $$('#moodChips input').forEach(input => {
    input.checked = (preset.moods || []).includes(input.value);
  });
}

function sparkIdea() {
  const idea = sparkIdeas[Math.floor(Math.random() * sparkIdeas.length)];
  $('#title').value = idea.title;
  $('#coreIdea').value = idea.idea;
  $('#venuePreset').value = idea.venue;
  applyVenuePreset();
  $('#customGenre').value = idea.genre;
  $('#hookPhrase').value = idea.hook;
  setArtistRows(idea.artists || [{}]);
  $('#blendStrategy').value = idea.venue.includes('Mykonos') ? blendStrategies[5] : blendStrategies[3];
  $('#traitInstructions').value = 'keep the final prompt original, premium, and free of direct artist names';
  generate();
}

function loadArtistTrio() {
  setArtistRows([
    { name: 'Sade', aspect: 'vocal', notes: 'silky late-night restraint, no imitation', intensity: '3' },
    { name: 'Fairuz', aspect: 'lyric', notes: 'Levantine place imagery and dignified nostalgia', intensity: '2' },
    { name: 'Ziad Rahbani', aspect: 'arrangement', notes: 'subtle Beirut jazz harmony and Rhodes warmth', intensity: '2' }
  ]);
  $('#traitInstructions').value = 'blend into a modern Mediterranean lounge identity; keep melody and lyrics fully original';
}

function wireEvents() {
  $('#promptForm').addEventListener('submit', generate);
  $('#addArtistBtn').addEventListener('click', () => addArtistRow());
  $('#presetArtistsBtn').addEventListener('click', loadArtistTrio);
  $('#venuePreset').addEventListener('change', applyVenuePreset);
  $('#randomizeBtn').addEventListener('click', sparkIdea);
  $('#installHelpBtn').addEventListener('click', () => { $('#installHelp').hidden = !$('#installHelp').hidden; });
  $('#aboutBtn').addEventListener('click', () => { $('#aboutPanel').hidden = !$('#aboutPanel').hidden; });
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('active'));
      $$('.tab-panel').forEach(panel => panel.classList.remove('active'));
      tab.classList.add('active');
      $(`#panel-${tab.dataset.tab}`).classList.add('active');
    });
  });
  $$('[data-copy]').forEach(button => {
    button.addEventListener('click', () => copyText($(`#${button.dataset.copy}`).value));
  });
  $('#copyAllBtn').addEventListener('click', () => copyText(getCurrentBundleText()));
  $('#savePromptBtn').addEventListener('click', savePrompt);
  $('#downloadMdBtn').addEventListener('click', downloadMarkdown);
  $('#clearHistoryBtn').addEventListener('click', () => {
    if (confirm('Clear all saved prompt history on this device?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderHistory();
    }
  });
  $('#historyList').addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    const history = loadHistory();
    if (target.dataset.load) {
      const item = history.find(h => h.id === target.dataset.load);
      if (item) {
        setFormState(item.state);
        renderBundle(item.bundle || buildPromptBundle(item.state));
        $('#promptForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (target.dataset.copyHistory) {
      const item = history.find(h => h.id === target.dataset.copyHistory);
      if (item) {
        const b = item.bundle || buildPromptBundle(item.state);
        copyText([
          '# Prompt Muse v2 · Suno Prompt Bundle',
          '',
          '## Safe Commercial Style Prompt', b.safePrompt,
          '',
          '## Creative Experimental Style Prompt', b.experimentalPrompt,
          '',
          '## Venue-Ready Style Prompt', b.venuePrompt,
          '',
          '## Lyrics / Structure Scaffold', b.lyricScaffold,
          '',
          '## One-Box Simple Mode Prompt', b.simplePrompt,
          '',
          '## Optional AI Expansion Brief', b.aiBrief,
          '',
          '## QA / Release Log', b.qa
        ].join('\n'));
      }
    }
    if (target.dataset.delete) {
      const next = history.filter(h => h.id !== target.dataset.delete);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      renderHistory();
    }
  });
}

function init() {
  populateSelect('#venuePreset', Object.keys(venuePresets));
  populateSelect('#genreSpine', genreSpines);
  populateSelect('#vocalDirection', vocalDirections);
  populateSelect('#language', languages);
  populateSelect('#arrangementArc', arrangementArcs);
  populateSelect('#blendStrategy', blendStrategies);
  populateSelect('#originalityGuard', originalityGuards);
  populateSelect('#releasePosture', releasePostures);
  populateSelect('#stemPlan', stemPlans);
  initMoodChips();
  setArtistRows([{ name: '', aspect: 'overall', notes: '', intensity: '3' }]);
  $('#coreIdea').value = 'A warm Mediterranean lounge track for golden-hour dining by the sea in Ras Beirut.';
  $('#venuePreset').value = 'Sporting Club · The Deck Café';
  applyVenuePreset();
  $('#title').value = 'Ras Beirut Afterglow';
  $('#hookPhrase').value = 'Sporting Club by the sea';
  $('#traitInstructions').value = 'premium Mediterranean warmth, original melody, elegant hospitality playback';
  $('#exclusions').value = 'no direct artist names, no impersonation, no copied hooks, no harsh EDM drops, no muddy low end, no over-compressed master';
  $('#releasePosture').value = 'Venue playlist candidate';
  $('#stemPlan').value = 'Export stems for Ableton polish';
  wireEvents();
  renderBundle(buildPromptBundle(getState()));
  renderHistory();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
}

document.addEventListener('DOMContentLoaded', init);
