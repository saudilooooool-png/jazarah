"""صندوق المفاجأة — شكل واحد، خمسة ألوان"""
import numpy as np
from clay import *

BOXES = {
    #            الصندوق     الشريط
    'brown': ('#a95c2b', '#f5c64a'),
    'grey':  ('#8c9cb0', '#f28a3a'),
    'blue':  ('#5fb0e6', '#fbfaf3'),
    'gold':  ('#f6b52a', '#fffdf6'),
    'green': ('#66b947', '#f59cc3'),
}

# ── الهندسة: مكعب بمنظور ثلاثة أرباع، والكاميرا أعلى قليلًا ليظهر السطح
W, HB = 800, 640            # عرض الوجه الأمامي وارتفاع الجسم
DX, DY = 300, -185          # عمق الصندوق (نحو اليمين وللخلف)
LH, OV = 176, 28            # ارتفاع الغطاء وبروزه
X0 = CX - (W + DX) // 2
Y1 = GROUND - 12
Y0 = Y1 - HB


def quad(*pts):
    return mask(poly(pts))


def band_on(face_pts, a0, a1, b0, b1):
    """شريط داخل وجه رباعي: نسب على الضلعين المتقابلين"""
    p0, p1, p2, p3 = [np.array(p, np.float32) for p in face_pts]
    def lerp(u, v, t): return u + (v - u) * t
    q = [lerp(p0, p1, a0), lerp(p0, p1, a1), lerp(p3, p2, b1), lerp(p3, p2, b0)]
    return quad(*[tuple(x) for x in q])


def rot_ellipse(cx, cy, rx, ry, ang, n=90):
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    ca, sa = np.cos(ang), np.sin(ang)
    x = rx * np.cos(t); y = ry * np.sin(t)
    return [(cx + x[i] * ca - y[i] * sa, cy + x[i] * sa + y[i] * ca) for i in range(n)]


def ribbon_tail(root, tip, w):
    """ذيل شريط مستقيم بطرف مشقوق V"""
    r = np.array(root, np.float32); t = np.array(tip, np.float32)
    v = t - r; ln = np.linalg.norm(v); u = v / ln; p = np.array([-u[1], u[0]])
    a = r + p * w * 0.42; b = r - p * w * 0.42
    c_ = t + p * w * 0.55; d = t - p * w * 0.55
    notch = t - u * w * 0.55
    return [tuple(a), tuple(c_), tuple(notch), tuple(d), tuple(b)]


