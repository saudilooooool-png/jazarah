"""الحاضنة: قاعدة خشبية مستديرة + عش قش فارغ الوسط + قوس ومصباح دافئ"""
import numpy as np
from clay import *

WOOD = hexrgb('#c98a4b'); WOOD_TOP = hexrgb('#dca567'); WOOD_DARK = hexrgb('#9a5d2c')
BRASS = hexrgb('#e3b24c')
STRAWS = [hexrgb(h) for h in ('#e9b44c', '#d99b36', '#f3c965', '#cf8f2e', '#f6d47a')]

BX, BTOP, BRX, BRY = CX - 40, 1590, 700, 168   # سطح القاعدة
BBOT = GROUND - BRY                             # مركز الحافة السفلية
NX, NY, NRX, NRY = BX, 1560, 530, 170          # العش (خارجي، عند قاعدته)
LIFT = 150                                      # ارتفاع حافة العش
HRX, HRY = 330, 100                             # التجويف الفارغ (على قمة الحافة)


def ell_pts(cx, cy, rx, ry, a0, a1, n):
    t = np.linspace(a0, a1, n)
    return np.stack([cx + rx * np.cos(t), cy + ry * np.sin(t)], 1)


def strand_batch(rng, n, a_range, band, w=(22, 32)):
    """خيوط قش قصيرة على جسم العش.
    band='top'  : على قمة الحافة، بين التجويف والحافة الخارجية
    band='wall' : على الجدار الأمامي الخارجي، من القمة إلى القاعدة"""
    def f(d):
        for _ in range(n):
            a0 = rng.uniform(*a_range); span = rng.uniform(0.28, 0.62)
            if band == 'top':
                fr = rng.uniform(0.0, 1.0)
                rx = HRX + (NRX - HRX) * fr; ry = HRY + (NRY - HRY) * fr
                cy = NY - LIFT - 6 + (1 - fr) * 10
            else:
                h = rng.uniform(0.0, 1.0)
                rx = NRX * rng.uniform(0.97, 1.03); ry = NRY * rng.uniform(0.97, 1.03)
                cy = NY - LIFT * h
            wob = rng.uniform(-14, 14)
            p = ell_pts(NX + wob, cy, rx, ry, a0, a0 + span, 48)
            p[:, 1] += np.linspace(-1, 1, len(p)) * rng.uniform(-26, 26)   # ميل النسج
            wd = rng.uniform(*w)
            # دوائر متلاصقة على المسار: أنبوب أملس بلا زوايا عند الوصلات
            for i, q in enumerate(p):
                ww = wd * (0.8 + 0.2 * np.sin(np.pi * i / (len(p) - 1)))
                d.ellipse([q[0] - ww / 2, q[1] - ww / 2, q[0] + ww / 2, q[1] + ww / 2], fill=255)
    return mask(f)


