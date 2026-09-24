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
  // البيضة التالية تفضّل لونًا لم يكبر بعد: صندوق الدراسة (بني) يمر، وصندوق الصحة يحملها زرقاء
  const same = doTask(farm, child, 15);
  assert.ok(!same.gains.some(g => g.kind === 'egg'));
  const next = doTask(farm, child, 16);
  assert.ok(next.gains.some(g => g.kind === 'egg' && g.kin === 'blue'));   // البيضة لا تأتي بالحظ
});

test('من يكرر روتينًا بلون واحد لا تبقى حاضنته فارغة أكثر من يوم كامل', () => {
  const { farm, setDay } = loadFarm();
  const child = kid(farm, 1);                                    // مهمة دراسة واحدة
  for (let d = 1; d <= 5; d++) { setDay(`2030-04-0${d}`); doTask(farm, child, 0, `2030-04-0${d}`); }
  assert.equal(child.farm.residents.length, 1);
  assert.equal(child.farm.incubator, null);
  // اللون الوحيد في الخطة كبر: البيضة تأتي في صندوقه
  setDay('2030-04-06');
  const r = doTask(farm, child, 0, '2030-04-06');
  assert.ok(r.gains.some(g => g.kind === 'egg' && g.kin === 'brown'));
});

test('ينتظر يومًا واحدًا فقط حين يكون في الخطة لون جديد لم يُنجَز', () => {
  const { farm } = loadFarm();
  const child = kid(farm, 3);
  child.farm.album.kin.brown = { egg: true, baby: true, grown: true };
  child.farm.emptySince = '2030-04-01';
  const t = child.tasks[0];                                      // دراسة = بني
  const b1 = farm.taskDone(child, { ...t, id: 'a' }, '2030-04-02', false);
  assert.equal(b1.contents.egg, false);                          // أمس فرغت: ننتظر الصحة أو الرياضة
  farm.claim(child, b1.id);
  const b2 = farm.taskDone(child, { ...t, id: 'b' }, '2030-04-03', false);
  assert.equal(b2.contents.egg, true);                           // مضى يوم كامل: تأتي على أي حال
});

test('الزينة: إكمال صفحة يفتح زينة مرة واحدة، ومن يستحقها قبل التحديث يجدها', () => {
  const { farm } = loadFarm();
  const child = kid(farm, 3);
  for (let i = 0; i < 15; i++) doTask(farm, child, i);           // أول رفيق كبر
  assert.ok(child.farm.decor.flowers);
  assert.deepEqual(serial(child.farm.decorNew), ['flowers']);
  doTask(farm, child, 16);
  assert.deepEqual(serial(child.farm.decorNew), ['flowers']);    // لا تكرار
  // صفحة المحاصيل: الأربعة + الذهبية
  const f = child.farm;
  ['carrot', 'strawberry', 'pumpkin', 'grape'].forEach(c => farm._seeCrop(f, c));
  assert.deepEqual(serial(farm._checkDecor(f)), []);
  farm._seeCrop(f, 'carrot', { gold: true });
  assert.deepEqual(serial(farm._checkDecor(f)), ['scarecrow']);
  // أسرة قديمة: رفيق بالغ قبل التحديث
  const old = kid(farm, 3);
  old.farm = serial({ ...farm.blank(), residents: [{ kind: 'brown' }], album: { kin: { brown: { egg: true, baby: true, grown: true } }, crops: {} } });
  delete old.farm.decor; delete old.farm.decorNew;
  farm.of(old);
  assert.ok(old.farm.decor.flowers);
});

