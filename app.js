/* ═══════════════════════════════════════════════════
   جَزَرة — مغامرة العائلة (MVP)
   الفئة المستهدفة: 6–12 سنة
   تخزين محلي بالكامل (localStorage) — لا يحتاج خادمًا
   ═══════════════════════════════════════════════════ */

'use strict';

const STORAGE_KEY = 'jazarah_state_v1';

const CATEGORIES = {
  study:    { emoji: '📚', name: 'فك شفرة المعرفة',      color: '#6ec6ff' },
  sport:    { emoji: '⚡', name: 'تحدي طاقة البطل',      color: '#ffc93c' },
  health:   { emoji: '🛡️', name: 'جرعات الطاقة والحماية', color: '#4caf7d' },
  faith:    { emoji: '🌙', name: 'نور القلب',            color: '#9b6dff' },
  kindness: { emoji: '🤝', name: 'القلوب الطيبة',        color: '#ff5da2' },
};

/* ─────────────── مكتبة المهام الجاهزة ─────────────── */
const TASK_LIBRARY = [
  // 📚 فك شفرة المعرفة
  { title: 'حل الواجبات المدرسية',            cat: 'study',    xp: 30, coins: 10, proof: 'photo'  },
  { title: 'مراجعة دروس اليوم',               cat: 'study',    xp: 30, coins: 10, proof: 'parent' },
  { title: 'قراءة قصة 20 دقيقة',              cat: 'study',    xp: 20, coins: 8,  proof: 'parent' },
  { title: 'حفظ 5 كلمات إنجليزية جديدة',      cat: 'study',    xp: 20, coins: 8,  proof: 'parent' },
  { title: 'تجهيز الحقيبة لليوم التالي',      cat: 'study',    xp: 10, coins: 4,  proof: 'photo'  },
  { title: 'تعلّم مهارة جديدة 15 دقيقة',      cat: 'study',    xp: 20, coins: 8,  proof: 'parent' },
  // ⚡ تحدي طاقة البطل
  { title: 'تمرين كرة قدم',                   cat: 'sport',    xp: 25, coins: 8,  proof: 'parent' },
  { title: 'مشي أو جري 20 دقيقة',             cat: 'sport',    xp: 25, coins: 8,  proof: 'parent' },
  { title: 'سباحة',                           cat: 'sport',    xp: 30, coins: 10, proof: 'parent' },
  { title: 'تمارين صباحية 10 دقائق',          cat: 'sport',    xp: 15, coins: 5,  proof: 'self'   },
  { title: 'ركوب الدراجة',                    cat: 'sport',    xp: 20, coins: 7,  proof: 'parent' },
  { title: '30 قفزة حبل',                     cat: 'sport',    xp: 15, coins: 5,  proof: 'parent' },
  // 🛡️ جرعات الطاقة والحماية
  { title: 'شرب 6 أكواب ماء',                 cat: 'health',   xp: 10, coins: 4,  proof: 'self'   },
  { title: 'النوم مبكرًا 😴',                  cat: 'health',   xp: 20, coins: 6,  proof: 'self'   },
  { title: 'تناول فواكه وخضار',               cat: 'health',   xp: 15, coins: 5,  proof: 'self'   },
  { title: 'ترتيب الغرفة',                    cat: 'health',   xp: 15, coins: 5,  proof: 'photo'  },
  { title: 'تنظيف الأسنان صباحًا ومساءً',      cat: 'health',   xp: 10, coins: 4,  proof: 'self'   },
  { title: 'ترتيب السرير بعد الاستيقاظ',      cat: 'health',   xp: 10, coins: 4,  proof: 'photo'  },
  { title: 'الاستحمام دون تذكير',             cat: 'health',   xp: 10, coins: 4,  proof: 'self'   },
  // 🌙 نور القلب
  { title: 'الصلوات الخمس في وقتها',          cat: 'faith',    xp: 40, coins: 12, proof: 'parent' },
  { title: 'صلاة الفجر في وقتها',             cat: 'faith',    xp: 30, coins: 10, proof: 'parent' },
  { title: 'قراءة صفحة من القرآن',            cat: 'faith',    xp: 20, coins: 8,  proof: 'parent' },
  { title: 'أذكار الصباح والمساء',            cat: 'faith',    xp: 15, coins: 5,  proof: 'self'   },
  { title: 'الدعاء للوالدين',                 cat: 'faith',    xp: 10, coins: 4,  proof: 'self'   },
  // 🤝 القلوب الطيبة
  { title: 'مساعدة ماما في المطبخ',           cat: 'kindness', xp: 20, coins: 7,  proof: 'parent' },
  { title: 'مساعدة بابا في مهمة',             cat: 'kindness', xp: 20, coins: 7,  proof: 'parent' },
  { title: 'اللعب مع أخي الصغير',             cat: 'kindness', xp: 15, coins: 5,  proof: 'parent' },
  { title: 'ترتيب طاولة الطعام',              cat: 'kindness', xp: 15, coins: 5,  proof: 'photo'  },
  { title: 'إخراج النفايات',                  cat: 'kindness', xp: 10, coins: 4,  proof: 'photo'  },
  { title: 'قول كلمة طيبة لشخص اليوم',        cat: 'kindness', xp: 10, coins: 4,  proof: 'self'   },
];