def render(path):
    c = Canvas()
    rng = np.random.default_rng(11)

    # ── القاعدة: أسطوانة منخفضة
    side = union(mask(ellipse(BX, BBOT, BRX, BRY)),
                 mask(lambda d: d.rectangle([BX - BRX, BTOP, BX + BRX, BBOT], fill=255)))
    grain_v = wood_grain('v', period=26, warp=10, seed=3)
    # ألواح عمودية تنحني مع الأسطوانة
    planks = np.ones((S, S), np.float32)
    for k in np.linspace(-0.92, 0.92, 11):
        x = BX + BRX * k
        planks -= mask(stroke([(x, BTOP + BRY * np.sqrt(1 - k * k) - 4), (x, BBOT + BRY * np.sqrt(1 - k * k) + 4)], 7)) * 0.28
    c.paint(side, WOOD * 0.92, radius=60, depth=0.9, profile=0.45, albedo=grain_v * planks, spec=0.18)
    # إطار زخرفي: شريط أغمق مع مسامير نحاسية على المحيط الأمامي
    trim = minus(union(mask(ellipse(BX, BTOP + 44, BRX + 2, BRY + 2)),
                       mask(lambda d: d.rectangle([BX - BRX - 2, BTOP, BX + BRX + 2, BTOP + 44], fill=255))),
                 mask(ellipse(BX, BTOP, BRX, BRY)))
    trim = minus(trim, mask(lambda d: d.rectangle([0, 0, S, BTOP], fill=255)))
    c.paint(trim, WOOD_DARK, radius=12, depth=0.9, spec=0.25)
    for k in np.linspace(-0.86, 0.86, 9):
        sx = BX + BRX * k; sy = BTOP + 22 + BRY * np.sqrt(1 - k * k)
        stud = mask(ellipse(sx, sy, 15, 13))
        c.paint(stud, BRASS, radius=10, depth=1.2, spec=0.8, shin=40)

    # سطح القاعدة: خشب أفتح بعروق أفقية
    top = mask(ellipse(BX, BTOP, BRX, BRY))
    c.paint(top, WOOD_TOP, radius=26, depth=0.6, flat_normal=(-0.05, -0.9, 0.5),
            albedo=wood_grain('h', period=22, warp=14, seed=5), spec=0.22)
    rim = minus(mask(ellipse(BX, BTOP, BRX, BRY)), mask(ellipse(BX, BTOP + 4, BRX - 22, BRY - 12)))
    c.flat(blur(rim, 4), np.array([1, 0.93, 0.8]), 0.35)

    # ── القوس: عمود خلفي يسار يرتفع وينحني فوق العش، والمصباح يتدلى جانبًا
    pole = bezier((BX - 500, BTOP - 20), (BX - 560, 760), (BX - 300, 470), (BX + 380, 470), n=160)
    pm = mask(tapered(pole, 70, 50))
    c.occlude(pm, dx=10, dy=18, r=22, strength=0.35)
    c.paint(pm, WOOD * 0.95, radius=22, depth=1.0, albedo=wood_grain('v', 18, 6, 8), spec=0.3)
    hook = bezier((BX + 380, 470), (BX + 450, 470), (BX + 452, 530), n=30)
    c.paint(mask(tapered(hook, 48, 34)), WOOD * 0.9, radius=14, depth=1.0, spec=0.3)

    # ── المصباح المعلّق
    lx, ly = BX + 452, 610
    c.paint(mask(stroke([(lx, 528), (lx, ly)], 10)), hexrgb('#b8894f'), radius=4, depth=1, spec=0.2)
    glass = mask(rrect(lx - 62, ly + 44, lx + 62, ly + 200, 40))
    c.glow(glass, np.array([1.0, 0.66, 0.25]), r=130, strength=0.7)
    c.glow(glass, np.array([1.0, 0.82, 0.45]), r=40, strength=0.5)
    c.paint(glass, hexrgb('#ffc255'), radius=34, depth=0.6, ambient=0.95, spec=0.5,
            warm_shadow=hexrgb('#f59a2e'))
    c.paint(mask(ellipse(lx, ly + 122, 26, 44)), hexrgb('#fff4c8'), radius=18, depth=0.3, ambient=1.0, spec=0.0,
            warm_shadow=hexrgb('#ffe28a'))
    for x in (lx - 36, lx + 36):
        c.paint(mask(stroke([(x, ly + 50), (x, ly + 194)], 9)), WOOD_DARK, radius=4, depth=1, spec=0.25)
    cap = mask(poly([(lx - 80, ly + 50), (lx + 80, ly + 50), (lx + 44, ly + 4), (lx - 44, ly + 4)]))
    c.paint(union(cap, mask(ellipse(lx, ly + 4, 22, 16))), WOOD_DARK, radius=16, depth=1, spec=0.35)
    c.paint(mask(rrect(lx - 74, ly + 194, lx + 74, ly + 226, 14)), WOOD_DARK, radius=12, depth=1, spec=0.35)

    # ── العش: جسم دائري مرفوع ← تجويف ← خيوط منسوجة
    body = np.zeros((S, S), np.float32)
    for t in np.linspace(0, LIFT, 24):
        body = np.maximum(body, mask(ellipse(NX, NY - t, NRX, NRY)))
    c.occlude(body, dx=6, dy=16, r=30, strength=0.55)
    c.paint(body, hexrgb('#d8a03f'), radius=70, depth=1.0, profile=0.5, spec=0.15,
            albedo=1 + 0.18 * (noise(24, 2, 31) - 0.5))
    hollow = mask(ellipse(NX, NY - LIFT, HRX, HRY))
    c.paint(hollow, hexrgb('#9c6120'), radius=46, depth=-0.9, ambient=0.55,
            albedo=1 + 0.16 * (noise(22, 2, 21) - 0.5), spec=0.04)
    # ظل داخلي: الحافة الخلفية تُظلل أرضية التجويف
    inner = minus(hollow, mask(ellipse(NX + 12, NY - LIFT + 26, HRX - 24, HRY - 30)))
    c.flat(blur(inner, 16) * hollow, hexrgb('#5e3210'), 0.55)
    # خيوط الحافة الخلفية (فوق التجويف في الصورة)
    for i in range(10):
        b_ = strand_batch(rng, 7, (np.pi * 0.98, np.pi * 2.02), 'top')
        c.occlude(b_, dx=3, dy=9, r=9, strength=0.42)
        c.paint(b_, STRAWS[i % 5], radius=9, depth=1.35, profile=0.7, spec=0.32, shin=20)
    # الجدار الأمامي
    for i in range(14):
        b_ = strand_batch(rng, 7, (-0.05, np.pi + 0.05), 'wall')
        c.occlude(b_, dx=3, dy=10, r=9, strength=0.42)
        c.paint(b_, STRAWS[(i + 1) % 5], radius=9, depth=1.35, profile=0.7, spec=0.3, shin=20)
    # الحافة الأمامية العليا (تلتف أمام التجويف)
    for i in range(10):
        b_ = strand_batch(rng, 7, (-0.02, np.pi + 0.02), 'top')
        c.occlude(b_, dx=3, dy=9, r=9, strength=0.42)
        c.paint(b_, STRAWS[(i + 3) % 5], radius=9, depth=1.35, profile=0.7, spec=0.34, shin=20)
    # خيوط سائبة قليلة تكسر الحافة الخارجية
    rng2 = np.random.default_rng(5)
    def loose(d):
        for _ in range(6):
            a = rng2.uniform(0.2, np.pi - 0.2)
            x0 = NX + NRX * np.cos(a); y0 = NY - LIFT * rng2.uniform(0.2, 0.8) + NRY * np.sin(a)
            ang = a + rng2.uniform(-0.9, 0.9)
            ln = rng2.uniform(50, 90)
            x1 = x0 + np.cos(ang) * ln; y1 = y0 + np.sin(ang) * ln * 0.5
            d.line([(x0, y0), (x1, y1)], fill=255, width=22)
            for q in ((x0, y0), (x1, y1)):
                d.ellipse([q[0] - 11, q[1] - 11, q[0] + 11, q[1] + 11], fill=255)
    lm_ = mask(loose)
    c.paint(lm_, STRAWS[2], radius=8, depth=1.3, profile=0.7, spec=0.3)

    # ── أوراق وزهرتان حول القاعدة
    LEAF = hexrgb('#6fb13f'); LEAF2 = hexrgb('#4f9632')
    leaves = [((BX - 640, GROUND - 40), (BX - 830, GROUND - 190), 110, LEAF),
              ((BX - 600, GROUND - 10), (BX - 780, GROUND - 40), 90, LEAF2),
              ((BX - 560, GROUND - 30), (BX - 640, GROUND - 230), 96, LEAF),
              ((BX + 620, GROUND - 30), (BX + 820, GROUND - 170), 104, LEAF),
              ((BX + 590, GROUND - 6), (BX + 780, GROUND - 30), 86, LEAF2),
              ((BX + 560, GROUND - 26), (BX + 620, GROUND - 210), 90, LEAF2)]
    for base, tip, w, col in leaves:
        lm = mask(poly(leaf_pts(base, tip, w)))
        c.occlude(lm, dx=6, dy=14, r=16, strength=0.35)
        c.paint(lm, col, radius=20, depth=1.1, spec=0.35)
        vein = mask(stroke(bezier(base, ((base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2 - 8), tip, n=20), 5)) * lm
        c.flat(blur(vein, 2), col * 1.35, 0.5)

    def flower(fx, fy, petal, core, r=46):
        for k in range(5):
            a = -np.pi / 2 + k * 2 * np.pi / 5
            pm_ = mask(ellipse(fx + np.cos(a) * r, fy + np.sin(a) * r * 0.8, r * 0.72, r * 0.6))
            c.occlude(pm_, dx=3, dy=8, r=8, strength=0.3)
            c.paint(pm_, petal, radius=16, depth=1.0, spec=0.35)
        c.paint(mask(ellipse(fx, fy, r * 0.42, r * 0.38)), core, radius=12, depth=1.2, spec=0.5)

    flower(BX - 690, GROUND - 150, hexrgb('#fbf6ec'), hexrgb('#f3b43a'))
    flower(BX + 700, GROUND - 130, hexrgb('#f7a8c4'), hexrgb('#f6c64d'), r=40)

    return c.save(path)


if __name__ == '__main__':
    import sys
    render(sys.argv[1] if len(sys.argv) > 1 else 'incubator.png')
    print('✓ incubator')
