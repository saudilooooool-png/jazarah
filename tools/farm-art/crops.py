"""المحاصيل الجديدة: فراولة · يقطين · عنب (مرحلتا «تكبر» و«ناضجة») + الجزرة الذهبية.
كل نبتة تُرسم بمحرك الطين ثم تُغرس في تلة التربة الأصلية المأخوذة من رسمة الجزر
(soil_mound.png)، فيبقى الحقل كله على أرض واحدة."""
import os, sys
import numpy as np
from PIL import Image, ImageFilter
from clay import *

HERE = os.path.dirname(__file__)
LEAF = hexrgb('#62ad3a'); LEAF2 = hexrgb('#4f9a2e'); STEM = hexrgb('#5b9a34')
BERRY = hexrgb('#e3342f'); PUMP = hexrgb('#f08a24'); GRAPE = hexrgb('#7b4ca8'); WOOD = hexrgb('#a8703c')
BX, BY = CX, 1760      # قاعدة النبتة داخل قماشها


def lobed(cx, cy, r, n=5, ang0=-np.pi / 2, spread=0.62):
    """ورقة مفصّصة (يقطين/عنب): اتحاد دوائر حول مركز"""
    ms = [mask(ellipse(cx, cy, r * 0.62, r * 0.62))]
    for k in range(n):
        a = ang0 + (k - (n - 1) / 2) * spread
        ms.append(mask(ellipse(cx + np.cos(a) * r * 0.52, cy + np.sin(a) * r * 0.52, r * 0.44, r * 0.44)))
    return union(*ms)


def veins(c, base, tips, m, col, w=6):
    for t in tips:
        c.flat(blur(mask(stroke([base, t], w)) * m, 2), col, 0.45)


def trifoliate(c, x, y, ang, size, col):
    """ثلاث وريقات (فراولة) على طرف ساق"""
    for d in (-0.62, 0, 0.62):
        a = ang + d
        tip = (x + np.cos(a) * size, y + np.sin(a) * size)
        lm = mask(poly(leaf_pts((x, y), tip, size * 0.62)))
        c.occlude(lm, dx=4, dy=10, r=10, strength=0.3)
        c.paint(lm, col * (1.04 if d == 0 else 0.97), radius=22, depth=1.0, spec=0.3)
        c.flat(blur(mask(stroke([(x, y), tip], 6)) * lm, 2), col * 1.35, 0.4)
        # تسنين خفيف على الحافة
        for t in np.linspace(0.25, 0.85, 4):
            px, py = x + (tip[0] - x) * t, y + (tip[1] - y) * t
            nx, ny = -np.sin(a), np.cos(a)
            for sgn in (-1, 1):
                w = size * 0.62 * 0.5 * np.sin(np.pi * t ** 0.85) * 0.98
                c.flat(blur(mask(ellipse(px + nx * w * sgn, py + ny * w * sgn, 9, 9)), 2) * lm, col * 0.78, 0.35)


def stems(c, pts, w=26):
    for p in pts:
        sm = mask(stroke(bezier((BX, BY), ((BX + p[0]) / 2, BY - 120), p, n=30), w))
        c.paint(sm, STEM, radius=10, depth=1.0, spec=0.25)


def strawberry(stage):
    c = Canvas()
    # شجيرة ممتلئة قصيرة كجيرانها في الحقل
    heads = [(640, 1210, -2.4), (820, 1030, -2.0), (1024, 960, -1.57), (1228, 1030, -1.14), (1408, 1210, -0.74),
             (860, 1340, -2.7), (1190, 1340, -0.45)]
    stems(c, [(x, y) for x, y, _ in heads], w=30)
    for x, y, a in heads:
        trifoliate(c, x, y, a, 300, LEAF if -1.9 < a < -1.2 else LEAF2)
    if stage == 'growing':
        fx, fy = 1180, 1120
        for k in range(5):
            a = -np.pi / 2 + k * 2 * np.pi / 5
            pm = mask(ellipse(fx + np.cos(a) * 58, fy + np.sin(a) * 50, 50, 44))
            c.paint(pm, hexrgb('#fffaf0'), radius=16, depth=1.0, spec=0.3)
        c.paint(mask(ellipse(fx, fy, 30, 28)), hexrgb('#f4c534'), radius=12, depth=1.2, spec=0.4)
    else:
        for bx, by, s in ((820, 1330, 1.0), (1060, 1400, 1.12), (1290, 1320, 0.95)):
            c.paint(mask(stroke(bezier((BX, BY - 200), (bx, by - 300), (bx, by - 120), n=20), 14)), STEM, radius=6, depth=1, spec=0.2)
            bm = mask(poly(carrot_pts((bx, by - 110 * s), (bx + 6, by + 170 * s), 230 * s)))
            c.occlude(bm, dx=6, dy=16, r=18, strength=0.4)
            c.paint(bm, BERRY, radius=48, depth=1.1, spec=0.7, shin=34)
            rng = np.random.default_rng(int(bx))
            for _ in range(22):
                sx = bx + rng.uniform(-80, 80) * s; sy = by + rng.uniform(-60, 120) * s
                c.flat(mask(ellipse(sx, sy, 6, 9)) * bm, hexrgb('#ffe27a'), 0.9)
            for k in range(5):
                a = -np.pi / 2 + (k - 2) * 0.55
                cal = mask(poly(leaf_pts((bx, by - 110 * s), (bx + np.cos(a + np.pi) * -70 * s * (1 if k % 2 else 0.8), by - 110 * s - 40 * s + abs(k - 2) * 26 * s), 44 * s)))
                c.paint(cal, LEAF2, radius=10, depth=1.0, spec=0.3)
    return c


