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

/* مكتبة شخصيات الأفاتار — تُفتح بالمستويات */
const AVATAR_BASES = [
  { e: '🐣', lvl: 1 }, { e: '🐱', lvl: 1 }, { e: '🐰', lvl: 1 }, { e: '🐹', lvl: 1 },
  { e: '🦊', lvl: 2 }, { e: '🐸', lvl: 2 }, { e: '🐼', lvl: 3 }, { e: '🐨', lvl: 3 },
  { e: '🦁', lvl: 4 }, { e: '🐯', lvl: 4 }, { e: '🦖', lvl: 5 }, { e: '🦄', lvl: 6 },
  { e: '🦅', lvl: 7 }, { e: '🦸', lvl: 8 }, { e: '🧙', lvl: 10 }, { e: '🐉', lvl: 12 },
];
const AVATAR_BGS = ['#ffe3c4', '#d6ecff', '#dff5e4', '#f3e3ff', '#ffe0ec', '#fff6c9'];

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
  { id: 'first_task',   emoji: '🌟', name: 'أول خطوة',      desc: 'أنجزت أول مهمة!',              check: c => totalCompletions(c) >= 1 },
  { id: 'ten_tasks',    emoji: '💪', name: 'عشرة أبطال',    desc: 'أنجزت 10 مهام',                 check: c => totalCompletions(c) >= 10 },
  { id: 'fifty_tasks',  emoji: '🏆', name: 'نجم الإنجاز',   desc: 'أنجزت 50 مهمة',                 check: c => totalCompletions(c) >= 50 },
  { id: 'streak_3',     emoji: '🔥', name: 'شعلة النشاط',   desc: '3 أيام متتالية',                check: c => c.bestStreak >= 3 },
  { id: 'streak_7',     emoji: '🌋', name: 'بركان الهمّة',  desc: '7 أيام متتالية',                check: c => c.bestStreak >= 7 },
  { id: 'reader',       emoji: '📖', name: 'بطل القراءة',   desc: '10 مهام دراسية',                check: c => catCompletions(c, 'study') >= 10 },
  { id: 'athlete',      emoji: '🏅', name: 'سيد اللياقة',   desc: '10 مهام رياضية',                check: c => catCompletions(c, 'sport') >= 10 },
  { id: 'healthy',      emoji: '🥗', name: 'حارس الصحة',    desc: '10 عادات صحية',                 check: c => catCompletions(c, 'health') >= 10 },
  { id: 'boss_slayer',  emoji: '⚔️', name: 'قاهر الوحوش',   desc: 'هزمتم زعيمًا عائليًا',          check: () => S.bossesDefeated >= 1 },
  { id: 'rich',         emoji: '💰', name: 'كنز الجزر',     desc: 'جمعت 100 جزرة',                 check: c => c.lifetimeCoins >= 100 },
];

/* ─────────────── الحالة الافتراضية ─────────────── */

function defaultTasks() {
  return [
    { id: uid(), title: 'إنهاء الواجبات المدرسية', cat: 'study',  xp: 30, coins: 10, proof: 'photo'  },
    { id: uid(), title: 'قراءة 20 دقيقة',          cat: 'study',  xp: 20, coins: 8,  proof: 'parent' },
    { id: uid(), title: 'حركة ونشاط 30 دقيقة',     cat: 'sport',  xp: 25, coins: 8,  proof: 'parent' },
    { id: uid(), title: 'ترتيب الغرفة',            cat: 'health', xp: 15, coins: 5,  proof: 'photo'  },
    { id: uid(), title: 'شرب 6 أكواب ماء',         cat: 'health', xp: 10, coins: 4,  proof: 'self'   },
    { id: uid(), title: 'النوم مبكرًا 😴',          cat: 'health', xp: 20, coins: 6,  proof: 'self'   },
  ];
}

/* ملف طفل كامل — كل بيانات الطفل معزولة تحت حسابه */
function defaultChild(name, avatarBase, avatarBg) {
  return {
    id: uid(),
    name: name || 'البطل',
    username: 'hero_' + uid().slice(0, 5),   // اسم مستخدم فريد — لبطاقة QR والمزامنة مستقبلًا
    avatar: { base: avatarBase || '🐣', bg: avatarBg || AVATAR_BGS[0] },
    xp: 0, coins: 0, lifetimeCoins: 0, hp: 100,
    streak: 0, bestStreak: 0, lastFullDay: null,
    gear: [], equipped: [],
    tasks: defaultTasks(),
    completions: {},       // { 'YYYY-MM-DD': [taskId, ...] }
    pendingProofs: [],     // { id, taskId, title, cat, xp, coins, proof, date, time, photo|null }
    unseenApprovals: [],
    redemptions: [],       // { id, rewardId, title, cost, date, status }
    mysteryBox: null,
    lastHpDay: todayKey(),
    lastDailyChest: null,
    autopilot: { enabled: false, goals: ['study', 'sport', 'health'], count: 4, lastGen: null },
    taskArchive: {},
  };
}

function defaultState() {
  const first = defaultChild('البطل');
  return {
    v: 2,
    pin: null,
    children: [first],
    activeChildId: first.id,
    joinRequests: [],      // طلبات انضمام أرسلها أطفال بانتظار موافقة الوالد
    rewards: [
      { id: uid(), emoji: '🎮', title: 'نصف ساعة لعب إضافية', cost: 25 },
      { id: uid(), emoji: '🌳', title: 'مشوار إلى الحديقة',    cost: 60 },
      { id: uid(), emoji: '🍕', title: 'اختيار وجبة العشاء',   cost: 40 },
      { id: uid(), emoji: '🎬', title: 'سهرة فيلم عائلي',      cost: 70 },
    ],
    boss: null,
    bossesDefeated: 0,
  };
}

/* الطفل النشط حاليًا (الذي سجل دخوله أو يعرضه الوالد) */
function C() {
  return S.children.find(c => c.id === S.activeChildId) || S.children[0];
}
function heroFace(c) { return (c && c.avatar && c.avatar.base) || '🐣'; }
function heroBg(c) { return (c && c.avatar && c.avatar.bg) || AVATAR_BGS[0]; }

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
  for (const [id, c] of Object.entries(s.taskArchive || {})) if (c === cat) ids.add(id);
  let n = 0;
  for (const arr of Object.values(s.completions)) n += arr.filter(id => ids.has(id)).length;
  return n;
}

function strHash(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) % 1000003;
  return h;
}

/* ─── المساعد الآلي: توليد مهام اليوم من المكتبة حسب أهداف الوالد ─── */
function runAutopilot(force) {
  const ap = C().autopilot;
  if (!ap.enabled) return;
  const today = todayKey();
  if (!force && ap.lastGen === today) return;

  // أرشفة مهام الأيام السابقة الآلية وإزالتها (المهام اليدوية ومهام المعلم تبقى)
  C().tasks = C().tasks.filter(t => {
    if (t.auto) { C().taskArchive[t.id] = t.cat; return false; }
    return true;
  });

  const manualTitles = new Set(C().tasks.map(t => t.title));
  const pool = TASK_LIBRARY.filter(t => ap.goals.includes(t.cat) && !manualTitles.has(t.title));
  // ترتيب حتمي متغير يوميًا — تنويع تلقائي مع ضمان تغطية الأهداف المختارة
  pool.sort((a, b) => strHash(a.title + today) - strHash(b.title + today));
  const picked = [];
  for (const goal of ap.goals) {           // مهمة واحدة على الأقل من كل هدف
    const t = pool.find(x => x.cat === goal && !picked.includes(x));
    if (t && picked.length < ap.count) picked.push(t);
  }
  for (const t of pool) {                  // إكمال العدد المطلوب
    if (picked.length >= ap.count) break;
    if (!picked.includes(t)) picked.push(t);
  }
  for (const t of picked) C().tasks.push({ id: uid(), ...t, auto: true });

  ap.lastGen = today;
  save();
}
/* المهمة الذهبية: مهمة مختلفة كل يوم بمكافأة مضاعفة — اختيار ثابت طوال اليوم */
function goldenTaskId(dateKey) {
  if (!C().tasks.length) return null;
  let h = 0;
  for (const ch of dateKey) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  return C().tasks[h % C().tasks.length].id;
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
/* الشخصيات المتاحة لمستوى معين */
function unlockedBases(level) {
  return AVATAR_BASES.filter(b => level >= b.lvl);
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
      const old = JSON.parse(raw);
      if (old.v === 2 && Array.isArray(old.children)) {
        const s = Object.assign(defaultState(), old);
        if (!s.children.length) s.children = [defaultChild('البطل')];
        s.children = s.children.map(c => Object.assign(defaultChild(), c));
        s.joinRequests = s.joinRequests || [];
        return s;
      }
      // ترحيل النسخة القديمة (طفل واحد) → v2
      if (old.child) {
        const c = defaultChild(old.child.name || 'البطل');
        Object.assign(c, old.child);
        c.tasks = old.tasks || c.tasks;
        c.tasks.forEach(t => { if (!t.proof) t.proof = 'self'; });
        c.completions = old.completions || {};
        c.pendingProofs = old.pendingProofs || [];
        c.unseenApprovals = old.unseenApprovals || [];
        c.redemptions = old.redemptions || [];
        c.mysteryBox = old.mysteryBox || null;
        c.lastHpDay = old.lastHpDay || todayKey();
        c.lastDailyChest = old.lastDailyChest || null;
        c.autopilot = old.autopilot || c.autopilot;
        c.taskArchive = old.taskArchive || {};
        const s = defaultState();
        s.pin = old.pin || null;
        s.children = [c];
        s.activeChildId = c.id;
        s.rewards = old.rewards || s.rewards;
        s.boss = old.boss || null;
        s.bossesDefeated = old.bossesDefeated || 0;
        return s;
      }
    }
  } catch (e) { /* بيانات تالفة → نبدأ من جديد */ }
  return defaultState();
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
  } catch (e) {
    // امتلأت مساحة التخزين (غالبًا بسبب صور الإثبات) → نحذف أقدم الصور ونعيد المحاولة
    for (const p of C().pendingProofs) { if (p.photo) { p.photo = null; break; } }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch (e2) { /* تجاهل */ }
  }
  // رفع التغيير للسحابة إن كانت المزامنة مفعلة
  if (typeof Sync !== 'undefined' && Sync.isConfigured()) Sync.pushSoon();
}

