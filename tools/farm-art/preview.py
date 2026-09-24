"""معاينة: يضع الرسمة على خلفية فاتحة وأخرى خضراء كالمزرعة"""
import sys
from PIL import Image
def prev(paths, out, size=512):
    ims=[Image.open(p).convert('RGBA').resize((size,size),Image.LANCZOS) for p in paths]
    W=Image.new('RGBA',(size*len(ims),size*2))
    for i,im in enumerate(ims):
        for j,bg in enumerate([(246,238,222,255),(122,168,86,255)]):
            b=Image.new('RGBA',(size,size),bg); b.alpha_composite(im); W.paste(b,(i*size,j*size))
    W.convert('RGB').save(out)
if __name__=='__main__': prev(sys.argv[2:],sys.argv[1])
