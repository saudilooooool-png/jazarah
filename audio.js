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

(function installJazarahAudioUI() {
  const css = `
    .app-tagline{margin-bottom:14px}
    .release-banner{width:100%;margin-bottom:24px;padding:12px 14px;border-radius:18px;background:rgba(255,255,255,.78);border:2px solid rgba(255,140,66,.35);box-shadow:0 4px 0 rgba(229,115,42,.12);color:#7a5230;display:flex;flex-direction:column;gap:2px;font-size:.9rem}
    .release-banner b{color:#e5732a;font-size:1rem}
    .audio-card-lite{background:linear-gradient(120deg,#fff7ed,#f4edff);border:2px solid #ead9ff}
    .tone-grid{display:grid;gap:8px}
    .tone-choice{display:grid;grid-template-columns:auto 1fr;column-gap:10px;row-gap:2px;align-items:center;background:#fbfaff;border:2px solid #e5e1f5;border-radius:14px;padding:10px 12px;cursor:pointer}
    .tone-choice input{grid-row:span 2;width:20px;height:20px;accent-color:#9b6dff}
    .tone-choice b{font-weight:900;color:#2d2a4a}
    .tone-choice small{color:#8a86a8;font-weight:700}
    .tone-choice:has(input:checked),.tone-choice.active{border-color:#9b6dff;background:#f4edff}
    .next-step-card{background:linear-gradient(135deg,#fff,#fff8e8);border:3px solid #ffd99f;border-radius:26px;padding:16px;margin:4px 0 12px;box-shadow:0 7px 0 rgba(255,140,66,.18)}
    .next-copy .next-label{display:inline-flex;background:#fff0d9;color:#e5732a;border-radius:999px;padding:4px 10px;font-size:.78rem;font-weight:900}
    .next-copy h2{font-size:1.35rem;font-weight:900;margin:8px 0 3px}
    .next-copy p{color:#7a6f8e;font-weight:700;font-size:.92rem}
    .next-actions{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:stretch;margin-top:12px}
    .listen-pill{background:#f0e9ff;color:#9b6dff;border-radius:16px;padding:0 14px;font-weight:900;border:2px solid #dccbff}
    .today-progress{display:grid;grid-template-columns:auto auto 1fr;align-items:center;gap:8px;margin-top:12px;font-size:.82rem;color:#8a86a8;font-weight:900}
    .today-progress i{height:10px;border-radius:999px;background:#f0e9ff;overflow:hidden}
    .today-progress em{display:block;height:100%;background:linear-gradient(90deg,#4caf7d,#ffc93c);border-radius:inherit;transition:width .35s ease}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const originalSpeak = window.speak;
  if (typeof originalSpeak === 'function') {
    window.speak = function patchedSpeak(text, lang = 'ar-SA') {
      JazarahAudio.speak(text, lang);
    };
  }

  function escLite(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function nextKidStep(doneIds, pendingToday) {
    const child = typeof C === 'function' ? C() : null;
    if (!child) return null;
    const today = typeof todayKey === 'function' ? todayKey() : new Date().toISOString().slice(0, 10);
    const quranState = window.App && App._quranState ? App._quranState() : { claimed: true };
    if (!quranState.claimed) {
      return {
        title: 'ورد القرآن',
        desc: `اقرأ ${child.quranDaily || 5} دقائق مع جزّور.`,
        cta: 'ابدأ القرآن 📖',
        action: 'App.openQuranKids()',
        say: `ابدأ ورد القرآن. اقرأ ${child.quranDaily || 5} دقائق مع جزّور.`,
      };
    }
    const task = (child.tasks || [])
      .filter(t => typeof isWeekend !== 'function' || !isWeekend() || t.cat !== 'study' || t.weekendOk)
      .filter(t => !t.mine || t.id === 'mine-' + today)
      .find(t => !doneIds.has(t.id) && !pendingToday.has(t.id));
    if (task) {
      const et = typeof effectiveTask === 'function' ? effectiveTask(task, today) : task;
      const catName = window.CATEGORIES && CATEGORIES[task.cat] ? CATEGORIES[task.cat].name : 'مهمة اليوم';
      return {
        title: task.title,
        desc: `${catName} · ${et.coins || task.coins || 0} جزرات`,
        cta: 'أنجز المهمة ⭐',
        action: `App.completeTask('${task.id}')`,
        say: `مهمتك الآن: ${task.title}.`,
      };
    }
    return {
      title: 'ألعاب اليوم',
      desc: 'كلمات وحساب خفيفة تكسبك جزرًا إضافية.',
      cta: 'افتح الألعاب 🎮',
      action: 'App.openGamesHub()',
      say: 'افتح ألعاب اليوم. كلمات وحساب خفيفة.',
    };
  }

  function renderNextCard() {
    const child = typeof C === 'function' ? C() : null;
    if (!child || !window.App) return;
    const today = typeof todayKey === 'function' ? todayKey() : new Date().toISOString().slice(0, 10);
    const doneIds = new Set((child.completions && child.completions[today]) || []);
    const pendingToday = new Set((child.pendingProofs || []).filter(p => p.date === today).map(p => p.taskId));
    const step = nextKidStep(doneIds, pendingToday);
    const scene = document.querySelector('#ktab-map .jz-scene');
    if (!step || !scene || document.querySelector('#ktab-map .next-step-card')) return;
    const total = (child.tasks || []).filter(t => typeof isWeekend !== 'function' || !isWeekend() || t.cat !== 'study' || t.weekendOk).length || 1;
    const pct = Math.min(100, Math.round((doneIds.size / total) * 100));
    scene.insertAdjacentHTML('afterend', `
      <section class="next-step-card">
        <div class="next-copy">
          <span class="next-label">التالي لك الآن</span>
          <h2>${escLite(step.title)}</h2>
          <p>${escLite(step.desc)}</p>
        </div>
        <div class="next-actions">
          <button class="btn-primary big" onclick="${step.action}">${step.cta}</button>
          <button class="listen-pill" data-say="${escLite(step.say)}" onclick="App.sayText(this)">🔊 اسمع</button>
        </div>
        <div class="today-progress">
          <span>تقدم اليوم</span><b>${doneIds.size}/${total}</b><i><em style="width:${pct}%"></em></i>
        </div>
      </section>`);
  }

  function appendAudioSettings() {
    const panel = document.getElementById('ptab-settings');
    if (!panel || panel.querySelector('.audio-card-lite')) return;
    panel.insertAdjacentHTML('afterbegin', `
      <div class="card audio-card-lite">
        <h3>🔊 صوت جزّور</h3>
        <p class="muted" style="margin-bottom:10px">النمط الافتراضي الآن «طفولي ناعم»: طبقة أعلى، سرعة أخف، وتفضيل الأصوات العربية الناعمة إن توفرت.</p>
        <div class="form-row">
          <div><button class="btn-primary purple" onclick="JazarahAudio.openSettings()">اختبار واختيار الصوت</button></div>
          <div><button class="btn-primary green" onclick="JazarahAudio.cheer('يا سلام! صوت جزّور صار ألطف. أحسنت يا بطل.')">جرّب التشجيع ✨</button></div>
        </div>
      </div>`);
  }

  JazarahAudio.openSettings = function openSettings() {
    const voices = this.voiceOptions('ar-SA');
    const saved = localStorage.getItem('jazarah_voice_ar-SA') || '';
    const tone = this.toneName();
    const body = `
      <h3>🔊 إعداد صوت جزّور</h3>
      <p class="muted" style="margin-bottom:12px">اختر نمطًا ناعمًا. إذا كان الجهاز لا يملك إلا صوتًا عربيًا رجاليًا فسنرفع الطبقة ونخفف السرعة، لكن الصوت البشري الحقيقي يحتاج ملفات MP3 نضيفها لاحقًا.</p>
      <div class="form-grid">
        <div><label>نمط النبرة</label><div class="tone-grid">
          ${Object.entries(this.tones).map(([key, cfg]) => `
            <label class="tone-choice ${key === tone ? 'active' : ''}">
              <input type="radio" name="voice-tone" value="${key}" ${key === tone ? 'checked' : ''} />
              <b>${escLite(cfg.label)}</b><small>${escLite(cfg.intro)}</small>
            </label>`).join('')}
        </div></div>
        <div><label>الصوت العربي</label><select id="f-voice">
          <option value="">اختيار تلقائي</option>
          ${voices.map(v => `<option value="${escLite(v.name)}" ${v.name === saved ? 'selected' : ''}>${escLite(v.name)} — ${escLite(v.lang)}</option>`).join('')}
        </select>${voices.length ? '' : '<p class="muted">لا تظهر أصوات عربية حاليًا في هذا المتصفح؛ جرّب من الجهاز الحقيقي أو Android/iOS.</p>'}</div>
        <button class="btn-primary green" onclick="JazarahAudio.saveSettingsFromModal()">حفظ وتجربة الصوت</button>
      </div>`;
    if (window.App && App.openModal) App.openModal(body);
  };

  JazarahAudio.saveSettingsFromModal = function saveSettingsFromModal() {
    const voice = document.getElementById('f-voice');
    const tone = document.querySelector('input[name="voice-tone"]:checked');
    this.saveVoice('ar-SA', voice ? voice.value : '');
    if (tone) this.saveTone(tone.value);
    if (window.App && App.toast) App.toast('تم حفظ الصوت ✅');
    this.cheer('يا سلام! صوت جزّور صار ألطف. أحسنت يا بطل.');
  };

  function patchApp() {
    if (!window.App || App.__audioPatched) return;
    App.__audioPatched = true;
    const originalRenderKMap = App.renderKMap;
    if (typeof originalRenderKMap === 'function') {
      App.renderKMap = function patchedRenderKMap() {
        originalRenderKMap.call(this);
        try { renderNextCard(); } catch (e) {}
      };
    }
    const originalRenderPSettings = App.renderPSettings;
    if (typeof originalRenderPSettings === 'function') {
      App.renderPSettings = function patchedRenderPSettings() {
        originalRenderPSettings.call(this);
        try { appendAudioSettings(); } catch (e) {}
      };
    }
  }

  patchApp();
  document.addEventListener('DOMContentLoaded', patchApp);
})();