def render(name, body_hex, ribbon_hex, path):
    body = hexrgb(body_hex); rib = hexrgb(ribbon_hex)
    c = Canvas()
    g = 1.9 if name == 'gold' else 1.0     # الذهبي الأجمل: لمعة معدنية
    tex = 1 + 0.03 * (noise(90, 3, 3) - 0.5)
    FN = (-0.10, 0.02, 1); SN = (0.95, -0.18, 0.55); TN = (-0.08, -0.95, 0.5)

    # ── جسم الصندوق
    F = [(X0, Y0), (X0 + W, Y0), (X0 + W, Y1), (X0, Y1)]
    R = [(X0 + W, Y0), (X0 + W + DX, Y0 + DY), (X0 + W + DX, Y1 + DY), (X0 + W, Y1)]
    c.paint(quad(*R), body * 0.84, radius=26, depth=0.55, flat_normal=SN, albedo=tex, spec=0.25 * g, shin=22)
    c.paint(quad(*F), body, radius=26, depth=0.55, flat_normal=FN, albedo=tex, spec=0.3 * g, shin=22)
    c.paint(band_on(R, 0.42, 0.58, 0.42, 0.58), rib * 0.9, radius=14, depth=0.8, flat_normal=SN, spec=0.4)
    c.paint(band_on(F, 0.43, 0.57, 0.43, 0.57), rib, radius=14, depth=0.8, flat_normal=FN, spec=0.45)

    # ── الغطاء
    lx0, lx1 = X0 - OV, X0 + W + OV
    ly1 = Y0 + 18; ly0 = ly1 - LH
    LF = [(lx0, ly0), (lx1, ly0), (lx1, ly1), (lx0, ly1)]
    LR = [(lx1, ly0), (lx1 + DX, ly0 + DY), (lx1 + DX, ly1 + DY), (lx1, ly1)]
    LT = [(lx0, ly0), (lx0 + DX, ly0 + DY), (lx1 + DX, ly0 + DY), (lx1, ly0)]
    c.occlude(union(quad(*LF), quad(*LR)), dx=0, dy=26, r=26, strength=0.6)
    c.paint(quad(*LR), body * 0.9, radius=26, depth=0.6, flat_normal=SN, albedo=tex, spec=0.28 * g)
    c.paint(quad(*LF), body * 1.04, radius=26, depth=0.6, flat_normal=FN, albedo=tex, spec=0.34 * g)
    c.paint(quad(*LT), body * 1.14, radius=26, depth=0.6, flat_normal=TN, albedo=tex, spec=0.38 * g)
    c.paint(band_on(LR, 0.42, 0.58, 0.42, 0.58), rib * 0.92, radius=12, depth=0.8, flat_normal=SN, spec=0.45)
    c.paint(band_on(LF, 0.43, 0.57, 0.43, 0.57), rib, radius=12, depth=0.8, flat_normal=FN, spec=0.5)
    t1 = band_on([LT[0], LT[3], LT[2], LT[1]], 0.43, 0.57, 0.43, 0.57)   # أمام ↔ خلف
    t2 = band_on([LT[0], LT[1], LT[2], LT[3]], 0.43, 0.57, 0.43, 0.57)   # يسار ↔ يمين
    c.paint(union(t1, t2), rib * 1.05, radius=12, depth=0.8, flat_normal=TN, spec=0.55)

    # ── لمعة الحواف: خطوط ضوء رفيعة على حواف الغطاء العليا
    for a_, b_, op in (((lx0 + 22, ly0 + 6), (lx1 - 12, ly0 + 6), 0.42),
                       ((lx1 + 10, ly0 - 4), (lx1 + DX - 14, ly0 + DY + 8), 0.30),
                       ((lx0 + 10, ly0 - 4), (lx0 + DX - 10, ly0 + DY + 6), 0.22)):
        c.flat(blur(mask(stroke([a_, b_], 8)), 3), np.array([1, 1, 1]), op)

    # ── الفيونكة في مركز السطح
    kx = (lx0 + lx1) / 2 + DX / 2; ky = ly0 + DY / 2
    for sgn, tip in ((-1, (kx - 150, ky + 150)), (1, (kx + 175, ky + 128))):
        tm = mask(poly(ribbon_tail((kx, ky + 10), tip, 104)))
        c.occlude(tm, dx=6, dy=16, r=18, strength=0.5)
        # الذيل يرقد على السطح: عموديه للأعلى، مع ثنية طولية تعطيه حجمًا
        c.paint(tm, rib * 0.98, radius=26, depth=1.3, profile=0.8, flat_normal=TN, spec=0.5)
        crease = mask(stroke([(kx + sgn * 20, ky + 24), (tip[0] - sgn * 8, tip[1] - 30)], 10)) * tm
        c.flat(blur(crease, 5), rib * 0.72, 0.45)
    for sgn in (-1, 1):
        cx_, cy_ = kx + sgn * 175, ky - 78
        ang = -sgn * 0.42
        outer = mask(poly(rot_ellipse(cx_, cy_, 190, 118, ang)))
        c.occlude(outer, dx=8, dy=22, r=28, strength=0.5)
        c.paint(outer, rib, radius=46, depth=1.15, spec=0.6, shin=30)
        # فتحة الحلقة: شق ضيق دافئ نحو العقدة لا ثقب كبير
        slit = mask(poly(rot_ellipse(kx + sgn * 118, ky - 58, 86, 26, ang)))
        c.paint(slit, rib * 0.7, radius=16, depth=0.25, spec=0.03)
    knot = mask(poly(rot_ellipse(kx, ky - 30, 82, 70, 0)))
    c.occlude(knot, dx=4, dy=10, r=16, strength=0.45)
    c.paint(knot, rib * 1.02, radius=38, depth=1.15, spec=0.65, shin=34)

    # ── وسام الجزرة على الشريط الأمامي
    mx = X0 + W / 2; my = (Y0 + Y1) / 2 + 30
    medal = mask(ellipse(mx, my, 116, 116))
    c.occlude(medal, dx=6, dy=14, r=20, strength=0.45)
    c.paint(medal, rib * 0.92, radius=28, depth=0.95, spec=0.55)
    c.paint(mask(ellipse(mx, my, 92, 92)), rib * 0.99, radius=10, depth=-0.6, spec=0.25)
    for dx_, tip in ((-6, (mx - 60, my - 112)), (6, (mx - 6, my - 124)), (14, (mx + 40, my - 104))):
        c.paint(mask(poly(leaf_pts((mx - 18 + dx_ * 0.5, my - 40), tip, 40))), hexrgb('#6fae3a'), radius=10, depth=0.9, spec=0.3)
    c.paint(mask(poly(carrot_pts((mx - 18, my - 50), (mx + 30, my + 74), 76))), hexrgb('#f07a22'), radius=18, depth=1.0, spec=0.5)
    for i, yy in enumerate((my - 8, my + 18, my + 42)):
        c.flat(mask(stroke([(mx - 10 + i * 6, yy), (mx + 8 + i * 6, yy - 4)], 5)), hexrgb('#b8520f'), 0.55)

    return c.save(path)


if __name__ == '__main__':
    import sys, os
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    for n, (b, r) in BOXES.items():
        render(n, b, r, os.path.join(out, f'box_{n}.png'))
        print('✓ box_' + n)
