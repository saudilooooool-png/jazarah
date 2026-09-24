"""لوحة المهام: لوح خشبي على قائمين، ثلاث أوراق فارغة، سقف قرميد وجزرة منحوتة"""
import numpy as np
from clay import *

HONEY = hexrgb('#d69c57'); FRAME = hexrgb('#a4652f'); POST = hexrgb('#b87a3e')
TILE = hexrgb('#ec7a2c'); PAPER = hexrgb('#fbf3df')

PX0, PX1, PY0, PY1 = 500, 1548, 720, 1400       # اللوح
POSTS = (650, 1398)


def rot_rect(cx, cy, w, h, ang):
    ca, sa = np.cos(ang), np.sin(ang)
    pts = []
    for dx, dy in ((-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)):
        pts.append((cx + dx * ca - dy * sa, cy + dx * sa + dy * ca))
    return pts


def render(path):
    c = Canvas()

    # ── القائمان
    for x in POSTS:
        pm = mask(rrect(x - 46, PY0 - 60, x + 46, GROUND, 20))
        c.paint(pm, POST, radius=22, depth=0.9, albedo=wood_grain('v', 20, 8, int(x)), spec=0.25)

    # ── اللوح: إطار ثم ألواح أفقية
    frame = mask(rrect(PX0, PY0, PX1, PY1, 28))
    c.occlude(frame, dx=0, dy=24, r=30, strength=0.5)
    c.paint(frame, FRAME, radius=24, depth=0.9, albedo=wood_grain('h', 24, 10, 4), spec=0.25)
    inner_y0, inner_y1 = PY0 + 40, PY1 - 40
    n = 5; hh = (inner_y1 - inner_y0) / n
    grain = wood_grain('h', 20, 14, 6)
    for i in range(n):
        y0 = inner_y0 + i * hh + 5; y1 = inner_y0 + (i + 1) * hh - 5
        tint = 1 + 0.05 * np.sin(i * 2.3)
        pl = mask(rrect(PX0 + 40, y0, PX1 - 40, y1, 14))
        c.paint(pl, HONEY * tint, radius=16, depth=0.7, albedo=grain, spec=0.22)
    # مسامير الأركان
    for x, y in ((PX0 + 22, PY0 + 22), (PX1 - 22, PY0 + 22), (PX0 + 22, PY1 - 22), (PX1 - 22, PY1 - 22)):
        c.paint(mask(ellipse(x, y, 13, 13)), hexrgb('#6e4a2a'), radius=8, depth=1.2, spec=0.5)

    # ── الأوراق الثلاث: فارغة، مائلة، مثبتة بدبابيس
    papers = [((760, 1010), 262, 318, -0.10, hexrgb('#e8453c')),
              ((1040, 1080), 268, 322, 0.07, hexrgb('#3f8fe0')),
              ((1318, 996), 250, 304, -0.05, hexrgb('#f3c42f'))]
    for (px, py), w, h, ang, pin in papers:
        pm = mask(poly(rot_rect(px, py, w, h, ang)))
        c.occlude(pm, dx=10, dy=18, r=18, strength=0.55)
        # ورق مسطح بانحناء خفيف عند الطرف السفلي
        yy = np.mgrid[0:S, 0:S][0].astype(np.float32)
        curl = 1 - 0.07 * np.clip((yy - (py + h * 0.25)) / (h * 0.3), 0, 1)
        c.paint(pm, PAPER, radius=10, depth=0.6, flat_normal=(0, 0.05, 1), albedo=curl, spec=0.12,
                warm_shadow=PAPER * np.array([0.88, 0.82, 0.72]))
        # الزاوية السفلية اليمنى منثنية قليلًا
        ca, sa = np.cos(ang), np.sin(ang)
        bx = px + (w / 2) * ca - (h / 2) * sa; by = py + (w / 2) * sa + (h / 2) * ca
        fold = mask(poly([(bx, by), (bx - 54 * ca, by - 54 * sa), (bx + 54 * sa, by - 54 * ca)]))
        c.paint(fold, PAPER * 0.9, radius=6, depth=0.8, spec=0.2)
        # الدبوس
        tx = px + 0 * ca - (-h / 2 + 34) * sa; ty = py + 0 * sa + (-h / 2 + 34) * ca
        head = mask(ellipse(tx, ty, 26, 26))
        c.occlude(head, dx=6, dy=12, r=10, strength=0.5)
        c.paint(head, pin, radius=18, depth=1.3, spec=0.8, shin=44)

    # ── السقف: مظلة مائلة بقرميد برتقالي كالبئر
    RX0, RX1, RYF, RYB, INS = 420, 1628, 760, 560, 56
    roof = mask(poly([(RX0, RYF), (RX1, RYF), (RX1 - INS, RYB), (RX0 + INS, RYB)]))
    c.occlude(roof, dx=0, dy=30, r=30, strength=0.55)
    c.paint(roof, TILE * 0.8, radius=20, depth=0.8, flat_normal=(0, -0.7, 0.7), spec=0.2)
    rows = 4
    for r_ in range(rows):
        t0 = r_ / rows; t1 = (r_ + 1) / rows
        yb = RYB + (RYF - RYB) * t1; yt = RYB + (RYF - RYB) * t0
        xl = RX0 + INS * (1 - t1); xr = RX1 - INS * (1 - t1)
        cols = 9 + (r_ % 2)
        tw = (xr - xl) / cols
        for k in range(cols):
            x0 = xl + k * tw + (tw / 2 if r_ % 2 else 0) - (tw / 2 if r_ % 2 else 0)
            tile = mask(rrect(x0 + 4, yt - 6, x0 + tw - 4, yb + 6, 22))
            tile = tile * roof
            c.occlude(tile, dx=0, dy=10, r=8, strength=0.35)
            shade_k = 1 + 0.06 * np.sin(k * 1.7 + r_)
            c.paint(tile, TILE * shade_k, radius=14, depth=0.9, flat_normal=(0, -0.55, 0.8),
                    albedo=1 + 0.05 * (noise(40, 2, 50 + r_ * 11 + k) - 0.5), spec=0.3)
    # حافة أمامية خشبية
    c.paint(mask(rrect(RX0 - 10, RYF - 18, RX1 + 10, RYF + 22, 18)), FRAME * 1.05, radius=14, depth=1,
            albedo=wood_grain('h', 18, 8, 12), spec=0.3)
    # عارضة القمة
    ridge = mask(rrect(RX0 + INS - 20, RYB - 34, RX1 - INS + 20, RYB + 10, 22))
    c.paint(ridge, FRAME * 1.1, radius=18, depth=1, albedo=wood_grain('h', 18, 8, 13), spec=0.3)

    # ── الجزرة المنحوتة فوق القمة
    cxr, cyr = CX, RYB - 34
    for tip, w in (((cxr - 64, cyr - 230), 52), ((cxr + 4, cyr - 256), 56), ((cxr + 64, cyr - 222), 50)):
        lm = mask(poly(leaf_pts((cxr, cyr - 140), tip, w)))
        c.paint(lm, hexrgb('#6cad3c'), radius=14, depth=1.1, spec=0.35)
    carrot = mask(poly(carrot_pts((cxr, cyr - 158), (cxr + 6, cyr + 10), 108)))
    c.occlude(carrot, dx=6, dy=10, r=12, strength=0.4)
    c.paint(carrot, hexrgb('#f07b24'), radius=26, depth=1.1, spec=0.5)
    for i, yy_ in enumerate((cyr - 110, cyr - 78, cyr - 46)):
        c.flat(mask(stroke([(cxr - 30 + i * 6, yy_), (cxr - 6 + i * 6, yy_ - 4)], 6)), hexrgb('#b8520f'), 0.5)

    # ── أعشاب عند القائمين تثبّتهما في الأرض
    rng = np.random.default_rng(3)
    for x in POSTS:
        for k in range(5):
            base = (x + rng.uniform(-60, 60), GROUND - 4)
            tip = (base[0] + rng.uniform(-90, 90), GROUND - rng.uniform(110, 190))
            gm = mask(poly(leaf_pts(base, tip, rng.uniform(34, 46))))
            c.paint(gm, hexrgb('#6fb13f') * rng.uniform(0.85, 1.08), radius=10, depth=1, spec=0.3)

    return c.save(path)


if __name__ == '__main__':
    import sys
    render(sys.argv[1] if len(sys.argv) > 1 else 'task_board.png')
    print('✓ task_board')
