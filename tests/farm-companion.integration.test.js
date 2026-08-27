const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadFarm() {
  let currentDay = '2030-04-01';
  let activeChild = null;
  let saveCalls = 0;
  const toastMessages = [];
  const sandbox = {
    console,
    window: {},
    document: { getElementById: () => null },
    todayKey: () => currentDay,
    uid: (() => { let sequence = 0; return () => `event-${++sequence}`; })(),
    C: () => activeChild,
    save: () => { saveCalls += 1; },
    setTimeout: callback => { callback(); return 0; },
    App: {
      toast: message => toastMessages.push(message),
      kidTab: () => {},
      refreshKidHeader: () => {},
      resolveFarmImpact: () => {},
      jzSrc: () => 'about:blank',
    },
    VoiceLines: { say: () => {} },
    feedPush: () => {},
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'farm.js'), 'utf8'), sandbox, { filename: 'farm.js' });
  return {
    farm: sandbox.window.JazarahFarm,
    setDay: day => { currentDay = day; },
    setChild: child => { activeChild = child; },
    saveCalls: () => saveCalls,
    toasts: () => toastMessages,
  };
}

function serial(value) {
  return JSON.parse(JSON.stringify(value));
}

function currentChild(farm, overrides = {}) {
  const child = {
    id: 'child-current',
    name: 'لمى',
    identityStyle: 'heroine',
    routines: [{ id: 'routine-1', title: 'صباح هادئ' }],
    completions: { 'task-1': { status: 'done' } },
    farm: farm.blank(),
    ...overrides,
  };
  return child;
}

test('ترحيل رفيق الحظيرة يحافظ على بيانات الطفل والمزرعة الحالية كما هي', () => {
  const { farm } = loadFarm();
  const child = currentChild(farm);
  child.farm.res = { wood: 4, stone: 2, water: 1, light: 5, seed: 7 };
  child.farm.crops = child.farm.crops.map((crop, index) => index === 0 ? { stage: 'ready' } : index === 1 ? { stage: 'growing', wateredAt: 17 } : crop);
  child.farm.built = { 1: 'egg', 3: 'well' };
  child.farm.daily = { lastVisitDate: '2030-03-31', lastVisitAt: 99, events: [{ id: 'old', emoji: '🌱', text: 'زرعت بذرة', date: '2030-03-31', at: 99 }] };
  const before = serial({ name: child.name, identityStyle: child.identityStyle, routines: child.routines, completions: child.completions, res: child.farm.res, crops: child.farm.crops, built: child.farm.built, daily: child.farm.daily });

  const migratedFarm = farm.of(child);
  const companion = farm.companion(migratedFarm);

  assert.deepEqual(serial({ name: child.name, identityStyle: child.identityStyle, routines: child.routines, completions: child.completions, res: migratedFarm.res, crops: migratedFarm.crops, built: migratedFarm.built, daily: migratedFarm.daily }), before);
  assert.deepEqual(serial(companion), { stage: 'egg', harvestCount: 0, harvestInviteDate: null, greetingDate: null, hatchReadyAt: null, hatchedAt: null, lastGreetedAt: null });
});

test('ملف طفل سابق للرفيق يكتسب الحقول الناقصة من دون إعادة ضبط مزرعته', () => {
  const { farm } = loadFarm();
  const child = currentChild(farm);
  child.farm.res.seed = 9;
  child.farm.built = { 0: 'egg' };
  child.farm.companion = { stage: 'egg' };

  const companion = farm.companion(farm.of(child));

  assert.equal(child.farm.res.seed, 9);
  assert.deepEqual(serial(child.farm.built), { 0: 'egg' });
  assert.equal(companion.harvestCount, 0);
  assert.equal(companion.hatchedAt, undefined);
  assert.equal(farm.companionMoment(child.farm).state, 'resting');
});

test('الحصادات الحقيقية عبر أيام مختلفة تفتح الفقس مرة واحدة فقط', () => {
  const runtime = loadFarm();
  const { farm } = runtime;
  const child = currentChild(farm);
  child.farm.built = { 0: 'egg' };
  runtime.setChild(child);

  runtime.setDay('2030-04-01');
  farm.inviteCompanionAfterHarvest(child.farm);
  runtime.setDay('2030-04-02');
  farm.inviteCompanionAfterHarvest(child.farm);
  runtime.setDay('2030-04-03');
  farm.inviteCompanionAfterHarvest(child.farm);

  assert.equal(child.farm.companion.harvestCount, 3);
  assert.ok(child.farm.companion.hatchReadyAt);
  assert.equal(farm.companionMoment(child.farm).state, 'ready');
  const eventsBeforeExtraHarvest = child.farm.daily.events.length;
  runtime.setDay('2030-04-04');
  farm.inviteCompanionAfterHarvest(child.farm);
  assert.equal(child.farm.companion.harvestCount, 3);
  assert.equal(child.farm.daily.events.length, eventsBeforeExtraHarvest);
});

test('الفقس لا يحدث قبل المعلم ويحفظ رفيقًا صغيرًا عبر إعادة التحميل', () => {
  const runtime = loadFarm();
  const { farm } = runtime;
  const child = currentChild(farm);
  child.farm.built = { 0: 'egg' };
  child.farm.res = { wood: 2, stone: 1, water: 3, light: 4, seed: 5 };
  runtime.setChild(child);

  farm.hatchCompanion();
  assert.equal(child.farm.companion.stage, 'egg');
  assert.equal(runtime.saveCalls(), 0);

  child.farm.companion.harvestCount = farm.COMPANION.HATCH_HARVEST_GOAL;
  farm.hatchCompanion();
  const hatchedAt = child.farm.companion.hatchedAt;
  const resourcesAfterHatch = serial(child.farm.res);
  assert.equal(child.farm.companion.stage, 'baby');
  assert.ok(hatchedAt);
  assert.equal(runtime.saveCalls(), 1);
  assert.deepEqual(serial(child.farm.res), resourcesAfterHatch);

  const reloaded = serial(child);
  runtime.setChild(reloaded);
  assert.equal(farm.companion(farm.of(reloaded)).stage, 'baby');
  assert.equal(farm.companionMoment(reloaded.farm).state, 'baby');
  farm.hatchCompanion();
  assert.equal(reloaded.farm.companion.hatchedAt, hatchedAt);
  assert.equal(runtime.saveCalls(), 1);
});

test('يظل أصل الرفيق الصغير متاحًا للمشهد بعد الفقس', () => {
  assert.equal(fs.existsSync(path.join(__dirname, '..', 'farm', 'companions', 'baby_brown.png')), true);
});
