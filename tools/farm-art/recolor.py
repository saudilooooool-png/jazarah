"""
إعادة تلوين الرفاق من الأصول المرسومة بالذكاء الاصطناعي (egg_brown, baby_brown)
بدل رسمها من جديد: نفس الجودة ونفس الملامح، بلون آخر.

- قناع مكاني مرسوم يدويًا يحيط بالكائن وحده، فلا يتلوّن العش.
- التشبّع فوق ٠٫٧٥ فقط يتغير: البطن الكريمي ووسائد الأقدام والبقع الفاتحة تبقى.
- الأوراق خارج مدى الصبغة فتبقى خضراء، والعينان مستثناتان: كهرمانيتان في كل لون.
"""
import os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), '..', '..', 'farm', 'companions')


def rgb_to_hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = rgb.max(-1); mn = rgb.min(-1); d = mx - mn
    h = np.zeros_like(mx)
    nz = d > 1e-6
    rr = nz & (mx == r); gg = nz & (mx == g) & ~rr; bb = nz & ~rr & ~gg
    h[rr] = ((g - b)[rr] / d[rr]) % 6
    h[gg] = (b - r)[gg] / d[gg] + 2
    h[bb] = (r - g)[bb] / d[bb] + 4
    h = h * 60
    s = np.where(mx > 1e-6, d / np.maximum(mx, 1e-6), 0)
    return h, s, mx


def hsv_to_rgb(h, s, v):
    h = (h % 360) / 60.0
    i = np.floor(h).astype(int) % 6
    f = h - np.floor(h)
    p = v * (1 - s); q = v * (1 - s * f); t = v * (1 - s * (1 - f))
    out = np.zeros(h.shape + (3,), np.float32)
    for k, (a, b, c) in enumerate(((v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q))):
        m = i == k
        out[..., 0][m] = a[m]; out[..., 1][m] = b[m]; out[..., 2][m] = c[m]
    return out


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# ── الأقنعة: الكائن وحده، بإحداثيات الصورة الأصلية
def mask_baby(W):
    k = W / 512
    im = Image.new('L', (W, W), 0); d = ImageDraw.Draw(im)
    E = lambda cx, cy, rx, ry: d.ellipse([(cx - rx) * k, (cy - ry) * k, (cx + rx) * k, (cy + ry) * k], fill=255)
    P = lambda pts: d.polygon([(x * k, y * k) for x, y in pts], fill=255)
    E(252, 172, 116, 104)                                  # الرأس (مع الأذنين الجانبيتين)
    E(146, 206, 16, 18); E(356, 222, 16, 18)
    P([(160, 30), (360, 30), (360, 140), (160, 140)])      # تاج الأوراق (يحميه مدى الصبغة)
    P([(110, 340), (148, 262), (196, 258), (204, 322), (182, 348)])   # الجناح الأيسر
    P([(322, 258), (366, 260), (398, 302), (394, 342), (338, 330)])   # الجناح الأيمن
    E(257, 322, 96, 74)                                    # الجسم
    E(158, 390, 34, 26); E(298, 398, 36, 26)               # القدمان
    E(170, 362, 32, 32); E(338, 366, 32, 32)               # الفخذان
    E(150, 240, 22, 20); E(348, 244, 22, 20)               # زاويتا الفك
    d.rectangle([0, 404 * k, W, W], fill=0)                # خيوط العش الأمامية تحت البطن
    E(158, 390, 34, 24); E(298, 398, 36, 24)
    # العينان تبقيان كهرمانيتين
    for cx, cy in ((193, 199), (297, 203)):
        d.ellipse([(cx - 21) * k, (cy - 22) * k, (cx + 21) * k, (cy + 22) * k], fill=0)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(2 * k)), np.float32) / 255