const PROOF_MODES = {
  self:   { emoji: '🤝', name: 'ثقة — يؤكد البطل بنفسه',   short: 'ثقة' },
  parent: { emoji: '👀', name: 'تأكيد الوالد قبل الصرف',    short: 'تأكيد الوالد' },
  photo:  { emoji: '📸', name: 'إثبات بصورة يراجعها الوالد', short: 'صورة إثبات' },
};

/* عند بداية كل يوم ولكل طفل: خصم الصحة عن الأيام الفائتة، كسر السلسلة، وتوليد مهام المساعد الآلي */
function dailyUpkeep() {
  const today = todayKey();
  const orig = S.activeChildId;
  for (const child of S.children) {
    S.activeChildId = child.id;   // C() تشير مؤقتًا لهذا الطفل
    if (child.lastHpDay !== today) {
      const last = new Date(child.lastHpDay + 'T00:00:00');
      const now = new Date(today + 'T00:00:00');
      const missedDays = Math.min(7, Math.round((now - last) / 86400000));
      const healthIds = new Set(child.tasks.filter(t => t.cat === 'health').map(t => t.id));
      for (let i = 1; i <= missedDays; i++) {
        const d = new Date(last); d.setDate(d.getDate() + i);
        const key = todayKey(d);
        if (key === today) break;
        const done = (child.completions[key] || []).some(id => healthIds.has(id));
        if (!done && healthIds.size > 0) child.hp = Math.max(10, child.hp - 15);
      }
      child.lastHpDay = today;
    }
    if (child.lastFullDay && child.lastFullDay !== today && child.lastFullDay !== dayKeyOffset(-1)) {
      child.streak = 0;
    }
    runAutopilot(false);
  }
  S.activeChildId = orig;
  save();
}

/* ─── رموز المشاركة (مهام ومكافآت المعلمين) ─── */
function encodeShareCode(obj) {
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/=+$/, '');
  return 'JZR1.' + b64 + '.' + (strHash(b64) % 46655).toString(36).padStart(3, '0');
}
function decodeShareCode(code) {
  try {
    const m = String(code).trim().match(/JZR1\.([A-Za-z0-9+/]+)\.([a-z0-9]{3})/);
    if (!m) return null;
    if ((strHash(m[1]) % 46655).toString(36).padStart(3, '0') !== m[2]) return null;
    const obj = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
    if (!obj || !obj.t || !obj.n) return null;
    return obj;
  } catch (e) { return null; }
}

