"""زينة المزرعة — هدايا إكمال صفحات الدفتر (المرحلة ٣)

flowers  : حوض زهور خشبي            ← أول رفيق يكبر
scarecrow: فزّاعة بقبعة قش           ← صفحة المحاصيل كاملة
lantern  : عمود فانوس دافئ           ← ثلاثة رفاق مختلفين
fountain : نافورة حجرية              ← أربعة محاصيل لامعة
rainbow  : قوس الرفاق بألوانهم الخمسة ← الرفاق الخمسة كلهم
"""
import os
import numpy as np
from clay import *

WOOD = hexrgb('#b87a3e'); WOOD_D = hexrgb('#8f5a2c'); LEAF = hexrgb('#6fb13f'); LEAF2 = hexrgb('#4f9632')
STONE = hexrgb('#c9c1b3'); STONE_D = hexrgb('#a39a8b')
rng = np.random.default_rng(11)


def grass(c, xs, h=(110, 190), w=(34, 46), seed=3):
    r = np.random.default_rng(seed)
    for x in xs:
        for _ in range(4):
            base = (x + r.uniform(-50, 50), GROUND - 4)
            tip = (base[0] + r.uniform(-80, 80), GROUND - r.uniform(*h))
            gm = mask(poly(leaf_pts(base, tip, r.uniform(*w))))
            c.paint(gm, LEAF * r.uniform(0.85, 1.08), radius=10, depth=1, spec=0.3)


def flower(c, fx, fy, petal, core, r=46, n=5):
    for k in range(n):
        a = -np.pi / 2 + k * 2 * np.pi / n
        pm = mask(ellipse(fx + np.cos(a) * r, fy + np.sin(a) * r * 0.8, r * 0.72, r * 0.6))
        c.occlude(pm, dx=3, dy=8, r=8, strength=0.3)
        c.paint(pm, petal, radius=16, depth=1.0, spec=0.35)
    c.paint(mask(ellipse(fx, fy, r * 0.42, r * 0.38)), core, radius=12, depth=1.2, spec=0.5)


# ───────────── حوض الزهور ─────────────
def flowers(path):
    c = Canvas()
    X0, X1, TOP, BOT, DEP = 420, 1628, 1320, GROUND - 20, 150
    # السطح الخلفي (تراب) ثم الوجه الأمامي من ألواح
    soil = mask(poly([(X0 + 40, TOP), (X1 - 40, TOP), (X1 - 90, TOP - DEP), (X0 + 90, TOP - DEP)]))
    rim_back = mask(rrect(X0 + 70, TOP - DEP - 30, X1 - 70, TOP - DEP + 26, 18))
    c.paint(rim_back, WOOD_D, radius=14, depth=0.9, albedo=wood_grain('h', 18, 8, 2), spec=0.2)
    c.paint(soil, hexrgb('#7a4a2a'), radius=18, depth=0.5, albedo=1 + 0.12 * (noise(30, 3, 5) - 0.5), spec=0.05)
    # الأزهار والأوراق خلف الحافة الأمامية
    stems_x = np.linspace(X0 + 150, X1 - 150, 7)
    palette = [('#f7a8c4', '#f6c64d'), ('#fbf6ec', '#f3b43a'), ('#b58be0', '#fbe38a'), ('#f47f6b', '#fff0b8'),
               ('#f6c94a', '#e0782c'), ('#f7a8c4', '#fbf6ec'), ('#8fc2f2', '#fbe38a')]
    for i, x in enumerate(stems_x):
        h = 330 + 90 * np.sin(i * 1.9) ** 2
        base = (x, TOP - DEP * 0.4)
        top = (x + rng.uniform(-40, 40), TOP - h)
        c.paint(mask(stroke(bezier(base, (x - 20, (base[1] + top[1]) / 2), top, n=20), 22)), LEAF2, radius=8, depth=1)
        for s in (-1, 1):
            tip = (x + s * rng.uniform(110, 150), TOP - h * rng.uniform(0.45, 0.6))
            lm = mask(poly(leaf_pts((x, TOP - h * 0.35), tip, 70)))
            c.paint(lm, LEAF * rng.uniform(0.9, 1.08), radius=14, depth=1.1, spec=0.35)
    for i, x in enumerate(stems_x):
        h = 330 + 90 * np.sin(i * 1.9) ** 2
        p, k = palette[i]
        flower(c, x + rng.uniform(-40, 40) * 0 + 0, TOP - h, hexrgb(p), hexrgb(k), r=62 + 10 * (i % 2))
    # الوجه الأمامي
    front = mask(rrect(X0, TOP - 20, X1, BOT, 26))
    c.occlude(front, dx=0, dy=-10, r=24, strength=0.4)
    c.paint(front, WOOD, radius=22, depth=0.8, albedo=wood_grain('h', 22, 10, 4), spec=0.22)
    n = 3; hh = (BOT - TOP) / n
    for k in range(1, n):
        y = TOP - 20 + k * hh
        c.flat(blur(mask(stroke([(X0 + 20, y), (X1 - 20, y)], 8)), 3), WOOD_D * 0.8, 0.7)
    for x in (X0 + 36, X1 - 36):
        c.paint(mask(rrect(x - 34, TOP - 60, x + 34, BOT + 10, 14)), WOOD_D, radius=14, depth=1,
                albedo=wood_grain('v', 18, 8, int(x)), spec=0.25)
    # قلب صغير محفور في الوسط
    hx, hy = CX, (TOP + BOT) / 2
    heart = mask(lambda d: (d.ellipse([hx - 64, hy - 50, hx + 4, hy + 18], fill=255), d.ellipse([hx - 4, hy - 50, hx + 64, hy + 18], fill=255),
                            d.polygon([(hx - 62, hy - 4), (hx + 62, hy - 4), (hx, hy + 70)], fill=255)))
    c.paint(heart, hexrgb('#f07a8a'), radius=14, depth=1.1, spec=0.5)
    grass(c, (X0 - 30, X1 + 30), seed=4)
    return c.save(path)