def mask_egg(W, rgb):
    k = W / 1024
    im = Image.new('L', (W, W), 0); d = ImageDraw.Draw(im)
    d.ellipse([268 * k, 100 * k, 768 * k, 692 * k], fill=255)
    m = np.asarray(im.filter(ImageFilter.GaussianBlur(2 * k)), np.float32) / 255
    # خيوط القش التي تمر أمام أسفل البيضة: أفتح وأميل للأصفر
    h, s, v = rgb_to_hsv(rgb)
    yy = np.mgrid[0:W, 0:W][0]
    straw = (yy > 540 * k) & (h > 27) & (v > 0.72)
    m = m * np.where(straw, 0, 1)
    return m


# ── الألوان: (صبغة الهدف، مُعامِل التشبّع، مُعامِل الإضاءة، تمدد الصبغة)
TONES = {
    'grey':  (214, 0.20, 0.90, 0.2),
    'blue':  (206, 0.82, 0.96, 0.6),
    'gold':  (44,  0.92, 1.12, 0.25),
    'green': (122, 0.62, 0.86, 0.55),
}


def recolor(src, mask_fn, tone, out):
    im = Image.open(src).convert('RGBA')
    arr = np.asarray(im).astype(np.float32) / 255
    rgb, a = arr[..., :3], arr[..., 3]
    W = arr.shape[0]
    m = mask_fn(W) if mask_fn is mask_baby else mask_fn(W, rgb)
    h, s, v = rgb_to_hsv(rgb)
    target, sk, vk, spread = TONES[tone]
    # الوزن: داخل القناع × صبغة برتقالية × تشبّع عالٍ (البطن والوسائد تبقى)
    hue_w = smooth(h, 4, 12) * (1 - smooth(h, 40, 50))
    if mask_fn is mask_egg:
        # البيضة كلها تتلون، وبقعها الفاتحة تصير درجة أفتح من اللون الجديد
        sat_w = smooth(s, 0.18, 0.32)
        cream = 0
    else:
        # الجلد المضاء أقل تشبعًا؛ الكريمي (البطن والوسائد) فاتح وضعيف التشبع فيبقى
        sat_w = smooth(s, 0.48, 0.62)
        cream = smooth(v, 0.84, 0.92) * (1 - smooth(s, 0.64, 0.74))
        # الكريمي محصور في البطن والأقدام؛ لمعات الوجه والحاجبين تتلون مع الجلد
        yy = np.mgrid[0:W, 0:W][0]
        cream = cream * (yy > 250 * W / 512)
    w = m * hue_w * sat_w * (1 - cream)
    h2 = target + (h - 22) * spread
    if tone == 'gold':
        h2 = h2 - (1 - v) * 20      # ظلال الذهب تميل للبرتقالي لا للزيتوني
    s2 = np.clip(s * sk, 0, 1)
    v2 = np.clip(v * vk, 0, 1)
    new = hsv_to_rgb(h2, s2, v2)
    rgb2 = rgb * (1 - w[..., None]) + new * w[..., None]
    img = Image.fromarray((np.dstack([rgb2, a]) * 255 + 0.5).astype(np.uint8), 'RGBA')
    if tone == 'gold':
        # الذهبي متوهج بلطف: هالة دافئة خلف الكائن
        alpha = img.split()[3]
        cm = Image.fromarray((m * 255).astype(np.uint8)).resize(alpha.size)
        halo = Image.new('RGBA', img.size, (255, 214, 110, 0))
        glow = Image.composite(Image.new('L', img.size, 150), Image.new('L', img.size, 0), cm).filter(ImageFilter.GaussianBlur(W * 0.035))
        halo.putalpha(glow)
        base = Image.new('RGBA', img.size, (0, 0, 0, 0))
        base.alpha_composite(halo); base.alpha_composite(img)
        img = base
    img.save(out, optimize=True)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else ROOT
    for tone in TONES:
        recolor(os.path.join(ROOT, 'egg_brown.png'), mask_egg, tone, os.path.join(out, f'egg_{tone}.png'))
        recolor(os.path.join(ROOT, 'baby_brown.png'), mask_baby, tone, os.path.join(out, f'baby_{tone}.png'))
        print('✓', tone)
