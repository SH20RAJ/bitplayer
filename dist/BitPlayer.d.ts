interface BitPlayerOptions {
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
    preload?: 'auto' | 'metadata' | 'none';
    poster?: string;
    playbackRates?: number[];
    theme?: 'dark' | 'light';
}
declare class BitPlayer {
    private container;
    private video;
    private controls;
    private options;
    private isFullscreen;
    private isSeeking;
    private volume;
    private playbackRate;
    constructor(selector: string | HTMLElement, options?: BitPlayerOptions);
    private init;
    private createVideoElement;
    private createControls;
    private attachEventListeners;
    private setupKeyboardControls;
    play(): Promise<void>;
    pause(): void;
    togglePlay(): void;
    setVolume(value: number): void;
    toggleMute(): void;
    setPlaybackRate(rate: number): void;
    seek(seconds: number): void;
    toggleFullscreen(): void;
    private formatTime;
    private updateTimeDisplay;
    private onTimeUpdate;
    private onPlayStateChange;
    private onVolumeChange;
    private getIcon;
}
export default BitPlayer;
