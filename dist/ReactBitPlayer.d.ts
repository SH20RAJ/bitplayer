import React from 'react';
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
export declare const ReactBitPlayer: React.FC<ReactBitPlayerProps>;
export default ReactBitPlayer;
