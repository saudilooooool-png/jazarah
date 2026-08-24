/* ═══════════════════════════════════════════════════
   جَزَرة — مغامرة العائلة (MVP)
   الفئة المستهدفة: 6–12 سنة
   تخزين محلي بالكامل (localStorage) — لا يحتاج خادمًا
   ═══════════════════════════════════════════════════ */

'use strict';

/* رقم البناء — يُستبدل تلقائيًا في خط البناء ليظهر أي نسخة تعمل فعلًا */
const APP_BUILD = 'BUILD_PLACEHOLDER';

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
  { title: 'جهّزت صندوق غدائي الصحي بنفسي 🍱', cat: 'health',   xp: 20, coins: 7,  proof: 'photo'  },
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
  { group: '🚗 مشاوير', kind: 'out', items: [
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
  { group: '🎁 هدايا', kind: 'budget', items: [
    { emoji: '💵', title: 'مصروف إضافي',               cost: 150 },
    { emoji: '🧸', title: 'لعبة صغيرة',                cost: 200 },
    { emoji: '🎁', title: 'هدية مفاجأة كبيرة',         cost: 500 },
  ]},
];

/* ─────────────── وضع الويكند (الجمعة والسبت) ─────────────── */
function isWeekend(d = new Date()) { const day = d.getDay(); return day === 5 || day === 6; }
function isFriday(d = new Date()) { return d.getDay() === 5; }

/* مكتبة نشاطات الويكند — لا دراسة، بل عائلة وحياة */
const WEEKEND_LIBRARY = [
  { title: 'نزهة أو نشاط عائلي خارج المنزل', cat: 'kindness', xp: 30, coins: 10, proof: 'parent' },
  { title: 'زيارة الأجداد أو صلة الرحم',     cat: 'kindness', xp: 30, coins: 10, proof: 'parent' },
  { title: 'طبخة مع العائلة 👨‍🍳',            cat: 'kindness', xp: 25, coins: 8,  proof: 'photo'  },
  { title: 'مساعدة في ترتيب المنزل',          cat: 'kindness', xp: 20, coins: 7,  proof: 'parent' },
  { title: 'غسل السيارة مع بابا 🚗',          cat: 'kindness', xp: 25, coins: 8,  proof: 'photo'  },
  { title: 'قراءة حرة لكتاب أحبه',            cat: 'study',    xp: 20, coins: 7,  proof: 'parent', weekendOk: true },
  { title: 'سباحة أو رياضة عائلية',           cat: 'sport',    xp: 30, coins: 10, proof: 'parent' },
  { title: 'لعب مع إخوتي دون أجهزة ساعة',     cat: 'kindness', xp: 20, coins: 7,  proof: 'parent' },
  { title: 'تجهيز أغراضي ليوم الأحد 🎒',      cat: 'health',   xp: 15, coins: 5,  proof: 'photo'  },
];

/* ─────────────── لعبة صندوق الغداء الصحي ─────────────── */
const LUNCH_ITEMS = [
  { n: 'تفاحة', e: '🍎', g: 'fruit' }, { n: 'موزة', e: '🍌', g: 'fruit' }, { n: 'عنب', e: '🍇', g: 'fruit' },
  { n: 'خيار', e: '🥒', g: 'veg' }, { n: 'جزر', e: '🥕', g: 'veg' }, { n: 'طماطم', e: '🍅', g: 'veg' },
  { n: 'ساندويتش جبن', e: '🥪', g: 'main' }, { n: 'بيضة', e: '🥚', g: 'main' }, { n: 'زبادي', e: '🥛', g: 'main' },
  { n: 'ماء', e: '💧', g: 'drink' }, { n: 'حليب', e: '🥛', g: 'drink' }, { n: 'عصير طبيعي', e: '🧃', g: 'drink' },
  { n: 'شيبس', e: '🍟', g: 'junk' }, { n: 'مشروب غازي', e: '🥤', g: 'junk' }, { n: 'حلوى', e: '🍬', g: 'junk' }, { n: 'دونات', e: '🍩', g: 'junk' },
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

/* ─────────────── المراحل الدراسية (KG → سادس ابتدائي) ─────────────── */
const GRADES = {
  kg1: { name: 'روضة أولى KG1',    tier: 1 },
  kg2: { name: 'روضة ثانية KG2',   tier: 1 },
  g1:  { name: 'أول ابتدائي',      tier: 2 },
  g2:  { name: 'ثاني ابتدائي',     tier: 2 },
  g3:  { name: 'ثالث ابتدائي',     tier: 3 },
  g4:  { name: 'رابع ابتدائي',     tier: 3 },
  g5:  { name: 'خامس ابتدائي',     tier: 4 },
  g6:  { name: 'سادس ابتدائي',     tier: 4 },
};
function gradeTier(grade) { return (GRADES[grade] || GRADES.g1).tier; }
function gradeName(grade) { return (GRADES[grade] || GRADES.g1).name; }

/* اقتراح الصف من العمر (تقريب النظام السعودي) */
function suggestGrade(age) {
  if (age <= 4) return 'kg1';
  if (age === 5) return 'kg2';
  return ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'][Math.min(5, Math.max(0, age - 6))];
}
function ageOf(birthdate) {
  if (!birthdate) return null;
  const b = new Date(birthdate + 'T00:00:00');
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--;
  return age;
}
function daysToBirthday(birthdate) {
  if (!birthdate) return null;
  const b = new Date(birthdate + 'T00:00:00');
  const now = new Date();
  const next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
  if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) next.setFullYear(next.getFullYear() + 1);
  return Math.round((next - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
}

/* ─────────────── مكتبة مهام دائمة لكل صف ───────────────
   مهام بصياغة عامة مكملة لمواد مقررات وزارة التعليم — ليست نصوصًا من الكتب */
const CURRICULUM = {
  kg1: [
    { title: 'تلوين حرف اليوم وتسميته',              cat: 'study', xp: 15, coins: 5, proof: 'photo'  },
    { title: 'العد من 1 إلى 10 بصوت عالٍ',           cat: 'study', xp: 10, coins: 4, proof: 'parent' },
    { title: 'ترديد سورة الفاتحة',                   cat: 'faith', xp: 15, coins: 5, proof: 'parent' },
    { title: 'تسمية 5 ألوان حولك',                   cat: 'study', xp: 10, coins: 4, proof: 'parent' },
    { title: 'تسمية 5 حيوانات من الصور',             cat: 'study', xp: 10, coins: 4, proof: 'parent' },
    { title: 'مسك القلم ورسم خطوط وأشكال',           cat: 'study', xp: 10, coins: 4, proof: 'photo'  },
  ],
  kg2: [
    { title: 'كتابة 3 حروف تعلمتها اليوم',           cat: 'study', xp: 15, coins: 5, proof: 'photo'  },
    { title: 'العد من 1 إلى 20',                     cat: 'study', xp: 10, coins: 4, proof: 'parent' },
    { title: 'حفظ سورة قصيرة من جزء عم',             cat: 'faith', xp: 20, coins: 7, proof: 'parent' },
    { title: 'قراءة قصة مصورة مع ماما أو بابا',      cat: 'study', xp: 15, coins: 5, proof: 'parent' },
    { title: 'كتابة اسمي بنفسي',                     cat: 'study', xp: 15, coins: 5, proof: 'photo'  },
    { title: 'تسمية أيام الأسبوع',                   cat: 'study', xp: 10, coins: 4, proof: 'parent' },
  ],
  g1: [
    { title: 'قراءة درس من كتاب لغتي بصوت عالٍ',     cat: 'study', xp: 25, coins: 8, proof: 'parent' },
    { title: 'كتابة سطر إملاء من لغتي',              cat: 'study', xp: 20, coins: 7, proof: 'photo'  },
    { title: 'حل 10 مسائل جمع ضمن 20',               cat: 'study', xp: 20, coins: 7, proof: 'photo'  },
    { title: 'مراجعة حفظ سورة من جزء عم',            cat: 'faith', xp: 20, coins: 7, proof: 'parent' },
    { title: 'تسمية 5 كلمات إنجليزية بالصور',        cat: 'study', xp: 15, coins: 5, proof: 'parent' },
    { title: 'ترتيب أحداث قصة قصيرة',                cat: 'study', xp: 15, coins: 5, proof: 'parent' },
  ],
  g2: [
    { title: 'قراءة نص من لغتي وتلخيصه شفهيًا',      cat: 'study', xp: 25, coins: 8, proof: 'parent' },
    { title: 'حل صفحة جمع وطرح ضمن 100',             cat: 'study', xp: 25, coins: 8, proof: 'photo'  },
    { title: 'كتابة 3 جمل من إنشائي',                cat: 'study', xp: 20, coins: 7, proof: 'photo'  },
    { title: 'حفظ آيات جديدة من جزء عم',             cat: 'faith', xp: 20, coins: 7, proof: 'parent' },
    { title: 'قراءة كلمات درس English اليوم',        cat: 'study', xp: 15, coins: 5, proof: 'parent' },
    { title: 'قياس أطوال 3 أشياء بالمسطرة',          cat: 'study', xp: 15, coins: 5, proof: 'photo'  },
  ],
  g3: [
    { title: 'حفظ جدول ضرب عدد جديد',                cat: 'study', xp: 30, coins: 10, proof: 'parent' },
    { title: 'قراءة درس لغتي وإجابة أسئلة الفهم',    cat: 'study', xp: 25, coins: 8,  proof: 'parent' },
    { title: 'كتابة فقرة قصيرة بخط جميل',            cat: 'study', xp: 20, coins: 7,  proof: 'photo'  },
    { title: 'تجربة علمية بسيطة من كتاب العلوم',     cat: 'study', xp: 25, coins: 8,  proof: 'photo'  },
    { title: 'مراجعة مقرر الحفظ من القرآن',          cat: 'faith', xp: 25, coins: 8,  proof: 'parent' },
    { title: 'حفظ 5 كلمات English مع إملائها',       cat: 'study', xp: 20, coins: 7,  proof: 'parent' },
  ],
  g4: [
    { title: 'تسميع جداول الضرب كاملة',              cat: 'study', xp: 30, coins: 10, proof: 'parent' },
    { title: 'حل مسائل قسمة من كتاب الرياضيات',      cat: 'study', xp: 25, coins: 8,  proof: 'photo'  },
    { title: 'قراءة 10 صفحات من قصة وتلخيصها',       cat: 'study', xp: 25, coins: 8,  proof: 'parent' },
    { title: 'رسم دورة حياة كائن حي من العلوم',      cat: 'study', xp: 20, coins: 7,  proof: 'photo'  },
    { title: 'حفظ ومراجعة وردي من القرآن',           cat: 'faith', xp: 25, coins: 8,  proof: 'parent' },
    { title: 'كتابة 5 جمل English صحيحة',            cat: 'study', xp: 20, coins: 7,  proof: 'photo'  },
  ],
  g5: [
    { title: 'حل تمارين الكسور من الرياضيات',        cat: 'study', xp: 30, coins: 10, proof: 'photo'  },
    { title: 'قراءة درس لغتي واستخراج الأفكار',      cat: 'study', xp: 25, coins: 8,  proof: 'parent' },
    { title: 'كتابة موضوع تعبير قصير',               cat: 'study', xp: 30, coins: 10, proof: 'photo'  },
    { title: 'تلخيص درس من الدراسات الاجتماعية',     cat: 'study', xp: 20, coins: 7,  proof: 'parent' },
    { title: 'مراجعة الحفظ مع أحكام التلاوة',        cat: 'faith', xp: 25, coins: 8,  proof: 'parent' },
    { title: 'قراءة نص English وترجمة كلماته',       cat: 'study', xp: 25, coins: 8,  proof: 'parent' },
  ],
  g6: [
    { title: 'حل مسائل النسبة المئوية والكسور',      cat: 'study', xp: 30, coins: 10, proof: 'photo'  },
    { title: 'قراءة فصل من كتاب وكتابة رأيي فيه',    cat: 'study', xp: 30, coins: 10, proof: 'parent' },
    { title: 'إعداد خريطة ذهنية لدرس العلوم',        cat: 'study', xp: 25, coins: 8,  proof: 'photo'  },
    { title: 'بحث قصير عن شخصية أو مكان',            cat: 'study', xp: 25, coins: 8,  proof: 'parent' },
    { title: 'مراجعة الحفظ وتثبيته',                 cat: 'faith', xp: 25, coins: 8,  proof: 'parent' },
    { title: 'كتابة فقرة English من 5 أسطر',         cat: 'study', xp: 25, coins: 8,  proof: 'photo'  },
  ],
};

/* ─────────────── مولد أسئلة الحساب حسب الصف ─────────────── */
function mathQuestionFor(grade, i) {
  const day = todayKey();
  const h = (n) => strHash(day + 'math' + grade + i + n);
  const tier = gradeTier(grade);
  let text, answer, emoji = '🧮';

  if (tier === 1) {                       // روضة: عدّ الرموز
    const count = 1 + h(1) % 9;
    const items = ['🍎', '⭐', '🐟', '🎈', '🚗'][h(2) % 5];
    text = `كم ${items} ترى؟<div class="math-emojis">${items.repeat(count)}</div>`;
    answer = count; emoji = items;
  } else if (grade === 'g1') {            // جمع ضمن 20
    const a = 1 + h(1) % 10, b = 1 + h(2) % 10;
    text = `${a} + ${b} = ؟`; answer = a + b;
  } else if (grade === 'g2') {            // جمع وطرح ضمن 100
    const a = 10 + h(1) % 80, b = 1 + h(2) % Math.min(a, 30);
    if (h(3) % 2) { text = `${a} + ${b} = ؟`; answer = a + b; }
    else { text = `${a} − ${b} = ؟`; answer = a - b; }
  } else if (grade === 'g3') {            // جدول الضرب
    const a = 2 + h(1) % 9, b = 2 + h(2) % 9;
    text = `${a} × ${b} = ؟`; answer = a * b;
  } else if (grade === 'g4') {            // ضرب وقسمة بلا باقٍ
    if (h(3) % 2) {
      const a = 3 + h(1) % 10, b = 3 + h(2) % 10;
      text = `${a} × ${b} = ؟`; answer = a * b;
    } else {
      const b = 2 + h(1) % 8, q = 2 + h(2) % 10;
      text = `${b * q} ÷ ${b} = ؟`; answer = q;
    }
  } else if (grade === 'g5') {            // نصف وربع وعمليات أكبر
    const kind = h(3) % 3;
    if (kind === 0) { const n = (2 + h(1) % 40) * 2; text = `نصف العدد ${n} = ؟`; answer = n / 2; }
    else if (kind === 1) { const n = (1 + h(1) % 20) * 4; text = `ربع العدد ${n} = ؟`; answer = n / 4; }
    else { const a = 11 + h(1) % 80, b = 11 + h(2) % 80; text = `${a} + ${b} = ؟`; answer = a + b; }
  } else {                                // سادس: نسب مئوية وعمليات مختلطة
    const kind = h(3) % 3;
    if (kind === 0) { const n = (1 + h(1) % 15) * 10; const p = [10, 25, 50][h(2) % 3]; text = `${p}٪ من ${n} = ؟`; answer = n * p / 100; }
    else if (kind === 1) { const a = 2 + h(1) % 9, b = 2 + h(2) % 9, c = 1 + h(4) % 20; text = `${a} × ${b} + ${c} = ؟`; answer = a * b + c; }
    else { const b = 3 + h(1) % 9, q = 4 + h(2) % 15; text = `${b * q} ÷ ${b} = ؟`; answer = q; }
  }

  // خيارات: الإجابة + 3 مشتتات قريبة، بخلط ثابت طوال اليوم
  const opts = [answer];
  let k = h(9);
  while (opts.length < 4) {
    const delta = 1 + k % 5;
    const cand = (k % 2 ? answer + delta : Math.max(0, answer - delta));
    k = (k * 31 + 11) % 1000003;
    if (!opts.includes(cand)) opts.push(cand);
  }
  opts.sort((a, b) => strHash(day + a) - strHash(day + b));
  return { text, answer, opts, emoji };
}

/* ─────────────── بنك كلمات تعلم اللغة ─────────────── */
/* كل كلمة لها مستوى t (1 روضة → 4 صفوف عليا) — تُختار حسب صف الطفل */
const WORDS_AR = [
  // مستوى 1: كلمات قصيرة بسيطة (روضة)
  { w: 'قمر', e: '🌙', t: 1 }, { w: 'شمس', e: '☀️', t: 1 }, { w: 'بحر', e: '🌊', t: 1 },
  { w: 'أسد', e: '🦁', t: 1 }, { w: 'فيل', e: '🐘', t: 1 }, { w: 'قطة', e: '🐱', t: 1 },
  { w: 'كلب', e: '🐶', t: 1 }, { w: 'بيت', e: '🏠', t: 1 }, { w: 'قلم', e: '✏️', t: 1 },
  { w: 'كرة', e: '⚽', t: 1 }, { w: 'جمل', e: '🐫', t: 1 }, { w: 'عنب', e: '🍇', t: 1 },
  { w: 'خبز', e: '🍞', t: 1 }, { w: 'عسل', e: '🍯', t: 1 }, { w: 'مطر', e: '🌧️', t: 1 }, { w: 'جبل', e: '⛰️', t: 1 },
  // مستوى 2: أول وثاني ابتدائي
  { w: 'موزة', e: '🍌', t: 2 }, { w: 'جزرة', e: '🥕', t: 2 }, { w: 'حليب', e: '🥛', t: 2 },
  { w: 'نجمة', e: '⭐', t: 2 }, { w: 'وردة', e: '🌹', t: 2 }, { w: 'أرنب', e: '🐰', t: 2 },
  { w: 'حصان', e: '🐴', t: 2 }, { w: 'سمكة', e: '🐟', t: 2 }, { w: 'نحلة', e: '🐝', t: 2 },
  { w: 'كتاب', e: '📖', t: 2 }, { w: 'ساعة', e: '⌚', t: 2 }, { w: 'بطيخ', e: '🍉', t: 2 },
  // مستوى 3: ثالث ورابع
  { w: 'تفاحة', e: '🍎', t: 3 }, { w: 'برتقال', e: '🍊', t: 3 }, { w: 'فراولة', e: '🍓', t: 3 },
  { w: 'سحابة', e: '☁️', t: 3 }, { w: 'شجرة', e: '🌳', t: 3 }, { w: 'دجاجة', e: '🐔', t: 3 },
  { w: 'فراشة', e: '🦋', t: 3 }, { w: 'مدرسة', e: '🏫', t: 3 }, { w: 'سيارة', e: '🚗', t: 3 },
  { w: 'طائرة', e: '✈️', t: 3 }, { w: 'قطار', e: '🚆', t: 3 }, { w: 'مفتاح', e: '🔑', t: 3 },
  // مستوى 4: خامس وسادس
  { w: 'مستشفى', e: '🏥', t: 4 }, { w: 'مكتبة', e: '📚', t: 4 }, { w: 'حاسوب', e: '💻', t: 4 },
  { w: 'مهندس', e: '👷', t: 4 }, { w: 'طبيبة', e: '🩺', t: 4 }, { w: 'مزرعة', e: '🚜', t: 4 },
  { w: 'صحراء', e: '🏜️', t: 4 }, { w: 'نافذة', e: '🪟', t: 4 }, { w: 'حديقة', e: '🌷', t: 4 },
  { w: 'مغامرة', e: '🗺️', t: 4 }, { w: 'عاصفة', e: '🌪️', t: 4 }, { w: 'مسجد', e: '🕌', t: 4 },
];
const WORDS_EN = [
  // مستوى 1: ثلاثة حروف
  { w: 'SUN', e: '☀️', t: 1 }, { w: 'CAT', e: '🐱', t: 1 }, { w: 'DOG', e: '🐶', t: 1 },
  { w: 'BEE', e: '🐝', t: 1 }, { w: 'SEA', e: '🌊', t: 1 }, { w: 'KEY', e: '🔑', t: 1 },
  { w: 'CAR', e: '🚗', t: 1 }, { w: 'PEN', e: '🖊️', t: 1 }, { w: 'EGG', e: '🥚', t: 1 }, { w: 'BUS', e: '🚌', t: 1 },
  // مستوى 2: أربعة حروف
  { w: 'MOON', e: '🌙', t: 2 }, { w: 'STAR', e: '⭐', t: 2 }, { w: 'TREE', e: '🌳', t: 2 },
  { w: 'ROSE', e: '🌹', t: 2 }, { w: 'LION', e: '🦁', t: 2 }, { w: 'FISH', e: '🐟', t: 2 },
  { w: 'BIRD', e: '🐦', t: 2 }, { w: 'BOOK', e: '📖', t: 2 }, { w: 'BALL', e: '⚽', t: 2 },
  { w: 'MILK', e: '🥛', t: 2 }, { w: 'RAIN', e: '🌧️', t: 2 }, { w: 'HAND', e: '✋', t: 2 }, { w: 'FIRE', e: '🔥', t: 2 },
  // مستوى 3: خمسة حروف
  { w: 'APPLE', e: '🍎', t: 3 }, { w: 'BREAD', e: '🍞', t: 3 }, { w: 'HORSE', e: '🐴', t: 3 },
  { w: 'CAMEL', e: '🐫', t: 3 }, { w: 'HOUSE', e: '🏠', t: 3 }, { w: 'PLANE', e: '✈️', t: 3 },
  { w: 'TRAIN', e: '🚆', t: 3 }, { w: 'CLOCK', e: '⌚', t: 3 }, { w: 'WATER', e: '💧', t: 3 }, { w: 'GRAPE', e: '🍇', t: 3 },
  // مستوى 4: ستة حروف
  { w: 'BANANA', e: '🍌', t: 4 }, { w: 'ORANGE', e: '🍊', t: 4 }, { w: 'CARROT', e: '🥕', t: 4 },
  { w: 'RABBIT', e: '🐰', t: 4 }, { w: 'SCHOOL', e: '🏫', t: 4 }, { w: 'GARDEN', e: '🌷', t: 4 },
  { w: 'WINDOW', e: '🪟', t: 4 }, { w: 'DOCTOR', e: '🩺', t: 4 }, { w: 'FLOWER', e: '🌸', t: 4 }, { w: 'MONKEY', e: '🐒', t: 4 },
];
const AR_LETTERS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوية';
const EN_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const WORDS_PER_DAY = 3;   // كلمات يومية لكل لغة
const WORD_XP = 5;
const WORD_COINS = 2;

/* ─────────────── القراءة الصوتية ─────────────── */
/* داخل تطبيق الأندرويد (Capacitor WebView) لا يتوفر نطق المتصفح —
   نستخدم محرك النطق الأصلي للنظام عبر ملحق TextToSpeech، والمتصفح للويب */
function speak(text, lang = 'ar-SA') {
  if (window.JazarahAudio) {
    JazarahAudio.speak(text, lang);
    return;
  }
  const native = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.TextToSpeech;
  if (native) {
    native.speak({ text, lang, rate: 0.9 }).catch(() => {});
    return;
  }
  if (!('speechSynthesis' in window)) {
    if (window.App) App.toast('جهازك لا يدعم القراءة الصوتية 🔇');
    return;
  }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const voices = speechSynthesis.getVoices();
    const match = voices.find(v => v.lang && v.lang.startsWith(lang.slice(0, 2)));
    if (match) u.voice = match;
    u.rate = 0.9;
    speechSynthesis.speak(u);
  } catch (e) { /* تجاهل */ }
}
/* بعض المتصفحات تحمّل قائمة الأصوات متأخرة — نطلبها مبكرًا */
if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); } catch (e) {} }

/* استخراج رابط تضمين يوتيوب من أشكال الروابط المختلفة */
function youtubeEmbed(url) {
  const s = String(url).trim();
  let m = s.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (m) return 'https://www.youtube-nocookie.com/embed/' + m[1];
  m = s.match(/[?&]list=([\w-]+)/);
  if (m) return 'https://www.youtube-nocookie.com/embed/videoseries?list=' + m[1];
  return null;
}

/* مكتبة شخصيات الأفاتار — جزر مرسومة بأوضاع مختلفة، تُفتح بالمستويات */
const AVATAR_BASES = [
  { id: 'c1',  name: 'الجزرة المبتسمة', lvl: 1 },
  { id: 'c2',  name: 'جزرة النشاط',     lvl: 1 },
  { id: 'c3',  name: 'جزرة النجمة',     lvl: 1 },
  { id: 'c9',  name: 'الجزرة النعسانة', lvl: 1 },
  { id: 'c4',  name: 'الجزرة القارئة',  lvl: 2 },
  { id: 'c5',  name: 'جزرة الرياضة',    lvl: 3 },
  { id: 'c6',  name: 'جزرة الطاهي',     lvl: 4 },
  { id: 'c10', name: 'الجزرة المحققة',  lvl: 5 },
  { id: 'c8',  name: 'جزرة الفضاء',     lvl: 6 },
  { id: 'c7',  name: 'الجزرة الملكية',  lvl: 8 },
  { id: 'c11', name: 'الجزرة الخارقة',  lvl: 10 },
  { id: 'c12', name: 'الجزرة الذهبية',  lvl: 12 },
];
/* يحول معرف الشخصية إلى صورة — ويدعم رموز الحسابات القديمة */
function faceHTML(base) {
  if (/^c\d+$/.test(String(base))) return `<img class="carrot-av" src="avatars/${base}.svg" alt="" />`;
  return base || '🥕';
}
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
  { id: 'wordsmith',    emoji: '🔤', name: 'صائد الكلمات',  desc: 'حللت 30 كلمة',                  check: c => (c.wordGame && c.wordGame.totalSolved || 0) >= 30 },
  { id: 'mathwiz',      emoji: '🧮', name: 'عبقري الحساب',  desc: 'حللت 30 مسألة',                 check: c => (c.mathGame && c.mathGame.totalSolved || 0) >= 30 },
  { id: 'quran7',       emoji: '📖', name: 'رفيق القرآن',   desc: '7 أيام وِرد متتالية',           check: c => (c.quran && c.quran.best || 0) >= 7 },
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

/* ─────────────── الروتينات البصرية ─────────────── */
const ROUTINE_TEMPLATES = {
  before_school: {
    title: 'روتين صباح البطل', emoji: '🌤️',
    intro: 'نبدأ صباحنا خطوة صغيرة في كل مرة.',
    steps: [
      ['🛏️', 'رتّب سريرك', 'خمس لمسات سريعة تجعل غرفتك جاهزة.'],
      ['🪥', 'اغسل أسنانك', 'ابتسامة البطل تبدأ هنا.'],
      ['👕', 'ارتد ملابسك', 'اختر ملابسك وجهّز نفسك بهدوء.'],
      ['🎒', 'جهّز حقيبتك', 'تأكد من دفترك ومقلمتك وماءك.'],
    ],
  },
  after_school: {
    title: 'روتين العودة للبيت', emoji: '🏠',
    intro: 'ننتقل من المدرسة إلى البيت بهدوء وترتيب.',
    steps: [
      ['🥤', 'خذ استراحة قصيرة', 'ماء وهدوء قبل المهمة التالية.'],
      ['🎒', 'رتّب حقيبتك', 'ضع أدواتك في مكانها لتبقى جاهزة.'],
      ['📚', 'ابدأ واجبك 15 دقيقة', 'ابدأ بأصغر جزء، ثم أكمل.'],
    ],
  },
  evening: {
    title: 'روتين المساء الهادئ', emoji: '🌙',
    intro: 'نغلق يومنا بهدوء ونجهز للغد.',
    steps: [
      ['🧺', 'رتّب مساحتك', 'اجمع الأشياء في أماكنها.'],
      ['🪥', 'اغسل أسنانك', 'خطوة صغيرة لصحة قوية.'],
      ['👕', 'جهّز ملابس الغد', 'صباح الغد سيكون أسهل.'],
      ['📖', 'هدّئ نفسك قليلًا', 'اقرأ أو تنفس ببطء قبل النوم.'],
    ],
  },
  weekend: {
    title: 'روتين عطلة العائلة', emoji: '🌿',
    intro: 'نصنع وقتًا جميلًا ونساعد بعضنا.',
    steps: [
      ['🧺', 'رتّب مساحتك', 'اجعل مكانك جاهزًا للمغامرة.'],
      ['🏃', 'اختر نشاطًا حركيًا', 'حرّك جسمك قليلًا واستمتع.'],
      ['🤍', 'ساعد العائلة', 'اسأل: ما المهمة الصغيرة التي أستطيع فعلها؟'],
    ],
  },
};

function routineTemplateId(windowId) {
  return ROUTINE_TEMPLATES[windowId] ? windowId : 'after_school';
}

function routineFromTemplate(windowId, supports = [], opts = {}) {
  const templateId = opts.templateId || routineTemplateId(windowId);
  const template = ROUTINE_TEMPLATES[templateId] || ROUTINE_TEMPLATES.after_school;
  return {
    id: opts.id || ('routine-' + uid()),
    templateId,
    window: windowId || templateId,
    title: opts.title || template.title,
    emoji: opts.emoji || template.emoji,
    intro: opts.intro || template.intro,
    active: opts.active !== false,
    audio: opts.audio !== undefined ? opts.audio : supports.includes('audio'),
    timerSeconds: opts.timerSeconds !== undefined ? opts.timerSeconds : (supports.includes('timer') ? 180 : 0),
    steps: (opts.steps || template.steps).map((step, index) => {
      if (typeof step === 'object' && !Array.isArray(step)) return Object.assign({ id: 'step-' + (index + 1) }, step);
      return { id: 'step-' + (index + 1), emoji: step[0], title: step[1], hint: step[2] };
    }),
  };
}