def pumpkin(stage):
    c = Canvas()
    tendril = [(BX + 20 + 110 * np.cos(t) * (1 - t / 14), 1300 + 110 * np.sin(t) * (1 - t / 14)) for t in np.linspace(0, 11, 80)]
    c.paint(mask(stroke(tendril, 12)), STEM, radius=6, depth=1, spec=0.25)
    for cx, cy, r, ang in ((700, 1180, 330, -2.0), (1370, 1160, 320, -1.1), (1030, 900, 300, -1.57)):
        stems(c, [(cx, cy)], w=30)
        lm = lobed(cx, cy, r, 5, ang, 0.66)
        c.occlude(lm, dx=6, dy=14, r=16, strength=0.35)
        c.paint(lm, LEAF if cy < 1000 else LEAF2, radius=40, depth=1.0, spec=0.3)
        veins(c, (cx, cy + r * 0.1), [(cx + np.cos(ang + d) * r * 0.85, cy + np.sin(ang + d) * r * 0.85) for d in (-1.2, -0.6, 0, 0.6, 1.2)], lm, LEAF * 1.35)
    if stage == 'growing':
        pm = union(*[mask(ellipse(BX + dx, 1560, 95 + (0 if dx == 0 else -20), 110)) for dx in (-60, 0, 60)])
        c.occlude(pm, dx=6, dy=14, r=16, strength=0.4)
        c.paint(pm, hexrgb('#7fbf45'), radius=40, depth=1.1, spec=0.45)
    else:
        ribs = [mask(ellipse(BX + dx, 1510, rx, 250)) for dx, rx in ((-230, 190), (230, 190), (-110, 220), (110, 220), (0, 230))]
        order = [0, 1, 2, 3, 4]
        c.occlude(union(*ribs), dx=8, dy=20, r=26, strength=0.45)
        for i in order:
            c.paint(ribs[i], PUMP * (0.9 if i < 2 else 0.96 if i < 4 else 1.02), radius=90, depth=1.0, spec=0.45, shin=24)
        stem = mask(tapered(bezier((BX, 1290), (BX + 10, 1200), (BX + 70, 1150), n=30), 70, 44))
        c.paint(stem, hexrgb('#7a5a2c'), radius=16, depth=1.1, spec=0.3)
    return c


def grape(stage):
    c = Canvas()
    # عريشة: قائمان وعارضة
    for x in (620, 1428):
        c.paint(mask(rrect(x - 26, 820, x + 26, 1790, 20)), WOOD, radius=14, depth=1.0, albedo=wood_grain('v', 18, 6, int(x)), spec=0.25)
    c.paint(mask(rrect(560, 790, 1488, 850, 24)), WOOD * 1.06, radius=16, depth=1.0, albedo=wood_grain('h', 18, 8, 3), spec=0.3)
    vine = bezier((BX, BY), (900, 1300), (1150, 1000), (1024, 850), n=60)
    c.paint(mask(tapered(vine, 40, 22)), hexrgb('#7b5a34'), radius=12, depth=1.0, spec=0.25)
    for cx, cy, r, ang in ((760, 930, 190, -1.9), (1290, 920, 190, -1.2), (1030, 1040, 170, -1.57), (880, 1180, 150, -2.3), (1180, 1200, 150, -0.8)):
        lm = lobed(cx, cy, r, 5, ang, 0.72)
        c.occlude(lm, dx=5, dy=12, r=14, strength=0.35)
        c.paint(lm, LEAF if r > 160 else LEAF2, radius=30, depth=1.0, spec=0.3)
        veins(c, (cx, cy + r * 0.1), [(cx + np.cos(ang + d) * r * 0.8, cy + np.sin(ang + d) * r * 0.8) for d in (-1.1, -0.55, 0, 0.55, 1.1)], lm, LEAF * 1.35, 5)
    if stage == 'ready':
        rng = np.random.default_rng(5)
        rows = [(1, 0), (2, 1), (3, 2), (4, 3), (3, 4), (2, 5), (1, 6)]
        pts = []
        for n_, row in rows:
            for k in range(n_):
                pts.append((BX + (k - (n_ - 1) / 2) * 92 + rng.uniform(-8, 8), 1120 + row * 80 + rng.uniform(-6, 6)))
        c.paint(mask(stroke([(BX, 860), (BX, 1130)], 16)), hexrgb('#6a4a28'), radius=6, depth=1, spec=0.2)
        for x, y in sorted(pts, key=lambda p: p[1]):
            gm = mask(ellipse(x, y, 54, 58))
            c.occlude(gm, dx=4, dy=10, r=10, strength=0.35)
            c.paint(gm, GRAPE * rng.uniform(0.92, 1.06), radius=26, depth=1.15, spec=0.75, shin=36)
    else:
        for x, y in ((980, 1150), (1040, 1180), (1010, 1210)):
            c.paint(mask(ellipse(x, y, 24, 26)), hexrgb('#9ccf5a'), radius=12, depth=1.1, spec=0.5)
    return c


