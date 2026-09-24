/* ═══════════════════════════════════════════════════
   مزرعة جزّور ٢ — الصناديق والحاضنة ولوحة المهام
   القاعدة: كل مهمة تنجزها تعطيك صندوقًا، وكل صندوق تفتحه يكبّر
   كل شيء في مزرعتك خطوة. (التصميم: docs/farm-v2-incubator.md)

   الحالة تُحفظ داخل بيانات الطفل (child.farm) فتتزامن مع كل شيء آخر.
   ═══════════════════════════════════════════════════ */
'use strict';

const JazarahFarm = {

  /* المهمة ← المورد المضمون في صندوقها (قرار مثبَّت) */
  RES_BY_CAT: { study: 'wood', sport: 'stone', health: 'water', faith: 'light', kindness: 'seed' },
  BOX_BY_CAT: { study: 'brown', sport: 'grey', health: 'blue', faith: 'gold', kindness: 'green' },

  RES: {
    wood:  { name: 'خشب', img: 'farm/resources/wood.webp' },
    stone: { name: 'حجر', img: 'farm/resources/stone.webp' },
    water: { name: 'ماء', img: 'farm/resources/water.webp' },
    light: { name: 'نور', img: 'farm/resources/light.webp' },
    seed:  { name: 'بذور', img: 'farm/resources/seed.webp' },
  },

  CROP: {
    seed:    'farm/crops/carrot_seedling.webp',
    growing: 'farm/crops/carrot_growing.webp',
    ready:   'farm/crops/carrot_ready.webp',
  },
  GOLD_READY: 'farm/crops/carrot_golden_ready.webp',

  /* المحاصيل: الجزر من كل صندوق، والثلاثة الأخرى مفاجأة «مميز». البذرة الأولى مشتركة. */
  CROPS: {
    carrot:     { name: 'جزر',   one: 'جزرة',      emoji: '🥕', coins: 1, growing: 'farm/crops/carrot_growing.webp',     ready: 'farm/crops/carrot_ready.webp' },
    strawberry: { name: 'فراولة', one: 'فراولة',   emoji: '🍓', coins: 2, growing: 'farm/crops/strawberry_growing.webp', ready: 'farm/crops/strawberry_ready.webp' },
    pumpkin:    { name: 'يقطين', one: 'يقطينة',    emoji: '🎃', coins: 3, growing: 'farm/crops/pumpkin_growing.webp',    ready: 'farm/crops/pumpkin_ready.webp' },
    grape:      { name: 'عنب',   one: 'عنقود عنب', emoji: '🍇', coins: 2, growing: 'farm/crops/grape_growing.webp',      ready: 'farm/crops/grape_ready.webp' },
  },
  SPECIAL: ['strawberry', 'pumpkin', 'grape'],

  /* الرفاق الخمسة: لون كل رفيق = لون الصندوق الذي جاء فيه = نوع المهمة */
  KIN: {
    brown: { name: 'رفيق الخشب', egg: 'farm/companions/egg_brown.webp', baby: 'farm/companions/baby_brown.webp', grown: 'farm/companions/grown_brown.webp' },
    grey:  { name: 'رفيق الحجر', egg: 'farm/companions/egg_grey.webp',  baby: 'farm/companions/baby_grey.webp',  grown: 'farm/companions/grown_grey.webp' },
    blue:  { name: 'رفيق الماء', egg: 'farm/companions/egg_blue.webp',  baby: 'farm/companions/baby_blue.webp',  grown: 'farm/companions/grown_blue.webp' },
    gold:  { name: 'رفيق النور', egg: 'farm/companions/egg_gold.webp',  baby: 'farm/companions/baby_gold.webp',  grown: 'farm/companions/grown_gold.webp' },
    green: { name: 'رفيق الزرع', egg: 'farm/companions/egg_green.webp', baby: 'farm/companions/baby_green.webp', grown: 'farm/companions/grown_green.webp' },
  },

  /* الحاضنة تنمو بأيام مكتملة لا بعدد مطلق — فتتساوى الأسر مهما كان حجم خطتها */
  HATCH_DAYS: 1,        // بيضة ← صغير: يوم كامل من المهام
  GROW_DAYS: 4,         // صغير ← بالغ: أربعة أيام كاملة

  /* احتمالات مفاجأة الصندوق: الإثبات الحقيقي يُكافأ أكثر */
  ODDS: {
    self:     { common: 0.70, uncommon: 0.24, rare: 0.06 },
    verified: { common: 0.55, uncommon: 0.30, rare: 0.15 },
  },
  PITY: 5,              // كل خامس صندوق مضمون «مميز» أو أعلى
  SHINY_CHANCE: 0.30,   // فرصة لمعان المحصول الناضج تحت المطر

  /* حقل واحد من ٤×٤ خلايا. يبقى ترتيب المصفوفة نفسه لتحفظ الملفات حالة كل جزرة. */
  CELLS: Array.from({ length: 16 }, (_, i) => {
    const row = Math.floor(i / 4), col = i % 4, depth = row + col;
    return { row, col, x: 420 + (col - row) * 42, y: 407 + depth * 18, s: 40 + depth * 2 };
  }),

  /* المرج على يمين العالم: اللوحة مكان اللافتة المرسومة، والحاضنة في وسطه */
  BOARD: { x: 748, y: 556, w: 150 },
  INCUB: { x: 884, y: 486, w: 196 },
  SLOTS: [
    { x: 708, y: 386 }, { x: 1018, y: 420 }, { x: 1014, y: 528 }, { x: 900, y: 578 },
  ],
  HOMES: [ { x: 1012, y: 606 }, { x: 724, y: 372 }, { x: 560, y: 616 }, { x: 1076, y: 334 }, { x: 420, y: 616 } ],

  CATALOG: [
    { id: 'well', name: 'بئر ماء',   img: 'farm/buildings/well.webp',  w: 118, pad: true, cost: { stone: 6, wood: 2 } },
    { id: 'barn', name: 'حظيرة',     img: 'farm/buildings/barn.webp',  w: 152, pad: true, cost: { wood: 8, stone: 3 } },
    { id: 'field',name: 'حقل إضافي', img: 'farm/buildings/field.webp', w: 172, cost: { seed: 4, water: 3 } },
    // «عش الرفيق» صار الحاضنة؛ يبقى هنا فقط ليُرسم لمن بناه سابقًا
    { id: 'egg',  name: 'عش الرفيق', img: 'farm/companions/egg_brown.webp', w: 86, cost: { light: 4, seed: 5 }, legacy: true },
  ],

  _rand: Math.random,

  /* ─────── الحالة ─────── */
  blank() {
    return {
      v: 2,
      res: { wood: 0, stone: 0, water: 0, light: 0, seed: 0 },
      goldSeed: 0,
      special: { strawberry: 0, pumpkin: 0, grape: 0 },
      album: { kin: {}, crops: {} },
      crops: this.CELLS.map(() => ({ stage: 'empty' })),
      built: {},
      boxes: [],            // صناديق لم تُفتح بعد (بعضها مقفل بانتظار الوالد)
      opened: 0,
      sinceSpecial: 0,
      incubator: null,      // { kind, stage: 'egg'|'baby', days }
      residents: [],        // رفاق كبروا ويعيشون في المزرعة
      rain: null,
      seenIntro: false,
    };
  },

  /* ترحيل لا يمس أي شيء موجود: يضيف الحقول الجديدة فقط */
  of(child) {
    if (!child.farm || !Array.isArray(child.farm.crops) || child.farm.crops.length !== this.CELLS.length) {
      child.farm = this.blank();
    }
    const f = child.farm;
    if (!f.res) f.res = { wood: 0, stone: 0, water: 0, light: 0, seed: 0 };
    if (!f.built) f.built = {};
    if (!Array.isArray(f.boxes)) f.boxes = [];
    if (!Array.isArray(f.residents)) f.residents = [];
    if (!Number.isFinite(f.goldSeed)) f.goldSeed = 0;
    if (!f.special || typeof f.special !== 'object') f.special = { strawberry: 0, pumpkin: 0, grape: 0 };
    if (!f.album || typeof f.album !== 'object') {
      // دفتر لمن سبق: ما يعيش في المزرعة وما في الحاضنة مكتشف أصلًا
      f.album = { kin: {}, crops: {} };
      (f.residents || []).forEach(r => this._seeKin(f, r.kind, 'grown'));
      if (f.incubator) this._seeKin(f, f.incubator.kind, f.incubator.stage);
    }
    if (!Number.isFinite(f.opened)) f.opened = 0;
    if (!Number.isFinite(f.sinceSpecial)) f.sinceSpecial = 0;
    if (f.incubator === undefined) f.incubator = null;
    if (!f.v) {
      // رفيق فقس في النظام السابق ينتقل إلى الحاضنة صغيرًا — لا يضيع
      if (f.companion && f.companion.stage === 'baby') f.incubator = { kind: 'brown', stage: 'baby', days: 0 };
      f.v = 2;
    }
    return f;
  },

  daily(f) {
    if (!f.daily || typeof f.daily !== 'object') f.daily = { lastVisitDate: null, lastVisitAt: null, events: [] };
    if (!Array.isArray(f.daily.events)) f.daily.events = [];
    return f.daily;
  },

  note(f, emoji, text) {
    const daily = this.daily(f);
    const last = daily.events[0];
    if (last && last.text === text && last.date === todayKey()) return;
    daily.events.unshift({ id: uid(), emoji, text, date: todayKey(), at: Date.now() });
    if (daily.events.length > 12) daily.events = daily.events.slice(0, 12);
  },

  /* حجم «اليوم الكامل» لهذا الطفل: عدد مهامه المجدولة اليوم */
  planSize(child) {
    try {
      if (typeof scheduledTasksForChild === 'function') {
        const gentle = typeof gentlePlanForDate === 'function' && gentlePlanForDate(child, todayKey());
        const n = gentle ? 0 : scheduledTasksForChild(child, todayKey()).length;
        if (n > 0) return n;
      }
    } catch (e) { /* خارج التطبيق (الاختبارات) */ }
    return Math.max(1, (child.tasks || []).length || 1);
  },

  /* ─────── الصناديق ─────── */

  /* يحدد محتوى الصندوق لحظة فتح قفله: مورد مضمون + مفاجأة، وبيضة إن فرغت الحاضنة */
  _roll(f, box) {
    const odds = this.ODDS[box.verified ? 'verified' : 'self'];
    let tier;
    const r = this._rand();
    tier = r < odds.rare ? 'rare' : r < odds.rare + odds.uncommon ? 'uncommon' : 'common';
    if (tier === 'common' && f.sinceSpecial >= this.PITY - 1) {
      tier = this._rand() < odds.rare / (odds.rare + odds.uncommon) ? 'rare' : 'uncommon';
    }
    f.sinceSpecial = tier === 'common' ? f.sinceSpecial + 1 : 0;
    const surprise = tier === 'rare' ? 'gold' : tier === 'uncommon' ? 'special' : 'seed1';
    const crop = tier === 'uncommon' ? this.SPECIAL[Math.floor(this._rand() * this.SPECIAL.length) % this.SPECIAL.length] : null;
    const eggComing = f.incubator || f.boxes.some(b => b.contents && b.contents.egg);
    box.contents = {
      res: this.RES_BY_CAT[box.cat] || 'seed',
      tier, surprise, crop,
      egg: !eggComing,
      eggKin: this.KIN[box.color] ? box.color : 'brown',
    };
    return box;
  },

  _findBox(f, taskId, date) {
    return f.boxes.find(b => b.taskId === taskId && b.date === date);
  },

  /* مهمة أُرسلت لموافقة الوالد: صندوق مقفل يظهر فورًا حتى يرى الطفل أن تعبه وصل */
  addLockedBox(child, task, date, proof) {
    const f = this.of(child);
    if (this._findBox(f, task.id, date)) return this._findBox(f, task.id, date);
    const box = { id: uid(), cat: task.cat, color: this.BOX_BY_CAT[task.cat] || 'brown', source: 'task',
                  taskId: task.id, title: task.title, date, locked: true, verified: true, proof, contents: null, at: Date.now() };
    f.boxes.push(box);
    return box;
  },

  /* مهمة احتُسبت (فورًا أو بعد الموافقة): يُفتح القفل إن وُجد، أو يصل صندوق جديد */
  taskDone(child, task, date, verified) {
    const f = this.of(child);
    let box = this._findBox(f, task.id, date);
    if (box && box.contents) return box;           // احتُسب من قبل
    if (!box) {
      box = { id: uid(), cat: task.cat, color: this.BOX_BY_CAT[task.cat] || 'brown', source: 'task',
              taskId: task.id, title: task.title, date, locked: false, verified: !!verified, contents: null, at: Date.now() };
      f.boxes.push(box);
    }
    box.locked = false;
    box.unlockedAt = Date.now();
    this._roll(f, box);
    return box;
  },

  /* ورد القرآن: صندوق ذهبي فيه نور — يصحّح الوعد القديم الذي كان على الشاشة */
  quranBox(child, date) {
    const f = this.of(child);
    const id = 'quran:' + date;
    let box = f.boxes.find(b => b.taskId === id);
    if (box) return box;
    box = { id: uid(), cat: 'faith', color: 'gold', source: 'quran', taskId: id, title: 'ورد القرآن', date,
            locked: false, verified: true, contents: null, at: Date.now() };
    f.boxes.push(box);
    this._roll(f, box);
    return box;
  },

  /* رفض الوالد إثباتًا: يختفي صندوقه المقفل، وتعود المهمة كما كانت */
  dropLockedBox(child, taskId, date) {
    const f = this.of(child);
    f.boxes = f.boxes.filter(b => !(b.taskId === taskId && b.date === date && b.locked));
  },

  /* اكتمل يوم الطفل: مطر في مزرعته */
  queueRain(child, date) {
    const f = this.of(child);
    if (f.rain && f.rain.date === date) return;
    f.rain = { date, shown: false };
  },

  openable(child) { return this.of(child).boxes.filter(b => !b.locked && b.contents); },
  lockedBoxes(child) { return this.of(child).boxes.filter(b => b.locked); },

  /* فتح صندوق: يُضاف محتواه، ثم يكبر كل شيء في المزرعة خطوة */
  claim(child, boxId) {
    const f = this.of(child);
    const box = f.boxes.find(b => b.id === boxId && !b.locked && b.contents);
    if (!box) return null;
    f.boxes = f.boxes.filter(b => b !== box);
    const k = box.contents;
    const out = { box, gains: [], events: [] };

    f.res[k.res] = (f.res[k.res] || 0) + 1;
    out.gains.push({ kind: 'res', key: k.res, n: 1 });
    if (k.surprise === 'gold') { f.goldSeed += 1; out.gains.push({ kind: 'gold', n: 1 }); }
    else if (k.surprise === 'special' && k.crop) { f.special[k.crop] = (f.special[k.crop] || 0) + 1; out.gains.push({ kind: 'special', crop: k.crop }); }
    else { const n = k.surprise === 'seed2' ? 2 : 1; f.res.seed = (f.res.seed || 0) + n; out.gains.push({ kind: 'seed', n }); }
    if (k.egg && !f.incubator) {
      const kin = this.KIN[k.eggKin] ? k.eggKin : 'brown';
      f.incubator = { kind: kin, stage: 'egg', days: 0, at: Date.now() };
      this._seeKin(f, kin, 'egg');
      out.gains.push({ kind: 'egg', kin });
      this.note(f, '🥚', 'وصلت بيضة إلى حاضنتك');
    }

    // خطوة نمو: جزء من «يوم كامل» بحسب حجم خطة الطفل
    const step = 1 / this.planSize(child);
    let grewCrops = 0;
    f.crops.forEach(c => {
      if (c.stage === 'seed') { c.stage = 'growing'; grewCrops++; }
      else if (c.stage === 'growing') { c.stage = 'ready'; grewCrops++; }
    });
    if (grewCrops) out.events.push({ kind: 'crops', n: grewCrops });
    const inc = f.incubator;
    if (inc) {   // البيضة الواصلة في هذا الصندوق نفسه تحتسب خطوته أيضًا
      inc.days += step;
      if (inc.stage === 'egg' && inc.days >= this.HATCH_DAYS - 1e-3) {
        inc.stage = 'baby'; inc.days = 0; inc.hatchedAt = Date.now();
        this._seeKin(f, inc.kind, 'baby');
        out.events.push({ kind: 'hatch', kin: inc.kind });
        this.note(f, '🐣', 'فقست البيضة في الحاضنة!');
        if (typeof feedPush === 'function') feedPush(child, '🐣', 'فقست بيضة في مزرعته');
      } else if (inc.stage === 'baby' && inc.days >= this.GROW_DAYS - 1e-3) {
        f.residents.push({ kind: inc.kind, at: Date.now() });
        this._seeKin(f, inc.kind, 'grown');
        f.incubator = null;
        out.events.push({ kind: 'grown', kin: inc.kind });
        this.note(f, '🐉', 'كبر رفيقك وخرج يعيش في مزرعتك');
        if (typeof feedPush === 'function') feedPush(child, '🐉', 'كبر رفيقه وصار يعيش في مزرعته');
      }
    }
    f.opened += 1;
    return out;
  },

  /* ─────── دفتر المزرعة ─────── */
  _seeKin(f, kin, stage) {
    if (!f.album) f.album = { kin: {}, crops: {} };
    const e = f.album.kin[kin] || (f.album.kin[kin] = {});
    const order = ['egg', 'baby', 'grown'];
    order.slice(0, order.indexOf(stage) + 1).forEach(st => { e[st] = true; });   // من كبر فقد مرّ بما قبلها
  },
  _seeCrop(f, crop, flags = {}) {
    if (!f.album) f.album = { kin: {}, crops: {} };
    const e = f.album.crops[crop] || (f.album.crops[crop] = { n: 0 });
    e.n += 1;
    if (flags.gold) e.gold = true;
    if (flags.shiny) e.shiny = true;
  },
  /* كل خانة في الدفتر: ٥ رفاق × ٣ مراحل + ٤ محاصيل + الذهبية + ٤ لامعة */
  albumCount(child) {
    const f = this.of(child), a = f.album;
    let got = 0, total = 0;
    Object.keys(this.KIN).forEach(k => ['egg', 'baby', 'grown'].forEach(st => { total++; if (a.kin[k] && a.kin[k][st]) got++; }));
    Object.keys(this.CROPS).forEach(c => { total += 2; if (a.crops[c]) got++; if (a.crops[c] && a.crops[c].shiny) got++; });
    total += 1; if (a.crops.carrot && a.crops.carrot.gold) got++;
    return { got, total };
  },

  /* تقدم الحاضنة بالمهام: كم مهمة باقية للمرحلة التالية */
  incubatorLeft(child) {
    const f = this.of(child), inc = f.incubator;
    if (!inc) return null;
    const goal = inc.stage === 'egg' ? this.HATCH_DAYS : this.GROW_DAYS;
    const n = this.planSize(child);
    return { stage: inc.stage, pct: Math.min(1, inc.days / goal), tasks: Math.max(1, Math.ceil((goal - inc.days) * n - 1e-3)) };
  },

  /* ١ مهمة واحدة · ٢ مهمتان · ٣–١٠ مهام · ١١+ مهمة */
  tasksWord(n) {
    const ar = x => String(x).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    return n === 1 ? 'مهمة واحدة' : n === 2 ? 'مهمتان' : n <= 10 ? `${ar(n)} مهام` : `${ar(n)} مهمة`;
  },

  /* ─────── ما يستحق نقطة التنبيه على التبويب ─────── */
  hasDailyMoment(child) {
    const f = this.of(child);
    return this.openable(child).length > 0 || f.crops.some(c => c.stage === 'ready') ||
      !!(f.rain && !f.rain.shown && f.rain.date === todayKey());
  },

  ready(child) {
    return this.of(child).crops.filter(c => c.stage === 'ready').length;
  },

  can(f, cost) { return Object.entries(cost).every(([k, n]) => (f.res[k] || 0) >= n); },
  spend(f, cost) { Object.entries(cost).forEach(([k, n]) => { f.res[k] -= n; }); },

  /* مهام اليوم كما يراها الطفل في صفحة «اليوم» — مصدر واحد */
  boardTasks(child) {
    const today = todayKey();
    let list = [];
    try {
      const gentle = typeof gentlePlanForDate === 'function' && gentlePlanForDate(child, today);
      list = gentle ? [] : scheduledTasksForChild(child, today);
    } catch (e) { list = []; }
    const done = new Set(child.completions[today] || []);
    const pending = new Set((child.pendingProofs || []).filter(p => p.date === today).map(p => p.taskId));
    return list.map(t => ({ t, state: done.has(t.id) ? 'done' : pending.has(t.id) ? 'pending' : 'ready' }));
  },

  /* ─────── الرسم ─────── */
  render() {
    const el = document.getElementById('ktab-farm');
    if (!el) return;
    const child = C();
    const f = this.of(child);
    const daily = this.daily(f);
    const firstVisitToday = daily.lastVisitDate !== todayKey();
    if (firstVisitToday) { daily.lastVisitDate = todayKey(); daily.lastVisitAt = Date.now(); }

    // المطر يُرى مرة واحدة: كل محصول ناضج له فرصة أن يلمع
    let raining = false, shinyNow = 0;
    const revealing = document.getElementById('box-reveal')?.classList.contains('on');
    // المطر ينتظر حتى تُفتح الصناديق: يُرى على مزرعة حاضرة لا خلف نافذة الكشف
    if (f.rain && !f.rain.shown && f.rain.date === todayKey() && !revealing && !this.openable(child).length) {
      raining = true; f.rain.shown = true;
      f.crops.forEach(c => { if (c.stage === 'ready' && !c.shiny && this._rand() < this.SHINY_CHANCE) { c.shiny = true; shinyNow++; } });
      this.note(f, '🌧️', shinyNow ? `أمطرت مزرعتك ولمعت ${shinyNow === 1 ? 'جزرة' : shinyNow + ' جزرات'}` : 'أمطرت مزرعتك بعد يومك المكتمل');
    }

    const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    const count = (n, one, two, few, many) =>
      n === 1 ? one : n === 2 ? two : (n >= 3 && n <= 10) ? `${ar(n)} ${few}` : `${ar(n)} ${many}`;

    const bar = Object.entries(this.RES)
      .map(([k, r]) => `<span class="fres" data-res="${k}"><img src="${r.img}" alt="${r.name}"><b>${ar(f.res[k] || 0)}</b></span>`)
      .join('') + (f.goldSeed ? `<span class="fres fres--gold" title="بذور ذهبية"><i>✨</i><b>${ar(f.goldSeed)}</b></span>` : '')
      + this.SPECIAL.filter(c => f.special[c] > 0).map(c => `<span class="fres fres--special" title="بذور ${this.CROPS[c].name}"><i>${this.CROPS[c].emoji}</i><b>${ar(f.special[c])}</b></span>`).join('');

    let layer = `<img class="fworld-base" src="farm/land/world_farm_single_plot.webp" alt="مزرعة جزّور">
      <span class="fshadow" style="width:124px;height:24px;left:531px;top:283px"></span>
      <img class="fbuild" src="farm/buildings/home_exact.webp" style="left:498px;top:110px;width:192px;z-index:283" alt="بيت جزّور">
      <span class="fshadow" style="width:112px;height:22px;left:233px;top:321px"></span>
      <img class="fbuild" src="farm/buildings/barn_exact.webp" style="left:197px;top:193px;width:184px;z-index:321" alt="حظيرة">`;

    for (let row = 0; row < 4; row++) {
      const start = this.CELLS[row * 4], end = this.CELLS[row * 4 + 3];
      const x = (start.x + end.x) / 2, y = (start.y + end.y) / 2;
      layer += `<span class="ffield-row" aria-hidden="true" style="left:${x - 87}px;top:${y}px;z-index:${Math.round(y) + 348}"></span>`;
    }

    this.CELLS.forEach((c, i) => {
      const crop = f.crops[i], z = Math.round(c.y) + 360;
      const pos = `left:${c.x - c.s / 2}px;top:${c.y - c.s * 0.85}px;width:${c.s}px;z-index:${z}`;
      if (crop.stage === 'empty') {
        layer += `<button class="fcrop fempty" data-crop="${i}" style="${pos}" aria-label="حفرة فارغة — ازرع جزرة"><span class="fcrop-add" aria-hidden="true">＋</span></button>`;
      } else {
        const info = this.CROPS[crop.kind] || this.CROPS.carrot;
        const src = crop.stage === 'seed' ? this.CROP.seed
          : crop.gold && crop.stage === 'ready' ? this.GOLD_READY : info[crop.stage];
        const cls = `fcrop f-${crop.stage}${crop.gold ? ' f-gold' : ''}${crop.shiny ? ' f-shiny' : ''}${crop.kind && crop.kind !== 'carrot' ? ' f-special' : ''}`;
        layer += `<button class="${cls}" data-crop="${i}" style="${pos}" aria-label="${crop.gold ? 'جزرة ذهبية' : info.one}"><img src="${src}" alt=""></button>`;
      }
    });

    const canBuild = this.CATALOG.some(it => !it.legacy && this.can(f, it.cost));
    this.SLOTS.forEach((sl, i) => {
      const id = f.built[i];
      const z = Math.round(sl.y);
      if (!id) {
        layer += `<button class="fslot${canBuild ? '' : ' fslot--quiet'}" data-slot="${i}" style="left:${sl.x - 58}px;top:${sl.y - 36}px;z-index:${z}" aria-label="ابنِ هنا"><span class="fring"></span><span class="fplus">＋</span></button>`;
        return;
      }
      const it = this.CATALOG.find(x => x.id === id);
      if (!it) return;
      if (it.pad) layer += `<span class="fpad" style="width:${it.w * 0.66}px;height:${it.w * 0.24}px;left:${sl.x - it.w * 0.33}px;top:${sl.y - it.w * 0.12}px;z-index:${z - 2}"></span>`;
      layer += `<span class="fshadow" style="width:${it.w * 0.6}px;height:${it.w * 0.14}px;left:${sl.x - it.w * 0.3}px;top:${sl.y - it.w * 0.06}px;z-index:${z - 1}"></span>
        <img class="fbuild" src="${it.img}" style="left:${sl.x - it.w / 2}px;top:${sl.y - it.w * 0.9}px;width:${it.w}px;z-index:${z}" alt="${it.name}">`;
    });

    // ── لوحة المهام
    const board = this.boardTasks(child);
    const left = board.filter(b => b.state === 'ready').length;
    const B = this.BOARD;
    layer += `<span class="fshadow" style="width:${B.w * 0.7}px;height:${B.w * 0.12}px;left:${B.x - B.w * 0.35}px;top:${B.y - B.w * 0.06}px;z-index:${B.y - 1}"></span>
      <button class="fboard" data-board type="button" style="left:${B.x - B.w / 2}px;top:${B.y - B.w * 0.9}px;width:${B.w}px;z-index:${B.y}" aria-label="لوحة المهام — ${left ? 'باقي ' + left : 'اكتملت'}">
        <img src="farm/objects/task_board.webp" alt="">
        ${board.length ? `<span class="fboard__badge${left ? '' : ' fboard__badge--done'}">${left ? ar(left) : '✓'}</span>` : ''}
      </button>`;

    // ── الحاضنة
    const I = this.INCUB, inc = f.incubator, prog = this.incubatorLeft(child);
    const kin = inc ? this.KIN[inc.kind] || this.KIN.brown : null;
    const hatchFx = inc && inc.stage === 'baby' && Date.now() < (this._hatchFxUntil || 0);
    layer += `<span class="fshadow" style="width:${I.w * 0.7}px;height:${I.w * 0.14}px;left:${I.x - I.w * 0.35}px;top:${I.y - I.w * 0.07}px;z-index:${I.y - 1}"></span>
      <button class="fincub${inc ? ' fincub--' + inc.stage : ''}" data-incub type="button" style="left:${I.x - I.w / 2}px;top:${I.y - I.w * 0.9}px;width:${I.w}px;z-index:${I.y}" aria-label="الحاضنة">
        <img class="fincub__base" src="farm/objects/incubator.webp" alt="">
        ${inc ? `<img class="fincub__kin${hatchFx ? ' fincub__kin--hatch' : ''}" src="${inc.stage === 'egg' ? kin.egg : kin.baby}" alt="">` : ''}
        ${prog ? `<span class="fincub__ring" style="--p:${Math.round(prog.pct * 100)}"><b>${ar(prog.tasks)}</b></span>` : ''}
      </button>`;

    // ── رفاق كبروا ويعيشون في المزرعة
    f.residents.forEach((r, i) => {
      const h = this.HOMES[i % this.HOMES.length];
      const k = this.KIN[r.kind] || this.KIN.brown;
      layer += `<button class="fresident" data-resident="${i}" type="button" style="left:${h.x - 42}px;top:${h.y - 88}px;z-index:${h.y};animation-delay:${-i * 0.7}s" aria-label="${k.name}"><img src="${k.grown}" alt=""></button>`;
    });

    layer += `<img class="fjz" id="farm-jz" src="${App.jzSrc('hero')}" style="left:566px;top:282px" alt="جزّور">`;

    // ── الصناديق التي تنتظر: صف أسفل اللوحة، يُضغط مباشرة
    const openable = this.openable(child), locked = this.lockedBoxes(child);
    const tray = [...openable, ...locked].slice(0, 4).map(b =>
      `<button class="fbox${b.locked ? ' fbox--locked' : ''}" type="button" onclick="JazarahFarm.${b.locked ? `lockedInfo('${b.id}')` : `openBox('${b.id}')`}" aria-label="${b.locked ? 'صندوق ينتظر موافقة الوالد' : 'افتح الصندوق'}">
        <img src="farm/objects/box_${b.color}.webp" alt="">${b.locked ? '<i>🔒</i>' : ''}</button>`).join('');
    const more = openable.length + locked.length - 4;

    const objective = this.dailyObjective(child, f, { count, board, left, openable, locked, prog });
    this._dailyObjective = objective;
    const latest = daily.events[0];
    const headline = raining
      ? `<section class="farm-daily-pulse farm-daily-pulse--rain" aria-live="polite"><span class="farm-daily-pulse__icon">🌧️</span><div class="farm-daily-pulse__copy"><p>أكملت يومك كله!</p><h3>مطر في مزرعتك</h3><small>${shinyNow ? `لمعت ${shinyNow === 1 ? 'جزرة ناضجة' : ar(shinyNow) + ' جزرات ناضجة'} تحت المطر ✨ — احصدها لتكسب أكثر.` : 'المطر هدية يومك المكتمل. في المرة القادمة قد تلمع جزراتك الناضجة ✨'}</small></div></section>`
      : `<section class="farm-daily-pulse${firstVisitToday ? ' farm-daily-pulse--new' : ''}" aria-label="نبضة مزرعتي اليوم">
      <span class="farm-daily-pulse__icon">${objective.emoji}</span>
      <div class="farm-daily-pulse__copy"><p>${firstVisitToday ? 'أهلًا في مزرعتك اليوم' : 'مزرعتي الآن'}</p><h3>${objective.title}</h3><small>${objective.copy}</small>${latest ? `<span class="farm-daily-pulse__latest">${latest.emoji} ${esc(latest.text)}</span>` : ''}</div>
      ${objective.actionLabel ? `<button class="farm-daily-pulse__action" type="button" onclick="JazarahFarm.focusDailyObjective()">${objective.actionLabel}</button>` : ''}
    </section>`;

    el.innerHTML = `
      <div class="farm-bar">${bar}</div>
      ${headline}
      <div class="farm-view${raining ? ' farm-view--rain' : ''}" id="farm-view">
        <div class="fworld" id="fworld">${layer}</div>
        ${raining ? '<div class="frain" aria-hidden="true"></div>' : ''}
        ${tray ? `<div class="fbox-tray">${tray}${more > 0 ? `<span class="fbox-more">+${ar(more)}</span>` : ''}</div>` : ''}
        <button class="farm-show" onclick="JazarahFarm.show()">وين؟ 👀</button>
        <button class="farm-album-btn" onclick="JazarahFarm.openAlbum()" aria-label="دفتر المزرعة">📖 دفتري <b>${ar(this.albumCount(child).got)}</b></button>
        ${board.length ? `<button class="farm-tasks-btn${left ? '' : ' farm-tasks-btn--done'}" onclick="JazarahFarm.openBoard()" aria-label="مهام اليوم">📋 مهامي <b>${left ? ar(left) : '✓'}</b></button>` : ''}
      </div>
      <div class="farm-sheet" id="farm-sheet" aria-hidden="true">
        <div class="fsheet-handle"></div>
        <h3 id="farm-sheet-title">وش نبني هنا؟</h3>
        <div class="fpicks" id="farm-picks"></div>
        <button class="cancel-button" onclick="JazarahFarm.close()">ليس الآن</button>
      </div>`;

    this._bind();
    this._fit();
    save();
    if (raining) VoiceLines.say('cheer');
  },

  /* نداء واحد فوق الحقل: ما الشيء التالي الذي يستحق يد الطفل الآن */
  dailyObjective(child, f, x) {
    const { count, board, left, openable, locked, prog } = x;
    const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    const boxes = n => count(n, 'صندوق واحد', 'صندوقان', 'صناديق', 'صندوقًا');
    const tasks = n => count(n, 'مهمة واحدة', 'مهمتان', 'مهام', 'مهمة');
    if (openable.length) return { emoji: '🎁', title: `${boxes(openable.length)} ${openable.length === 1 ? 'ينتظرك' : 'تنتظرك'}`, copy: 'افتحه وشوف وش فيه — وكل صندوق تفتحه يكبّر مزرعتك خطوة.', actionLabel: 'افتح', target: { type: 'box' } };
    const readyTotal = f.crops.filter(c => c.stage === 'ready').length;
    const ready = f.crops.findIndex(c => c.stage === 'ready');
    if (ready >= 0) {
      // اسم المحصول الحقيقي: «يقطينة ناضجة» لا «جزرة» حين يكون الناضج يقطينًا
      const kinds = [...new Set(f.crops.filter(c => c.stage === 'ready').map(c => (this.CROPS[c.kind] ? c.kind : 'carrot')))];
      const one = kinds.length === 1 ? this.CROPS[kinds[0]] : null;
      const title = one && one === this.CROPS.carrot ? `${count(readyTotal, 'جزرة واحدة', 'جزرتان', 'جزرات', 'جزرة')} ناضجة`
        : one && readyTotal === 1 ? `${one.one} ناضجة ${one.emoji}`
        : `${count(readyTotal, 'محصول واحد', 'محصولان', 'محاصيل', 'محصولًا')} ${readyTotal > 2 && readyTotal <= 10 ? 'ناضجة' : 'ناضج'}`;
      return { emoji: one ? one.emoji : '🧺', title, copy: 'اضغط الناضج — جزّور يحصده لك.', actionLabel: 'أرِنيها', target: { type: 'crop', index: ready } };
    }
    const empty = f.crops.findIndex(c => c.stage === 'empty');
    const seeds = (f.res.seed || 0) + (f.goldSeed || 0) + this.SPECIAL.reduce((n, c) => n + (f.special[c] || 0), 0);
    if (empty >= 0 && seeds > 0) return { emoji: f.goldSeed ? '✨' : '🌱', title: f.goldSeed ? 'عندك بذرة ذهبية!' : `عندك ${count(seeds, 'بذرة واحدة', 'بذرتان', 'بذور', 'بذرة')} للزرع`, copy: 'اضغط ＋ في أي حفرة تراب لتزرع — وتكبر مع كل صندوق تفتحه.', actionLabel: 'أرِنيها', target: { type: 'crop', index: empty } };
    if (!f.incubator && !f.residents.length) return { emoji: '🥚', title: 'أول صندوق فيه بيضة لحاضنتك', copy: 'أنجز مهمة من لوحة المهام، وافتح صندوقك هنا.', actionLabel: left ? 'لوحة المهام' : '', target: { type: 'board' } };
    if (prog && left) return { emoji: prog.stage === 'egg' ? '🥚' : '🐣', title: prog.stage === 'egg' ? `باقي ${tasks(prog.tasks)} وتفقس البيضة` : `باقي ${tasks(prog.tasks)} ويكبر رفيقك`, copy: 'كل مهمة تنجزها تعطيك صندوقًا، وكل صندوق يدفّي الحاضنة.', actionLabel: 'لوحة المهام', target: { type: 'board' } };
    if (left) return { emoji: '📋', title: `باقي ${tasks(left)} اليوم`, copy: 'كل مهمة تعطيك صندوق مفاجأة لمزرعتك.', actionLabel: 'لوحة المهام', target: { type: 'board' } };
    if (locked.length) return { emoji: '🔒', title: 'صندوقك ينتظر موافقة والدك', copy: 'اطلب منه يعتمد إنجازك، وينفتح صندوقك هنا.', actionLabel: '', target: null };
    if (board.length) return { emoji: '🌙', title: 'أنجزت يومك كله', copy: prog ? `${prog.stage === 'egg' ? 'البيضة' : 'رفيقك'} يرتاح في الحاضنة — نكمل بكرة.` : 'مزرعتك مرتاحة — نكمل بكرة.', actionLabel: '', target: null };
    return { emoji: '🏡', title: 'مزرعتك هادئة اليوم', copy: 'لا مهام اليوم — تجوّل وحيِّ رفاقك.', actionLabel: '', target: null };
  },

  focusDailyObjective() {
    const o = this._dailyObjective;
    if (!o || !o.target) return;
    if (o.target.type === 'box') { const b = this.openable(C())[0]; if (b) this.openBox(b.id); return; }
    if (o.target.type === 'board') { this.openBoard(); return; }
    if (o.target.type === 'crop') this.focusCrop(o.target.index);
  },

  /* ─────── فتح الصندوق: لحظة الكشف ─────── */
  openBox(boxId) {
    const child = C();
    const res = this.claim(child, boxId);
    if (!res) return;
    save();
    App.refreshKidHeader();
    const b = res.box;
    const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    const chip = g => {
      if (g.kind === 'res') return `<span class="breveal__item"><img src="${this.RES[g.key].img}" alt=""><b>+${ar(g.n)} ${this.RES[g.key].name}</b></span>`;
      if (g.kind === 'seed') return `<span class="breveal__item"><img src="${this.RES.seed.img}" alt=""><b>${g.n === 2 ? 'بذرتا جزر!' : '+١ بذرة جزر'}</b></span>`;
      if (g.kind === 'gold') return `<span class="breveal__item breveal__item--rare"><img src="${this.GOLD_READY}" alt=""><b>جزرة ذهبية نادرة! ✨</b></span>`;
      if (g.kind === 'egg') return `<span class="breveal__item breveal__item--egg"><i>🥚</i><b>بيضة ${esc(this.KIN[g.kin].name)}!</b></span>`;
      if (g.kind === 'special') return `<span class="breveal__item breveal__item--special"><img src="${this.CROPS[g.crop].ready}" alt=""><b>بذرة ${this.CROPS[g.crop].name}! ${this.CROPS[g.crop].emoji}</b></span>`;
      return '';
    };
    // أبرز ما في الصندوق يظهر كبيرًا مكانه: فقس ← بيضة ← ذهب ← بذور
    const hatched = res.events.find(e => e.kind === 'hatch' || e.kind === 'grown');
    const eggG = res.gains.find(g => g.kind === 'egg'), specG = res.gains.find(g => g.kind === 'special');
    const K = k => this.KIN[k] || this.KIN.brown;
    const prize = hatched ? (hatched.kind === 'grown' ? K(hatched.kin).grown : K(hatched.kin).baby)
      : eggG ? K(eggG.kin).egg
      : res.gains.some(g => g.kind === 'gold') ? this.GOLD_READY
      : specG ? this.CROPS[specG.crop].ready
      : this.RES.seed.img;
    const prizeCls = '';
    const tierLabel = { common: '', uncommon: '<em class="breveal__tier breveal__tier--u">مميز</em>', rare: '<em class="breveal__tier breveal__tier--r">نادر ✨</em>' }[b.contents.tier];
    const ev = res.events.map(e => e.kind === 'hatch' ? `<p class="breveal__big">🐣 فقست البيضة — ${esc(K(e.kin).name)}!</p>`
      : e.kind === 'grown' ? `<p class="breveal__big">🐉 كبر ${esc(K(e.kin).name)} وخرج يعيش في مزرعتك!</p>`
      : `<p>🌱 كبرت ${e.n === 1 ? 'نبتة' : ar(e.n) + ' نبتات'} في حقلك</p>`).join('');
    const prog = this.incubatorLeft(child);
    const incLine = prog && !res.events.some(e => e.kind === 'hatch' || e.kind === 'grown')
      ? `<p>${prog.stage === 'egg' ? '🥚 البيضة دفيت' : '🐣 رفيقك كبر شوي'} — باقي ${this.tasksWord(prog.tasks)}</p>` : '';
    const next = this.openable(child).length;
    let ov = document.getElementById('box-reveal');
    if (!ov) { ov = document.createElement('div'); ov.id = 'box-reveal'; ov.className = 'breveal'; document.body.appendChild(ov); }
    ov.innerHTML = `<div class="breveal__card" role="dialog" aria-label="فتح الصندوق">
        <div class="breveal__stage">
          <span class="breveal__burst" aria-hidden="true"></span>
          <img class="breveal__box" src="farm/objects/box_${b.color}.webp" alt="">
          <img class="breveal__prize${prizeCls}${hatched ? ' breveal__prize--big' : ''}" src="${prize}" alt="">
        </div>
        <div class="breveal__content">
          <p class="breveal__from">${b.source === 'quran' ? 'من وردك اليوم 📖' : `من «${esc(b.title || 'مهمتك')}»`} ${tierLabel}</p>
          <div class="breveal__items">${res.gains.map(chip).join('')}</div>
          <div class="breveal__events">${ev}${incLine}</div>
          <button class="btn-primary big" onclick="JazarahFarm.closeReveal(${next ? 'true' : 'false'})">${next ? `افتح التالي (${ar(next)}) 🎁` : 'رائع! 🎉'}</button>
          ${next ? '<button class="breveal__later" onclick="JazarahFarm.closeReveal(false)">لاحقًا</button>' : ''}
        </div>
      </div>`;
    ov.classList.remove('on'); void ov.offsetWidth; ov.classList.add('on');
    if (res.events.some(e => e.kind === 'hatch')) this._hatchFxUntil = Date.now() + 1400;
    VoiceLines.say(res.events.length && res.events.some(e => e.kind !== 'crops') ? 'cheer' : 'right');
  },

  closeReveal(openNext) {
    const ov = document.getElementById('box-reveal');
    if (ov) ov.classList.remove('on');
    this.render();
    if (openNext) { const b = this.openable(C())[0]; if (b) setTimeout(() => this.openBox(b.id), 220); }
  },

  lockedInfo() {
    App.toast('🔒 هذا الصندوق ينتظر موافقة والدك — اطلب منه يعتمد إنجازك');
  },

  /* ─────── لوحة المهام ─────── */
  openBoard() {
    const child = C();
    const list = this.boardTasks(child);
    const cta = { ready: t => t.proof === 'photo' ? 'التقط دليلك 📸' : t.proof === 'parent' ? 'اطلب موافقة والدي 👀' : 'أنجزتها ✓' };
    const rows = list.map(({ t, state }) => `<div class="fboard-task fboard-task--${state}">
        <span class="fboard-task__box"><img src="farm/objects/box_${this.BOX_BY_CAT[t.cat] || 'brown'}.webp" alt=""></span>
        <div><b>${esc(t.title)}</b><small>${state === 'done' ? 'أنجزتها — صندوقها وصلك 🎁' : state === 'pending' ? 'صندوقها مقفل حتى يوافق والدك 🔒' : 'أنجزها وخذ صندوقها'}</small></div>
        ${state === 'ready' ? `<button class="btn-primary" onclick="JazarahFarm.boardDo('${t.id}')">${cta.ready(t)}</button>` : `<span class="fboard-task__state">${state === 'done' ? '✓' : '⏳'}</span>`}
      </div>`).join('') || '<p class="muted" style="text-align:center">لا مهام اليوم — تجوّل في مزرعتك وحيِّ رفاقك 🌿</p>';
    document.getElementById('farm-sheet-title').textContent = '📋 لوحة مهام اليوم';
    document.getElementById('farm-picks').innerHTML = `<div class="fboard-list">${rows}</div>`;
    const sh = document.getElementById('farm-sheet');
    sh.classList.add('on', 'farm-sheet--board'); sh.setAttribute('aria-hidden', 'false');
  },

  /* ─────── دفتر المزرعة: ما اكتُشف يظهر، وما لم يُكتشف ظل رمادي بتلميح ─────── */
  KIN_HINT: { brown: 'مهام المعرفة 📚', grey: 'مهام الحركة ⚡', blue: 'مهام الصحة 🛡️', gold: 'نور القلب والورد 🌙', green: 'القلوب الطيبة 🤝' },

  openAlbum() {
    const child = C(), f = this.of(child), a = f.album;
    const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    const { got, total } = this.albumCount(child);
    const kinCards = Object.entries(this.KIN).map(([k, kin]) => {
      const seen = a.kin[k] || {};
      const best = seen.grown ? 'grown' : seen.baby ? 'baby' : seen.egg ? 'egg' : null;
      const stages = [['egg', '🥚'], ['baby', '🐣'], ['grown', '🐉']]
        .map(([st, e]) => `<i class="${seen[st] ? 'on' : ''}">${e}</i>`).join('');
      return `<div class="alb-card${best ? '' : ' alb-card--hidden'}">
          <img src="${kin[best || 'egg']}" alt="">
          <b>${best ? esc(kin.name) : '؟ ؟ ؟'}</b>
          <span class="alb-stages">${stages}</span>
          ${best ? '' : `<small>بيضته في صناديق ${this.KIN_HINT[k]}</small>`}
        </div>`;
    }).join('');
    const cropCards = Object.entries(this.CROPS).map(([c, info]) => {
      const e = a.crops[c];
      return `<div class="alb-card${e ? '' : ' alb-card--hidden'}">
          <img src="${info.ready}" alt="">
          <b>${e ? info.name : '؟ ؟ ؟'}</b>
          ${e ? `<small>حصدت ${ar(e.n)} · ${e.shiny ? '<span class="alb-shiny">✨ لامعة</span>' : 'اللامعة تنتظر المطر 🌧️'}</small>`
              : `<small>${c === 'carrot' ? 'ازرع أول بذرة واحصدها' : 'بذرتها في صندوق «مميز»'}</small>`}
        </div>`;
    }).join('');
    const gold = a.crops.carrot && a.crops.carrot.gold;
    const goldCard = `<div class="alb-card alb-card--gold${gold ? '' : ' alb-card--hidden'}">
        <img src="${this.GOLD_READY}" alt="">
        <b>${gold ? 'الجزرة الذهبية' : '؟ ؟ ؟'}</b>
        <small>${gold ? 'أندر ما في المزرعة ✨' : 'نادرة — تأتي في صندوق «نادر»'}</small>
      </div>`;
    document.getElementById('farm-sheet-title').textContent = '📖 دفتر مزرعتي';
    document.getElementById('farm-picks').innerHTML = `
      <div class="alb">
        <div class="alb-progress"><span>اكتشفت <b>${ar(got)}</b> من ${ar(total)}</span><i style="--p:${Math.round(got / total * 100)}"></i></div>
        <h4>🐉 الرفاق</h4><div class="alb-grid">${kinCards}</div>
        <h4>🌾 المحاصيل</h4><div class="alb-grid">${cropCards}${goldCard}</div>
      </div>`;
    const sh = document.getElementById('farm-sheet');
    sh.classList.remove('farm-sheet--board');
    sh.classList.add('on', 'farm-sheet--album'); sh.setAttribute('aria-hidden', 'false');
  },

  boardDo(taskId) {
    this.close();
    App.completeTask(taskId);
  },

  /* ─────── الكاميرا ─────── */
  _fit() {
    const view = document.getElementById('farm-view'), w = document.getElementById('fworld');
    if (!view || !w) return;
    const vw = view.clientWidth, vh = view.clientHeight;
    this._scale = Math.max(vw / 1180, vh / 664);
    // أول فتح: الكاميرا على المرج حيث اللوحة والحاضنة، والحقل على طرفها
    if (!this._pan) this._pan = { x: vw / 2 - 850 * this._scale, y: vh / 2 - 450 * this._scale };
    this._clamp(vw, vh);
    this._paint();
  },
  _clamp(vw, vh) {
    const W = 1180 * this._scale, H = 664 * this._scale;
    this._pan.x = Math.max(Math.min(this._pan.x, 0), vw - W);
    this._pan.y = Math.max(Math.min(this._pan.y, 0), vh - H);
  },
  _paint() {
    const w = document.getElementById('fworld');
    if (w) w.style.transform = `translate(${this._pan.x}px,${this._pan.y}px) scale(${this._scale})`;
  },

  /* زر «وين؟»: يتنقّل بين ما يستحق الانتباه — الحاضنة واللوحة، ثم الجزر الناضج، ثم الحفر */
  points() {
    const f = this.of(C()), out = [];
    out.push({ p: { x: this.INCUB.x, y: this.INCUB.y - 60 }, sel: '[data-incub]' });
    out.push({ p: { x: this.BOARD.x, y: this.BOARD.y - 50 }, sel: '[data-board]' });
    f.crops.forEach((c, i) => { if (c.stage === 'ready') out.push({ p: this.CELLS[i], sel: `[data-crop="${i}"]` }); });
    this.SLOTS.forEach((sl, i) => { if (!f.built[i]) out.push({ p: sl, sel: `[data-slot="${i}"]` }); });
    f.crops.forEach((c, i) => { if (c.stage === 'empty') out.push({ p: this.CELLS[i], sel: `[data-crop="${i}"]` }); });
    return out;
  },

  show() {
    const view = document.getElementById('farm-view');
    const pts = this.points();
    if (!view || !pts.length) return;
    this._showIdx = ((this._showIdx == null ? -1 : this._showIdx) + 1) % pts.length;
    const { p: target, sel } = pts[this._showIdx];
    this._pan = { x: view.clientWidth / 2 - target.x * this._scale, y: view.clientHeight / 2 - target.y * this._scale };
    this._clamp(view.clientWidth, view.clientHeight);
    this._paint();
    const el = view.querySelector(sel);
    if (el) { el.classList.remove('fhint'); void el.offsetWidth; el.classList.add('fhint'); }
  },

  focusCrop(i) {
    const view = document.getElementById('farm-view');
    const cell = this.CELLS[i];
    if (!view || !cell) return;
    this._pan = { x: view.clientWidth / 2 - cell.x * this._scale, y: view.clientHeight / 2 - cell.y * this._scale };
    this._clamp(view.clientWidth, view.clientHeight);
    this._paint();
    const el = view.querySelector(`[data-crop="${i}"]`);
    if (el) { el.classList.remove('fhint'); void el.offsetWidth; el.classList.add('fhint'); }
  },

  _bind() {
    const view = document.getElementById('farm-view');
    let drag = null; this._moved = 0;
    view.addEventListener('pointerdown', e => {
      this._moved = 0;
      if (e.target.closest('button')) return;
      drag = { x: e.clientX, y: e.clientY };
    });
    const move = e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      this._moved += Math.abs(dx) + Math.abs(dy);
      this._pan.x += dx; this._pan.y += dy;
      drag = { x: e.clientX, y: e.clientY };
      this._clamp(view.clientWidth, view.clientHeight);
      this._paint();
    };
    const up = () => { drag = null; };
    view.addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);

    const tap = (sel, fn) => view.querySelectorAll(sel).forEach(el =>
      el.addEventListener('click', () => { if (this._moved <= 12) fn(el); }));
    tap('[data-crop]', el => this.tapCrop(+el.dataset.crop, el));
    tap('[data-slot]', el => this.openBuild(+el.dataset.slot));
    tap('[data-board]', () => this.openBoard());
    tap('[data-incub]', () => this.tapIncubator());
    tap('[data-resident]', el => { el.classList.remove('fresident--hi'); void el.offsetWidth; el.classList.add('fresident--hi'); VoiceLines.say('poke1'); App.toast('🐉 رفيقك فرحان فيك!'); });
    const jz = document.getElementById('farm-jz');
    if (jz) jz.addEventListener('click', () => { if (this._moved <= 12) VoiceLines.say('poke1'); });
  },

  /* ─────── الأفعال ─────── */
  tapIncubator() {
    const child = C(), prog = this.incubatorLeft(child);
    const openable = this.openable(child);
    if (openable.length) { this.openBox(openable[0].id); return; }
    if (!prog) { App.toast('🥚 أول صندوق تفتحه يجيب بيضة لحاضنتك'); return; }
    const n = this.tasksWord(prog.tasks);
    App.toast(prog.stage === 'egg' ? `🥚 البيضة دافية — باقي ${n} وتفقس` : `🐣 رفيقك يكبر — باقي ${n} ويخرج للمزرعة`);
  },

  tapCrop(i, el) {
    const f = this.of(C()), crop = f.crops[i];
    if (crop.stage === 'ready') return this.harvest(i, el);
    if (crop.stage === 'empty') return this.plant(i);
    App.toast('🌱 تكبر مع كل صندوق تفتحه 🎁');
  },

  /* أنواع البذور المتاحة الآن: ذهبية ← مميزة ← جزر */
  seedKinds(f) {
    const out = [];
    if (f.goldSeed > 0) out.push({ id: 'gold', n: f.goldSeed, name: 'بذرة ذهبية', img: this.GOLD_READY });
    this.SPECIAL.forEach(c => { if ((f.special[c] || 0) > 0) out.push({ id: c, n: f.special[c], name: 'بذرة ' + this.CROPS[c].name, img: this.CROPS[c].ready }); });
    if ((f.res.seed || 0) > 0) out.push({ id: 'carrot', n: f.res.seed, name: 'بذرة جزر', img: this.CROPS.carrot.ready });
    return out;
  },

  plant(i) {
    const f = this.of(C());
    const kinds = this.seedKinds(f);
    if (!kinds.length) { App.toast('🌱 البذور تأتي في الصناديق — أنجز مهمة وافتح صندوقك'); return; }
    if (kinds.length === 1) return this.plantKind(i, kinds[0].id);
    // أكثر من نوع: الطفل يختار
    this._plantAt = i;
    const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    document.getElementById('farm-sheet-title').textContent = '🌱 وش نزرع هنا؟';
    document.getElementById('farm-picks').innerHTML = kinds.map(k => `<button class="fpick${k.id === 'gold' ? ' fpick--gold' : ''}" onclick="JazarahFarm.plantKind(${i}, '${k.id}')">
        <img class="fpick-img" src="${k.img}" alt="">
        <span><b>${k.name}</b><span class="fpick-cost"><span>×${ar(k.n)}</span></span></span></button>`).join('');
    const sh = document.getElementById('farm-sheet');
    sh.classList.remove('farm-sheet--board');
    sh.classList.add('on'); sh.setAttribute('aria-hidden', 'false');
  },

  plantKind(i, kind) {
    const f = this.of(C());
    if (f.crops[i].stage !== 'empty') return;
    if (kind === 'gold') {
      if (f.goldSeed < 1) return;
      f.goldSeed--; f.crops[i] = { stage: 'seed', kind: 'carrot', gold: true };
    } else if (kind === 'carrot') {
      if ((f.res.seed || 0) < 1) return;
      f.res.seed--; f.crops[i] = { stage: 'seed', kind: 'carrot' };
    } else {
      if ((f.special[kind] || 0) < 1) return;
      f.special[kind]--; f.crops[i] = { stage: 'seed', kind };
    }
    const name = kind === 'gold' ? 'البذرة الذهبية' : 'بذرة ' + this.CROPS[kind].name;
    this.note(f, kind === 'gold' ? '✨' : '🌱', `زرعت ${name}`);
    this.close();
    save(); this.render();
    App.toast(`${kind === 'gold' ? '✨' : '🌱'} زرعت ${name} — تكبر مع كل صندوق تفتحه`);
  },

  harvest(i, el) {
    const f = this.of(C()), cell = this.CELLS[i], crop = f.crops[i];
    const jz = document.getElementById('farm-jz');
    if (jz) { jz.style.left = Math.max(180, cell.x + 18) + 'px'; jz.style.top = (cell.y - 70) + 'px'; }
    el.classList.add('fpull');
    setTimeout(() => {
      const kind = this.CROPS[crop.kind] ? crop.kind : 'carrot';
      const info = this.CROPS[kind];
      const coins = crop.gold ? 5 : info.coins + (crop.shiny ? 2 : 0);
      f.crops[i] = { stage: 'empty' };
      if (kind === 'carrot') f.res.seed = (f.res.seed || 0) + 1;
      else f.special[kind] = (f.special[kind] || 0) + 1;
      this._seeCrop(f, kind, { gold: crop.gold, shiny: crop.shiny });
      C().coins += coins;
      C().lifetimeCoins = (C().lifetimeCoins || 0) + coins;
      this.note(f, crop.gold ? '✨' : info.emoji, crop.gold ? 'حصد جزّور جزرة ذهبية!' : `حصد جزّور ${info.one}${crop.shiny ? ' لامعة' : ''}`);
      save();
      this.render();
      App.refreshKidHeader();
      const left = this.ready(C());
      const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
      App.toast(`${crop.gold ? '✨' : info.emoji} +${ar(coins)} 🥕${left ? ' · بقي ' + ar(left) : ''}`);
      if (!left || crop.gold) VoiceLines.say('cheer');
    }, 480);
  },

  openBuild(slot) {
    const f = this.of(C());
    this._slot = slot;
    const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    document.getElementById('farm-sheet-title').textContent = 'وش نبني هنا؟';
    document.getElementById('farm-picks').innerHTML = this.CATALOG.filter(it => !it.legacy).map(it => {
      const ok = this.can(f, it.cost);
      const cost = Object.entries(it.cost)
        .map(([k, n]) => `<span><img src="${this.RES[k].img}" alt="">${ar(n)}</span>`).join('');
      return `<button class="fpick${ok ? '' : ' locked'}" onclick="JazarahFarm.build('${it.id}')">
        <img class="fpick-img" src="${it.img}" alt="">
        <span><b>${it.name}</b><span class="fpick-cost">${cost}</span></span></button>`;
    }).join('');
    const sh = document.getElementById('farm-sheet');
    sh.classList.remove('farm-sheet--board');
    sh.classList.add('on'); sh.setAttribute('aria-hidden', 'false');
  },

  close() {
    const sh = document.getElementById('farm-sheet');
    if (sh) { sh.classList.remove('on', 'farm-sheet--board', 'farm-sheet--album'); sh.setAttribute('aria-hidden', 'true'); }
  },

  build(id) {
    const f = this.of(C()), it = this.CATALOG.find(x => x.id === id);
    if (!it || it.legacy) return;
    if (!this.can(f, it.cost)) { App.toast('الموارد ما تكفي بعد — صناديقك تجمعها لك'); return; }
    this.spend(f, it.cost);
    f.built[this._slot] = id;
    this.note(f, '🏗️', `اكتمل ${it.name} في المزرعة`);
    save(); this.close(); this.render();
    App.toast('🎉 اكتمل ' + it.name);
    VoiceLines.say('cheer');
    feedPush(C(), '🏗️', 'بنى في مزرعته: ' + it.name);
  },
};

window.JazarahFarm = JazarahFarm;
