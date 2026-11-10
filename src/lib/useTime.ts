import { useCurrentFrame, useVideoConfig } from 'remotion';

/** Current time in seconds (relative to the enclosing <Sequence>). */
export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};
