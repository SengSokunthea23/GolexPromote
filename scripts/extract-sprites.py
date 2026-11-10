"""Cuts individual floating elements out of the supplied product images.

  public/images/coffee-beans-2.png -> public/sprites/bean0..N.png  (one bean per file)
  public/images/ginger-1.png       -> public/sprites/slice.png     (front ginger slice)

Usage: python3 scripts/extract-sprites.py   (needs: pip install pillow numpy opencv-python)
"""
import os
import numpy as np
import cv2
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', 'public')
OUT = os.path.join(ROOT, 'sprites')
os.makedirs(OUT, exist_ok=True)

beans = np.array(Image.open(os.path.join(ROOT, 'images', 'coffee-beans-2.png')).convert('RGBA'))
n, lab, stats, _ = cv2.connectedComponentsWithStats((beans[..., 3] > 20).astype(np.uint8))
k = 0
for i in range(1, n):
    x, y, w, h, area = stats[i]
    if area < 5000:
        continue
    crop = beans[y:y + h, x:x + w].copy()
    crop[..., 3] = np.where(lab[y:y + h, x:x + w] == i, crop[..., 3], 0)
    Image.fromarray(crop).save(os.path.join(OUT, f'bean{k}.png'))
    k += 1
print('beans:', k)

g = np.array(Image.open(os.path.join(ROOT, 'images', 'ginger-1.png')).convert('RGBA'))
c = g[245:505, 640:900].copy()
m = np.zeros(c.shape[:2], np.uint8)
cv2.ellipse(m, (132, 135), (112, 124), -25, 0, 360, 255, -1)
c[..., 3] = np.minimum(c[..., 3], cv2.GaussianBlur(m, (5, 5), 0))
Image.fromarray(c).save(os.path.join(OUT, 'slice.png'))
print('slice: ok')
