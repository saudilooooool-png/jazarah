/* ═══════════════════════════════════════════════════
   جَزَرة — مغامرة العائلة (MVP)
   الفئة المستهدفة: 6–12 سنة
   تخزين محلي بالكامل (localStorage) — لا يحتاج خادمًا
   ═══════════════════════════════════════════════════ */

'use strict';

const STORAGE_KEY = 'jazarah_state_v1';

const CATEGORIES = {
  study:  { emoji: '📚', name: 'فك شفرة المعرفة',   color: '#6ec6ff' },
  sport:  { emoji: '⚡', name: 'تحدي طاقة البطل',   color: '#ffc93c' },
  health: { emoji: '🛡️', name: 'جرعات الطاقة والحماية', color: '#4caf7d' },
};

const AVATAR_STAGES = ['🐣', '🐥', '🦊', '🦁', '🦸', '🦸‍♂️', '🐉'];

const HERO_TITLES = [
  { level: 1,  title: 'مستكشف مبتدئ' },
  { level: 3,  title: 'مغامر شجاع' },
  { level: 5,  title: 'فارس المهام' },
  { level: 8,  title: 'بطل خارق' },
  { level: 12, title: 'أسطورة العائلة' },
];

const GEAR_ITEMS = [
  { id: 'cape',    emoji: '🧣', name: 'وشاح البطل',      cost: 30 },
  { id: 'crown',   emoji: '👑', name: 'تاج الملوك',      cost: 80 },
  { id: 'sword',   emoji: '🗡️', name: 'سيف الشجاعة',    cost: 50 },
  { id: 'shield',  emoji: '🛡️', name: 'درع الحماية',     cost: 50 },
  { id: 'wand',    emoji: '🪄', name: 'عصا سحرية',       cost: 60 },
  { id: 'rocket',  emoji: '🚀', name: 'صاروخ الانطلاق',  cost: 100 },
];

const BADGES = [
  { id: 'first_task',   emoji: '🌟', name: 'أول خطوة',      desc: 'أنجزت أول مهمة!',              check: s => totalCompletions(s) >= 1 },
  { id: 'ten_tasks',    emoji: '💪', name: 'عشرة أبطال',    desc: 'أنجزت 10 مهام',                 check: s => totalCompletions(s) >= 10 },
  { id: 'fifty_tasks',  emoji: '🏆', name: 'نجم الإنجاز',   desc: 'أنجزت 50 مهمة',                 check: s => totalCompletions(s) >= 50 },
  { id: 'streak_3',     emoji: '🔥', name: 'شعلة النشاط',   desc: '3 أيام متتالية',                check: s => s.child.bestStreak >= 3 },
  { id: 'streak_7',     emoji: '🌋', name: 'بركان الهمّة',  desc: '7 أيام متتالية',                check: s => s.child.bestStreak >= 7 },
  { id: 'reader',       emoji: '📖', name: 'بطل القراءة',   desc: '10 مهام دراسية',                check: s => catCompletions(s, 'study') >= 10 },
  { id: 'athlete',      emoji: '🏅', name: 'سيد اللياقة',   desc: '10 مهام رياضية',                check: s => catCompletions(s, 'sport') >= 10 },
  { id: 'healthy',      emoji: '🥗', name: 'حارس الصحة',    desc: '10 عادات صحية',                 check: s => catCompletions(s, 'health') >= 10 },
  { id: 'boss_slayer',  emoji: '⚔️', name: 'قاهر الوحوش',   desc: 'هزمتم زعيمًا عائليًا',          check: s => s.bossesDefeated >= 1 },
  { id: 'rich',         emoji: '💰', name: 'كنز الجزر',     desc: 'جمعت 100 جزرة',                 check: s => s.child.lifetimeCoins >= 100 },
];

/* ─────────────── الحالة الافتراضية ─────────────── */

function defaultState() {
  return {
    pin: null,
    child: {
      name: 'البطل',
      xp: 0,
      coins: 0,
      lifetimeCoins: 0,
      hp: 100,
      streak: 0,
      bestStreak: 0,
      lastFullDay: null,   // آخر يوم أنجز فيه مهمة
      gear: [],            // معرفات العتاد المُشترى
      equipped: [],        // العتاد الظاهر على الأفاتار
    },
    tasks: [
      { id: uid(), title: 'إنهاء الواجبات المدرسية', cat: 'study',  xp: 30, coins: 10 },
      { id: uid(), title: 'قراءة 20 دقيقة',          cat: 'study',  xp: 20, coins: 8 },
      { id: uid(), title: 'حركة ونشاط 30 دقيقة',     cat: 'sport',  xp: 25, coins: 8 },
      { id: uid(), title: 'ترتيب الغرفة',            cat: 'health', xp: 15, coins: 5 },
      { id: uid(), title: 'شرب 6 أكواب ماء',         cat: 'health', xp: 10, coins: 4 },
      { id: uid(), title: 'النوم مبكرًا 😴',          cat: 'health', xp: 20, coins: 6 },
    ],
    completions: {},       // { 'YYYY-MM-DD': [taskId, ...] }
    rewards: [
      { id: uid(), emoji: '🎮', title: 'نصف ساعة لعب إضافية', cost: 25 },
      { id: uid(), emoji: '🌳', title: 'مشوار إلى الحديقة',    cost: 60 },
      { id: uid(), emoji: '🍕', title: 'اختيار وجبة العشاء',   cost: 40 },
      { id: uid(), emoji: '🎬', title: 'سهرة فيلم عائلي',      cost: 70 },
    ],
    redemptions: [],       // { id, rewardId, title, cost, date, status: 'pending'|'approved' }
    boss: null,            // { title, target, progress, reward, defeated }
    bossesDefeated: 0,
    mysteryBox: null,      // { prize, coins }
    lastHpDay: todayKey(),
  };
}

