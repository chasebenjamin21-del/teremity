# Build the real map from every capture: zoomed-out frames as the base, middle-zoom screenshots and
# video frames on top, the cursor masked out of each frame.
import cv2, numpy as np, json, os, glob
os.chdir(os.path.dirname(os.path.abspath(__file__)))
R = {('frames/' + k + '.jpg'): v for k, v in json.load(open('reg_to_b010.json')).items()}
R.update(json.load(open('reg_new.json')))
S = 3.75
X0, X1, Y0, Y1 = 200, 1500, 0, 1180
CW, CH = int((X1 - X0) * S), int((Y1 - Y0) * S)
H, W = 1080, 1920


def ui_mask():
    m = np.full((H, W), 255, np.uint8)
    cv2.rectangle(m, (0, 0), (215, 110), 0, -1)
    cv2.rectangle(m, (1710, 25), (1910, 200), 0, -1)
    cv2.rectangle(m, (1675, 680), (1895, 740), 0, -1)
    cv2.circle(m, (1800, 940), 235, 0, -1)
    cv2.rectangle(m, (1585, 755), (1920, 1080), 0, -1)
    cv2.rectangle(m, (35, 970), (905, 1075), 0, -1)
    m[:4, :] = 0; m[1028:, :] = 0; m[:, :4] = 0; m[:, -4:] = 0
    return m


UI = ui_mask()


def hp(img):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
    return g - cv2.GaussianBlur(g, (0, 0), 6)


T = hp(cv2.imread('new/2026102100371500_s.jpg'))[449 - 40:449 + 40, 862 - 40:862 + 40]
cursor_log = {}


def frame_mask(img, name):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    m = UI.copy(); m[g < 14] = 0
    if any(s in name for s in ('a_036', 'a_037', 'a_038')):
        cv2.circle(m, (130, 830), 115, 0, -1); m[950:, :] = 0
    r = cv2.matchTemplate(hp(img), T, cv2.TM_CCOEFF_NORMED)
    _, mx, _, loc = cv2.minMaxLoc(r)
    if mx > 0.42:
        c = (loc[0] + 40, loc[1] + 40); cv2.circle(m, c, 46, 0, -1); cursor_log[name] = (round(mx, 2), c)
    return cv2.erode(m, np.ones((5, 5), np.uint8))


def canvasA(A):
    A = np.vstack([np.array(A, np.float64), [0, 0, 1]])
    T_ = np.array([[S, 0, -X0 * S], [0, S, -Y0 * S], [0, 0, 1]])
    return (T_ @ A)[:2]


def warp_box(name):
    """Warp one frame into the canvas, returning (y0, y1, x0, x1, image, mask) for its bounding box only."""
    img = cv2.imread(name)
    m = frame_mask(img, name)
    A = canvasA(R[name]['A'])
    pts = np.array([[0, 0, 1], [W, 0, 1], [0, H, 1], [W, H, 1]], np.float64) @ A.T
    x0 = max(int(np.floor(pts[:, 0].min())) - 2, 0); x1 = min(int(np.ceil(pts[:, 0].max())) + 2, CW)
    y0 = max(int(np.floor(pts[:, 1].min())) - 2, 0); y1 = min(int(np.ceil(pts[:, 1].max())) + 2, CH)
    if x1 <= x0 or y1 <= y0: return None
    B = A.copy(); B[0, 2] -= x0; B[1, 2] -= y0
    flag = cv2.INTER_AREA if R[name]['scale'] < 1 / S else cv2.INTER_CUBIC
    wi = cv2.warpAffine(img, B, (x1 - x0, y1 - y0), flags=flag, borderValue=0)
    wm = cv2.warpAffine(m, B, (x1 - x0, y1 - y0), flags=cv2.INTER_LINEAR, borderValue=0)
    return y0, y1, x0, x1, wi, wm


# 1) Base: median of every zoomed-out frame.
base_names = [n for n, v in R.items() if abs(v['scale'] - 1) < 0.01]
print('base frames', len(base_names))
w, h = X1 - X0, Y1 - Y0
stack = np.full((len(base_names), h, w, 3), np.nan, np.float32)
for i, n in enumerate(base_names):
    img = cv2.imread(n); m = frame_mask(img, n)
    A = np.array(R[n]['A'], np.float64); A[0, 2] -= X0; A[1, 2] -= Y0
    wi = cv2.warpAffine(img, A, (w, h), flags=cv2.INTER_LINEAR).astype(np.float32)
    wm = cv2.warpAffine(m, A, (w, h), flags=cv2.INTER_NEAREST) > 0
    stack[i][wm] = wi[wm]
med = np.nanmedian(stack, axis=0)
have = ~np.isnan(med[..., 0])
med = np.nan_to_num(med).astype(np.uint8)
del stack
acc = cv2.resize(med, (CW, CH), interpolation=cv2.INTER_CUBIC).astype(np.float32)
accm = cv2.resize((have * 255).astype(np.uint8), (CW, CH), interpolation=cv2.INTER_LINEAR).astype(np.float32) / 255
del med
print('base done')

old_mid = ['frames/b_0%d.jpg' % i for i in range(23, 30)]
vid = [f for f in sorted(glob.glob('vid/v_*.jpg')) if f in R and 0.25 < R[f]['scale'] < 0.28]
shots = [f for f in sorted(glob.glob('new/*.jpg')) if f in R and 0.25 < R[f]['scale'] < 0.28]
levels = [['frames/a_035.jpg'], old_mid + vid, shots, ['frames/a_034.jpg'], ['frames/a_001.jpg']]
for lv in levels:
    num = np.zeros((CH, CW, 3), np.float32); den = np.zeros((CH, CW), np.float32)
    for n in lv:
        r = warp_box(n)
        if r is None: continue
        y0, y1, x0, x1, wi, wm = r
        d = cv2.distanceTransform((wm > 127).astype(np.uint8), cv2.DIST_L2, 5)
        wgt = np.clip(d / 110.0, 0, 1)
        num[y0:y1, x0:x1] += wi.astype(np.float32) * wgt[..., None]; den[y0:y1, x0:x1] += wgt
    alpha = np.clip(den, 0, 1)
    nz = den > 1e-6
    lay = np.zeros_like(num); lay[nz] = num[nz] / den[nz][:, None]
    acc = acc * (1 - alpha[..., None]) + lay * alpha[..., None]
    accm = np.maximum(accm, alpha)
    del num, den, lay
    print('level done', len(lv))
cv2.imwrite('mosaic.png', np.clip(acc, 0, 255).astype(np.uint8)); cv2.imwrite('mosaic_mask.png', (accm * 255).astype(np.uint8))
json.dump(dict(S=S, X0=X0, Y0=Y0, X1=X1, Y1=Y1, CW=CW, CH=CH), open('mosaic_meta.json', 'w'))
json.dump(cursor_log, open('cursor_log.json', 'w'), indent=0)
print('cursors found', len(cursor_log))
