/* جَزَرة — عامل الخدمة: تثبيت كتطبيق + عمل كامل دون إنترنت */
'use strict';

const CACHE = 'jazarah-v18';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './audio.js',
  './voice.js',
  './sync.js',
  './farm.js',
  './qrcode.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  // مزرعة جزّور — تعمل دون إنترنت أيضًا
  './farm/land/world_farm_single_plot.webp',
  ...['wood', 'stone', 'water', 'light', 'seed'].map(r => `./farm/resources/${r}.webp`),
  ...['carrot_seedling', 'carrot_growing', 'carrot_ready'].map(c => `./farm/crops/${c}.webp`),
  ...['home_exact', 'barn_exact', 'well', 'barn', 'field'].map(b => `./farm/buildings/${b}.webp`),
  './farm/companions/egg_brown.webp',
  // شخصيات الجزر + حالات جزّور
  ...Array.from({ length: 12 }, (_, i) => `./avatars/c${i + 1}.svg`),
  ...['hero', 'happy', 'thinking', 'wave', 'encourage', 'surprised',
     'excited', 'jump', 'celebrate', 'proud', 'sleep', 'super']
    .map(p => `./avatars/jazzour/${p}.webp`),
  // عبارات جزّور المسجّلة — تعمل دون إنترنت
  ...['cheer', 'done', 'allday', 'levelup', 'stage', 'world', 'boss',
      'hello', 'chest', 'wakeup', 'bye',
      'next', 'keepgoing', 'almost', 'tryagain', 'wrong', 'right',
      'heart', 'sent', 'approved',
      'quran_start', 'quran_done', 'surah_done',
      'game_start', 'shop', 'buy', 'notenough',
      'screen_start', 'screen_end',
      'poke1', 'poke2', 'poke3', 'poke4', 'poke5', 'drag1', 'drag2', 'drag3',
      'story_new', 'story_wait', 'birthday', 'mypick']
    .map(id => `./audio/prompts/ar/${id}.mp3`),
  // العبارات الملحقة والمجموعات المعدودة (٨ عوالم + ٣٨ سورة)
  ...['focus_end', 'world_enter', 'proud', 'task_next', 'reward_line']
    .map(id => `./audio/prompts/ar/${id}.mp3`),
  ...Array.from({ length: 8 }, (_, i) => `./audio/prompts/ar/w_${i}.mp3`),
  ...[1, 114, 113, 112, 111, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101,
      100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83,
      82, 81, 80, 79, 78].map(n => `./audio/prompts/ar/sura_${n}.mp3`),
  // المصحف يُخزن تلقائيًا عند أول فتح لركن القرآن (ملف كبير — لا يُحمل مسبقًا)
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;                    // طلبات المزامنة تمر مباشرة
  if (url.hostname.endsWith('.supabase.co')) return;         // السحابة دائمًا من الشبكة

  // الشبكة أولًا لملفات التطبيق: التحديثات تصل فورًا، والمخزن احتياط بلا إنترنت
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && (url.origin === location.origin || url.hostname.includes('fonts.g'))) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() =>
      // الأصوات تُطلب بلاحقة ?v= لكسر كاش المتصفح، والمخزَّن بلا لاحقة —
      // ignoreSearch يجعلهما يتطابقان فتعمل الأصوات دون إنترنت
      caches.match(e.request, { ignoreSearch: true })
    )
  );
});
