import cv2, numpy as np, glob, json, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
F='frames/'
ref=cv2.imread(F+'b_010.jpg')
H,W=ref.shape[:2]
# UI mask for a full-screen map frame (255 = usable map)
def ui_mask():
    m=np.full((H,W),255,np.uint8)
    cv2.rectangle(m,(0,0),(210,105),0,-1)          # Map icon + label
    cv2.rectangle(m,(1715,30),(1905,195),0,-1)     # compass
    cv2.rectangle(m,(1680,685),(1890,735),0,-1)    # time of day
    cv2.circle(m,(1800,940),230,0,-1)              # dial
    cv2.rectangle(m,(1590,760),(1920,1080),0,-1)
    cv2.rectangle(m,(40,975),(900,1070),0,-1)      # button help
    return m
UI=ui_mask()
sift=cv2.SIFT_create(nfeatures=8000)
def feats(img,mask=None):
    g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    return sift.detectAndCompute(g,mask)
kr,dr=feats(ref,UI)
bf=cv2.BFMatcher()
def reg(img, kr=kr, dr=dr):
    k,d=feats(img,UI)
    m=bf.knnMatch(d,dr,k=2)
    good=[a for a,b in m if a.distance<0.75*b.distance]
    if len(good)<12: return None,len(good),0
    src=np.float32([k[a.queryIdx].pt for a in good]); dst=np.float32([kr[a.trainIdx].pt for a in good])
    A,inl=cv2.estimateAffinePartial2D(src,dst,method=cv2.RANSAC,ransacReprojThreshold=3.0,maxIters=5000)
    return A,len(good),int(inl.sum()) if inl is not None else 0
out={}
for f in sorted(glob.glob(F+'[ab]_*.jpg')):
    n=os.path.basename(f)[:-4]
    img=cv2.imread(f)
    A,ng,ni=reg(img)
    if A is None: print(n,'fail',ng); continue
    s=float(np.hypot(A[0,0],A[1,0]))
    out[n]=dict(A=A.tolist(),scale=s,good=ng,inl=ni)
    print(n,'scale %.3f tx %.1f ty %.1f inl %d/%d'%(s,A[0,2],A[1,2],ni,ng))
json.dump(out,open('reg_to_b010.json','w'))
