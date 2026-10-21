# Register the new Switch screenshots and video frames against the current mosaic (3x the reference frame).
import cv2, numpy as np, glob, json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
ref = cv2.imread('mosaic.png')
meta = json.load(open('mosaic_meta.json'))
S0, X0, Y0 = meta['S'], meta['X0'], meta['Y0']
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
sift = cv2.SIFT_create(nfeatures=40000)
g = cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY)
rm = cv2.imread('mosaic_mask.png', 0)
kr, dr = sift.detectAndCompute(g, (rm > 128).astype(np.uint8) * 255)
print('ref features', len(kr))
flann = cv2.FlannBasedMatcher(dict(algorithm=1, trees=5), dict(checks=64))
sift2 = cv2.SIFT_create(nfeatures=8000)
out = {}
files = sorted(glob.glob('new/*.jpg')) + sorted(glob.glob('vid/v_*.jpg'))
for f in files:
    img = cv2.imread(f)
    k, d = sift2.detectAndCompute(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), UI)
    if d is None or len(k) < 20: print(f, 'no feats'); continue
    m = flann.knnMatch(d, dr, k=2)
    good = [a for a, b in m if a.distance < 0.72 * b.distance]
    if len(good) < 15: print(f, 'few', len(good)); continue
    src = np.float32([k[a.queryIdx].pt for a in good]); dst = np.float32([kr[a.trainIdx].pt for a in good])
    A, inl = cv2.estimateAffinePartial2D(src, dst, method=cv2.RANSAC, ransacReprojThreshold=4.0, maxIters=8000)
    ni = int(inl.sum()) if inl is not None else 0
    if A is None or ni < 15: print(f, 'fail', ni); continue
    # mosaic px -> reference px:  ref = mos / S0 + (X0, Y0)
    A2 = A / S0; A2[0, 2] += X0; A2[1, 2] += Y0
    s = float(np.hypot(A2[0, 0], A2[1, 0]))
    out[f] = dict(A=A2.tolist(), scale=s, inl=ni, good=len(good))
    print(os.path.basename(f), 'scale %.3f inl %d/%d' % (s, ni, len(good)))
json.dump(out, open('reg_new.json', 'w'))