/* ─────────────── مكتبة أفكار المكافآت ─────────────── */
const REWARD_LIBRARY = [
  { group: '🎮 وقت الشاشة', items: [
    { emoji: '🎮', title: 'نصف ساعة لعب إضافية',      cost: 25 },
    { emoji: '📺', title: 'ساعة مشاهدة إضافية',        cost: 35 },
    { emoji: '🎬', title: 'اختيار فيلم العائلة',       cost: 40 },
  ]},
  { group: '🚗 مشاوير', items: [
    { emoji: '🌳', title: 'مشوار إلى الحديقة',         cost: 60 },
    { emoji: '📚', title: 'مشوار للمكتبة وشراء قصة',   cost: 80 },
    { emoji: '🍔', title: 'مطعمي المفضل',              cost: 100 },
    { emoji: '🎡', title: 'رحلة إلى الملاهي',          cost: 150 },
  ]},
  { group: '🍦 حلويات', items: [
    { emoji: '🧃', title: 'عصيري المفضل',              cost: 15 },
    { emoji: '🍬', title: 'حلوى بعد العشاء',           cost: 20 },
    { emoji: '🍦', title: 'آيس كريم',                  cost: 30 },
  ]},
  { group: '👑 امتيازات', items: [
    { emoji: '🍕', title: 'اختيار وجبة العشاء',        cost: 40 },
    { emoji: '🌙', title: 'سهر نصف ساعة إضافية',       cost: 35 },
    { emoji: '🗓️', title: 'اختيار نشاط نهاية الأسبوع', cost: 90 },
    { emoji: '🏖️', title: 'يوم بدون مهام',             cost: 120 },
  ]},
  { group: '🎁 هدايا', items: [
    { emoji: '💵', title: 'مصروف إضافي',               cost: 150 },
    { emoji: '🧸', title: 'لعبة صغيرة',                cost: 200 },
    { emoji: '🎁', title: 'هدية مفاجأة كبيرة',         cost: 500 },
  ]},
];

/* ─────────────── نصائح تربوية للوالدين ─────────────── */
const PARENT_TIPS = [
  'امدح الجهد لا النتيجة: «أعجبني تركيزك» أفضل من «أنت ذكي»',
  'المكافأة الفورية الصغيرة أقوى أثرًا من الكبيرة المؤجلة',
  'اجعل ابنك يشارك في تسعير المكافآت — الشعور بالملكية يضاعف الحماس',
  'لا تحذف الجزر عقابًا؛ اجعل الخسارة الوحيدة هي ضياع الفرصة',
  '3 مهام ثابتة خير من 8 متقلبة — الثبات يبني العادة',
  'احتفل بسلسلة الأيام أمام العائلة، فالتقدير الاجتماعي وقود الاستمرار',
  'راجع صور الإثبات مع ابنك وامدح تفصيلة محددة فيها',
  'أسقط صندوق مفاجأة بعد سلوك طيب لم تطلبه — المفاجأة تعلّم المبادرة',
  'اجعل تحدي الزعيم شيئًا تشاركون فيه فعلًا — رؤيتك تشارك أهم من أي جائزة',
  'إن تعثرت السلسلة فذكّره بأفضل رقم وصله وشجعه على كسره',
];

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
      { id: uid(), title: 'إنهاء الواجبات المدرسية', cat: 'study',  xp: 30, coins: 10, proof: 'photo'  },
      { id: uid(), title: 'قراءة 20 دقيقة',          cat: 'study',  xp: 20, coins: 8,  proof: 'parent' },
      { id: uid(), title: 'حركة ونشاط 30 دقيقة',     cat: 'sport',  xp: 25, coins: 8,  proof: 'parent' },
      { id: uid(), title: 'ترتيب الغرفة',            cat: 'health', xp: 15, coins: 5,  proof: 'photo'  },
      { id: uid(), title: 'شرب 6 أكواب ماء',         cat: 'health', xp: 10, coins: 4,  proof: 'self'   },
      { id: uid(), title: 'النوم مبكرًا 😴',          cat: 'health', xp: 20, coins: 6,  proof: 'self'   },
    ],
    pendingProofs: [],     // { id, taskId, title, cat, xp, coins, proof, date, time, photo|null }
    unseenApprovals: [],   // إنجازات وافق عليها الوالد ولم يرها الطفل بعد
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
    lastDailyChest: null,  // آخر يوم فتح فيه الطفل صندوق الدخول اليومي
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
function dayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
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
/* المهمة الذهبية: مهمة مختلفة كل يوم بمكافأة مضاعفة — اختيار ثابت طوال اليوم */
function goldenTaskId(dateKey) {
  if (!S.tasks.length) return null;
  let h = 0;
  for (const ch of dateKey) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  return S.tasks[h % S.tasks.length].id;
}
/* قيم المهمة الفعلية لليوم (تُضاعف إن كانت ذهبية) */
function effectiveTask(t, dateKey) {
  if (t.id === goldenTaskId(dateKey)) return { ...t, xp: t.xp * 2, coins: t.coins * 2, golden: true };
  return { ...t, golden: false };
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
    if (raw) {
      const s = Object.assign(defaultState(), JSON.parse(raw));
      // ترحيل بيانات النسخ السابقة
      s.tasks.forEach(t => { if (!t.proof) t.proof = 'self'; });
      s.pendingProofs = s.pendingProofs || [];
      s.unseenApprovals = s.unseenApprovals || [];
      return s;
    }
  } catch (e) { /* بيانات تالفة → نبدأ من جديد */ }
  return defaultState();
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
  } catch (e) {
    // امتلأت مساحة التخزين (غالبًا بسبب صور الإثبات) → نحذف أقدم الصور ونعيد المحاولة
    for (const p of S.pendingProofs) { if (p.photo) { p.photo = null; break; } }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch (e2) { /* تجاهل */ }
  }
}

