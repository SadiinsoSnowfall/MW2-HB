import argparse, os, sys
import matplotlib.pyplot as plt
import numpy as np
from collections import deque 
from cv2 import cv2

blank = np.asarray([255, 255, 255, 0])

def to_output(in_path):
    split = os.path.splitext(in_path)
    return split[0] + ".out" + split[1]

def display_img(im):
    plt.imshow(cv2.cvtColor(im, cv2.COLOR_BGR2RGB))
    plt.show()

def in_bounds(h, w, y, x):
    return x >= 0 and x < w and y >= 0 and y < h

def flood_query_inter(im, mask, h, w, y, x):
    todo = deque()
    todo.append((y, x))
    while len(todo) > 0:
        (y, x) = todo.popleft()
        if in_bounds(h, w, y, x) and mask[y, x] == False and np.not_equal(im[y, x], blank).any():
            mask[y, x] = True
            todo.append((y + 1, x))
            todo.append((y, x + 1))
            todo.append((y - 1, x))
            todo.append((y, x - 1))

def flood_query(im, h, w, y, x):
    mask = np.zeros((h, w)) != 0
    np.asarray(flood_query_inter(im, mask, h, w, y, x))
    im[mask] = blank # remove part from image
    mi = np.where(mask == True)
    pmin = (np.amin(mi[0]), np.amin(mi[1]))
    pmax = (np.amax(mi[0]), np.amax(mi[1]))
    size = np.asarray([pmax[0] - pmin[0], pmax[1] - pmin[1]])
    return (mi, pmin, pmax, size) # return the part mask, size and bounding box
    
def analyze(im):
    h = im.shape[0]
    w = im.shape[1]
    parts = []
    for y in range(h):
        for x in range(w):
            pxl = im[y, x]
            if np.not_equal(pxl, blank).any():
                parts.append(flood_query(im, h, w, y, x))

    return parts

def compute_bb(sprites):
    mh = 0
    mw = 0
    for p in sprites:
        mh = max(p[3][0], mh)
        mw = max(p[3][1], mw)
    return (mh + 1, mw + 1)

def render_sprite(src, dst, h, w, sprite):
    (mask, (hmin, wmin), (hmax, wmax), (sh, sw)) = sprite
    dpos = (mask[0] - (hmin - h), mask[1] - (wmin - w))
    dst[dpos] = src[mask]

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input', help="Input image file", type=str, required=True, metavar="<file>")
parser.add_argument('-o', '--output', help="Output image file", type=str, required=False, metavar="<file>")
args = parser.parse_args()

try:
    im = cv2.imread(args.input, cv2.IMREAD_UNCHANGED)
except:
    print("Unable to load the input image")
    exit(0)

sprites = analyze(np.copy(im))

count = len(sprites)
(mh, mw) = compute_bb(sprites)
fh = mh * count
fw = mw 

print(f"Found {count} {mh}x{mw}px sprites")
print(f"Generating {fh}x{fw}px spritesheet...")

fim = np.full((fh, fw, 4), blank) # create fully transparent image

curh = 0
for p in sprites:
    render_sprite(im, fim, curh, 0, p)
    curh += mh

out_path = args.output if args.output else to_output(args.input)
cv2.imwrite(out_path, fim) 