# ───────────── الفزّاعة ─────────────
def scarecrow(path):
    c = Canvas()
    PX = CX; ARM_Y = 900
    # العمود والعارضة
    c.paint(mask(rrect(PX - 40, 700, PX + 40, GROUND, 18)), WOOD, radius=20, depth=0.9, albedo=wood_grain('v', 20, 8, 1), spec=0.25)
    c.paint(mask(rrect(PX - 560, ARM_Y - 36, PX + 560, ARM_Y + 36, 18)), WOOD_D, radius=18, depth=0.9, albedo=wood_grain('h', 20, 8, 2), spec=0.25)
    # قش يخرج من الكمين
    STRAW = hexrgb('#f0c95a')
    for s in (-1, 1):
        for k in range(6):
            base = (PX + s * 470, ARM_Y + rng.uniform(-40, 40))
            tip = (PX + s * rng.uniform(560, 640), ARM_Y + rng.uniform(-110, 130))
            c.paint(mask(stroke([base, tip], 20)), STRAW * rng.uniform(0.85, 1.1), radius=8, depth=1.2, spec=0.3)
    # القميص: جذع وكمّان على العارضة، مربعات حمراء
    shirt = union(mask(rrect(PX - 230, ARM_Y - 70, PX + 230, 1440, 60)),
                  mask(rrect(PX - 490, ARM_Y - 74, PX + 490, ARM_Y + 90, 60)))
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    plaid = 1 - 0.16 * ((np.sin(xx / 34) > 0.55) | (np.sin(yy / 34) > 0.55)) + 0.05 * (noise(40, 2, 9) - 0.5)
    c.occlude(shirt, dx=0, dy=20, r=24, strength=0.4)
    c.paint(shirt, hexrgb('#d9483b'), radius=40, depth=0.9, albedo=plaid, spec=0.18)
    # أزرار ورقعة زرقاء
    for y in (1060, 1180, 1300):
        c.paint(mask(ellipse(PX, y, 20, 20)), hexrgb('#f4e2b8'), radius=10, depth=1.2, spec=0.5)
    c.paint(mask(rrect(PX + 70, 1230, PX + 180, 1340, 14)), hexrgb('#4b8fd6'), radius=12, depth=0.8, spec=0.2)
    # قش أسفل القميص
    for k in range(9):
        base = (PX - 180 + k * 45, 1420)
        tip = (base[0] + rng.uniform(-40, 40), 1420 + rng.uniform(90, 150))
        c.paint(mask(stroke([base, tip], 22)), STRAW * rng.uniform(0.85, 1.1), radius=8, depth=1.2, spec=0.3)
    # الرأس: كيس خيش
    head = mask(ellipse(PX, 640, 200, 190))
    c.occlude(head, dx=0, dy=24, r=24, strength=0.4)
    c.paint(head, hexrgb('#e6c996'), radius=60, depth=1.0, albedo=1 + 0.08 * (noise(18, 2, 12) - 0.5), spec=0.18)
    # عينان زرّان وابتسامة مخيطة
    for ex in (PX - 72, PX + 72):
        c.paint(mask(ellipse(ex, 620, 30, 30)), hexrgb('#4a3222'), radius=12, depth=1.3, spec=0.7, shin=40)
    smile = bezier((PX - 90, 710), (PX, 780), (PX + 90, 710), n=30)
    c.flat(blur(mask(stroke(smile, 12)), 1.5), hexrgb('#5a3a26'), 0.9)
    for i in range(0, 30, 6):
        x, y = smile[i]
        c.flat(mask(stroke([(x, y - 18), (x, y + 18)], 7)), hexrgb('#5a3a26'), 0.8)
    for ex in (PX - 130, PX + 130):
        c.flat(blur(mask(ellipse(ex, 700, 36, 22)), 8), hexrgb('#f08a74'), 0.45)
    # قبعة القش
    brim = mask(ellipse(PX, 490, 330, 70))
    c.occlude(brim, dx=0, dy=30, r=24, strength=0.45)
    c.paint(brim, STRAW, radius=26, depth=0.9, flat_normal=(0, -0.6, 0.8), albedo=wood_grain('h', 10, 6, 5), spec=0.25)
    crown = mask(lambda d: d.chord([PX - 180, 290, PX + 180, 640], 180, 360, fill=255))
    c.paint(crown, STRAW * 0.98, radius=40, depth=1.0, albedo=wood_grain('h', 10, 6, 6), spec=0.25)
    c.paint(mask(rrect(PX - 178, 426, PX + 178, 470, 14)), hexrgb('#d9483b'), radius=12, depth=1, spec=0.3)
    # جزرة في جيب القميص
    c.paint(mask(poly(carrot_pts((PX - 150, 1100), (PX - 130, 1250), 70))), hexrgb('#f07b24'), radius=16, depth=1.1, spec=0.5)
    for tip in ((PX - 190, 1010), (PX - 140, 990), (PX - 110, 1020)):
        c.paint(mask(poly(leaf_pts((PX - 148, 1100), tip, 30))), LEAF, radius=8, depth=1, spec=0.3)
    c.paint(mask(rrect(PX - 220, 1150, PX - 70, 1250, 14)), hexrgb('#b8382d'), radius=12, depth=0.9, spec=0.2)
    grass(c, (PX - 40, PX + 40), h=(130, 220), seed=6)
    return c.save(path)


