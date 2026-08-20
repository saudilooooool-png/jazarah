/* جَزَرة — طبقة صوت موحّدة
   - تستخدم ملفات صوت بشرية إذا أضيفت لاحقًا داخل audio/prompts
   - تضيف مؤثرات قصيرة عبر WebAudio
   - ترجع إلى نطق النظام/المتصفح عند عدم توفر الملفات */
'use strict';

const JazarahAudio = {
  clips: {
    cheer: 'audio/prompts/ar/cheer.mp3',
    next: 'audio/prompts/ar/next.mp3',
    heart: 'audio/prompts/ar/heart.mp3',
    done: 'audio/prompts/ar/done.mp3',
  },
  cache: new Map(),
  tones: {
    child_soft: {
      label: 'طفولي ناعم',
      rate: 0.86,
      pitch: 1.35,
      intro: 'صوت خفيف ومرح للأطفال',
    },
    mother_soft: {
      label: 'أمومي هادئ',
      rate: 0.82,
      pitch: 1.18,
      intro: 'أهدأ وأنسب قبل النوم والقرآن',
    },
    narrator: {
      label: 'راوي واضح',
      rate: 0.9,
      pitch: 1.02,
      intro: 'واضح للمهام الطويلة',
    },
  },

  toneName() {
    return localStorage.getItem('jazarah_voice_tone') || 'child_soft';
  },

  tone() {
    return this.tones[this.toneName()] || this.tones.child_soft;
  },

  async playClip(name) {
    const src = this.clips[name];
    if (!src) return false;
    try {
      let audio = this.cache.get(name);
      if (!audio) {
        audio = new Audio(src);
        audio.preload = 'auto';
        this.cache.set(name, audio);
      }
      audio.currentTime = 0;
      await audio.play();
      return true;
    } catch (e) {
      return false;
    }
  },

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
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.16);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.18);
      });
      setTimeout(() => ctx.close(), 700);
    } catch (e) {
      /* تجاهل: بعض المتصفحات تمنع الصوت قبل تفاعل المستخدم */
    }
  },

  shortText(text) {
    return String(text || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/نقطة خبرة/g, 'نقطة')
      .trim()
      .slice(0, 150);
  },

  pickVoice(lang) {
    if (!('speechSynthesis' in window)) return null;
    const voices = speechSynthesis.getVoices();
    const saved = localStorage.getItem('jazarah_voice_' + lang);
    const softArabic = /(laila|layla|salma|zeina|zainab|hoda|huda|amira|fatima|mariam|microsoft.*ar|google.*arabic|female|woman|samantha|sara|siri)/i;
    const avoidDeepMale = /(maged|maged|naayf|naif|male|man|tarik|tariq)/i;
    return voices.find(v => v.name === saved) ||
      voices.find(v => v.lang === lang && softArabic.test(v.name) && !avoidDeepMale.test(v.name)) ||
      voices.find(v => v.lang && v.lang.startsWith(lang.slice(0, 2)) && softArabic.test(v.name) && !avoidDeepMale.test(v.name)) ||
      voices.find(v => v.lang && v.lang.startsWith(lang.slice(0, 2))) ||
      null;
  },

  async speak(text, lang = 'ar-SA', opts = {}) {
    if (opts.clip) {
      const played = await this.playClip(opts.clip);
      if (played && !opts.alsoTts) return;
    }

    const native = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech;
    const clean = this.shortText(text);
    const tone = this.tone();
    const rate = opts.rate || tone.rate;
    const pitch = opts.pitch || tone.pitch;
    if (!clean) return;

    if (native) {
      native.speak({
        text: clean,
        lang,
        rate,
        pitch,
      }).catch(() => {});
      return;
    }

    if (!('speechSynthesis' in window)) {
      if (window.App) App.toast('جهازك لا يدعم القراءة الصوتية 🔇');
      return;
    }

    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = lang;
      const voice = this.pickVoice(lang);
      if (voice) u.voice = voice;
      u.rate = rate;
      u.pitch = pitch;
      speechSynthesis.speak(u);
    } catch (e) {
      /* تجاهل */
    }
  },

  voiceOptions(lang = 'ar-SA') {
    if (!('speechSynthesis' in window)) return [];
    return speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith(lang.slice(0, 2)));
  },

  saveVoice(lang, name) {
    if (name) localStorage.setItem('jazarah_voice_' + lang, name);
    else localStorage.removeItem('jazarah_voice_' + lang);
  },

  saveTone(name) {
    if (this.tones[name]) localStorage.setItem('jazarah_voice_tone', name);
  },

  async cheer(text) {
    this.chime('success');
    await this.speak(text || 'يا سلام! إنجاز جميل يا بطل.', 'ar-SA', {
      clip: 'cheer',
      alsoTts: true,
      rate: this.tone().rate,
      pitch: this.tone().pitch,
    });
  },
};

if ('speechSynthesis' in window) {
  try {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  } catch (e) {}
}
