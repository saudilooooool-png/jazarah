#!/usr/bin/env python3
# ═══════════════════════════════════════════════════
#  ضاغط رسومات المزرعة
#  يحوّل farm/**/*.png إلى WebP بمقاسات العرض الفعلية.
#  الأصول تبقى كما هي (مرجعًا)، والتطبيق يقرأ .webp فقط.
#
#  التشغيل:  python3 tools/farm-optimize.py
# ═══════════════════════════════════════════════════
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..')
FARM = os.path.join(ROOT, 'farm')

# مجلد → (أقصى عرض, الجودة)  ·  المباني تُعرض بعرض ≤180 على شاشة ×3
SPEC = {
    'buildings':  (512, 82),
    'companions': (512, 82),
    'resources':  (128, 86),
    'land':       (900, 78),
}

total_in = total_out = 0
rows = []

for folder, (maxw, q) in SPEC.items():
    d = os.path.join(FARM, folder)
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        if not f.endswith('.png'):
            continue
        src = os.path.join(d, f)
        dst = src[:-4] + '.webp'
        im = Image.open(src)
        if im.width > maxw:
            im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
        # الأرض بلا شفافية — نحوّلها RGB لتصغير أكبر
        if folder == 'land':
            im = im.convert('RGB')
        else:
            im = im.convert('RGBA')
        im.save(dst, 'WEBP', quality=q, method=6)
        a, b = os.path.getsize(src), os.path.getsize(dst)
        total_in += a
        total_out += b
        rows.append((f'{folder}/{f[:-4]}.webp', im.width, im.height, a, b))

print('\n📦  ضغط رسومات المزرعة\n')
for name, w, h, a, b in rows:
    print(f'  {name:<34} {w:>4}×{h:<4}  {a/1024:>7.0f}KB → {b/1024:>6.0f}KB  (-{100-b*100/a:.0f}%)')
print(f'\n  الإجمالي: {total_in/1024/1024:.2f}MB → {total_out/1024:.0f}KB'
      f'  (-{100-total_out*100/max(total_in,1):.0f}%)\n')