def compose(canvas, out, plant_w_frac=0.95, lift=0.40):
    """يغرس النبتة في تلة التربة: القاعدة عند ٤٠٪ من ارتفاع التلة"""
    a = np.clip(canvas.a, 0, 1)
    rgba = np.dstack([np.clip(canvas.rgb, 0, 1) * a[..., None], a])
    plant = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), 'RGBa').convert('RGBA')
    bb = plant.getbbox(); plant = plant.crop(bb)
    base_x_in = (BX - bb[0]) / plant.width; base_y_in = (BY - bb[1]) / plant.height
    mound = Image.open(os.path.join(HERE, 'soil_mound.png')).convert('RGBA')
    W = 520
    mw = int(W * 0.92); mh = int(mound.height * mw / mound.width)
    mound = mound.resize((mw, mh), Image.LANCZOS)
    pw = int(mw * plant_w_frac); ph = int(plant.height * pw / plant.width)
    plant = plant.resize((pw, ph), Image.LANCZOS)
    H = int(ph * base_y_in + mh * (1 - lift)) + 30
    H = max(H, int(W * 1.2))
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    my = H - mh - 14
    img.alpha_composite(mound, ((W - mw) // 2, my))
    px = int(W / 2 - base_x_in * pw); py = int(my + mh * lift - base_y_in * ph)
    img.alpha_composite(plant, (px, max(0, py)))
    img = img.crop(img.getbbox())
    pad = Image.new('RGBA', (img.width + 28, img.height + 28), (0, 0, 0, 0)); pad.alpha_composite(img, (14, 14))
    pad.save(out, optimize=True)


def golden_carrot(out):
    """الجزرة الذهبية: نفس رسمة الجزرة الناضجة الأصلية، ذهبية لامعة، بشرارات"""
    from recolor import rgb_to_hsv, hsv_to_rgb, smooth
    src = os.path.join(HERE, '..', '..', 'farm', 'crops', 'carrot_ready.png')
    arr = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32) / 255
    rgb, a = arr[..., :3], arr[..., 3]
    h, s, v = rgb_to_hsv(rgb)
    H, W = a.shape
    yy = np.mgrid[0:H, 0:W][0]
    # الجزرة وحدها: برتقالي مشبع في الوسط، لا التربة (أغمق) ولا الأوراق (خضراء)
    w = smooth(h, 12, 18) * (1 - smooth(h, 34, 42)) * smooth(s, 0.62, 0.78) * smooth(v, 0.62, 0.78)
    w = w * (yy < H * 0.8)
    h2 = 43 - (1 - v) * 14; s2 = np.clip(s * 1.02, 0, 1); v2 = np.clip(v * 1.06, 0, 1)
    new = hsv_to_rgb(h2, s2, v2)
    rgb2 = rgb * (1 - w[..., None]) + new * w[..., None]
    img = Image.fromarray((np.dstack([rgb2, a]) * 255 + 0.5).astype(np.uint8), 'RGBA')
    # شرارات
    from PIL import ImageDraw
    sp = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(sp)
    for x, y, r in ((70, 150, 11), (200, 190, 9), (178, 300, 7), (95, 260, 6)):
        d.polygon([(x, y - r * 2.4), (x + r * .5, y - r * .5), (x + r * 2.4, y), (x + r * .5, y + r * .5),
                   (x, y + r * 2.4), (x - r * .5, y + r * .5), (x - r * 2.4, y), (x - r * .5, y - r * .5)], fill=(255, 246, 190, 255))
    glow = sp.filter(ImageFilter.GaussianBlur(4))
    img.alpha_composite(glow); img.alpha_composite(sp)
    img.save(out, optimize=True)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', '..', 'farm', 'crops')
    for name, fn in (('strawberry', strawberry), ('pumpkin', pumpkin), ('grape', grape)):
        for stage in ('growing', 'ready'):
            compose(fn(stage), os.path.join(out, f'{name}_{stage}.png'))
            print(f'✓ {name}_{stage}')
    golden_carrot(os.path.join(out, 'carrot_golden_ready.png'))
    print('✓ carrot_golden_ready')