# ───────────── عمود الفانوس ─────────────
def lantern(path):
    c = Canvas()
    PX = CX - 170
    c.paint(mask(rrect(PX - 46, 520, PX + 46, GROUND, 20)), WOOD, radius=22, depth=0.9, albedo=wood_grain('v', 20, 8, 3), spec=0.25)
    c.paint(mask(rrect(PX - 70, GROUND - 90, PX + 70, GROUND, 24)), WOOD_D, radius=18, depth=1, spec=0.2)
    arm = mask(rrect(PX - 20, 560, PX + 420, 612, 20))
    c.paint(arm, WOOD_D, radius=16, depth=0.9, albedo=wood_grain('h', 18, 8, 4), spec=0.25)
    c.paint(mask(poly([(PX + 40, 612), (PX + 200, 612), (PX + 40, 760)])), WOOD_D, radius=14, depth=0.9, spec=0.2)
    LX, LY = PX + 360, 1000
    c.flat(mask(stroke([(LX, 612), (LX, 720)], 12)), hexrgb('#5a4636'), 1)
    c.paint(minus(mask(ellipse(LX, 730, 34, 34)), mask(ellipse(LX, 730, 18, 18))), hexrgb('#5a4636'), radius=8, depth=1.2, spec=0.5)
    glass = mask(poly([(LX - 130, 820), (LX + 130, 820), (LX + 150, 1150), (LX - 150, 1150)]))
    c.glow(glass, hexrgb('#ffd27a'), r=160, strength=0.55)
    c.paint(glass, hexrgb('#ffd47c'), radius=40, depth=0.5, ambient=0.95, spec=0.2, warm_shadow=hexrgb('#f7a948'))
    c.paint(mask(ellipse(LX, 1010, 50, 80)), hexrgb('#fff4cf'), radius=30, depth=0.4, ambient=1, spec=0)
    FR = hexrgb('#4a3a30')
    for pts in (((LX - 130, 820), (LX - 150, 1150)), ((LX + 130, 820), (LX + 150, 1150)), ((LX, 820), (LX, 1150))):
        c.paint(mask(stroke(list(pts), 22)), FR, radius=8, depth=1, spec=0.4)
    c.paint(mask(rrect(LX - 175, 1130, LX + 175, 1190, 18)), FR, radius=14, depth=1, spec=0.4)
    c.paint(mask(poly([(LX - 170, 830), (LX + 170, 830), (LX + 60, 740), (LX - 60, 740)])), FR, radius=16, depth=1, spec=0.4)
    c.paint(mask(ellipse(LX, 736, 46, 20)), FR, radius=10, depth=1, spec=0.5)
    # زهور صغيرة عند القاعدة
    grass(c, (PX - 60, PX + 60), seed=8)
    flower(c, PX - 150, GROUND - 120, hexrgb('#fbf6ec'), hexrgb('#f3b43a'), r=40)
    flower(c, PX + 150, GROUND - 90, hexrgb('#f7a8c4'), hexrgb('#f6c64d'), r=36)
    return c.save(path)