test('المباني بمواد من أي نوع: تُدفع من المفضل أولًا والبذور آخرًا', () => {
  const { farm } = loadFarm();
  const f = farm.blank();
  const well = farm.CATALOG.find(x => x.id === 'well');
  f.res = { wood: 3, stone: 0, water: 1, light: 0, seed: 2 };
  assert.equal(farm.can(f, well), true);                          // ٦ ≥ ٥ ولو بلا حجر
  farm.spend(f, well);
  assert.deepEqual(serial(f.res), { wood: 0, stone: 0, water: 0, light: 0, seed: 1 });
  assert.equal(farm.can(f, well), false);
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
    assert.ok(r.gains.some(g => g.kind === 'seed' || g.kind === 'gold' || g.kind === 'special'));
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

test('كل رسمة يطلبها التطبيق موجودة بصيغته — الرفاق الخمسة والمحاصيل والصناديق', () => {
  const { farm } = loadFarm();
  const root = path.join(__dirname, '..');
  const files = ['farm/objects/incubator.webp', 'farm/objects/task_board.webp', farm.GOLD_READY,
    ...['brown', 'grey', 'blue', 'gold', 'green'].map(c => `farm/objects/box_${c}.webp`)];
  Object.values(farm.KIN).forEach(k => files.push(k.egg, k.baby, k.grown));
  Object.values(farm.CROPS).forEach(c => files.push(c.growing, c.ready));
  for (const f of files) assert.ok(fs.existsSync(path.join(root, f)), f);
  assert.equal(Object.keys(farm.KIN).length, 5);
});

test('البيضة بلون الصندوق الذي جاء فيها: مهمة حركة ← رفيق الحجر', () => {
  const { farm } = loadFarm();
  const child = kid(farm, 3);
  const box = farm.taskDone(child, { id: 'run', cat: 'sport', title: 'جري' }, '2030-04-01', false);
  const r = farm.claim(child, box.id);
  assert.equal(r.gains.find(g => g.kind === 'egg').kin, 'grey');
  assert.equal(child.farm.incubator.kind, 'grey');
  assert.ok(child.farm.album.kin.grey.egg);
});

test('صندوق «مميز» يحمل بذرة محصول جديد، وحصادها يعيد بذرة من نوعها ويسجل في الدفتر', () => {
  const { farm } = loadFarm();
  const seq = [0.1, 0.0];               // ٠٫١ يقع في مدى «مميز»، ثم أول محصول في القائمة (فراولة)
  farm._rand = () => (seq.length ? seq.shift() : 0.99);
  const child = kid(farm, 3);
  const r = doTask(farm, child, 0);
  assert.equal(r.box.contents.tier, 'uncommon');
  assert.equal(r.gains.find(g => g.kind === 'special').crop, 'strawberry');
  assert.equal(child.farm.special.strawberry, 1);

});

test('الزرع بنوع مختار، والحصاد بقيمة نوعه', () => {
  const runtime = loadFarm();
  const { farm } = runtime;
  const child = kid(farm, 3);
  child.coins = 0;
  runtime.setChild(child);
  child.farm.special.pumpkin = 1;
  farm.plantKind(3, 'pumpkin');
  assert.deepEqual(serial(child.farm.crops[3]), { stage: 'seed', kind: 'pumpkin' });
  assert.equal(child.farm.special.pumpkin, 0);
  child.farm.crops[3].stage = 'ready';
  farm.harvest(3, { classList: { add() {} } });
  assert.equal(child.coins, farm.CROPS.pumpkin.coins);
  assert.equal(child.farm.special.pumpkin, 1);                 // البذرة تعود من نوعها
  assert.equal(child.farm.album.crops.pumpkin.n, 1);
});

test('الدفتر يعدّ الاكتشافات، ومن سبق يرى ما عنده مكتشفًا أصلًا', () => {
  const { farm } = loadFarm();
  const child = kid(farm);
  child.farm = serial({ ...farm.blank(), album: undefined, residents: [{ kind: 'brown', at: 1 }], incubator: { kind: 'blue', stage: 'baby', days: 0 } });
  delete child.farm.album;
  farm.of(child);
  const a = child.farm.album;
  assert.ok(a.kin.brown.egg && a.kin.brown.baby && a.kin.brown.grown);
  assert.ok(a.kin.blue.egg && a.kin.blue.baby && !a.kin.blue.grown);
  const { got, total } = farm.albumCount(child);
  assert.equal(got, 5);
  assert.equal(total, 5 * 3 + 4 * 2 + 1);
});
