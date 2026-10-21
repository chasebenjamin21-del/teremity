import cv2, numpy as np, json, os, shutil
from PIL import Image
os.chdir(os.path.dirname(os.path.abspath(__file__)))
m = cv2.imread('mosaic.png'); a = cv2.imread('mosaic_mask.png', 0)
meta = json.load(open('mosaic_meta.json'))
hole = (a < 128).astype(np.uint8) * 255
sm = cv2.resize(m, (m.shape[1] // 3, m.shape[0] // 3), interpolation=cv2.INTER_AREA)
sh = cv2.dilate(cv2.resize(hole, (sm.shape[1], sm.shape[0]), interpolation=cv2.INTER_NEAREST), np.ones((3, 3), np.uint8))
fill = cv2.inpaint(sm, sh, 9, cv2.INPAINT_TELEA)
big = cv2.resize(fill, (m.shape[1], m.shape[0]), interpolation=cv2.INTER_CUBIC)
al = cv2.GaussianBlur((a / 255.0).astype(np.float32), (0, 0), 6)[..., None]
out = (m * al + big * (1 - al)).astype(np.uint8)
# Fade the outer edge into the game's fog colour so the picture blends into the map background.
Hh, Ww = out.shape[:2]; F = 110
yy = np.minimum(np.arange(Hh), Hh - 1 - np.arange(Hh)) / F; xx = np.minimum(np.arange(Ww), Ww - 1 - np.arange(Ww)) / F
edge = np.clip(np.minimum(yy[:, None], xx[None, :]), 0, 1).astype(np.float32)
edge = (edge * edge * (3 - 2 * edge))[..., None]
fog = np.array([84, 90, 92], np.float32)
out = (out * edge + fog * (1 - edge)).astype(np.uint8)
cv2.imwrite('final.png', out)
shutil.rmtree('out', ignore_errors=True); os.makedirs('out')
rgb = Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))
X0, X1, Y0, Y1 = meta['X0'], meta['X1'], meta['Y0'], meta['Y1']
cx = (8.14331346510872, -84.40688671605575); cy = (8.198603368466692, -766.2665812400513)
wx0 = (X0 - cx[1]) / cx[0]; wx1 = (X1 - cx[1]) / cx[0]; wy0 = (Y0 - cy[1]) / cy[0]; wy1 = (Y1 - cy[1]) / cy[0]
rgb.resize((1300, 1180), Image.LANCZOS).save('out/lo.webp', quality=74, method=6)
cols, rows = 5, 5; W, H = rgb.size; tw, th = W // cols, H // rows
tiles = []
for r in range(rows):
    for c in range(cols):
        x0 = c * tw; y0 = r * th; x1 = W if c == cols - 1 else x0 + tw; y1 = H if r == rows - 1 else y0 + th
        fn = f'hi-{r}-{c}.webp'
        rgb.crop((x0, y0, x1, y1)).save('out/' + fn, quality=80, method=6)
        tiles.append(dict(f=fn, x=round(wx0 + (wx1 - wx0) * x0 / W, 4), y=round(wy0 + (wy1 - wy0) * y0 / H, 4), w=round((wx1 - wx0) * (x1 - x0) / W, 4), h=round((wy1 - wy0) * (y1 - y0) / H, 4)))
json.dump(dict(bounds=[round(v, 4) for v in (wx0, wy0, wx1, wy1)], lo='lo.webp', tiles=tiles, source="Stitched from Chase's own Switch 2 captures of the in-game map"), open('out/realmap.json', 'w'), indent=1)
cv2.imwrite('final_prev.jpg', cv2.resize(out, (1300, 1180), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 80])
print('ok', [wx0, wy0, wx1, wy1])