/* ─────────────── أدوات مساعدة ─────────────── */

function uid() { return Math.random().toString(36).slice(2, 10); }
function todayKey(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function dayKeyOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return todayKey(d);
}
const DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
function dayNameOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return DAY_NAMES[d.getDay()];
}

function totalCompletions(s) {
  return Object.values(s.completions).reduce((a, arr) => a + arr.length, 0);
}
function catCompletions(s, cat) {
  const ids = new Set(s.tasks.filter(t => t.cat === cat).map(t => t.id));
  let n = 0;
  for (const arr of Object.values(s.completions)) n += arr.filter(id => ids.has(id)).length;
  return n;
}
function levelOf(xp) { return Math.floor(xp / 100) + 1; }
function levelProgress(xp) { return xp % 100; }
function heroTitle(level) {
  let t = HERO_TITLES[0].title;
  for (const h of HERO_TITLES) if (level >= h.level) t = h.title;
  return t;
}
function avatarFor(level) {
  return AVATAR_STAGES[Math.min(AVATAR_STAGES.length - 1, Math.floor((level - 1) / 2))];
}
function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ─────────────── التخزين ─────────────── */

let S = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { /* بيانات تالفة → نبدأ من جديد */ }
  return defaultState();
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); }

/* عند بداية كل يوم: خصم نقاط الصحة عن الأيام الفائتة بلا عادات صحية، وتصفير السلسلة عند الانقطاع */
function dailyUpkeep() {
  const today = todayKey();
  if (S.lastHpDay !== today) {
    const last = new Date(S.lastHpDay + 'T00:00:00');
    const now = new Date(today + 'T00:00:00');
    const missedDays = Math.min(7, Math.round((now - last) / 86400000));
    const healthIds = new Set(S.tasks.filter(t => t.cat === 'health').map(t => t.id));
    for (let i = 1; i <= missedDays; i++) {
      const d = new Date(last); d.setDate(d.getDate() + i);
      const key = todayKey(d);
      if (key === today) break;
      const done = (S.completions[key] || []).some(id => healthIds.has(id));
      if (!done && healthIds.size > 0) S.child.hp = Math.max(10, S.child.hp - 15);
    }
    S.lastHpDay = today;
  }
  // السلسلة: إذا لم يُنجز شيء أمس ولا اليوم بعدُ، تنكسر
  if (S.child.lastFullDay && S.child.lastFullDay !== today && S.child.lastFullDay !== dayKeyOffset(-1)) {
    S.child.streak = 0;
  }
  save();
}

/* ═══════════════════════════════════════════════════
   التطبيق
   ═══════════════════════════════════════════════════ */