# ───────────── النافورة ─────────────
def fountain(path):
    c = Canvas()
    BX, RX, RY = CX, 760, 250
    TOPY = 1400
    tex = 1 + 0.14 * (noise(26, 3, 21) - 0.5)
    # جدار الحوض: حجارة
    wall = union(mask(ellipse(BX, GROUND - RY + 10, RX, RY)), mask(rrect(BX - RX, TOPY, BX + RX, GROUND - RY + 10, 0)))
    c.paint(wall, STONE, radius=40, depth=0.8, albedo=tex, spec=0.15)
    for row, y in enumerate((TOPY + 90, TOPY + 190, TOPY + 280)):
        c.flat(blur(mask(lambda d, y=y: d.arc([BX - RX, y - RY + 20, BX + RX, y + RY - 20], 0, 180, fill=255, width=10)), 2) * erode(wall, 6), STONE_D * 0.8, 0.55)
        for k in range(9):
            a = np.pi * (k + 0.5 * (row % 2)) / 9
            x = BX + np.cos(a) * RX * 0.98; yv = y + np.sin(a) * (RY - 20) - 45
            c.flat(blur(mask(stroke([(x, yv - 40), (x, yv + 40)], 9)), 2) * erode(wall, 6), STONE_D * 0.8, 0.5)
    rim = minus(mask(ellipse(BX, TOPY, RX + 30, RY + 20)), mask(ellipse(BX, TOPY + 6, RX - 60, RY - 50)))
    c.occlude(rim, dx=0, dy=20, r=22, strength=0.4)
    c.paint(rim, STONE * 1.04, radius=24, depth=0.9, albedo=tex, spec=0.25)
    water = mask(ellipse(BX, TOPY + 6, RX - 60, RY - 50))
    yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
    ripple = 1 + 0.06 * np.sin(np.hypot((xx - BX) / 1.0, (yy - TOPY) * 2.6) / 22)
    c.paint(water, hexrgb('#5fb6e8'), radius=30, depth=0.3, flat_normal=(0, -0.3, 1), albedo=ripple, spec=0.6, shin=30,
            warm_shadow=hexrgb('#3b86c4'))
    # العمود والطبق العلوي
    c.paint(mask(rrect(BX - 70, 860, BX + 70, TOPY + 40, 30)), STONE, radius=30, depth=0.9, albedo=tex, spec=0.2)
    bowl = mask(lambda d: d.chord([BX - 330, 700, BX + 330, 1020], 0, 180, fill=255))
    c.occlude(bowl, dx=0, dy=24, r=24, strength=0.4)
    c.paint(bowl, STONE * 1.02, radius=40, depth=1, albedo=tex, spec=0.25)
    c.paint(mask(ellipse(BX, 862, 330, 70)), hexrgb('#79c4ee'), radius=20, depth=0.4, spec=0.6, warm_shadow=hexrgb('#3b86c4'))
    c.paint(mask(rrect(BX - 30, 600, BX + 30, 870, 20)), STONE, radius=20, depth=1, albedo=tex, spec=0.2)
    # الماء: قوسان من القمة، وخيوط من حافة الطبق
    AQ = hexrgb('#bfe6ff')
    for s in (-1, 1):
        arc = bezier((BX, 600), (BX + s * 220, 420), (BX + s * 300, 840), n=40)
        c.flat(blur(mask(stroke(arc, 26)), 3), AQ, 0.8)
        for off in (0, 120, 220):
            drip = bezier((BX + s * (330 - off * 0.15), 870), (BX + s * (380 - off * 0.2), 1000), (BX + s * (400 - off * 0.3), TOPY), n=30)
            c.flat(blur(mask(stroke(drip, 16)), 3), AQ, 0.55)
    c.flat(blur(mask(ellipse(BX, 590, 40, 30)), 6), hexrgb('#ffffff'), 0.8)
    grass(c, (BX - RX - 20, BX + RX + 20), seed=12)
    return c.save(path)


