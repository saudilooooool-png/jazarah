/* جَزَرة — عامل الخدمة: تثبيت كتطبيق + عمل كامل دون إنترنت */
'use strict';

const CACHE = 'jazarah-v14';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './audio.js',
  './sync.js',
  './qrcode.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
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
    }).catch(() => caches.match(e.request))
  );
});
