const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

/* المزرعة ٢: كل مهمة = صندوق، وكل صندوق يُفتح يكبّر كل شيء خطوة.
   الحاضنة تنمو بأيام مكتملة (حجم خطة الطفل) لا بعدد مطلق. */

function loadFarm() {
  let currentDay = '2030-04-01';
  let activeChild = null;
  const sandbox = {
    console,
    window: {},
    document: { getElementById: () => null },
    todayKey: () => currentDay,
    uid: (() => { let n = 0; return () => `id-${++n}`; })(),
    C: () => activeChild,
    save: () => {},
    setTimeout: cb => { cb(); return 0; },
    App: { toast: () => {}, kidTab: () => {}, refreshKidHeader: () => {}, jzSrc: () => 'about:blank' },
    VoiceLines: { say: () => {} },
    feedPush: () => {},
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'farm.js'), 'utf8'), sandbox, { filename: 'farm.js' });
  const farm = sandbox.window.JazarahFarm;
  return { farm, setDay: d => { currentDay = d; }, setChild: c => { activeChild = c; } };
}

const serial = v => JSON.parse(JSON.stringify(v));

function kid(farm, planSize = 3) {
  return {
    id: 'kid', name: 'سلمان',
    tasks: Array.from({ length: planSize }, (_, i) => ({ id: `t${i}`, cat: ['study', 'health', 'sport'][i % 3], title: `مهمة ${i}` })),
    completions: {}, pendingProofs: [], coins: 0,
    farm: farm.blank(),
  };
}

/* يُنجز مهمة ويفتح صندوقها — كما يفعل الطفل */
function doTask(farm, child, i, day = '2030-04-01') {
  const t = child.tasks[i % child.tasks.length];
  const box = farm.taskDone(child, { ...t, id: `${t.id}@${day}#${i}` }, day, false);
  return farm.claim(child, box.id);
}

test('الترحيل لا يمس أي شيء موجود، والرفيق الذي فقس سابقًا ينتقل للحاضنة', () => {
  const { farm } = loadFarm();
  const child = kid(farm);
  const old = {
    res: { wood: 4, stone: 2, water: 1, light: 5, seed: 7 },
    crops: farm.CELLS.map((_, i) => (i === 0 ? { stage: 'ready' } : { stage: 'empty' })),
    built: { 1: 'egg', 3: 'well' },
    daily: { lastVisitDate: '2030-03-31', lastVisitAt: 99, events: [] },
    companion: { stage: 'baby', harvestCount: 3 },
  };
  child.farm = serial(old);
  const f = farm.of(child);
  assert.deepEqual(serial(f.res), old.res);
  assert.deepEqual(serial(f.crops), serial(old.crops));
  assert.deepEqual(serial(f.built), old.built);
  assert.deepEqual(serial(f.companion), old.companion);          // لا نحذف بيانات قديمة
  assert.equal(f.incubator.stage, 'baby');                       // ولا يضيع رفيق فقس
  assert.deepEqual(serial(f.boxes), []);
  assert.equal(f.v, 2);
});

test('أول صندوق فيه بيضة، وتفقس حين يكتمل يوم الطفل — لا قبله', () => {
  const { farm } = loadFarm();
  const child = kid(farm, 3);
  const r1 = doTask(farm, child, 0);
  assert.ok(r1.gains.some(g => g.kind === 'egg'));
  assert.equal(child.farm.incubator.stage, 'egg');
  doTask(farm, child, 1);
  assert.equal(child.farm.incubator.stage, 'egg');               // يومه لم يكتمل بعد
  const r3 = doTask(farm, child, 2);
  assert.equal(child.farm.incubator.stage, 'baby');
  assert.ok(r3.events.some(e => e.kind === 'hatch'));
});

test('خطة المهمة الواحدة تفقس في يومها الأول أيضًا — الأسر متساوية', () => {
  const { farm } = loadFarm();
  const child = kid(farm, 1);
  const r = doTask(farm, child, 0);
  assert.ok(r.events.some(e => e.kind === 'hatch'));
});

