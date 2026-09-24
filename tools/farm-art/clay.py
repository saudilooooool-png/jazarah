"""
Warm Clay Light — محرك رسم «الطين الدافئ»

كل شكل يُرسم صورةً ظلية مسطحة، ثم «يُنفَخ» إلى خريطة ارتفاع
(تمويه غاوسي للقناع)، فتُحسب منها العموديات ويُضاء من اليسار الأعلى.
الناتج: أحجام ناعمة كالصلصال بلا خطوط خارجية سوداء.

يُرسم كل شيء على قماش ٢٠٤٨ ثم يُصغَّر إلى ١٠٢٤ لنعومة الحواف.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

S = 2048                         # مقاس العمل
OUT = 1024                       # مقاس التسليم
GROUND = int(S * 0.90)           # خط الأرض: القاعدة على ٩٠٪ من الارتفاع
CX = S // 2

# الضوء: أعلى اليسار، باتجاه المشاهد
_L = np.array([-0.46, -0.58, 0.67]); L = _L / np.linalg.norm(_L)
_H = L + np.array([0, 0, 1.0]); H = _H / np.linalg.norm(_H)


def hexrgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0


def mix(a, b, t):
    return a * (1 - t) + b * t


# ───────────── الأقنعة ─────────────

def mask(draw_fn, size=S):
    """يرسم على قناع أبيض/أسود ويعيده مصفوفة ٠..١"""
    im = Image.new('L', (size, size), 0)
    draw_fn(ImageDraw.Draw(im))
    return np.asarray(im, dtype=np.float32) / 255.0


def blur(a, r):
    if r <= 0:
        return a
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8), 'L')
    im = im.filter(ImageFilter.GaussianBlur(r))
    return np.asarray(im, dtype=np.float32) / 255.0


def blurf(a, r):
    """تمويه بدقة عالية (بلا تكميم ٨ بت) — للخرائط الارتفاعية"""
    if r <= 0:
        return a
    return gaussian_filter(a.astype(np.float32), sigma=r, mode='constant')


def bbox(m, pad=0):
    ys, xs = np.nonzero(m > 0.002)
    if len(ys) == 0:
        return None
    y0 = max(0, ys.min() - pad); y1 = min(m.shape[0], ys.max() + pad + 1)
    x0 = max(0, xs.min() - pad); x1 = min(m.shape[1], xs.max() + pad + 1)
    return y0, y1, x0, x1


def erode(m, r):
    """تآكل ناعم: يقلّص القناع بمقدار r تقريبًا"""
    return np.clip((blur(m, r) - 0.5) * 2.2 + 0.5, 0, 1) * m


# ───────────── الضوضاء والملمس ─────────────

_rng = np.random.default_rng(7)


def noise(scale, octaves=3, seed=0, size=S):
    """ضوضاء قيمية ناعمة ٠..١"""
    rng = np.random.default_rng(seed)
    out = np.zeros((size, size), np.float32); amp = 1.0; tot = 0.0
    s = scale
    for _ in range(octaves):
        n = max(2, int(size / s))
        g = rng.random((n, n)).astype(np.float32)
        im = Image.fromarray((g * 255).astype(np.uint8), 'L').resize((size, size), Image.BICUBIC)
        out += np.asarray(im, np.float32) / 255.0 * amp
        tot += amp; amp *= 0.5; s /= 2.2
    return out / tot


def wood_grain(direction='h', period=34, warp=18, seed=1, size=S):
    """عروق خشب: موجات تتلوّى بالضوضاء. تُرجع مُعامِلًا حول ١"""
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32)
    n = noise(260, 3, seed, size)
    axis = yy if direction == 'h' else xx
    g = np.sin((axis + n * warp * 6) / period * 2 * np.pi)
    fine = noise(40, 2, seed + 9, size)
    return 1 + 0.055 * g + 0.06 * (fine - 0.5)


# ───────────── التظليل ─────────────

def shade(m, color, radius=40, depth=1.0, ambient=0.50, spec=0.28, shin=26,
          albedo=None, rim=0.22, warm_shadow=None, profile=0.55, flat_normal=None):
    """
    يحوّل القناع m إلى طبقة ملوّنة مضاءة.
    radius  : نصف قطر «النفخ» — أكبر = أكثر استدارة
    depth   : قوة الانحناء
    profile : أس الارتفاع (أصغر = أكتاف أعرض كالوسادة)
    albedo  : مصفوفة مُعامِل للون (ملمس)
    flat_normal: عمودي أساسي لوجه مسطح (للصناديق) يُمزج مع الحواف
    """
    color = np.asarray(color, np.float32)
    bb = bbox(m, pad=int(radius * 2.5) + 4)
    rgb = np.zeros(m.shape + (3,), np.float32)
    if bb is None:
        return rgb, np.zeros_like(m)
    y0, y1, x0, x1 = bb
    mm = m[y0:y1, x0:x1]
    h = blurf(mm, radius)
    h = np.clip(h, 0, 1) ** profile * mm
    gy, gx = np.gradient(h)
    k = depth * radius * 2.2
    nx, ny = -gx * k, -gy * k
    if flat_normal is not None:
        fn = np.asarray(flat_normal, np.float32); fn = fn / np.linalg.norm(fn)
        nz = np.ones_like(nx) * fn[2]
        nx = nx + fn[0]; ny = ny + fn[1]
    else:
        nz = np.ones_like(nx)
    ln = np.sqrt(nx * nx + ny * ny + nz * nz)
    nx, ny, nz = nx / ln, ny / ln, nz / ln
    diff = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
    sp = np.clip(nx * H[0] + ny * H[1] + nz * H[2], 0, 1) ** shin
    # ظل دافئ لا رمادي
    if warm_shadow is not None:
        ws = warm_shadow
    elif color.mean() > 0.86:          # الأبيض يبقى أبيض دافئًا في الظل لا رماديًا
        ws = color * np.array([0.86, 0.80, 0.72], np.float32)
    else:
        ws = color * np.array([0.62, 0.48, 0.42], np.float32)
    lit = color * 1.08
    t = (ambient + (1 - ambient) * diff)[..., None]
    c = mix(ws, lit, np.clip((t - 0.35) / 0.75, 0, 1))
    # انسداد لطيف قرب الحواف (بلا خط أسود)
    ao = (0.82 + 0.18 * np.clip(blurf(mm, radius * 0.35), 0, 1))[..., None]
    c = c * ao
    # ضوء ارتدادي دافئ من الأسفل
    bounce = np.clip(ny, 0, 1) ** 2 * rim
    c = c + bounce[..., None] * np.array([1.0, 0.72, 0.42], np.float32) * 0.35
    if albedo is not None:
        c = c * albedo[y0:y1, x0:x1][..., None]
    c = c + (sp * spec)[..., None]
    rgb[y0:y1, x0:x1] = np.clip(c, 0, 1)
    return rgb, m


# ───────────── القماش ─────────────

class Canvas:
    def __init__(self, size=S):
        self.rgb = np.zeros((size, size, 3), np.float32)
        self.a = np.zeros((size, size), np.float32)

    def over(self, rgb, a, opacity=1.0):
        a = a * opacity
        out_a = a + self.a * (1 - a)
        safe = np.where(out_a > 1e-5, out_a, 1)
        self.rgb = (rgb * a[..., None] + self.rgb * (self.a * (1 - a))[..., None]) / safe[..., None]
        self.a = out_a

    def paint(self, m, color, **kw):
        rgb, a = shade(m, color, **kw)
        self.over(rgb, a)
        return m

    def flat(self, m, color, opacity=1.0):
        rgb = np.broadcast_to(np.asarray(color, np.float32), m.shape + (3,)).copy()
        self.over(rgb, m, opacity)

    def occlude(self, m, dx=10, dy=18, r=26, strength=0.38, color=(0.35, 0.18, 0.08)):
        """ظل تلامس: يُعتم ما تحت الشكل القادم (على البكسلات الموجودة فقط)"""
        sh = np.roll(np.roll(m, dy, 0), dx, 1)
        sh = blur(sh, r) * strength * self.a
        col = np.asarray(color, np.float32)
        self.rgb = self.rgb * (1 - sh[..., None]) + col * sh[..., None] * 0.5

    def glow(self, m, color, r=80, strength=0.6):
        """توهّج مضاف بشفافية — يبقى حول المصباح فقط"""
        g = blur(m, r) * strength
        col = np.asarray(color, np.float32)
        self.over(np.broadcast_to(col, m.shape + (3,)).copy(), np.clip(g, 0, 1))

    def save(self, path):
        a = np.clip(self.a, 0, 1)
        rgba = np.dstack([np.clip(self.rgb, 0, 1) * a[..., None], a])
        im = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), 'RGBa')
        im = im.resize((OUT, OUT), Image.LANCZOS).convert('RGBA')
        im.save(path, optimize=True)
        return im


# ───────────── أشكال مساعدة ─────────────

def ellipse(cx, cy, rx, ry):
    return lambda d: d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)


def poly(pts):
    return lambda d: d.polygon([tuple(map(float, p)) for p in pts], fill=255)


def rrect(x0, y0, x1, y1, r):
    return lambda d: d.rounded_rectangle([x0, y0, x1, y1], radius=r, fill=255)


def stroke(pts, w):
    """خط سميك بنهايات مستديرة"""
    def f(d):
        pts2 = [tuple(map(float, p)) for p in pts]
        d.line(pts2, fill=255, width=int(w), joint='curve')
        for p in (pts2[0], pts2[-1]):
            d.ellipse([p[0] - w / 2, p[1] - w / 2, p[0] + w / 2, p[1] + w / 2], fill=255)
    return f


def tapered(pts, w0, w1):
    """شريط يضيق من w0 إلى w1 على طول المسار (للذيل والأوراق)"""
    def f(d):
        n = len(pts)
        for i in range(n):
            t = i / max(1, n - 1)
            w = w0 + (w1 - w0) * t
            x, y = pts[i]
            d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=255)
    return f


def bezier(p0, p1, p2, p3=None, n=80):
    t = np.linspace(0, 1, n)[:, None]
    p0, p1, p2 = map(np.asarray, (p0, p1, p2))
    if p3 is None:
        pts = (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2
    else:
        p3 = np.asarray(p3)
        pts = (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3
    return [tuple(p) for p in pts]


def union(*ms):
    out = np.zeros_like(ms[0])
    for m in ms:
        out = np.maximum(out, m)
    return out


def minus(a, b):
    return np.clip(a - b, 0, 1)


def leaf_pts(base, tip, width, n=40):
    """ورقة: قوسان متقابلان من القاعدة إلى الطرف"""
    base = np.asarray(base, np.float32); tip = np.asarray(tip, np.float32)
    v = tip - base; ln = np.linalg.norm(v); u = v / ln; p = np.array([-u[1], u[0]])
    t = np.linspace(0, 1, n)
    prof = np.sin(np.pi * t ** 0.85) * width / 2
    left = [tuple(base + u * ln * ti + p * w) for ti, w in zip(t, prof)]
    right = [tuple(base + u * ln * ti - p * w) for ti, w in zip(t[::-1], prof[::-1])]
    return left + right


def carrot_pts(top, tip, width, n=50):
    """جزرة: أعرض عند الأعلى بكتف مستدير، ثم تستدق نحو الطرف"""
    top = np.asarray(top, np.float32); tip = np.asarray(tip, np.float32)
    v = tip - top; ln = np.linalg.norm(v); u = v / ln; p = np.array([-u[1], u[0]])
    t = np.linspace(0, 1, n)
    prof = np.where(t < 0.18, np.sqrt(np.clip(1 - ((0.18 - t) / 0.18) ** 2, 0, 1)), np.clip(1 - (t - 0.18) / 0.82, 0, 1) ** 0.9)
    prof = prof * width / 2 + 2
    left = [tuple(top + u * ln * ti + p * w) for ti, w in zip(t, prof)]
    right = [tuple(top + u * ln * ti - p * w) for ti, w in zip(t[::-1], prof[::-1])]
    return left + right
