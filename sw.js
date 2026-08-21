/* جَزَرة — عامل الخدمة: تثبيت كتطبيق + عمل كامل دون إنترنت */
'use strict';

const CACHE = 'jazarah-v12';
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
  ...['happy', 'curious', 'sleepy', 'surprised', 'excited'].map(m => `./avatars/jazzour-${m}.svg`),
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