/* منح مكافآت إنجاز مهمة وتسجيلها — يُستدعى فورًا (مهام الثقة) أو عند موافقة الوالد */
function grantCompletion(t, dateKey) {
  C().completions[dateKey] = C().completions[dateKey] || [];
  if (C().completions[dateKey].includes(t.id)) return { bonus: 0, allDone: false, leveledUp: false, newLevel: levelOf(C().xp) };
  C().completions[dateKey].push(t.id);

  const prevLevel = levelOf(C().xp);
  C().xp += t.xp;
  C().coins += t.coins;
  C().lifetimeCoins += t.coins;
  if (t.cat === 'health') C().hp = Math.min(100, C().hp + 10);

  // السلسلة: أول إنجاز في يومه يمددها
  if (C().lastFullDay !== dateKey) {
    const dayBefore = new Date(dateKey + 'T00:00:00');
    dayBefore.setDate(dayBefore.getDate() - 1);
    C().streak = (C().lastFullDay === todayKey(dayBefore)) ? C().streak + 1 : 1;
    C().bestStreak = Math.max(C().bestStreak, C().streak);
    C().lastFullDay = dateKey;
  }

  // مكافأة إتمام كل مهام اليوم (لليوم الحالي فقط)
  let bonus = 0, allDone = false;
  if (dateKey === todayKey()) {
    allDone = C().tasks.length > 0 && C().tasks.every(x => (C().completions[dateKey] || []).includes(x.id));
    if (allDone) { bonus = 10; C().coins += bonus; C().lifetimeCoins += bonus; }
  }

  save();
  const newLevel = levelOf(C().xp);
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

  /* شاشة اختيار البطل — تسجيل دخول الأطفال */
  enterKid() {
    dailyUpkeep();
    this.renderChildSelect();
    this.showScreen('screen-childselect');
  },

  renderChildSelect() {
    const grid = document.getElementById('childselect-grid');
    grid.innerHTML = S.children.map(c => `
      <button class="cs-card" onclick="App.enterKidAs('${c.id}')">
        <span class="cs-avatar" style="background:${heroBg(c)}">${heroFace(c)}</span>
        <span class="cs-name">${esc(c.name)}</span>
        <span class="cs-level">⭐ المستوى ${levelOf(c.xp)}</span>
      </button>`).join('') ||
      '<p class="muted" style="grid-column:1/-1;text-align:center">لا يوجد أبطال بعد — اطلب من والدك إضافتك!</p>';
  },

  joinRequestForm() {
    this.openModal(`
      <h3>🙋 طلب انضمام</h3>
      <p class="muted" style="margin-bottom:12px">اكتب اسمك وسيصل الطلب إلى لوحة والدك — هو وحده من يستطيع إنشاء حسابك</p>
      <div class="form-grid">
        <div><label>اسمك</label><input id="f-joinname" placeholder="مثال: سلطان" /></div>
        <button class="btn-primary" onclick="App.submitJoinRequest()">أرسل الطلب 📨</button>
      </div>`);
  },

  submitJoinRequest() {
    const name = document.getElementById('f-joinname').value.trim();
    if (!name) { this.toast('اكتب اسمك أولًا'); return; }
    if (S.joinRequests.some(r => r.name === name)) { this.toast('طلبك موجود — بانتظار موافقة والدك ⏳'); this.closeModal(); return; }
    S.joinRequests.push({ id: uid(), name, date: todayKey() });
    save();
    this.closeModal();
    this.celebrate('أرسلنا طلبك! 📨', `يا ${esc(name)}، سيظهر طلبك في لوحة والدك ليعتمد حسابك`, ['⏳ بانتظار الموافقة'], '🙋');
  },

  enterKidAs(childId) {
    S.activeChildId = childId;
    save();
    this.showScreen('screen-kid');
    this.kidTab('map');
    this.refreshKidHeader();
    // موافقات وصلت أثناء غياب الطفل عن الشاشة
    if (C().unseenApprovals.length) {
      const items = C().unseenApprovals;
      const totalCoins = items.reduce((a, x) => a + x.coins, 0);
      const totalXp = items.reduce((a, x) => a + x.xp, 0);
      const list = items.map(x => `⭐ ${esc(x.title)}`).join('<br />');
      C().unseenApprovals = [];
      save();
      this.celebrate('والدك اعتمد إنجازك! 🎊', list, [`+${totalXp} ✨ XP`, `+${totalCoins} 🥕`], '👏');
      this.refreshKidHeader();
      this.renderKMap();
    } else if (C().lastDailyChest !== todayKey()) {
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
    if (C().lastDailyChest === todayKey()) { this.closeModal(); return; }
    C().lastDailyChest = todayKey();
    const base = 2 + Math.floor(Math.random() * 4); // 2–5 جزرات
    let streakBonus = 0;
    if (C().streak >= 30) streakBonus = 20;
    else if (C().streak >= 14) streakBonus = 10;
    else if (C().streak >= 7) streakBonus = 7;
    else if (C().streak >= 3) streakBonus = 3;
    const total = base + streakBonus;
    C().coins += total;
    C().lifetimeCoins += total;
    save();
    this.closeModal();
    const gains = [`+${base} 🥕`];
    if (streakBonus) gains.push(`+${streakBonus} 🥕 مكافأة السلسلة 🔥`);
    const goldenT = C().tasks.find(t => t.id === goldenTaskId(todayKey()));
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
    this.renderChildSwitcher();
    this.parentTab('tasks');
    this.refreshParentSubtitle();
  },

  refreshParentSubtitle() {
    const today = todayKey();
    const done = (C().completions[today] || []).length;
    const pending = C().pendingProofs.length;
    const requests = S.joinRequests.length;
    document.getElementById('parent-subtitle').textContent =
      `${C().name} أنجز اليوم ${done} من ${C().tasks.length} مهام` +
      (pending ? ` · 🔔 ${pending} إثبات بانتظارك` : '') +
      (requests ? ` · 🙋 ${requests} طلب انضمام` : '');
  },

  /* شريط تبديل الأطفال — يحدد أي طفل تديره اللوحة الآن */
  renderChildSwitcher() {
    const bar = document.getElementById('child-switcher');
    if (S.children.length < 2) { bar.innerHTML = ''; bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    bar.innerHTML = S.children.map(c => `
      <button class="child-chip ${c.id === S.activeChildId ? 'active' : ''}" onclick="App.switchChild('${c.id}')">
        <span style="background:${heroBg(c)}">${heroFace(c)}</span>${esc(c.name)}
      </button>`).join('');
  },

  switchChild(childId) {
    S.activeChildId = childId;
    save();
    this.renderChildSwitcher();
    this.parentTab(document.querySelector('.ptab.active').dataset.ptab);
    this.refreshParentSubtitle();
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
    const doneIds = new Set(C().completions[today] || []);
    const pendingIds = new Set(C().pendingProofs.map(p => p.taskId + '|' + p.date));

    // قائمة مراجعة الإثباتات المعلقة
    const reviewHtml = C().pendingProofs.length ? `
      <div class="card" style="border:3px solid var(--gold)">
        <h3>🔔 إثباتات بانتظار مراجعتك (${C().pendingProofs.length})</h3>
        ${C().pendingProofs.map(p => `
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

    // بطاقة المساعد الآلي
    const ap = C().autopilot;
    const autoCount = C().tasks.filter(t => t.auto).length;
    const apHtml = ap.enabled ? `
      <div class="card autopilot-card on">
        <h3>🤖 المساعد الآلي يعمل</h3>
        <p class="muted">ولّد اليوم ${autoCount} مهام من أهدافك: ${ap.goals.map(g => CATEGORIES[g].emoji).join(' ')} — يجدد المهام تلقائيًا كل صباح</p>
        <div class="form-row" style="margin-top:10px">
          <div><button class="btn-ghost" style="width:100%" onclick="App.autopilotForm()">⚙️ الأهداف</button></div>
          <div><button class="btn-ghost" style="width:100%" onclick="App.autopilotToggle(false)">إيقاف</button></div>
        </div>
      </div>` : `
      <div class="card autopilot-card">
        <h3>🤖 مشغول؟ فعّل المساعد الآلي</h3>
        <p class="muted">حدد الأهداف مرة واحدة، وسيولّد التطبيق مهام يومية متنوعة من المكتبة ويجددها كل صباح — أنت فقط تتابع التقارير</p>
        <button class="btn-primary purple" style="margin-top:10px" onclick="App.autopilotForm()">تفعيل المساعد ⚡</button>
      </div>`;

    const rows = C().tasks.map(t => {
      const state = doneIds.has(t.id) ? '✅ ' : (pendingIds.has(t.id + '|' + today) ? '⏳ ' : '');
      const source = t.teacher ? ` · 🏫 موثقة من ${esc(t.teacher)}` : (t.auto ? ' · 🤖 آلية' : '');
      return `
      <div class="task-row">
        <span class="task-cat">${CATEGORIES[t.cat].emoji}</span>
        <div class="task-info">
          <div class="t-title">${state}${esc(t.title)}</div>
          <div class="t-meta">${CATEGORIES[t.cat].name} · ${t.xp} XP · ${t.coins} 🥕 · ${PROOF_MODES[t.proof].emoji} ${PROOF_MODES[t.proof].short}${source}</div>
        </div>
        <div class="task-actions">
          <button class="icon-btn" title="تعديل" onclick="App.taskForm('${t.id}')">✏️</button>
          <button class="icon-btn" title="حذف" onclick="App.deleteTask('${t.id}')">🗑️</button>
        </div>
      </div>`;
    }).join('');

    document.getElementById('ptab-tasks').innerHTML = `
      ${reviewHtml}
      ${apHtml}
      <div class="card">
        <h3>مهام اليوم (${C().tasks.length})</h3>
        ${rows || '<p class="muted">لا توجد مهام بعد — أضف أول مهمة!</p>'}
      </div>
      <div class="form-row">
        <div><button class="btn-primary" onclick="App.taskLibrary()">📚 أضف من المكتبة</button></div>
        <div><button class="btn-primary green" onclick="App.taskForm()">✏️ مهمة مخصصة</button></div>
      </div>
      <button class="btn-primary purple" style="margin-top:10px" onclick="App.importCodeForm()">🏫 إضافة رمز من المعلم</button>
      <div class="card tip-card" style="margin-top:14px">
        <h3>💡 نصيحة اليوم</h3>
        <p>${PARENT_TIPS[dayOfYear() % PARENT_TIPS.length]}</p>
      </div>
      <div class="card">
        <h3>🎁 إسقاط صندوق مفاجأة</h3>
        <p class="muted" style="margin-bottom:10px">كافئ أداءً مميزًا غير متوقع بصندوق يظهر في خريطة ${esc(C().name)}</p>
        ${C().mysteryBox
          ? `<p class="pill">📦 صندوق بانتظار الفتح: ${esc(C().mysteryBox.prize)} (+${C().mysteryBox.coins} 🥕)</p>`
          : `<button class="btn-primary purple" onclick="App.mysteryForm()">إسقاط صندوق 📦</button>`}
      </div>`;
  },

  /* ── المساعد الآلي (الوالد الافتراضي) ── */
  autopilotForm() {
    const ap = C().autopilot;
    const goalChecks = Object.entries(CATEGORIES).map(([k, c]) => `
      <label class="goal-check">
        <input type="checkbox" value="${k}" ${ap.goals.includes(k) ? 'checked' : ''} />
        <span>${c.emoji} ${c.name}</span>
      </label>`).join('');
    const countOptions = [3, 4, 5, 6].map(n =>
      `<option value="${n}" ${ap.count === n ? 'selected' : ''}>${n} مهام يوميًا</option>`).join('');
    this.openModal(`
      <h3>🤖 أهداف المساعد الآلي</h3>
      <p class="muted" style="margin-bottom:12px">اختر العادات التي تريد بناءها — وسيولّد المساعد مهام يومية متنوعة منها كل صباح</p>
      <div class="form-grid">
        <div id="ap-goals">${goalChecks}</div>
        <div><label>عدد المهام اليومية</label><select id="ap-count">${countOptions}</select></div>
        <button class="btn-primary purple" onclick="App.saveAutopilot()">حفظ وتشغيل ⚡</button>
      </div>`);
  },

  saveAutopilot() {
    const goals = Array.from(document.querySelectorAll('#ap-goals input:checked')).map(i => i.value);
    if (!goals.length) { this.toast('اختر هدفًا واحدًا على الأقل'); return; }
    C().autopilot.goals = goals;
    C().autopilot.count = parseInt(document.getElementById('ap-count').value) || 4;
    C().autopilot.enabled = true;
    runAutopilot(true);       // توليد فوري لليوم
    this.closeModal();
    this.renderPTasks();
    this.toast('المساعد الآلي يعمل — مهام اليوم جاهزة 🤖✅');
  },

  autopilotToggle(on) {
    C().autopilot.enabled = on;
    if (!on) {
      // إزالة المهام الآلية غير المنجزة عند الإيقاف
      C().tasks = C().tasks.filter(t => {
        if (t.auto) { C().taskArchive[t.id] = t.cat; return false; }
        return true;
      });
      C().autopilot.lastGen = null;
    }
    save();
    this.renderPTasks();
    this.toast(on ? 'تم التشغيل 🤖' : 'توقف المساعد الآلي');
  },

  /* ── مكتبة المهام الجاهزة ── */
  _libFilter: 'all',

  taskLibrary(filter) {
    this._libFilter = filter || this._libFilter || 'all';
    const f = this._libFilter;
    const chips = [`<button class="lib-chip ${f === 'all' ? 'active' : ''}" onclick="App.taskLibrary('all')">الكل</button>`]
      .concat(Object.entries(CATEGORIES).map(([k, c]) =>
        `<button class="lib-chip ${f === k ? 'active' : ''}" onclick="App.taskLibrary('${k}')">${c.emoji} ${c.name}</button>`)).join('');
    const existing = new Set(C().tasks.map(t => t.title));
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
    if (!t || C().tasks.some(x => x.title === t.title)) return;
    C().tasks.push({ id: uid(), ...t });
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
    const p = C().pendingProofs.find(x => x.id === id);
    if (!p) return;
    C().pendingProofs = C().pendingProofs.filter(x => x.id !== id);
    // نمنح المكافآت بهوية المهمة الأصلية وتاريخ الإنجاز الأصلي
    const taskLike = { id: p.taskId, cat: p.cat, xp: p.xp, coins: p.coins };
    grantCompletion(taskLike, p.date);
    C().unseenApprovals.push({ title: p.title, xp: p.xp, coins: p.coins });
    save();
    this.renderPTasks();
    this.toast(`تم الاعتماد — وصل ${p.coins} 🥕 إلى ${C().name} ✅`);
  },

  rejectProof(id) {
    const p = C().pendingProofs.find(x => x.id === id);
    if (!p) return;
    if (!confirm(`رفض إثبات "${p.title}"؟ ستعود المهمة متاحة في خريطة ${C().name}`)) return;
    C().pendingProofs = C().pendingProofs.filter(x => x.id !== id);
    save();
    this.renderPTasks();
    this.toast('تم الرفض — عادت المهمة إلى الخريطة');
  },

  zoomPhoto(proofId) {
    const p = C().pendingProofs.find(x => x.id === proofId);
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
    const t = taskId ? C().tasks.find(x => x.id === taskId) : null;
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
      const t = C().tasks.find(x => x.id === taskId);
      Object.assign(t, { title, cat, xp, coins, proof });
    } else {
      C().tasks.push({ id: uid(), title, cat, xp, coins, proof });
    }
    save();
    this.closeModal();
    this.renderPTasks();
    this.toast('تم الحفظ ✅');
  },

  deleteTask(taskId) {
    if (!confirm('حذف هذه المهمة؟')) return;
    C().tasks = C().tasks.filter(t => t.id !== taskId);
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
    C().mysteryBox = { prize, coins: Math.max(0, parseInt(document.getElementById('f-mcoins').value) || 0) };
    save();
    this.closeModal();
    this.renderPTasks();
    this.toast('تم إسقاط الصندوق في الخريطة! 📦');
  },

  /* ── تبويب المكافآت ── */
  renderPRewards() {
    const pending = C().redemptions.filter(r => r.status === 'pending');
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
        <div class="task-info"><div class="t-title">${esc(r.title)}</div><div class="t-meta">${r.cost} 🥕${r.teacher ? ' · 🏫 موثقة من ' + esc(r.teacher) : ''}</div></div>
        <div class="task-actions">
          <button class="icon-btn" onclick="App.rewardForm('${r.id}')">✏️</button>
          <button class="icon-btn" onclick="App.deleteReward('${r.id}')">🗑️</button>
        </div>
      </div>`).join('');

    document.getElementById('ptab-rewards').innerHTML = `
      ${pendingHtml}
      <div class="card">
        <h3>خزنة مكافآت العائلة</h3>
        <p class="muted" style="margin-bottom:8px">جوائز واقعية يشتريها ${esc(C().name)} بالجزر 🥕</p>
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
    const r = C().redemptions.find(x => x.id === id);
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
      const n = (C().completions[dayKeyOffset(-i)] || []).length;
      days.push({ label: i === 0 ? 'اليوم' : dayNameOffset(-i), n });
      maxDone = Math.max(maxDone, n);
    }
    for (const d of days) {
      bars += `<div class="bar-col"><div class="bar" style="height:${Math.round(d.n / maxDone * 100)}%"></div><span class="bar-label">${d.label}</span></div>`;
    }

    const catStats = Object.entries(CATEGORIES).map(([k, c]) =>
      `<span class="pill">${c.emoji} ${c.name}: <b>${catCompletions(C(), k)}</b></span>`).join('');

    // مقارنة هذا الأسبوع بالأسبوع السابق
    let thisWeek = 0, prevWeek = 0;
    for (let i = 0; i < 7; i++) thisWeek += (C().completions[dayKeyOffset(-i)] || []).length;
    for (let i = 7; i < 14; i++) prevWeek += (C().completions[dayKeyOffset(-i)] || []).length;
    let trendHtml = '';
    if (prevWeek > 0) {
      const diff = Math.round((thisWeek - prevWeek) / prevWeek * 100);
      trendHtml = diff >= 0
        ? `<p class="trend up">📈 تحسّن بنسبة ${diff}% عن الأسبوع الماضي (${thisWeek} مقابل ${prevWeek} مهمة)</p>`
        : `<p class="trend down">📉 تراجع بنسبة ${-diff}% عن الأسبوع الماضي — جرّب صندوق مفاجأة لإشعال الحماس!</p>`;
    } else if (thisWeek > 0) {
      trendHtml = `<p class="trend up">🌱 أول أسبوع نشط — ${thisWeek} مهمة منجزة</p>`;
    }

    const lvl = levelOf(C().xp);
    document.getElementById('ptab-report').innerHTML = `
      <div class="card">
        <h3>📊 الإنجاز في آخر 7 أيام</h3>
        <div class="chart">${bars}</div>
        ${trendHtml}
      </div>
      <div class="card">
        <h3>نظرة عامة على ${esc(C().name)}</h3>
        <div class="pill-list" style="margin-bottom:12px">
          <span class="pill">⭐ المستوى <b>${lvl}</b></span>
          <span class="pill">✨ ${C().xp} XP</span>
          <span class="pill">🥕 الرصيد <b>${C().coins}</b></span>
          <span class="pill">🔥 السلسلة <b>${C().streak}</b> يوم</span>
          <span class="pill">❤️ الصحة ${C().hp}%</span>
          <span class="pill">✅ إجمالي المهام <b>${totalCompletions(C())}</b></span>
        </div>
        <h3 style="margin-top:6px">حسب المسار</h3>
        <div class="pill-list">${catStats}</div>
      </div>
      <button class="btn-primary purple" onclick="App.shareWeeklyReport()">📤 مشاركة تقرير الأسبوع (واتساب)</button>`;
  },

  /* تقرير أسبوعي نصي جاهز — للوالد المشغول أو لمشاركته مع الطرف الآخر */
  shareWeeklyReport() {
    let week = 0;
    const dayLines = [];
    for (let i = 6; i >= 0; i--) {
      const n = (C().completions[dayKeyOffset(-i)] || []).length;
      week += n;
      dayLines.push(`${i === 0 ? 'اليوم' : dayNameOffset(-i)}: ${n ? '✅'.repeat(Math.min(n, 8)) : '—'}`);
    }
    const catLines = Object.entries(CATEGORIES)
      .map(([k, c]) => `${c.emoji} ${c.name}: ${catCompletions(C(), k)}`).join('\n');
    const lines = [
      `🥕 تقرير ${C().name} الأسبوعي — جَزَرة`,
      `⭐ المستوى ${levelOf(C().xp)} · ✨ ${C().xp} XP · 🥕 ${C().coins} · 🔥 سلسلة ${C().streak} يوم`,
      '', `📅 آخر 7 أيام (${week} مهمة):`, ...dayLines,
      '', '📊 الإجمالي حسب المسار:', catLines,
    ];
    if (C().pendingProofs.length) lines.push('', `🔔 ${C().pendingProofs.length} إثبات بانتظار المراجعة`);
    const text = lines.join('\n');
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  },

  /* ── تبويب الإعدادات: إدارة حسابات الأطفال ── */
  renderPSettings() {
    // طلبات الانضمام المعلقة
    const requestsHtml = S.joinRequests.length ? `
      <div class="card" style="border:3px solid var(--gold)">
        <h3>🙋 طلبات انضمام بانتظارك (${S.joinRequests.length})</h3>
        ${S.joinRequests.map(r => `
          <div class="task-row">
            <span class="task-cat">🙋</span>
            <div class="task-info"><div class="t-title">${esc(r.name)}</div><div class="t-meta">طلب إنشاء حساب · ${r.date}</div></div>
            <div class="task-actions">
              <button class="icon-btn" style="background:#e2f5ea" title="إنشاء الحساب" onclick="App.approveJoinRequest('${r.id}')">✅</button>
              <button class="icon-btn" title="تجاهل" onclick="App.dismissJoinRequest('${r.id}')">✕</button>
            </div>
          </div>`).join('')}
      </div>` : '';

    const childrenHtml = S.children.map(c => `
      <div class="task-row">
        <span class="cs-avatar small" style="background:${heroBg(c)}">${heroFace(c)}</span>
        <div class="task-info">
          <div class="t-title">${esc(c.name)}</div>
          <div class="t-meta" dir="ltr" style="text-align:right">@${esc(c.username)} · ⭐ ${levelOf(c.xp)} · 🥕 ${c.coins}</div>
        </div>
        <div class="task-actions">
          <button class="icon-btn" title="بطاقة البطل QR" onclick="App.childCard('${c.id}')">🪪</button>
          <button class="icon-btn" title="تعديل" onclick="App.childForm('${c.id}')">✏️</button>
          <button class="icon-btn" title="حذف" onclick="App.deleteChild('${c.id}')">🗑️</button>
        </div>
      </div>`).join('');

    // بطاقة المزامنة السحابية
    let cloudHtml;
    if (typeof Sync !== 'undefined' && Sync.isConfigured()) {
      cloudHtml = `
      <div class="card cloud-card on">
        <h3>☁️ المزامنة السحابية تعمل</h3>
        <p class="muted">${Sync.statusText()}${Sync.lastError ? ' · ⚠️ ' + esc(Sync.lastError) : ''}</p>
        ${Sync.cfg.familyCode ? `
          <div class="family-code-box">
            <span class="muted">رمز العائلة — تدخله أجهزة الأطفال</span>
            <div class="family-code" dir="ltr">${esc(Sync.cfg.familyCode)}</div>
          </div>
          <div class="form-row" style="margin-top:10px">
            <div><button class="btn-primary" onclick="App.shareFamilyCode()">💬 أرسل الرمز واتساب</button></div>
            <div><button class="btn-primary green" onclick="App.syncNow()">🔄 مزامنة الآن</button></div>
          </div>` : ''}
        <button class="btn-ghost" style="width:100%;margin-top:10px" onclick="App.cloudLogout()">تسجيل الخروج من السحابة</button>
      </div>`;
    } else {
      cloudHtml = `
      <div class="card cloud-card">
        <h3>☁️ فعّل المزامنة السحابية</h3>
        <p class="muted" style="margin-bottom:10px">تابع من جوالك أينما كنت، وامنح كل طفل جهازه — البيانات تتزامن لحظيًا بين الأجهزة</p>
        <div class="form-grid">
          <div><label>البريد الإلكتروني</label><input id="f-cloudemail" type="email" dir="ltr" placeholder="you@example.com" /></div>
          <div><label>كلمة المرور (6 أحرف فأكثر)</label><input id="f-cloudpass" type="password" dir="ltr" /></div>
          <div class="form-row">
            <div><button class="btn-primary purple" onclick="App.cloudSignup()">إنشاء حساب</button></div>
            <div><button class="btn-primary green" onclick="App.cloudLogin()">دخول</button></div>
          </div>
          <button class="btn-ghost" onclick="App.cloudCheck()">🔌 فحص الاتصال بالخادم</button>
          <p id="cloud-msg" class="muted" style="min-height:1.2em"></p>
        </div>
      </div>`;
    }

    document.getElementById('ptab-settings').innerHTML = `
      ${requestsHtml}
      ${cloudHtml}
      <div class="card">
        <h3>👨‍👩‍👧‍👦 أبطال العائلة (${S.children.length})</h3>
        <p class="muted" style="margin-bottom:8px">الحسابات تُنشأ من هنا فقط — الطفل لا يستطيع إنشاء حساب بنفسه</p>
        ${childrenHtml || '<p class="muted">أضف أول بطل!</p>'}
      </div>
      <button class="btn-primary" onclick="App.childForm()">＋ إضافة بطل جديد</button>
      <div class="card" style="margin-top:14px">
        <h3>البيانات</h3>
        <p class="muted" style="margin-bottom:10px">تُحفظ البيانات محليًا على هذا الجهاز فقط</p>
        <button class="btn-ghost" style="width:100%;color:#ff5d5d;border-color:#ffd0d0" onclick="App.resetAll()">🗑️ إعادة ضبط التطبيق بالكامل</button>
      </div>`;
  },

  /* إنشاء / تعديل حساب طفل — من لوحة الوالد فقط */
  childForm(childId, prefillName) {
    const c = childId ? S.children.find(x => x.id === childId) : null;
    const curBase = c ? heroFace(c) : '🐣';
    const curBg = c ? heroBg(c) : AVATAR_BGS[0];
    const bases = AVATAR_BASES.filter(b => b.lvl <= (c ? levelOf(c.xp) : 1) || b.lvl === 1);
    const baseGrid = bases.map(b =>
      `<button class="av-pick ${b.e === curBase ? 'active' : ''}" data-base="${b.e}" onclick="App.pickAvBase(this)">${b.e}</button>`).join('');
    const bgRow = AVATAR_BGS.map(bg =>
      `<button class="bg-pick ${bg === curBg ? 'active' : ''}" data-bg="${bg}" style="background:${bg}" onclick="App.pickAvBg(this)"></button>`).join('');
    this.openModal(`
      <h3>${c ? 'تعديل حساب ' + esc(c.name) : '＋ بطل جديد'}</h3>
      <div class="form-grid">
        <div><label>الاسم</label><input id="f-cname" value="${c ? esc(c.name) : (prefillName ? esc(prefillName) : '')}" placeholder="اسم الطفل" /></div>
        ${c ? `<div><label>اسم المستخدم</label><input id="f-cuser" value="${esc(c.username)}" dir="ltr" /></div>` : ''}
        <div><label>الشخصية</label><div class="av-grid">${baseGrid}</div></div>
        <div><label>لون الخلفية</label><div class="bg-row">${bgRow}</div></div>
        <button class="btn-primary green" onclick="App.saveChild('${childId || ''}')">حفظ ✅</button>
      </div>`);
  },

  pickAvBase(btn) {
    document.querySelectorAll('.av-pick').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },
  pickAvBg(btn) {
    document.querySelectorAll('.bg-pick').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  },

  saveChild(childId) {
    const name = document.getElementById('f-cname').value.trim();
    if (!name) { this.toast('اكتب اسم الطفل أولًا'); return; }
    const base = (document.querySelector('.av-pick.active') || {}).dataset ? document.querySelector('.av-pick.active').dataset.base : '🐣';
    const bg = (document.querySelector('.bg-pick.active') || {}).dataset ? document.querySelector('.bg-pick.active').dataset.bg : AVATAR_BGS[0];
    if (childId) {
      const c = S.children.find(x => x.id === childId);
      c.name = name;
      const userEl = document.getElementById('f-cuser');
      if (userEl && userEl.value.trim()) c.username = userEl.value.trim().replace(/\s+/g, '_');
      c.avatar = { base, bg };
    } else {
      const c = defaultChild(name, base, bg);
      S.children.push(c);
      if (!S.activeChildId) S.activeChildId = c.id;
    }
    save();
    this.closeModal();
    this.renderPSettings();
    this.renderChildSwitcher();
    this.toast('تم الحفظ ✅');
  },

  deleteChild(childId) {
    const c = S.children.find(x => x.id === childId);
    if (!c) return;
    if (S.children.length === 1) { this.toast('لا يمكن حذف آخر بطل — أضف غيره أولًا'); return; }
    if (!confirm(`حذف حساب ${c.name} وكل تقدمه نهائيًا؟`)) return;
    S.children = S.children.filter(x => x.id !== childId);
    if (S.activeChildId === childId) S.activeChildId = S.children[0].id;
    save();
    this.renderPSettings();
    this.renderChildSwitcher();
    this.refreshParentSubtitle();
  },

  approveJoinRequest(reqId) {
    const r = S.joinRequests.find(x => x.id === reqId);
    if (!r) return;
    S.joinRequests = S.joinRequests.filter(x => x.id !== reqId);
    save();
    this.childForm(null, r.name);   // نموذج الإنشاء معبأ باسم الطالب
    this.renderPSettings();
  },

  dismissJoinRequest(reqId) {
    S.joinRequests = S.joinRequests.filter(x => x.id !== reqId);
    save();
    this.renderPSettings();
    this.refreshParentSubtitle();
  },

  /* ── إجراءات المزامنة السحابية ── */
  _cloudMsg(msg) {
    const el = document.getElementById('cloud-msg');
    if (el) el.textContent = msg;
    else this.toast(msg);
  },

  async cloudCheck() {
    this._cloudMsg('جارٍ الفحص…');
    try {
      const r = await Sync.checkSetup();
      this._cloudMsg(r.ok ? '✅ الخادم جاهز والجداول مضبوطة' : '⚠️ ' + r.reason);
    } catch (e) { this._cloudMsg('⚠️ لا يوجد اتصال بالإنترنت أو الخادم'); }
  },

  async cloudSignup() {
    const email = document.getElementById('f-cloudemail').value.trim();
    const pass = document.getElementById('f-cloudpass').value;
    if (!email || pass.length < 6) { this._cloudMsg('أدخل بريدًا صحيحًا وكلمة مرور 6 أحرف فأكثر'); return; }
    this._cloudMsg('جارٍ إنشاء الحساب…');
    try {
      const r = await Sync.signup(email, pass);
      if (r.needsConfirm) {
        this._cloudMsg('📧 أرسلنا رسالة تفعيل لبريدك — أكدها ثم اضغط "دخول"');
      } else {
        this.toast('تم تفعيل المزامنة ☁️✅');
        this.renderPSettings();
      }
    } catch (e) { this._cloudMsg('⚠️ ' + e.message); }
  },

  async cloudLogin() {
    const email = document.getElementById('f-cloudemail').value.trim();
    const pass = document.getElementById('f-cloudpass').value;
    if (!email || !pass) { this._cloudMsg('أدخل البريد وكلمة المرور'); return; }
    this._cloudMsg('جارٍ الدخول…');
    try {
      await Sync.login(email, pass);
      this.toast('تم تفعيل المزامنة ☁️✅');
      this.renderPSettings();
      this.renderChildSwitcher();
      this.refreshParentSubtitle();
    } catch (e) { this._cloudMsg('⚠️ ' + e.message); }
  },

  cloudLogout() {
    if (!confirm('إيقاف المزامنة على هذا الجهاز؟ البيانات المحلية تبقى كما هي')) return;
    Sync.logout();
    this.renderPSettings();
  },

  async syncNow() {
    this.toast('جارٍ المزامنة…');
    try {
      // السحب أولًا كي لا ندهس تغييرات وصلت من أجهزة أخرى، ثم الرفع
      await Sync.pullNow();
      await Sync.push();
      this.toast('تمت المزامنة ☁️✅');
      this.renderPSettings();
    } catch (e) { this.toast('⚠️ ' + e.message); }
  },

  shareFamilyCode() {
    const code = Sync.cfg.familyCode;
    const msg = `🥕 انضم لعائلتنا في تطبيق جَزَرة!\n\nافتح التطبيق ← "أنا البطل" ← "الانضمام برمز العائلة" وأدخل:\n\n${code}`;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  },

  /* انضمام جهاز طفل برمز العائلة */
  familyJoinForm() {
    this.openModal(`
      <h3>☁️ الانضمام برمز العائلة</h3>
      <p class="muted" style="margin-bottom:12px">اطلب الرمز من والدك (يجده في الإعدادات ← المزامنة السحابية)</p>
      <div class="form-grid">
        <div><label>رمز العائلة</label><input id="f-famcode" dir="ltr" style="text-transform:uppercase;letter-spacing:2px;text-align:center;font-weight:900" placeholder="JZXXXXXX" /></div>
        <button class="btn-primary purple" onclick="App.familyJoin()">انضم الآن ☁️</button>
        <p id="join-msg" class="muted" style="min-height:1.2em"></p>
      </div>`);
  },

  async familyJoin() {
    const code = document.getElementById('f-famcode').value;
    const msgEl = document.getElementById('join-msg');
    msgEl.textContent = 'جارٍ الاتصال…';
    try {
      await Sync.joinWithCode(code);
      this.closeModal();
      this.renderChildSelect();
      this.celebrate('انضم جهازك للعائلة! ☁️', 'كل الأبطال والمهام وصلت لهذا الجهاز', ['✅ مزامنة تلقائية'], '👨‍👩‍👧‍👦');
    } catch (e) { msgEl.textContent = '⚠️ ' + e.message; }
  },

  /* تحديث الشاشة الظاهرة بعد وصول بيانات من السحابة */
  refreshAfterSync() {
    if (document.getElementById('screen-parent').classList.contains('active')) {
      this.renderChildSwitcher();
      const active = document.querySelector('.ptab.active');
      if (active) this.parentTab(active.dataset.ptab);
      this.refreshParentSubtitle();
    } else if (document.getElementById('screen-kid').classList.contains('active')) {
      const active = document.querySelector('.knav.active');
      if (active) this.kidTab(active.dataset.ktab);
    } else if (document.getElementById('screen-childselect').classList.contains('active')) {
      this.renderChildSelect();
    }
  },

  /* بطاقة البطل: QR + اسم المستخدم — للتعريف وربط المدرسة والمزامنة مستقبلًا */
  childCard(childId) {
    const c = S.children.find(x => x.id === childId);
    if (!c) return;
    const payload = encodeShareCode({ v: 1, k: 'c', n: c.name, u: c.username, t: c.name });
    let qrHtml = '';
    try {
      const qr = qrcode(0, 'M');
      qr.addData(payload);
      qr.make();
      qrHtml = qr.createSvgTag({ scalable: true, margin: 2 });
    } catch (e) { qrHtml = ''; }
    this.openModal(`
      <div style="text-align:center">
        <span class="cs-avatar" style="background:${heroBg(c)};margin:0 auto">${heroFace(c)}</span>
        <h3 style="margin:8px 0 2px">🪪 بطاقة ${esc(c.name)}</h3>
        <p class="muted" dir="ltr">@${esc(c.username)}</p>
        <div class="qr-box">${qrHtml}</div>
        <p class="muted" style="font-size:0.8rem">بطاقة تعريف البطل — تُستخدم لاحقًا لربط حساب المدرسة والمزامنة بين الأجهزة</p>
      </div>`);
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
    const lvl = levelOf(C().xp);
    const mini = document.getElementById('kid-avatar-mini');
    mini.textContent = heroFace(C());
    mini.style.background = heroBg(C());
    document.getElementById('kid-name-mini').textContent = C().name;
    document.getElementById('stat-coins').textContent = C().coins;
    document.getElementById('stat-streak').textContent = C().streak;
  },

  /* ── خريطة المغامرة ── */
  renderKMap() {
    const today = todayKey();
    const doneIds = new Set(C().completions[today] || []);
    const allDone = C().tasks.length > 0 && C().tasks.every(t => doneIds.has(t.id));

    let html = `
      <h2 class="map-title">🗺️ مغامرة اليوم</h2>
      <p class="map-sub">${dayNameOffset(0)} — أكمل المراحل واجمع الكنوز!</p>`;

    // صندوق المفاجأة
    if (C().mysteryBox) {
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

    if (C().tasks.length === 0) {
      html += `<div class="map-empty"><div class="big-emoji">🗺️</div><p class="muted">الخريطة فارغة… اطلب من والدك إضافة مهام المغامرة!</p></div>`;
    } else {
      const pendingToday = new Set(C().pendingProofs.filter(p => p.date === today).map(p => p.taskId));
      const goldenId = goldenTaskId(today);
      html += '<div class="map-path">';
      C().tasks.forEach((t, i) => {
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
              ${t.teacher ? `<div class="n-teacher">🏫 من ${esc(t.teacher)}</div>` : ''}
              <div class="n-reward">${pending ? '👀 بانتظار تأكيد والدك…'
                : `✨ ${et.xp} XP &nbsp; 🥕 ${et.coins}${et.golden ? ' &nbsp; <b style="color:#cf9a1d">مهمة اليوم الذهبية ×2</b>' : ''}${t.proof !== 'self' ? ' &nbsp; ' + PROOF_MODES[t.proof].emoji : ''}`}</div>
            </div>
          </div>
          ${i < C().tasks.length - 1 ? '<div class="path-connector"></div>' : ''}`;
      });
      html += '</div>';
    }

    // مشاركة إنجاز اليوم مع الوالد البعيد + إضافة رمز معلم
    html += `
      <button class="btn-primary purple" style="margin-top:6px" onclick="App.shareDayReport()">📤 أرسل إنجاز اليوم لوالدي</button>
      <button class="btn-ghost" style="width:100%;margin-top:10px" onclick="App.importCodeForm()">🏫 عندي رمز من معلمي</button>`;

    document.getElementById('ktab-map').innerHTML = html;
  },

  /* تقرير نصي يُشارك عبر واتساب أو أي تطبيق — للوالد خارج المنزل */
  shareDayReport() {
    const today = todayKey();
    const doneIds = C().completions[today] || [];
    const lines = [`🥕 تقرير ${C().name} — ${dayNameOffset(0)} ${today}`, ''];
    for (const t of C().tasks) {
      const pending = C().pendingProofs.some(p => p.taskId === t.id && p.date === today);
      lines.push(`${doneIds.includes(t.id) ? '✅' : (pending ? '⏳ (بانتظار تأكيدك)' : '⬜')} ${t.title}`);
    }
    lines.push('', `⭐ المستوى ${levelOf(C().xp)} · 🥕 ${C().coins} · 🔥 سلسلة ${C().streak} يوم`);
    if (C().pendingProofs.length) lines.push(`🔔 ${C().pendingProofs.length} إثبات بانتظار مراجعتك في التطبيق`);
    const text = lines.join('\n');
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }
  },

  completeTask(taskId) {
    const t = C().tasks.find(x => x.id === taskId);
    if (!t) return;
    const today = todayKey();
    if ((C().completions[today] || []).includes(taskId)) return;
    if (C().pendingProofs.some(p => p.taskId === taskId && p.date === today)) return;

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
    C().pendingProofs.push({
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
      emoji = heroFace(C());
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
    const t = C().tasks.find(x => x.id === taskId);
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
    const t = C().tasks.find(x => x.id === this._pendingPhotoTaskId);
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
    const box = C().mysteryBox;
    if (!box) return;
    C().coins += box.coins;
    C().lifetimeCoins += box.coins;
    C().mysteryBox = null;
    save();
    const gains = box.coins > 0 ? [`+${box.coins} 🥕`] : [];
    this.celebrate('صندوق المفاجأة! 📦', esc(box.prize), gains, '🎁');
    this.renderKMap();
    this.refreshKidHeader();
  },

  /* ── صفحة البطل ── */
  renderKHero() {
    const lvl = levelOf(C().xp);
    const prog = levelProgress(C().xp);
    const hearts = '❤️'.repeat(Math.max(1, Math.round(C().hp / 20))) + '🤍'.repeat(5 - Math.max(1, Math.round(C().hp / 20)));
    const gearEmojis = C().equipped.map(id => (GEAR_ITEMS.find(g => g.id === id) || {}).emoji || '').join(' ');

    document.getElementById('ktab-hero').innerHTML = `
      <div class="hero-card">
        <div class="hero-avatar" style="background:${heroBg(C())}">${heroFace(C())}</div>
        <div class="hero-gear">${gearEmojis}</div>
        <div class="hero-name">${esc(C().name)}</div>
        <div class="hero-title-tag">« ${heroTitle(lvl)} »</div>
        <button class="btn-ghost" style="margin-top:8px" onclick="App.avatarStudio()">🎨 غيّر شكلي</button>
        <div class="hero-level-row"><span>المستوى ${lvl}</span><span>${prog} / 100 XP</span></div>
        <div class="progressbar"><i style="width:${prog}%"></i></div>
        <div class="hp-hearts" title="صحة البطل">${hearts} <small style="font-size:0.75rem;color:#8a86a8">${C().hp}%</small></div>
        <div class="hero-stats-grid">
          <div class="hstat"><div class="h-num">${totalCompletions(C())}</div><div class="h-lbl">مهمة منجزة</div></div>
          <div class="hstat"><div class="h-num">${C().bestStreak}</div><div class="h-lbl">أطول سلسلة 🔥</div></div>
          <div class="hstat"><div class="h-num">${C().lifetimeCoins}</div><div class="h-lbl">جزر مجموع 🥕</div></div>
        </div>
      </div>
      <div class="card">
        <h3>🧢 عتادي</h3>
        ${C().gear.length === 0
          ? '<p class="muted">اشترِ عتادًا من المتجر ليظهر على بطلك!</p>'
          : `<div class="pill-list">${C().gear.map(id => {
              const g = GEAR_ITEMS.find(x => x.id === id);
              const on = C().equipped.includes(id);
              return `<button class="pill" style="${on ? 'background:#e2f5ea' : ''}" onclick="App.toggleGear('${id}')">${g.emoji} ${g.name} ${on ? '✔' : ''}</button>`;
            }).join('')}</div><p class="muted" style="margin-top:8px">اضغط على القطعة لارتدائها أو خلعها</p>`}
      </div>`;
  },

  /* استوديو الأفاتار — الطفل يبدل شخصيته من المكتبة المفتوحة بمستواه */
  avatarStudio() {
    const c = C();
    const lvl = levelOf(c.xp);
    const baseGrid = AVATAR_BASES.map(b => {
      const open = lvl >= b.lvl;
      return open
        ? `<button class="av-pick ${b.e === heroFace(c) ? 'active' : ''}" data-base="${b.e}" onclick="App.pickAvBase(this)">${b.e}</button>`
        : `<span class="av-pick locked" title="يفتح في المستوى ${b.lvl}">🔒<small>م${b.lvl}</small></span>`;
    }).join('');
    const bgRow = AVATAR_BGS.map(bg =>
      `<button class="bg-pick ${bg === heroBg(c) ? 'active' : ''}" data-bg="${bg}" style="background:${bg}" onclick="App.pickAvBg(this)"></button>`).join('');
    const gearRow = c.gear.length
      ? c.gear.map(id => {
          const g = GEAR_ITEMS.find(x => x.id === id);
          const on = c.equipped.includes(id);
          return `<button class="pill" style="${on ? 'background:#e2f5ea' : ''}" onclick="App.toggleGear('${id}');App.avatarStudio()">${g.emoji} ${on ? '✔' : ''}</button>`;
        }).join('')
      : '<p class="muted">اشترِ أزياء من المتجر لتلبسها هنا!</p>';
    this.openModal(`
      <h3>🎨 استوديو البطل</h3>
      <p class="muted" style="margin-bottom:10px">كل مستوى جديد يفتح شخصيات أكثر — أنت الآن مستوى ${lvl}</p>
      <div class="form-grid">
        <div><label>شخصيتي</label><div class="av-grid">${baseGrid}</div></div>
        <div><label>لون خلفيتي</label><div class="bg-row">${bgRow}</div></div>
        <div><label>أزيائي 🧢</label><div class="pill-list">${gearRow}</div></div>
        <button class="btn-primary" onclick="App.saveAvatar()">هذا أنا! ✨</button>
      </div>`);
  },

  saveAvatar() {
    const baseEl = document.querySelector('.av-pick.active');
    const bgEl = document.querySelector('.bg-pick.active');
    C().avatar = {
      base: baseEl ? baseEl.dataset.base : heroFace(C()),
      bg: bgEl ? bgEl.dataset.bg : heroBg(C()),
    };
    save();
    this.closeModal();
    this.celebrate('شكل جديد رهيب! 🎨', 'هذا هو بطلك الجديد', [], heroFace(C()));
    this.renderKHero();
    this.refreshKidHeader();
  },

  toggleGear(id) {
    const i = C().equipped.indexOf(id);
    if (i >= 0) C().equipped.splice(i, 1);
    else C().equipped.push(id);
    save();
    this.renderKHero();
  },

  /* ── المتجر ── */
  renderKShop() {
    const realRewards = S.rewards.map(r => `
      <div class="shop-item">
        <span class="s-emoji">${r.emoji}</span>
        <span class="s-name">${esc(r.title)}</span>
        ${r.teacher ? `<small style="color:#8a86a8;font-weight:700">🏫 من ${esc(r.teacher)}</small>` : ''}
        <button class="buy-btn" ${C().coins < r.cost ? 'disabled' : ''} onclick="App.redeemReward('${r.id}')">${r.cost} 🥕</button>
      </div>`).join('');

    const gearShop = GEAR_ITEMS.map(g => {
      const owned = C().gear.includes(g.id);
      return `
      <div class="shop-item">
        <span class="s-emoji">${g.emoji}</span>
        <span class="s-name">${g.name}</span>
        ${owned
          ? '<button class="buy-btn owned" disabled>تم الشراء ✔</button>'
          : `<button class="buy-btn" ${C().coins < g.cost ? 'disabled' : ''} onclick="App.buyGear('${g.id}')">${g.cost} 🥕</button>`}
      </div>`;
    }).join('');

    const pending = C().redemptions.filter(r => r.status === 'pending');

    document.getElementById('ktab-shop').innerHTML = `
      <div class="all-done-banner" style="background:linear-gradient(120deg,#ffe0b8,#ffd0a0)">رصيدك: ${C().coins} 🥕</div>
      ${pending.length ? `<div class="card"><h3>⏳ بانتظار موافقة الوالدين</h3>${pending.map(p => `<p class="pill" style="margin-bottom:6px">🎁 ${esc(p.title)}</p>`).join('')}</div>` : ''}
      <h3 class="shop-section-title">🎁 جوائز حقيقية من العائلة</h3>
      <div class="shop-grid">${realRewards || '<p class="muted">لا توجد جوائز بعد</p>'}</div>
      <h3 class="shop-section-title">🧢 عتاد البطل</h3>
      <div class="shop-grid">${gearShop}</div>`;
  },

  redeemReward(rewardId) {
    const r = S.rewards.find(x => x.id === rewardId);
    if (!r || C().coins < r.cost) return;
    if (!confirm(`شراء "${r.title}" مقابل ${r.cost} 🥕؟`)) return;
    C().coins -= r.cost;
    C().redemptions.push({ id: uid(), rewardId: r.id, title: r.title, cost: r.cost, date: todayKey(), status: 'pending' });
    save();
    this.celebrate('طلب رائع! 🎁', `أرسلنا "${esc(r.title)}" للوالدين للموافقة`, [`-${r.cost} 🥕`], '📨');
    this.renderKShop();
    this.refreshKidHeader();
  },

  buyGear(gearId) {
    const g = GEAR_ITEMS.find(x => x.id === gearId);
    if (!g || C().coins < g.cost || C().gear.includes(gearId)) return;
    C().coins -= g.cost;
    C().gear.push(gearId);
    C().equipped.push(gearId);
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

  /* ═══════════ وضع المعلم ═══════════ */

  enterTeacher() {
    this.showScreen('screen-teacher');
    this.renderTeacherForm();
  },

  renderTeacherForm() {
    const catOptions = Object.entries(CATEGORIES)
      .map(([k, c]) => `<option value="${k}">${c.emoji} ${c.name}</option>`).join('');
    const proofOptions = Object.entries(PROOF_MODES)
      .map(([k, m]) => `<option value="${k}" ${k === 'photo' ? 'selected' : ''}>${m.emoji} ${m.name}</option>`).join('');
    document.getElementById('teacher-body').innerHTML = `
      <div class="card">
        <div class="form-grid">
          <div><label>اسمك (يظهر للطالب وولي الأمر)</label><input id="t-name" placeholder="مثال: المعلمة نورة" /></div>
          <div><label>النوع</label>
            <select id="t-kind" onchange="App.teacherKindChanged()">
              <option value="t">📋 مهمة</option>
              <option value="r">🎁 مكافأة</option>
            </select>
          </div>
          <div><label id="t-title-label">المهمة</label><input id="t-title" placeholder="مثال: حل صفحة 12 من كتاب الرياضيات" /></div>
          <div id="t-task-fields">
            <div style="margin-bottom:12px"><label>المسار</label><select id="t-cat">${catOptions}</select></div>
            <div class="form-row">
              <div><label>نقاط الخبرة XP</label><input id="t-xp" type="number" min="5" max="100" value="25" /></div>
              <div><label>الجزر 🥕</label><input id="t-coins" type="number" min="1" max="50" value="10" /></div>
            </div>
            <div style="margin-top:12px"><label>طريقة تأكيد الإنجاز</label><select id="t-proof">${proofOptions}</select></div>
          </div>
          <div id="t-reward-fields" style="display:none">
            <label>سعر المكافأة بالجزر 🥕</label><input id="t-cost" type="number" min="5" max="500" value="50" />
          </div>
          <button class="btn-primary purple" onclick="App.teacherGenerate()">توليد الرمز 🔑</button>
        </div>
      </div>
      <div id="teacher-result"></div>`;
  },

  teacherKindChanged() {
    const isReward = document.getElementById('t-kind').value === 'r';
    document.getElementById('t-task-fields').style.display = isReward ? 'none' : 'block';
    document.getElementById('t-reward-fields').style.display = isReward ? 'block' : 'none';
    document.getElementById('t-title-label').textContent = isReward ? 'المكافأة' : 'المهمة';
  },

  _lastShareCode: '',
  _lastShareMsg: '',

  teacherGenerate() {
    const name = document.getElementById('t-name').value.trim();
    const title = document.getElementById('t-title').value.trim();
    if (!name || !title) { this.toast('اكتب اسمك وعنوان المهمة أولًا'); return; }
    const kind = document.getElementById('t-kind').value;
    let payload;
    if (kind === 'r') {
      payload = { v: 1, k: 'r', n: name, t: title, o: Math.max(5, parseInt(document.getElementById('t-cost').value) || 50) };
    } else {
      payload = {
        v: 1, k: 't', n: name, t: title,
        c: document.getElementById('t-cat').value,
        x: Math.max(5, parseInt(document.getElementById('t-xp').value) || 25),
        o: Math.max(1, parseInt(document.getElementById('t-coins').value) || 10),
        p: document.getElementById('t-proof').value,
      };
    }
    const code = encodeShareCode(payload);
    this._lastShareCode = code;
    this._lastShareMsg = `🏫 ${kind === 'r' ? 'مكافأة' : 'مهمة'} من ${name} عبر تطبيق جَزَرة 🥕\n«${title}»\n\nانسخ الرمز التالي والصقه في التطبيق (زر: إضافة رمز من المعلم):\n\n${code}`;

    // توليد QR (يحمل الرمز نفسه — يُمسح بكاميرا الجوال ثم يُنسخ ويُلصق)
    let qrHtml = '';
    try {
      const qr = qrcode(0, 'M');
      qr.addData(code);
      qr.make();
      qrHtml = qr.createSvgTag({ scalable: true, margin: 2 });
    } catch (e) { qrHtml = '<p class="muted">تعذر توليد QR — استخدم الرمز النصي</p>'; }

    document.getElementById('teacher-result').innerHTML = `
      <div class="card" style="text-align:center;border:3px solid var(--purple)">
        <h3>✅ الرمز جاهز — أرسله لأولياء الأمور</h3>
        <div class="qr-box">${qrHtml}</div>
        <div class="code-box" dir="ltr">${this._lastShareCode}</div>
        <div class="form-row" style="margin-top:12px">
          <div><button class="btn-primary green" onclick="App.copyShareCode()">📋 نسخ الرمز</button></div>
          <div><button class="btn-primary" onclick="App.whatsappShareCode()">💬 واتساب</button></div>
        </div>
      </div>`;
    document.getElementById('teacher-result').scrollIntoView({ behavior: 'smooth' });
  },

  copyShareCode() {
    navigator.clipboard.writeText(this._lastShareMsg).then(
      () => this.toast('نُسخ الرمز مع التعليمات ✅'),
      () => this.toast('انسخ الرمز يدويًا من المربع')
    );
  },

  whatsappShareCode() {
    window.open('https://wa.me/?text=' + encodeURIComponent(this._lastShareMsg), '_blank');
  },

  /* ── استيراد رمز المعلم (من لوحة الوالد أو عالم الطفل) ── */
  importCodeForm() {
    this.openModal(`
      <h3>🏫 إضافة رمز من المعلم / المعلمة</h3>
      <p class="muted" style="margin-bottom:12px">الصق الرمز الذي وصلكم (يبدأ بـ JZR1) — أو امسح الـ QR بكاميرا الجوال وانسخ النص</p>
      <div class="form-grid">
        <textarea id="f-import" rows="4" placeholder="JZR1.xxxx.xxx" style="width:100%;border:2px solid #e5e1f5;border-radius:12px;padding:10px;font-family:monospace" dir="ltr"></textarea>
        <button class="btn-primary purple" onclick="App.importCode()">تحقق وأضف ✅</button>
      </div>`);
  },

  importCode() {
    const raw = document.getElementById('f-import').value;
    const obj = decodeShareCode(raw);
    if (!obj) { this.toast('الرمز غير صالح — تأكد من نسخه كاملًا'); return; }
    if (obj.k === 'r') {
      if (S.rewards.some(r => r.title === obj.t && r.teacher === obj.n)) { this.toast('هذه المكافأة مضافة من قبل'); this.closeModal(); return; }
      S.rewards.push({ id: uid(), emoji: '🏫', title: obj.t, cost: obj.o, teacher: obj.n });
      save();
      this.closeModal();
      this.toast(`أُضيفت مكافأة موثقة من ${obj.n} 🏫`);
    } else {
      if (C().tasks.some(t => t.title === obj.t && t.teacher === obj.n)) { this.toast('هذه المهمة مضافة من قبل'); this.closeModal(); return; }
      const cat = CATEGORIES[obj.c] ? obj.c : 'study';
      const proof = PROOF_MODES[obj.p] ? obj.p : 'photo';
      C().tasks.push({ id: uid(), title: obj.t, cat, xp: Math.min(100, obj.x || 25), coins: Math.min(50, obj.o || 10), proof, teacher: obj.n });
      save();
      this.closeModal();
      this.toast(`أُضيفت مهمة موثقة من ${obj.n} 🏫`);
    }
    // تحديث الشاشة الظاهرة حاليًا
    if (document.getElementById('screen-parent').classList.contains('active')) { this.renderPTasks(); this.renderPRewards && this.parentTab(document.querySelector('.ptab.active').dataset.ptab); }
    if (document.getElementById('screen-kid').classList.contains('active')) this.renderKMap();
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
