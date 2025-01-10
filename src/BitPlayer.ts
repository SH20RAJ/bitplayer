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
    // SVG icons for controls - you can customize these
    const icons = {
      play: '<svg>...</svg>',
      pause: '<svg>...</svg>',
      volume: '<svg>...</svg>',
      'volume-mute': '<svg>...</svg>',
      fullscreen: '<svg>...</svg>',
      settings: '<svg>...</svg>'
    };
    return icons[type] || '';
  }
}

export default BitPlayer;
