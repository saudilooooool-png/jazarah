"""الرفيق البني بالغًا — نفس كائن baby_brown كبر: أطول، جناحان أكبر، عينان أهدأ"""
import numpy as np
from clay import *

BODY = hexrgb('#d8661c'); BODY_D = hexrgb('#a8440c')
BELLY = hexrgb('#f8b35a'); BELLY_D = hexrgb('#e89a3e')
LEAF = hexrgb('#a9c04a'); LEAF_D = hexrgb('#86a032')
WING = hexrgb('#cf5f10'); MEMB = hexrgb('#e2772c')
PAD = hexrgb('#f6a445'); INK = hexrgb('#4a1a04')


def spots(region, seed, n, rmin, rmax, bb):
    """بقع حراشف فاتحة مستديرة كما في الصغير — مُعامِل لون"""
    rng = np.random.default_rng(seed)
    y0, y1, x0, x1 = bb
    def f(d):
        for _ in range(n):
            x = rng.uniform(x0, x1); y = rng.uniform(y0, y1); r = rng.uniform(rmin, rmax)
            d.ellipse([x - r, y - r * 0.85, x + r, y + r * 0.85], fill=255)
    m = blur(mask(f), 3) * region
    return 1 + 0.11 * m


def render(path):
    c = Canvas()

    # ── الذيل: ينحني يمينًا وينتهي بورقة
    tail = bezier((1230, 1640), (1520, 1720), (1700, 1560), (1640, 1390), n=120)
    tm = mask(tapered(tail, 190, 54))
    c.paint(tm, BODY * 0.96, radius=60, depth=1.1, spec=0.3,
            albedo=spots(tm, 5, 26, 14, 30, (1300, 1760, 1300, 1760)))
    tl = mask(poly(leaf_pts((1640, 1400), (1700, 1180), 150)))
    c.occlude(tl, dx=6, dy=14, r=16, strength=0.35)
    c.paint(tl, LEAF, radius=26, depth=1.1, spec=0.35)
    c.flat(blur(mask(stroke(bezier((1642, 1396), (1668, 1300), (1698, 1196), n=20), 7)) * tl, 2), LEAF * 1.3, 0.5)

    # ── الجناحان: أكبر من الصغير، نصف مفرودين خلف الجسم
    for sgn in (-1, 1):
        sx = 1024 + sgn * 200
        top = (1024 + sgn * 590, 560); mid = (1024 + sgn * 650, 840)
        low1 = (1024 + sgn * 520, 1040); low2 = (1024 + sgn * 390, 1120)
        wing_pts = [(sx, 900), (1024 + sgn * 400, 630), top, (1024 + sgn * 640, 720), mid]
        # حافة سفلية مقوسة (أقواس بين أطراف الأصابع)
        edge = []
        for a, b_ in ((mid, low1), (low1, low2), (low2, (sx - sgn * 10, 1130))):
            mx = (a[0] + b_[0]) / 2 - sgn * 10; my = (a[1] + b_[1]) / 2 - 60
            edge += bezier(a, (mx, my), b_, n=24)[1:]
        wm = mask(poly(wing_pts + edge))
        c.paint(wm, MEMB, radius=40, depth=0.8, spec=0.22, ambient=0.6)
        # عظام الجناح: ذراع علوي وإصبعان
        bones = [stroke(bezier((sx, 900), (1024 + sgn * 400, 630), top, n=30), 46),
                 stroke([top, mid], 24), stroke([top, low1], 22), stroke([top, low2], 20)]
        for bf in bones:
            bm = mask(bf) * np.maximum(wm, mask(bones[0]))
            c.paint(bm, WING, radius=12, depth=1.1, spec=0.35)
        c.paint(mask(ellipse(*top, 22, 22)), WING * 1.05, radius=12, depth=1.2, spec=0.4)

    # ── الساقان والقدمان
    for x in (870, 1178):
        leg = mask(ellipse(x, 1650, 150, 190))
        c.paint(leg, BODY * 0.95, radius=80, depth=1.0, spec=0.25,
                albedo=spots(leg, int(x), 10, 14, 26, (1480, 1820, x - 150, x + 150)))
    # ── الجسم: كمثرى ممتلئة
    body = union(mask(ellipse(1024, 1390, 330, 410)), mask(ellipse(1024, 1060, 250, 250)))
    c.occlude(body, dx=10, dy=24, r=40, strength=0.35)
    c.paint(body, BODY, radius=150, depth=1.0, profile=0.5, spec=0.28,
            albedo=spots(body, 9, 170, 8, 17, (900, 1780, 700, 1350)))
    # البطن: كريمي بصفائح أفقية
    belly = mask(ellipse(1034, 1440, 212, 318)) * body
    rows = np.ones((S, S), np.float32)
    for yy in range(1170, 1760, 64):
        rows -= mask(stroke(bezier((840, yy), (1034, yy + 30), (1230, yy), n=30), 7)) * 0.16
    c.paint(belly, BELLY, radius=90, depth=0.9, spec=0.3, albedo=rows,
            warm_shadow=BELLY_D * np.array([0.9, 0.8, 0.7]))
    for x in (870, 1178):
        foot = mask(ellipse(x + (-16 if x < 1024 else 16), GROUND - 52, 168, 64))
        c.occlude(foot, dx=0, dy=-10, r=18, strength=0.3)
        c.paint(foot, BODY * 0.98, radius=40, depth=1.0, spec=0.3)
        for k in (-1, 0, 1):
            toe = mask(ellipse(x + (-16 if x < 1024 else 16) + k * 96, GROUND - 30, 44, 30))
            c.paint(toe, PAD, radius=18, depth=1.1, spec=0.4)

    # ── الذراعان: مسترخيتان، اليدان عند جانبي البطن
    for sgn in (-1, 1):
        arm = bezier((1024 + sgn * 230, 1140), (1024 + sgn * 330, 1250), (1024 + sgn * 300, 1400), n=40)
        am = mask(tapered(arm, 120, 96))
        c.occlude(am, dx=6, dy=16, r=20, strength=0.4)
        c.paint(am, BODY * 0.97, radius=46, depth=1.1, spec=0.3)
        hx, hy = 1024 + sgn * 292, 1420
        hand = mask(ellipse(hx, hy, 74, 64))
        c.paint(hand, BODY, radius=36, depth=1.1, spec=0.3)
        for k in (-1, 0, 1):
            c.paint(mask(ellipse(hx + k * 38 - sgn * 6, hy + 50, 20, 16)), PAD, radius=10, depth=1.1, spec=0.4)

    # ── الرأس
    fins = []
    for sgn in (-1, 1):
        fins.append(mask(poly(leaf_pts((1024 + sgn * 318, 700), (1024 + sgn * 420, 640), 84))))
    for fm in fins:
        c.paint(fm, BODY * 0.95, radius=24, depth=1.1, spec=0.3)
    head = union(mask(ellipse(1024, 620, 350, 300)), mask(ellipse(1024, 750, 318, 210)))
    c.occlude(head, dx=10, dy=30, r=44, strength=0.45)
    c.paint(head, BODY, radius=140, depth=1.0, profile=0.5, spec=0.3,
            albedo=spots(head, 13, 150, 7, 15, (330, 760, 700, 1350)))
    snout = mask(ellipse(1024, 806, 176, 108))
    c.paint(snout, BODY * 1.02, radius=100, depth=0.55, profile=0.6, spec=0.3)
    for sgn in (-1, 1):
        c.paint(mask(ellipse(1024 + sgn * 44, 790, 13, 10)), INK, radius=5, depth=-0.6, spec=0.05, ambient=0.9)

    # الوجنتان: تورّد دافئ
    for sgn in (-1, 1):
        c.flat(blur(mask(ellipse(1024 + sgn * 232, 812, 70, 40)), 22), hexrgb('#f47a52'), 0.45)

    # العينان: كبيرتان، والجفن العلوي ينزل قليلًا فيبدو هادئًا واثقًا
    for sgn in (-1, 1):
        ex, ey = 1024 + sgn * 148, 636
        eye = mask(ellipse(ex, ey, 104, 116))
        c.occlude(eye, dx=4, dy=10, r=14, strength=0.4)
        c.paint(eye, hexrgb('#fff7e6'), radius=30, depth=0.7, spec=0.3,
                warm_shadow=hexrgb('#e8d2b0'))
        iris = mask(ellipse(ex + sgn * 6, ey + 12, 82, 90)) * eye
        yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
        grad = np.clip(1.15 - (yy - (ey - 60)) / 180, 0.7, 1.15)
        c.paint(iris, hexrgb('#d9892a'), radius=20, depth=0.5, spec=0.1, albedo=grad,
                warm_shadow=hexrgb('#8a4610'))
        ring = minus(iris, mask(ellipse(ex + sgn * 6, ey + 12, 70, 78)))
        c.flat(blur(ring, 3), hexrgb('#6a3208'), 0.55)
        pupil = mask(ellipse(ex + sgn * 8, ey + 16, 48, 56)) * eye
        c.paint(pupil, hexrgb('#24140a'), radius=14, depth=0.4, spec=0.05, ambient=0.9)
        c.flat(mask(ellipse(ex - 20, ey - 10, 30, 32)) * eye, np.array([1, 1, 1]), 0.97)
        c.flat(mask(ellipse(ex + 28, ey + 46, 13, 13)) * eye, np.array([1, 1, 1]), 0.9)
        # الجفن العلوي
        lid = eye * mask(ellipse(ex, ey - 196, 170, 100))
        c.paint(lid, BODY * 1.02, radius=26, depth=1.0, spec=0.3)
        lash = minus((blur(lid, 3) > 0.02).astype(np.float32), (lid > 0.5).astype(np.float32)) * eye
        c.flat(blur(lash, 2), INK, 0.7)
        # الحاجب: نتوء صغير فوق العين
        brow = mask(stroke(bezier((ex - sgn * 56, ey - 150), (ex, ey - 168), (ex + sgn * 60, ey - 148), n=20), 20))
        c.paint(brow, BODY * 0.93, radius=10, depth=1.0, spec=0.25)

    # الابتسامة: واثقة لطيفة
    smile = mask(stroke(bezier((924, 880), (1024, 940), (1128, 876), n=30), 15))
    c.flat(blur(smile, 2), INK, 0.85)
    for sgn in (-1, 1):
        c.flat(blur(mask(stroke(bezier((1024 + sgn * 104, 878), (1024 + sgn * 120, 870), (1024 + sgn * 126, 856), n=10), 10)), 2), INK, 0.6)

    # ── تاج الأوراق: ثلاث باقات كالصغير، أكبر قليلًا
    crest = [((850, 380), [(716, 240), (768, 186), (846, 170)], 104),
             ((1024, 336), [(992, 196), (1058, 186)], 84),
             ((1198, 380), [(1202, 170), (1280, 186), (1332, 240)], 104)]
    for base, tips, w in crest:
        for tip in tips:
            lm = mask(poly(leaf_pts(base, tip, w)))
            c.occlude(lm, dx=4, dy=12, r=12, strength=0.35)
            col = LEAF * (1.06 if tip[1] < 190 else 0.97)
            c.paint(lm, col, radius=22, depth=1.1, spec=0.35,
                    warm_shadow=LEAF_D * np.array([0.8, 0.8, 0.6]))
            vein = mask(stroke(bezier(base, ((base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2 - 6), tip, n=20), 6)) * lm
            c.flat(blur(vein, 2), LEAF * 1.3, 0.45)

    return c.save(path)


if __name__ == '__main__':
    import sys
    render(sys.argv[1] if len(sys.argv) > 1 else 'grown_brown.png')
    print('✓ grown_brown')