# ───────────── قوس الرفاق ─────────────
def rainbow(path):
    c = Canvas()
    CXA, CY = CX, GROUND - 170
    bands = ['#a95c2b', '#8c9cb0', '#5fb0e6', '#f6b52a', '#66b947']     # بني رمادي أزرق ذهبي أخضر = الرفاق
    R0, BW = 820, 92
    for i, col in enumerate(bands):
        r = R0 - i * BW
        arc = mask(lambda d, r=r: d.arc([CXA - r, CY - r, CXA + r, CY + r], 180, 360, fill=255, width=BW + 4))
        c.paint(arc, hexrgb(col), radius=30, depth=0.8, spec=0.35)
    # غيمتان عند القدمين
    for s in (-1, 1):
        x = CXA + s * (R0 - 2 * BW)
        puffs = union(*(mask(ellipse(x + dx, GROUND - 120 + dy, r, r * 0.86)) for dx, dy, r in
                        ((-180, 10, 130), (-40, -70, 170), (120, 0, 140), (40, 40, 150), (-110, 60, 120))))
        c.occlude(puffs, dx=0, dy=22, r=26, strength=0.35)
        c.paint(puffs, hexrgb('#fbfaf5'), radius=60, depth=1.0, spec=0.2)
    # نجوم صغيرة
    for x, y, r in ((CXA - 420, 560, 34), (CXA + 380, 520, 28), (CXA, 360, 38)):
        star = [(x + np.cos(a) * (r if k % 2 == 0 else r * 0.45), y + np.sin(a) * (r if k % 2 == 0 else r * 0.45))
                for k, a in enumerate(np.linspace(-np.pi / 2, 3 * np.pi / 2, 10, endpoint=False))]
        c.paint(mask(poly(star)), hexrgb('#ffe27a'), radius=10, depth=1, spec=0.6)
    return c.save(path)


ALL = {'flowers': flowers, 'scarecrow': scarecrow, 'lantern': lantern, 'fountain': fountain, 'rainbow': rainbow}

if __name__ == '__main__':
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', '..', 'farm', 'decor')
    only = sys.argv[2:] or list(ALL)
    os.makedirs(out, exist_ok=True)
    for k in only:
        ALL[k](os.path.join(out, k + '.png'))
        print('✓', k)