const App = {

  /* ─────── التنقل العام ─────── */
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  },

  enterKid() {
    dailyUpkeep();
    this.showScreen('screen-kid');
    this.kidTab('map');
    this.refreshKidHeader();
  },

  /* ─────── الرقم السري ─────── */
  _pinBuffer: '',
  _pinMode: 'enter', // 'setup' | 'enter'

  enterParent() {
    this._pinBuffer = '';
    this._pinMode = S.pin ? 'enter' : 'setup';
    document.getElementById('pin-title').textContent =
      this._pinMode === 'setup' ? 'أنشئ رقمًا سريًا للوالدين' : 'أدخل الرقم السري';
    document.getElementById('pin-hint').textContent =
      this._pinMode === 'setup' ? 'أربعة أرقام يعرفها الوالدان فقط' : '';
    document.getElementById('pin-error').textContent = '';
    this.renderPinPad();
    this.renderPinDots();
    this.showScreen('screen-pin');
  },

  renderPinPad() {
    const pad = document.getElementById('pin-pad');
    pad.innerHTML = '';
    const keys = ['1','2','3','4','5','6','7','8','9','C','0','⌫'];
    for (const k of keys) {
      const b = document.createElement('button');
      b.textContent = k;
      b.onclick = () => this.pinKey(k);
      pad.appendChild(b);
    }
  },

  pinKey(k) {
    document.getElementById('pin-error').textContent = '';
    if (k === 'C') this._pinBuffer = '';
    else if (k === '⌫') this._pinBuffer = this._pinBuffer.slice(0, -1);
    else if (this._pinBuffer.length < 4) this._pinBuffer += k;
    this.renderPinDots();
    if (this._pinBuffer.length === 4) setTimeout(() => this.pinSubmit(), 150);
  },

  renderPinDots() {
    document.querySelectorAll('#pin-dots i').forEach((dot, i) => {
      dot.classList.toggle('filled', i < this._pinBuffer.length);
    });
  },

  pinSubmit() {
    if (this._pinMode === 'setup') {
      S.pin = this._pinBuffer;
      save();
      this.openParent();
    } else if (this._pinBuffer === S.pin) {
      this.openParent();
    } else {
      document.getElementById('pin-error').textContent = 'رقم غير صحيح، حاول مرة أخرى';
      this._pinBuffer = '';
      this.renderPinDots();
    }
  },

  openParent() {
    dailyUpkeep();
    this.showScreen('screen-parent');
    this.parentTab('tasks');
    const today = todayKey();
    const done = (S.completions[today] || []).length;
    document.getElementById('parent-subtitle').textContent =
      `${esc(S.child.name)} أنجز اليوم ${done} من ${S.tasks.length} مهام`;
  },

  /* ═══════════ لوحة الوالدين ═══════════ */

  parentTab(tab) {
    document.querySelectorAll('.ptab').forEach(b => b.classList.toggle('active', b.dataset.ptab === tab));
    document.querySelectorAll('.ptab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('ptab-' + tab).classList.add('active');
    const renderers = { tasks: this.renderPTasks, rewards: this.renderPRewards, boss: this.renderPBoss, report: this.renderPReport, settings: this.renderPSettings };
    renderers[tab].call(this);
  },

  /* ── تبويب المهام ── */
  renderPTasks() {
    const today = todayKey();
    const doneIds = new Set(S.completions[today] || []);
    const rows = S.tasks.map(t => `
      <div class="task-row">
        <span class="task-cat">${CATEGORIES[t.cat].emoji}</span>
        <div class="task-info">
          <div class="t-title">${doneIds.has(t.id) ? '✅ ' : ''}${esc(t.title)}</div>
          <div class="t-meta">${CATEGORIES[t.cat].name} · ${t.xp} XP · ${t.coins} 🥕</div>
        </div>
        <div class="task-actions">
          <button class="icon-btn" title="تعديل" onclick="App.taskForm('${t.id}')">✏️</button>
          <button class="icon-btn" title="حذف" onclick="App.deleteTask('${t.id}')">🗑️</button>
        </div>
      </div>`).join('');

    document.getElementById('ptab-tasks').innerHTML = `
      <div class="card">
        <h3>مهام اليوم (${S.tasks.length})</h3>
        ${rows || '<p class="muted">لا توجد مهام بعد — أضف أول مهمة!</p>'}
      </div>
      <button class="btn-primary" onclick="App.taskForm()">＋ إضافة مهمة جديدة</button>
      <div class="card" style="margin-top:14px">
        <h3>🎁 إسقاط صندوق مفاجأة</h3>
        <p class="muted" style="margin-bottom:10px">كافئ أداءً مميزًا غير متوقع بصندوق يظهر في خريطة ${esc(S.child.name)}</p>
        ${S.mysteryBox
          ? `<p class="pill">📦 صندوق بانتظار الفتح: ${esc(S.mysteryBox.prize)} (+${S.mysteryBox.coins} 🥕)</p>`
          : `<button class="btn-primary purple" onclick="App.mysteryForm()">إسقاط صندوق 📦</button>`}
      </div>`;
  },

  taskForm(taskId) {
    const t = taskId ? S.tasks.find(x => x.id === taskId) : null;
    const catOptions = Object.entries(CATEGORIES)
      .map(([k, c]) => `<option value="${k}" ${t && t.cat === k ? 'selected' : ''}>${c.emoji} ${c.name}</option>`).join('');
    this.openModal(`
      <h3>${t ? 'تعديل المهمة' : 'مهمة جديدة'}</h3>
      <div class="form-grid">
        <div><label>اسم المهمة</label><input id="f-title" value="${t ? esc(t.title) : ''}" placeholder="مثال: قراءة 20 دقيقة" /></div>
        <div><label>المسار</label><select id="f-cat">${catOptions}</select></div>
        <div class="form-row">
          <div><label>نقاط الخبرة XP</label><input id="f-xp" type="number" min="5" max="100" value="${t ? t.xp : 20}" /></div>
          <div><label>الجزر 🥕</label><input id="f-coins" type="number" min="1" max="50" value="${t ? t.coins : 5}" /></div>
        </div>
        <button class="btn-primary green" onclick="App.saveTask('${taskId || ''}')">حفظ</button>
      </div>`);
  },

  saveTask(taskId) {
    const title = document.getElementById('f-title').value.trim();
    if (!title) { this.toast('اكتب اسم المهمة أولًا'); return; }
    const cat = document.getElementById('f-cat').value;
    const xp = Math.max(5, parseInt(document.getElementById('f-xp').value) || 20);
    const coins = Math.max(1, parseInt(document.getElementById('f-coins').value) || 5);
    if (taskId) {
      const t = S.tasks.find(x => x.id === taskId);
      Object.assign(t, { title, cat, xp, coins });
    } else {
      S.tasks.push({ id: uid(), title, cat, xp, coins });
    }
    save();
    this.closeModal();
    this.renderPTasks();
    this.toast('تم الحفظ ✅');
  },

  deleteTask(taskId) {
    if (!confirm('حذف هذه المهمة؟')) return;
    S.tasks = S.tasks.filter(t => t.id !== taskId);
    save();
    this.renderPTasks();
  },

  mysteryForm() {
    this.openModal(`
      <h3>📦 صندوق مفاجأة</h3>
      <div class="form-grid">
        <div><label>المفاجأة</label><input id="f-prize" placeholder="مثال: آيس كريم بعد العشاء!" /></div>
        <div><label>جزر إضافي 🥕</label><input id="f-mcoins" type="number" min="0" max="50" value="10" /></div>
        <button class="btn-primary purple" onclick="App.dropMystery()">إسقاط الصندوق 🎯</button>
      </div>`);
  },

  dropMystery() {
    const prize = document.getElementById('f-prize').value.trim();
    if (!prize) { this.toast('اكتب المفاجأة أولًا'); return; }
    S.mysteryBox = { prize, coins: Math.max(0, parseInt(document.getElementById('f-mcoins').value) || 0) };
    save();
    this.closeModal();
    this.renderPTasks();
    this.toast('تم إسقاط الصندوق في الخريطة! 📦');
  },

  /* ── تبويب المكافآت ── */
  renderPRewards() {
    const pending = S.redemptions.filter(r => r.status === 'pending');
    const pendingHtml = pending.length ? `
      <div class="card">
        <h3>⏳ طلبات بانتظار الموافقة</h3>
        ${pending.map(r => `
          <div class="task-row">
            <span class="task-cat">🎁</span>
            <div class="task-info"><div class="t-title">${esc(r.title)}</div><div class="t-meta">${r.cost} 🥕 · ${r.date}</div></div>
            <button class="icon-btn" style="background:#e2f5ea" onclick="App.approveRedemption('${r.id}')">✅</button>
          </div>`).join('')}
      </div>` : '';

    const rows = S.rewards.map(r => `
      <div class="task-row">
        <span class="task-cat">${r.emoji}</span>
        <div class="task-info"><div class="t-title">${esc(r.title)}</div><div class="t-meta">${r.cost} 🥕</div></div>
        <div class="task-actions">
          <button class="icon-btn" onclick="App.rewardForm('${r.id}')">✏️</button>
          <button class="icon-btn" onclick="App.deleteReward('${r.id}')">🗑️</button>
        </div>
      </div>`).join('');

    document.getElementById('ptab-rewards').innerHTML = `
      ${pendingHtml}
      <div class="card">
        <h3>خزنة مكافآت العائلة</h3>
        <p class="muted" style="margin-bottom:8px">جوائز واقعية يشتريها ${esc(S.child.name)} بالجزر 🥕</p>
        ${rows || '<p class="muted">أضف أول مكافأة!</p>'}
      </div>
      <button class="btn-primary" onclick="App.rewardForm()">＋ إضافة مكافأة</button>`;
  },

  rewardForm(rewardId) {
    const r = rewardId ? S.rewards.find(x => x.id === rewardId) : null;
    this.openModal(`
      <h3>${r ? 'تعديل المكافأة' : 'مكافأة جديدة'}</h3>
      <div class="form-grid">
        <div><label>الرمز</label><input id="f-remoji" value="${r ? r.emoji : '🎁'}" maxlength="4" /></div>
        <div><label>المكافأة</label><input id="f-rtitle" value="${r ? esc(r.title) : ''}" placeholder="مثال: مشوار إلى الحديقة" /></div>
        <div><label>السعر بالجزر 🥕</label><input id="f-rcost" type="number" min="5" max="500" value="${r ? r.cost : 30}" /></div>
        <button class="btn-primary green" onclick="App.saveReward('${rewardId || ''}')">حفظ</button>
      </div>`);
  },

  saveReward(rewardId) {
    const title = document.getElementById('f-rtitle').value.trim();
    if (!title) { this.toast('اكتب اسم المكافأة أولًا'); return; }
    const emoji = document.getElementById('f-remoji').value.trim() || '🎁';
    const cost = Math.max(5, parseInt(document.getElementById('f-rcost').value) || 30);
    if (rewardId) Object.assign(S.rewards.find(x => x.id === rewardId), { title, emoji, cost });
    else S.rewards.push({ id: uid(), title, emoji, cost });
    save();
    this.closeModal();
    this.renderPRewards();
    this.toast('تم الحفظ ✅');
  },

  deleteReward(rewardId) {
    if (!confirm('حذف هذه المكافأة؟')) return;
    S.rewards = S.rewards.filter(r => r.id !== rewardId);
    save();
    this.renderPRewards();
  },

  approveRedemption(id) {
    const r = S.redemptions.find(x => x.id === id);
    if (r) r.status = 'approved';
    save();
    this.renderPRewards();
    this.toast('تمت الموافقة — لا تنسَ تنفيذ الوعد! 🤝');
  },

  /* ── تبويب الزعيم ── */
  renderPBoss() {
    const b = S.boss;
    let bossHtml;
    if (b && !b.defeated) {
      const pct = Math.min(100, Math.round(b.progress / b.target * 100));
      bossHtml = `
        <div class="boss-card">
          <span class="boss-emoji">👾</span>
          <h3>${esc(b.title)}</h3>
          <div class="progressbar"><i style="width:${pct}%"></i></div>
          <p>${b.progress} / ${b.target} ضربة على وحش الكسل</p>
          <p class="boss-reward">🏆 الجائزة العائلية: ${esc(b.reward)}</p>
          <button class="boss-hit-btn" onclick="App.bossHit()">سجّل ضربة عائلية ⚔️</button>
        </div>
        <button class="btn-ghost" style="width:100%" onclick="App.cancelBoss()">إلغاء التحدي</button>`;
    } else if (b && b.defeated) {
      bossHtml = `
        <div class="card" style="text-align:center">
          <div style="font-size:3rem">🎊</div>
          <h3>هزمتم وحش الكسل!</h3>
          <p class="muted">الجائزة: ${esc(b.reward)}</p>
          <button class="btn-primary purple" style="margin-top:12px" onclick="App.bossForm()">تحدٍّ جديد 👾</button>
        </div>`;
    } else {
      bossHtml = `
        <div class="card" style="text-align:center">
          <div style="font-size:3rem">👾</div>
          <h3>لا يوجد تحدٍّ حاليًا</h3>
          <p class="muted" style="margin-bottom:12px">أنشئ تحديًا أسبوعيًا تتعاون فيه العائلة كلها لهزيمة وحش الكسل</p>
          <button class="btn-primary purple" onclick="App.bossForm()">إنشاء تحدي الزعيم 🗡️</button>
        </div>`;
    }
    document.getElementById('ptab-boss').innerHTML = bossHtml;
  },

  bossForm() {
    this.openModal(`
      <h3>👾 تحدي الزعيم الأسبوعي</h3>
      <div class="form-grid">
        <div><label>التحدي</label><input id="f-btitle" placeholder="مثال: مشي عائلي 5 مرات هذا الأسبوع" /></div>
        <div><label>عدد الضربات المطلوبة</label><input id="f-btarget" type="number" min="1" max="30" value="5" /></div>
        <div><label>الجائزة العائلية الكبرى</label><input id="f-breward" placeholder="مثال: رحلة نهاية الأسبوع!" /></div>
        <button class="btn-primary purple" onclick="App.saveBoss()">إطلاق التحدي ⚔️</button>
      </div>`);
  },

  saveBoss() {
    const title = document.getElementById('f-btitle').value.trim();
    const reward = document.getElementById('f-breward').value.trim();
    if (!title || !reward) { this.toast('أكمل بيانات التحدي أولًا'); return; }
    S.boss = { title, reward, target: Math.max(1, parseInt(document.getElementById('f-btarget').value) || 5), progress: 0, defeated: false };
    save();
    this.closeModal();
    this.renderPBoss();
    this.toast('انطلق التحدي! 👾');
  },

  cancelBoss() {
    if (!confirm('إلغاء التحدي الحالي؟')) return;
    S.boss = null;
    save();
    this.renderPBoss();
  },

  bossHit() {
    this._registerBossHit();
    this.renderPBoss();
  },

  _registerBossHit() {
    const b = S.boss;
    if (!b || b.defeated) return false;
    b.progress++;
    if (b.progress >= b.target) {
      b.defeated = true;
      S.bossesDefeated++;
      save();
      return true; // هُزم الزعيم
    }
    save();
    return false;
  },

  /* ── تبويب التقارير ── */
  renderPReport() {
    // آخر 7 أيام
    let bars = '', maxDone = 1;
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const n = (S.completions[dayKeyOffset(-i)] || []).length;
      days.push({ label: i === 0 ? 'اليوم' : dayNameOffset(-i), n });
      maxDone = Math.max(maxDone, n);
    }
    for (const d of days) {
      bars += `<div class="bar-col"><div class="bar" style="height:${Math.round(d.n / maxDone * 100)}%"></div><span class="bar-label">${d.label}</span></div>`;
    }

    const catStats = Object.entries(CATEGORIES).map(([k, c]) =>
      `<span class="pill">${c.emoji} ${c.name}: <b>${catCompletions(S, k)}</b></span>`).join('');

    const lvl = levelOf(S.child.xp);
    document.getElementById('ptab-report').innerHTML = `
      <div class="card">
        <h3>📊 الإنجاز في آخر 7 أيام</h3>
        <div class="chart">${bars}</div>
      </div>
      <div class="card">
        <h3>نظرة عامة على ${esc(S.child.name)}</h3>
        <div class="pill-list" style="margin-bottom:12px">
          <span class="pill">⭐ المستوى <b>${lvl}</b></span>
          <span class="pill">✨ ${S.child.xp} XP</span>
          <span class="pill">🥕 الرصيد <b>${S.child.coins}</b></span>
          <span class="pill">🔥 السلسلة <b>${S.child.streak}</b> يوم</span>
          <span class="pill">❤️ الصحة ${S.child.hp}%</span>
          <span class="pill">✅ إجمالي المهام <b>${totalCompletions(S)}</b></span>
        </div>
        <h3 style="margin-top:6px">حسب المسار</h3>
        <div class="pill-list">${catStats}</div>
      </div>`;
  },

  /* ── تبويب الإعدادات ── */
  renderPSettings() {
    document.getElementById('ptab-settings').innerHTML = `
      <div class="card">
        <h3>⚙️ الإعدادات</h3>
        <div class="form-grid">
          <div><label>اسم البطل</label><input id="f-kidname" value="${esc(S.child.name)}" /></div>
          <button class="btn-primary green" onclick="App.saveSettings()">حفظ</button>
        </div>
      </div>
      <div class="card">
        <h3>البيانات</h3>
        <p class="muted" style="margin-bottom:10px">تُحفظ البيانات محليًا على هذا الجهاز فقط</p>
        <button class="btn-ghost" style="width:100%;color:#ff5d5d;border-color:#ffd0d0" onclick="App.resetAll()">🗑️ إعادة ضبط التطبيق بالكامل</button>
      </div>`;
  },

  saveSettings() {
    const name = document.getElementById('f-kidname').value.trim();
    if (name) S.child.name = name;
    save();
    this.toast('تم الحفظ ✅');
  },

  resetAll() {
    if (!confirm('سيتم مسح كل التقدم والمهام والمكافآت. هل أنت متأكد؟')) return;
    localStorage.removeItem(STORAGE_KEY);
    S = defaultState();
    location.reload();
  },

  /* ═══════════ عالم الطفل ═══════════ */

  kidTab(tab) {
    document.querySelectorAll('.knav').forEach(b => b.classList.toggle('active', b.dataset.ktab === tab));
    document.querySelectorAll('.ktab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('ktab-' + tab).classList.add('active');
    const renderers = { map: this.renderKMap, hero: this.renderKHero, shop: this.renderKShop, badges: this.renderKBadges };
    renderers[tab].call(this);
    this.refreshKidHeader();
    window.scrollTo(0, 0);
  },

  refreshKidHeader() {
    const lvl = levelOf(S.child.xp);
    document.getElementById('kid-avatar-mini').textContent = avatarFor(lvl);
    document.getElementById('kid-name-mini').textContent = S.child.name;
    document.getElementById('stat-coins').textContent = S.child.coins;
    document.getElementById('stat-streak').textContent = S.child.streak;
  },

  /* ── خريطة المغامرة ── */
  renderKMap() {
    const today = todayKey();
    const doneIds = new Set(S.completions[today] || []);
    const allDone = S.tasks.length > 0 && S.tasks.every(t => doneIds.has(t.id));

    let html = `
      <h2 class="map-title">🗺️ مغامرة اليوم</h2>
      <p class="map-sub">${dayNameOffset(0)} — أكمل المراحل واجمع الكنوز!</p>`;

    // صندوق المفاجأة
    if (S.mysteryBox) {
      html += `
        <button class="mystery-node" onclick="App.openMystery()">
          <span class="m-emoji">📦</span>
          <span><b>صندوق مفاجأة هبط في خريطتك!</b><br /><small>اضغط لفتحه الآن 🎉</small></span>
        </button>`;
    }

    // تحدي الزعيم
    if (S.boss && !S.boss.defeated) {
      const pct = Math.min(100, Math.round(S.boss.progress / S.boss.target * 100));
      html += `
        <div class="boss-card">
          <span class="boss-emoji">👾</span>
          <h3>تحدي العائلة: ${esc(S.boss.title)}</h3>
          <div class="progressbar"><i style="width:${pct}%"></i></div>
          <p>${S.boss.progress} / ${S.boss.target} ⚔️</p>
          <p class="boss-reward">🏆 ${esc(S.boss.reward)}</p>
          <button class="boss-hit-btn" onclick="App.kidBossHit()">اضرب وحش الكسل! ⚔️</button>
        </div>`;
    }

    if (allDone) {
      html += `<div class="all-done-banner">🏆 أنهيت كل مهام اليوم! أنت بطل حقيقي 🎉</div>`;
    }

    if (S.tasks.length === 0) {
      html += `<div class="map-empty"><div class="big-emoji">🗺️</div><p class="muted">الخريطة فارغة… اطلب من والدك إضافة مهام المغامرة!</p></div>`;
    } else {
      html += '<div class="map-path">';
      S.tasks.forEach((t, i) => {
        const done = doneIds.has(t.id);
        const side = i % 2 === 0 ? 'side-left' : 'side-right';
        html += `
          <div class="map-node ${side} ${done ? 'done' : ''}">
            <button class="node-circle" onclick="App.completeTask('${t.id}')" ${done ? 'disabled' : ''}>
              ${done ? '⭐' : CATEGORIES[t.cat].emoji}
            </button>
            <div class="node-card">
              <div class="n-title">${esc(t.title)}</div>
              <div class="n-reward">✨ ${t.xp} XP &nbsp; 🥕 ${t.coins}</div>
            </div>
          </div>
          ${i < S.tasks.length - 1 ? '<div class="path-connector"></div>' : ''}`;
      });
      html += '</div>';
    }

    document.getElementById('ktab-map').innerHTML = html;
  },

  completeTask(taskId) {
    const today = todayKey();
    const t = S.tasks.find(x => x.id === taskId);
    if (!t) return;
    S.completions[today] = S.completions[today] || [];
    if (S.completions[today].includes(taskId)) return;
    S.completions[today].push(taskId);

    const prevLevel = levelOf(S.child.xp);
    S.child.xp += t.xp;
    S.child.coins += t.coins;
    S.child.lifetimeCoins += t.coins;
    if (t.cat === 'health') S.child.hp = Math.min(100, S.child.hp + 10);

    // السلسلة: أول إنجاز في اليوم يمددها
    if (S.child.lastFullDay !== today) {
      S.child.streak = (S.child.lastFullDay === dayKeyOffset(-1)) ? S.child.streak + 1 : 1;
      S.child.bestStreak = Math.max(S.child.bestStreak, S.child.streak);
      S.child.lastFullDay = today;
    }

    // مكافأة إتمام كل مهام اليوم
    const allDone = S.tasks.every(x => S.completions[today].includes(x.id));
    let bonus = 0;
    if (allDone) { bonus = 10; S.child.coins += bonus; S.child.lifetimeCoins += bonus; }

    save();

    const newLevel = levelOf(S.child.xp);
    let title = 'أحسنت يا بطل!', emoji = '🎉', msg = esc(t.title);
    if (newLevel > prevLevel) {
      title = `ترقّيت للمستوى ${newLevel}! 🆙`;
      emoji = avatarFor(newLevel);
      msg = 'أفاتارك يزداد قوة!';
    } else if (allDone) {
      title = 'أنهيت كل مهام اليوم! 🏆';
      emoji = '🏆';
      msg = `مكافأة اليوم الكامل: +${bonus} 🥕`;
    }
    this.celebrate(title, msg, [`+${t.xp} ✨ XP`, `+${t.coins + bonus} 🥕`], emoji);
    this.renderKMap();
    this.refreshKidHeader();
  },

  kidBossHit() {
    const defeated = this._registerBossHit();
    if (defeated) {
      this.celebrate('هزمتم وحش الكسل! ⚔️', `الجائزة العائلية: ${esc(S.boss.reward)}`, ['🏆 نصر عائلي!'], '🎊');
    } else if (S.boss) {
      this.toast(`ضربة قوية! ${S.boss.progress} / ${S.boss.target} ⚔️`);
    }
    this.renderKMap();
  },

  openMystery() {
    const box = S.mysteryBox;
    if (!box) return;
    S.child.coins += box.coins;
    S.child.lifetimeCoins += box.coins;
    S.mysteryBox = null;
    save();
    const gains = box.coins > 0 ? [`+${box.coins} 🥕`] : [];
    this.celebrate('صندوق المفاجأة! 📦', esc(box.prize), gains, '🎁');
    this.renderKMap();
    this.refreshKidHeader();
  },

  /* ── صفحة البطل ── */
  renderKHero() {
    const lvl = levelOf(S.child.xp);
    const prog = levelProgress(S.child.xp);
    const hearts = '❤️'.repeat(Math.max(1, Math.round(S.child.hp / 20))) + '🤍'.repeat(5 - Math.max(1, Math.round(S.child.hp / 20)));
    const gearEmojis = S.child.equipped.map(id => (GEAR_ITEMS.find(g => g.id === id) || {}).emoji || '').join(' ');

    document.getElementById('ktab-hero').innerHTML = `
      <div class="hero-card">
        <div class="hero-avatar">${avatarFor(lvl)}</div>
        <div class="hero-gear">${gearEmojis}</div>
        <div class="hero-name">${esc(S.child.name)}</div>
        <div class="hero-title-tag">« ${heroTitle(lvl)} »</div>
        <div class="hero-level-row"><span>المستوى ${lvl}</span><span>${prog} / 100 XP</span></div>
        <div class="progressbar"><i style="width:${prog}%"></i></div>
        <div class="hp-hearts" title="صحة البطل">${hearts} <small style="font-size:0.75rem;color:#8a86a8">${S.child.hp}%</small></div>
        <div class="hero-stats-grid">
          <div class="hstat"><div class="h-num">${totalCompletions(S)}</div><div class="h-lbl">مهمة منجزة</div></div>
          <div class="hstat"><div class="h-num">${S.child.bestStreak}</div><div class="h-lbl">أطول سلسلة 🔥</div></div>
          <div class="hstat"><div class="h-num">${S.child.lifetimeCoins}</div><div class="h-lbl">جزر مجموع 🥕</div></div>
        </div>
      </div>
      <div class="card">
        <h3>🧢 عتادي</h3>
        ${S.child.gear.length === 0
          ? '<p class="muted">اشترِ عتادًا من المتجر ليظهر على بطلك!</p>'
          : `<div class="pill-list">${S.child.gear.map(id => {
              const g = GEAR_ITEMS.find(x => x.id === id);
              const on = S.child.equipped.includes(id);
              return `<button class="pill" style="${on ? 'background:#e2f5ea' : ''}" onclick="App.toggleGear('${id}')">${g.emoji} ${g.name} ${on ? '✔' : ''}</button>`;
            }).join('')}</div><p class="muted" style="margin-top:8px">اضغط على القطعة لارتدائها أو خلعها</p>`}
      </div>`;
  },

  toggleGear(id) {
    const i = S.child.equipped.indexOf(id);
    if (i >= 0) S.child.equipped.splice(i, 1);
    else S.child.equipped.push(id);
    save();
    this.renderKHero();
  },

  /* ── المتجر ── */
  renderKShop() {
    const realRewards = S.rewards.map(r => `
      <div class="shop-item">
        <span class="s-emoji">${r.emoji}</span>
        <span class="s-name">${esc(r.title)}</span>
        <button class="buy-btn" ${S.child.coins < r.cost ? 'disabled' : ''} onclick="App.redeemReward('${r.id}')">${r.cost} 🥕</button>
      </div>`).join('');

    const gearShop = GEAR_ITEMS.map(g => {
      const owned = S.child.gear.includes(g.id);
      return `
      <div class="shop-item">
        <span class="s-emoji">${g.emoji}</span>
        <span class="s-name">${g.name}</span>
        ${owned
          ? '<button class="buy-btn owned" disabled>تم الشراء ✔</button>'
          : `<button class="buy-btn" ${S.child.coins < g.cost ? 'disabled' : ''} onclick="App.buyGear('${g.id}')">${g.cost} 🥕</button>`}
      </div>`;
    }).join('');

    const pending = S.redemptions.filter(r => r.status === 'pending');

    document.getElementById('ktab-shop').innerHTML = `
      <div class="all-done-banner" style="background:linear-gradient(120deg,#ffe0b8,#ffd0a0)">رصيدك: ${S.child.coins} 🥕</div>
      ${pending.length ? `<div class="card"><h3>⏳ بانتظار موافقة الوالدين</h3>${pending.map(p => `<p class="pill" style="margin-bottom:6px">🎁 ${esc(p.title)}</p>`).join('')}</div>` : ''}
      <h3 class="shop-section-title">🎁 جوائز حقيقية من العائلة</h3>
      <div class="shop-grid">${realRewards || '<p class="muted">لا توجد جوائز بعد</p>'}</div>
      <h3 class="shop-section-title">🧢 عتاد البطل</h3>
      <div class="shop-grid">${gearShop}</div>`;
  },

  redeemReward(rewardId) {
    const r = S.rewards.find(x => x.id === rewardId);
    if (!r || S.child.coins < r.cost) return;
    if (!confirm(`شراء "${r.title}" مقابل ${r.cost} 🥕؟`)) return;
    S.child.coins -= r.cost;
    S.redemptions.push({ id: uid(), rewardId: r.id, title: r.title, cost: r.cost, date: todayKey(), status: 'pending' });
    save();
    this.celebrate('طلب رائع! 🎁', `أرسلنا "${esc(r.title)}" للوالدين للموافقة`, [`-${r.cost} 🥕`], '📨');
    this.renderKShop();
    this.refreshKidHeader();
  },

  buyGear(gearId) {
    const g = GEAR_ITEMS.find(x => x.id === gearId);
    if (!g || S.child.coins < g.cost || S.child.gear.includes(gearId)) return;
    S.child.coins -= g.cost;
    S.child.gear.push(gearId);
    S.child.equipped.push(gearId);
    save();
    this.celebrate('عتاد جديد! ' + g.emoji, `${g.name} أصبح لك — يظهر الآن على بطلك!`, [`-${g.cost} 🥕`], g.emoji);
    this.renderKShop();
    this.refreshKidHeader();
  },

  /* ── الأوسمة ── */
  renderKBadges() {
    const cards = BADGES.map(b => {
      const earned = b.check(S);
      return `
      <div class="badge-card ${earned ? '' : 'locked'}">
        <div class="b-emoji">${b.emoji}</div>
        <div class="b-name">${b.name}</div>
        <div class="b-desc">${b.desc}</div>
      </div>`;
    }).join('');
    const earnedCount = BADGES.filter(b => b.check(S)).length;
    document.getElementById('ktab-badges').innerHTML = `
      <h2 class="map-title">🏅 أوسمتي (${earnedCount}/${BADGES.length})</h2>
      <p class="map-sub">كل إنجاز يفتح وسامًا جديدًا!</p>
      <div class="badges-grid">${cards}</div>`;
  },

  /* ═══════════ الاحتفال والنوافذ ═══════════ */

  celebrate(title, msg, gains, emoji = '🎉') {
    document.getElementById('celebrate-title').textContent = title;
    document.getElementById('celebrate-msg').innerHTML = msg;
    document.getElementById('celebrate-emoji').textContent = emoji;
    document.getElementById('celebrate-gains').innerHTML =
      gains.map((g, i) => `<span class="gain-chip ${i === 0 ? 'xp' : ''}">${g}</span>`).join('');
    document.getElementById('celebrate').classList.add('active');
    this.spawnConfetti();
  },

  closeCelebrate() {
    document.getElementById('celebrate').classList.remove('active');
    document.getElementById('confetti-layer').innerHTML = '';
  },

  spawnConfetti() {
    const layer = document.getElementById('confetti-layer');
    layer.innerHTML = '';
    const colors = ['#ff8c42', '#ffc93c', '#4caf7d', '#6ec6ff', '#9b6dff', '#ff5da2'];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.right = Math.random() * 100 + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = (1.8 + Math.random() * 2) + 's';
      c.style.animationDelay = Math.random() * 0.6 + 's';
      c.style.width = c.style.height = (8 + Math.random() * 8) + 'px';
      layer.appendChild(c);
    }
  },

  openModal(html) {
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal').classList.add('active');
  },
  closeModal() {
    document.getElementById('modal').classList.remove('active');
  },

  _toastTimer: null,
  toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  },
};

/* إغلاق النوافذ بالنقر على الخلفية */
document.getElementById('modal').addEventListener('click', e => {
  if (e.target.id === 'modal') App.closeModal();
});
document.getElementById('celebrate').addEventListener('click', e => {
  if (e.target.id === 'celebrate') App.closeCelebrate();
});

dailyUpkeep();
