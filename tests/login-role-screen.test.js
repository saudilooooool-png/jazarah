const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

test('شاشة الدخول تقدم مساري الطفل والوالد كقرارين واضحين وتحافظ على معالجات الدخول', () => {
  assert.match(html, /<section id="screen-role" class="screen active">/);
  assert.match(html, /<h2 id="role-choice-title">من سيبدأ الآن؟<\/h2>/);
  assert.match(html, /class="role-card role-kid" onclick="App\.enterKid\(\)"/);
  assert.match(html, /class="role-card role-parent" onclick="App\.enterParent\(\)"/);
  assert.match(html, /افتح مغامرتي/);
  assert.match(html, /ادخل غرفة الأسرة/);
});

test('التحديث الثانوي مخفي افتراضيًا داخل كشف ولا ينافس قرار الدخول', () => {
  assert.match(html, /<details class="role-release-note">/);
  assert.match(html, /<summary>ما الجديد في جَزَرة؟<\/summary>/);
  assert.doesNotMatch(html, /class="release-banner"/);
  assert.doesNotMatch(html, /<details class="role-release-note" open>/);
});

test('التصميم يعيد تدفق القرارين من شبكة سطح المكتب إلى عمود هاتف ويحتفظ بتركيز مرئي', () => {
  assert.match(css, /\.role-cards\s*\{\s*display:grid;\s*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /@media \(max-width:520px\)[\s\S]*?\.role-cards\s*\{\s*grid-template-columns:1fr/);
  assert.match(css, /\.role-card:focus-visible\s*\{\s*outline:3px solid/);
  assert.match(css, /\.role-card\s*\{\s*min-height:248px/);
});

test('لا يظهر رقم البناء التقني في شاشة الدخول', () => {
  assert.doesNotMatch(app, /querySelector\('\.role-wrap'\)/);
  assert.match(app, /const APP_BUILD = 'BUILD_PLACEHOLDER';/);
});

test('مسار اليوم يعرض مهمة واحدة قابلة للانتقال ولا يقدم الألعاب قبل اكتمال اليوم', () => {
  assert.match(app, /class="today-task-deck"/);
  assert.match(app, /App\.moveTodayTask\(-1\)/);
  assert.match(app, /App\.moveTodayTask\(1\)/);
  assert.match(app, /App\.todayDeckPointerUp\(event\)/);
  assert.match(app, /if \(event\.key === 'ArrowLeft'\).*moveTodayTask\(1\)/);
  assert.doesNotMatch(app, /title: 'ألعاب اليوم'/);
});

test('ورد اليوم مستقل والألعاب والمكتبة ووقت الشاشة توجد في مساحة اختيارية خارج لوحة اليوم', () => {
  assert.match(app, /class="daily-quran" aria-label="ورد اليوم"/);
  assert.match(app, /class="card quiet-choice-space" aria-label="أوقات اختيارية"/);
  assert.match(app, /App\.openGamesHub\(\)[\s\S]*?الألعاب التعليمية/);
  assert.match(app, /App\.openLibrary\(\)[\s\S]*?مكتبتي/);
  assert.match(app, /App\.openScreenTime\(\)[\s\S]*?وقت الشاشة/);
  assert.match(app, /day-complete-card__actions[\s\S]*?App\.shareDayReport\(\)/);
});

test('بطاقات مسار اليوم تحافظ على إتاحة اللمس والتركيز والحركة المخففة', () => {
  assert.match(css, /\.today-task-deck__viewport\s*\{[^}]*touch-action:pan-y/);
  assert.match(css, /\.today-quest--deck:focus-visible\s*\{\s*outline:3px solid/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('نظام أسبوع الأسرة يضيف حزمًا قصيرة ويُبقي المهام القديمة يومية عند غياب الجدولة', () => {
  assert.match(app, /const WEEKLY_FAMILY_PACKS = \[/);
  assert.match(app, /id: 'school_morning'/);
  assert.match(app, /id: 'family_weekend'/);
  assert.match(app, /function taskDueOnDate\(task, date\)/);
  assert.match(app, /return !days\.length \|\| days\.includes\(d\.getDay\(\)\);/);
  assert.match(app, /function scheduledTasksForChild\(child, date = new Date\(\)\)/);
  assert.match(app, /task\.weekDays\.includes\(d\.getDay\(\)\)/);
});

test('إعداد الأسبوع يبقى في أدوات الوالد ويمنح اختيار حزمة أو تخفيف اليوم دون حذف المهام', () => {
  assert.match(app, /weeklyPlanCardHtml\(\)/);
  assert.match(app, /App\.openWeeklyPlan\(\)/);
  assert.match(app, /App\.toggleGentleToday\(\)/);
  assert.match(app, /plan\.gentleDays\[key\] = true/);
  assert.match(app, /child\.tasks\.filter\(task => task\.weeklyPack && task\.weeklyPack !== pack\.id\)\.forEach\(task => \{ task\.retired = true; \}\)/);
  assert.doesNotMatch(app, /kidTab\('weekly-plan'\)/);
});

test('الطفل يرى فقط المهام المستحقة ورسالة إعادة محاولة داعمة يمكنه إقرارها', () => {
  assert.match(app, /const visibleTasks = gentleToday \? \[\] : scheduledTasksForChild\(C\(\), today\);/);
  assert.match(app, /خطة اليوم خفيفة\. خذ وقتًا هادئًا/);
  assert.match(app, /openTryAgainProof\(id\)/);
  assert.match(app, /retryNotes\.push\(\{ id: uid\(\), taskId: p\.taskId/);
  assert.match(app, /dismissRetryNote\(noteId\)/);
  assert.match(app, /class="kid-retry-note" aria-label="رسالة من والدك"/);
});

test('نموذج المهمة يحافظ على بساطة الجدولة بثلاثة خيارات مفهومة', () => {
  assert.match(app, /id="f-week-days"/);
  assert.match(app, /value="daily"/);
  assert.match(app, /value="schooldays"/);
  assert.match(app, /value="weekend"/);
  assert.match(app, /const weekDaysByPreset = \{ daily: \[\], schooldays: \[0, 1, 2, 3, 4\], weekend: \[5, 6\] \};/);
  assert.match(css, /\.weekly-pack-option:hover, \.weekly-pack-option:focus-visible/);
});