test('الصغير يكبر بعد أربعة أيام مكتملة، يخرج للمزرعة، وتأتي بيضة جديدة', () => {
  const { farm } = loadFarm();
  const child = kid(farm, 3);
  for (let i = 0; i < 3; i++) doTask(farm, child, i);           // يوم ١: فقس
  let grown = null;
  for (let i = 3; i < 15; i++) {                                 // ٤ أيام × ٣ مهام
    const r = doTask(farm, child, i);
    if (r.events.some(e => e.kind === 'grown')) grown = i;
  }
  assert.equal(grown, 14);
  assert.equal(child.farm.residents.length, 1);
  assert.equal(child.farm.incubator, null);
  const next = doTask(farm, child, 15);
  assert.ok(next.gains.some(g => g.kind === 'egg'));             // البيضة لا تأتي بالحظ
});

test('صندوق موافقة الوالد: مقفل لا يُفتح، ثم ينفتح عند الاعتماد، ويختفي عند الرفض', () => {
  const { farm } = loadFarm();
  const child = kid(farm);
  const t = { id: 'move', cat: 'sport', title: 'حركة' };
  const box = farm.addLockedBox(child, t, '2030-04-01', 'parent');
  assert.equal(farm.openable(child).length, 0);
  assert.equal(farm.claim(child, box.id), null);
  farm.taskDone(child, t, '2030-04-01', true);
  assert.equal(farm.openable(child).length, 1);
  assert.equal(farm.openable(child)[0].contents.res, 'stone');

  const t2 = { id: 'photo', cat: 'study', title: 'واجب' };
  farm.addLockedBox(child, t2, '2030-04-01', 'photo');
  farm.dropLockedBox(child, 'photo', '2030-04-01');
  assert.equal(farm.lockedBoxes(child).length, 0);
});

test('لا صندوق فارغ، وكل خامس صندوق مميز مضمون مهما ساء الحظ', () => {
  const { farm } = loadFarm();
  farm._rand = () => 0.99;                                       // أسوأ حظ ممكن
  const child = kid(farm, 3);
  const tiers = [];
  for (let i = 0; i < 10; i++) {
    const r = doTask(farm, child, i);
    assert.ok(r.gains.some(g => g.kind === 'res'));
    assert.ok(r.gains.some(g => g.kind === 'seed' || g.kind === 'gold'));
    tiers.push(r.box.contents.tier);
  }
  assert.deepEqual(tiers.map(t => t !== 'common'), [false, false, false, false, true, false, false, false, false, true]);
});

test('كل صندوق يُفتح يكبّر المزروع مرحلة: بذرة ← نبتة ← ناضجة', () => {
  const { farm } = loadFarm();
  const child = kid(farm, 3);
  child.farm.crops[0] = { stage: 'seed' };
  doTask(farm, child, 0);
  assert.equal(child.farm.crops[0].stage, 'growing');
  doTask(farm, child, 1);
  assert.equal(child.farm.crops[0].stage, 'ready');
});

test('صندوق الورد الذهبي مرة واحدة في اليوم، وفيه نور', () => {
  const { farm } = loadFarm();
  const child = kid(farm);
  const a = farm.quranBox(child, '2030-04-01');
  const b = farm.quranBox(child, '2030-04-01');
  assert.equal(a, b);
  assert.equal(a.color, 'gold');
  assert.equal(a.contents.res, 'light');
});

test('رسومات المرحلة الأولى موجودة بصيغة التطبيق', () => {
  const root = path.join(__dirname, '..', 'farm');
  for (const f of ['objects/incubator.webp', 'objects/task_board.webp', 'companions/grown_brown.webp',
    'companions/egg_brown.webp', 'companions/baby_brown.webp',
    ...['brown', 'grey', 'blue', 'gold', 'green'].map(c => `objects/box_${c}.webp`)]) {
    assert.ok(fs.existsSync(path.join(root, f)), f);
  }
});