const PROOF_MODES = {
  self:   { emoji: '🤝', name: 'ثقة — يؤكد البطل بنفسه',   short: 'ثقة' },
  parent: { emoji: '👀', name: 'تأكيد الوالد قبل الصرف',    short: 'تأكيد الوالد' },
  photo:  { emoji: '📸', name: 'إثبات بصورة يراجعها الوالد', short: 'صورة إثبات' },
};

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

/* منح مكافآت إنجاز مهمة وتسجيلها — يُستدعى فورًا (مهام الثقة) أو عند موافقة الوالد */
function grantCompletion(t, dateKey) {
  S.completions[dateKey] = S.completions[dateKey] || [];
  if (S.completions[dateKey].includes(t.id)) return { bonus: 0, allDone: false, leveledUp: false, newLevel: levelOf(S.child.xp) };
  S.completions[dateKey].push(t.id);

  const prevLevel = levelOf(S.child.xp);
  S.child.xp += t.xp;
  S.child.coins += t.coins;
  S.child.lifetimeCoins += t.coins;
  if (t.cat === 'health') S.child.hp = Math.min(100, S.child.hp + 10);

  // السلسلة: أول إنجاز في يومه يمددها
  if (S.child.lastFullDay !== dateKey) {
    const dayBefore = new Date(dateKey + 'T00:00:00');
    dayBefore.setDate(dayBefore.getDate() - 1);
    S.child.streak = (S.child.lastFullDay === todayKey(dayBefore)) ? S.child.streak + 1 : 1;
    S.child.bestStreak = Math.max(S.child.bestStreak, S.child.streak);
    S.child.lastFullDay = dateKey;
  }

  // مكافأة إتمام كل مهام اليوم (لليوم الحالي فقط)
  let bonus = 0, allDone = false;
  if (dateKey === todayKey()) {
    allDone = S.tasks.length > 0 && S.tasks.every(x => (S.completions[dateKey] || []).includes(x.id));
    if (allDone) { bonus = 10; S.child.coins += bonus; S.child.lifetimeCoins += bonus; }
  }

  save();
  const newLevel = levelOf(S.child.xp);
  return { bonus, allDone, leveledUp: newLevel > prevLevel, newLevel };
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
    // موافقات وصلت أثناء غياب الطفل عن الشاشة
    if (S.unseenApprovals.length) {
      const items = S.unseenApprovals;
      const totalCoins = items.reduce((a, x) => a + x.coins, 0);
      const totalXp = items.reduce((a, x) => a + x.xp, 0);
      const list = items.map(x => `⭐ ${esc(x.title)}`).join('<br />');
      S.unseenApprovals = [];
      save();
      this.celebrate('والدك اعتمد إنجازك! 🎊', list, [`+${totalXp} ✨ XP`, `+${totalCoins} 🥕`], '👏');
      this.refreshKidHeader();
      this.renderKMap();
    } else if (S.lastDailyChest !== todayKey()) {
      // صندوق الدخول اليومي — مرة واحدة يوميًا
      this.showDailyChest();
    }
  },

  /* ── صندوق الكنز اليومي ── */
  showDailyChest() {
    this.openModal(`
      <div style="text-align:center">
        <div class="chest-emoji" id="chest-emoji">🎁</div>
        <h3 style="margin-top:8px">كنز اليوم وصل!</h3>
        <p class="muted" style="margin-bottom:16px">هدية دخولك اليومية — كل يوم تدخل فيه، الكنز ينتظرك</p>
        <button class="btn-primary big" onclick="App.openDailyChest()">افتح الصندوق! 🔑</button>
      </div>`);
  },

  openDailyChest() {
    if (S.lastDailyChest === todayKey()) { this.closeModal(); return; }
    S.lastDailyChest = todayKey();
    const base = 2 + Math.floor(Math.random() * 4); // 2–5 جزرات
    let streakBonus = 0;
    if (S.child.streak >= 30) streakBonus = 20;
    else if (S.child.streak >= 14) streakBonus = 10;
    else if (S.child.streak >= 7) streakBonus = 7;
    else if (S.child.streak >= 3) streakBonus = 3;
    const total = base + streakBonus;
    S.child.coins += total;
    S.child.lifetimeCoins += total;
    save();
    this.closeModal();
    const gains = [`+${base} 🥕`];
    if (streakBonus) gains.push(`+${streakBonus} 🥕 مكافأة السلسلة 🔥`);
    const goldenT = S.tasks.find(t => t.id === goldenTaskId(todayKey()));
    this.celebrate('كنز اليوم! 💰', goldenT ? `مهمة اليوم الذهبية ×2: <b>✨ ${esc(goldenT.title)}</b>` : 'يوم موفق يا بطل!', gains, '🪙');
    this.refreshKidHeader();
    this.renderKMap();
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
    const pending = S.pendingProofs.length;
    document.getElementById('parent-subtitle').textContent =
      `${S.child.name} أنجز اليوم ${done} من ${S.tasks.length} مهام` +
      (pending ? ` · 🔔 ${pending} إثبات بانتظارك` : '');
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
    const pendingIds = new Set(S.pendingProofs.map(p => p.taskId + '|' + p.date));

    // قائمة مراجعة الإثباتات المعلقة
    const reviewHtml = S.pendingProofs.length ? `
      <div class="card" style="border:3px solid var(--gold)">
        <h3>🔔 إثباتات بانتظار مراجعتك (${S.pendingProofs.length})</h3>
        ${S.pendingProofs.map(p => `
          <div class="proof-row">
            <div class="task-row" style="border-bottom:none">
              <span class="task-cat">${CATEGORIES[p.cat].emoji}</span>
              <div class="task-info">
                <div class="t-title">${esc(p.title)}</div>
                <div class="t-meta">${p.date === today ? 'اليوم' : p.date} · ${p.time} · ${p.xp} XP · ${p.coins} 🥕 · ${PROOF_MODES[p.proof].emoji} ${PROOF_MODES[p.proof].short}</div>
              </div>
            </div>
            ${p.photo ? `<img class="proof-photo" src="${p.photo}" alt="صورة الإثبات" onclick="App.zoomPhoto('${p.id}')" />` : ''}
            <div class="proof-actions">
              <button class="btn-primary green" style="flex:2" onclick="App.approveProof('${p.id}')">✅ اعتماد وصرف الجزر</button>
              <button class="btn-ghost" style="flex:1;color:#ff5d5d;border-color:#ffd0d0" onclick="App.rejectProof('${p.id}')">رفض</button>
            </div>
          </div>`).join('')}
      </div>` : '';

    const rows = S.tasks.map(t => {
      const state = doneIds.has(t.id) ? '✅ ' : (pendingIds.has(t.id + '|' + today) ? '⏳ ' : '');
      return `
      <div class="task-row">
        <span class="task-cat">${CATEGORIES[t.cat].emoji}</span>
        <div class="task-info">
          <div class="t-title">${state}${esc(t.title)}</div>
          <div class="t-meta">${CATEGORIES[t.cat].name} · ${t.xp} XP · ${t.coins} 🥕 · ${PROOF_MODES[t.proof].emoji} ${PROOF_MODES[t.proof].short}</div>
        </div>
        <div class="task-actions">
          <button class="icon-btn" title="تعديل" onclick="App.taskForm('${t.id}')">✏️</button>
          <button class="icon-btn" title="حذف" onclick="App.deleteTask('${t.id}')">🗑️</button>
        </div>
      </div>`;
    }).join('');

    document.getElementById('ptab-tasks').innerHTML = `
      ${reviewHtml}
      <div class="card">
        <h3>مهام اليوم (${S.tasks.length})</h3>
        ${rows || '<p class="muted">لا توجد مهام بعد — أضف أول مهمة!</p>'}
      </div>
      <div class="form-row">
        <div><button class="btn-primary" onclick="App.taskLibrary()">📚 أضف من المكتبة</button></div>
        <div><button class="btn-primary green" onclick="App.taskForm()">✏️ مهمة مخصصة</button></div>
      </div>
      <div class="card tip-card" style="margin-top:14px">
        <h3>💡 نصيحة اليوم</h3>
        <p>${PARENT_TIPS[dayOfYear() % PARENT_TIPS.length]}</p>
      </div>
      <div class="card">
        <h3>🎁 إسقاط صندوق مفاجأة</h3>
        <p class="muted" style="margin-bottom:10px">كافئ أداءً مميزًا غير متوقع بصندوق يظهر في خريطة ${esc(S.child.name)}</p>
        ${S.mysteryBox
          ? `<p class="pill">📦 صندوق بانتظار الفتح: ${esc(S.mysteryBox.prize)} (+${S.mysteryBox.coins} 🥕)</p>`
          : `<button class="btn-primary purple" onclick="App.mysteryForm()">إسقاط صندوق 📦</button>`}
      </div>`;
  },

  /* ── مكتبة المهام الجاهزة ── */
  _libFilter: 'all',

  taskLibrary(filter) {
    this._libFilter = filter || this._libFilter || 'all';
    const f = this._libFilter;
    const chips = [`<button class="lib-chip ${f === 'all' ? 'active' : ''}" onclick="App.taskLibrary('all')">الكل</button>`]
      .concat(Object.entries(CATEGORIES).map(([k, c]) =>
        `<button class="lib-chip ${f === k ? 'active' : ''}" onclick="App.taskLibrary('${k}')">${c.emoji} ${c.name}</button>`)).join('');
    const existing = new Set(S.tasks.map(t => t.title));
    const items = TASK_LIBRARY.filter(t => f === 'all' || t.cat === f).map((t, i) => {
      const idx = TASK_LIBRARY.indexOf(t);
      const added = existing.has(t.title);
      return `
      <div class="task-row">
        <span class="task-cat">${CATEGORIES[t.cat].emoji}</span>
        <div class="task-info">
          <div class="t-title">${esc(t.title)}</div>
          <div class="t-meta">${t.xp} XP · ${t.coins} 🥕 · ${PROOF_MODES[t.proof].emoji} ${PROOF_MODES[t.proof].short}</div>
        </div>
        ${added
          ? '<span class="pill" style="background:#e2f5ea">✔ مضافة</span>'
          : `<button class="icon-btn" style="background:#fff3e6;font-weight:900;color:var(--carrot-dark)" onclick="App.addFromLibrary(${idx})">＋</button>`}
      </div>`;
    }).join('');
    this.openModal(`
      <h3>📚 مكتبة المهام</h3>
      <div class="lib-chips">${chips}</div>
      <div class="lib-list">${items || '<p class="muted">لا مهام في هذا المسار</p>'}</div>`);
  },

  addFromLibrary(idx) {
    const t = TASK_LIBRARY[idx];
    if (!t || S.tasks.some(x => x.title === t.title)) return;
    S.tasks.push({ id: uid(), ...t });
    save();
    this.toast(`أُضيفت «${t.title}» لخريطة اليوم ✅`);
    this.taskLibrary();       // تحديث النافذة
    this.renderPTasks();
  },

  /* ── مكتبة أفكار المكافآت ── */
  rewardLibrary() {
    const existing = new Set(S.rewards.map(r => r.title));
    const sections = REWARD_LIBRARY.map((g, gi) => `
      <h3 style="margin-top:14px;font-size:1rem">${g.group}</h3>
      ${g.items.map((r, ri) => `
        <div class="task-row">
          <span class="task-cat">${r.emoji}</span>
          <div class="task-info">
            <div class="t-title">${esc(r.title)}</div>
            <div class="t-meta">سعر مقترح: ${r.cost} 🥕 — عدّله بعد الإضافة إن أردت</div>
          </div>
          ${existing.has(r.title)
            ? '<span class="pill" style="background:#e2f5ea">✔</span>'
            : `<button class="icon-btn" style="background:#fff3e6;font-weight:900;color:var(--carrot-dark)" onclick="App.addRewardFromLibrary(${gi},${ri})">＋</button>`}
        </div>`).join('')}`).join('');
    this.openModal(`
      <h3>🎁 مكتبة أفكار المكافآت</h3>
      <p class="muted">أنت من يعتمد الجائزة ويحدد سعرها النهائي</p>
      <div class="lib-list">${sections}</div>`);
  },

  addRewardFromLibrary(gi, ri) {
    const r = REWARD_LIBRARY[gi].items[ri];
    if (!r || S.rewards.some(x => x.title === r.title)) return;
    S.rewards.push({ id: uid(), ...r });
    save();
    this.toast(`أُضيفت «${r.title}» إلى الخزنة ✅`);
    this.rewardLibrary();
    this.renderPRewards();
  },

  approveProof(id) {
    const p = S.pendingProofs.find(x => x.id === id);
    if (!p) return;
    S.pendingProofs = S.pendingProofs.filter(x => x.id !== id);
    // نمنح المكافآت بهوية المهمة الأصلية وتاريخ الإنجاز الأصلي
    const taskLike = { id: p.taskId, cat: p.cat, xp: p.xp, coins: p.coins };
    grantCompletion(taskLike, p.date);
    S.unseenApprovals.push({ title: p.title, xp: p.xp, coins: p.coins });
    save();
    this.renderPTasks();
    this.toast(`تم الاعتماد — وصل ${p.coins} 🥕 إلى ${S.child.name} ✅`);
  },

  rejectProof(id) {
    const p = S.pendingProofs.find(x => x.id === id);
    if (!p) return;
    if (!confirm(`رفض إثبات "${p.title}"؟ ستعود المهمة متاحة في خريطة ${S.child.name}`)) return;
    S.pendingProofs = S.pendingProofs.filter(x => x.id !== id);
    save();
    this.renderPTasks();
    this.toast('تم الرفض — عادت المهمة إلى الخريطة');
  },

  zoomPhoto(proofId) {
    const p = S.pendingProofs.find(x => x.id === proofId);
    if (!p || !p.photo) return;
    this.openModal(`
      <h3>📸 ${esc(p.title)}</h3>
      <img src="${p.photo}" style="width:100%;border-radius:14px" alt="صورة الإثبات" />
      <div class="proof-actions" style="margin-top:14px">
        <button class="btn-primary green" style="flex:2" onclick="App.closeModal();App.approveProof('${p.id}')">✅ اعتماد</button>
        <button class="btn-ghost" style="flex:1;color:#ff5d5d;border-color:#ffd0d0" onclick="App.closeModal();App.rejectProof('${p.id}')">رفض</button>
      </div>`);
  },

  taskForm(taskId) {
    const t = taskId ? S.tasks.find(x => x.id === taskId) : null;
    const catOptions = Object.entries(CATEGORIES)
      .map(([k, c]) => `<option value="${k}" ${t && t.cat === k ? 'selected' : ''}>${c.emoji} ${c.name}</option>`).join('');
    const proofOptions = Object.entries(PROOF_MODES)
      .map(([k, m]) => `<option value="${k}" ${(t ? t.proof : 'self') === k ? 'selected' : ''}>${m.emoji} ${m.name}</option>`).join('');
    this.openModal(`
      <h3>${t ? 'تعديل المهمة' : 'مهمة جديدة'}</h3>
      <div class="form-grid">
        <div><label>اسم المهمة</label><input id="f-title" value="${t ? esc(t.title) : ''}" placeholder="مثال: قراءة 20 دقيقة" /></div>
        <div><label>المسار</label><select id="f-cat">${catOptions}</select></div>
        <div class="form-row">
          <div><label>نقاط الخبرة XP</label><input id="f-xp" type="number" min="5" max="100" value="${t ? t.xp : 20}" /></div>
          <div><label>الجزر 🥕</label><input id="f-coins" type="number" min="1" max="50" value="${t ? t.coins : 5}" /></div>
        </div>
        <div><label>طريقة تأكيد الإنجاز</label><select id="f-proof">${proofOptions}</select></div>
        <button class="btn-primary green" onclick="App.saveTask('${taskId || ''}')">حفظ</button>
      </div>`);
  },

  saveTask(taskId) {
    const title = document.getElementById('f-title').value.trim();
    if (!title) { this.toast('اكتب اسم المهمة أولًا'); return; }
    const cat = document.getElementById('f-cat').value;
    const xp = Math.max(5, parseInt(document.getElementById('f-xp').value) || 20);
    const coins = Math.max(1, parseInt(document.getElementById('f-coins').value) || 5);
    const proof = document.getElementById('f-proof').value;
    if (taskId) {
      const t = S.tasks.find(x => x.id === taskId);
      Object.assign(t, { title, cat, xp, coins, proof });
    } else {
      S.tasks.push({ id: uid(), title, cat, xp, coins, proof });
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
      <div class="form-row">
        <div><button class="btn-primary" onclick="App.rewardLibrary()">🎁 أفكار جاهزة</button></div>
        <div><button class="btn-primary green" onclick="App.rewardForm()">✏️ مكافأة مخصصة</button></div>
      </div>`;
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

    // مقارنة هذا الأسبوع بالأسبوع السابق
    let thisWeek = 0, prevWeek = 0;
    for (let i = 0; i < 7; i++) thisWeek += (S.completions[dayKeyOffset(-i)] || []).length;
    for (let i = 7; i < 14; i++) prevWeek += (S.completions[dayKeyOffset(-i)] || []).length;
    let trendHtml = '';
    if (prevWeek > 0) {
      const diff = Math.round((thisWeek - prevWeek) / prevWeek * 100);
      trendHtml = diff >= 0
        ? `<p class="trend up">📈 تحسّن بنسبة ${diff}% عن الأسبوع الماضي (${thisWeek} مقابل ${prevWeek} مهمة)</p>`
        : `<p class="trend down">📉 تراجع بنسبة ${-diff}% عن الأسبوع الماضي — جرّب صندوق مفاجأة لإشعال الحماس!</p>`;
    } else if (thisWeek > 0) {
      trendHtml = `<p class="trend up">🌱 أول أسبوع نشط — ${thisWeek} مهمة منجزة</p>`;
    }

    const lvl = levelOf(S.child.xp);
    document.getElementById('ptab-report').innerHTML = `
      <div class="card">
        <h3>📊 الإنجاز في آخر 7 أيام</h3>
        <div class="chart">${bars}</div>
        ${trendHtml}
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
      const pendingToday = new Set(S.pendingProofs.filter(p => p.date === today).map(p => p.taskId));
      const goldenId = goldenTaskId(today);
      html += '<div class="map-path">';
      S.tasks.forEach((t, i) => {
        const done = doneIds.has(t.id);
        const pending = pendingToday.has(t.id);
        const et = effectiveTask(t, today);
        const side = i % 2 === 0 ? 'side-left' : 'side-right';
        html += `
          <div class="map-node ${side} ${done ? 'done' : ''} ${pending ? 'pending' : ''} ${et.golden && !done && !pending ? 'golden' : ''}">
            <button class="node-circle" onclick="App.completeTask('${t.id}')" ${done || pending ? 'disabled' : ''}>
              ${done ? '⭐' : (pending ? '⏳' : CATEGORIES[t.cat].emoji)}
            </button>
            <div class="node-card">
              <div class="n-title">${et.golden && !done ? '✨ ' : ''}${esc(t.title)}</div>
              <div class="n-reward">${pending ? '👀 بانتظار تأكيد والدك…'
                : `✨ ${et.xp} XP &nbsp; 🥕 ${et.coins}${et.golden ? ' &nbsp; <b style="color:#cf9a1d">مهمة اليوم الذهبية ×2</b>' : ''}${t.proof !== 'self' ? ' &nbsp; ' + PROOF_MODES[t.proof].emoji : ''}`}</div>
            </div>
          </div>
          ${i < S.tasks.length - 1 ? '<div class="path-connector"></div>' : ''}`;
      });
      html += '</div>';
    }

    // مشاركة إنجاز اليوم مع الوالد البعيد
    html += `<button class="btn-primary purple" style="margin-top:6px" onclick="App.shareDayReport()">📤 أرسل إنجاز اليوم لوالدي</button>`;

    document.getElementById('ktab-map').innerHTML = html;
  },

  /* تقرير نصي يُشارك عبر واتساب أو أي تطبيق — للوالد خارج المنزل */
  shareDayReport() {
    const today = todayKey();
    const doneIds = S.completions[today] || [];
    const lines = [`🥕 تقرير ${S.child.name} — ${dayNameOffset(0)} ${today}`, ''];
    for (const t of S.tasks) {
      const pending = S.pendingProofs.some(p => p.taskId === t.id && p.date === today);
      lines.push(`${doneIds.includes(t.id) ? '✅' : (pending ? '⏳ (بانتظار تأكيدك)' : '⬜')} ${t.title}`);
    }
    lines.push('', `⭐ المستوى ${levelOf(S.child.xp)} · 🥕 ${S.child.coins} · 🔥 سلسلة ${S.child.streak} يوم`);
    if (S.pendingProofs.length) lines.push(`🔔 ${S.pendingProofs.length} إثبات بانتظار مراجعتك في التطبيق`);
    const text = lines.join('\n');
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }
  },

  completeTask(taskId) {
    const t = S.tasks.find(x => x.id === taskId);
    if (!t) return;
    const today = todayKey();
    if ((S.completions[today] || []).includes(taskId)) return;
    if (S.pendingProofs.some(p => p.taskId === taskId && p.date === today)) return;

    const et = effectiveTask(t, today); // تضاعف القيم إن كانت المهمة الذهبية
    if (t.proof === 'photo') {
      this.photoProofForm(taskId);
      return;
    }
    if (t.proof === 'parent') {
      this._queueProof(et, null);
      this.celebrate('أرسلنا إنجازك! 📨', `${esc(t.title)}<br /><small>سيصلك الجزر بعد تأكيد والدك 👀</small>`, ['⏳ بانتظار التأكيد'], '📨');
      this.renderKMap();
      return;
    }
    // مهمة ثقة: صرف فوري
    const res = grantCompletion(et, today);
    this._celebrateGrant(et, res);
    this.renderKMap();
    this.refreshKidHeader();
  },

  _queueProof(t, photo) {
    const now = new Date();
    S.pendingProofs.push({
      id: uid(), taskId: t.id, title: t.title + (t.golden ? ' ✨' : ''), cat: t.cat, xp: t.xp, coins: t.coins,
      proof: t.proof, date: todayKey(),
      time: String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'),
      photo: photo || null,
    });
    save();
  },

  _celebrateGrant(t, res) {
    let title = t.golden ? 'مهمة ذهبية! مكافأة مضاعفة ×2 ✨' : 'أحسنت يا بطل!', emoji = t.golden ? '✨' : '🎉', msg = esc(t.title);
    if (res.leveledUp) {
      title = `ترقّيت للمستوى ${res.newLevel}! 🆙`;
      emoji = avatarFor(res.newLevel);
      msg = 'أفاتارك يزداد قوة!';
    } else if (res.allDone) {
      title = 'أنهيت كل مهام اليوم! 🏆';
      emoji = '🏆';
      msg = `مكافأة اليوم الكامل: +${res.bonus} 🥕`;
    }
    this.celebrate(title, msg, [`+${t.xp} ✨ XP`, `+${t.coins + res.bonus} 🥕`], emoji);
  },

  /* ── إثبات بالصورة ── */
  _pendingPhotoTaskId: null,
  _pendingPhotoData: null,

  photoProofForm(taskId) {
    const t = S.tasks.find(x => x.id === taskId);
    if (!t) return;
    this._pendingPhotoTaskId = taskId;
    this._pendingPhotoData = null;
    this.openModal(`
      <h3>📸 إثبات المهمة</h3>
      <p style="font-weight:700;margin-bottom:4px">${esc(t.title)}</p>
      <p class="muted" style="margin-bottom:14px">التقط صورة تُثبت إنجازك (غرفتك المرتبة، دفتر الواجب…) وسيراجعها والدك</p>
      <input type="file" id="f-photo" accept="image/*" capture="environment" style="display:none" onchange="App.photoChosen(this)" />
      <div id="photo-preview" style="margin-bottom:12px"></div>
      <button class="btn-primary" onclick="document.getElementById('f-photo').click()">📷 التقط / اختر صورة</button>
      <button class="btn-primary green" id="photo-submit" style="margin-top:10px;display:none" onclick="App.submitPhotoProof()">إرسال الإثبات للوالد 📨</button>`);
  },

  photoChosen(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    // ضغط الصورة لتناسب مساحة التخزين المحلي
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 480;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      this._pendingPhotoData = canvas.toDataURL('image/jpeg', 0.55);
      URL.revokeObjectURL(url);
      document.getElementById('photo-preview').innerHTML =
        `<img src="${this._pendingPhotoData}" style="width:100%;border-radius:14px;border:3px solid var(--green)" alt="صورة الإثبات" />`;
      document.getElementById('photo-submit').style.display = 'block';
    };
    img.src = url;
  },

  submitPhotoProof() {
    const t = S.tasks.find(x => x.id === this._pendingPhotoTaskId);
    if (!t || !this._pendingPhotoData) return;
    this._queueProof(effectiveTask(t, todayKey()), this._pendingPhotoData);
    this._pendingPhotoTaskId = null;
    this._pendingPhotoData = null;
    this.closeModal();
    this.celebrate('أرسلنا صورتك! 📸', `${esc(t.title)}<br /><small>سيصلك الجزر بعد مراجعة والدك 👀</small>`, ['⏳ بانتظار المراجعة'], '📨');
    this.renderKMap();
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
