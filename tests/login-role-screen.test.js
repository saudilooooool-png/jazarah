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
