---
layout: default
title: Examples
nav_order: 4
---

# Examples
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Basic Player

A simple video player with default controls.

```html
<div id="player"></div>

<script>
const player = new BitPlayer('#player', {
  sources: [{
    src: 'https://example.com/video.mp4',
    type: 'video/mp4'
  }]
});
</script>
```

## Custom Controls

Create a player with custom control layout.

```html
<div id="player"></div>

<script>
const player = new BitPlayer('#player', {
  controls: {
    play: true,
    time: true,
    progress: true,
    volume: true,
    settings: true,
    fullscreen: true,
    layout: [
      ['play', 'time'],
      ['progress'],
      ['volume', 'settings', 'fullscreen']
    ]
  }
});
</script>
```

## Multiple Quality Sources

Player with multiple quality options.

```html
<div id="player"></div>

<script>
const player = new BitPlayer('#player', {
  sources: [
    {
      src: 'https://example.com/video-4k.mp4',
      type: 'video/mp4',
      label: '4K',
      quality: '2160p'
    },
    {
      src: 'https://example.com/video-1080p.mp4',
      type: 'video/mp4',
      label: 'Full HD',
      quality: '1080p'
    },
    {
      src: 'https://example.com/video-720p.mp4',
      type: 'video/mp4',
      label: 'HD',
      quality: '720p'
    }
  ],
  defaultQuality: '1080p'
});
</script>
```

## Subtitles and Captions

Player with multiple subtitle tracks.

```html
<div id="player"></div>

<script>
const player = new BitPlayer('#player', {
  sources: [{
    src: 'https://example.com/video.mp4',
    type: 'video/mp4'
  }],
  subtitles: [
    {
      src: 'subtitles-en.vtt',
      label: 'English',
      language: 'en',
      default: true
    },
    {
      src: 'subtitles-es.vtt',
      label: 'Español',
      language: 'es'
    },
    {
      src: 'subtitles-fr.vtt',
      label: 'Français',
      language: 'fr'
    }
  ]
});
</script>
```

## Custom Theme

Player with a custom color theme.

```html
<style>
.bitplayer-theme-custom {
  --bitplayer-primary-color: #e91e63;
  --bitplayer-secondary-color: #c2185b;
  --bitplayer-text-color: #ffffff;
  --bitplayer-background: rgba(0, 0, 0, 0.9);
  --bitplayer-control-spacing: 12px;
  --bitplayer-control-radius: 8px;
  --bitplayer-slider-height: 6px;
}
</style>

<div id="player"></div>

<script>
const player = new BitPlayer('#player', {
  theme: 'custom',
  sources: [{
    src: 'https://example.com/video.mp4',
    type: 'video/mp4'
  }]
});
</script>
```

## React Component

Using BitPlayer in a React application.

```jsx
import React, { useRef, useEffect } from 'react';
import { ReactBitPlayer } from 'bitplayer';

function VideoPlayer() {
  const playerRef = useRef(null);

  useEffect(() => {
    // Access player instance
    const player = playerRef.current;
    
    // Add event listeners
    player.on('play', () => console.log('Video started'));
    player.on('ended', () => console.log('Video ended'));
    
    return () => {
      // Cleanup
      player.destroy();
    };
  }, []);

  return (
    <ReactBitPlayer
      ref={playerRef}
      src="https://example.com/video.mp4"
      poster="https://example.com/poster.jpg"
      autoplay={false}
      controls={true}
      theme="dark"
      width="100%"
      height="auto"
      subtitles={[
        {
          src: 'subtitles-en.vtt',
          label: 'English',
          default: true
        }
      ]}
      onPlay={() => console.log('Playing')}
      onPause={() => console.log('Paused')}
    />
  );
}

export default VideoPlayer;
```

## Advanced Features

Player with all advanced features enabled.

```html
<div id="player"></div>

<script>
const player = new BitPlayer('#player', {
  sources: [{
    src: 'https://example.com/video.mp4',
    type: 'video/mp4'
  }],
  autoplay: false,
  muted: false,
  loop: false,
  preload: 'auto',
  poster: 'poster.jpg',
  playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
  volume: 1,
  theme: 'dark',
  thumbnails: {
    src: 'thumbnails.vtt',
    interval: 10
  },
  controls: {
    play: true,
    time: true,
    progress: true,
    volume: true,
    settings: true,
    fullscreen: true,
    pictureInPicture: true
  },
  keyboard: {
    focused: true,
    global: false
  },
  tooltips: {
    controls: true,
    seek: true
  },
  i18n: {
    play: 'Play',
    pause: 'Pause',
    mute: 'Mute',
    unmute: 'Unmute',
    settings: 'Settings',
    enterFullscreen: 'Enter Fullscreen',
    exitFullscreen: 'Exit Fullscreen'
  }
});

// Event handling
player.on('ready', () => console.log('Player is ready'));
player.on('play', () => console.log('Playing'));
player.on('pause', () => console.log('Paused'));
player.on('ended', () => console.log('Ended'));
player.on('timeupdate', (time) => console.log('Current time:', time));
player.on('volumechange', (volume) => console.log('Volume:', volume));
player.on('qualitychange', (quality) => console.log('Quality changed:', quality));
player.on('subtitlechange', (subtitle) => console.log('Subtitle:', subtitle));
player.on('fullscreenchange', (isFullscreen) => console.log('Fullscreen:', isFullscreen));
</script>
```
