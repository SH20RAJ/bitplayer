import React, { useEffect, useRef, useState } from 'react';
import BitPlayer from './BitPlayer';

interface ReactBitPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  playbackRates?: number[];
  theme?: 'dark' | 'light';
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ReactBitPlayer: React.FC<ReactBitPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  muted = false,
  controls = true,
  loop = false,
  preload = 'metadata',
  playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2],
  theme = 'dark',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<BitPlayer | null>(null);

  useEffect(() => {
    if (containerRef.current && !playerRef.current) {
      playerRef.current = new BitPlayer(containerRef.current, {
        autoplay: autoPlay,
        muted,
        controls,
        loop,
        preload,
        poster,
        playbackRates,
        theme,
      });

      // Add event listeners
      const video = containerRef.current.querySelector('video');
      if (video) {
        if (onPlay) video.addEventListener('play', onPlay);
        if (onPause) video.addEventListener('pause', onPause);
        if (onEnded) video.addEventListener('ended', onEnded);
        if (onTimeUpdate) {
          video.addEventListener('timeupdate', () => {
            onTimeUpdate(video.currentTime);
          });
        }
        if (onVolumeChange) {
          video.addEventListener('volumechange', () => {
            onVolumeChange(video.volume);
          });
        }
      }
    }

    return () => {
      const video = containerRef.current?.querySelector('video');
      if (video) {
        if (onPlay) video.removeEventListener('play', onPlay);
        if (onPause) video.removeEventListener('pause', onPause);
        if (onEnded) video.removeEventListener('ended', onEnded);
        if (onTimeUpdate) {
          video.removeEventListener('timeupdate', () => {
            onTimeUpdate(video.currentTime);
          });
        }
        if (onVolumeChange) {
          video.removeEventListener('volumechange', () => {
            onVolumeChange(video.volume);
          });
        }
      }
    };
  }, []);

  // Update source if it changes
  useEffect(() => {
    const video = containerRef.current?.querySelector('video');
    if (video) {
      video.src = src;
    }
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`bitplayer-container ${className} theme-${theme}`}
      style={style}
    />
  );
};

export default ReactBitPlayer;
