#!/usr/bin/env node
/* ═══════════════════════════════════════════════════
   مولّد قائمة أصوات جزّور
   يقرأ السجل الوحيد (voice.js) ويستخرج كل عبارة يحتاجها التطبيق،
   ويوسّع المجموعات المعدودة (العوالم، السور) إلى ملفات مستقلة،
   ثم يقارنها بالملفات الموجودة ويخرج:

     audio/manifest.json  — القائمة الكاملة بحالة كل ملف
     audio/to-record.csv  — الناقص فقط: id,text  (يُلصق في أداة التوليد)

   التشغيل:  node tools/voice-manifest.js
   ═══════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const CLIPS = path.join(ROOT, 'audio', 'prompts', 'ar');

/* ─── تحميل السجل والبيانات المعدودة من مصادرها الحقيقية ─── */
function load() {
  const sandbox = { window: {}, console };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);

  // العوالم وترتيب سور الأطفال من app.js — دون تشغيل التطبيق كاملًا
  const app = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const worlds = app.match(/const WORLDS = \[([\s\S]*?)\n\];/);
  const order = app.match(/KIDS_QURAN_ORDER: \[([\s\S]*?)\]/);
  vm.runInContext(`const WORLDS = [${worlds ? worlds[1] : ''}];`, sandbox);
  const kidsOrder = order
    ? order[1].split(',').map(s => parseInt(s.trim(), 10)).filter(Number.isFinite)
    : [];

  // أسماء السور من quran.js (ملف كبير — نقرأ الأسماء فقط)
  const quran = fs.readFileSync(path.join(ROOT, 'quran.js'), 'utf8');
  const names = [...quran.matchAll(/"n":"([^"]+)"/g)].map(m => m[1]);

  vm.runInContext(fs.readFileSync(path.join(ROOT, 'voice.js'), 'utf8'), sandbox);
  const V = sandbox.window.VoiceLines;

  V.SETS.world.items = vm.runInContext('WORLDS', sandbox)
    .map((w, i) => ({ key: String(i), text: w.name }));
  V.SETS.surah.items = kidsOrder
    .filter(n => names[n - 1])
    .map(n => ({ key: String(n), text: 'سورة ' + names[n - 1] }));
  return V;
}

/* ─── التنفيذ ─── */
const V = load();
const all = V.manifest();
const have = new Set(
  fs.existsSync(CLIPS) ? fs.readdirSync(CLIPS).filter(f => f.endsWith('.mp3')).map(f => f.slice(0, -4)) : []
);

const rows = all.map(m => ({ ...m, have: have.has(m.id) }));
const missing = rows.filter(r => !r.have);
const extra = [...have].filter(id => !all.some(m => m.id === id));

fs.writeFileSync(path.join(ROOT, 'audio', 'manifest.json'),
  JSON.stringify({
    identity: 'jazour-v1',
    generated_from: 'voice.js',
    total: rows.length,
    recorded: rows.length - missing.length,
    missing: missing.length,
    lines: rows,
  }, null, 2) + '\n', 'utf8');

const csv = 'id,text\n' + missing.map(m => `${m.id},"${m.text.replace(/"/g, '""')}"`).join('\n') + '\n';
fs.writeFileSync(path.join(ROOT, 'audio', 'to-record.csv'), csv, 'utf8');

/* ─── التقرير ─── */
const byKind = {};
rows.forEach(r => {
  byKind[r.set || r.kind] = byKind[r.set || r.kind] || { t: 0, h: 0 };
  byKind[r.set || r.kind].t++;
  if (r.have) byKind[r.set || r.kind].h++;
});

console.log('\n🎙️  تغطية صوت جزّور — الهوية jazour-v1\n');
for (const [k, v] of Object.entries(byKind)) {
  const pct = Math.round(v.h / v.t * 100);
  const bar = '█'.repeat(Math.round(pct / 5)).padEnd(20, '·');
  console.log(`  ${k.padEnd(8)} ${bar} ${v.h}/${v.t}  (${pct}%)`);
}
console.log(`\n  الإجمالي: ${rows.length - missing.length}/${rows.length} مسجّلة`);
if (missing.length) {
  console.log(`  ناقص ${missing.length}: ${missing.slice(0, 8).map(m => m.id).join(' · ')}${missing.length > 8 ? ' …' : ''}`);
  console.log('  ← القائمة الكاملة في audio/to-record.csv');
}
if (extra.length) console.log(`  ملفات بلا استخدام (${extra.length}): ${extra.join(' · ')}`);
console.log('');
