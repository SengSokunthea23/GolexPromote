import React from 'react';
import { WIDTH } from '../theme/timeline';

/** Full-width row, horizontally centred, pinned at an absolute `top` (px in the 1080×1920 frame). */
export const Line: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: 'absolute', left: 0, width: WIDTH, top, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    {children}
  </div>
);