/* ملف طفل كامل — كل بيانات الطفل معزولة تحت حسابه */
function defaultChild(name, avatarBase, avatarBg) {
  return {
    id: uid(),
    name: name || 'البطل',
    username: 'hero_' + uid().slice(0, 5),   // اسم مستخدم فريد — لبطاقة QR والمزامنة مستقبلًا
    avatar: { base: avatarBase || 'c1', bg: avatarBg || AVATAR_BGS[0] },
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
    wordGame: { date: null, arDone: 0, enDone: 0, totalSolved: 0 },
    mathGame: { date: null, done: 0, totalSolved: 0 },
    blurGame: { date: null, done: 0, totalSolved: 0 },
    shadowGame: { date: null, done: 0, totalSolved: 0 },
    quizzesDone: {},        // { quizId: score } اختبارات المعلم المنجزة
    videosWatched: {},      // { videoId: true } لمكافأة أول مشاهدة
    myVouchers: [],         // قسائم الشركاء المشتراة
    quran: { date: null, seconds: 0, claimed: false, streak: 0, best: 0, lastDay: null, totalSeconds: 0 },
    quranDaily: 5,          // ورد القراءة اليومي بالدقائق (يحدده الوالد)
    quranPath: { pos: 0, ayah: 0, done: {} },   // موقع الطفل في رحلة البراعم
    journey: { stage: 0, date: null, xpToday: 0, advanced: 0, lastXP: null },   // رحلة العوالم
    screenTime: { balance: 0, log: [] },     // محفظة وقت الشاشة بالدقائق
    wishes: [],                              // قائمة الأمنيات { id, title, status, cost, rewardId }
    lunchGame: { date: null, done: 0, totalSolved: 0 },
    birthdate: null,        // YYYY-MM-DD — للاحتفال بعيد الميلاد
    grade: 'g1',            // المرحلة الدراسية kg1..g6
    lastBirthdayYear: null, // آخر سنة احتفلنا فيها بميلاده
    feed: [],               // يوميات الطفل { id, e, title, ts, img, heart, seen }
    myPickDate: null,       // تاريخ آخر «مهمة أختارها أنا»
    mapMode: 'planet',      // عرض الرحلة: 'planet' كوكب تفاعلي | 'list' قائمة كلاسيكية
    routines: [],            // روتينات بصرية يضبطها الوالد
    routineProgress: { date: null, byRoutine: {} },
    reminders: { enabled: false, slots: [] }, // حتى تذكيرين اختياريين في اليوم، مرتبطين بروتين الطفل
    worldBloom: { earned: 0, restored: 0, lastMilestone: 0 }, // أثر إنجازات الطفل في عالم جزّور
    weeklyReview: { actions: {}, seenWeeks: {} }, // قرارات مراجعة الأسبوع المحلية
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
    videos: [],            // مكتبة فيديوهات تعليمية يضيفها الوالد { id, title, url }
    quizzes: [],           // اختبارات المعلمين التفاعلية { id, title, teacher, questions }
    vouchers: [],          // قسائم شركاء بخصم مقابل كود { id, partner, title, cost, code, emoji, used }
    family: { city: '', district: '', school: '' },   // يدخلها الوالد لفتح سوق العروض
    onboarding: { version: 1, status: 'pending', draft: null, completedAt: null },
    screenPerTask: 10,     // دقائق شاشة تُكسب مع كل مهمة منجزة (0 = إيقاف)
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
function heroBase(c) { return (c && c.avatar && c.avatar.base) || 'c1'; }
function heroFace(c) { return faceHTML(heroBase(c)); }
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
  let pool;
  if (isWeekend()) {
    // الويكند: بلا دراسة — نشاطات عائلية ورياضة وإيمان بدلها
    pool = WEEKEND_LIBRARY.concat(TASK_LIBRARY.filter(t => t.cat !== 'study' && ap.goals.includes(t.cat)))
      .filter(t => !manualTitles.has(t.title));
  } else {
    pool = TASK_LIBRARY.filter(t => ap.goals.includes(t.cat) && !manualTitles.has(t.title));
  }
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

/* ─────────────── رحلة العوالم: التقدم الأساسي ───────────────
   8 عوالم × 10 مراحل. المرحلة = جهد يوم جيد (60 XP)، بحد أقصى مرحلة
   واحدة يوميًا — الطريق الوحيد للتقدم هو العمل المنتظم. المرحلة
   العاشرة من كل عالم "بوابة زعيم" تحتاج جهدًا مضاعفًا (120 XP) */
const WORLDS = [
  { name: 'وادي الجزر',      emoji: '🥕', color: '#e5732a', grad: ['#ffedd5', '#ffd8b8'] },
  { name: 'الغابة المسحورة', emoji: '🌲', color: '#2e7d4f', grad: ['#d9f2e0', '#b8e6c8'] },
  { name: 'الصحراء الذهبية', emoji: '🏜️', color: '#b8860b', grad: ['#fdf3d8', '#f5e3ae'] },
  { name: 'أعماق البحر',     emoji: '🌊', color: '#1f6fa8', grad: ['#d6ecfb', '#b4dcf5'] },
  { name: 'القمم الثلجية',   emoji: '🏔️', color: '#5f8fb0', grad: ['#eaf4fb', '#d3e7f5'] },
  { name: 'مدينة البراكين',  emoji: '🌋', color: '#b03a2e', grad: ['#fde3dc', '#f9c8bc'] },
  { name: 'الفضاء',          emoji: '🚀', color: '#4636b8', grad: ['#e4e0fb', '#cdc6f5'] },
  { name: 'مملكة التنانين',  emoji: '🐉', color: '#7a1fa2', grad: ['#f2e0fb', '#e3c4f5'] },
];
const STAGES_PER_WORLD = 10;
const TOTAL_STAGES = WORLDS.length * STAGES_PER_WORLD;
const STAGE_XP = 60;
const BOSS_XP = 120;

function worldOf(stage) { return WORLDS[Math.min(WORLDS.length - 1, Math.floor(stage / STAGES_PER_WORLD))]; }
function worldIndexOf(stage) { return Math.min(WORLDS.length - 1, Math.floor(stage / STAGES_PER_WORLD)); }
function stageInWorld(stage) { return (stage % STAGES_PER_WORLD) + 1; }
function isBossStage(stage) { return stage % STAGES_PER_WORLD === STAGES_PER_WORLD - 1; }
function stageNeedXP(stage) { return isBossStage(stage) ? BOSS_XP : STAGE_XP; }

/* تُستدعى بعد كل كسب نقاط: تحسب جهد اليوم من فرق XP وتتقدم في الرحلة
   (تلتقط كل مصادر النقاط تلقائيًا دون لمس كل موضع كسب) */
function journeyUpdate(c) {
  if (!c.journey) c.journey = { stage: 0, date: null, xpToday: 0, advanced: 0, lastXP: c.xp };
  const j = c.journey;
  const today = todayKey();
  if (j.date !== today) { j.date = today; j.xpToday = 0; j.advanced = 0; }
  if (j.lastXP === undefined || j.lastXP === null) j.lastXP = c.xp;
  const delta = c.xp - j.lastXP;
  if (delta > 0) j.xpToday += delta;
  j.lastXP = c.xp;

  const events = [];
  // مرحلة واحدة يوميًا كحد أقصى — الانتظام لا السباق
  if (j.advanced < 1 && j.stage < TOTAL_STAGES && j.xpToday >= stageNeedXP(j.stage)) {
    const wasBoss = isBossStage(j.stage);
    const prevWorld = worldIndexOf(j.stage);
    j.stage++;
    j.advanced++;
    const newWorld = worldIndexOf(j.stage);
    if (wasBoss && newWorld > prevWorld) events.push({ type: 'world', world: newWorld });
    else if (j.stage >= TOTAL_STAGES) events.push({ type: 'finish' });
    else events.push({ type: 'stage', stage: j.stage });
  }
  if (events.length) save();
  return events;
}

/* ─────────────── حكاية جزّور: قصة مسلسلة ───────────────
   فصل واحد يُفتح مع كل مرحلة تُنجز في رحلة العوالم — كل فصل ينتهي
   بتشويق يجعل الطفل ينتظر الغد. STORY[i] = ما حدث في المرحلة i */
const STORY = [
  // 🥕 وادي الجزر (1-10)
  'استيقظ جزّور صباحًا فوجد ألوان وادي الجزر قد اختفت! كل شيء رمادي… وعلى الأرض أثر أقدام ضخمة. من ترك هذا الأثر؟',
  'تبع جزّور الأثر حتى بيت الجدة أرنوبة، فقالت له: «وحش الكسل سرق بذور النور الثماني!». ماذا يوجد في الخريطة التي أعطته إياها؟',
  'فتح جزّور الخريطة فإذا فيها ثمانية عوالم، في كل عالم بذرة نور مخبأة. لكن الخريطة ناقصة… أين قطعتها الأولى؟',
  'وجد جزّور القطعة الأولى تحت جسر الوادي، وسمع صوتًا يهمس: «لن تصل أبدًا أيها الجزر الصغير!». من صاحب الصوت؟',
  'ظهر ثعلوب، مساعد وحش الكسل! ركض جزّور بسرعة البرق ونجا منه. لكن ثعلوب أسقط شيئًا لامعًا من جيبه…',
  'التقط جزّور مفتاحًا ذهبيًا صغيرًا مكتوبًا عليه: «باب الينبوع». أين يا ترى هذا الباب؟',
  'دلّه عصفور الوادي على صخرة عليها ثقب مفتاح! فتح جزّور الباب فوجد سلّمًا يهبط تحت الأرض…',
  'في أسفل السلم وجد جزّور ينبوع الألوان القديم، لكنه جاف تمامًا. على الحائط كُتب: «الماء يعود بهزيمة الحارس»…',
  'خرج جزّور ليستعد، فأعطته الجدة أرنوبة درعًا من أوراق الجزر: «غدًا تواجه حارس الوادي. نم مبكرًا يا بطل!»',
  'واجه جزّور حارس الوادي الحجري وهزمه بذكائه! انفجر الينبوع بالألوان وظهرت بذرة النور الأولى ✨ لكن الخريطة أشارت إلى غابة مظلمة…',
  // 🌲 الغابة المسحورة (11-20)
  'دخل جزّور الغابة المسحورة فسمع الأشجار تتهامس: «جزر صغير… جزر شجاع…». هل الأشجار هنا تتكلم حقًا؟',
  'تكلمت شجرة عجوز: «بذرة النور عند ملكة اليراعات، لكن ضوءها انطفأ منذ جاء وحش الكسل». كيف يعيد جزّور الضوء؟',
  'قرر جزّور جمع قطرات الندى المضيئة. جمع سبع قطرات… لكن القطرة الثامنة كانت في عش النسر العملاق!',
  'تسلل جزّور بهدوء إلى العش… وأخذ القطرة! لكن ريشة سقطت وأيقظت النسر. ماذا سيفعل الآن؟',
  'صرخ جزّور: «أنا لست لصًا! أجمع الضوء لأنقذ الغابة». فأعجب النسر بصدقه وحمله على جناحيه إلى بحيرة اليراعات!',
  'أضاء جزّور القطرات الثماني حول البحيرة فاستيقظت اليراعات واحدة تلو الأخرى… ما أجمل المنظر! لكن أين الملكة؟',
  'ظهرت ملكة اليراعات من زهرة كبيرة وقالت: «شكرًا يا جزّور! لكن ثعلوب حبس أصدقائي في قفص شوكي…»',
  'وجد جزّور القفص الشوكي وفكّر: القوة لن تفتحه، لكن الماء يلين الشوك! سقاه من ماء الينبوع حتى فُتح القفص 🎉',
  'أقامت الغابة مهرجان الأضواء احتفالًا بجزّور، وقالت الملكة: «غدًا أعطيك البذرة… فاستعد للرحيل نحو الرمال الذهبية»',
  'أعطته الملكة بذرة النور الثانية ✨ وأضاءت له طريق الخروج. عند حافة الغابة، لاحت في الأفق صحراء تلمع كالذهب…',
  // 🏜️ الصحراء الذهبية (21-30)
  'وصل جزّور إلى الصحراء الذهبية والشمس فوق رأسه. من بعيد رأى قافلة جِمال تسير… إلى أين تتجه؟',
  'قابل جزّور الجمل سالم قائد القافلة فقال له: «بذرة النور في المدينة المفقودة، ولا يعرف طريقها إلا البوصلة الذهبية»',
  'البوصلة الذهبية عند تاجر عجوز في السوق، لا يبيعها بالمال — بل بحل لغزه! هل ينجح جزّور؟',
  'قال التاجر: «ما الشيء الذي كلما أخذت منه كبُر؟». فكّر جزّور طويلًا ثم صاح: «الحفرة!» فضحك التاجر وأعطاه البوصلة!',
  'سارت القافلة خلف البوصلة يومًا كاملًا… وفجأة تحرك الرمل تحتهم: عاصفة رملية قادمة!',
  'احتمى الجميع خلف صخرة كبيرة، وحمى جزّور صغير الجمال بدرعه الورقي. لما هدأت العاصفة… ظهرت أبواب المدينة المفقودة من تحت الرمل!',
  'دخل جزّور المدينة الذهبية فوجدها نائمة: كل تماثيلها كانت حرّاسًا حوّلهم وحش الكسل إلى حجر…',
  'في وسط المدينة نافورة مكتوب عليها: «من يوقظ المدينة؟ من يعمل ولا يكسل». وضع جزّور بذرتي النور فوق النافورة…',
  'توهجت النافورة وبدأ الحجر يتشقق عن الحراس ببطء! قال سالم: «ناموا الليلة هنا، غدًا تستيقظ المدينة كاملة»',
  'استيقظت المدينة الذهبية بأكملها وهتف الحراس باسم جزّور! أعطوه بذرة النور الثالثة ✨ وقالوا: «التالية في مكان لا تصله الشمس… تحت البحر!»',
  // 🌊 أعماق البحر (31-40)
  'وقف جزّور أمام البحر متعجبًا: كيف ينزل جزر إلى الأعماق دون أن يغرق؟ وفجأة طفت أمامه فقاعة عملاقة!',
  'كانت الفقاعة مركبة السلحفاة الحكيمة أم مئة عام! قالت: «اركب يا بطل، سمعت الأسماك تتحدث عنك». وغاصت المركبة…',
  'مرّا بحديقة شعاب مرجانية رمادية حزينة. قالت السلحفاة: «كانت أجمل ألوان البحر… قبل أن يمر وحش الكسل من هنا»',
  'قابلهما حصان بحر صغير يبكي: «أخي علق في شبكة قديمة!». هل يستطيع جزّور مساعدته في الأعماق؟',
  'قصّ جزّور الشبكة بورقة من أوراقه الحادة وحرر حصان البحر! فأهداه صدفة تسمع منها همس البحر كله…',
  'همست الصدفة: «بذرة النور في مدينة اللؤلؤ… واحذر سمكة الظلام التي تحرس بوابتها»',
  'عند بوابة مدينة اللؤلؤ ظهرت سمكة الظلام الضخمة! لكن جزّور لاحظ شيئًا غريبًا: السمكة كانت تبكي…',
  'قالت السمكة: «لست شريرة! وحش الكسل أطفأ فانوسي فصار الجميع يخافني في العتمة». فأشعل جزّور فانوسها بقطرة ندى مضيئة!',
  'فتحت السمكة البوابة بنفسها ورافقته إلى قصر اللؤلؤ. قال ملك البحر: «نم في القصر الليلة يا ضيفنا، وغدًا لك ما وعدنا»',
  'أعطاه ملك البحر بذرة النور الرابعة ✨ داخل محارة ذهبية، ورفعته الفقاعة إلى السطح… حيث لاحت قمم جبال بيضاء تلمع كالسكر!',
  // 🏔️ القمم الثلجية (41-50)
  'وصل جزّور إلى سفح القمم الثلجية يرتجف من البرد. من ينسج له معطفًا في هذا الصقيع؟',
  'وجد كوخًا صغيرًا فيه أرنبة تنسج الصوف، قالت: «معطف مقابل حكاية!». فحكى لها مغامراته وحصل على أدفأ معطف!',
  'صعد جزّور الجبل فوجد الجسر الجليدي مكسورًا والوادي عميق… كيف سيعبر إلى القمة؟',
  'رأى جزّور عائلة من الوعول تقفز بين الصخور، فعلمته الوعول الصغيرة القفز الآمن خطوة خطوة حتى عبر!',
  'في منتصف الجبل هبت عاصفة ثلجية، فاحتمى جزّور في كهف… وسمع صوت أنين عميق يخرج من داخله!',
  'كان الأنين لطائر الثلج العملاق، جناحه مجروح! ضمّد جزّور جرحه بورقة من أوراقه ودفّأه حتى نام…',
  'استيقظ طائر الثلج معافى وقال: «أنا حارس بذرة النور! لكنها تجمدت في قلب بحيرة الجليد منذ زمن الكسل…»',
  'حمل الطائر جزّورًا فوق القمم إلى البحيرة المتجمدة. قال: «لن يذيب الجليد إلا دفء قلب مجتهد… ضع يدك عليه»',
  'وضع جزّور يده على الجليد وتذكر كل اجتهاده… فبدأ الجليد يذوب ببطء ويلمع! قال الطائر: «غدًا تكتمل الذوبة، نم هنا في عشي الدافئ»',
  'ذاب الجليد وأشرقت بذرة النور الخامسة ✨ من قلب البحيرة! حملها جزّور وودّع الطائر… ومن القمة رأى مدينة حمراء تتوهج: مدينة البراكين!',
  // 🌋 مدينة البراكين (51-60)
  'نزل جزّور نحو مدينة البراكين حيث الأرض دافئة والسماء برتقالية. عند البوابة وقف حارس من صخر ناري…',
  'قال الحارس: «لا يدخل مدينتنا إلا شجاع القلب. أرني شجاعتك!» فأراه جزّور بذور النور الخمس، فانحنى الحارس احترامًا!',
  'في المدينة قابل جزّور صانعة البلورات النارية شرارة، قالت: «بذرة النور سقطت في نهر الحمم! ولا أحد يجرؤ على الاقتراب…»',
  'فكّر جزّور: «الحمم لا تُلمس، لكن يمكن صناعة جسر!». فبدأ مع شرارة جمع الصخور الباردة… كم صخرة يحتاجان؟',
  'عمل الاثنان يومًا كاملًا وبنيا نصف الجسر. قالت شرارة: «تعبنا اليوم يثمر غدًا» — وهذا ما يقوله والدك أيضًا!',
  'اكتمل الجسر! مشى جزّور فوق نهر الحمم خطوة خطوة… وفي المنتصف رأى البذرة تلمع على صخرة صغيرة',
  'وفجأة اهتز البركان! صخور تتساقط والجسر يتمايل… ثبّت جزّور قدميه وتذكر تدريب الوعول!',
  'قفز جزّور القفزة الأخيرة وأمسك البذرة! لكن الجسر انهار خلفه… كيف سيعود؟',
  'أطلقت شرارة طائرتها الورقية النارية فتعلق بها جزّور وطارت به فوق النهر إلى الأمان! هتفت المدينة كلها لبطل الجزر',
  'احتفلت مدينة البراكين وسلمته بذرة النور السادسة ✨ ثم أشارت شرارة إلى السماء: «البذرة السابعة… ليست على الأرض أصلًا!»',
  // 🚀 الفضاء (61-70)
  'بنى مهندسو مدينة البراكين لجزّور صاروخًا صغيرًا برتقاليًا! ارتدى خوذته وعدّ: ثلاثة… اثنان… واحد…',
  'انطلق الصاروخ! رأى جزّور بيته يصغر والأرض تصير كرة زرقاء جميلة. «كم هي جميلة! سأحميها بالنور» قال لنفسه…',
  'رست المركبة على القمر، فوجد جزّور آثار أقدام صغيرة تقوده إلى فوهة عميقة… من يسكن القمر؟',
  'في الفوهة قابل قمرون، كائنًا فضيًا لطيفًا يجمع النجوم الساقطة! قال: «بذرة النور؟ رأيتها! سرقها ثعلوب وهرب إلى حزام الكويكبات!»',
  'طار جزّور وقمرون بين الكويكبات المتدحرجة، يراوغان يمينًا ويسارًا… وأخيرًا لمحا مركبة ثعلوب!',
  'طاردا ثعلوب حتى حاصراه عند سديم ملون. صاح ثعلوب: «لن أعطيك البذرة أبدًا!» ورمى شبكة نجمية على مركبتهما!',
  'قص جزّور الشبكة وقال لثعلوب بهدوء: «لماذا تخدم وحش الكسل وهو لا يعطيك شيئًا؟». فتردد ثعلوب لأول مرة…',
  'اعترف ثعلوب: «وعدني بجبل من الحلوى ولم يفِ أبدًا…». قال جزّور: «تعال معنا، والصديق خير من ألف وعد كاذب»',
  'سلّم ثعلوب البذرة السابعة ✨ بنفسه وصار صديقًا! ناما تلك الليلة في محطة قمرون يشاهدان الشهب…',
  'قال قمرون مودعًا: «البذرة الأخيرة في مملكة التنانين… حيث يسكن وحش الكسل نفسه». شدّ جزّور حزامه: المعركة الأخيرة اقتربت!',
  // 🐉 مملكة التنانين (71-80)
  'هبط الصاروخ في مملكة التنانين: قلاع فوق السحاب وتنانين تحلق في كل مكان… لكن أجنحتها بطيئة حزينة. لماذا؟',
  'قال تنين صغير اسمه لهب: «وحش الكسل ينفث ضباب النعاس كل صباح فننام عن التحليق… حتى ملكنا نائم منذ شهور!»',
  'قرر جزّور إيقاظ الملك أولًا. صنع من أوراقه وبذور النور السبع بوقًا مضيئًا… فهل ينفع النور مع النعاس؟',
  'نفخ جزّور في البوق فخرج نور ولحن جميل! فتح الملك عينًا واحدة وقال بصوت نعسان: «من… من أيقظني؟»',
  'وقف الملك التنين لأول مرة منذ شهور وقال: «أيها الجزر الشجاع، وحش الكسل في القلعة السوداء. سأحملك إليها… إن كان قلبك جاهزًا»',
  'حلّق جزّور على ظهر الملك نحو القلعة السوداء، ومعه لهب وثعلوب. عند البوابة نفث الوحش أول موجة ضباب نعاس!',
  'صمد جزّور وتذكر كل يوم اجتهد فيه: المهام والقراءة والقرآن… كل إنجاز صار درعًا من نور حوله!',
  'دخل جزّور القلعة فرأى وحش الكسل عملاقًا رماديًا… لكنه لاحظ شيئًا: الوحش نفسه يتثاءب ويذبل. سرّ قوته يضعف أمام المجتهدين!',
  'صاح الوحش: «نم يا جزّور! ارتح! أجّل كل شيء لغد!» فأجاب جزّور: «أرتاح بعد الإنجاز، وأنام لأصحو أقوى!» وارتفع نوره أكثر…',
  'وضع جزّور البذور الثماني في قلب القلعة فانفجر النور في كل مكان! ذاب وحش الكسل وصار غيمة صغيرة هربت بعيدًا. عادت الألوان لكل العوالم، وتوّجت التنانين جزّورًا: بطل العوالم الثمانية 👑 والبطل الحقيقي… هو أنت!',
];

/* «مهمة أختارها أنا» — استقلالية بجرعة يومية آمنة: الطفل يختار مهمة واحدة */
const KID_PICKS = [
  { emoji: '🛏️', title: 'أرتب سريري بنفسي',        cat: 'kindness' },
  { emoji: '🤲', title: 'أساعد ماما أو بابا',       cat: 'kindness' },
  { emoji: '📚', title: 'أقرأ قصة قبل النوم',       cat: 'study' },
  { emoji: '🎨', title: 'أرسم لوحة جميلة',          cat: 'study' },
  { emoji: '🤸', title: 'أتمرن ١٠ دقائق',           cat: 'sport' },
  { emoji: '🪴', title: 'أسقي النباتات',            cat: 'kindness' },
  { emoji: '🧸', title: 'أرتب ألعابي',              cat: 'kindness' },
  { emoji: '🦷', title: 'أنظف أسناني دون تذكير',    cat: 'health' },
  { emoji: '💧', title: 'أشرب ٦ أكواب ماء',         cat: 'health' },
  { emoji: '🕌', title: 'أحفظ دعاءً جديدًا',         cat: 'faith' },
  { emoji: '👶', title: 'ألعب مع أخي الصغير',       cat: 'kindness' },
  { emoji: '🚶', title: 'أمشي مع عائلتي',           cat: 'sport' },
];

/* يوميات الطفل: شريط أحداث يراه الوالد كقصص العائلة ويرسل عليه ❤️ */
function feedPush(c, emoji, title, img) {
  if (!c.feed) c.feed = [];
  c.feed.unshift({ id: uid(), e: emoji, title, ts: Date.now(), img: img || null, heart: false, seen: false });
  // الصور تبقى لأحدث الأحداث فقط حفاظًا على حجم التخزين والمزامنة
  c.feed.slice(10).forEach(f => { f.img = null; });
  if (c.feed.length > 60) c.feed = c.feed.slice(0, 60);
}

/* وقت حدث اليوميات بصيغة ودية: اليوم بالساعة، أمس، أو التاريخ */
function feedTimeStr(ts) {
  const d = new Date(ts);
  const key = todayKey(d);
  if (key === todayKey()) return 'اليوم ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  if (key === dayKeyOffset(-1)) return 'أمس';
  return key;
}

/* عضوية الولاء: خصم في المتجر بحسب إجمالي الجزر المجموع مدى الحياة */
function loyaltyTier(c) {
  const t = c.lifetimeCoins || 0;
  if (t >= 600) return { name: 'ذهبية', emoji: '🥇', off: 15 };
  if (t >= 300) return { name: 'فضية', emoji: '🥈', off: 10 };
  if (t >= 100) return { name: 'برونزية', emoji: '🥉', off: 5 };
  return { name: '', emoji: '', off: 0 };
}
/* خصم الشريك بحسب عالم الطفل في رحلة العوالم */
function partnerOff(voucher) {
  const world = worldIndexOf((C().journey && C().journey.stage) || 0);
  let off = 0;
  for (const l of (voucher.ladder || [])) if (world >= l.world && l.off > off) off = l.off;
  return off;
}

function discountedCost(cost, tier) {
  if (!tier.off) return cost;
  return Math.max(1, Math.ceil(cost * (100 - tier.off) / 100));
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
        s.videos = s.videos || [];
        s.quizzes = s.quizzes || [];
        s.vouchers = s.vouchers || [];
        s.family = s.family || { city: '', district: '', school: '' };
        // لا نقطع على الأسر القديمة باستبيان جديد؛ يظهر الاستبيان تلقائيًا للأسر المنشأة بعد هذا الإصدار فقط.
        if (!old.onboarding) s.onboarding = { version: 1, status: 'legacy', draft: null, completedAt: null };
        else s.onboarding = Object.assign({ version: 1, status: 'pending', draft: null, completedAt: null }, old.onboarding);
        if (s.screenPerTask === undefined) s.screenPerTask = 10;
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

/* ─── تذكيرات انتقالية هادئة: اختيارية، محلية، وبحد أقصى تذكيرين يوميًا ─── */
const ReminderEngine = {
  maxSlots: 2,
  _tickTimer: null,

  normalize(child) {
    if (!child.reminders || typeof child.reminders !== 'object') child.reminders = { enabled: false, slots: [] };
    child.reminders.enabled = !!child.reminders.enabled;
    child.reminders.slots = Array.isArray(child.reminders.slots) ? child.reminders.slots.slice(0, this.maxSlots) : [];
    child.reminders.slots = child.reminders.slots.map((slot, index) => Object.assign({
      id: 'r' + index, enabled: false, routineId: '', time: index ? '19:00' : '07:00', kind: index ? 'gentle' : 'start',
    }, slot));
    return child.reminders;
  },

  activeSlots(child) {
    const cfg = this.normalize(child);
    if (!cfg.enabled) return [];
    return cfg.slots.filter(s => s.enabled && /^([01]\d|2[0-3]):[0-5]\d$/.test(s.time || '')).slice(0, this.maxSlots);
  },

  plugin() {
    return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
  },

  nativeId(child, slot, index) {
    const childIndex = Math.max(0, S.children.findIndex(c => c.id === child.id));
    return 7100 + childIndex * 10 + index;
  },

  routineFor(child, slot) {
    return (child.routines || []).find(r => r.id === slot.routineId) || (child.routines || [])[0] || null;
  },

  copy(child, slot) {
    const routine = this.routineFor(child, slot);
    const title = routine ? routine.title : 'روتينك';
    return slot.kind === 'gentle'
      ? { title: 'جزّور معك بهدوء', body: `هل تحتاج خطوة صغيرة لإكمال ${title}؟` }
      : { title: 'حان وقت روتينك', body: `${child.name}، نبدأ ${title} بخطوة واحدة فقط.` };
  },

  async requestPermission() {
    const p = this.plugin();
    if (!p) return { native: false, granted: false };
    let permission = await p.checkPermissions();
    if (permission.display !== 'granted') permission = await p.requestPermissions();
    return { native: true, granted: permission.display === 'granted' };
  },

  async scheduleChild(child) {
    const p = this.plugin();
    if (!p) return { native: false, scheduled: 0 };
    const allIds = [0, 1].map(i => this.nativeId(child, { id: 'r' + i }, i));
    try { await p.cancel({ notifications: allIds.map(id => ({ id })) }); } catch (e) { /* لا توجد تذكيرات سابقة */ }
    const slots = this.activeSlots(child);
    if (!slots.length) return { native: true, scheduled: 0 };
    const permission = await this.requestPermission();
    if (!permission.granted) throw new Error('لم يُمنح إذن الإشعارات. يمكنك تفعيله من إعدادات الجهاز متى رغبت.');
    const notifications = slots.map((slot, index) => {
      const [hour, minute] = slot.time.split(':').map(Number);
      const copy = this.copy(child, slot);
      return {
        id: this.nativeId(child, slot, index),
        title: copy.title,
        body: copy.body,
        channelId: 'jazour-routines',
        autoCancel: true,
        extra: { childId: child.id, routineId: (this.routineFor(child, slot) || {}).id || '', reminderSlot: slot.id },
        schedule: { on: { hour, minute }, allowWhileIdle: true, isExactNotification: false },
      };
    });
    try { await p.createChannel({ id: 'jazour-routines', name: 'تذكيرات جزّور الهادئة', description: 'تذكيرات روتين اختيارية', importance: 3, visibility: 1, sound: 'default', vibration: true }); } catch (e) { /* القناة موجودة أو لا يدعمها الجهاز */ }
    await p.schedule({ notifications });
    return { native: true, scheduled: notifications.length };
  },

  async scheduleAll() {
    const results = [];
    for (const child of S.children) results.push(await this.scheduleChild(child));
    return results;
  },

  startForegroundChecks() {
    clearInterval(this._tickTimer);
    this.tick();
    this._tickTimer = setInterval(() => this.tick(), 30000);
  },

  tick() {
    const child = C();
    if (!child) return;
    const now = new Date();
    const hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const seenKey = 'jazarah_reminders_seen_' + todayKey();
    let seen = [];
    try { seen = JSON.parse(sessionStorage.getItem(seenKey) || '[]'); } catch (e) { seen = []; }
    const due = this.activeSlots(child).find(slot => slot.time === hhmm && !seen.includes(child.id + ':' + slot.id));
    if (!due) return;
    seen.push(child.id + ':' + due.id);
    sessionStorage.setItem(seenKey, JSON.stringify(seen));
    const copy = this.copy(child, due);
    if (window.App && App.toast) App.toast('🔔 ' + copy.body);
    const routine = this.routineFor(child, due);
    if (routine && routine.audio) speak(copy.body, 'ar-SA');
  },
};

/* ─── حلقة عالم جزّور: أثر مرئي لكل مهمة، بلا اقتصاد إضافي أو ضغط على الطفل ─── */
const WORLD_BLOOM_STEPS = [
  { needed: 0, emoji: '🌱', title: 'بذرة البداية', note: 'كل إنجاز يضيف نورًا صغيرًا إلى عالم جزّور.' },
  { needed: 2, emoji: '🌿', title: 'نبتة الأمل', note: 'بدأت البذرة تكبر بفضل خطواتك.' },
  { needed: 5, emoji: '🪴', title: 'ركن أخضر', note: 'عالم جزّور أصبح أكثر دفئًا.' },
  { needed: 9, emoji: '🌉', title: 'جسر المغامرة', note: 'ترمم جسرًا يقرّبك من رحلة جديدة.' },
  { needed: 15, emoji: '🏡', title: 'واحة جزّور', note: 'بنيت مكانًا جميلًا بالاستمرار الهادئ.' },
  { needed: 24, emoji: '✨', title: 'عالم مضيء', note: 'العالم يلمع لأنك واصلت المحاولة.' },
];

function worldBloomStatus(child) {
  child.worldBloom = Object.assign({ earned: 0, restored: 0, lastMilestone: 0 }, child.worldBloom || {});
  const earned = Math.max(0, Number(child.worldBloom.earned) || 0);
  let index = 0;
  for (let i = 0; i < WORLD_BLOOM_STEPS.length; i++) if (earned >= WORLD_BLOOM_STEPS[i].needed) index = i;
  const stage = WORLD_BLOOM_STEPS[index];
  const next = WORLD_BLOOM_STEPS[index + 1] || null;
  const within = next ? Math.max(0, earned - stage.needed) : 1;
  const span = next ? Math.max(1, next.needed - stage.needed) : 1;
  return { earned, index, stage, next, percent: next ? Math.min(100, Math.round(within / span * 100)) : 100 };
}

function advanceWorldBloom(child) {
  const before = worldBloomStatus(child);
  child.worldBloom.earned = before.earned + 1;
  const after = worldBloomStatus(child);
  if (after.index > before.index) {
    child.worldBloom.restored = after.index;
    child.worldBloom.lastMilestone = after.earned;
    feedPush(child, after.stage.emoji, `رمم في عالم جزّور: ${after.stage.title}`);
    return after;
  }
  return null;
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

  // محفظة وقت الشاشة: كل مهمة منجزة = دقائق لعب (يضبطها الوالد)
  if (S.screenPerTask > 0) {
    if (!C().screenTime) C().screenTime = { balance: 0, log: [] };
    C().screenTime.balance += S.screenPerTask;
    C().screenTime.log.push({ date: dateKey, mins: S.screenPerTask, kind: 'earn' });
    if (C().screenTime.log.length > 60) C().screenTime.log = C().screenTime.log.slice(-60);
  }

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

  // عالم جزّور يتغير بصريًا مع الإنجاز، بلا عملات أو XP إضافية.
  const worldBloom = advanceWorldBloom(C());
  // يوميات الطفل — يظهر الإنجاز في شريط يوم الوالد
  feedPush(C(), (CATEGORIES[t.cat] && CATEGORIES[t.cat].emoji) || '⭐', t.title ? 'أنجز: ' + t.title : 'أنجز مهمة');
  const newLevel = levelOf(C().xp);
  if (newLevel > prevLevel) feedPush(C(), '🆙', `ترقّى للمستوى ${newLevel}!`);

  save();
  return { bonus, allDone, leveledUp: newLevel > prevLevel, newLevel, worldBloom };
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
    this._applyWorldTheme();
    this.kidTab('map');
    this.refreshKidHeader();
    ReminderEngine.startForegroundChecks();
    // عيد ميلاد البطل؟ 🎂 — الاحتفال الأهم يتقدم الجميع
    const c = C();
    const thisYear = new Date().getFullYear();
    if (c.birthdate && daysToBirthday(c.birthdate) === 0 && c.lastBirthdayYear !== thisYear) {
      c.lastBirthdayYear = thisYear;
      const gift = 20;
      c.coins += gift;
      c.lifetimeCoins += gift;
      save();
      const age = ageOf(c.birthdate);
      this.celebrate(`عيد ميلاد سعيد يا ${esc(c.name)}! 🎂`,
        `${age ? `أتممت ${age} سنة اليوم — ` : ''}كل عام وأنت بطل! هديتك من جَزَرة 🎁`,
        [`+${gift} 🥕 هدية العيد`], '🎂');
      speak(`عيد ميلاد سعيد يا ${c.name}! كل عام وأنت بخير`, 'ar-SA');
      this.refreshKidHeader();
      return;
    }
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
      // هدية الدخول أصبحت بطاقة اختيارية في مسار اليوم حتى لا تقطع على الطفل مهمته التالية.
      this.renderKMap();
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
      // الأسرة المنشأة للتو تبدأ بخطة مخصصة بدل المهام الافتراضية العامة.
      S.onboarding = { version: 1, status: 'pending', draft: null, completedAt: null };
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
    if (this.needsOnboarding()) {
      this.startOnboarding();
      return;
    }
    this.renderChildSwitcher();
    this.parentTab('tasks');
    this.refreshParentSubtitle();
  },

  /* ─────── استبيان بداية الأسرة وخطة اليوم الأول ─────── */
  needsOnboarding() {
    return !S.onboarding || S.onboarding.status === 'pending';
  },

  onboardingDefaults() {
    return {
      focusAreas: [],
      routineWindow: '',
      structure: '',
      rewards: '',
      supports: [],
    };
  },

  startOnboarding(step = 0, draft) {
    const stored = (S.onboarding && S.onboarding.draft) || {};
    this._onboardingDraft = Object.assign(this.onboardingDefaults(), stored, this._onboardingDraft || {}, draft || {});
    this._onboardingStep = step;
    this.renderOnboarding();
  },

  onboardingPick(key, value, multi = false, limit = 2) {
    const d = this._onboardingDraft || this.onboardingDefaults();
    if (multi) {
      const chosen = Array.isArray(d[key]) ? d[key].slice() : [];
      const at = chosen.indexOf(value);
      if (at >= 0) chosen.splice(at, 1);
      else if (chosen.length < limit) chosen.push(value);
      else { this.toast(`اختر حتى ${limit} فقط`); return; }
      d[key] = chosen;
    } else d[key] = value;
    this._onboardingDraft = d;
    this.renderOnboarding();
  },

  onboardingNext() {
    const d = this._onboardingDraft || this.onboardingDefaults();
    const checks = [
      () => d.focusAreas && d.focusAreas.length,
      () => !!d.routineWindow,
      () => !!d.structure,
      () => !!d.rewards,
      () => true,
    ];
    if (!checks[this._onboardingStep]()) {
      this.toast('اختر ما يناسب أسرتك أولًا');
      return;
    }
    if (this._onboardingStep >= 4) { this.renderOnboardingPreview(); return; }
    this._onboardingStep += 1;
    this.renderOnboarding();
  },

  onboardingBack() {
    if (this._onboardingStep <= 0) return;
    this._onboardingStep -= 1;
    this.renderOnboarding();
  },

  onboardingSkip() {
    S.onboarding = { version: 1, status: 'skipped', draft: null, completedAt: new Date().toISOString() };
    save();
    this.closeModal();
    this.openParent();
  },

  renderOnboarding() {
    const d = this._onboardingDraft || this.onboardingDefaults();
    const step = this._onboardingStep || 0;
    const single = (key, options) => `<div class="onboarding-options">${options.map(o =>
      `<button class="onboarding-choice ${d[key] === o.id ? 'selected' : ''}" onclick="App.onboardingPick('${key}','${o.id}')"><span>${o.emoji}</span><b>${o.title}</b><small>${o.desc}</small></button>`).join('')}</div>`;
    const multi = (key, options, limit) => `<div class="onboarding-options">${options.map(o =>
      `<button class="onboarding-choice ${(d[key] || []).includes(o.id) ? 'selected' : ''}" onclick="App.onboardingPick('${key}','${o.id}',true,${limit})"><span>${o.emoji}</span><b>${o.title}</b><small>${o.desc}</small></button>`).join('')}</div>`;

    const screens = [
      {
        kicker: 'نرسم البداية المناسبة لكم',
        title: 'ما الذي تريد أن يصبح أسهل هذا الأسبوع؟',
        text: 'اختر هدفًا واحدًا أو هدفين فقط، وسنبني حولهما أول مغامرة.',
        body: multi('focusAreas', [
          { id: 'morning', emoji: '🌤️', title: 'صباح هادئ', desc: 'الاستعداد والخروج بلا استعجال' },
          { id: 'homework', emoji: '📚', title: 'الواجب والتركيز', desc: 'بدء الدراسة وإنهاؤها خطوة بخطوة' },
          { id: 'responsibility', emoji: '🧺', title: 'المسؤولية والترتيب', desc: 'العناية بالمساحة والمهام المنزلية' },
          { id: 'sleep', emoji: '🌙', title: 'نوم أسهل', desc: 'روتين هادئ لنهاية اليوم' },
          { id: 'health', emoji: '🏃', title: 'صحة ونشاط', desc: 'الحركة والعادات الصحية' },
          { id: 'quran', emoji: '📖', title: 'ورد وقراءة', desc: 'عادة قراءة هادئة وثابتة' },
        ], 2),
      },
      {
        kicker: 'نرتب اليوم حول وقت حقيقي',
        title: 'متى تحتاج الأسرة إلى دعم أكثر؟',
        text: 'سنستخدمه لفهم سياق المهام، وليس لإرسال تنبيهات من دون إذنك.',
        body: single('routineWindow', [
          { id: 'before_school', emoji: '🎒', title: 'قبل المدرسة', desc: 'أول اليوم والتحضير للخروج' },
          { id: 'after_school', emoji: '🏠', title: 'بعد المدرسة', desc: 'الراحة والواجبات والانتقال' },
          { id: 'evening', emoji: '🌙', title: 'المساء', desc: 'الترتيب والنوم الهادئ' },
          { id: 'weekend', emoji: '🌿', title: 'عطلة نهاية الأسبوع', desc: 'مسؤوليات ونشاطات عائلية' },
        ]),
      },
      {
        kicker: 'كل طفل يحتاج قدرًا مختلفًا من البنية',
        title: 'ما الشكل الأسهل لطفلك الآن؟',
        text: 'يمكنك تغيير هذا لاحقًا من خطة الأسرة.',
        body: single('structure', [
          { id: 'one', emoji: '1️⃣', title: 'مهمة واحدة الآن', desc: 'تركيز كامل على الخطوة التالية فقط' },
          { id: 'three', emoji: '3️⃣', title: 'ثلاث مهام قصيرة', desc: 'خطة يوم خفيفة ومتوازنة' },
          { id: 'steps', emoji: '🧩', title: 'خطوات أصغر', desc: 'نحضّر للروتين المرئي في المرحلة التالية' },
          { id: 'choice', emoji: '🙋', title: 'يختار من القائمة', desc: 'استقلال أكبر مع توجيه خفيف' },
        ]),
      },
      {
        kicker: 'المكافأة تساعد، لكنها ليست الهدف',
        title: 'كيف تحب أن يحتفل جَزَرة بالإنجاز؟',
        text: 'نقترح التقدم في العالم أولًا، ووقت الشاشة اختياري وليس افتراضيًا.',
        body: single('rewards', [
          { id: 'world', emoji: '🗺️', title: 'تقدم جزّور والعالم', desc: 'عملات وخبرة ورحلة المغامرة' },
          { id: 'family', emoji: '🤍', title: 'امتياز عائلي', desc: 'مكافأة حقيقية يختارها الوالد' },
          { id: 'screen', emoji: '⏱️', title: 'وقت شاشة اختياري', desc: 'دقائق محدودة تُكتسب مع الإنجاز' },
          { id: 'balanced', emoji: '⚖️', title: 'مزيج متوازن', desc: 'تقدم في العالم مع امتيازات مختارة' },
        ]),
      },
      {
        kicker: 'الدعم الذي يجعل البداية أسهل',
        title: 'ما الذي يساعده على البدء؟',
        text: 'اختياري — اختر حتى اثنين. لن نستخدم أي معلومة كتصنيف أو تشخيص.',
        body: multi('supports', [
          { id: 'audio', emoji: '🔊', title: 'صوت جزّور', desc: 'تشجيع وقراءة واضحة للخطوة' },
          { id: 'visual', emoji: '👁️', title: 'صور ورموز', desc: 'دعم بصري للروتين القادم' },
          { id: 'timer', emoji: '⏳', title: 'مؤقت بسيط', desc: 'نهاية واضحة للمهمة' },
          { id: 'gentle', emoji: '💬', title: 'تذكير هادئ', desc: 'دعوة لطيفة بدل الإلحاح' },
        ], 2),
      },
    ];
    const current = screens[step];
    this.openModal(`
      <section class="onboarding-shell" aria-label="خطة الأسرة">
        <div class="onboarding-progress"><i style="width:${((step + 1) / screens.length) * 100}%"></i></div>
        <div class="onboarding-head"><span>خطة الأسرة</span><small>الخطوة ${step + 1} من ${screens.length}</small></div>
        <p class="onboarding-kicker">${current.kicker}</p>
        <h2>${current.title}</h2>
        <p class="onboarding-copy">${current.text}</p>
        ${current.body}
        <div class="onboarding-actions">
          ${step ? '<button class="btn-ghost" onclick="App.onboardingBack()">→ رجوع</button>' : '<button class="btn-ghost" onclick="App.onboardingSkip()">تخطي الآن</button>'}
          <button class="btn-primary big" onclick="App.onboardingNext()">${step === screens.length - 1 ? 'شاهد خطة اليوم الأول ←' : 'التالي ←'}</button>
        </div>
      </section>`);
  },

  onboardingPlanFor(draft) {
    const recipes = {
      morning: [
        { title: 'استعد لصباحك بهدوء', cat: 'health', proof: 'self', xp: 12, coins: 4 },
        { title: 'جهّز حقيبتك لليوم', cat: 'study', proof: 'self', xp: 12, coins: 4 },
      ],
      homework: [
        { title: 'ابدأ واجبك الدراسي 15 دقيقة', cat: 'study', proof: 'parent', xp: 18, coins: 6 },
        { title: 'رتّب أدواتك بعد الدراسة', cat: 'study', proof: 'self', xp: 10, coins: 4 },
      ],
      responsibility: [
        { title: 'رتّب مساحتك الخاصة', cat: 'health', proof: 'photo', xp: 15, coins: 5 },
        { title: 'ساعد في مهمة عائلية صغيرة', cat: 'health', proof: 'parent', xp: 14, coins: 5 },
      ],
      sleep: [
        { title: 'جهّز نفسك للنوم بهدوء', cat: 'health', proof: 'self', xp: 15, coins: 5 },
        { title: 'رتّب ملابسك لليوم التالي', cat: 'health', proof: 'self', xp: 10, coins: 4 },
      ],
      health: [
        { title: 'حركة ونشاط 20 دقيقة', cat: 'sport', proof: 'parent', xp: 18, coins: 6 },
        { title: 'اشرب ماءً خلال اليوم', cat: 'health', proof: 'self', xp: 10, coins: 4 },
      ],
      quran: [
        { title: 'ورد القرآن اليومي', cat: 'study', proof: 'self', xp: 14, coins: 5 },
        { title: 'اقرأ 10 دقائق بهدوء', cat: 'study', proof: 'self', xp: 12, coins: 4 },
      ],
    };
    const pool = (draft.focusAreas || []).flatMap(area => recipes[area] || []);
    const fallback = recipes.health.concat(recipes.responsibility);
    const seen = new Set();
    const picked = pool.concat(fallback).filter(t => !seen.has(t.title) && seen.add(t.title));
    const count = draft.structure === 'one' ? 1 : 3;
    return picked.slice(0, count).map(t => Object.assign({ id: uid(), onboarding: true }, t));
  },

  renderOnboardingPreview() {
    const d = this._onboardingDraft || this.onboardingDefaults();
    const plan = this.onboardingPlanFor(d);
    this._onboardingPlan = plan;
    const labels = {
      before_school: 'قبل المدرسة', after_school: 'بعد المدرسة', evening: 'المساء', weekend: 'عطلة نهاية الأسبوع',
      one: 'مهمة واحدة في كل مرة', three: 'ثلاث مهام قصيرة', steps: 'خطوات أصغر', choice: 'اختيار من القائمة',
    };
    this.openModal(`
      <section class="onboarding-shell onboarding-preview" aria-label="معاينة خطة اليوم الأول">
        <p class="onboarding-kicker">بداية صغيرة يمكن نجاحها</p>
        <h2>هذه خطة اليوم الأول</h2>
        <p class="onboarding-copy">${esc(C().name)} سيبدأ في ${esc(labels[d.routineWindow] || 'وقته المناسب')} وبنمط ${esc(labels[d.structure] || 'خفيف')}.</p>
        <div class="first-plan-list">${plan.map((t, i) => `<div class="first-plan-item"><span>${i + 1}</span><div><b>${esc(t.title)}</b><small>${CATEGORIES[t.cat].emoji} ${CATEGORIES[t.cat].name} · ${PROOF_MODES[t.proof].short}</small></div><em>+${t.coins} 🥕</em></div>`).join('')}</div>
        <p class="onboarding-note">يمكنك تعديل أي مهمة بعد البداية. الهدف هو يوم أول سهل، لا قائمة طويلة.</p>
        <div class="onboarding-actions">
          <button class="btn-ghost" onclick="App.startOnboarding(0, App._onboardingDraft)">تعديل الخطة</button>
          <button class="btn-primary big" onclick="App.finishOnboarding()">ابدأ مغامرتنا ✨</button>
        </div>
      </section>`);
  },

  finishOnboarding() {
    const d = this._onboardingDraft || this.onboardingDefaults();
    const plan = this._onboardingPlan || this.onboardingPlanFor(d);
    C().tasks = plan;
    // الروتين يوجّه الخطوات ولا يمنح عملات مستقلة؛ تظل مكافآت اليوم مرتبطة بالمهام الفعلية.
    C().routines = [routineFromTemplate(d.routineWindow, d.supports || [])];
    C().routineProgress = { date: todayKey(), byRoutine: {} };
    C().autopilot = Object.assign(C().autopilot || {}, {
      enabled: false,
      goals: [...new Set(plan.map(t => t.cat))],
      count: plan.length,
      lastGen: null,
    });
    // وقت الشاشة خيار صريح، وليس مكافأة مفروضة على العائلة.
    S.screenPerTask = (d.rewards === 'screen' || d.rewards === 'balanced') ? 10 : 0;
    S.onboarding = {
      version: 1,
      status: 'complete',
      completedAt: new Date().toISOString(),
      focusAreas: d.focusAreas || [],
      routineWindow: d.routineWindow || '',
      structure: d.structure || 'three',
      rewards: d.rewards || 'world',
      supports: d.supports || [],
      draft: null,
    };
    save();
    this._onboardingDraft = null;
    this._onboardingPlan = null;
    this.closeModal();
    this.openParent();
    this.celebrate('خطة اليوم الأول جاهزة! ✨', `جهزنا لـ${esc(C().name)} ${plan.length} مهام صغيرة قابلة للنجاح.`, ['ابدؤوا بخطوة واحدة فقط'], '🥕');
  },

  familyPlanForm() {
    const d = S.onboarding && S.onboarding.status === 'complete'
      ? {
          focusAreas: S.onboarding.focusAreas || [], routineWindow: S.onboarding.routineWindow || '',
          structure: S.onboarding.structure || '', rewards: S.onboarding.rewards || '', supports: S.onboarding.supports || [],
        }
      : this.onboardingDefaults();
    this.startOnboarding(0, d);
  },

  refreshParentSubtitle() {
    const today = todayKey();
    const done = (C().completions[today] || []).length;
    const pending = C().pendingProofs.length;
    const requests = S.joinRequests.length;
    document.getElementById('parent-subtitle').textContent =
      `${C().name} أنجز اليوم ${done} من ${C().tasks.length} مهام` +
      (pending ? ` · 🔔 ${pending} إثبات بانتظارك` : '') +
      (requests ? ` · 🙋 ${requests} طلب انضمام` : '') +
      (S.children.some(ch => (ch.redemptions || []).some(r => r.status === 'pending' && (r.kind === 'out' || r.kind === 'budget'))) ? ' · 🚨 طلب مكافأة يحتاج موافقتك الخاصة' : '');
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

  /* ── صندوق «تحتاج قرارك الآن» ── */
  /* ── إدارة روتين الطفل من لوحة الوالد ── */
  routineManagerCardHtml() {
    const routine = this.activeRoutine();
    if (!routine) {
      return `<div class="card routine-manager-card empty">
        <div class="routine-manager-title"><span>🧩</span><div><h3>روتين بصري للطفل</h3><p>حوّل وقتًا صعبًا إلى خطوات صغيرة ينجزها البطل باستقلالية.</p></div></div>
        <button class="btn-primary purple" onclick="App.openRoutineManager()">جهّز روتينًا</button>
      </div>`;
    }
    const state = this.routineState(routine);
    return `<div class="card routine-manager-card">
      <div class="routine-manager-title"><span>${routine.emoji}</span><div><h3>${esc(routine.title)}</h3><p>${routine.steps.length} خطوات · ${routine.audio ? '🔊 صوت جزّور' : 'صامت'}${routine.timerSeconds ? ' · ⏳ مؤقت تركيز' : ''}</p></div><b>${state.done.length}/${routine.steps.length}</b></div>
      <button class="btn-ghost" onclick="App.openRoutineManager('${routine.id}')">تعديل الروتين</button>
    </div>`;
  },

  openRoutineManager(routineId, templateId) {
    const current = (C().routines || []).find(r => r.id === routineId) || this.activeRoutine();
    const fallback = (S.onboarding && S.onboarding.routineWindow) || 'after_school';
    const selected = templateId || (current && current.templateId) || routineTemplateId(fallback);
    const audio = current ? !!current.audio : !!(S.onboarding && (S.onboarding.supports || []).includes('audio'));
    const timer = current ? !!current.timerSeconds : !!(S.onboarding && (S.onboarding.supports || []).includes('timer'));
    const templates = Object.entries(ROUTINE_TEMPLATES).map(([id, t]) =>
      `<button class="routine-template ${id === selected ? 'selected' : ''}" onclick="App.openRoutineManager('${current ? current.id : ''}','${id}')"><span>${t.emoji}</span><b>${esc(t.title)}</b><small>${t.steps.length} خطوات</small></button>`).join('');
    const preview = ROUTINE_TEMPLATES[selected] || ROUTINE_TEMPLATES.after_school;
    this.openModal(`<section class="routine-manager-modal">
      <h3>🧩 روتين ${esc(C().name)}</h3>
      <p class="muted">اختر وقتًا واحدًا مهمًا. الروتين يرشد الطفل ولا يمنح عملات مستقلة؛ تبقى المكافآت لمهام اليوم.</p>
      <div class="routine-template-grid">${templates}</div>
      <div class="routine-preview-parent"><b>${preview.emoji} ${esc(preview.title)}</b>${preview.steps.map((s, i) => `<span>${i + 1}. ${s[0]} ${esc(s[1])}</span>`).join('')}</div>
      <div class="routine-support-toggles">
        <label><input id="routine-audio" type="checkbox" ${audio ? 'checked' : ''} /> <span>🔊 يقرأ جزّور أول خطوة ويشجع عند التقدم</span></label>
        <label><input id="routine-timer" type="checkbox" ${timer ? 'checked' : ''} /> <span>⏳ أظهر مؤقت تركيز اختياريًا (3 دقائق)</span></label>
      </div>
      <div class="form-row" style="margin-top:14px"><div><button class="btn-ghost" onclick="App.closeModal()">إلغاء</button></div><div><button class="btn-primary green" onclick="App.saveRoutineManager('${current ? current.id : ''}','${selected}')">حفظ الروتين</button></div></div>
    </section>`);
  },

  saveRoutineManager(currentId, templateId) {
    const current = (C().routines || []).find(r => r.id === currentId) || this.activeRoutine();
    const audio = !!document.getElementById('routine-audio').checked;
    const timer = !!document.getElementById('routine-timer').checked;
    const next = routineFromTemplate(templateId, [], {
      id: current ? current.id : undefined,
      audio,
      timerSeconds: timer ? 180 : 0,
    });
    C().routines = [next];
    C().routineProgress = { date: todayKey(), byRoutine: {} };
    if (S.onboarding && S.onboarding.status === 'complete') {
      const supports = new Set(S.onboarding.supports || []);
      audio ? supports.add('audio') : supports.delete('audio');
      timer ? supports.add('timer') : supports.delete('timer');
      S.onboarding.supports = [...supports];
    }
    save();
    ReminderEngine.scheduleChild(C()).catch(() => {});
    this.closeModal();
    this.renderPTasks();
    this.toast('تم حفظ الروتين — سيظهر للبطل في مسار اليوم 🧩');
  },

  reminderManagerCardHtml() {
    const routine = this.activeRoutine();
    const cfg = ReminderEngine.normalize(C());
    const active = ReminderEngine.activeSlots(C());
    if (!routine) return `<div class="card reminder-manager-card empty"><div class="routine-manager-title"><span>🔔</span><div><h3>تذكيرات هادئة</h3><p>جهّز روتينًا أولًا، ثم اختر وقتًا أو وقتين فقط لتذكير الطفل بلطف.</p></div></div></div>`;
    const mode = ReminderEngine.plugin() ? 'ستطلب إذن الإشعارات على هذا الجهاز عند الحفظ.' : 'يظهر التنبيه داخل التطبيق عند فتحه؛ التذكير خارج التطبيق يتاح في نسخة الهاتف.';
    return `<div class="card reminder-manager-card ${cfg.enabled ? 'on' : ''}">
      <div class="routine-manager-title"><span>🔔</span><div><h3>تذكيرات جزّور الهادئة</h3><p>${cfg.enabled ? `${active.length} من ${ReminderEngine.maxSlots} تذكيرين مفعّلين` : 'متوقفة — لا تنبيه افتراضيًا'}</p></div></div>
      <p class="muted">${mode}</p>
      <button class="btn-ghost" onclick="App.openReminderManager()">${cfg.enabled ? 'تعديل التذكيرات' : 'ضبط تذكير هادئ'}</button>
    </div>`;
  },

  openReminderManager() {
    const routine = this.activeRoutine();
    if (!routine) { this.toast('جهّز روتينًا بصريًا أولًا'); return; }
    const cfg = ReminderEngine.normalize(C());
    const slots = [0, 1].map(index => Object.assign({ id: 'r' + index, enabled: false, routineId: routine.id, time: index ? '19:00' : '07:00', kind: index ? 'gentle' : 'start' }, cfg.slots[index] || {}));
    const rows = slots.map((slot, index) => `<div class="reminder-slot">
      <label class="reminder-slot__toggle"><input id="reminder-on-${index}" type="checkbox" ${slot.enabled ? 'checked' : ''} /> <b>${index ? 'تذكير لطيف ثانٍ' : 'وقت بدء الروتين'}</b></label>
      <div class="form-row"><div><label>الوقت</label><input id="reminder-time-${index}" type="time" value="${esc(slot.time)}" /></div><div><label>الرسالة</label><select id="reminder-kind-${index}"><option value="start" ${slot.kind === 'start' ? 'selected' : ''}>نبدأ بخطوة واحدة</option><option value="gentle" ${slot.kind === 'gentle' ? 'selected' : ''}>تذكير هادئ فقط</option></select></div></div>
    </div>`).join('');
    this.openModal(`<section class="reminder-manager-modal"><h3>🔔 تذكيرات جزّور</h3>
      <p class="muted">اختر وقتًا أو وقتين فقط. لا تظهر التذكيرات كعقوبة، ويمكن إيقافها في أي وقت. ترتبط حاليًا بـ«${esc(routine.title)}».</p>
      <label class="reminder-main-toggle"><input id="reminder-enabled" type="checkbox" ${cfg.enabled ? 'checked' : ''} /> <b>فعّل التذكيرات على هذا الجهاز</b></label>
      <div class="reminder-slot-list">${rows}</div>
      <p class="muted">على نسخة الهاتف، سيطلب التطبيق إذن الإشعارات عند الحفظ. على الويب، يعمل تنبيه لطيف فقط أثناء فتح التطبيق.</p>
      <div class="form-row" style="margin-top:14px"><div><button class="btn-ghost" onclick="App.closeModal()">إلغاء</button></div><div><button class="btn-primary green" onclick="App.saveReminderManager()">حفظ التذكيرات</button></div></div>
    </section>`);
  },

  async saveReminderManager() {
    const routine = this.activeRoutine();
    if (!routine) return;
    const enabled = !!document.getElementById('reminder-enabled').checked;
    const slots = [0, 1].map(index => ({
      id: 'r' + index,
      enabled: !!document.getElementById('reminder-on-' + index).checked,
      routineId: routine.id,
      time: document.getElementById('reminder-time-' + index).value || (index ? '19:00' : '07:00'),
      kind: document.getElementById('reminder-kind-' + index).value || 'start',
    }));
    if (enabled && !slots.some(s => s.enabled)) { this.toast('فعّل وقتًا واحدًا على الأقل أو أوقف التذكيرات'); return; }
    C().reminders = { enabled, slots };
    save();
    try {
      const result = await ReminderEngine.scheduleChild(C());
      this.closeModal();
      this.renderPTasks();
      this.toast(enabled ? (result.native ? `تم ضبط ${result.scheduled} تذكير محلي بهدوء 🔔` : 'تم الحفظ — سيظهر التنبيه عند فتح التطبيق 🔔') : 'تم إيقاف التذكيرات');
    } catch (e) {
      this.closeModal();
      this.renderPTasks();
      this.toast('تم حفظ التوقيت، لكن ' + (e.message || 'الإشعار يحتاج إذن الجهاز'));
    }
  },

  parentDecisions() {
    const decisions = [];
    for (const child of S.children) {
      for (const proof of (child.pendingProofs || [])) {
        decisions.push({ type: 'proof', childId: child.id, childName: child.name, id: proof.id, title: proof.title, photo: !!proof.photo, date: proof.date, emoji: '📸' });
      }
      for (const reward of (child.redemptions || []).filter(r => r.status === 'pending')) {
        decisions.push({ type: 'reward', childId: child.id, childName: child.name, id: reward.id, title: reward.title, kind: reward.kind || 'home', date: reward.date, emoji: reward.kind === 'out' ? '🚗' : reward.kind === 'budget' ? '💰' : '🎁' });
      }
    }
    for (const request of (S.joinRequests || [])) {
      decisions.push({ type: 'join', id: request.id, title: request.name, date: request.date, emoji: '🙋' });
    }
    return decisions;
  },

  familyPlanCardHtml() {
    const o = S.onboarding || {};
    const labels = {
      morning: 'صباح هادئ', homework: 'واجب وتركيز', responsibility: 'مسؤولية وترتيب', sleep: 'نوم أسهل', health: 'صحة ونشاط', quran: 'ورد وقراءة',
      before_school: 'قبل المدرسة', after_school: 'بعد المدرسة', evening: 'المساء', weekend: 'عطلة نهاية الأسبوع',
      one: 'خطوة واحدة', three: 'ثلاث مهام قصيرة', steps: 'خطوات أصغر', choice: 'اختيار من القائمة',
    };
    if (o.status === 'complete') {
      const focuses = (o.focusAreas || []).map(x => labels[x]).filter(Boolean).join(' · ') || 'خطة مخصصة';
      return `<div class="card family-plan-card">
        <div class="family-plan-title"><span>🧭</span><div><h3>خطة الأسرة</h3><p>${esc(focuses)} · ${esc(labels[o.routineWindow] || 'وقت مرن')} · ${esc(labels[o.structure] || 'بداية خفيفة')}</p></div></div>
        <button class="btn-ghost" onclick="App.familyPlanForm()">تعديل الخطة</button>
      </div>`;
    }
    return `<div class="card family-plan-card start">
      <div class="family-plan-title"><span>🧭</span><div><h3>ابدأ بخطة تناسب أسرتك</h3><p>خمس أسئلة قصيرة تحول أهدافكم إلى بداية خفيفة للطفل.</p></div></div>
      <button class="btn-primary purple" onclick="App.familyPlanForm()">أنشئ خطة الأسرة</button>
    </div>`;
  },

  parentDecisionInboxHtml() {
    const decisions = this.parentDecisions();
    if (!decisions.length) {
      return `<div class="card decision-inbox clear"><div class="decision-inbox-title"><span>✅</span><div><h3>تحتاج قرارك الآن</h3><p>لا توجد موافقات أو طلبات معلقة. وقت جميل لترك ${esc(C().name)} يكمل مغامرته.</p></div></div></div>`;
    }
    const preview = decisions.slice(0, 3).map(d => {
      const text = d.type === 'proof' ? `إثبات ${d.childName}: ${d.title}` : d.type === 'reward' ? `مكافأة ${d.childName}: ${d.title}` : `طلب انضمام: ${d.title}`;
      return `<div class="decision-preview"><span>${d.emoji}</span><b>${esc(text)}</b></div>`;
    }).join('');
    return `<div class="card decision-inbox active">
      <div class="decision-inbox-title"><span>🔔</span><div><h3>تحتاج قرارك الآن</h3><p>${decisions.length} ${decisions.length === 1 ? 'طلب ينتظر' : 'طلبات تنتظر'} موافقتك أو مراجعتك.</p></div><strong>${decisions.length}</strong></div>
      <div class="decision-previews">${preview}</div>
      <button class="btn-primary green" style="width:100%;margin-top:10px" onclick="App.openParentDecisionInbox()">راجع القرارات ←</button>
    </div>`;
  },

  decisionUseChild(childId) {
    if (!childId) return;
    S.activeChildId = childId;
    save();
    this.renderChildSwitcher();
    this.refreshParentSubtitle();
  },

  openParentDecisionInbox() {
    const decisions = this.parentDecisions();
    const typeText = { proof: 'إثبات مهمة', reward: 'طلب مكافأة', join: 'طلب انضمام' };
    const rows = decisions.map(d => {
      const meta = d.type === 'proof'
        ? `${d.childName} · ${d.photo ? 'صورة مرفقة' : 'تأكيد بانتظارك'} · ${d.date}`
        : d.type === 'reward'
          ? `${d.childName} · ${d.kind === 'out' ? 'خارج المنزل' : d.kind === 'budget' ? 'يحتاج ميزانية' : 'مكافأة عائلية'} · ${d.date}`
          : `طلب إنشاء حساب طفل · ${d.date}`;
      const approve = d.type === 'proof'
        ? `<button class="btn-primary green" onclick="App.closeModal();App.decisionUseChild('${d.childId}');App.approveProof('${d.id}')">اعتمد</button>`
        : d.type === 'reward'
          ? `<button class="btn-primary green" onclick="App.closeModal();App.decisionUseChild('${d.childId}');App.approveRedemption('${d.id}');App.parentTab('rewards')">اعتمد</button>`
          : `<button class="btn-primary green" onclick="App.closeModal();App.approveJoinRequest('${d.id}')">أنشئ الحساب</button>`;
      const review = d.type === 'proof'
        ? `<button class="btn-ghost" onclick="App.closeModal();App.decisionUseChild('${d.childId}');App.parentTab('tasks')">راجع</button>`
        : d.type === 'reward'
          ? `<button class="btn-ghost" onclick="App.closeModal();App.decisionUseChild('${d.childId}');App.parentTab('rewards')">راجع</button>`
          : `<button class="btn-ghost" onclick="App.closeModal();App.parentTab('settings')">راجع</button>`;
      return `<div class="decision-row"><span class="task-cat">${d.emoji}</span><div class="task-info"><div class="t-title">${esc(d.title)}</div><div class="t-meta">${esc(typeText[d.type])} · ${esc(meta)}</div></div><div class="decision-actions">${review}${approve}</div></div>`;
    }).join('');
    this.openModal(`<section class="decision-modal"><h3>🔔 تحتاج قرارك الآن</h3><p class="muted">اعتمد بسرعة عندما تكون متأكدًا، أو اختر «راجع» لرؤية التفاصيل أولًا.</p><div class="decision-list">${rows || '<p class="muted">لا توجد قرارات معلقة الآن.</p>'}</div></section>`);
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

    // شريط يوم الطفل — الوالد يفتح ليرى لا ليدير: كل إنجاز لحظة، والقلب يصل للطفل فورًا
    const feed = (C().feed || []).slice(0, 8);
    const feedHtml = feed.length ? `
      <div class="card feed-card">
        <h3>📸 يوم ${esc(C().name)}</h3>
        <p class="muted" style="margin-bottom:8px">اضغط 🤍 وسيصل قلبك للطفل مع اسم إنجازه — أقوى مكافأة مجانية</p>
        ${feed.map(f => `
          <div class="feed-row">
            <span class="feed-emoji">${f.e}</span>
            <div class="task-info">
              <div class="t-title">${esc(f.title)}</div>
              <div class="t-meta">${feedTimeStr(f.ts)}${f.heart ? (f.seen ? ' · ❤️ شاهده' : ' · ❤️ في طريقه إليه') : ''}</div>
            </div>
            ${f.img ? `<img class="feed-thumb" src="${f.img}" alt="صورة الإنجاز" />` : ''}
            <button class="heart-btn ${f.heart ? 'on' : ''}" title="أرسل قلبًا" onclick="App.heartFeed('${f.id}')">${f.heart ? '❤️' : '🤍'}</button>
          </div>`).join('')}
      </div>` : '';

    document.getElementById('ptab-tasks').innerHTML = `
      ${this.familyPlanCardHtml()}
      ${this.routineManagerCardHtml()}
      ${this.reminderManagerCardHtml()}
      ${this.parentDecisionInboxHtml()}
      ${reviewHtml}
      ${feedHtml}
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
      <button class="btn-ghost" style="width:100%;margin-top:8px" onclick="App.openSchoolSummary()">🏫 أنشئ ملخصًا تعليميًا محدودًا للمعلم</button>
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
      </div>
      <div class="card">
        <h3>🎬 مكتبة الفيديو التعليمية</h3>
        <p class="muted" style="margin-bottom:8px">روابط يوتيوب تعليمية يشاهدها الأطفال داخل التطبيق (فيديو أو قائمة تشغيل)</p>
        ${S.videos.map(v => `
          <div class="task-row">
            <span class="task-cat">▶️</span>
            <div class="task-info"><div class="t-title">${esc(v.title)}</div></div>
            <button class="icon-btn" title="حذف" onclick="App.deleteVideo('${v.id}')">🗑️</button>
          </div>`).join('')}
        <button class="btn-primary green" style="margin-top:8px" onclick="App.videoForm()">＋ إضافة فيديو</button>
      </div>
      ${S.quizzes.length ? `
      <div class="card">
        <h3>📝 اختبارات المعلمين</h3>
        ${S.quizzes.map(q => `
          <div class="task-row">
            <span class="task-cat">📝</span>
            <div class="task-info">
              <div class="t-title">${esc(q.title)}</div>
              <div class="t-meta">🏫 ${esc(q.teacher)} · ${q.questions.length} أسئلة · نتيجة ${esc(C().name)}: ${C().quizzesDone[q.id] !== undefined ? C().quizzesDone[q.id] + '/' + q.questions.length : 'لم يحله بعد'}</div>
            </div>
            <button class="icon-btn" title="حذف" onclick="App.deleteQuiz('${q.id}')">🗑️</button>
          </div>`).join('')}
      </div>` : ''}`;
  },

  deleteQuiz(quizId) {
    if (!confirm('حذف هذا الاختبار؟')) return;
    S.quizzes = S.quizzes.filter(q => q.id !== quizId);
    save();
    this.renderPTasks();
  },

  /* ── إدارة مكتبة الفيديو ── */
  videoForm() {
    this.openModal(`
      <h3>🎬 فيديو تعليمي جديد</h3>
      <div class="form-grid">
        <div><label>العنوان</label><input id="f-vtitle" placeholder="مثال: تعلم الحروف الإنجليزية" /></div>
        <div><label>رابط يوتيوب (فيديو أو قائمة تشغيل)</label><input id="f-vurl" dir="ltr" placeholder="https://youtu.be/..." /></div>
        <button class="btn-primary green" onclick="App.saveVideo()">حفظ ✅</button>
        <p id="video-msg" class="muted" style="min-height:1.2em"></p>
      </div>`);
  },

  saveVideo() {
    const title = document.getElementById('f-vtitle').value.trim();
    const url = document.getElementById('f-vurl').value.trim();
    const msg = document.getElementById('video-msg');
    if (!title || !url) { msg.textContent = 'اكتب العنوان والرابط'; return; }
    if (!youtubeEmbed(url)) { msg.textContent = '⚠️ الصق رابط فيديو أو قائمة تشغيل من يوتيوب (روابط القنوات غير مدعومة)'; return; }
    S.videos.push({ id: uid(), title, url });
    save();
    this.closeModal();
    this.renderPTasks();
    this.toast('أُضيف الفيديو — سيظهر في خريطة الأبطال 🎬');
  },

  deleteVideo(videoId) {
    if (!confirm('حذف هذا الفيديو؟')) return;
    S.videos = S.videos.filter(v => v.id !== videoId);
    save();
    this.renderPTasks();
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
    const grade = C().grade;
    const chips = [
      `<button class="lib-chip grade ${f === 'grade' ? 'active' : ''}" onclick="App.taskLibrary('grade')">🎓 مكتبة ${gradeName(grade)}</button>`,
      `<button class="lib-chip ${f === 'weekend' ? 'active' : ''}" onclick="App.taskLibrary('weekend')">🏖️ الويكند</button>`,
      `<button class="lib-chip ${f === 'all' ? 'active' : ''}" onclick="App.taskLibrary('all')">الكل</button>`,
    ].concat(Object.entries(CATEGORIES).map(([k, c]) =>
        `<button class="lib-chip ${f === k ? 'active' : ''}" onclick="App.taskLibrary('${k}')">${c.emoji} ${c.name}</button>`)).join('');

    const existing = new Set(C().tasks.map(t => t.title));
    // مصدر القائمة: مكتبة الصف الدراسي الدائمة أو المكتبة العامة
    const source = f === 'grade' ? (CURRICULUM[grade] || []) : f === 'weekend' ? WEEKEND_LIBRARY : TASK_LIBRARY.filter(t => f === 'all' || t.cat === f);
    const items = source.map(t => {
      const added = existing.has(t.title);
      const ref = f === 'grade'
        ? `'grade',${(CURRICULUM[grade] || []).indexOf(t)}`
        : f === 'weekend' ? `'weekend',${WEEKEND_LIBRARY.indexOf(t)}`
        : `'lib',${TASK_LIBRARY.indexOf(t)}`;
      return `
      <div class="task-row">
        <span class="task-cat">${CATEGORIES[t.cat].emoji}</span>
        <div class="task-info">
          <div class="t-title">${esc(t.title)}</div>
          <div class="t-meta">${t.xp} XP · ${t.coins} 🥕 · ${PROOF_MODES[t.proof].emoji} ${PROOF_MODES[t.proof].short}</div>
        </div>
        ${added
          ? '<span class="pill" style="background:#e2f5ea">✔ مضافة</span>'
          : `<button class="icon-btn" style="background:#fff3e6;font-weight:900;color:var(--carrot-dark)" onclick="App.addFromLibrary(${ref})">＋</button>`}
      </div>`;
    }).join('');
    this.openModal(`
      <h3>📚 مكتبة المهام</h3>
      ${f === 'grade' ? `<p class="muted" style="margin-bottom:8px">مهام مكملة لمواد مقررات ${gradeName(grade)} — تتبدل تلقائيًا مع تغيير صف الطفل</p>` : ''}
      <div class="lib-chips">${chips}</div>
      <div class="lib-list">${items || '<p class="muted">لا مهام في هذا المسار</p>'}</div>`);
  },

  addFromLibrary(src, idx) {
    const t = src === 'grade' ? (CURRICULUM[C().grade] || [])[idx] : src === 'weekend' ? WEEKEND_LIBRARY[idx] : TASK_LIBRARY[idx];
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
    const g = REWARD_LIBRARY[gi];
    const r = g.items[ri];
    if (!r || S.rewards.some(x => x.title === r.title)) return;
    S.rewards.push({ id: uid(), ...r, kind: g.kind || 'home' });
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
    const taskLike = { id: p.taskId, cat: p.cat, xp: p.xp, coins: p.coins, title: p.title };
    grantCompletion(taskLike, p.date);
    // صورة الإثبات تظهر في شريط اليوم — كأنها قصة عائلية
    if (p.photo && C().feed && C().feed.length) {
      const fe = C().feed.find(f => f.title.includes(p.title));
      if (fe) fe.img = p.photo;
    }
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
        <label class="goal-check"><input type="checkbox" id="f-weekend" ${t && t.weekendOk ? 'checked' : ''} /><span>🏖️ تظهر حتى في الويكند (مهام الدراسة تُخفى الجمعة والسبت افتراضيًا)</span></label>
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
    const weekendOk = document.getElementById('f-weekend').checked;
    if (taskId) {
      const t = C().tasks.find(x => x.id === taskId);
      Object.assign(t, { title, cat, xp, coins, proof, weekendOk });
    } else {
      C().tasks.push({ id: uid(), title, cat, xp, coins, proof, weekendOk });
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
            <div class="task-info"><div class="t-title">${r.kind === 'out' ? '🚗 ' : r.kind === 'budget' ? '💰 ' : ''}${esc(r.title)}</div><div class="t-meta">${r.cost} 🥕 · ${r.date}${r.kind === 'out' ? ' · <b style="color:#c94444">مشوار خارج المنزل — يحتاج تخطيطك</b>' : ''}${r.kind === 'budget' ? ' · <b style="color:#c94444">يحتاج ميزانية</b>' : ''}</div></div>
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
      </div>
      <button class="btn-primary purple" style="margin-top:10px" onclick="App.offersMarket()">🛍️ سوق عروض منطقتكم</button>
      ${(C().wishes || []).filter(w => w.status === 'wish').length ? `
      <div class="card" style="margin-top:14px;border:3px solid var(--gold)">
        <h3>⭐ أمنيات ${esc(C().name)} الجديدة</h3>
        ${(C().wishes || []).filter(w => w.status === 'wish').map(w => `
          <div class="task-row">
            <span class="task-cat">⭐</span>
            <div class="task-info"><div class="t-title">${esc(w.title)}</div></div>
            <div class="task-actions">
              <button class="icon-btn" style="background:#e2f5ea" title="حوّلها لهدف بسعر جزر" onclick="App.wishToGoal('${C().id}','${w.id}')">🎯</button>
              <button class="icon-btn" title="تجاهل" onclick="App.dismissWish('${C().id}','${w.id}')">✕</button>
            </div>
          </div>`).join('')}
      </div>` : ''}
      <div class="card" style="margin-top:14px">
        <h3>🎟️ قسائم الشركاء</h3>
        <p class="muted" style="margin-bottom:8px">خصومات من متاجر وترفيه مقابل كود — يشتريها البطل بالجزر ويظهر له الكود (مثال: خصم مدينة الملاهي)</p>
        ${S.vouchers.map(v => `
          <div class="task-row">
            <span class="task-cat">${v.emoji || '🎟️'}</span>
            <div class="task-info">
              <div class="t-title">${esc(v.title)} — ${esc(v.partner)}</div>
              <div class="t-meta">${v.cost} 🥕 · الكود: <span dir="ltr">${esc(v.code)}</span> · استُخدمت ${v.used || 0} مرة</div>
            </div>
            <button class="icon-btn" title="حذف" onclick="App.deleteVoucher('${v.id}')">🗑️</button>
          </div>`).join('') || ''}
        <button class="btn-primary purple" style="margin-top:8px" onclick="App.voucherForm()">＋ إضافة قسيمة شريك</button>
      </div>`;
  },

  /* ── إدارة قسائم الشركاء ── */
  voucherForm() {
    this.openModal(`
      <h3>🎟️ قسيمة شريك جديدة</h3>
      <div class="form-grid">
        <div><label>اسم الشريك</label><input id="f-vpartner" placeholder="مثال: مدينة الملاهي" /></div>
        <div><label>وصف الخصم</label><input id="f-vdesc" placeholder="مثال: خصم 20٪ على التذاكر" /></div>
        <div class="form-row">
          <div><label>السعر بالجزر 🥕</label><input id="f-vcost" type="number" min="10" max="1000" value="80" /></div>
          <div><label>الرمز</label><input id="f-vemoji" value="🎡" maxlength="4" /></div>
        </div>
        <div><label>كود الخصم (يُكشف للطفل عند الشراء)</label><input id="f-vcode" dir="ltr" placeholder="JAZARAH20" /></div>
        <button class="btn-primary purple" onclick="App.saveVoucher()">حفظ ✅</button>
      </div>`);
  },

  saveVoucher() {
    const partner = document.getElementById('f-vpartner').value.trim();
    const title = document.getElementById('f-vdesc').value.trim();
    const code = document.getElementById('f-vcode').value.trim();
    if (!partner || !title || !code) { this.toast('أكمل بيانات القسيمة'); return; }
    S.vouchers.push({
      id: uid(), partner, title, code,
      emoji: document.getElementById('f-vemoji').value.trim() || '🎟️',
      cost: Math.max(10, parseInt(document.getElementById('f-vcost').value) || 80),
      used: 0,
    });
    save();
    this.closeModal();
    this.renderPRewards();
    this.toast('أُضيفت القسيمة — ستظهر في متجر الأبطال 🎟️');
  },

  deleteVoucher(voucherId) {
    if (!confirm('حذف هذه القسيمة؟ (القسائم المشتراة تبقى عند الأبطال)')) return;
    S.vouchers = S.vouchers.filter(v => v.id !== voucherId);
    save();
    this.renderPRewards();
  },

  rewardForm(rewardId) {
    const r = rewardId ? S.rewards.find(x => x.id === rewardId) : null;
    const kinds = [
      ['home', '🏠 داخل المنزل — تكفي موافقتك المعتادة'],
      ['out', '🚗 مشوار خارج المنزل — تنبيه خاص لك'],
      ['budget', '💰 يحتاج ميزانية/شراء — تنبيه خاص لك'],
    ].map(([k, l]) => `<option value="${k}" ${(r ? r.kind : 'home') === k ? 'selected' : ''}>${l}</option>`).join('');
    this.openModal(`
      <h3>${r ? 'تعديل المكافأة' : 'مكافأة جديدة'}</h3>
      <div class="form-grid">
        <div><label>الرمز</label><input id="f-remoji" value="${r ? r.emoji : '🎁'}" maxlength="4" /></div>
        <div><label>المكافأة</label><input id="f-rtitle" value="${r ? esc(r.title) : ''}" placeholder="مثال: مشوار إلى الحديقة" /></div>
        <div><label>السعر بالجزر 🥕</label><input id="f-rcost" type="number" min="5" max="500" value="${r ? r.cost : 30}" /></div>
        <div><label>نوع المكافأة</label><select id="f-rkind">${kinds}</select></div>
        <button class="btn-primary green" onclick="App.saveReward('${rewardId || ''}')">حفظ</button>
      </div>`);
  },

  saveReward(rewardId) {
    const title = document.getElementById('f-rtitle').value.trim();
    if (!title) { this.toast('اكتب اسم المكافأة أولًا'); return; }
    const emoji = document.getElementById('f-remoji').value.trim() || '🎁';
    const cost = Math.max(5, parseInt(document.getElementById('f-rcost').value) || 30);
    const kind = document.getElementById('f-rkind').value || 'home';
    if (rewardId) Object.assign(S.rewards.find(x => x.id === rewardId), { title, emoji, cost, kind });
    else S.rewards.push({ id: uid(), title, emoji, cost, kind });
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
    // إن كانت المكافأة أمنية محولة لهدف — سجلها متحققة
    if (r) {
      const reward = S.rewards.find(x => x.id === r.rewardId);
      if (reward && reward.wishId) {
        const w = (C().wishes || []).find(x => x.id === reward.wishId);
        if (w) { w.status = 'done'; C().unseenApprovals.push({ title: '⭐ تحققت أمنيتك: ' + w.title, xp: 0, coins: 0 }); }
      }
    }
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

  /* ── مراجعة الأسبوع: تلخيص محلي وخطوة واحدة قابلة للتعديل، بلا تصنيف أو تشخيص ── */
  weeklyReviewKey() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return todayKey(d);
  },

  weeklyReviewSummary() {
    const c = C();
    c.weeklyReview = Object.assign({ actions: {}, seenWeeks: {} }, c.weeklyReview || {});
    const dayCounts = [];
    const catCounts = {};
    let total = 0, activeDays = 0, previous = 0;
    const currentTasks = new Map((c.tasks || []).map(t => [t.id, t]));
    for (let i = 0; i < 7; i++) {
      const ids = c.completions[dayKeyOffset(-i)] || [];
      dayCounts.push(ids.length);
      total += ids.length;
      if (ids.length) activeDays++;
      for (const id of ids) {
        const task = currentTasks.get(id);
        const cat = (task && task.cat) || (c.taskArchive || {})[id];
        if (cat) catCounts[cat] = (catCounts[cat] || 0) + 1;
      }
    }
    for (let i = 7; i < 14; i++) previous += (c.completions[dayKeyOffset(-i)] || []).length;
    const key = this.weeklyReviewKey();
    const cfg = ReminderEngine.normalize(c);
    const rec = (() => {
      if (c.weeklyReview.actions[key]) return { kind: 'done', title: 'اعتمدتم خطوة هذا الأسبوع', desc: 'يمكنكم العودة للخطة وتعديلها متى احتجتم.' };
      if (c.autopilot && c.autopilot.enabled && c.autopilot.count > 3 && total <= 3) return { kind: 'lighter', title: 'خففوا قائمة المساعد إلى 3 مهام', desc: 'الأسبوع الهادئ يحتاج بداية أصغر، لا ضغطًا أكبر.' };
      if (this.activeRoutine() && !ReminderEngine.activeSlots(c).length) return { kind: 'timing', title: 'اختاروا وقت تذكير هادئ للروتين', desc: 'وقت واحد واضح قد يجعل البدء أسهل من تكرار الطلبات.' };
      if (total <= 2 && c.tasks.length > 3) return { kind: 'split', title: 'قسّموا مهمة واحدة إلى خطوتين', desc: 'تحويل المهمة الكبيرة إلى خطوتين يجعل البداية أوضح.' };
      return { kind: 'keep', title: 'استمروا على الخطة الحالية', desc: 'الإيقاع الحالي متوازن؛ لا تحتاجون تغييرًا لمجرد التغيير.' };
    })();
    const totalPhotos = S.children.reduce((sum, child) => sum + (child.pendingProofs || []).filter(p => !!p.photo).length + (child.feed || []).filter(f => !!f.img).length, 0);
    return { key, total, previous, activeDays, dayCounts, catCounts, recommendation: rec, photos: totalPhotos, cloud: typeof Sync !== 'undefined' && Sync.isConfigured() };
  },

  weeklyReviewCardHtml() {
    const s = this.weeklyReviewSummary();
    const trend = s.previous ? (s.total >= s.previous ? 'مستقر أو أفضل من الأسبوع السابق' : 'أقل من الأسبوع السابق — وهذا لا يعني فشلًا') : 'أول أسبوع نقرأ منه الإيقاع';
    return `<div class="card weekly-review-card">
      <div class="weekly-review-card__top"><span>🗓️</span><div><h3>مراجعة الأسبوع التالي</h3><p>${s.total} مهمة خلال ${s.activeDays} ${s.activeDays === 1 ? 'يوم نشط' : 'أيام نشطة'} · ${trend}</p></div></div>
      <div class="weekly-review-card__recommend"><b>اقتراح واحد: ${esc(s.recommendation.title)}</b><small>${esc(s.recommendation.desc)}</small></div>
      <button class="btn-primary purple" onclick="App.openWeeklyReview()">راجع بهدوء ←</button>
    </div>`;
  },

  openWeeklyReview() {
    const s = this.weeklyReviewSummary();
    const c = C();
    const catLines = Object.entries(s.catCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([cat, n]) => `<span class="pill">${(CATEGORIES[cat] || {}).emoji || '⭐'} ${(CATEGORIES[cat] || {}).name || cat}: <b>${n}</b></span>`).join('') || '<span class="pill">لا يوجد مسار كافٍ للحكم بعد</span>';
    const actionButton = s.recommendation.kind === 'done'
      ? '<button class="btn-ghost" onclick="App.closeModal()">حسنًا</button>'
      : `<button class="btn-primary green" onclick="App.applyWeeklyReview('${s.recommendation.kind}')">اعتماد هذه الخطوة</button>`;
    const privacyText = s.cloud
      ? 'المراجعة تُحسب على هذا الجهاز، ثم تدخل في المزامنة العائلية التي فعّلتموها. لا تشارك صور الإثبات أو تفاصيل المنزل مع المدرسة.'
      : 'المراجعة تُحسب وتبقى على هذا الجهاز. لا توجد مزامنة عائلية مفعلة حاليًا.';
    this.openModal(`<section class="weekly-review-modal"><p class="onboarding-kicker">قرار صغير للأسبوع القادم</p><h2>كيف كان الإيقاع؟</h2>
      <div class="weekly-review-stats"><div><b>${s.total}</b><span>مهمة</span></div><div><b>${s.activeDays}</b><span>أيام نشطة</span></div><div><b>${s.previous}</b><span>الأسبوع السابق</span></div></div>
      <div class="weekly-review-bars">${s.dayCounts.slice().reverse().map((n, i) => `<i title="${n} مهام" style="height:${Math.max(10, Math.round(n / Math.max(1, ...s.dayCounts) * 100))}%"><small>${n}</small><em>${i === 6 ? 'اليوم' : ''}</em></i>`).join('')}</div>
      <h3>المسارات التي ظهرت هذا الأسبوع</h3><div class="pill-list">${catLines}</div>
      <div class="weekly-review-action"><span>💡</span><div><b>${esc(s.recommendation.title)}</b><p>${esc(s.recommendation.desc)}</p></div></div>
      <div class="privacy-snapshot"><b>🔒 خصوصية الأسرة</b><p>${privacyText}</p><small>${s.photos} صورة إثبات/ذكرى محفوظة داخل بيانات الأسرة. لا تعرضها هذه المراجعة ولا تقرير المدرسة المختصر.</small></div>
      <div class="form-row" style="margin-top:14px"><div><button class="btn-ghost" onclick="App.closeModal()">لاحقًا</button></div><div>${actionButton}</div></div>
    </section>`);
  },

  applyWeeklyReview(kind) {
    const c = C();
    const key = this.weeklyReviewKey();
    c.weeklyReview = Object.assign({ actions: {}, seenWeeks: {} }, c.weeklyReview || {});
    if (kind === 'lighter') {
      c.autopilot.count = Math.min(3, c.autopilot.count || 3);
      runAutopilot(true);
      c.weeklyReview.actions[key] = 'lighter';
      save();
      this.closeModal();
      this.renderPReport();
      this.toast('خففنا قائمة المساعد إلى 3 مهام يومية ✅');
      return;
    }
    if (kind === 'timing') {
      c.weeklyReview.actions[key] = 'timing';
      save();
      this.closeModal();
      this.openReminderManager();
      return;
    }
    if (kind === 'split') {
      this.openWeeklySplitForm();
      return;
    }
    c.weeklyReview.actions[key] = 'keep';
    c.weeklyReview.seenWeeks[key] = new Date().toISOString();
    save();
    this.closeModal();
    this.renderPReport();
    this.toast('تم تثبيت الخطة للأسبوع القادم ✅');
  },

  openWeeklySplitForm() {
    const done = new Set(C().completions[todayKey()] || []);
    const candidates = C().tasks.filter(t => !done.has(t.id));
    const task = candidates[0];
    if (!task) { this.toast('لا توجد مهمة متاحة لتقسيمها الآن'); return; }
    this.openModal(`<section class="weekly-split-modal"><h3>✂️ قسّم مهمة إلى خطوتين</h3><p class="muted">عدّل النصين كما يناسب طفلك. ستحتفظ الخطوتان بإجمالي XP والجزر نفسه، ولن تُحذف أي مهمة مكتملة.</p>
      <div class="form-grid"><div><label>المهمة</label><select id="weekly-split-task">${candidates.map(t => `<option value="${t.id}">${esc(t.title)}</option>`).join('')}</select></div>
      <div><label>الخطوة الأولى</label><input id="weekly-split-first" value="ابدأ: ${esc(task.title)}" /></div>
      <div><label>الخطوة الثانية</label><input id="weekly-split-second" value="أكمل: ${esc(task.title)}" /></div>
      <button class="btn-primary green" onclick="App.saveWeeklySplit()">حفظ الخطوتين</button></div></section>`);
  },

  saveWeeklySplit() {
    const id = document.getElementById('weekly-split-task').value;
    const first = document.getElementById('weekly-split-first').value.trim();
    const second = document.getElementById('weekly-split-second').value.trim();
    const task = C().tasks.find(t => t.id === id);
    if (!task || !first || !second) { this.toast('اكتب الخطوتين أولًا'); return; }
    const originalXp = task.xp, originalCoins = task.coins;
    task.title = first;
    task.xp = Math.max(1, Math.ceil(originalXp / 2));
    task.coins = Math.max(1, Math.ceil(originalCoins / 2));
    C().tasks.push(Object.assign({}, task, { id: uid(), title: second, xp: Math.max(1, originalXp - task.xp), coins: Math.max(1, originalCoins - task.coins), splitFrom: id }));
    C().weeklyReview = Object.assign({ actions: {}, seenWeeks: {} }, C().weeklyReview || {});
    C().weeklyReview.actions[this.weeklyReviewKey()] = 'split';
    save();
    this.closeModal();
    this.renderPReport();
    this.renderPTasks();
    this.toast('تحولت المهمة إلى خطوتين أصغر ✅');
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
      ${this.weeklyReviewCardHtml()}
      <div class="card">
        <h3>نظرة عامة على ${esc(C().name)}</h3>
        <div class="pill-list" style="margin-bottom:12px">
          <span class="pill">${worldOf(C().journey.stage).emoji} ${worldOf(C().journey.stage).name} — مرحلة <b>${Math.min(C().journey.stage + 1, TOTAL_STAGES)}</b></span>
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
      <div class="form-row"><div><button class="btn-primary purple" onclick="App.shareWeeklyReport()">📤 مشاركة تقرير الأسبوع</button></div><div><button class="btn-ghost" onclick="App.openSchoolSummary()">🏫 ملخص تعليمي محدود</button></div></div>`;
  },

  /* ملخص اختياري للمعلم: لا يتضمن صور إثبات أو مهام المنزل أو بيانات المزامنة */
  schoolSummaryData() {
    const c = C();
    const studyIds = new Set(c.tasks.filter(t => t.cat === 'study').map(t => t.id));
    for (const [id, cat] of Object.entries(c.taskArchive || {})) if (cat === 'study') studyIds.add(id);
    let studyDone = 0;
    for (let i = 0; i < 7; i++) studyDone += (c.completions[dayKeyOffset(-i)] || []).filter(id => studyIds.has(id)).length;
    const quizzes = (S.quizzes || []).filter(q => c.quizzesDone && c.quizzesDone[q.id] !== undefined)
      .map(q => ({ title: q.title, teacher: q.teacher, score: c.quizzesDone[q.id], total: q.questions.length }));
    return { studyDone, quizzes };
  },

  openSchoolSummary() {
    const d = this.schoolSummaryData();
    const quizRows = d.quizzes.length ? d.quizzes.map(q => `<li>${esc(q.title)}: ${q.score}/${q.total}</li>`).join('') : '<li>لا توجد نتائج اختبارات مكتملة هذا الأسبوع.</li>';
    this.openModal(`<section class="school-summary-modal"><h3>🏫 ملخص تعليمي محدود</h3>
      <p class="muted">هذه معاينة قبل المشاركة. لا تحتوي على اسم الطفل افتراضيًا، ولا صور إثبات، ولا تفاصيل المهام المنزلية أو الأسرة.</p>
      <div class="school-summary-preview"><b>جَزَرة — ملخص تعلم لآخر 7 أيام</b><p>مهام تعلم مكتملة: <strong>${d.studyDone}</strong></p><ul>${quizRows}</ul></div>
      <label class="reminder-main-toggle"><input id="school-include-name" type="checkbox" /> أضف اسم الطفل إلى الملخص</label>
      <div class="form-row" style="margin-top:14px"><div><button class="btn-ghost" onclick="App.closeModal()">إلغاء</button></div><div><button class="btn-primary green" onclick="App.shareSchoolSummary()">مشاركة الملخص</button></div></div>
    </section>`);
  },

  shareSchoolSummary() {
    const d = this.schoolSummaryData();
    const includeName = !!(document.getElementById('school-include-name') || {}).checked;
    const lines = ['🏫 جَزَرة — ملخص تعلم لآخر 7 أيام'];
    if (includeName) lines.push(`الطالب/ـة: ${C().name}`);
    lines.push(`مهام تعلم مكتملة: ${d.studyDone}`);
    if (d.quizzes.length) {
      lines.push('نتائج الاختبارات المكتملة:');
      d.quizzes.forEach(q => lines.push(`- ${q.title}: ${q.score}/${q.total}`));
    } else lines.push('لا توجد نتائج اختبارات مكتملة في الفترة المختارة.');
    lines.push('', 'هذا الملخص لا يشمل صورًا أو مهام منزلية أو معلومات عائلية.');
    const text = lines.join('\n');
    this.closeModal();
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
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
          <div class="t-meta">🎓 ${gradeName(c.grade)}${c.birthdate ? ` · 🎂 ${daysToBirthday(c.birthdate) === 0 ? 'عيد ميلاده اليوم! 🎉' : 'بعد ' + daysToBirthday(c.birthdate) + ' يوم'}` : ''}</div>
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
        <p class="muted" style="margin-top:6px">🛡️ ${typeof Sync.mergeStatus === 'function' ? esc(Sync.mergeStatus()) : 'تتزامن بيانات الأسرة بين الأجهزة.'}</p>
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
      <div class="card audio-card" style="margin-top:14px">
        <h3>🔊 صوت جزّور</h3>
        <p class="muted" style="margin-bottom:10px">يدعم التطبيق ملفات صوت بشرية داخل <span dir="ltr">audio/prompts/ar</span> عند إضافتها، ويستخدم نطق الجهاز كخطة بديلة.</p>
        <div class="form-row">
          <div><button class="btn-primary purple" onclick="App.audioSettingsForm()">اختبار واختيار الصوت</button></div>
          <div><button class="btn-primary green" onclick="App.testKidAudio()">جرّب التشجيع ✨</button></div>
        </div>
      </div>
      <div class="card" style="margin-top:14px">
        <h3>⏱️ وقت الشاشة</h3>
        <div class="form-grid">
          <div><label>دقائق اللعب المكتسبة مع كل مهمة منجزة (0 = إيقاف)</label>
          <input id="f-screenper" type="number" min="0" max="60" value="${S.screenPerTask}" /></div>
          <button class="btn-primary green" onclick="S.screenPerTask=Math.max(0,parseInt(document.getElementById('f-screenper').value)||0);save();App.toast('تم الحفظ ✅')">حفظ</button>
          <p class="muted">رصيد ${esc(C().name)} الحالي: ${(C().screenTime && C().screenTime.balance) || 0} دقيقة · استُخدم مؤخرًا: ${((C().screenTime && C().screenTime.log) || []).filter(l => l.kind === 'use').slice(-3).map(l => l.mins + 'د').join('، ') || '—'}</p>
        </div>
      </div>
      <div class="card">
        <h3>📅 التقويم المدرسي (مركزي)</h3>
        <p class="muted" style="margin-bottom:8px">يُدار من إدارة جَزَرة ويُعمم على كل العائلات</p>
        ${typeof Meta !== 'undefined' && Meta.calendar().length
          ? Meta.calendar().map(e => `<p class="pill" style="margin-bottom:6px">📅 ${esc(e.title)} — ${e.start_date}${e.end_date ? ' → ' + e.end_date : ''}</p>`).join('')
          : '<p class="muted">لا أحداث بعد — نفّذ ملف supabase-setup-2.sql ثم أدر التقويم من لوحة Supabase</p>'}
      </div>
      <div class="card" style="margin-top:14px">
        <h3>البيانات</h3>
        <p class="muted" style="margin-bottom:10px">تُحفظ البيانات محليًا على هذا الجهاز فقط · نسخة التطبيق: <b>بناء ${APP_BUILD}</b></p>
        <button class="btn-ghost" style="width:100%;color:#ff5d5d;border-color:#ffd0d0" onclick="App.resetAll()">🗑️ إعادة ضبط التطبيق بالكامل</button>
      </div>`;
  },

  audioSettingsForm() {
    const A = window.JazarahAudio;
    const voices = A ? A.voiceOptions('ar-SA') : [];
    const saved = localStorage.getItem('jazarah_voice_ar-SA') || '';
    const curTone = A ? A.toneName() : 'child_soft';
    const tones = A ? A.tones : {};
    this.openModal(`
      <h3>🔊 إعداد صوت جزّور</h3>
      <p class="muted" style="margin-bottom:12px">اختر شخصية صوت جزّور ثم أفضل صوت عربي متوفر في الجهاز — واسمع الفرق مباشرة.</p>
      <div class="form-grid">
        <div>
          <label>شخصية الصوت</label>
          <div class="tone-grid">
            ${Object.entries(tones).map(([k, t]) => `
              <button class="tone-tile ${k === curTone ? 'on' : ''}" onclick="App.pickTone('${k}')">
                <b>${esc(t.label)}</b><small>${esc(t.intro)}</small>
              </button>`).join('')}
          </div>
        </div>
        <div>
          <label>الصوت العربي في الجهاز</label>
          <select id="f-voice">
            <option value="">اختيار تلقائي (يفضّل الصوت الناعم)</option>
            ${voices.map(v => `<option value="${esc(v.name)}" ${v.name === saved ? 'selected' : ''}>${esc(v.name)} — ${esc(v.lang)}</option>`).join('')}
          </select>
          ${voices.length ? '' : '<p class="muted">لا تظهر أصوات عربية حاليًا في هذا المتصفح؛ جرّب من الجهاز الحقيقي أو Android/iOS.</p>'}
        </div>
        <button class="btn-primary green" onclick="App.saveAudioVoice()">حفظ وتجربة الصوت</button>
        <button class="btn-ghost" onclick="App.testKidAudio()">تشغيل مؤثر نجاح قصير</button>
      </div>`);
  },

  pickTone(name) {
    if (window.JazarahAudio) JazarahAudio.saveTone(name);
    document.querySelectorAll('.tone-tile').forEach(b => b.classList.toggle('on', b.getAttribute('onclick').includes(`'${name}'`)));
    const t = window.JazarahAudio ? JazarahAudio.tones[name] : null;
    speak(t ? `أنا جزّور بصوت ${t.label}. هيا نكمل مغامرتنا!` : 'أنا جزّور!', 'ar-SA');
  },

  saveAudioVoice() {
    const name = document.getElementById('f-voice').value;
    if (window.JazarahAudio) JazarahAudio.saveVoice('ar-SA', name);
    this.toast('تم حفظ الصوت ✅');
    this.testKidAudio();
  },

  testKidAudio() {
    if (window.JazarahAudio) JazarahAudio.cheer('أحسنت يا بطل! جزّور فخور بك.');
    else speak('أحسنت يا بطل! جزّور فخور بك.', 'ar-SA');
  },

  /* إنشاء / تعديل حساب طفل — من لوحة الوالد فقط */
  childForm(childId, prefillName) {
    const c = childId ? S.children.find(x => x.id === childId) : null;
    const curBase = c ? heroBase(c) : 'c1';
    const curBg = c ? heroBg(c) : AVATAR_BGS[0];
    const bases = AVATAR_BASES.filter(b => b.lvl <= (c ? levelOf(c.xp) : 1) || b.lvl === 1);
    const baseGrid = bases.map(b =>
      `<button class="av-pick ${b.id === curBase ? 'active' : ''}" data-base="${b.id}" title="${b.name}" onclick="App.pickAvBase(this)">${faceHTML(b.id)}</button>`).join('');
    const bgRow = AVATAR_BGS.map(bg =>
      `<button class="bg-pick ${bg === curBg ? 'active' : ''}" data-bg="${bg}" style="background:${bg}" onclick="App.pickAvBg(this)"></button>`).join('');
    const gradeOptions = Object.entries(GRADES).map(([k, g]) =>
      `<option value="${k}" ${(c ? c.grade : 'g1') === k ? 'selected' : ''}>${g.name}</option>`).join('');
    this.openModal(`
      <h3>${c ? 'تعديل حساب ' + esc(c.name) : '＋ بطل جديد'}</h3>
      <div class="form-grid">
        <div><label>الاسم</label><input id="f-cname" value="${c ? esc(c.name) : (prefillName ? esc(prefillName) : '')}" placeholder="اسم الطفل" /></div>
        ${c ? `<div><label>اسم المستخدم</label><input id="f-cuser" value="${esc(c.username)}" dir="ltr" /></div>` : ''}
        <div class="form-row">
          <div><label>تاريخ الميلاد 🎂</label><input id="f-cbirth" type="date" value="${c && c.birthdate ? c.birthdate : ''}" onchange="App.birthdateChanged()" /></div>
          <div><label>الصف الدراسي 🎓</label><select id="f-cgrade">${gradeOptions}</select></div>
        </div>
        <div><label>وِرد القرآن اليومي (دقائق) 📖</label><input id="f-cquran" type="number" min="1" max="60" value="${c ? (c.quranDaily || 5) : 5}" /></div>
        <p id="grade-hint" class="muted" style="min-height:1.2em">${c && c.birthdate ? `العمر: ${ageOf(c.birthdate)} سنة` : 'العمر يخصص الأسئلة والألعاب المناسبة'}</p>
        <div><label>الشخصية</label><div class="av-grid">${baseGrid}</div></div>
        <div><label>لون الخلفية</label><div class="bg-row">${bgRow}</div></div>
        <button class="btn-primary green" onclick="App.saveChild('${childId || ''}')">حفظ ✅</button>
      </div>`);
  },

  /* عند اختيار الميلاد: نقترح الصف تلقائيًا */
  birthdateChanged() {
    const b = document.getElementById('f-cbirth').value;
    if (!b) return;
    const age = ageOf(b);
    if (age === null || age < 3 || age > 15) return;
    const g = suggestGrade(age);
    document.getElementById('f-cgrade').value = g;
    document.getElementById('grade-hint').textContent = `العمر ${age} سنة — اقترحنا ${gradeName(g)} (عدّله إن لزم)`;
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
    const base = (document.querySelector('.av-pick.active') || {}).dataset ? document.querySelector('.av-pick.active').dataset.base : 'c1';
    const bg = (document.querySelector('.bg-pick.active') || {}).dataset ? document.querySelector('.bg-pick.active').dataset.bg : AVATAR_BGS[0];
    const birthdate = document.getElementById('f-cbirth').value || null;
    const grade = document.getElementById('f-cgrade').value || 'g1';
    if (childId) {
      const c = S.children.find(x => x.id === childId);
      c.name = name;
      const userEl = document.getElementById('f-cuser');
      if (userEl && userEl.value.trim()) c.username = userEl.value.trim().replace(/\s+/g, '_');
      c.avatar = { base, bg };
      c.birthdate = birthdate;
      c.grade = grade;
      c.quranDaily = Math.max(1, parseInt(document.getElementById('f-cquran').value) || 5);
    } else {
      const c = defaultChild(name, base, bg);
      c.birthdate = birthdate;
      c.grade = grade;
      c.quranDaily = Math.max(1, parseInt(document.getElementById('f-cquran').value) || 5);
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
    // رحلة العوالم: افحص التقدم بعد كل كسب (يلتقط كل مصادر النقاط)
    const jEvents = journeyUpdate(C());
    for (const ev of jEvents) {
      if (ev.type === 'world') {
        const w = WORLDS[ev.world];
        this.celebrate(`عالم جديد! ${w.emoji}`,
          `هزمت زعيم ${esc(WORLDS[ev.world - 1].name)} ودخلت <b>${esc(w.name)}</b>!<br /><small>فُتحت خلفية ${esc(WORLDS[ev.world - 1].name)} في استوديو البطل 🎨</small>`,
          ['🏆 إنجاز ملحمي'], w.emoji);
        speak(`مبروك! وصلت إلى ${w.name}`, 'ar-SA');
      } else if (ev.type === 'finish') {
        this.celebrate('أسطورة جَزَرة! 🐉👑', 'أكملت رحلة العوالم الثمانية كاملة!<br />أنت من أبطال التاريخ', ['👑 المجد الخالد'], '🏰');
      } else {
        const j = C().journey;
        this.celebrate(`المرحلة ${j.stage + 0} ✨`,
          `تقدمت في ${esc(worldOf(j.stage).name)} ${worldOf(j.stage).emoji}<br /><small>${isBossStage(j.stage) ? 'التالية بوابة الزعيم! تحتاج جهدًا مضاعفًا 👾' : 'واصل غدًا لمرحلة جديدة'}</small>`,
          [`🗺️ ${j.stage} / ${TOTAL_STAGES}`], '🚩');
      }
      // فصل جديد من حكاية جزّور يُعرض بعد إغلاق الاحتفال + يظهر في شريط يوم الوالد
      const jStage = C().journey.stage;
      if (jStage > 0 && STORY[jStage - 1]) this._storyToShow = jStage - 1;
      feedPush(C(), '🗺️', ev.type === 'world' ? `دخل ${WORLDS[ev.world].name} ${WORLDS[ev.world].emoji}` : `قطع المرحلة ${jStage} في رحلة العوالم`);
      save();
      this._applyWorldTheme();
      if (document.getElementById('ktab-map').classList.contains('active')) this.renderKMap();
    }
    const lvl = levelOf(C().xp);
    const mini = document.getElementById('kid-avatar-mini');
    mini.innerHTML = heroFace(C());
    mini.style.background = heroBg(C());
    document.getElementById('kid-name-mini').textContent = C().name;
    document.getElementById('stat-coins').textContent = C().coins;
    document.getElementById('stat-streak').textContent = C().streak;
  },

  /* ── الروتين البصري للطفل ── */
  activeRoutine() {
    const routines = (C().routines || []).filter(r => r && r.active !== false && Array.isArray(r.steps) && r.steps.length);
    return routines[0] || null;
  },

  routineState(routine) {
    if (!routine) return null;
    if (!C().routineProgress || C().routineProgress.date !== todayKey()) {
      C().routineProgress = { date: todayKey(), byRoutine: {} };
    }
    const all = C().routineProgress.byRoutine || (C().routineProgress.byRoutine = {});
    if (!all[routine.id]) all[routine.id] = { done: [], startedAt: null, completedAt: null, timerLeft: routine.timerSeconds || 0 };
    const state = all[routine.id];
    state.done = Array.isArray(state.done) ? state.done : [];
    if (state.timerLeft === undefined) state.timerLeft = routine.timerSeconds || 0;
    return state;
  },

  worldBloomCardHtml() {
    const bloom = worldBloomStatus(C());
    const nextText = bloom.next ? `${Math.max(0, bloom.next.needed - bloom.earned)} إنجازات صغيرة حتى ${bloom.next.title}` : 'أكملت كل معالم عالم جزّور — استمر كما تحب.';
    return `<section class="world-bloom-card" aria-label="تطور عالم جزّور">
      <div class="world-bloom-card__top"><span>${bloom.stage.emoji}</span><div><p>عالم جزّور يكبر معك</p><h3>${esc(bloom.stage.title)}</h3></div><b>${bloom.earned}</b></div>
      <p>${esc(bloom.stage.note)}</p>
      <div class="world-bloom-card__meter"><i style="width:${bloom.percent}%"></i></div>
      <small>${esc(nextText)}</small>
    </section>`;
  },

  routineCardHtml() {
    const routine = this.activeRoutine();
    if (!routine) return '';
    const state = this.routineState(routine);
    const total = routine.steps.length;
    const done = state.done.length;
    const complete = done >= total;
    const next = routine.steps.find(s => !state.done.includes(s.id));
    const progress = Math.min(100, Math.round(done / Math.max(1, total) * 100));
    return `<section class="visual-routine ${complete ? 'visual-routine--done' : ''}" aria-label="${esc(routine.title)}">
      <div class="visual-routine__icon">${routine.emoji}</div>
      <div class="visual-routine__copy">
        <span class="eyebrow">روتينك الآن ${complete ? 'مكتمل' : ''}</span>
        <h2>${esc(routine.title)}</h2>
        <p>${complete ? 'أحسنت! أنهيت خطوات روتينك بهدوء.' : `التالي: ${esc(next ? next.title : routine.intro)}`}</p>
        <div class="visual-routine__meter"><i style="width:${progress}%"></i></div>
        <small>${done}/${total} خطوات ${routine.timerSeconds ? '· ⏳ مؤقت اختياري' : ''}${routine.audio ? ' · 🔊 صوت جزّور' : ''}</small>
      </div>
      <button class="visual-routine__cta" onclick="App.openVisualRoutine('${routine.id}')">${complete ? 'راجع روتيني' : 'ابدأ الروتين ←'}</button>
    </section>`;
  },

  openVisualRoutine(routineId) {
    const routine = (C().routines || []).find(r => r.id === routineId);
    if (!routine) return;
    const state = this.routineState(routine);
    if (!state.startedAt) { state.startedAt = new Date().toISOString(); save(); }
    if (routine.audio) this.sayRoutine(routineId, true);
    this.renderVisualRoutineModal(routineId);
  },

  renderVisualRoutineModal(routineId) {
    const routine = (C().routines || []).find(r => r.id === routineId);
    if (!routine) return;
    const state = this.routineState(routine);
    const done = state.done.length;
    const total = routine.steps.length;
    const complete = done >= total;
    const next = routine.steps.find(s => !state.done.includes(s.id));
    const clock = routine.timerSeconds ? `<div class="routine-timer ${state.timerLeft <= 0 ? 'routine-timer--end' : ''}" id="routine-timer-${routine.id}">⏳ ${this.routineTimerLabel(state.timerLeft)}</div>` : '';
    const steps = routine.steps.map((step, index) => {
      const isDone = state.done.includes(step.id);
      const isNext = next && next.id === step.id;
      return `<button class="routine-step ${isDone ? 'routine-step--done' : ''} ${isNext ? 'routine-step--next' : ''}" ${isDone ? 'disabled' : ''} onclick="App.completeRoutineStep('${routine.id}','${step.id}')">
        <span class="routine-step__number">${isDone ? '✓' : index + 1}</span>
        <span class="routine-step__emoji">${step.emoji || '⭐'}</span>
        <span class="routine-step__copy"><b>${esc(step.title)}</b><small>${esc(step.hint || '')}</small></span>
        ${isNext ? '<em>الآن</em>' : ''}
      </button>`;
    }).join('');
    this.openModal(`<section class="routine-player" aria-label="${esc(routine.title)}">
      <div class="routine-player__top"><span>${routine.emoji}</span><div><p>خطوات صغيرة، تركيز أكبر</p><h2>${esc(routine.title)}</h2></div><b>${done}/${total}</b></div>
      <p class="routine-player__intro">${complete ? 'أنجزت الروتين اليوم. تستطيع مراجعة الخطوات وقتما شئت.' : esc(routine.intro || '')}</p>
      ${clock}
      <div class="routine-step-list">${steps}</div>
      <div class="routine-player__actions">
        ${routine.audio ? `<button class="btn-ghost" onclick="App.sayRoutine('${routine.id}', false)">🔊 اسمع الخطوة</button>` : ''}
        ${routine.timerSeconds ? `<button class="btn-primary purple" onclick="App.startRoutineTimer('${routine.id}')">${state.timerLeft && state.timerLeft < routine.timerSeconds ? 'واصل المؤقت' : 'ابدأ مؤقت التركيز'}</button>` : ''}
      </div>
    </section>`);
  },

  sayRoutine(routineId, intro) {
    const routine = (C().routines || []).find(r => r.id === routineId);
    if (!routine) return;
    const state = this.routineState(routine);
    const step = routine.steps.find(s => !state.done.includes(s.id));
    const text = intro
      ? `${routine.title}. ${routine.intro || 'نبدأ بهدوء.'} ${step ? 'أول خطوة: ' + step.title : 'أحسنت، أكملت كل الخطوات.'}`
      : (step ? `${step.title}. ${step.hint || 'خذ وقتك، أنا معك.'}` : 'أحسنت، أكملت روتينك اليوم.');
    speak(text, 'ar-SA');
  },

  completeRoutineStep(routineId, stepId) {
    const routine = (C().routines || []).find(r => r.id === routineId);
    if (!routine) return;
    const state = this.routineState(routine);
    if (state.done.includes(stepId)) return;
    state.done.push(stepId);
    const step = routine.steps.find(s => s.id === stepId);
    const complete = state.done.length >= routine.steps.length;
    if (complete) {
      state.completedAt = new Date().toISOString();
      feedPush(C(), routine.emoji || '🧩', `أكمل روتين: ${routine.title}`);
    }
    save();
    if (routine.audio) {
      const following = routine.steps.find(s => !state.done.includes(s.id));
      speak(complete ? `أحسنت يا ${C().name}! أكملت ${routine.title}.` : `رائع! الخطوة التالية: ${following ? following.title : 'أكملت الروتين.'}`, 'ar-SA');
    }
    if (complete) {
      this.closeModal();
      this.renderKMap();
      this.celebrate('روتين مكتمل! 🌟', `أتممت ${esc(routine.title)} خطوة خطوة. الآن اختر مهمة اليوم التالية.`, ['🤍 استقلالك يكبر كل يوم'], routine.emoji || '🌟');
    } else this.renderVisualRoutineModal(routineId);
  },

  routineTimerLabel(seconds) {
    const n = Math.max(0, Number(seconds) || 0);
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
  },

  startRoutineTimer(routineId) {
    const routine = (C().routines || []).find(r => r.id === routineId);
    if (!routine || !routine.timerSeconds) return;
    const state = this.routineState(routine);
    if (!state.timerLeft || state.timerLeft < 1) state.timerLeft = routine.timerSeconds;
    clearInterval(this._routineTimer);
    this._routineTimer = setInterval(() => {
      const el = document.getElementById('routine-timer-' + routineId);
      if (!el) { clearInterval(this._routineTimer); return; }
      state.timerLeft = Math.max(0, state.timerLeft - 1);
      el.textContent = '⏳ ' + this.routineTimerLabel(state.timerLeft);
      if (state.timerLeft <= 0) {
        clearInterval(this._routineTimer);
        el.classList.add('routine-timer--end');
        save();
        if (routine.audio) speak('انتهى وقت التركيز. أحسنت، انتقل للخطوة التالية بهدوء.', 'ar-SA');
      }
    }, 1000);
  },

  /* ── خريطة المغامرة ── */
  renderKMap() {
    const today = todayKey();
    const doneIds = new Set(C().completions[today] || []);
    const pendingToday = new Set(C().pendingProofs.filter(p => p.date === today).map(p => p.taskId));
    const visibleTasks = C().tasks
      .filter(t => !isWeekend() || t.cat !== 'study' || t.weekendOk)
      .filter(t => !t.mine || t.id === 'mine-' + today);
    const nextStep = this._nextKidStep(doneIds, pendingToday);
    const todayTotal = visibleTasks.length;
    const todayDone = visibleTasks.filter(t => doneIds.has(t.id)).length;
    const todayPending = visibleTasks.filter(t => pendingToday.has(t.id)).length;
    const progressPct = Math.min(100, Math.round((todayDone / Math.max(1, todayTotal)) * 100));
    const mood = this.jazzourMood();
    const heartsWaiting = (C().feed || []).filter(f => f.heart && !f.seen).length;
    const routineCard = this.routineCardHtml();
    const worldBloomCard = this.worldBloomCardHtml();

    const taskState = (task) => {
      if (doneIds.has(task.id)) return { key: 'done', badge: 'مكتملة', icon: '✅', cta: 'تم الإنجاز', disabled: true, note: 'أحسنت، تقدمت في مغامرتك.' };
      if (pendingToday.has(task.id)) return { key: 'pending', badge: 'بانتظار الوالد', icon: '⏳', cta: 'أُرسل للمراجعة', disabled: true, note: 'سيصل التقدير بعد المراجعة.' };
      if (task.proof === 'photo') return { key: 'ready', badge: 'تحتاج صورة', icon: '📸', cta: 'التقط دليلك', disabled: false, note: 'صورة بسيطة تثبت إنجازك.' };
      if (task.proof === 'parent') return { key: 'ready', badge: 'تحتاج موافقة', icon: '👀', cta: 'اطلب موافقة والدي', disabled: false, note: 'سنرسل طلبًا قصيرًا لوالدك.' };
      return { key: 'ready', badge: 'جاهزة الآن', icon: '⭐', cta: 'أنجزتها', disabled: false, note: 'أكملها ثم اضغط لتكسب مكافأتك.' };
    };

    let html = `
      <section class="guided-day" aria-label="مسار اليوم">
        <div class="guided-day__hero">
          <button class="jz-char" id="jz-char" onpointerdown="App.jzDown(event)" aria-label="تحدث مع جزّور">
            <img src="${this.jzSrc(this.MOOD_POSE[mood])}" alt="جزّور" draggable="false" />
            ${heartsWaiting ? `<span class="jz-heart-badge">❤️ ${heartsWaiting}</span>` : ''}
          </button>
          <div class="guided-day__greeting">
            <span class="eyebrow">رفيقك في ${esc(worldOf(C().journey.stage).name)}</span>
            <div class="jz-bubble guided-day__bubble">${this._jazzourBubble(mood)}</div>
          </div>
        </div>

        ${routineCard}
        ${worldBloomCard}

        <section class="next-mission" aria-label="المهمة التالية">
          <div class="next-mission__topline">
            <span class="next-mission__label">التالي لك الآن</span>
            <span class="next-mission__today">${todayDone}/${todayTotal || 1} مهام اليوم</span>
          </div>
          <div class="next-mission__content">
            <div class="next-mission__icon">${nextStep.icon || '⭐'}</div>
            <div class="next-mission__copy">
              <h2>${esc(nextStep.title)}</h2>
              <p>${esc(nextStep.desc)}</p>
              ${nextStep.hint ? `<small>${esc(nextStep.hint)}</small>` : ''}
            </div>
          </div>
          <div class="next-mission__actions">
            <button class="btn-primary big" onclick="${nextStep.action}">${nextStep.cta}</button>
            <button class="listen-pill" data-say="${esc(nextStep.say)}" onclick="App.sayText(this)">🔊 اسمع المهمة</button>
          </div>
          <div class="today-meter" aria-label="تقدم اليوم ${todayDone} من ${todayTotal || 1}">
            <div><span>تقدم اليوم</span><b>${todayDone}/${todayTotal || 1}</b></div>
            <i><em style="width:${progressPct}%"></em></i>
          </div>
        </section>`;

    if (C().lastDailyChest !== today) {
      html += `
        <button class="entry-treasure" onclick="App.openDailyChest()">
          <span class="entry-treasure__emoji">🎁</span>
          <span><b>هدية دخولك جاهزة</b><small>افتحها متى أحببت — لن توقف مغامرتك</small></span>
          <span class="entry-treasure__action">افتح</span>
        </button>`;
    }

    if (C().mysteryBox) {
      html += `
        <button class="mystery-node" onclick="App.openMystery()">
          <span class="m-emoji">📦</span>
          <span><b>صندوق مفاجأة في عالمك</b><br /><small>هدية إضافية، افتحها عندما تكون مستعدًا</small></span>
        </button>`;
    }

    html += `
        <section class="today-quests" aria-labelledby="today-quests-title">
          <div class="section-heading">
            <div>
              <span class="eyebrow">خطوات صغيرة، تقدم كبير</span>
              <h2 id="today-quests-title">مهام اليوم</h2>
            </div>
            ${todayPending ? `<span class="pending-summary">${todayPending} بانتظار المراجعة</span>` : ''}
          </div>`;

    if (visibleTasks.length === 0) {
      html += `<div class="today-empty"><span>🗺️</span><p>لا توجد مهام اليوم. اطلب من والدك أن يجهز لك مغامرة جديدة.</p></div>`;
    } else {
      html += '<div class="today-quest-list">';
      visibleTasks.forEach((task) => {
        const state = taskState(task);
        const reward = effectiveTask(task, today);
        html += `
          <article class="today-quest today-quest--${state.key}">
            <div class="today-quest__main">
              <span class="today-quest__emoji">${state.icon}</span>
              <div class="today-quest__copy">
                <div class="today-quest__title-row">
                  <h3>${reward.golden && state.key === 'ready' ? '✨ ' : ''}${esc(task.title)}</h3>
                  <span class="status-chip status-chip--${state.key}">${state.badge}</span>
                </div>
                ${task.teacher ? `<p class="today-quest__teacher">🏫 من ${esc(task.teacher)}</p>` : ''}
                <p class="today-quest__note">${state.note}</p>
                <div class="today-quest__reward">✨ ${reward.xp} XP <span>•</span> 🥕 ${reward.coins}${reward.golden ? ' <b>×2 اليوم</b>' : ''}</div>
              </div>
            </div>
            <div class="today-quest__actions">
              <button class="quest-listen" title="اسمع المهمة" aria-label="اسمع مهمة ${esc(task.title)}" onclick="App.sayTask('${task.id}')">🔊</button>
              <button class="quest-cta quest-cta--${state.key}" onclick="App.completeTask('${task.id}')" ${state.disabled ? 'disabled' : ''}>${state.cta}</button>
            </div>
          </article>`;
      });
      if (C().myPickDate !== today) {
        html += `
          <button class="self-choice" onclick="App.openMyPick()">
            <span>🙋</span>
            <span><b>أختار مهمة بنفسي</b><small>لأنك قائد مغامرتك أيضًا</small></span>
            <span class="self-choice__arrow">←</span>
          </button>`;
      }
      html += '</div>';
    }
    html += '</section>';

    journeyUpdate(C());
    const journey = C().journey;
    const world = worldOf(journey.stage);
    const journeyNeed = stageNeedXP(journey.stage);
    const journeyDone = journey.advanced >= 1 || journey.stage >= TOTAL_STAGES;
    const journeyPct = Math.min(100, Math.round(journey.xpToday / journeyNeed * 100));
    const quran = this._quranState();
    const qTarget = (C().quranDaily || 5) * 60;
    const qPct = Math.min(100, Math.round(quran.seconds / qTarget * 100));
    const wordGame = this._wordGameState();
    const mathGame = this._mathGameState();
    const blurGame = this._blurGameState();
    const shadowGame = this._shadowGameState();
    const gamesDone = wordGame.arDone + wordGame.enDone + mathGame.done + blurGame.done + shadowGame.done;
    const gamesTotal = WORDS_PER_DAY * 5;
    const screenTime = (C().screenTime && C().screenTime.balance) || 0;
    const libraryCount = S.quizzes.length + S.videos.length;
    const chapters = Math.min((C().journey && C().journey.stage) || 0, STORY.length);

    html += `
        <section class="world-glance" aria-label="تقدم العالم">
          <button class="journey-banner" style="--wc:${world.color}" onclick="App.openJourneyMap()">
            <span class="jb-emoji">${world.emoji}</span>
            <span class="jb-info">
              <b>${esc(world.name)} — المرحلة ${Math.min(journey.stage + 1, TOTAL_STAGES)} من ${TOTAL_STAGES}</b>
              <small>${journey.stage >= TOTAL_STAGES ? 'أكملت الرحلة كلها! 👑' : journeyDone ? 'أنجزت مرحلة اليوم ✅' : `اجمع ${journeyNeed} XP اليوم لتتقدم (${journey.xpToday}/${journeyNeed})`}</small>
              <span class="quran-bar"><i style="width:${journeyDone ? 100 : journeyPct}%"></i></span>
            </span>
            <span class="jb-map">🗺️</span>
          </button>
        </section>

        <details class="discover-world">
          <summary>
            <span><b>استكشف عالمي</b><small>القرآن، القصة، الألعاب، المكتبة والمكافآت</small></span>
            <span class="discover-world__chevron">⌄</span>
          </summary>
          <div class="discover-world__body">
            <button class="quran-card" onclick="App.openQuranKids()">
              <span class="wg-emoji">📖</span>
              <span class="wg-info"><b>وِردي من القرآن</b><small>${quran.claimed ? `أتممت وردك اليوم 🌟 · سلسلة ${quran.streak} يوم` : `اقرأ ${C().quranDaily || 5} دقائق — ${qPct}%`}</small><span class="quran-bar"><i style="width:${qPct}%"></i></span></span>
              <span class="wg-reward">${quran.claimed ? '✅' : '🥕 +8'}</span>
            </button>
            <div class="hub-grid">
              <button class="hub-tile" onclick="App.openGamesHub()"><span class="ht-emoji">🎮</span><b>الألعاب</b><small>${gamesDone >= gamesTotal ? 'أتممتها اليوم 🌟' : gamesDone + '/' + gamesTotal + ' اليوم'}</small></button>
              <button class="hub-tile" onclick="App.openStoryBook()"><span class="ht-emoji">📖</span><b>حكاية جزّور</b><small>${chapters ? chapters + ' من ' + STORY.length + ' فصلًا' : 'تبدأ بأول مرحلة'}</small></button>
              <button class="hub-tile" onclick="App.openScreenTime()"><span class="ht-emoji">⏱️</span><b>وقت الشاشة</b><small>${screenTime > 0 ? screenTime + ' دقيقة ▶️' : 'أنجز لتكسب دقائق'}</small></button>
              <button class="hub-tile" onclick="App.openLibrary()"><span class="ht-emoji">🎒</span><b>مكتبتي</b><small>${libraryCount ? libraryCount + ' فيديو واختبار' : 'رموز معلمي هنا'}</small></button>
            </div>
            ${isWeekend() ? `<div class="weekend-banner">🏖️ ${isFriday() ? 'جمعة مباركة!' : 'سبت سعيد!'} — لا دروس اليوم، استمتع بنشاطات العائلة</div>` : ''}
            ${isFriday() ? `<button class="quran-card quran-card--friday" onclick="App.openQuranFull(17)"><span class="wg-emoji">🕌</span><span class="wg-info"><b>سنة الجمعة: سورة الكهف</b><small>اقرأها الآن من مصحف جَزَرة</small></span><span class="wg-reward">📖</span></button>` : ''}
            ${S.boss && !S.boss.defeated ? `<div class="boss-card"><span class="boss-emoji">👾</span><h3>تحدي العائلة: ${esc(S.boss.title)}</h3><div class="progressbar"><i style="width:${Math.min(100, Math.round(S.boss.progress / S.boss.target * 100))}%"></i></div><p>${S.boss.progress} / ${S.boss.target} ⚔️</p><p class="boss-reward">🏆 ${esc(S.boss.reward)}</p><button class="boss-hit-btn" onclick="App.kidBossHit()">اضرب وحش الكسل! ⚔️</button></div>` : ''}
            <button class="btn-primary purple" onclick="App.shareDayReport()">📤 أرسل إنجاز اليوم لوالدي</button>
          </div>
        </details>
      </section>`;

    document.getElementById('ktab-map').innerHTML = html;
  },

  /* نطق أي نص من زر (يقرأ data-say لتفادي مشاكل علامات الاقتباس) */
  sayText(btn) {
    speak(btn.dataset.say, btn.dataset.lang || 'ar-SA');
  },

  /* ── القراءة الصوتية للمهام ── */
  sayTask(taskId) {
    const t = C().tasks.find(x => x.id === taskId);
    if (!t) return;
    const et = effectiveTask(t, todayKey());
    speak(`${t.title}. تكسب ${et.xp} نقطة خبرة و ${et.coins} جزرة`, 'ar-SA');
  },

  _nextKidStep(doneIds, pendingToday) {
    const quran = this._quranState();
    if (!quran.claimed) {
      return {
        title: 'ورد القرآن',
        desc: `اقرأ ${C().quranDaily || 5} دقائق مع جزّور.`,
        hint: 'خطوة هادئة قبل بقية المغامرة.',
        cta: 'ابدأ القرآن 📖',
        icon: '📖',
        action: 'App.openQuranKids()',
        say: `ابدأ ورد القرآن. اقرأ ${C().quranDaily || 5} دقائق مع جزّور.`,
      };
    }
    const today = todayKey();
    const nextTask = C().tasks
      .filter(t => !isWeekend() || t.cat !== 'study' || t.weekendOk)
      .filter(t => !t.mine || t.id === 'mine-' + today)
      .find(t => !doneIds.has(t.id) && !pendingToday.has(t.id));
    if (nextTask) {
      const reward = effectiveTask(nextTask, today);
      const isPhoto = nextTask.proof === 'photo';
      const needsParent = nextTask.proof === 'parent';
      return {
        title: nextTask.title,
        desc: `${CATEGORIES[nextTask.cat].name} · تكسب ${reward.coins} جزرًا و${reward.xp} XP`,
        hint: isPhoto ? 'التقط صورة بعد الإنجاز.' : needsParent ? 'سنرسل طلب مراجعة لوالدك.' : 'أكملها ثم أكد إنجازك.',
        cta: isPhoto ? 'التقط دليلك 📸' : needsParent ? 'اطلب موافقة والدي 📨' : 'أنجزتها ✅',
        icon: isPhoto ? '📸' : needsParent ? '👀' : CATEGORIES[nextTask.cat].emoji,
        action: `App.completeTask('${nextTask.id}')`,
        say: `مهمتك الآن: ${nextTask.title}.`,
      };
    }
    const wordGame = this._wordGameState();
    const mathGame = this._mathGameState();
    if (wordGame.arDone < WORDS_PER_DAY || wordGame.enDone < WORDS_PER_DAY || mathGame.done < 3) {
      return {
        title: 'ألعاب اليوم',
        desc: 'كلمات وحساب خفيفة تكسبك جزرًا إضافية.',
        hint: 'اختر لعبة صغيرة وارجع لمغامرتك.',
        cta: 'افتح الألعاب 🎮',
        icon: '🎮',
        action: 'App.openGamesHub()',
        say: 'افتح ألعاب اليوم. كلمات وحساب خفيفة.',
      };
    }
    return {
      title: 'يومك مكتمل',
      desc: 'أحسنت! أنهيت خطوات اليوم بتركيز.',
      hint: 'شارك إنجازك مع والدك أو استكشف عالمك.',
      cta: 'شارك اليوم 📤',
      icon: '🏆',
      action: 'App.shareDayReport()',
      say: 'أحسنت. يومك مكتمل يا بطل.',
    };
  },

  /* ── لعبة الحروف الناقصة ── */
  _wordGameState() {
    const c = C();
    if (!c.wordGame) c.wordGame = { date: null, arDone: 0, enDone: 0, totalSolved: 0 };
    const today = todayKey();
    if (c.wordGame.date !== today) {
      c.wordGame.date = today;
      c.wordGame.arDone = 0;
      c.wordGame.enDone = 0;
      save();
    }
    return c.wordGame;
  },

  /* اختيار حتمي لكلمة اليوم رقم i بلغة معينة — من مستوى صف الطفل */
  _dailyWord(lang, i) {
    const tier = gradeTier(C().grade);
    const all = lang === 'ar' ? WORDS_AR : WORDS_EN;
    const bank = all.filter(x => x.t === tier);
    const item = bank[strHash(todayKey() + lang + i) % bank.length];
    const letters = Array.from(item.w);
    // موضع الحرف الناقص وخيارات الإجابة — ثابتة طوال اليوم
    const miss = strHash(item.w + todayKey()) % letters.length;
    const alphabet = lang === 'ar' ? AR_LETTERS : EN_LETTERS;
    const correct = letters[miss];
    const choices = [correct];
    let h = strHash(todayKey() + item.w + 'ch');
    while (choices.length < 4) {
      const ch = alphabet[h % alphabet.length];
      h = (h * 31 + 7) % 1000003;
      if (!choices.includes(ch)) choices.push(ch);
    }
    choices.sort((a, b) => strHash(a + item.w) - strHash(b + item.w)); // خلط ثابت
    return { word: item.w, emoji: item.e, letters, miss, correct, choices };
  },

  _wgLang: 'ar',

  openWordGame(lang) {
    this._wgLang = lang || this._wgLang || 'ar';
    const wg = this._wordGameState();
    const l = this._wgLang;
    const done = l === 'ar' ? wg.arDone : wg.enDone;
    const langName = l === 'ar' ? 'عربي' : 'English';

    let body;
    if (done >= WORDS_PER_DAY) {
      body = `<div style="text-align:center;padding:20px 0">
        <div style="font-size:3rem">🌟</div>
        <p style="font-weight:900">أتممت كلمات ${langName} اليوم!</p>
        <p class="muted">عد غدًا لكلمات جديدة</p>
      </div>`;
    } else {
      const q = this._dailyWord(l, done);
      const tiles = q.letters.map((ch, i) =>
        `<span class="wg-tile ${i === q.miss ? 'missing' : ''}">${i === q.miss ? '؟' : ch}</span>`).join('');
      const btns = q.choices.map(ch =>
        `<button class="wg-choice" onclick="App.wordGuess('${ch}')">${ch}</button>`).join('');
      body = `
        <div class="wg-progress">${done + 1} / ${WORDS_PER_DAY}</div>
        <div class="wg-big-emoji">${q.emoji}</div>
        <button class="btn-ghost small" style="margin-bottom:8px" onclick="App.sayWord()">🔊 اسمع الكلمة</button>
        <div class="wg-word" dir="${l === 'ar' ? 'rtl' : 'ltr'}">${tiles}</div>
        <div class="wg-choices">${btns}</div>
        <p id="wg-msg" class="muted" style="min-height:1.3em;margin-top:8px"></p>`;
    }

    this.openModal(`${this._gameBackBtn()}
      <h3 style="text-align:center">🔤 تحدي كلمات اليوم</h3>
      <div class="lib-chips" style="justify-content:center">
        <button class="lib-chip ${l === 'ar' ? 'active' : ''}" onclick="App.openWordGame('ar')">عربي (${wg.arDone}/${WORDS_PER_DAY})</button>
        <button class="lib-chip ${l === 'en' ? 'active' : ''}" onclick="App.openWordGame('en')">English (${wg.enDone}/${WORDS_PER_DAY})</button>
      </div>
      <div style="text-align:center">${body}</div>`);
  },

  sayWord() {
    const wg = this._wordGameState();
    const l = this._wgLang;
    const done = l === 'ar' ? wg.arDone : wg.enDone;
    if (done >= WORDS_PER_DAY) return;
    const q = this._dailyWord(l, done);
    speak(q.word, l === 'ar' ? 'ar-SA' : 'en-US');
  },

  wordGuess(ch) {
    const wg = this._wordGameState();
    const l = this._wgLang;
    const done = l === 'ar' ? wg.arDone : wg.enDone;
    if (done >= WORDS_PER_DAY) return;
    const q = this._dailyWord(l, done);
    const msg = document.getElementById('wg-msg');
    if (ch !== q.correct) {
      if (msg) msg.textContent = 'جرّب حرفًا آخر 💪';
      return;
    }
    // إجابة صحيحة: مكافأة فورية + نطق الكلمة كاملة
    const c = C();
    if (l === 'ar') wg.arDone++; else wg.enDone++;
    wg.totalSolved = (wg.totalSolved || 0) + 1;
    c.xp += WORD_XP;
    c.coins += WORD_COINS;
    c.lifetimeCoins += WORD_COINS;
    let bonus = 0;
    const langDone = (l === 'ar' ? wg.arDone : wg.enDone) >= WORDS_PER_DAY;
    if (langDone) { bonus = 5; c.coins += bonus; c.lifetimeCoins += bonus; }
    save();
    speak(q.word, l === 'ar' ? 'ar-SA' : 'en-US');
    this.refreshKidHeader();
    if (langDone) {
      this.closeModal();
      this.celebrate(`أتممت كلمات ${l === 'ar' ? 'العربية' : 'الإنجليزية'}! 🔤`,
        `الكلمة الأخيرة: <b>${esc(q.word)}</b> ${q.emoji}`,
        [`+${WORD_XP} ✨ XP`, `+${WORD_COINS + bonus} 🥕`], '🌟');
      this.renderKMap();
    } else {
      this.toast(`✅ ${q.word} — +${WORD_COINS} 🥕`);
      this.openWordGame(l);   // الكلمة التالية
    }
  },

  /* ═══════════ محفظة وقت الشاشة ═══════════
     المهام تكسب دقائق لعب، والطفل يشغل العداد عند الاستخدام */
  _screenTimer: null,

  openScreenTime() {
    const st = C().screenTime || { balance: 0, log: [] };
    this.openModal(`
      <h3 style="text-align:center">⏱️ وقت الشاشة</h3>
      <div style="text-align:center">
        <div class="screen-balance">${st.balance}<small> دقيقة</small></div>
        <p class="muted">كل مهمة تنجزها تضيف ${S.screenPerTask} دقائق لمحفظتك 🎮</p>
        ${st.balance > 0 ? `
          <div class="form-row" style="margin-top:12px">
            ${[15, 30, st.balance].filter((v, i, a) => v > 0 && v <= st.balance && a.indexOf(v) === i).map(m =>
              `<div><button class="btn-primary green" onclick="App.startScreenTime(${m})">▶️ ${m === st.balance && m > 30 ? 'كل الرصيد' : m + ' دقيقة'}</button></div>`).join('')}
          </div>
          <p class="muted" style="margin-top:8px">اضغط وابدأ اللعب — سننبهك بالصوت عند انتهاء الوقت</p>`
          : '<p style="font-weight:900;margin-top:10px">أنجز مهامًا لتكسب وقت لعب! 💪</p>'}
      </div>`);
  },

  startScreenTime(mins) {
    const st = C().screenTime;
    mins = Math.min(mins, st.balance);
    if (mins <= 0) return;
    st.balance -= mins;
    st.log.push({ date: todayKey(), mins, kind: 'use' });
    save();
    let remaining = mins * 60;
    this.openModal(`
      <h3 style="text-align:center">🎮 وقت اللعب يعمل</h3>
      <div style="text-align:center">
        <div class="screen-balance" id="st-count">${mins}:00</div>
        <p class="muted">استمتع! سنناديك عند الانتهاء 🔔</p>
        <button class="btn-ghost" style="margin-top:10px" onclick="App.stopScreenTime(${mins})">⏹️ إنهاء مبكر (يرجع الباقي)</button>
      </div>`);
    clearInterval(this._screenTimer);
    this._screenTimer = setInterval(() => {
      remaining--;
      const el = document.getElementById('st-count');
      if (el) el.textContent = Math.floor(remaining / 60) + ':' + String(remaining % 60).padStart(2, '0');
      this._screenRemaining = remaining;
      if (remaining <= 0) {
        clearInterval(this._screenTimer);
        this._screenTimer = null;
        this.closeModal();
        sayLine('screen_end', 'انتهى وقت اللعب! سلّم الجهاز يا بطل');
        this.celebrate('انتهى وقت اللعب ⏰', 'أحسنت الالتزام! أنجز مهام أكثر لوقت أكثر', [], '🤝');
      }
    }, 1000);
  },

  stopScreenTime(started) {
    clearInterval(this._screenTimer);
    this._screenTimer = null;
    // إرجاع الدقائق غير المستهلكة
    const backMins = Math.floor((this._screenRemaining || 0) / 60);
    if (backMins > 0) {
      C().screenTime.balance += backMins;
      C().screenTime.log.push({ date: todayKey(), mins: backMins, kind: 'refund' });
      save();
    }
    this.closeModal();
    this.toast(backMins > 0 ? `أُعيدت ${backMins} دقيقة لمحفظتك 👍` : 'انتهى وقت اللعب');
  },

  /* ═══════════ قائمة الأمنيات ═══════════ */
  wishForm() {
    this.openModal(`
      <h3>⭐ أمنية جديدة</h3>
      <p class="muted" style="margin-bottom:10px">اكتب شيئًا تتمناه — سيراه والدك وقد يحوله لهدف تجمع له الجزر!</p>
      <div class="form-grid">
        <div><label>أمنيتي</label><input id="f-wish" placeholder="مثال: يوم في المسبح 🏊" /></div>
        <button class="btn-primary" onclick="App.addWish()">أضفها لقائمتي ⭐</button>
      </div>`);
  },

  addWish() {
    const title = document.getElementById('f-wish').value.trim();
    if (!title) { this.toast('اكتب أمنيتك أولًا'); return; }
    C().wishes = C().wishes || [];
    if (C().wishes.length >= 10) { this.toast('قائمتك ممتلئة — حقق أمنية أولًا!'); return; }
    C().wishes.push({ id: uid(), title, status: 'wish' });
    save();
    this.closeModal();
    this.celebrate('أمنية جديدة! ⭐', esc(title) + '<br /><small>أرسلناها لوالدك — اجتهد وقد تتحقق!</small>', [], '🌠');
    this.renderKHero();
  },

  /* الوالد يحول الأمنية إلى هدف بسعر جزر */
  wishToGoal(childId, wishId) {
    const child = S.children.find(x => x.id === childId);
    const w = child && child.wishes.find(x => x.id === wishId);
    if (!w) return;
    const cost = parseInt(prompt(`حدد سعر "${w.title}" بالجزر 🥕 ليجمع له ${child.name}:`, '150'));
    if (!cost || cost < 5) return;
    const reward = { id: uid(), emoji: '⭐', title: w.title, cost, kind: 'budget', wishId: w.id };
    S.rewards.push(reward);
    w.status = 'goal';
    w.cost = cost;
    w.rewardId = reward.id;
    save();
    this.renderPRewards();
    this.toast(`صارت هدفًا في متجر ${child.name} — ${cost} 🥕 ⭐`);
  },

  dismissWish(childId, wishId) {
    const child = S.children.find(x => x.id === childId);
    if (!child) return;
    child.wishes = child.wishes.filter(x => x.id !== wishId);
    save();
    this.renderPRewards();
  },

  /* ═══════════ سوق العروض (جهة الوالد) ═══════════ */
  offersMarket() {
    const fam = S.family;
    if (!fam.city || !fam.district || !fam.school) {
      // البوابة: البيانات شرط الدخول
      this.openModal(`
        <h3>🛍️ سوق العروض</h3>
        <p class="muted" style="margin-bottom:12px">أدخل بياناتكم لتصلكم عروض وخصومات حيّكم من شركاء جَزَرة — البيانات تخصك أنت (الوالد) ولا تُعرض للأطفال</p>
        <div class="form-grid">
          <div><label>المدينة</label><input id="f-city" value="${esc(fam.city)}" placeholder="الرياض" /></div>
          <div><label>الحي</label><input id="f-district" value="${esc(fam.district)}" placeholder="النرجس" /></div>
          <div><label>مدرسة الأبناء</label><input id="f-school" value="${esc(fam.school)}" placeholder="مدارس ..." /></div>
          <button class="btn-primary purple" onclick="App.saveFamilyInfo()">افتح السوق 🗝️</button>
        </div>`);
      return;
    }
    const offers = (typeof Meta !== 'undefined' ? Meta.offers() : [])
      .filter(o => o.city === fam.city && (!o.district || o.district === fam.district));
    const added = new Set(S.vouchers.map(v => v.offerId).filter(Boolean));
    this.openModal(`
      <h3>🛍️ عروض ${esc(fam.city)}${fam.district ? ' — ' + esc(fam.district) : ''}</h3>
      <p class="muted" style="margin-bottom:10px">أضف ما يعجبك ليظهر قسيمة في متجر أبنائك — خصم الشريك يرتفع مع تقدمهم في رحلة العوالم!</p>
      <div class="lib-list">
        ${offers.map(o => `
          <div class="task-row">
            <span class="task-cat">${o.emoji || '🎟️'}</span>
            <div class="task-info">
              <div class="t-title">${esc(o.title)} — ${esc(o.partner)}</div>
              <div class="t-meta">${o.cost} 🥕${(o.ladder || []).map(l => ` · ${WORLDS[l.world] ? WORLDS[l.world].emoji : ''}${l.off}%`).join('')}</div>
            </div>
            ${added.has(o.id)
              ? '<span class="pill" style="background:#e2f5ea">✔</span>'
              : `<button class="icon-btn" style="background:#fff3e6;font-weight:900;color:var(--carrot-dark)" onclick="App.addOffer('${o.id}')">＋</button>`}
          </div>`).join('') || '<p class="muted">لا عروض في منطقتكم بعد — قريبًا مع انضمام الشركاء 🤝</p>'}
      </div>
      <button class="btn-ghost" style="width:100%;margin-top:10px" onclick="S.family={city:'',district:'',school:''};save();App.offersMarket()">✏️ تعديل بيانات المنطقة</button>`);
  },

  saveFamilyInfo() {
    const city = document.getElementById('f-city').value.trim();
    const district = document.getElementById('f-district').value.trim();
    const school = document.getElementById('f-school').value.trim();
    if (!city || !district || !school) { this.toast('أكمل الحقول الثلاثة لفتح السوق'); return; }
    S.family = { city, district, school };
    save();
    if (typeof Meta !== 'undefined') Meta.refresh(true).then(() => this.offersMarket());
    else this.offersMarket();
  },

  addOffer(offerId) {
    const o = (typeof Meta !== 'undefined' ? Meta.offers() : []).find(x => x.id === offerId);
    if (!o || S.vouchers.some(v => v.offerId === offerId)) return;
    S.vouchers.push({
      id: uid(), offerId: o.id, partner: o.partner, title: o.title,
      emoji: o.emoji || '🎟️', cost: o.cost, code: o.code, ladder: o.ladder || [], used: 0,
    });
    save();
    this.offersMarket();
    this.renderPRewards();
    this.toast(`أُضيف عرض ${o.partner} لمتجر الأبطال 🎟️`);
  },

  /* ═══════════ رحلة العوالم: الخريطة الكبرى ═══════════ */
  /* بوابة خريطة الرحلة: يفتح الوضع الذي يفضله الطفل — كوكب أو قائمة */
  openJourneyMap() {
    if ((C().mapMode || 'planet') === 'planet') this.openPlanet();
    else this.openJourneyList();
  },

  setMapMode(mode) {
    C().mapMode = mode;
    save();
    this.closeModal();
    this.closePlanet();
    this.openJourneyMap();
  },

  openJourneyList() {
    const j = C().journey;
    const worlds = WORLDS.map((w, wi) => {
      const start = wi * STAGES_PER_WORLD;
      const state = j.stage >= start + STAGES_PER_WORLD ? 'done' : (j.stage >= start ? 'current' : 'locked');
      const dots = Array.from({ length: STAGES_PER_WORLD }, (_, si) => {
        const g = start + si;
        const boss = si === STAGES_PER_WORLD - 1;
        if (g < j.stage) return `<span class="jdot done">${boss ? '👾' : '★'}</span>`;
        if (g === j.stage && state !== 'locked') return `<span class="jdot here">${faceHTML(heroBase(C()))}</span>`;
        return `<span class="jdot">${boss ? '👾' : '·'}</span>`;
      }).join('');
      return `
        <div class="jworld ${state}" style="--wc:${w.color}">
          <div class="jw-head">
            <span class="jw-emoji">${state === 'locked' ? '🔒' : w.emoji}</span>
            <b>${esc(w.name)}</b>
            ${state === 'done' ? '<span class="jw-done">✔ مكتمل</span>' : ''}
          </div>
          <div class="jdots">${dots}</div>
        </div>`;
    }).join('');
    this.openModal(`
      <h3 style="text-align:center">🗺️ رحلة العوالم</h3>
      <p class="muted" style="text-align:center;margin-bottom:10px">كل يوم مجتهد = مرحلة · بوابة الزعيم 👾 تحتاج جهدًا مضاعفًا</p>
      <div class="jworlds">${worlds}</div>
      <button class="btn-primary" style="margin-top:12px;background:#2a2565;box-shadow:0 4px 0 #1a1640" onclick="App.setMapMode('planet')">🪐 جرّب وضع الكوكب التفاعلي</button>
      <div class="form-row" style="margin-top:10px">
        <div><button class="btn-primary" onclick="App.closeModal();App.openStoryBook()">📖 حكاية جزّور</button></div>
        <div><button class="btn-primary purple" onclick="App.shareJourney()">📤 شارك موقعي</button></div>
      </div>`);
  },

  shareJourney() {
    const j = C().journey;
    const w = worldOf(j.stage);
    const text = `🥕 أنا ${C().name} في تطبيق جَزَرة!\n${w.emoji} وصلت ${w.name} — المرحلة ${Math.min(j.stage + 1, TOTAL_STAGES)} من ${TOTAL_STAGES}\n⭐ المستوى ${levelOf(C().xp)} · 🔥 سلسلة ${C().streak} يوم\nأنت وين وصلت؟ 😎`;
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  },

  /* تلوين عالم الطفل بألوان عالمه الحالي */
  _applyWorldTheme() {
    const w = worldOf(C().journey ? C().journey.stage : 0);
    const scr = document.getElementById('screen-kid');
    scr.style.background = `linear-gradient(180deg, ${w.grad[0]} 0%, ${w.grad[1]} 30%, #fff6e5 100%)`;
    const head = document.querySelector('.kid-header');
    if (head) head.style.background = w.grad[0] + 'd9';
  },

  /* ═══════════ كوكب جَزَرة: خريطة الرحلة التفاعلية ═══════════
     كرة تُدار بالإصبع في كل الاتجاهات (وهم كوكب: نافذة دائرية فوق
     خريطة واسعة + قصور ذاتي) — ضغطة على عالم تقرّب الكاميرا لمراحله */
  PV_SIZE: 920,    // أبعاد خريطة الكوكب الداخلية
  PLANET_POS: [    // مواقع الجزر الثمانية على الخريطة
    { x: 200, y: 195 }, { x: 460, y: 120 }, { x: 715, y: 210 }, { x: 770, y: 470 },
    { x: 560, y: 665 }, { x: 290, y: 720 }, { x: 135, y: 480 }, { x: 450, y: 400 },
  ],
  _pv: null,

  openPlanet() {
    if (document.getElementById('planet-view')) return;
    const j = C().journey || { stage: 0 };
    const wi = worldIndexOf(Math.min(j.stage, TOTAL_STAGES - 1));

    const div = document.createElement('div');
    div.id = 'planet-view';
    div.innerHTML = `
      <div class="pv-top">
        <button class="pv-btn" onclick="App.closePlanet()">✕</button>
        <b>🪐 كوكب جَزَرة</b>
        <span>
          <button class="pv-btn" title="حكاية جزّور" onclick="App.closePlanet();App.openStoryBook()">📖</button>
          <button class="pv-btn" title="الوضع الكلاسيكي" onclick="App.setMapMode('list')">📋</button>
        </span>
      </div>
      <div class="pv-stage">
        <div class="pv-planet" id="pv-planet" onpointerdown="App.pvDown(event)">
          <div class="pv-map" id="pv-map">${this._pvMapHTML(j)}</div>
          <div class="pv-shine"></div>
        </div>
      </div>
      <p class="pv-hint">اسحب الكوكب بإصبعك في كل الاتجاهات 🌍 واضغط عالمًا لتدخله</p>
      <div class="pv-world" id="pv-world"></div>`;
    document.body.appendChild(div);

    // مركز البداية: عالم الطفل الحالي في منتصف النافذة
    const vp = document.getElementById('pv-planet').clientWidth;
    const p = this.PLANET_POS[wi];
    this._pv = { x: this._pvClamp(vp / 2 - p.x, vp), y: this._pvClamp(vp / 2 - p.y, vp), vx: 0, vy: 0, vp, drag: null, raf: null };
    this._pvApply();
  },

  closePlanet() {
    const div = document.getElementById('planet-view');
    if (!div) return;
    if (this._pv && this._pv.raf) cancelAnimationFrame(this._pv.raf);
    this._pv = null;
    div.remove();
  },

  _pvClamp(v, vp) { return Math.min(0, Math.max(vp - this.PV_SIZE, v)); },
  _pvApply() {
    const m = document.getElementById('pv-map');
    if (m && this._pv) m.style.transform = `translate(${this._pv.x}px, ${this._pv.y}px)`;
  },

  _pvMapHTML(j) {
    const wi = worldIndexOf(Math.min(j.stage, TOTAL_STAGES - 1));
    // خط الرحلة المنقط يربط العوالم بترتيبها
    const pts = this.PLANET_POS.map(p => `${p.x},${p.y}`).join(' ');
    const deco = [ // بقع قارية تعطي الكوكب ملمسًا
      'left:60px;top:330px;width:220px;height:160px', 'left:510px;top:50px;width:240px;height:150px',
      'left:600px;top:540px;width:220px;height:180px', 'left:240px;top:520px;width:170px;height:130px',
    ].map(s => `<i class="pv-land" style="${s}"></i>`).join('');
    const islands = WORLDS.map((w, i) => {
      const start = i * STAGES_PER_WORLD;
      const state = j.stage >= start + STAGES_PER_WORLD ? 'done' : (i === wi ? 'current' : (i < wi ? 'done' : 'locked'));
      const stars = Math.max(0, Math.min(STAGES_PER_WORLD, j.stage - start));
      const p = this.PLANET_POS[i];
      return `
        <button class="pv-isl ${state}" id="pv-isl-${i}" style="left:${p.x}px;top:${p.y}px;--wc:${w.color}" onclick="App.pvEnterWorld(${i})">
          <span class="pv-blob" style="background:linear-gradient(160deg,${w.grad[0]},${w.grad[1]})">${state === 'locked' ? '☁️' : w.emoji}</span>
          <b>${esc(w.name)}</b>
          <small>${state === 'done' ? '⭐ مكتمل' : state === 'current' ? `${stars}/${STAGES_PER_WORLD} ⭐` : '🔒'}</small>
          ${state === 'current' ? `<img class="pv-jz" src="avatars/jazzour/hero.webp" alt="" />` : ''}
        </button>`;
    }).join('');
    return `
      ${deco}
      <svg class="pv-route" width="${this.PV_SIZE}" height="${this.PV_SIZE}" viewBox="0 0 ${this.PV_SIZE} ${this.PV_SIZE}">
        <polyline points="${pts}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="5" stroke-dasharray="2 16" stroke-linecap="round"/>
      </svg>
      ${islands}`;
  },

  /* سحب الكوكب بقصور ذاتي */
  pvDown(e) {
    if (!this._pv) return;
    e.preventDefault();
    if (this._pv.raf) { cancelAnimationFrame(this._pv.raf); this._pv.raf = null; }
    this._pv.drag = { x: e.clientX, y: e.clientY, moved: false };
    this._pv.vx = 0; this._pv.vy = 0;
    if (!this._pvBound) {
      this._pvBound = true;
      window.addEventListener('pointermove', ev => this.pvMove(ev), { passive: false });
      window.addEventListener('pointerup', () => this.pvUp());
      window.addEventListener('pointercancel', () => this.pvUp());
    }
  },

  pvMove(e) {
    const s = this._pv;
    if (!s || !s.drag) return;
    const dx = e.clientX - s.drag.x, dy = e.clientY - s.drag.y;
    if (!s.drag.moved && Math.hypot(dx, dy) > 6) s.drag.moved = true;
    if (!s.drag.moved) return;
    e.preventDefault();
    s.x = this._pvClamp(s.x + dx, s.vp);
    s.y = this._pvClamp(s.y + dy, s.vp);
    s.vx = dx; s.vy = dy;
    s.drag.x = e.clientX; s.drag.y = e.clientY;
    this._pvApply();
  },

  pvUp() {
    const s = this._pv;
    if (!s || !s.drag) return;
    const wasDrag = s.drag.moved;
    s.drag = null;
    if (!wasDrag) return;
    // امنع نقرة الجزيرة التي تلي نهاية السحبة مباشرة
    s.suppressClick = true;
    setTimeout(() => { if (this._pv) this._pv.suppressClick = false; }, 250);
    // قصور ذاتي: الكوكب يواصل الدوران قليلًا ثم يهدأ
    const glide = () => {
      if (!this._pv) return;
      s.vx *= 0.93; s.vy *= 0.93;
      if (Math.abs(s.vx) < 0.4 && Math.abs(s.vy) < 0.4) { s.raf = null; return; }
      s.x = this._pvClamp(s.x + s.vx, s.vp);
      s.y = this._pvClamp(s.y + s.vy, s.vp);
      this._pvApply();
      s.raf = requestAnimationFrame(glide);
    };
    s.raf = requestAnimationFrame(glide);
  },

  /* دخول عالم: زوم من الكوكب إلى مسار المراحل العشر */
  PV_PATH: [
    { x: 74, y: 4 }, { x: 34, y: 12 }, { x: 64, y: 21 }, { x: 26, y: 30 }, { x: 58, y: 39 },
    { x: 24, y: 49 }, { x: 62, y: 58 }, { x: 30, y: 67 }, { x: 58, y: 76 }, { x: 40, y: 87 },
  ],

  pvEnterWorld(i) {
    const s = this._pv;
    if (s && s.suppressClick) return;   // كانت سحبة لا ضغطة
    const j = C().journey || { stage: 0 };
    const wi = worldIndexOf(Math.min(j.stage, TOTAL_STAGES - 1));
    if (i > wi) {
      const el = document.getElementById('pv-isl-' + i);
      if (el) { el.classList.remove('pv-shake'); void el.offsetWidth; el.classList.add('pv-shake'); }
      this.toast('هذا العالم خلف الغيوم… أكمل العوالم قبله لفتحه 🔒');
      return;
    }
    const w = WORLDS[i];
    const start = i * STAGES_PER_WORLD;
    const jNeed = stageNeedXP(j.stage);
    const isCur = i === wi;
    const nodes = this.PV_PATH.map((p, si) => {
      const g = start + si;
      const boss = si === STAGES_PER_WORLD - 1;
      let cls = 'pw-node', inner = String(si + 1);
      if (g < j.stage) { cls += ' done'; inner = boss ? '👾' : '⭐'; }
      else if (g === j.stage) { cls += ' here'; inner = `<img src="avatars/jazzour/hero.webp" alt="جزّور" />`; }
      else if (boss) { cls += ' boss'; inner = '👾'; }
      return `<span class="${cls}" style="left:${p.x}%;top:${p.y}%">${inner}</span>`;
    }).join('');
    const line = this.PV_PATH.map(p => `${p.x + 5},${p.y + 3.5}`).join(' ');
    document.getElementById('pv-world').innerHTML = `
      <div class="pw-inner" style="background:linear-gradient(180deg,${w.grad[0]},${w.grad[1]})">
        <div class="pw-head">
          <button class="pv-btn dark" onclick="App.pvBack()">← الكوكب</button>
          <b style="color:${w.color}">${w.emoji} ${esc(w.name)}</b>
          <span class="pw-prog">${Math.max(0, Math.min(STAGES_PER_WORLD, j.stage - start))}/${STAGES_PER_WORLD} ⭐</span>
        </div>
        <div class="pw-path">
          <svg viewBox="0 0 110 95" preserveAspectRatio="none"><polyline points="${line}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" stroke-dasharray="0.5 3" stroke-linecap="round"/></svg>
          ${nodes}
        </div>
        <p class="pw-foot">${isCur
          ? (j.advanced >= 1 ? 'أنجزت مرحلة اليوم ✅ — عد غدًا لتكمل الطريق' : `اجمع ${jNeed} XP اليوم لتقطع المرحلة (${j.xpToday}/${jNeed})`)
          : 'أتممت هذا العالم كاملًا — ما شاء الله! ⭐'}</p>
      </div>`;
    document.getElementById('planet-view').classList.add('pv-zoomed');
  },

  pvBack() {
    const pv = document.getElementById('planet-view');
    if (pv) pv.classList.remove('pv-zoomed');
  },

  /* ═══════════ جزّور: رفيق الرحلة الحي ═══════════ */
  _storyToShow: null,

  /* وضعيات جزّور الرسمية (12 صورة من شيت الشخصية المعتمد) */
  JZ_POSES: ['hero', 'happy', 'thinking', 'wave', 'encourage', 'surprised',
             'excited', 'jump', 'celebrate', 'proud', 'sleep', 'super'],
  /* المزاج اليومي ← الوضعية التي تمثله */
  MOOD_POSE: { sleepy: 'sleep', curious: 'thinking', happy: 'happy', excited: 'excited' },

  jzSrc(pose) { return `avatars/jazzour/${this.JZ_POSES.includes(pose) ? pose : 'hero'}.webp`; },

  /* تبديل وضعية مؤقت كردّ فعل — لغة الحركة الأساسية مع الصور الثابتة */
  jzReact(pose, ms = 1100) {
    const img = document.querySelector('#jz-char img');
    if (!img) return;
    clearTimeout(this._jzReactT);
    const back = img.dataset.base || img.getAttribute('src');
    img.dataset.base = back;
    img.setAttribute('src', this.jzSrc(pose));
    img.parentElement.classList.add('jz-react');
    this._jzReactT = setTimeout(() => {
      img.setAttribute('src', img.dataset.base || back);
      img.parentElement.classList.remove('jz-react');
    }, ms);
  },

  /* مزاج جزّور يعكس يوم الطفل — الرعاية تقلب المعادلة: هو من ينتظر الطفل */
  jazzourMood() {
    const today = todayKey();
    const done = (C().completions[today] || []).length;
    const j = C().journey || {};
    const total = C().tasks.filter(t => !isWeekend() || t.cat !== 'study' || t.weekendOk).length;
    if ((total > 0 && done >= total) || j.advanced >= 1) return 'excited';
    if (done > 0) return 'happy';
    return new Date().getHours() < 12 ? 'sleepy' : 'curious';
  },

  _jazzourBubble(mood) {
    const hearts = (C().feed || []).filter(f => f.heart && !f.seen);
    if (hearts.length) return '❤️ والدك شاف إنجازك وأعجبه! اضغط عليّ';
    const done = (C().completions[todayKey()] || []).length;
    return {
      sleepy: 'جزّور نائم… أنجز أول مهمة ليصحو! 💤',
      curious: 'جزّور فضولي: ما أول إنجاز اليوم؟ 🤔',
      happy: `رائع! ${done} ${done === 1 ? 'إنجاز' : 'إنجازات'} اليوم — جزّور سعيد!`,
      excited: 'يوم بطولي! جزّور يرقص فرحًا ⭐',
    }[mood];
  },

  /* ── جزّور يُحمل بالإصبع ويتحرك معه في كل الاتجاهات ── */
  _jz: null,
  _jzBound: false,

  jzDown(e) {
    const el = document.getElementById('jz-char');
    if (!el) return;
    e.preventDefault();
    this._jz = { x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, moved: false, el };
    if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (_) {} }
    el.classList.remove('jz-return', 'jz-bounce');
    if (!this._jzBound) {
      this._jzBound = true;
      window.addEventListener('pointermove', ev => this.jzMove(ev), { passive: false });
      window.addEventListener('pointerup', ev => this.jzUp(ev));
      window.addEventListener('pointercancel', ev => this.jzUp(ev));
    }
  },

  jzMove(e) {
    const s = this._jz;
    if (!s) return;
    s.dx = e.clientX - s.x0; s.dy = e.clientY - s.y0;
    if (!s.moved && Math.hypot(s.dx, s.dy) > 8) { s.moved = true; s.el.classList.add('jz-drag'); }
    if (s.moved) {
      e.preventDefault();
      const tilt = Math.max(-16, Math.min(16, s.dx * 0.08));
      s.el.style.transform = `translate(${s.dx}px, ${s.dy}px) rotate(${tilt}deg) scale(1.06)`;
    }
  },

  jzUp() {
    const s = this._jz;
    if (!s) return;
    this._jz = null;
    if (!s.moved) { this.pokeJazzour(); return; }
    // عودة زنبركية لمكانه — واللعبة تُعاد بلا حدود
    s.el.classList.remove('jz-drag');
    s.el.classList.add('jz-return');
    s.el.style.transform = '';
    setTimeout(() => s.el.classList.remove('jz-return'), 700);
    const lines = [['drag1', 'هيييه! رحلة ممتعة!'], ['drag2', 'مرة ثانية! مرة ثانية!'], ['drag3', 'أنا أطير يا بطل!']];
    const pick = lines[Math.floor(Math.random() * lines.length)];
    this.jzReact('jump', 900);
    sayLine(pick[0], pick[1]);
  },

  pokeJazzour() {
    const el = document.getElementById('jz-char');
    if (el) { el.classList.remove('jz-bounce'); void el.offsetWidth; el.classList.add('jz-bounce'); }
    // قلوب الوالد غير المشاهدة — لحظة الانتماء
    const hearts = (C().feed || []).filter(f => f.heart && !f.seen);
    if (hearts.length) {
      hearts.forEach(f => { f.seen = true; });
      save();
      this.celebrate('رسالة حب من والدك! ❤️',
        hearts.slice(0, 4).map(f => `${f.e} ${esc(f.title)}`).join('<br />'),
        ['❤️ شاف إنجازك وأعجبه'], '🥰');
      this.jzReact('proud', 1800);
      sayLine('heart', 'والدك شاف إنجازك وأعجبه!');
      this.renderKMap();
      return;
    }
    const lines = {
      sleepy: [['wakeup', 'أنا نعسان… أيقظني بإنجاز!'], ['poke3', 'هيا نكمل المغامرة!']],
      curious: [['poke4', 'وش خططنا اليوم؟'], ['poke3', 'هيا نكمل المغامرة!']],
      happy: [['poke1', 'أنت رائع! كمّل!'], ['poke2', 'أحبك يا بطل!'], ['poke3', 'هيا نكمل المغامرة!']],
      excited: [['poke5', 'أنا فخور فيك!'], ['poke1', 'أنت رائع! كمّل!'], ['poke2', 'أحبك يا بطل!']],
    }[this.jazzourMood()];
    const pick = lines[Math.floor(Math.random() * lines.length)];
    const react = { sleepy: 'surprised', curious: 'thinking', happy: 'wave', excited: 'celebrate' }[this.jazzourMood()];
    this.jzReact(react);
    sayLine(pick[0], pick[1]);
  },

  /* الزر الواحد: يأخذ الطفل لخطوته التالية بالتسلسل — لا حيرة ولا زحام */
  nextAdventureStep() {
    const today = todayKey();
    if (C().lastDailyChest !== today) return this.showDailyChest();
    if (C().mysteryBox) return this.openMystery();
    const doneIds = new Set(C().completions[today] || []);
    const pendingIds = new Set(C().pendingProofs.filter(p => p.date === today).map(p => p.taskId));
    const next = C().tasks.filter(t => !isWeekend() || t.cat !== 'study' || t.weekendOk)
      .filter(t => !t.mine || t.id === 'mine-' + today)
      .find(t => !doneIds.has(t.id) && !pendingIds.has(t.id));
    if (next) {
      const node = document.getElementById('node-' + next.id);
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.classList.add('node-glow');
        setTimeout(() => node.classList.remove('node-glow'), 2500);
      }
      speak('مهمتك التالية: ' + next.title, 'ar-SA');
      return;
    }
    const qr = this._quranState();
    if (!qr.claimed) return this.openQuranKids();
    const wg = this._wordGameState(), mg = this._mathGameState(), bg = this._blurGameState(), sg = this._shadowGameState();
    if (wg.arDone + wg.enDone + mg.done + bg.done + sg.done < WORDS_PER_DAY * 5) return this.openGamesHub();
    this.celebrate('أنهيت كل شيء اليوم! 🏆', 'جزّور يرقص فرحًا — عد غدًا لمرحلة جديدة من الرحلة والحكاية', [], '🥕');
  },

  /* ── حكاية جزّور المسلسلة ── */
  openStory(i) {
    if (!STORY[i]) return;
    const w = worldOf(i);
    const last = i >= STORY.length - 1;
    this.openModal(`
      <div class="story-book" style="--wc:${w.color}">
        <div class="story-head">
          <img class="story-jz" src="avatars/jazzour/${last ? 'super' : 'hero'}.webp" alt="جزّور" />
          <div>
            <small>${w.emoji} حكاية جزّور — ${esc(w.name)}</small>
            <h3>الفصل ${i + 1} من ${STORY.length}</h3>
          </div>
        </div>
        <p class="story-text">${esc(STORY[i])}</p>
        <div class="form-row">
          <div><button class="btn-primary" data-say="${esc(STORY[i])}" onclick="App.sayText(this)">🔊 اسمع الحكاية</button></div>
          <div><button class="btn-primary green" onclick="App.closeModal()">${last ? 'النهاية! 👑' : 'أكمل غدًا 🌙'}</button></div>
        </div>
        ${!last ? '<p class="muted" style="text-align:center;margin-top:8px">أنجز مرحلة الغد لتعرف البقية…</p>' : ''}
      </div>`);
  },

  openStoryBook() {
    const unlocked = Math.min((C().journey && C().journey.stage) || 0, STORY.length);
    if (!unlocked) {
      this.openModal(`
        <div style="text-align:center">
          <img src="avatars/jazzour/sleep.webp" style="width:120px" alt="جزّور" />
          <h3>حكاية جزّور 📖</h3>
          <p class="muted">أنجز أول مرحلة في رحلة العوالم ليبدأ جزّور حكايته معك!</p>
        </div>`);
      return;
    }
    const rows = Array.from({ length: unlocked }, (_, i) => {
      const w = worldOf(i);
      return `<button class="video-row" onclick="App.openStory(${i})">
        <span>${w.emoji}</span><span style="flex:1">الفصل ${i + 1}</span><small style="color:#8a86a8">${esc(w.name)}</small>
      </button>`;
    }).reverse().join('');
    this.openModal(`
      <h3 style="text-align:center">📖 حكاية جزّور</h3>
      <p class="muted" style="text-align:center;margin-bottom:10px">فصل جديد مع كل مرحلة تقطعها — ${unlocked} من ${STORY.length}</p>
      ${rows}`);
  },

  /* ── مكتبتي: فيديوهات واختبارات ورموز المعلم في مكان واحد ── */
  openLibrary() {
    const qHtml = S.quizzes.length ? `<h3 style="margin-top:10px">📝 اختبارات معلمي</h3>` + S.quizzes.map(q => {
      const score = C().quizzesDone[q.id];
      return `<button class="video-row" onclick="App.closeModal();App.playQuiz('${q.id}')">
        <span>${score !== undefined ? '✅' : '📝'}</span>
        <span style="flex:1">${esc(q.title)} <small style="color:#8a86a8">— 🏫 ${esc(q.teacher)}</small></span>
        ${score !== undefined ? `<small style="font-weight:900;color:var(--green-dark)">${score}/${q.questions.length}</small>` : ''}
      </button>`;
    }).join('') : '';
    const vHtml = S.videos.length ? `<h3 style="margin-top:10px">🎬 فيديوهاتي التعليمية</h3>` + S.videos.map(v => `
      <button class="video-row" onclick="App.closeModal();App.watchVideo('${v.id}')">
        <span>▶️</span><span>${esc(v.title)}</span>
      </button>`).join('') : '';
    this.openModal(`
      <h3 style="text-align:center">🎒 مكتبتي</h3>
      ${qHtml}${vHtml}
      ${!qHtml && !vHtml ? '<p class="muted" style="text-align:center">لا يوجد محتوى بعد — اطلب من والدك أو معلمك إضافة فيديو أو اختبار</p>' : ''}
      <button class="btn-ghost" style="width:100%;margin-top:12px" onclick="App.closeModal();App.importCodeForm()">🏫 عندي رمز من معلمي</button>`);
  },

  /* ── مهمة أختارها أنا: استقلالية يومية بجرعة آمنة ── */
  openMyPick() {
    if (C().myPickDate === todayKey()) return;
    this.openModal(`
      <h3 style="text-align:center">🙋 مهمة أختارها أنا</h3>
      <p class="muted" style="text-align:center;margin-bottom:10px">اختر مهمة واحدة تضيفها لخريطة يومك — أنت القائد!</p>
      <div class="pick-grid">
        ${KID_PICKS.map((p, i) => `
          <button class="pick-tile" onclick="App.pickMyTask(${i})">
            <span class="pk-emoji">${p.emoji}</span><span>${esc(p.title)}</span>
          </button>`).join('')}
      </div>`);
  },

  pickMyTask(i) {
    const p = KID_PICKS[i];
    if (!p || C().myPickDate === todayKey()) return;
    C().tasks = C().tasks.filter(t => !t.mine);   // إزالة اختيارات الأيام السابقة
    C().tasks.push({ id: 'mine-' + todayKey(), title: p.title, cat: p.cat, xp: 10, coins: 4, proof: 'self', mine: true });
    C().myPickDate = todayKey();
    save();
    this.closeModal();
    this.renderKMap();
    sayLine('mypick', 'اختيار موفق! أنت القائد اليوم');
    this.toast(`أضفت مهمتك: ${p.emoji} ${p.title}`);
  },

  /* ── قلب الوالد على إنجاز في شريط اليوم ── */
  heartFeed(id) {
    const f = (C().feed || []).find(x => x.id === id);
    if (!f || f.heart) return;
    f.heart = true;
    f.seen = false;
    save();
    this.renderPTasks();
    this.toast(`وصل قلبك إلى ${C().name} ❤️`);
  },

  /* ═══════════ رحلة البراعم: قرآن الأطفال الموجه ═══════════
     مسار حفظ الأطفال: الفاتحة ثم قصار السور صعودًا (جزء عم كاملًا)
     آية واحدة كبيرة + تلاوة صوتية + التالي/السابق — بلا قوائم ولا تمرير */
  KIDS_QURAN_ORDER: [1, 114, 113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78],
  _quranAudio: null,
  _ayahOffsets: null,

  _quranPathState() {
    const c = C();
    if (!c.quranPath) { c.quranPath = { pos: 0, ayah: 0, done: {} }; save(); }
    return c.quranPath;
  },

  /* الرقم العالمي للآية (1..6236) — لملفات التلاوة الصوتية */
  _globalAyah(surahIdx, ayahIdx) {
    if (!this._ayahOffsets) {
      this._ayahOffsets = [];
      let t = 0;
      for (const s of window.QURAN_DATA) { this._ayahOffsets.push(t); t += s.v.length; }
    }
    return this._ayahOffsets[surahIdx] + ayahIdx + 1;
  },

  playAyah(surahIdx, ayahIdx) {
    this.stopAyah();
    const n = this._globalAyah(surahIdx, ayahIdx);
    this._quranAudio = new Audio(`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${n}.mp3`);
    const btn = document.getElementById('ayah-play');
    if (btn) btn.textContent = '⏸️';
    this._quranAudio.onended = () => { if (btn) btn.textContent = '🔊'; };
    this._quranAudio.onerror = () => { if (btn) btn.textContent = '🔊'; this.toast('التلاوة تحتاج اتصالًا بالإنترنت 📶'); };
    this._quranAudio.play().catch(() => this.toast('التلاوة تحتاج اتصالًا بالإنترنت 📶'));
  },

  stopAyah() {
    if (this._quranAudio) { try { this._quranAudio.pause(); } catch (e) {} this._quranAudio = null; }
  },

  toggleAyahAudio() {
    const qp = this._quranPathState();
    if (this._quranAudio && !this._quranAudio.paused) { this.stopAyah(); const b = document.getElementById('ayah-play'); if (b) b.textContent = '🔊'; return; }
    this.playAyah(this.KIDS_QURAN_ORDER[qp.pos] - 1, qp.ayah);
  },

  async openQuranKids() {
    this.openModal(`<div style="text-align:center;padding:30px 0"><div style="font-size:3rem">🌱</div><p class="muted">جارٍ فتح رحلة البراعم…</p></div>`);
    try { await this._loadQuran(); }
    catch (e) { this.openModal('<p class="muted" style="text-align:center;padding:20px">تعذر تحميل المصحف</p>'); return; }
    this._quranMode = 'kids';
    this.renderQuranKids();
    this._quranTickStart();
  },

  renderQuranKids() {
    const qp = this._quranPathState();
    const order = this.KIDS_QURAN_ORDER;
    if (qp.pos >= order.length) {
      this.openModal(`
        <div style="text-align:center;padding:16px 0">
          <div style="font-size:3.5rem">🏆</div>
          <h3>أتممت رحلة البراعم كاملة!</h3>
          <p class="muted" style="margin:8px 0 14px">الفاتحة وجزء عم كله — ما شاء الله! انتقل الآن للمصحف الكامل</p>
          <button class="btn-primary green" onclick="App.openQuranFull(66)">أكمل من سورة الملك 📖</button>
        </div>`);
      return;
    }
    const surahIdx = order[qp.pos] - 1;
    const s = window.QURAN_DATA[surahIdx];
    if (qp.ayah >= s.v.length) qp.ayah = s.v.length - 1;
    const ayah = s.v[qp.ayah];
    const qr = this._quranState();
    const target = (C().quranDaily || 5) * 60;
    const wirdDone = qr.seconds >= target && !qr.claimed;

    this.openModal(`
      <div class="kq-head">
        <span class="kq-station">🌱 محطة ${qp.pos + 1} من ${order.length}</span>
        <span class="quran-timer" id="quran-timer">${qr.claimed ? '🌟' : '⏱️ ' + Math.floor(qr.seconds / 60) + ':' + String(qr.seconds % 60).padStart(2, '0')}</span>
      </div>
      <div class="kq-surah">سورة ${esc(s.n)}</div>
      ${wirdDone ? `<button class="btn-primary green" style="margin-bottom:8px" onclick="App.claimQuran()">أتممت وردي — نِل مكافأتك 🌟</button>` : ''}
      <div class="kq-ayah-card">
        <div class="kq-ayah">${ayah}</div>
        <div class="kq-num">آية ${qp.ayah + 1} من ${s.v.length}</div>
      </div>
      <div class="kq-controls">
        <button class="kq-btn" ${qp.ayah === 0 && qp.pos === 0 ? 'disabled' : ''} onclick="App.kidsQuranPrev()">→ السابقة</button>
        <button class="kq-btn play" id="ayah-play" onclick="App.toggleAyahAudio()">🔊</button>
        <button class="kq-btn next" onclick="App.kidsQuranNext()">${qp.ayah === s.v.length - 1 ? 'أتمم السورة ✅' : 'التالية ←'}</button>
      </div>
      <div class="kq-dots">${s.v.map((_, i) => `<i class="${i < qp.ayah ? 'done' : i === qp.ayah ? 'here' : ''}"></i>`).join('')}</div>
      <button class="btn-ghost small" style="width:100%;margin-top:10px" onclick="App.openQuranFull(${surahIdx})">📖 المصحف الكامل</button>`);
    // تلاوة تلقائية للآية الحالية
    this.playAyah(surahIdx, qp.ayah);
  },

  kidsQuranNext() {
    const qp = this._quranPathState();
    const surahIdx = this.KIDS_QURAN_ORDER[qp.pos] - 1;
    const s = window.QURAN_DATA[surahIdx];
    if (qp.ayah < s.v.length - 1) {
      qp.ayah++;
      save();
      this.renderQuranKids();
    } else {
      // ختم السورة!
      this.stopAyah();
      qp.done[surahIdx + 1] = true;
      qp.pos++;
      qp.ayah = 0;
      const c = C();
      c.xp += 15;
      c.coins += 5;
      c.lifetimeCoins += 5;
      feedPush(c, '📖', `ختم سورة ${s.n} كاملة`);
      save();
      this.closeModal();
      this.refreshKidHeader();
      const next = qp.pos < this.KIDS_QURAN_ORDER.length ? window.QURAN_DATA[this.KIDS_QURAN_ORDER[qp.pos] - 1].n : null;
      this.celebrate(`ختمت سورة ${esc(s.n)}! 🌟`,
        next ? `محطتك التالية: <b>سورة ${esc(next)}</b> 🌱` : 'أتممت الرحلة كاملة!',
        ['+15 ✨ XP', '+5 🥕'], '🕌');
      speak(`أحسنت! ختمت سورة ${s.n}`, 'ar-SA');
    }
  },

  kidsQuranPrev() {
    const qp = this._quranPathState();
    if (qp.ayah > 0) { qp.ayah--; }
    else if (qp.pos > 0) {
      qp.pos--;
      qp.ayah = window.QURAN_DATA[this.KIDS_QURAN_ORDER[qp.pos] - 1].v.length - 1;
    }
    save();
    this.renderQuranKids();
  },

  /* ═══════════ ركن القرآن الكريم ═══════════
     القراءة داخل التطبيق فقط: عداد الوقت يعمل ما دام القارئ مفتوحًا */
  _quranTimer: null,
  _quranSurah: 0,

  _quranState() {
    const c = C();
    if (!c.quran) c.quran = { date: null, seconds: 0, claimed: false, streak: 0, best: 0, lastDay: null, totalSeconds: 0 };
    const today = todayKey();
    if (c.quran.date !== today) {
      c.quran.date = today;
      c.quran.seconds = 0;
      c.quran.claimed = false;
      // كسر سلسلة القرآن عند الانقطاع يومًا كاملًا
      if (c.quran.lastDay && c.quran.lastDay !== dayKeyOffset(-1) && c.quran.lastDay !== today) c.quran.streak = 0;
      save();
    }
    return c.quran;
  },

  /* تحميل نص المصحف عند أول فتح فقط (ملف quran.js — يعمل من الملف والويب والتطبيق) */
  _loadQuran() {
    if (window.QURAN_DATA) return Promise.resolve();
    if (this._quranLoading) return this._quranLoading;
    this._quranLoading = new Promise((resolve, reject) => {
      const sc = document.createElement('script');
      sc.src = 'quran.js';
      sc.onload = () => resolve();
      sc.onerror = () => reject(new Error('تعذر تحميل المصحف'));
      document.head.appendChild(sc);
    });
    return this._quranLoading;
  },

  async openQuranFull(surahIdx) {
    this.openModal(`<div style="text-align:center;padding:30px 0"><div style="font-size:3rem">📖</div><p class="muted">جارٍ فتح المصحف…</p></div>`);
    try { await this._loadQuran(); }
    catch (e) { this.openModal('<p class="muted" style="text-align:center;padding:20px">تعذر تحميل المصحف — تأكد من وجود ملف quran.js</p>'); return; }
    if (surahIdx !== undefined) this._quranSurah = surahIdx;
    this._quranMode = 'full';
    this.renderQuranReader();
    this._quranTickStart();
  },

  renderQuranReader() {
    const qr = this._quranState();
    const target = (C().quranDaily || 5) * 60;
    const data = window.QURAN_DATA;
    const i = this._quranSurah;
    const s = data[i];
    const options = data.map((x, j) => `<option value="${j}" ${j === i ? 'selected' : ''}>${j + 1}. ${x.n}</option>`).join('');
    const basmala = i !== 0 && i !== 8 ? '<div class="basmala">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</div>' : '';
    const verses = s.v.map((v, k) => `<span class="ayah">${v} <span class="ayah-num">﴿${k + 1}﴾</span></span>`).join(' ');
    const done = qr.seconds >= target;
    this.openModal(`
      <div class="quran-head">
        <select class="surah-select" onchange="App.openQuranFull(parseInt(this.value))">${options}</select>
        <div class="quran-timer" id="quran-timer">${done && !qr.claimed ? '✅ اكتمل وردك!' : qr.claimed ? '🌟 ورد اليوم مُنجز' : '⏱️ ' + Math.floor(qr.seconds / 60) + ':' + String(qr.seconds % 60).padStart(2, '0') + ' / ' + (C().quranDaily || 5) + ':00'}</div>
      </div>
      ${done && !qr.claimed ? `<button class="btn-primary green" style="margin-bottom:10px" onclick="App.claimQuran()">أتممت وردي — نِل مكافأتك 🌟</button>` : ''}
      <div class="quran-page">
        <div class="surah-title">سورة ${esc(s.n)}</div>
        ${basmala}
        <div class="quran-text">${verses}</div>
      </div>
      <div class="form-row" style="margin-top:10px">
        <div>${i > 0 ? `<button class="btn-ghost" style="width:100%" onclick="App.openQuranFull(${i - 1})">→ ${esc(data[i - 1].n)}</button>` : '<span></span>'}</div>
        <div>${i < 113 ? `<button class="btn-ghost" style="width:100%" onclick="App.openQuranFull(${i + 1})">${esc(data[i + 1].n)} ←</button>` : '<span></span>'}</div>
      </div>
      <p class="muted" style="text-align:center;font-size:0.7rem;margin-top:8px">النص العثماني برواية حفص — Tanzil.net</p>`);
  },

  _quranTickStart() {
    this._quranTickStop();
    this._quranTimer = setInterval(() => {
      const qr = this._quranState();
      const target = (C().quranDaily || 5) * 60;
      qr.seconds++;
      qr.totalSeconds = (qr.totalSeconds || 0) + 1;
      if (qr.seconds % 15 === 0) save();   // حفظ دوري خفيف
      const el = document.getElementById('quran-timer');
      if (el && !qr.claimed) {
        if (qr.seconds >= target) {
          // اكتمل الورد الآن: أعد رسم الرأس ليظهر زر المكافأة
          if (qr.seconds - 1 < target) (this._quranMode === 'kids' ? this.renderQuranKids() : this.renderQuranReader());
          else el.textContent = '✅ اكتمل وردك!';
        } else {
          el.textContent = '⏱️ ' + Math.floor(qr.seconds / 60) + ':' + String(qr.seconds % 60).padStart(2, '0') + ' / ' + (C().quranDaily || 5) + ':00';
        }
      }
    }, 1000);
  },

  _quranTickStop() {
    if (this._quranTimer) { clearInterval(this._quranTimer); this._quranTimer = null; save(); }
  },

  claimQuran() {
    const qr = this._quranState();
    const target = (C().quranDaily || 5) * 60;
    if (qr.claimed || qr.seconds < target) return;
    const c = C();
    qr.claimed = true;
    qr.streak = (qr.lastDay === dayKeyOffset(-1)) ? qr.streak + 1 : 1;
    qr.best = Math.max(qr.best || 0, qr.streak);
    qr.lastDay = todayKey();
    c.xp += 25;
    c.coins += 8;
    c.lifetimeCoins += 8;
    c.hp = Math.min(100, c.hp + 10);
    feedPush(c, '🌟', `أتم وِرد القرآن اليومي${qr.streak > 1 ? ` (سلسلة ${qr.streak} يوم)` : ''}`);
    save();
    this.closeModal();
    this.refreshKidHeader();
    this.celebrate('نور على نور! 📖',
      `أتممت وِرد اليوم${qr.streak > 1 ? `<br />🔥 سلسلة القرآن: <b>${qr.streak} يوم</b>` : ''}`,
      ['+25 ✨ XP', '+8 🥕', '+10 ❤️'], '🕌');
    this.renderKMap();
  },

  /* ── ركن الألعاب: البوابة الموحدة ── */
  openGamesHub() {
    const wg = this._wordGameState();
    const mg = this._mathGameState();
    const bg = this._blurGameState();
    const sg = this._shadowGameState();
    const row = (emoji, name, desc, done, total, fn) => `
      <button class="hub-row" onclick="App.${fn}()">
        <span class="hub-emoji">${emoji}</span>
        <span class="hub-info"><b>${name}</b><small>${desc}</small></span>
        <span class="hub-progress ${done >= total ? 'done' : ''}">${done}/${total}</span>
      </button>`;
    this.openModal(`
      <h3 style="text-align:center">🎮 ركن الألعاب</h3>
      <p class="muted" style="text-align:center;margin-bottom:12px">ألعاب جديدة كل يوم — العب واكسب الجزر!</p>
      ${row('🔤', 'كلمات اليوم', 'أكمل الحرف الناقص', wg.arDone + wg.enDone, WORDS_PER_DAY * 2, 'openWordGame')}
      ${row('🧮', 'حساب اليوم', gradeName(C().grade), mg.done, WORDS_PER_DAY, 'openMathGame')}
      ${row('🌫️', 'الصورة الضبابية', 'خمّن مبكرًا تكسب أكثر!', bg.done, WORDS_PER_DAY, 'openBlurGame')}
      ${row('🕵️', 'الظل الغامض', 'من صاحب هذا الظل؟', sg.done, WORDS_PER_DAY, 'openShadowGame')}
      ${row('🍱', 'صندوق الغداء البطل', 'ركّب صندوقًا صحيًا', this._lunchGameState().done, 1, 'openLunchGame')}`);
  },

  _gameBackBtn() {
    return `<button class="btn-ghost small" style="margin-bottom:8px" onclick="App.openGamesHub()">🎮 → الألعاب</button>`;
  },

  /* ── لعبة الصورة الضبابية: وضوح أكثر = جائزة أقل ── */
  BLUR_LEVELS: [
    { blur: 16, prize: 10 },
    { blur: 10, prize: 7 },
    { blur: 6,  prize: 5 },
    { blur: 3,  prize: 3 },
    { blur: 0,  prize: 1 },
  ],
  _blurLevel: 0,

  _blurGameState() {
    const c = C();
    if (!c.blurGame) c.blurGame = { date: null, done: 0, totalSolved: 0 };
    if (c.blurGame.date !== todayKey()) {
      c.blurGame.date = todayKey();
      c.blurGame.done = 0;
      save();
    }
    return c.blurGame;
  },

  /* لغز اليوم رقم i: الهدف + 3 مشتتات من بنك الكلمات العربية */
  _blurPuzzle(i, salt) {
    const pool = WORDS_AR;
    const target = pool[strHash(todayKey() + salt + i) % pool.length];
    const opts = [target];
    let h = strHash(todayKey() + salt + target.w);
    while (opts.length < 4) {
      const cand = pool[h % pool.length];
      h = (h * 31 + 13) % 1000003;
      if (!opts.some(o => o.w === cand.w)) opts.push(cand);
    }
    opts.sort((a, b) => strHash(todayKey() + a.w + salt) - strHash(todayKey() + b.w + salt));
    return { target, opts };
  },

  openBlurGame(keepLevel) {
    const bg = this._blurGameState();
    if (!keepLevel) this._blurLevel = 0;
    let body;
    if (bg.done >= WORDS_PER_DAY) {
      body = `<div style="text-align:center;padding:20px 0"><div style="font-size:3rem">🌟</div>
        <p style="font-weight:900">أتممت ألغاز اليوم!</p><p class="muted">عد غدًا لصور جديدة</p></div>`;
    } else {
      const p = this._blurPuzzle(bg.done, 'blur');
      const lvl = this.BLUR_LEVELS[this._blurLevel];
      const lastLevel = this._blurLevel >= this.BLUR_LEVELS.length - 1;
      body = `
        <div class="wg-progress">${bg.done + 1} / ${WORDS_PER_DAY}</div>
        <div class="blur-stage"><span style="filter:blur(${lvl.blur}px)">${p.target.e}</span></div>
        <div class="prize-chip">الجائزة الآن: 🥕 ${lvl.prize}</div>
        ${lastLevel ? '' : `<button class="btn-ghost small" onclick="App.blurReveal()">🔍 وضّح أكثر (تنقص الجائزة)</button>`}
        <div class="wg-choices" style="margin-top:12px">
          ${p.opts.map(o => `<button class="wg-choice word" onclick="App.blurGuess('${o.w}')">
            <span class="opt-say" data-say="${o.w}" onclick="event.stopPropagation();App.sayText(this)">🔊</span>${o.w}</button>`).join('')}
        </div>
        <p id="bg-msg" class="muted" style="min-height:1.3em;margin-top:8px"></p>`;
    }
    this.openModal(`${this._gameBackBtn()}<h3 style="text-align:center">🌫️ الصورة الضبابية</h3>
      <p class="muted" style="text-align:center;margin-bottom:8px">خمّن وهي ضبابية تكسب أكثر!</p>
      <div style="text-align:center">${body}</div>`);
  },

  blurReveal() {
    if (this._blurLevel < this.BLUR_LEVELS.length - 1) this._blurLevel++;
    this.openBlurGame(true);
  },

  blurGuess(word) {
    const bg = this._blurGameState();
    if (bg.done >= WORDS_PER_DAY) return;
    const p = this._blurPuzzle(bg.done, 'blur');
    if (word !== p.target.w) {
      // تخمين خاطئ: تتضح الصورة وتنقص الجائزة
      if (this._blurLevel < this.BLUR_LEVELS.length - 1) {
        this._blurLevel++;
        this.openBlurGame(true);
        setTimeout(() => { const m = document.getElementById('bg-msg'); if (m) m.textContent = 'ليست هي! وضّحنا الصورة قليلًا 👀'; }, 50);
      } else {
        const m = document.getElementById('bg-msg');
        if (m) m.textContent = 'جرّب مرة أخرى 💪';
      }
      return;
    }
    const prize = this.BLUR_LEVELS[this._blurLevel].prize;
    const c = C();
    bg.done++;
    bg.totalSolved = (bg.totalSolved || 0) + 1;
    c.coins += prize;
    c.lifetimeCoins += prize;
    c.xp += WORD_XP;
    save();
    speak(p.target.w, 'ar-SA');
    this.refreshKidHeader();
    this._blurLevel = 0;
    if (bg.done >= WORDS_PER_DAY) {
      this.closeModal();
      this.celebrate('عين صقر! 🌫️', `إنها <b>${esc(p.target.w)}</b> ${p.target.e}`, [`+${WORD_XP} ✨ XP`, `+${prize} 🥕`], '🦅');
      this.renderKMap();
    } else {
      this.toast(`✅ ${p.target.w} — ربحت ${prize} 🥕`);
      this.openBlurGame();
    }
  },

  /* ── لعبة الظل الغامض ── */
  _shadowTried: false,

  _shadowGameState() {
    const c = C();
    if (!c.shadowGame) c.shadowGame = { date: null, done: 0, totalSolved: 0 };
    if (c.shadowGame.date !== todayKey()) {
      c.shadowGame.date = todayKey();
      c.shadowGame.done = 0;
      save();
    }
    return c.shadowGame;
  },

  openShadowGame() {
    const sg = this._shadowGameState();
    this._shadowTried = false;
    let body;
    if (sg.done >= WORDS_PER_DAY) {
      body = `<div style="text-align:center;padding:20px 0"><div style="font-size:3rem">🌟</div>
        <p style="font-weight:900">كشفت كل ظلال اليوم!</p><p class="muted">عد غدًا لظلال جديدة</p></div>`;
    } else {
      const p = this._blurPuzzle(sg.done, 'shadow');
      body = `
        <div class="wg-progress">${sg.done + 1} / ${WORDS_PER_DAY}</div>
        <div class="shadow-stage"><span>${p.target.e}</span></div>
        <div class="wg-choices" style="margin-top:12px">
          ${p.opts.map(o => `<button class="wg-choice word" onclick="App.shadowGuess('${o.w}')">
            <span class="opt-say" data-say="${o.w}" onclick="event.stopPropagation();App.sayText(this)">🔊</span>${o.w}</button>`).join('')}
        </div>
        <p id="sg-msg" class="muted" style="min-height:1.3em;margin-top:8px"></p>`;
    }
    this.openModal(`${this._gameBackBtn()}<h3 style="text-align:center">🕵️ الظل الغامض</h3>
      <p class="muted" style="text-align:center;margin-bottom:8px">من صاحب هذا الظل؟</p>
      <div style="text-align:center">${body}</div>`);
  },

  shadowGuess(word) {
    const sg = this._shadowGameState();
    if (sg.done >= WORDS_PER_DAY) return;
    const p = this._blurPuzzle(sg.done, 'shadow');
    if (word !== p.target.w) {
      this._shadowTried = true;
      const m = document.getElementById('sg-msg');
      if (m) m.textContent = 'ليس هو… دقق في الظل 🔍';
      return;
    }
    const prize = this._shadowTried ? 1 : 3;   // الإجابة من أول مرة أثمن
    const c = C();
    sg.done++;
    sg.totalSolved = (sg.totalSolved || 0) + 1;
    c.coins += prize;
    c.lifetimeCoins += prize;
    c.xp += WORD_XP;
    save();
    speak(p.target.w, 'ar-SA');
    this.refreshKidHeader();
    if (sg.done >= WORDS_PER_DAY) {
      this.closeModal();
      this.celebrate('محقق بارع! 🕵️', `إنه <b>${esc(p.target.w)}</b> ${p.target.e}`, [`+${WORD_XP} ✨ XP`, `+${prize} 🥕`], '🔦');
      this.renderKMap();
    } else {
      this.toast(`✅ ${p.target.w} — +${prize} 🥕`);
      this.openShadowGame();
    }
  },

  /* ── لعبة صندوق الغداء البطل: ركّب صندوقًا صحيًا متوازنًا ── */
  _lunchPicks: [],

  _lunchGameState() {
    const c = C();
    if (!c.lunchGame) c.lunchGame = { date: null, done: 0, totalSolved: 0 };
    if (c.lunchGame.date !== todayKey()) {
      c.lunchGame.date = todayKey();
      c.lunchGame.done = 0;
      save();
    }
    return c.lunchGame;
  },

  /* 8 عناصر يومية حتمية: عنصر صحي من كل فئة + مشتتات وعناصر غير صحية */
  _lunchItems() {
    const groups = ['main', 'fruit', 'veg', 'drink'];
    const items = [];
    for (const g of groups) {
      const pool = LUNCH_ITEMS.filter(x => x.g === g);
      items.push(pool[strHash(todayKey() + g) % pool.length]);
    }
    const junk = LUNCH_ITEMS.filter(x => x.g === 'junk');
    items.push(junk[strHash(todayKey() + 'j1') % junk.length]);
    items.push(junk[(strHash(todayKey() + 'j2') + 1) % junk.length]);
    // عنصران صحيان إضافيان كمشتتات إيجابية
    const extra = LUNCH_ITEMS.filter(x => x.g !== 'junk' && !items.includes(x));
    items.push(extra[strHash(todayKey() + 'e1') % extra.length]);
    items.push(extra[(strHash(todayKey() + 'e2') + 3) % extra.length]);
    return items.sort((a, b) => strHash(todayKey() + a.n) - strHash(todayKey() + b.n));
  },

  openLunchGame() {
    const lg = this._lunchGameState();
    this._lunchPicks = [];
    let body;
    if (lg.done >= 1) {
      body = `<div style="text-align:center;padding:20px 0"><div style="font-size:3rem">🌟</div>
        <p style="font-weight:900">ركّبت صندوق اليوم!</p><p class="muted">عد غدًا لصندوق جديد — وجهّز صندوقك الحقيقي بنفس الطريقة 😉</p></div>`;
    } else {
      body = `
        <p class="muted">اختر <b>4 عناصر</b> لصندوق متوازن: وجبة + فاكهة + خضار + مشروب صحي — وانتبه من المقالب! 😄</p>
        <div class="lunch-grid">
          ${this._lunchItems().map((it, i) => `
            <button class="lunch-item" id="li-${i}" data-g="${it.g}" onclick="App.lunchPick(this)">
              <span class="li-emoji">${it.e}</span><span class="li-name">${it.n}</span>
            </button>`).join('')}
        </div>
        <div class="lunch-slots" id="lunch-slots">🍱 اختر 4 عناصر…</div>
        <button class="btn-primary green" id="lunch-check" style="display:none;margin-top:10px" onclick="App.lunchCheck()">جهّز الصندوق! 🍱</button>`;
    }
    this.openModal(`${this._gameBackBtn()}<h3 style="text-align:center">🍱 صندوق الغداء البطل</h3><div style="text-align:center">${body}</div>`);
  },

  lunchPick(btn) {
    const on = btn.classList.toggle('picked');
    const idx = btn.id;
    if (on) this._lunchPicks.push(idx);
    else this._lunchPicks = this._lunchPicks.filter(x => x !== idx);
    if (this._lunchPicks.length > 4) {
      btn.classList.remove('picked');
      this._lunchPicks = this._lunchPicks.filter(x => x !== idx);
      this.toast('الصندوق يتسع لأربعة فقط!');
    }
    const slots = document.getElementById('lunch-slots');
    slots.textContent = '🍱 ' + (this._lunchPicks.length ? this._lunchPicks.map(id => document.getElementById(id).querySelector('.li-emoji').textContent).join(' ') : 'اختر 4 عناصر…');
    document.getElementById('lunch-check').style.display = this._lunchPicks.length === 4 ? 'block' : 'none';
  },

  lunchCheck() {
    const groups = this._lunchPicks.map(id => document.getElementById(id).dataset.g);
    const hasJunk = groups.includes('junk');
    const variety = new Set(groups.filter(g => g !== 'junk')).size;
    const lg = this._lunchGameState();
    if (hasJunk) {
      this.toast('في صندوقك شيء غير صحي! 🍟 بدّله وحاول');
      return;
    }
    if (variety < 3) {
      this.toast('نوّع أكثر: وجبة وفاكهة وخضار ومشروب 💪');
      return;
    }
    const c = C();
    lg.done = 1;
    lg.totalSolved = (lg.totalSolved || 0) + 1;
    c.coins += 3;
    c.lifetimeCoins += 3;
    c.xp += WORD_XP;
    c.hp = Math.min(100, c.hp + 5);
    save();
    this.closeModal();
    this.refreshKidHeader();
    this.celebrate('صندوق بطل حقيقي! 🍱', 'متوازن وصحي — جهّز صندوقك الحقيقي هكذا غدًا!', ['+5 ✨ XP', '+3 🥕', '+5 ❤️'], '🥗');
    this.renderKMap();
  },

  /* ── تحدي الحساب اليومي (حسب الصف) ── */
  _mathGameState() {
    const c = C();
    if (!c.mathGame) c.mathGame = { date: null, done: 0, totalSolved: 0 };
    if (c.mathGame.date !== todayKey()) {
      c.mathGame.date = todayKey();
      c.mathGame.done = 0;
      save();
    }
    return c.mathGame;
  },

  openMathGame() {
    const mg = this._mathGameState();
    let body;
    if (mg.done >= WORDS_PER_DAY) {
      body = `<div style="text-align:center;padding:20px 0">
        <div style="font-size:3rem">🌟</div>
        <p style="font-weight:900">أتممت أسئلة اليوم!</p>
        <p class="muted">عد غدًا لأسئلة جديدة</p>
      </div>`;
    } else {
      const q = mathQuestionFor(C().grade, mg.done);
      body = `
        <div class="wg-progress">${mg.done + 1} / ${WORDS_PER_DAY} · 🎓 ${gradeName(C().grade)}</div>
        <div class="math-question">${q.text}</div>
        <div class="wg-choices">${q.opts.map(o => `<button class="wg-choice" onclick="App.mathGuess(${o})">${o}</button>`).join('')}</div>
        <p id="mg-msg" class="muted" style="min-height:1.3em;margin-top:8px"></p>`;
    }
    this.openModal(`${this._gameBackBtn()}<h3 style="text-align:center">🧮 تحدي حساب اليوم</h3><div style="text-align:center">${body}</div>`);
  },

  mathGuess(val) {
    const mg = this._mathGameState();
    if (mg.done >= WORDS_PER_DAY) return;
    const q = mathQuestionFor(C().grade, mg.done);
    const msg = document.getElementById('mg-msg');
    if (val !== q.answer) {
      if (msg) msg.textContent = 'قريب! جرّب مرة أخرى 💪';
      return;
    }
    const c = C();
    mg.done++;
    mg.totalSolved = (mg.totalSolved || 0) + 1;
    c.xp += WORD_XP;
    c.coins += WORD_COINS;
    c.lifetimeCoins += WORD_COINS;
    let bonus = 0;
    if (mg.done >= WORDS_PER_DAY) { bonus = 5; c.coins += bonus; c.lifetimeCoins += bonus; }
    save();
    this.refreshKidHeader();
    if (mg.done >= WORDS_PER_DAY) {
      this.closeModal();
      this.celebrate('أتممت حساب اليوم! 🧮', `الإجابة الأخيرة: <b>${q.answer}</b> ✅`,
        [`+${WORD_XP} ✨ XP`, `+${WORD_COINS + bonus} 🥕`], '🌟');
      this.renderKMap();
    } else {
      this.toast(`✅ صحيح! ${q.answer} — +${WORD_COINS} 🥕`);
      this.openMathGame();
    }
  },

  /* ── لعب اختبار المعلم التفاعلي ── */
  _quizPlay: null,   // { quiz, index, correct, answered }

  playQuiz(quizId) {
    const quiz = S.quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    this._quizPlay = { quiz, index: 0, correct: 0, replay: C().quizzesDone[quiz.id] !== undefined };
    this.renderQuizQuestion();
  },

  renderQuizQuestion() {
    const p = this._quizPlay;
    const q = p.quiz.questions[p.index];
    const [text, correctIdx, ...opts] = q;
    // خلط الخيارات حتميًا لكل طفل
    const order = [0, 1, 2, 3].sort((a, b) => strHash(C().id + text + a) - strHash(C().id + text + b));
    this.openModal(`
      <h3 style="text-align:center">📝 ${esc(p.quiz.title)}</h3>
      <p class="muted" style="text-align:center">🏫 ${esc(p.quiz.teacher)}${p.replay ? ' · إعادة (بلا جزر)' : ''}</p>
      <div style="text-align:center">
        <div class="wg-progress">${p.index + 1} / ${p.quiz.questions.length}</div>
        <div class="quiz-question">${esc(text)}</div>
        <div class="quiz-options">
          ${order.map(i => `<button class="wg-choice word" id="qopt-${i}" onclick="App.quizAnswer(${i})">${esc(opts[i])}</button>`).join('')}
        </div>
        <p id="qz-msg" class="muted" style="min-height:1.3em;margin-top:8px"></p>
      </div>`);
  },

  quizAnswer(i) {
    const p = this._quizPlay;
    const q = p.quiz.questions[p.index];
    const correctIdx = q[1];
    const isRight = i === correctIdx;
    if (isRight) p.correct++;
    // تلوين الإجابة الصحيحة تعليميًا ثم الانتقال
    const rightBtn = document.getElementById('qopt-' + correctIdx);
    const pickedBtn = document.getElementById('qopt-' + i);
    if (rightBtn) rightBtn.classList.add('right');
    if (!isRight && pickedBtn) pickedBtn.classList.add('wrong');
    document.querySelectorAll('.quiz-options .wg-choice').forEach(b => b.disabled = true);
    const msg = document.getElementById('qz-msg');
    if (msg) msg.textContent = isRight ? '✅ أحسنت!' : `الإجابة الصحيحة: ${q[2 + correctIdx]}`;
    setTimeout(() => {
      p.index++;
      if (p.index < p.quiz.questions.length) this.renderQuizQuestion();
      else this.finishQuiz();
    }, 1200);
  },

  finishQuiz() {
    const p = this._quizPlay;
    const c = C();
    const total = p.quiz.questions.length;
    const full = p.correct === total;
    let coins = 0, xp = 0;
    if (!p.replay) {
      coins = p.correct * 2 + (full ? 5 : 0);
      xp = p.correct * 5;
      c.coins += coins;
      c.lifetimeCoins += coins;
      c.xp += xp;
    }
    c.quizzesDone[p.quiz.id] = p.correct;
    save();
    this.closeModal();
    this.refreshKidHeader();
    this.celebrate(
      full ? 'العلامة الكاملة! 🏆' : 'أكملت الاختبار! 📝',
      `${esc(p.quiz.title)}<br />نتيجتك: <b>${p.correct} / ${total}</b>${p.replay ? '<br /><small>إعادة تدريبية — بلا جزر</small>' : ''}`,
      p.replay ? [] : [`+${xp} ✨ XP`, `+${coins} 🥕`],
      full ? '🏆' : '📝');
    this.renderKMap();
    this._quizPlay = null;
  },

  /* ── مشاهدة فيديو تعليمي داخل التطبيق (+مكافأة أول مشاهدة) ── */
  _videoWatch: null,   // { id, start }

  watchVideo(videoId) {
    const v = S.videos.find(x => x.id === videoId);
    if (!v) return;
    const embed = youtubeEmbed(v.url);
    if (!embed) { this.toast('رابط الفيديو غير صالح'); return; }
    const c = C();
    const rewarded = c.videosWatched && c.videosWatched[videoId];
    this._videoWatch = rewarded ? null : { id: videoId, title: v.title, start: Date.now() };
    this.openModal(`
      <h3>🎬 ${esc(v.title)}</h3>
      <div class="video-frame">
        <iframe src="${embed}" title="${esc(v.title)}" frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
      ${rewarded ? '' : '<p class="muted" style="text-align:center;margin-top:8px">شاهد دقيقة على الأقل واكسب +3 🥕 📚</p>'}`);
  },

  /* تُمنح مكافأة المشاهدة عند إغلاق الفيديو بعد دقيقة على الأقل — مرة لكل فيديو */
  _checkVideoReward() {
    const w = this._videoWatch;
    this._videoWatch = null;
    if (!w) return;
    if (Date.now() - w.start < 60000) return;
    const c = C();
    c.videosWatched = c.videosWatched || {};
    if (c.videosWatched[w.id]) return;
    c.videosWatched[w.id] = true;
    c.coins += 3;
    c.lifetimeCoins += 3;
    c.xp += 5;
    save();
    this.refreshKidHeader();
    this.celebrate('متعلم رائع! 🎬', `شاهدت «${esc(w.title)}»`, ['+5 ✨ XP', '+3 🥕'], '📚');
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
    const gains = [`+${t.xp} ✨ XP`, `+${t.coins + res.bonus} 🥕`];
    if (res.worldBloom) gains.push(`${res.worldBloom.stage.emoji} رممت: ${res.worldBloom.stage.title}`);
    this.celebrate(title, msg, gains, emoji);
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
        <div class="hero-world" style="color:${worldOf(C().journey.stage).color}">${worldOf(C().journey.stage).emoji} ${esc(worldOf(C().journey.stage).name)} — المرحلة ${Math.min(C().journey.stage + 1, TOTAL_STAGES)}/${TOTAL_STAGES}</div>
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
        <h3>⭐ أمنياتي</h3>
        ${(C().wishes || []).map(w => {
          if (w.status === 'goal') {
            const pct = Math.min(100, Math.round(C().coins / w.cost * 100));
            return `<div style="margin-bottom:10px"><b>🎯 ${esc(w.title)}</b><div class="t-meta">${C().coins >= w.cost ? 'رصيدك يكفي! اطلبها من المتجر 🎉' : 'تبقى ' + (w.cost - C().coins) + ' 🥕 لتحقيقها'}</div><div class="progressbar" style="margin-top:4px"><i style="width:${pct}%"></i></div></div>`;
          }
          if (w.status === 'done') return `<p class="pill" style="margin-bottom:6px;background:#e2f5ea">✅ ${esc(w.title)} — تحققت!</p>`;
          return `<p class="pill" style="margin-bottom:6px">⭐ ${esc(w.title)} <small>بانتظار والدك</small></p>`;
        }).join('') || '<p class="muted">ما أمنيتك؟ لعبة، رحلة، يوم مسبح…</p>'}
        <button class="btn-ghost" style="width:100%;margin-top:8px" onclick="App.wishForm()">＋ أضف أمنية</button>
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
        ? `<button class="av-pick ${b.id === heroBase(c) ? 'active' : ''}" data-base="${b.id}" title="${b.name}" onclick="App.pickAvBase(this)">${faceHTML(b.id)}</button>`
        : `<span class="av-pick locked" title="يفتح في المستوى ${b.lvl}">🔒<small>م${b.lvl}</small></span>`;
    }).join('');
    const worldsDone = Math.floor((c.journey ? c.journey.stage : 0) / STAGES_PER_WORLD);
    const bgRow = AVATAR_BGS.map(bg =>
      `<button class="bg-pick ${bg === heroBg(c) ? 'active' : ''}" data-bg="${bg}" style="background:${bg}" onclick="App.pickAvBg(this)"></button>`).join('')
      + WORLDS.map((w, wi) => wi < worldsDone
        ? `<button class="bg-pick ${w.grad[1] === heroBg(c) ? 'active' : ''}" data-bg="${w.grad[1]}" style="background:linear-gradient(135deg,${w.grad[0]},${w.grad[1]})" title="${w.name}" onclick="App.pickAvBg(this)"></button>`
        : `<span class="bg-pick locked" title="أكمل ${w.name} لفتحها">🔒</span>`).join('');
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
      base: baseEl ? baseEl.dataset.base : heroBase(C()),
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
    // خصومات الولاء: كلما جمعت جزرًا أكثر في حياتك زاد خصمك
    const tier = loyaltyTier(C());
    const realRewards = S.rewards.map(r => {
      const cost = discountedCost(r.cost, tier);
      return `
      <div class="shop-item">
        <button class="opt-say shop-say" data-say="${esc(r.title)} مقابل ${cost} جزرة" onclick="App.sayText(this)">🔊</button>
        <span class="s-emoji">${r.emoji}</span>
        <span class="s-name">${esc(r.title)}</span>
        ${r.kind === 'out' ? '<small style="color:#8a86a8;font-weight:700">🚗 مشوار — بموافقة خاصة</small>' : ''}
        ${r.kind === 'budget' ? '<small style="color:#8a86a8;font-weight:700">💰 يحتاج ميزانية — بموافقة خاصة</small>' : ''}
        ${r.teacher ? `<small style="color:#8a86a8;font-weight:700">🏫 من ${esc(r.teacher)}</small>` : ''}
        <button class="buy-btn" ${C().coins < cost ? 'disabled' : ''} onclick="App.redeemReward('${r.id}')">
          ${cost < r.cost ? `<s style="opacity:0.7">${r.cost}</s> ` : ''}${cost} 🥕</button>
      </div>`;
    }).join('');

    // قسائم الشركاء
    const vouchers = S.vouchers.map(v => {
      const cost = discountedCost(v.cost, tier);
      return `
      <div class="shop-item voucher">
        <button class="opt-say shop-say" data-say="قسيمة ${esc(v.partner)}: ${esc(v.title)} مقابل ${cost} جزرة" onclick="App.sayText(this)">🔊</button>
        <span class="s-emoji">${v.emoji || '🎟️'}</span>
        <span class="s-name">${esc(v.title)}</span>
        <small style="color:#8a86a8;font-weight:700">${esc(v.partner)}</small>
        ${(v.ladder || []).length ? `<small style="color:var(--green-dark);font-weight:900">خصم الشريك لك: ${partnerOff(v)}% ${worldOf(C().journey.stage).emoji}</small>` : ''}
        <button class="buy-btn" ${C().coins < cost ? 'disabled' : ''} onclick="App.buyVoucher('${v.id}')">
          ${cost < v.cost ? `<s style="opacity:0.7">${v.cost}</s> ` : ''}${cost} 🥕</button>
      </div>`;
    }).join('');

    const myVouchers = (C().myVouchers || []).map(v => `
      <div class="task-row">
        <span class="task-cat">🎟️</span>
        <div class="task-info">
          <div class="t-title">${esc(v.title)} — ${esc(v.partner)}</div>
          <div class="t-meta">الكود: <b class="voucher-code" dir="ltr">${esc(v.code)}</b> · ${v.date}</div>
        </div>
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
      <div class="all-done-banner" style="background:linear-gradient(120deg,#ffe0b8,#ffd0a0)">
        رصيدك: ${C().coins} 🥕
        ${tier.off ? `<div style="font-size:0.85rem;margin-top:4px">${tier.emoji} عضوية ${tier.name} — خصم ${tier.off}% على الجوائز والقسائم!</div>` : `<div style="font-size:0.78rem;margin-top:4px;opacity:0.8">اجمع 100 🥕 (إجمالي) لتفتح خصومات الولاء 🏅</div>`}
      </div>
      ${pending.length ? `<div class="card"><h3>⏳ بانتظار موافقة الوالدين</h3>${pending.map(p => `<p class="pill" style="margin-bottom:6px">${p.kind === 'out' ? '🚗' : p.kind === 'budget' ? '💰' : '🎁'} ${esc(p.title)}</p>`).join('')}</div>` : ''}
      <h3 class="shop-section-title">🎁 جوائز حقيقية من العائلة</h3>
      <div class="shop-grid">${realRewards || '<p class="muted">لا توجد جوائز بعد</p>'}</div>
      ${vouchers ? `<h3 class="shop-section-title">🎟️ قسائم الشركاء</h3><div class="shop-grid">${vouchers}</div>` : ''}
      ${myVouchers ? `<div class="card" style="margin-top:14px"><h3>🎫 قسائمي</h3>${myVouchers}</div>` : ''}
      <h3 class="shop-section-title">🧢 عتاد البطل</h3>
      <div class="shop-grid">${gearShop}</div>`;
  },

  redeemReward(rewardId) {
    const r = S.rewards.find(x => x.id === rewardId);
    if (!r) return;
    const cost = discountedCost(r.cost, loyaltyTier(C()));
    if (C().coins < cost) return;
    if (!confirm(`شراء "${r.title}" مقابل ${cost} 🥕؟`)) return;
    C().coins -= cost;
    C().redemptions.push({ id: uid(), rewardId: r.id, title: r.title, cost, kind: r.kind || 'home', date: todayKey(), status: 'pending' });
    save();
    const special = r.kind === 'out' || r.kind === 'budget';
    this.celebrate('طلب رائع! 🎁',
      special
        ? `"${esc(r.title)}" ${r.kind === 'out' ? 'مشوار خارج المنزل 🚗' : 'يحتاج ميزانية 💰'}<br /><small>أرسلنا تنبيهًا خاصًا لوالدك للموافقة والتخطيط</small>`
        : `أرسلنا "${esc(r.title)}" للوالدين للموافقة`,
      [`-${cost} 🥕`], special ? '🚨' : '📨');
    this.renderKShop();
    this.refreshKidHeader();
  },

  /* شراء قسيمة شريك: الكود يُكشف فورًا ويُحفظ في "قسائمي" */
  buyVoucher(voucherId) {
    const v = S.vouchers.find(x => x.id === voucherId);
    if (!v) return;
    const cost = discountedCost(v.cost, loyaltyTier(C()));
    if (C().coins < cost) return;
    if (!confirm(`شراء قسيمة "${v.title}" من ${v.partner} مقابل ${cost} 🥕؟`)) return;
    const c = C();
    c.coins -= cost;
    c.myVouchers = c.myVouchers || [];
    c.myVouchers.push({ id: uid(), voucherId: v.id, partner: v.partner, title: v.title, code: v.code, off: partnerOff(v), date: todayKey() });
    v.used = (v.used || 0) + 1;   // ليطلع الوالد على الاستخدام
    save();
    this.celebrate('قسيمتك جاهزة! 🎟️',
      `${esc(v.title)} — ${esc(v.partner)}<br /><div class="code-box" style="margin-top:8px;font-size:1rem;text-align:center" dir="ltr">${esc(v.code)}</div><small>محفوظة في "قسائمي" بالمتجر — أرها عند الاستخدام</small>`,
      [`-${cost} 🥕`], '🎟️');
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
    this._teacherTab = this._teacherTab || 'task';
    this.renderTeacherForm();
  },

  _teacherTab: 'task',
  teacherTab(tab) {
    this._teacherTab = tab;
    if (tab === 'quiz') this.renderQuizBuilder();
    else this.renderTeacherForm();
  },

  _teacherTabsHtml() {
    return `
      <div class="lib-chips" style="justify-content:center;margin-bottom:14px">
        <button class="lib-chip ${this._teacherTab !== 'quiz' ? 'active' : ''}" onclick="App.teacherTab('task')">📋 مهمة / مكافأة</button>
        <button class="lib-chip ${this._teacherTab === 'quiz' ? 'active' : ''}" onclick="App.teacherTab('quiz')">📝 اختبار تفاعلي</button>
      </div>`;
  },

  renderTeacherForm() {
    const catOptions = Object.entries(CATEGORIES)
      .map(([k, c]) => `<option value="${k}">${c.emoji} ${c.name}</option>`).join('');
    const proofOptions = Object.entries(PROOF_MODES)
      .map(([k, m]) => `<option value="${k}" ${k === 'photo' ? 'selected' : ''}>${m.emoji} ${m.name}</option>`).join('');
    document.getElementById('teacher-body').innerHTML = `
      ${this._teacherTabsHtml()}
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

  /* ── منشئ الاختبارات التفاعلية للمعلم ── */
  _quizDraft: { title: '', name: '', questions: [] },

  renderQuizBuilder() {
    const d = this._quizDraft;
    const qList = d.questions.map((q, i) => `
      <div class="task-row">
        <span class="task-cat">${i + 1}️⃣</span>
        <div class="task-info">
          <div class="t-title">${esc(q[0])}</div>
          <div class="t-meta">الإجابة: ${esc(q[2 + q[1]])}</div>
        </div>
        <button class="icon-btn" onclick="App.quizRemoveQ(${i})">🗑️</button>
      </div>`).join('');
    document.getElementById('teacher-body').innerHTML = `
      ${this._teacherTabsHtml()}
      <div class="card">
        <p class="muted" style="margin-bottom:10px">جهّز درس الغد كمسابقة تفاعلية: يحلها الطالب في التطبيق ويكسب الجزر على كل إجابة صحيحة (حتى 6 أسئلة)</p>
        <div class="form-grid">
          <div><label>اسمك</label><input id="q-name" value="${esc(d.name)}" placeholder="مثال: المعلمة نورة" /></div>
          <div><label>عنوان الاختبار</label><input id="q-title" value="${esc(d.title)}" placeholder="مثال: مراجعة درس الكسور" /></div>
        </div>
      </div>
      <div class="card">
        <h3>الأسئلة (${d.questions.length}/6)</h3>
        ${qList || '<p class="muted">أضف أول سؤال 👇</p>'}
      </div>
      ${d.questions.length < 6 ? `
      <div class="card">
        <div class="form-grid">
          <div><label>السؤال</label><input id="q-text" placeholder="مثال: كم نصف العدد 8؟" /></div>
          <div class="form-row">
            <div><label>الخيار 1 (الصحيح ✅)</label><input id="q-o0" /></div>
            <div><label>الخيار 2</label><input id="q-o1" /></div>
          </div>
          <div class="form-row">
            <div><label>الخيار 3</label><input id="q-o2" /></div>
            <div><label>الخيار 4</label><input id="q-o3" /></div>
          </div>
          <button class="btn-primary green" onclick="App.quizAddQ()">＋ أضف السؤال</button>
          <p class="muted" style="font-size:0.75rem">اكتب الإجابة الصحيحة في الخيار الأول — التطبيق يخلط الخيارات تلقائيًا لكل طالب</p>
        </div>
      </div>` : ''}
      ${d.questions.length ? `<button class="btn-primary purple" onclick="App.quizGenerate()">توليد رمز الاختبار 🔑</button>` : ''}
      <div id="teacher-result"></div>`;
  },

  quizAddQ() {
    const name = document.getElementById('q-name').value.trim();
    const title = document.getElementById('q-title').value.trim();
    const text = document.getElementById('q-text').value.trim();
    const opts = [0, 1, 2, 3].map(i => document.getElementById('q-o' + i).value.trim());
    if (!text || opts.some(o => !o)) { this.toast('أكمل السؤال والخيارات الأربعة'); return; }
    this._quizDraft.name = name;
    this._quizDraft.title = title;
    // نخزن [السؤال، فهرس الصحيح، ...الخيارات] — الصحيح دائمًا الأول عند الإدخال
    this._quizDraft.questions.push([text, 0, ...opts]);
    this.renderQuizBuilder();
  },

  quizRemoveQ(i) {
    this._quizDraft.questions.splice(i, 1);
    this.renderQuizBuilder();
  },

  quizGenerate() {
    const d = this._quizDraft;
    d.name = document.getElementById('q-name').value.trim() || d.name;
    d.title = document.getElementById('q-title').value.trim() || d.title;
    if (!d.name || !d.title) { this.toast('اكتب اسمك وعنوان الاختبار'); return; }
    if (!d.questions.length) { this.toast('أضف سؤالًا واحدًا على الأقل'); return; }
    const payload = { v: 1, k: 'q', n: d.name, t: d.title, q: d.questions };
    const code = encodeShareCode(payload);
    this._lastShareCode = code;
    this._lastShareMsg = `📝 اختبار تفاعلي من ${d.name} عبر تطبيق جَزَرة 🥕\n«${d.title}» — ${d.questions.length} أسئلة\n\nانسخ الرمز والصقه في التطبيق (إضافة رمز من المعلم):\n\n${code}`;
    // الاختبارات الطويلة قد تتجاوز سعة QR — الرمز النصي يعمل دائمًا
    let qrHtml = '';
    try {
      const qr = qrcode(0, 'M');
      qr.addData(code);
      qr.make();
      qrHtml = `<div class="qr-box">${qr.createSvgTag({ scalable: true, margin: 2 })}</div>`;
    } catch (e) {
      qrHtml = '<p class="muted">الاختبار كبير على QR — استخدم الرمز النصي عبر واتساب (يعمل تمامًا)</p>';
    }
    document.getElementById('teacher-result').innerHTML = `
      <div class="card" style="text-align:center;border:3px solid var(--purple);margin-top:14px">
        <h3>✅ رمز الاختبار جاهز</h3>
        ${qrHtml}
        <div class="code-box" dir="ltr">${this._lastShareCode}</div>
        <div class="form-row" style="margin-top:12px">
          <div><button class="btn-primary green" onclick="App.copyShareCode()">📋 نسخ</button></div>
          <div><button class="btn-primary" onclick="App.whatsappShareCode()">💬 واتساب</button></div>
        </div>
        <button class="btn-ghost" style="margin-top:10px" onclick="App._quizDraft={title:'',name:'',questions:[]};App.renderQuizBuilder()">اختبار جديد</button>
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
    if (obj.k === 'q') {
      // اختبار تفاعلي من المعلم
      if (!Array.isArray(obj.q) || !obj.q.length) { this.toast('رمز الاختبار غير مكتمل'); return; }
      if (S.quizzes.some(x => x.title === obj.t && x.teacher === obj.n)) { this.toast('هذا الاختبار مضاف من قبل'); this.closeModal(); return; }
      S.quizzes.push({ id: uid(), title: obj.t, teacher: obj.n, questions: obj.q.slice(0, 6) });
      save();
      this.closeModal();
      this.toast(`أُضيف اختبار «${obj.t}» من ${obj.n} 📝`);
    } else if (obj.k === 'r') {
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

  _cQueue: [],

  celebrate(title, msg, gains, emoji = '🎉') {
    // إن كان احتفال معروضًا الآن، ينتظر هذا دوره
    if (document.getElementById('celebrate').classList.contains('active')) {
      this._cQueue.push([title, msg, gains, emoji]);
      return;
    }
    document.getElementById('celebrate-title').textContent = title;
    document.getElementById('celebrate-msg').innerHTML = msg;
    document.getElementById('celebrate-emoji').innerHTML = emoji;
    document.getElementById('celebrate-gains').innerHTML =
      gains.map((g, i) => `<span class="gain-chip ${i === 0 ? 'xp' : ''}">${g}</span>`).join('');
    document.getElementById('celebrate').classList.add('active');
    this.spawnConfetti();
  },

  closeCelebrate() {
    document.getElementById('celebrate').classList.remove('active');
    document.getElementById('confetti-layer').innerHTML = '';
    // اعرض الاحتفال التالي في الطابور إن وُجد (تقدم الرحلة مثلًا)
    if (this._cQueue.length) {
      const next = this._cQueue.shift();
      setTimeout(() => this.celebrate(...next), 250);
    } else if (this._storyToShow != null) {
      // فصل الحكاية الجديد — يُقرأ بعد انتهاء كل الاحتفالات
      const ch = this._storyToShow;
      this._storyToShow = null;
      setTimeout(() => this.openStory(ch), 300);
    }
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
    this._checkVideoReward();     // مكافأة مشاهدة الفيديو إن استحقت
    this._quranTickStop();        // إيقاف عداد القرآن إن كان يعمل
    this.stopAyah();              // إيقاف التلاوة الصوتية
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

/* عرض رقم البناء أسفل شاشة البداية — للتحقق أي نسخة تعمل */
(function () {
  const el = document.createElement('div');
  el.style.cssText = 'text-align:center;color:#b08968;font-size:0.7rem;font-weight:700;margin-top:14px';
  el.textContent = 'جَزَرة · بناء ' + APP_BUILD;
  const wrap = document.querySelector('.role-wrap');
  if (wrap) wrap.appendChild(el);
})();
