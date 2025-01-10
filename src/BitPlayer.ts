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

class BitPlayer {
  private container: HTMLElement;
  private video: HTMLVideoElement;
  private controls: HTMLElement;
  private options: BitPlayerOptions;
  private isFullscreen: boolean = false;
  private isSeeking: boolean = false;
  private volume: number = 1;
  private playbackRate: number = 1;

  constructor(selector: string | HTMLElement, options: BitPlayerOptions = {}) {
    this.options = {
      autoplay: false,
      muted: false,
      controls: true,
      loop: false,
      preload: 'metadata',
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      theme: 'dark',
      ...options
    };

    this.container = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    this.init();
  }

  private init(): void {
    this.createVideoElement();
    this.createControls();
    this.attachEventListeners();
    this.setupKeyboardControls();
  }

  private createVideoElement(): void {
    this.video = document.createElement('video');
    this.video.className = 'bitplayer-video';
    Object.assign(this.video, {
      autoplay: this.options.autoplay,
      muted: this.options.muted,
      loop: this.options.loop,
      preload: this.options.preload,
      poster: this.options.poster
    });
    this.container.appendChild(this.video);
  }

  private createControls(): void {
    if (!this.options.controls) return;

    this.controls = document.createElement('div');
    this.controls.className = 'bitplayer-controls';
    
    // Create control elements
    const playButton = this.createButton('play');
    const volumeControl = this.createVolumeControl();
    const progressBar = this.createProgressBar();
    const timeDisplay = this.createTimeDisplay();
    const settingsButton = this.createSettingsButton();
    const fullscreenButton = this.createButton('fullscreen');

    // Append controls
    this.controls.append(
      playButton,
      volumeControl,
      progressBar,
      timeDisplay,
      settingsButton,
      fullscreenButton
    );

    this.container.appendChild(this.controls);
  }

  private createButton(type: string): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = `bitplayer-${type}-button`;
    button.innerHTML = this.getButtonIcon(type);
    return button;
  }

  private createVolumeControl(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'bitplayer-volume-container';
    
    const button = this.createButton('volume');
    const slider = document.createElement('input');
    Object.assign(slider, {
      type: 'range',
      min: 0,
      max: 1,
      step: 0.1,
      value: this.volume,
      className: 'bitplayer-volume-slider'
    });

    container.append(button, slider);
    return container;
  }

  private createProgressBar(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'bitplayer-progress-container';
    
    const progress = document.createElement('progress');
    progress.className = 'bitplayer-progress';
    progress.max = 100;
    progress.value = 0;

    container.appendChild(progress);
    return container;
  }

  private createTimeDisplay(): HTMLElement {
    const display = document.createElement('div');
    display.className = 'bitplayer-time-display';
    display.textContent = '0:00 / 0:00';
    return display;
  }

  private createSettingsButton(): HTMLElement {
    const button = this.createButton('settings');
    const menu = document.createElement('div');
    menu.className = 'bitplayer-settings-menu';
    
    // Add playback rate options
    this.options.playbackRates.forEach(rate => {
      const option = document.createElement('button');
      option.textContent = `${rate}x`;
      option.onclick = () => this.setPlaybackRate(rate);
      menu.appendChild(option);
    });

    button.appendChild(menu);
    return button;
  }

  private attachEventListeners(): void {
    // Video events
    this.video.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
    this.video.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.video.addEventListener('play', () => this.onPlayStateChange());
    this.video.addEventListener('pause', () => this.onPlayStateChange());
    this.video.addEventListener('volumechange', () => this.onVolumeChange());
    
    // Controls events
    if (this.controls) {
      this.controls.querySelector('.bitplayer-play-button')
        ?.addEventListener('click', () => this.togglePlay());
      
      this.controls.querySelector('.bitplayer-fullscreen-button')
        ?.addEventListener('click', () => this.toggleFullscreen());
      
      this.controls.querySelector('.bitplayer-volume-slider')
        ?.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          this.setVolume(parseFloat(target.value));
        });
    }
  }

  private setupKeyboardControls(): void {
    document.addEventListener('keydown', (e) => {
      if (!this.container.contains(document.activeElement)) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          this.togglePlay();
          break;
        case 'f':
          this.toggleFullscreen();
          break;
        case 'm':
          this.toggleMute();
          break;
        case 'arrowleft':
          this.seek(-5);
          break;
        case 'arrowright':
          this.seek(5);
          break;
        case 'arrowup':
          this.setVolume(Math.min(this.volume + 0.1, 1));
          break;
        case 'arrowdown':
          this.setVolume(Math.max(this.volume - 0.1, 0));
          break;
      }
    });
  }

  // Public API methods
  public play(): Promise<void> {
    return this.video.play();
  }

  public pause(): void {
    this.video.pause();
  }

  public togglePlay(): void {
    if (this.video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  public setVolume(value: number): void {
    this.volume = Math.max(0, Math.min(1, value));
    this.video.volume = this.volume;
  }

  public toggleMute(): void {
    this.video.muted = !this.video.muted;
  }

  public setPlaybackRate(rate: number): void {
    this.playbackRate = rate;
    this.video.playbackRate = rate;
  }

  public seek(seconds: number): void {
    this.video.currentTime = Math.max(0, 
      Math.min(this.video.duration, this.video.currentTime + seconds));
  }

  public toggleFullscreen(): void {
    if (!this.isFullscreen) {
      if (this.container.requestFullscreen) {
        this.container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    this.isFullscreen = !this.isFullscreen;
  }

  // Private helper methods
  private formatTime(seconds: number): string {
    const date = new Date(seconds * 1000);
    const mm = date.getUTCMinutes();
    const ss = String(date.getUTCSeconds()).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  private updateTimeDisplay(): void {
    if (!this.controls) return;
    const timeDisplay = this.controls.querySelector('.bitplayer-time-display');
    if (!timeDisplay) return;

    const current = this.formatTime(this.video.currentTime);
    const total = this.formatTime(this.video.duration);
    timeDisplay.textContent = `${current} / ${total}`;
  }

  private onTimeUpdate(): void {
    this.updateTimeDisplay();
    if (!this.controls) return;
    
    const progress = this.controls.querySelector('.bitplayer-progress') as HTMLProgressElement;
    if (progress) {
      progress.value = (this.video.currentTime / this.video.duration) * 100;
    }
  }

  private onPlayStateChange(): void {
    if (!this.controls) return;
    const playButton = this.controls.querySelector('.bitplayer-play-button');
    if (playButton) {
      playButton.innerHTML = this.getButtonIcon(this.video.paused ? 'play' : 'pause');
    }
  }

  private onVolumeChange(): void {
    if (!this.controls) return;
    const volumeButton = this.controls.querySelector('.bitplayer-volume-button');
    if (volumeButton) {
      volumeButton.innerHTML = this.getButtonIcon(
        this.video.muted || this.video.volume === 0 ? 'volume-mute' : 'volume'
      );
    }
  }

  private getButtonIcon(type: string): string {
    const icons = {
      play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
      pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
      volume: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
      'volume-mute': '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
      fullscreen: '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
      settings: '<svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>'
    };
    return icons[type] || '';
  }
}

export default BitPlayer;
