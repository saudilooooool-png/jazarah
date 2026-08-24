/* ═══════════════════════════════════════════════════
   جَزَرة — سجل عبارات جزّور الصوتية (المصدر الوحيد للحقيقة)
   كل صوت ينطق به جزّور في التطبيق مسجَّل هنا. لا يوجد نص منطوق
   خارج هذا الملف — وهذا ما يضمن أن الهوية الصوتية واحدة في كل شاشة.

   ثلاثة أنواع:
   1) ثابت      static   — عبارة كاملة، ملف واحد
   2) معدود     set      — متغيّر من قائمة محصورة (٨ عوالم، ٣٨ سورة…)
                           يُنتج ملفًا لكل قيمة، فيبقى صوت جزّور
   3) مركّب     composed — عبارة ثابتة + قيمة معدودة، تُشغَّل بالتتابع
   4) حر        free     — اسم الطفل أو مهمة كتبها الوالد؛ لا يمكن حصره
                           فيستخدم نطق الجهاز أو مزوّد جزّور الحي

   لإنتاج قائمة كل ما يحتاج تسجيلًا:  node tools/voice-manifest.js
   ═══════════════════════════════════════════════════ */
'use strict';

const VoiceLines = {

  /* ─────── 1) العبارات الثابتة ─────── */
  STATIC: {
    // الاحتفال والإنجاز
    cheer: 'يا سلام! إنجاز جميل يا بطل.',
    done: 'أحسنت! أتممت مهمتك.',
    allday: 'أنهيت كل مهام اليوم! أنت بطل حقيقي.',
    levelup: 'ترقّيت لمستوى جديد! جزّور فخور بك.',
    stage: 'قطعت مرحلة جديدة في الرحلة! نكمل غدًا.',
    world: 'عالم جديد فُتح لك! هيا نستكشفه.',
    boss: 'هزمت وحش الكسل! أنت الأقوى.',
    // التحية والدخول والوداع
    hello: 'أهلًا بك يا بطل! جزّور ينتظرك.',
    chest: 'كنز اليوم وصل! افتحه بسرعة.',
    wakeup: 'أنا نعسان… أيقظني بإنجاز!',
    bye: 'وداعًا يا بطل، نم جيدًا وعُد غدًا.',
    // التشجيع أثناء العمل
    next: 'مهمتك التالية بانتظارك.',
    keepgoing: 'أنت رائع! واصل، بقي القليل.',
    almost: 'اقتربت من الهدف! لا تتوقف الآن.',
    tryagain: 'لا بأس، جرّب مرة أخرى. أنا معك.',
    wrong: 'ليست هذه… فكّر مرة ثانية.',
    right: 'إجابة صحيحة! ممتاز.',
    // رسائل الوالد
    heart: 'والدك شاف إنجازك وأعجبه!',
    sent: 'أرسلنا إنجازك لوالدك.',
    approved: 'والدك اعتمد إنجازك! مبروك.',
    // القرآن
    quran_start: 'بسم الله… نبدأ وردنا من القرآن.',
    quran_done: 'أتممت وردك اليوم. نور على نور.',
    surah_done: 'ما شاء الله! ختمت السورة.',
    // الألعاب والمتجر
    game_start: 'هيا نلعب! ركّز معي.',
    shop: 'سوق الجزرات! وش بتختار اليوم؟',
    buy: 'مبروك! استبدلت جزراتك بجائزة.',
    notenough: 'جزراتك ما تكفي بعد… أنجز أكثر وارجع.',
    // وقت الشاشة
    screen_start: 'بدأ وقت لعبك. استمتع!',
    screen_end: 'انتهى وقت اللعب! سلّم الجهاز يا بطل.',
    // لمس جزّور وسحبه
    poke1: 'أنت رائع! كمّل.',
    poke2: 'أحبك يا بطل!',
    poke3: 'هيا نكمل المغامرة!',
    poke4: 'وش خططنا اليوم؟',
    poke5: 'أنا فخور فيك!',
    drag1: 'هيييه! رحلة ممتعة!',
    drag2: 'مرة ثانية! مرة ثانية!',
    drag3: 'أنا أطير يا بطل!',
    // الحكاية والمناسبات
    story_new: 'فصل جديد من حكايتي! تعال اسمع.',
    story_wait: 'بقية الحكاية غدًا… لا تنسَ ترجع.',
    birthday: 'عيد ميلاد سعيد! كل عام وأنت بخير.',
    mypick: 'اختيار موفق! أنت القائد اليوم.',

    // ── عبارات كانت تُنطق بصوت الجهاز، وأُلحقت بالهوية ──
    focus_end: 'انتهى وقت التركيز. أحسنت، انتقل للخطوة التالية بهدوء.',
    world_enter: 'مبروك! وصلت إلى عالم جديد.',
    proud: 'أحسنت يا بطل! جزّور فخور بك.',
    task_next: 'مهمتك التالية:',
    reward_line: 'تكسب نقاط خبرة وجزرات.',
  },

  /* ─────── 2) المجموعات المعدودة ─────── */
  /* قيمها محصورة، فتُسجَّل مرة واحدة ويبقى صوت جزّور في كل نطق */
  SETS: {
    // أسماء العوالم الثمانية (تُملأ من WORLDS وقت التشغيل)
    world: { prefix: 'w', items: [] },
    // سور رحلة البراعم (تُملأ من KIDS_QURAN_ORDER)
    surah: { prefix: 'sura', items: [] },
  },

  /* ─────── 3) العبارات المركّبة ─────── */
  /* تُشغَّل مقاطعها بالتتابع فتبدو جملة واحدة بصوت جزّور */
  COMPOSED: {
    surah_done: ['surah_done', 'sura:{n}'],   // «ختمت السورة» + «الفاتحة»
    world_enter: ['world_enter', 'w:{i}'],    // «وصلت إلى عالم جديد» + «وادي الجزر»
  },

  /* ─────── الحصر ─────── */
  init() {
    if (typeof WORLDS !== 'undefined') {
      this.SETS.world.items = WORLDS.map((w, i) => ({ key: String(i), text: w.name }));
    }
    if (typeof App !== 'undefined' && App.KIDS_QURAN_ORDER && window.QURAN_DATA) {
      this.SETS.surah.items = App.KIDS_QURAN_ORDER.map(n => ({
        key: String(n), text: 'سورة ' + window.QURAN_DATA[n - 1].n,
      }));
    }
    return this;
  },

  /* كل معرّف يحتاج ملفًا صوتيًا، مع نصه — يستخدمه المولّد والفحص */
  manifest() {
    const out = [];
    for (const [id, text] of Object.entries(this.STATIC)) {
      out.push({ id, text, kind: 'static' });
    }
    for (const [name, set] of Object.entries(this.SETS)) {
      set.items.forEach(it => out.push({
        id: `${set.prefix}_${it.key}`, text: it.text, kind: 'set', set: name,
      }));
    }
    return out;
  },

  path(id) { return `audio/prompts/ar/${id}.mp3`; },

  /* ─────── التشغيل ─────── */
  /* يشغّل مقاطع متتابعة كأنها جملة واحدة */
  async playSeq(ids, fallbackText) {
    for (const id of ids) {
      const ok = await JazarahAudio.playClip(id);
      if (!ok) {  // مقطع ناقص ⇒ ننطق الجملة كاملة بدل نصف جملة
        return JazarahAudio.speak(fallbackText, JazarahAudio.IDENTITY.locale, { style: 'friendly' });
      }
      await this._untilEnded(id);
    }
    return true;
  },

  _untilEnded(id) {
    const a = JazarahAudio.clipCache.get(id);
    if (!a || a.ended) return Promise.resolve();
    return new Promise(res => {
      const done = () => { a.removeEventListener('ended', done); res(); };
      a.addEventListener('ended', done);
      setTimeout(done, 4000);   // حارس: لا ننتظر للأبد
    });
  },

  /* الواجهة الوحيدة للنطق في التطبيق كله.
     say('done')                     → عبارة ثابتة
     say('surah_done', { n: 1 })     → مركّبة: ثابت + اسم السورة
     say('w', { i: 3 })              → قيمة من مجموعة
     say(null, {}, 'نص حر')          → حر: نطق الجهاز/المزوّد */
  say(id, vars = {}, freeText = '') {
    if (!id) return JazarahAudio.speak(freeText, JazarahAudio.IDENTITY.locale, { style: 'friendly' });

    const comp = this.COMPOSED[id];
    if (comp) {
      const ids = comp.map(part => part.replace(/^(\w+):\{(\w+)\}$/, (_, p, v) => `${p}_${vars[v]}`));
      return this.playSeq(ids, this.textOf(id, vars));
    }
    if (this.STATIC[id]) return sayLine(id, this.STATIC[id]);

    // معرّف من مجموعة (w_3 / sura_1)
    const found = this.manifest().find(m => m.id === id);
    if (found) return sayLine(id, found.text);

    return JazarahAudio.speak(freeText || id, JazarahAudio.IDENTITY.locale, { style: 'friendly' });
  },

  /* النص الكامل لعبارة (للاحتياط وللاختبار) */
  textOf(id, vars = {}) {
    const comp = this.COMPOSED[id];
    if (comp) {
      return comp.map(part => {
        const m = part.match(/^(\w+):\{(\w+)\}$/);
        if (!m) return this.STATIC[part] || '';
        const set = Object.values(this.SETS).find(s => s.prefix === m[1]);
        const it = set && set.items.find(x => x.key === String(vars[m[2]]));
        return it ? it.text : '';
      }).filter(Boolean).join(' ');
    }
    if (this.STATIC[id]) return this.STATIC[id];
    const found = this.manifest().find(m => m.id === id);
    return found ? found.text : '';
  },

  /* تقرير التغطية — كم عبارة مسجّلة وكم ناقصة */
  async coverage() {
    const all = this.manifest();
    const res = await Promise.all(all.map(async m => {
      // fetch لا يعمل على بروتوكول file: — نتحقق عندها بتحميل عنصر صوت
      if (location.protocol === 'file:') {
        return new Promise(res => {
          const a = new Audio(this.path(m.id));
          a.addEventListener('loadedmetadata', () => res({ ...m, have: true }), { once: true });
          a.addEventListener('error', () => res({ ...m, have: false }), { once: true });
          setTimeout(() => res({ ...m, have: false }), 3000);
        });
      }
      try {
        const r = await fetch(this.path(m.id), { method: 'HEAD' });
        return { ...m, have: r.ok };
      } catch (e) { return { ...m, have: false }; }
    }));
    const missing = res.filter(x => !x.have);
    return { total: all.length, have: all.length - missing.length, missing };
  },
};

window.VoiceLines = VoiceLines;
