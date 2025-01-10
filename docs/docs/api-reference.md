---
layout: default
title: API Reference
nav_order: 3
---

# API Reference
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Player Methods

### Core Methods

```javascript
const player = new BitPlayer('#player');

// Playback Control
player.play();                    // Start playback
player.pause();                   // Pause playback
player.stop();                    // Stop playback
player.restart();                 // Restart from beginning
player.seek(time);               // Seek to specific time (in seconds)
player.setPlaybackRate(rate);    // Set playback speed (0.5-2)

// Volume Control
player.setVolume(level);         // Set volume (0-1)
player.mute();                   // Mute audio
player.unmute();                 // Unmute audio

// Display Control
player.enterFullscreen();        // Enter fullscreen mode
player.exitFullscreen();         // Exit fullscreen mode
player.setQuality(level);        // Set video quality
player.setPoster(url);           // Set poster image

// State Information
player.getCurrentTime();         // Get current playback position
player.getDuration();            // Get video duration
player.getVolume();             // Get current volume
player.isPaused();              // Check if paused
player.isEnded();               // Check if ended
player.isFullscreen();          // Check fullscreen state
```

### Advanced Features

#### Quality Control
```javascript
player.setQualities([
  {
    label: '4K',
    value: '2160p',
    src: 'video-4k.mp4'
  },
  {
    label: 'HD',
    value: '1080p',
    src: 'video-hd.mp4'
  },
  {
    label: 'SD',
    value: '480p',
    src: 'video-sd.mp4'
  }
]);

player.getQualities();           // Get available qualities
player.getCurrentQuality();      // Get current quality
```

#### Subtitle Support
```javascript
player.loadSubtitle('subtitles.vtt', 'English');
player.removeSubtitle();
player.toggleSubtitles();
player.setSubtitleOffset(seconds);
```

#### Thumbnails
```javascript
player.setThumbnails({
  src: 'thumbnails.vtt',
  interval: 10  // seconds between thumbnails
});
```

#### Audio Tracks
```javascript
player.setAudioTracks([
  {
    label: 'English',
    language: 'en',
    src: 'audio-en.m4a'
  },
  {
    label: 'Spanish',
    language: 'es',
    src: 'audio-es.m4a'
  }
]);

player.switchAudioTrack('es');
```

## Events

### Playback Events
```javascript
player.on('play', () => {});
player.on('pause', () => {});
player.on('ended', () => {});
player.on('timeupdate', (currentTime) => {});
player.on('progress', (buffered) => {});
player.on('seeking', (time) => {});
player.on('seeked', (time) => {});
player.on('ratechange', (rate) => {});
```

### Volume Events
```javascript
player.on('volumechange', (volume) => {});
player.on('mute', () => {});
player.on('unmute', () => {});
```

### Quality Events
```javascript
player.on('qualitychange', (quality) => {});
player.on('qualitiesloaded', (qualities) => {});
```

### Display Events
```javascript
player.on('fullscreenchange', (isFullscreen) => {});
player.on('enterfullscreen', () => {});
player.on('exitfullscreen', () => {});
```

### Track Events
```javascript
player.on('subtitlechange', (subtitle) => {});
player.on('audiotrackchange', (track) => {});
```

### Error Events
```javascript
player.on('error', (error) => {
  console.error('Player error:', error);
});
```

## Styling

### CSS Variables

BitPlayer uses CSS variables for easy theming:

```css
:root {
  --bitplayer-primary-color: #2196f3;
  --bitplayer-secondary-color: #1976d2;
  --bitplayer-text-color: #ffffff;
  --bitplayer-background: rgba(0, 0, 0, 0.8);
  --bitplayer-control-spacing: 10px;
  --bitplayer-control-radius: 4px;
  --bitplayer-slider-height: 4px;
  --bitplayer-tooltip-background: rgba(0, 0, 0, 0.7);
}
```

### Custom Themes

Create a custom theme by extending the default styles:

```css
.bitplayer-theme-custom {
  --bitplayer-primary-color: #ff0000;
  --bitplayer-secondary-color: #cc0000;
  /* Add other custom variables */
}
```

Apply the custom theme:

```javascript
const player = new BitPlayer('#player', {
  theme: 'custom'
});
```
