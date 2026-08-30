/* ═══════════════════════════════════════════════════
   مزرعة جزّور — داخل المغامرة
   الحلقة: مهمة تُنجَز ← مورد يدخل المزرعة ← الطفل يزرع ويبني.
   نوع المهمة يحدد المورد، وهذا القرار مثبَّت في RES_BY_CAT.

   الحالة تُحفظ داخل بيانات الطفل (child.farm) فتتزامن مع كل شيء آخر.
   ═══════════════════════════════════════════════════ */
'use strict';

const JazarahFarm = {

  /* المهمة ← المورد (قرار مثبَّت) */
  RES_BY_CAT: { study: 'wood', sport: 'stone', health: 'water', faith: 'light', kindness: 'seed' },

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

  COMPANION: { HATCH_HARVEST_GOAL: 3, baby: 'farm/companions/baby_brown.webp' },

  /* حقل واحد من ٤×٤ خلايا: x = ٤٢٠ + (العمود−الصف)×٤٢، y = ٤٠٧ + (العمود+الصف)×١٨.
     يبقى ترتيب المصفوفة نفسه حتى تحافظ ملفات الأطفال الحالية على حالة كل جزرة. */
  CELLS: Array.from({ length: 16 }, (_, i) => {
    const row = Math.floor(i / 4), col = i % 4, depth = row + col;
    return { row, col, x: 420 + (col - row) * 42, y: 407 + depth * 18, s: 40 + depth * 2 };
  }),

  /* مواقع البناء — على المرج المفتوح فقط، لا فوق ممر ولا فوق بناء مرسوم */
  SLOTS: [
    { x: 678, y: 424 }, { x: 878, y: 422 }, { x: 970, y: 492 }, { x: 884, y: 556 },
  ],

  CATALOG: [
    { id: 'egg',  name: 'عش الرفيق', img: 'farm/companions/egg_brown.webp', w: 86,  cost: { light: 4, seed: 5 }, line: 'صار للرفيق بيت دافئ!' },
    { id: 'well', name: 'بئر ماء',   img: 'farm/buildings/well.webp',       w: 118, pad: true, cost: { stone: 6, wood: 2 }, line: 'موية أكثر يعني جزر أكبر!' },
    { id: 'barn', name: 'حظيرة',     img: 'farm/buildings/barn.webp',       w: 152, pad: true, cost: { wood: 8, stone: 3 }, line: 'الحظيرة جاهزة تستقبل الرفاق.' },
    { id: 'field',name: 'حقل إضافي', img: 'farm/buildings/field.webp',      w: 172, cost: { seed: 4, water: 3 }, line: 'حقل جديد! بنزرعه سوا.' },
  ],

  GROW_MS: 10 * 60 * 1000,

  /* ─────── الحالة ─────── */
  blank() {
    return {
      res: { wood: 0, stone: 0, water: 0, light: 0, seed: 3 },
      crops: this.CELLS.map((_, i) => (i < 3 ? { stage: 'ready' } : { stage: 'empty' })),
      built: {},
      seenIntro: false,
    };
  },

  of(child) {
    if (!child.farm || !Array.isArray(child.farm.crops) || child.farm.crops.length !== this.CELLS.length) {
      child.farm = this.blank();
    }
    return child.farm;
  },

  setImpact(impact) {
    this._impact = impact || null;
    this._completedImpact = null;
  },

  daily(f) {
    if (!f.daily || typeof f.daily !== 'object') f.daily = { lastVisitDate: null, lastVisitAt: null, events: [] };
    if (!Array.isArray(f.daily.events)) f.daily.events = [];
    return f.daily;
  },

  /* رفيق الحظيرة يبدأ كبيضة موجودة أصلًا. حالته مستقلة لكل طفل ولا تعتمد على الغياب أو مؤقت رعاية. */
  companionHome(f) {
    return Object.values(f.built || {}).some(id => id === 'barn' || id === 'egg');
  },

  companion(f) {
    if (!f.companion || typeof f.companion !== 'object') {
      f.companion = { stage: 'egg', harvestCount: 0, harvestInviteDate: null, greetingDate: null, hatchReadyAt: null, hatchedAt: null, lastGreetedAt: null };
    }
    if (!Number.isFinite(f.companion.harvestCount)) f.companion.harvestCount = 0;
    if (!f.companion.stage) f.companion.stage = 'egg';
    return f.companion;
  },

  companionMoment(f) {
    if (!this.companionHome(f)) return null;
    const companion = this.companion(f);
    const goal = this.COMPANION.HATCH_HARVEST_GOAL;
    if (companion.stage === 'baby') return { state: 'baby', title: 'رفيق الحظيرة الصغير يستكشف', copy: 'فقست البيضة بعد حصادات العائلة الحقيقية. يمكنك العودة إلى يومك متى أحببت.', action: null };
    if (companion.harvestCount >= goal || companion.hatchReadyAt) return { state: 'ready', title: 'البيضة جاهزة للفقس', copy: `حصدتم ${goal} جزر حقيقية معًا. هذه لحظة عائلية لطيفة، وليست سباقًا.`, action: 'افقسها' };
    const invited = companion.harvestInviteDate === todayKey() && companion.greetingDate !== todayKey();
    const greeted = companion.greetingDate === todayKey();
    if (invited) return { state: 'curious', title: 'بيضة الرفيق سمعت الحصاد', copy: 'لوّح لها مرة واحدة؛ فرحتها جزء لطيف من زيارة مزرعتك.', action: 'حيِّ الرفيق' };
    if (greeted) return { state: 'greeted', title: 'رفيق الحظيرة فرح بتحيتك', copy: 'تركنا له وقتًا هادئًا في عشه. تستطيع العودة إلى يومك متى أحببت.', action: null };
    return { state: 'resting', title: 'رفيق الحظيرة في عشه', copy: `بقي ${goal - companion.harvestCount} من حصادات العائلة ليصبح جاهزًا للفقس.`, action: null };
  },

  inviteCompanionAfterHarvest(f) {
    if (!this.companionHome(f)) return;
    const companion = this.companion(f);
    if (companion.stage !== 'egg' || companion.harvestCount >= this.COMPANION.HATCH_HARVEST_GOAL || companion.hatchReadyAt || companion.harvestInviteDate === todayKey() || companion.greetingDate === todayKey()) return;
    companion.harvestCount = Math.min(this.COMPANION.HATCH_HARVEST_GOAL, companion.harvestCount + 1);
    if (companion.harvestCount >= this.COMPANION.HATCH_HARVEST_GOAL) {
      companion.hatchReadyAt = Date.now();
      this.note(f, '✨', 'اكتملت حصادات العائلة؛ بيضة الرفيق جاهزة للفقس');
      return;
    }
    companion.harvestInviteDate = todayKey();
    this.note(f, '🐣', 'بيضة الرفيق اهتزت بعدما حصد جزّور جزرة');
  },

  hatchCompanion() {
    const f = this.of(C());
    if (!this.companionHome(f)) return;
    const companion = this.companion(f);
    if (companion.stage === 'baby') { App.toast('🐉 رفيق الحظيرة الصغير يستكشف مزرعتك'); return; }
    if (companion.harvestCount < this.COMPANION.HATCH_HARVEST_GOAL) { App.toast('🐣 نحتاج حصادات عائلية حقيقية أكثر أولًا'); return; }
    companion.stage = 'baby';
    companion.hatchReadyAt = companion.hatchReadyAt || Date.now();
    companion.hatchedAt = Date.now();
    companion.greetingDate = todayKey();
    this._hatchFxUntil = Date.now() + 560;
    this.note(f, '🐉', 'فقست بيضة الرفيق وظهر تنين صغير في العش');
    save(); this.render();
    App.toast('🐉 يا سلام! فقست بيضة الرفيق');
    setTimeout(() => this.render(), 580);
  },

  greetCompanion() {
    const f = this.of(C());
    if (!this.companionHome(f)) return;
    const companion = this.companion(f);
    if (companion.stage === 'baby') { App.toast('🐉 رفيق الحظيرة الصغير يستكشف مزرعتك'); return; }
    if (companion.harvestInviteDate !== todayKey()) { App.toast('🐣 الرفيق هادئ في عشه الآن'); return; }
    if (companion.greetingDate === todayKey()) { App.toast('🐣 حيّيت الرفيق اليوم بالفعل'); return; }
    companion.greetingDate = todayKey();
    companion.lastGreetedAt = Date.now();
    this.note(f, '🐣', 'لوّحت لرفيق الحظيرة بعد الحصاد');
    save(); this.render();
    App.toast('🐣 فرح رفيق الحظيرة بتحيتك');
  },

  note(f, emoji, text) {
    const daily = this.daily(f);
    const last = daily.events[0];
    if (last && last.text === text && last.date === todayKey()) return;
    daily.events.unshift({ id: uid(), emoji, text, date: todayKey(), at: Date.now() });
    if (daily.events.length > 12) daily.events = daily.events.slice(0, 12);
  },

  hasDailyMoment(child) {
    const f = this.of(child), daily = this.daily(f);
    const active = f.crops.some(crop => crop.stage === 'ready' || crop.stage === 'seed' || crop.stage === 'growing') ||
      ((f.res.seed || 0) > 0 && f.crops.some(crop => crop.stage === 'empty'));
    return daily.lastVisitDate !== todayKey() && active;
  },

  /* مهمة أُنجزت: مورد يدخل المزرعة، وكل بذرة مسقيّة تكبر خطوة */
  grant(child, cat) {
    const f = this.of(child);
    const key = this.RES_BY_CAT[cat] || 'seed';
    f.res[key] = (f.res[key] || 0) + 1;
    f.crops.forEach(c => { if (c.stage === 'growing') c.stage = 'ready'; });
    this.note(f, key === 'seed' ? '🌱' : '🌾', `وصل ${this.RES[key].name} من إنجازك إلى المزرعة`);
    return { key, name: this.RES[key].name, img: this.RES[key].img };
  },

  /* كم جزرة جاهزة للحصاد — لشارة التبويب */
  ready(child) {
    return this.of(child).crops.filter(c => c.stage === 'ready').length;
  },

  _grow(f) {
    let grown = 0;
    f.crops.forEach(c => {
      if (c.stage === 'growing' && c.wateredAt && Date.now() - c.wateredAt >= this.GROW_MS) { c.stage = 'ready'; grown++; }
    });
    return grown;
  },

  can(f, cost) { return Object.entries(cost).every(([k, n]) => (f.res[k] || 0) >= n); },
  spend(f, cost) { Object.entries(cost).forEach(([k, n]) => { f.res[k] -= n; }); },

  /* ─────── الرسم ─────── */
  render() {
    const el = document.getElementById('ktab-farm');
    if (!el) return;
    const child = C();
    const f = this.of(child);
    const daily = this.daily(f);
    const companion = this.companionHome(f) ? this.companion(f) : null;
    const hatching = companion?.stage === 'baby' && Date.now() < (this._hatchFxUntil || 0);
    const companionMoment = this.companionMoment(f);
    const grown = this._grow(f);
    if (grown) this.note(f, '🥕', grown === 1 ? 'نضجت جزرة منذ آخر زيارة' : `نضجت ${grown} جزرات منذ آخر زيارة`);
    const firstVisitToday = daily.lastVisitDate !== todayKey();
    if (firstVisitToday) { daily.lastVisitDate = todayKey(); daily.lastVisitAt = Date.now(); }
    const seedImpact = this._impact && this._impact.resourceKey === 'seed' && this._impact.status === 'viewed' ? this._impact : null;
    const impactTarget = seedImpact ? f.crops.findIndex(crop => crop.stage === 'empty') : -1;
    this._impactTargetCell = impactTarget >= 0 ? impactTarget : null;

    const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    const count = (n, one, two, few, many) =>
      n === 1 ? one : n === 2 ? two : (n >= 3 && n <= 10) ? `${ar(n)} ${few}` : `${ar(n)} ${many}`;
    const carrots = n => count(n, 'جزرة واحدة', 'جزرتين', 'جزرات', 'جزرة');

    const bar = Object.entries(this.RES)
      .map(([k, r]) => `<span class="fres" data-res="${k}"><img src="${r.img}" alt="${r.name}"><b>${ar(f.res[k] || 0)}</b></span>`)
      .join('');

    /* صفوف تربة مرئية تربط الحفر بجزء واحد من الحقل؛ المحاصيل فوقها تفاعلية بالكامل. */
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
      layer += crop.stage === 'empty'
        ? `<button class="fcrop fempty${i === impactTarget ? ' farm-impact-target' : ''}" data-crop="${i}" style="${pos}" aria-label="${i === impactTarget ? 'حفرة البذرة المكتسبة — ازرع هنا' : 'حفرة فارغة — ازرع جزرة'}"><span class="fcrop-add" aria-hidden="true">＋</span></button>`
        : `<button class="fcrop f-${crop.stage}" data-crop="${i}" style="${pos}" aria-label="جزرة"><img src="${this.CROP[crop.stage]}" alt=""></button>`;
    });

    this.SLOTS.forEach((sl, i) => {
      const id = f.built[i];
      const z = Math.round(sl.y);
      if (!id) {
        layer += `<button class="fslot" data-slot="${i}" style="left:${sl.x - 58}px;top:${sl.y - 36}px;z-index:${z}" aria-label="ابنِ هنا"><span class="fring"></span><span class="fplus">＋</span></button>`;
        return;
      }
      const it = this.CATALOG.find(x => x.id === id);
      if (!it) return;
      if (it.pad) layer += `<span class="fpad" style="width:${it.w * 0.66}px;height:${it.w * 0.24}px;left:${sl.x - it.w * 0.33}px;top:${sl.y - it.w * 0.12}px;z-index:${z - 2}"></span>`;
      const isNest = id === 'egg' && companion;
      const companionBaby = isNest && companion.stage === 'baby' && !hatching;
      layer += `<span class="fshadow" style="width:${it.w * 0.6}px;height:${it.w * 0.14}px;left:${sl.x - it.w * 0.3}px;top:${sl.y - it.w * 0.06}px;z-index:${z - 1}"></span>
        <img class="fbuild fplaced${isNest && hatching ? ' farm-companion-hatching-egg' : ''}${companionBaby ? ' farm-companion-baby' : ''}" src="${companionBaby ? this.COMPANION.baby : it.img}" style="left:${sl.x - it.w / 2}px;top:${sl.y - it.w * 0.9}px;width:${it.w}px;z-index:${z}" alt="${companionBaby ? 'رفيق الحظيرة الصغير' : it.name}">`;
    });

    if (companionMoment) {
      const state = companionMoment.state;
      const nestEntry = Object.entries(f.built).find(([, id]) => id === 'egg');
      const nest = nestEntry ? this.SLOTS[Number(nestEntry[0])] : { x: 258, y: 291 };
      const progress = companion?.stage === 'egg' ? `${companion.harvestCount}/${this.COMPANION.HATCH_HARVEST_GOAL}` : '';
      layer += `<button class="farm-companion farm-companion--${state}" data-companion type="button" style="left:${nest.x - 42}px;top:${nest.y - 82}px;z-index:${Math.round(nest.y) + 2}" aria-label="${state === 'curious' ? 'بيضة الرفيق تريد تحية بعد الحصاد' : state === 'ready' ? 'بيضة الرفيق جاهزة للفقس' : companion?.stage === 'baby' ? 'رفيق الحظيرة الصغير' : 'رفيق الحظيرة في عشه'}">
        <span class="farm-companion__signal" aria-hidden="true">${state === 'curious' ? '…' : state === 'greeted' ? '♡' : ''}</span>
        ${progress ? `<span class="farm-companion__progress" aria-hidden="true">${progress}</span>` : ''}
      </button>`;
    }

    layer += `<img class="fjz" id="farm-jz" src="${App.jzSrc('hero')}" style="left:566px;top:282px" alt="جزّور">`;

    const r = this.ready(child);
    const seeds = f.res.seed || 0;
    const emptyHoles = f.crops.filter(c => c.stage === 'empty').length;
    const dry = f.crops.filter(c => c.stage === 'seed').length;
    const objective = this.dailyObjective(f);
    this._dailyObjective = objective;
    const latest = daily.events[0];
    const hint = seedImpact && impactTarget >= 0 ? 'بذرتك وصلت! اختر الحفرة المضيئة لزرعها'
      : seedImpact ? 'بذرتك محفوظة في المخزن — افتح مساحة في الحقل ثم عد إليها'
      : r ? `اضغط أي جزرة ناضجة — جزّور يحصدها لك (${carrots(r)})`
      : dry ? `عندك ${count(dry, 'بذرة واحدة', 'بذرتين', 'بذور', 'بذرة')} تحتاج ماء — أنجز مهمة صحة 🛡️`
      : (emptyHoles && seeds) ? 'اضغط ＋ في التراب لتزرع جزرة'
      : 'أنجز مهامك، وكل مهمة تعطيك موردًا لمزرعتك';
    const impactBanner = this._completedImpact
      ? `<section class="farm-impact-banner farm-impact-banner--done" aria-live="polite"><span>🌱</span><div><b>زرعنا بذرتك!</b><small>أثر إنجازك صار جزءًا من مزرعتك.</small></div><button class="btn-ghost" onclick="JazarahFarm.returnToToday()">ارجع إلى يومي</button></section>`
      : seedImpact
        ? `<section class="farm-impact-banner" aria-live="polite"><span>🌱</span><div><b>بذرة من إنجازك</b><small>${impactTarget >= 0 ? 'اختر الحفرة المضيئة؛ هذا هو خيارك الآن.' : 'المورد محفوظ لك، ولا تحتاج إلى فعل شيء الآن.'}</small></div></section>`
        : '';
    const dailyPulse = `<section class="farm-daily-pulse${firstVisitToday ? ' farm-daily-pulse--new' : ''}" aria-label="نبضة مزرعتي اليوم">
      <span class="farm-daily-pulse__icon">${objective.emoji}</span>
      <div class="farm-daily-pulse__copy"><p>${firstVisitToday ? 'أهلًا في مزرعتك اليوم' : 'مزرعتي الآن'}</p><h3>${objective.title}</h3><small>${objective.copy}</small>${latest ? `<span class="farm-daily-pulse__latest">${latest.emoji} ${esc(latest.text)}</span>` : ''}</div>
      <button class="farm-daily-pulse__action" type="button" onclick="JazarahFarm.focusDailyObjective()">${objective.actionLabel}</button>
    </section>`;
    const companionCard = companionMoment && companionMoment.state !== 'resting'
      ? `<section class="farm-companion-card farm-companion-card--${companionMoment.state}" aria-live="polite"><span class="farm-companion-card__icon">${companionMoment.state === 'ready' ? '✨' : companionMoment.state === 'baby' ? '🐉' : '🐣'}</span><div><p>${companionMoment.title}</p><small>${companionMoment.copy}</small></div>${companionMoment.action ? `<button type="button" class="farm-companion-card__action" onclick="JazarahFarm.${companionMoment.state === 'ready' ? 'hatchCompanion' : 'greetCompanion'}()">${companionMoment.action}</button>` : ''}</section>`
      : '';

    el.innerHTML = `
      <div class="farm-bar">${bar}</div>
      ${dailyPulse}
      ${companionCard}
      ${impactBanner}
      <div class="farm-view" id="farm-view"><div class="fworld" id="fworld">${layer}</div></div>
      <div class="farm-hint-row">
        <p class="farm-hint">${hint}</p>
        <button class="farm-show" onclick="JazarahFarm.show()">وين؟ 👀</button>
      </div>
      <div class="farm-sheet" id="farm-sheet" aria-hidden="true">
        <div class="fsheet-handle"></div>
        <h3 id="farm-sheet-title">وش نبني هنا؟</h3>
        <div class="fpicks" id="farm-picks"></div>
        <button class="cancel-button" onclick="JazarahFarm.close()">ليس الآن</button>
      </div>`;

    this._bind();
    this._fit();
    if (impactTarget >= 0) this.focusImpactCell(impactTarget);
    if (firstVisitToday || grown) save();
  },

  dailyObjective(f) {
    const ready = f.crops.findIndex(crop => crop.stage === 'ready');
    if (ready >= 0) return { emoji: '🥕', title: 'جزرة ناضجة تنتظرك', copy: 'اضغطها ليحصدها جزّور معك ويصبح الحقل جاهزًا للزراعة.', actionLabel: 'أرِنيها', target: { type: 'crop', index: ready } };
    const seed = f.crops.findIndex(crop => crop.stage === 'seed');
    if (seed >= 0 && (f.res.water || 0) > 0) return { emoji: '💧', title: 'بذرة تحتاج ماء', copy: 'نسقيها بقطرة ماء، ثم نعود لاحقًا لنرى كيف كبرت.', actionLabel: 'أرِنيها', target: { type: 'crop', index: seed } };
    if (seed >= 0) return { emoji: '💧', title: 'بذرة تنتظر الماء', copy: 'عندما تنجز مهمة صحة، يصل ماء يساعدها على النمو.', actionLabel: 'ارجع إلى يومي', target: { type: 'map' } };
    const growing = f.crops.findIndex(crop => crop.stage === 'growing');
    if (growing >= 0) return { emoji: '🌿', title: 'نبتة تكبر بهدوء', copy: 'ارجع بعد قليل؛ ستجد تغيرًا واضحًا في الحقل من دون أن تفقد شيئًا.', actionLabel: 'أرِنيها', target: { type: 'crop', index: growing } };
    const empty = f.crops.findIndex(crop => crop.stage === 'empty');
    if (empty >= 0 && (f.res.seed || 0) > 0) return { emoji: '🌱', title: 'لديك بذرة جاهزة للزرع', copy: 'كل حفرة تمثل جزرة حقيقية مستقلة في حقل مزرعتك.', actionLabel: 'أرِنيها', target: { type: 'crop', index: empty } };
    return { emoji: '🏡', title: 'المزرعة هادئة الآن', copy: 'أنجز خطوة لطيفة في يومك، وسيصل أثرها الحقيقي إلى هنا.', actionLabel: 'ارجع إلى يومي', target: { type: 'map' } };
  },

  focusDailyObjective() {
    const objective = this._dailyObjective;
    if (!objective || !objective.target) return;
    if (objective.target.type === 'map') { App.kidTab('map'); return; }
    if (objective.target.type === 'crop') this.focusCrop(objective.target.index);
  },

  /* ─────── الكاميرا ─────── */
  _fit() {
    const view = document.getElementById('farm-view'), w = document.getElementById('fworld');
    if (!view || !w) return;
    const vw = view.clientWidth, vh = view.clientHeight;
    this._scale = Math.max(vw / 1180, vh / 664);
    // أول فتح: الكاميرا على الحقل ومواقع البناء معًا، لا على حافة الرسمة
    if (!this._pan) this._pan = { x: vw / 2 - 555 * this._scale, y: vh / 2 - 455 * this._scale };
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

  /* زر «وين؟»: يتنقّل بين نقاط الاهتمام واحدة بعد الأخرى — جزر ناضج،
     ثم مواقع بناء فارغة، ثم حفر للزراعة. الضغط المتكرر يجول بينها كلها. */
  points() {
    const f = this.of(C()), out = [];
    f.crops.forEach((c, i) => { if (c.stage === 'ready') out.push({ p: this.CELLS[i], sel: `[data-crop="${i}"]` }); });
    this.SLOTS.forEach((sl, i) => { if (!f.built[i]) out.push({ p: sl, sel: `[data-slot="${i}"]` }); });
    f.crops.forEach((c, i) => { if (c.stage === 'empty') out.push({ p: this.CELLS[i], sel: `[data-crop="${i}"]` }); });
    return out;
  },

  show() {
    const view = document.getElementById('farm-view');
    const pts = this.points();
    if (!view || !pts.length) { App.toast('مزرعتك مكتملة الآن — أنجز مهامك لتكبر أكثر'); return; }
    this._showIdx = ((this._showIdx == null ? -1 : this._showIdx) + 1) % pts.length;
    const { p: target, sel } = pts[this._showIdx];
    this._pan = { x: view.clientWidth / 2 - target.x * this._scale,
                  y: view.clientHeight / 2 - target.y * this._scale };
    this._clamp(view.clientWidth, view.clientHeight);
    this._paint();
    const el = view.querySelector(sel);
    if (el) { el.classList.remove('fhint'); void el.offsetWidth; el.classList.add('fhint'); }
  },

  focusImpactCell(i) {
    this.focusCrop(i);
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

    view.querySelectorAll('[data-crop]').forEach(el =>
      el.addEventListener('click', () => { if (this._moved <= 12) this.tapCrop(+el.dataset.crop, el); }));
    view.querySelectorAll('[data-slot]').forEach(el =>
      el.addEventListener('click', () => { if (this._moved <= 12) this.openBuild(+el.dataset.slot); }));
    const jz = document.getElementById('farm-jz');
    if (jz) jz.addEventListener('click', () => { if (this._moved <= 12) VoiceLines.say('poke1'); });
    const companion = view.querySelector('[data-companion]');
    if (companion) companion.addEventListener('click', () => { if (this._moved <= 12) this.greetCompanion(); });
  },

  /* ─────── الأفعال ─────── */
  tapCrop(i, el) {
    const f = this.of(C()), crop = f.crops[i];
    if (crop.stage === 'ready') return this.harvest(i, el);
    if (crop.stage === 'empty') {
      if (this._impact && this._impactTargetCell != null && i !== this._impactTargetCell) {
        App.toast('🌱 اختر الحفرة المضيئة لبذرتك');
        this.focusImpactCell(this._impactTargetCell);
        return;
      }
      return this.plant(i);
    }
    if (crop.stage === 'seed') {
      if ((f.res.water || 0) < 1) {
        App.toast('💧 تحتاج ماء — أنجز مهمة صحة 🛡️');
        return;
      }
      f.res.water--;
      f.crops.forEach(c => { if (c.stage === 'seed') { c.stage = 'growing'; c.wateredAt = Date.now(); } });
      this.note(f, '💧', 'سقينا البذور لتبدأ بالنمو');
      save(); this.render();
      App.toast('💧 سقينا البذور — تكبر مع مهمتك القادمة');
      return;
    }
    App.toast('🌱 تكبر… أنجز مهمة لتنضج');
  },

  plant(i) {
    const f = this.of(C());
    if ((f.res.seed || 0) < 1) { App.toast('🌱 تحتاج بذرة — أنجز مهمة قلوب طيبة 🤝'); return; }
    const completedImpact = this._impact && this._impact.resourceKey === 'seed' && this._impactTargetCell === i ? this._impact : null;
    f.res.seed--;
    f.crops[i] = { stage: 'seed' };
    this.note(f, '🌱', 'زرعت بذرة في الحقل');
    if (completedImpact) {
      App.resolveFarmImpact(completedImpact.id);
      this._impact = null;
      this._impactTargetCell = null;
      this._completedImpact = completedImpact;
    }
    save(); this.render();
    App.toast(completedImpact ? '🌱 زرعت بذرتك في مزرعتك' : '🌱 زرعنا جزرة — تحتاج ماء الآن');
  },

  returnToToday() {
    this._completedImpact = null;
    this._impact = null;
    this._impactTargetCell = null;
    App.kidTab('map');
  },

  harvest(i, el) {
    const f = this.of(C()), cell = this.CELLS[i];
    const jz = document.getElementById('farm-jz');
    if (jz) { jz.style.left = Math.max(180, cell.x + 18) + 'px'; jz.style.top = (cell.y - 70) + 'px'; }
    el.classList.add('fpull');
    setTimeout(() => {
      f.crops[i] = { stage: 'empty' };
      f.res.seed = (f.res.seed || 0) + 1;
      this.note(f, '🥕', 'حصد جزّور جزرة من الحقل');
      this.inviteCompanionAfterHarvest(f);
      C().coins += 1;
      save();
      this.render();
      App.refreshKidHeader();
      const left = this.ready(C());
      App.toast(left ? `🥕 +١ جزرة · بقي ${left}` : '🥕 حصدنا الحقل كله!');
      if (!left) VoiceLines.say('cheer');
    }, 480);
  },

  openBuild(slot) {
    const f = this.of(C());
    this._slot = slot;
    const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
    document.getElementById('farm-picks').innerHTML = this.CATALOG.map(it => {
      const ok = this.can(f, it.cost);
      const cost = Object.entries(it.cost)
        .map(([k, n]) => `<span><img src="${this.RES[k].img}" alt="">${ar(n)}</span>`).join('');
      return `<button class="fpick${ok ? '' : ' locked'}" onclick="JazarahFarm.build('${it.id}')">
        <img class="fpick-img" src="${it.img}" alt="">
        <span><b>${it.name}</b><span class="fpick-cost">${cost}</span></span></button>`;
    }).join('');
    const sh = document.getElementById('farm-sheet');
    sh.classList.add('on'); sh.setAttribute('aria-hidden', 'false');
  },

  close() {
    const sh = document.getElementById('farm-sheet');
    if (sh) { sh.classList.remove('on'); sh.setAttribute('aria-hidden', 'true'); }
  },

  build(id) {
    const f = this.of(C()), it = this.CATALOG.find(x => x.id === id);
    if (!it) return;
    if (!this.can(f, it.cost)) { App.toast('الموارد ما تكفي بعد — أنجز مهمة وارجع'); return; }
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
