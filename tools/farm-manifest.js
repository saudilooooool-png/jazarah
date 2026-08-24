#!/usr/bin/env node
/* ═══════════════════════════════════════════════════
   فاحص رسومات المزرعة
   يقارن المطلوب في farm/BRIEF.md بالموجود فعلًا، ويتحقق من:
     · وجود كل ملف باسمه الصحيح
     · المقاس المطلوب
     · وجود قناة شفافية حقيقية (وليس خلفية بيضاء)
   ويكتب farm/manifest.json ويطبع تقرير تغطية بالدفعات.

   التشغيل:  node tools/farm-manifest.js
   ═══════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FARM = path.join(ROOT, 'farm');

/* ─── المطلوب: نسخة برمجية من BRIEF.md ─── */
const COLORS = ['brown', 'grey', 'blue', 'gold', 'green'];
const SPEC = [
  // [مجلد, معرّف, عرض, ارتفاع, الدفعة]
  ...['wood', 'stone', 'water', 'light', 'seed']
    .map(id => ['resources', id, 512, 512, 1]),

  ...['home', 'field', 'well', 'barn'].map(id => ['buildings', id, 1024, 1024, 1]),
  ['buildings', 'scaffold', 1024, 1024, 1],
  ['companions', 'egg_brown', 1024, 1024, 1],
  ['land', 'land_farm', 1600, 2400, 1],

  ...['masjid', 'kitchen', 'library', 'fountain', 'mill', 'greenhouse', 'playground', 'gate']
    .map(id => ['buildings', id, 1024, 1024, 2]),
  ...['fx_smoke', 'fx_blades', 'fx_splash'].map(id => ['buildings', id, 512, 512, 2]),

  ...COLORS.flatMap(c => [
    ...(c === 'brown' ? [] : [['companions', `egg_${c}`, 1024, 1024, 3]]),
    ['companions', `baby_${c}`, 1024, 1024, 3],
    ['companions', `grown_${c}`, 1024, 1024, 3],
  ]),

  ...['school', 'mosque', 'market', 'stadium', 'hospital', 'tower']
    .map(id => ['buildings', id, 1024, 1024, 4]),
  ['land', 'land_city', 1600, 2400, 4],
];

const BATCH_NAME = {
  1: '🥇 الأولى — ابدأ بها',
  2: '🥈 الثانية — باقي المزرعة',
  3: '🥉 الثالثة — الرفاق',
  4: '🏙️ الرابعة — المدينة',
};

/* ─── قراءة ترويسة PNG: المقاس ونوع اللون ─── */
function pngInfo(file) {
  const fd = fs.openSync(file, 'r');
  const buf = Buffer.alloc(33);
  fs.readSync(fd, buf, 0, 33, 0);
  fs.closeSync(fd);
  if (buf.toString('binary', 1, 4) !== 'PNG') return null;
  return {
    w: buf.readUInt32BE(16),
    h: buf.readUInt32BE(20),
    // 4 = رمادي+ألفا · 6 = RGBA · غيرهما بلا شفافية
    alpha: [4, 6].includes(buf[25]),
  };
}

/* ─── الفحص ─── */
const rows = SPEC.map(([dir, id, w, h, batch]) => {
  const rel = path.join('farm', dir, id + '.png');
  const abs = path.join(ROOT, rel);
  const row = { id, dir, path: rel, batch, want: `${w}×${h}`, have: false };
  if (!fs.existsSync(abs)) return row;
  row.have = true;
  const info = pngInfo(abs);
  if (!info) { row.issue = 'ليس ملف PNG صالحًا'; return row; }
  row.got = `${info.w}×${info.h}`;
  if (info.w !== w || info.h !== h) row.issue = `المقاس ${row.got} بدل ${row.want}`;
  // الخلفية الشفافة مطلوبة لكل شيء عدا خلفيات الأرض
  else if (!info.alpha && dir !== 'land') row.issue = 'بلا قناة شفافية — الخلفية مطبوعة';
  return row;
});

fs.mkdirSync(FARM, { recursive: true });
fs.writeFileSync(path.join(FARM, 'manifest.json'),
  JSON.stringify({ total: rows.length, ready: rows.filter(r => r.have && !r.issue).length, assets: rows }, null, 2) + '\n');

/* ─── التقرير ─── */
console.log('\n🏡  رسومات مزرعة جزّور\n');
for (const b of [1, 2, 3, 4]) {
  const g = rows.filter(r => r.batch === b);
  const ok = g.filter(r => r.have && !r.issue).length;
  const pct = Math.round(ok / g.length * 100);
  const bar = '█'.repeat(Math.round(pct / 5)).padEnd(20, '·');
  console.log(`  ${BATCH_NAME[b].padEnd(22)} ${bar} ${ok}/${g.length}`);
}

const problems = rows.filter(r => r.have && r.issue);
const missing = rows.filter(r => !r.have);
const ready = rows.filter(r => r.have && !r.issue).length;

console.log(`\n  جاهز: ${ready}/${rows.length}`);
if (problems.length) {
  console.log('\n  ⚠️  ملفات فيها خلل:');
  problems.forEach(r => console.log(`     ${r.path.padEnd(38)} ${r.issue}`));
}
const b1 = missing.filter(r => r.batch === 1);
if (b1.length) console.log(`\n  ناقص من الدفعة الأولى (${b1.length}): ${b1.map(r => r.id).join(' · ')}`);
else if (!problems.length) console.log('\n  ✅ الدفعة الأولى مكتملة — يمكن بدء البناء.');
console.log('');
