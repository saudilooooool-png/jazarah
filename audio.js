/* ═══════════════════════════════════════════════════
   جَزَرة — محرك هوية صوت جزّور
   - هوية واحدة ثابتة لكل عبارة ثابتة أو متغيرة
   - الملفات المسجّلة لا تُشغّل إلا بعد اعتمادها لهذه الهوية
   - النص المتغير يستخدم مزوّد جزّور الموحد عند تهيئته، مع تخزين محلي
   - نطق الجهاز بديل وصول فقط؛ ليس «شخصية» ثانية لجزّور
   ═══════════════════════════════════════════════════ */
'use strict';

function audioIsMissing(e) {
  return !e || (e.name !== 'NotAllowedError' && e.name !== 'AbortError');
}

const JazarahAudio = {
  /* جميع النصوص المتغيرة والثابتة تعود إلى هذه الهوية فقط. */
  IDENTITY: {
    id: 'jazour-v1',
    label: 'جزّور — الصديق الدافئ',
    locale: 'ar-SA',
    rate: 0.90,
    pitch: 1.18,
    cacheName: 'jazarah-jazour-voice-v1',
    description: 'طفل خيالي لطيف، واضح ومرح بلا صياح أو نبرة أمر.',
  },

  /* عبارات جزّور الثابتة — لا تُفعل إلا بعد اعتماد النسخة الموحدة الجديدة. */
  APPROVED_CLIP_VERSION: 'jazour-v1',
  ASSET_VERSION: 'jazour-v3',

  CLIP_IDS: [
    'cheer', 'done', 'allday', 'levelup', 'stage', 'world', 'boss',
    'hello', 'chest', 'wakeup', 'bye',
    'next', 'keepgoing', 'almost', 'tryagain', 'wrong', 'right',
    'heart', 'sent', 'approved',
    'quran_start', 'quran_done', 'surah_done',
    'game_start', 'shop', 'buy', 'notenough',
    'screen_start', 'screen_end',
    'poke1', 'poke2', 'poke3', 'poke4', 'poke5', 'drag1', 'drag2', 'drag3',
    'story_new', 'story_wait', 'birthday', 'mypick',
  ],

  clipSource(id) {
    return `audio/prompts/ar/${encodeURIComponent(id)}.mp3?v=${this.ASSET_VERSION}`;
  },

  get clips() {
    if (!this._clips) {
      this._clips = {};
      this.CLIP_IDS.forEach(id => { this._clips[id] = this.clipSource(id); });
    }
    return this._clips;
  },

  missing: new Set(),
  clipCache: new Map(),
  dynamicMemory: new Map(),
  dynamicInflight: new Map(),

  /* لا نشغل الدفعة الحالية تلقائيًا بعد ملاحظة عدم توافقها مع الهوية.
     تُفعّل دفعة واحدة فقط بعد سماع عينة جزّور واعتمادها. */
  approvedClipVersion() {
    return localStorage.getItem('jazarah_jazour_approved_clips') || '';
  },

  areClipsApproved() {
    return this.APPROVED_CLIP_VERSION === this.IDENTITY.id || this.approvedClipVersion() === this.IDENTITY.id;
  },

  approveClips(version = this.IDENTITY.id) {
    localStorage.setItem('jazarah_jazour_approved_clips', version);
  },

  revokeClips() {
    // تُستخدم فقط للدفعات التجريبية التي لم تعتمد في إصدار التطبيق.
    localStorage.removeItem('jazarah_jazour_approved_clips');
  },

  /* عنوان المزوّد يضاف وقت النشر فقط، ولا يرسل التطبيق أي نص إلى الشبكة بدونه.
     يقبل المزود POST: {profile, text, locale, style} ويرجع audio/mpeg أو audio/wav. */
  dynamicEndpoint() {
    return window.JAZOUR_VOICE_ENDPOINT || localStorage.getItem('jazarah_jazour_voice_endpoint') || '';
  },

  hasDynamicProvider() {
    return /^https:\/\//i.test(this.dynamicEndpoint());
  },

  identityStatus() {
    return {
      id: this.IDENTITY.id,
      staticClips: this.areClipsApproved(),
      dynamicProvider: this.hasDynamicProvider(),
      fallbackVoice: !!localStorage.getItem('jazarah_voice_' + this.IDENTITY.locale),
    };
  },

  shortText(text) {
    return String(text || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/نقطة خبرة/g, 'نقطة')
      .trim()
      .slice(0, 180);
  },

  cacheKey(text, lang, style) {
    const raw = `${this.IDENTITY.id}|${lang}|${style || 'friendly'}|${text}`;
    let h = 2166136261;
    for (let i = 0; i < raw.length; i++) { h ^= raw.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36);
  },

  async _playAudio(audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
      await audio.play();
      return true;
    } catch (e) { return false; }
  },

  stop() {
    try { speechSynthesis.cancel(); } catch (e) {}
    for (const audio of this.clipCache.values()) { try { audio.pause(); } catch (e) {} }
    for (const audio of this.dynamicMemory.values()) { try { audio.pause(); } catch (e) {} }
  },

  async playClip(name) {
    // السجل المركزي قد يضيف عبارات أو مجموعات جديدة بعد بناء التطبيق؛
    // كل معرف صالح يستخدم المسار الموحد نفسه، فلا نعود محصورين في القائمة القديمة.
    const src = this.clips[name] || this.clipSource(name);
    if (!this.areClipsApproved() || !src || this.missing.has(name)) return false;
    try {
      let audio = this.clipCache.get(name);
      if (!audio) {
        audio = new Audio(src);
        audio.preload = 'auto';
        this.clipCache.set(name, audio);
      }
      const played = await this._playAudio(audio);
      if (!played) this.missing.add(name);
      return played;
    } catch (e) {
      if (audioIsMissing(e)) this.missing.add(name);
      return false;
    }
  },

  async _cachedDynamic(key) {
    if (this.dynamicMemory.has(key)) return this.dynamicMemory.get(key);
    if (!window.caches) return null;
    try {
      const cache = await caches.open(this.IDENTITY.cacheName);
      const response = await cache.match(`https://jazarah.local/voice/${key}`);
      if (!response) return null;
      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.preload = 'auto';
      this.dynamicMemory.set(key, audio);
      return audio;
    } catch (e) { return null; }
  },

  async _storeDynamic(key, response) {
    try {
      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.preload = 'auto';
      this.dynamicMemory.set(key, audio);
      if (window.caches) {
        const cache = await caches.open(this.IDENTITY.cacheName);
        await cache.put(`https://jazarah.local/voice/${key}`, new Response(blob, { headers: { 'Content-Type': blob.type || 'audio/mpeg' } }));
      }
      return audio;
    } catch (e) { return null; }
  },

  async playDynamic(text, lang = this.IDENTITY.locale, opts = {}) {
    const clean = this.shortText(text);
    const endpoint = this.dynamicEndpoint();
    if (!clean || !/^https:\/\//i.test(endpoint)) return false;
    const key = this.cacheKey(clean, lang, opts.style);
    let audio = await this._cachedDynamic(key);
    if (audio) return this._playAudio(audio);
    if (!this.dynamicInflight.has(key)) {
      this.dynamicInflight.set(key, fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: this.IDENTITY.id,
          locale: lang,
          text: clean,
          style: opts.style || 'friendly',
        }),
      }).then(async response => {
        if (!response.ok) throw new Error('voice service unavailable');
        return this._storeDynamic(key, response);
      }).finally(() => this.dynamicInflight.delete(key)));
    }
    try {
      audio = await this.dynamicInflight.get(key);
      return audio ? this._playAudio(audio) : false;
    } catch (e) { return false; }
  },

  pickFallbackVoice(lang) {
    if (!('speechSynthesis' in window)) return null;
    const voices = speechSynthesis.getVoices();
    const saved = localStorage.getItem('jazarah_voice_' + lang);
    const gentle = /(laila|layla|salma|zeina|zainab|hoda|huda|amira|fatima|mariam|sara|siri|female|woman|google.*arabic|microsoft.*ar)/i;
    const deepAdult = /(maged|naayf|naif|male|man|tarik|tariq)/i;
    const two = lang.slice(0, 2);
    return voices.find(v => v.name === saved) ||
      voices.find(v => v.lang === lang && gentle.test(v.name) && !deepAdult.test(v.name)) ||
      voices.find(v => v.lang && v.lang.startsWith(two) && gentle.test(v.name) && !deepAdult.test(v.name)) ||
      voices.find(v => v.lang && v.lang.startsWith(two)) || null;
  },

  async speak(text, lang = this.IDENTITY.locale, opts = {}) {
    const clean = this.shortText(text);
    if (!clean) return false;
    this.stop();
    if (opts.clip && await this.playClip(opts.clip)) return true;
    if (await this.playDynamic(clean, lang, opts)) return true;

    /* بديل الوصول: يبقى مضبوطًا بهوية جزّور، لكن لا يدعي أنه التسجيل المعتمد. */
    const native = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech;
    if (native) {
      native.speak({ text: clean, lang, rate: this.IDENTITY.rate, pitch: this.IDENTITY.pitch }).catch(() => {});
      return true;
    }
    if (!('speechSynthesis' in window)) {
      if (window.App) App.toast('جهازك لا يدعم القراءة الصوتية 🔇');
      return false;
    }
    try {
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = lang;
      const voice = this.pickFallbackVoice(lang);
      if (voice) u.voice = voice;
      u.rate = this.IDENTITY.rate;
      u.pitch = this.IDENTITY.pitch;
      speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  },

  voiceOptions(lang = this.IDENTITY.locale) {
    if (!('speechSynthesis' in window)) return [];
    return speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith(lang.slice(0, 2)));
  },

  saveFallbackVoice(lang, name) {
    if (name) localStorage.setItem('jazarah_voice_' + lang, name);
    else localStorage.removeItem('jazarah_voice_' + lang);
  },

  /* توافق مع الإعداد السابق؛ لا يسمح بتبديل شخصية جزّور. */
  saveVoice(lang, name) { this.saveFallbackVoice(lang, name); },
  toneName() { return this.IDENTITY.id; },
  tone() { return this.IDENTITY; },
  saveTone() {},

  chime(kind = 'tap') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    try {
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const notes = kind === 'success' ? [523.25, 659.25, 783.99] : [659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.07); osc.stop(now + i * 0.07 + 0.18);
      });
      setTimeout(() => ctx.close(), 700);
    } catch (e) {}
  },

  async cheer(text) {
    this.chime('success');
    return this.speak(text || 'يا سلام! إنجاز جميل يا بطل.', this.IDENTITY.locale, { clip: 'cheer', style: 'celebration' });
  },
};

if ('speechSynthesis' in window) {
  try {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  } catch (e) {}
}

window.JazarahAudio = JazarahAudio;
window.sayLine = function (id, text) {
  return JazarahAudio.speak(text, JazarahAudio.IDENTITY.locale, { clip: id, style: 'friendly' });
};
