---
layout: default
title: Getting Started
nav_order: 2
---

# Getting Started
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Installation

### NPM
```bash
npm install bitplayer
```

### CDN
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bitplayer/dist/bitplayer.css">
<script src="https://cdn.jsdelivr.net/npm/bitplayer/dist/bitplayer.min.js"></script>
```

## Basic Usage

### HTML
```html
<div id="player"></div>
```

### JavaScript
```javascript
const player = new BitPlayer('#player', {
  autoplay: false,
  controls: true,
  sources: [{
    src: 'path/to/video.mp4',
    type: 'video/mp4'
  }]
});
```

### React
```jsx
import { ReactBitPlayer } from 'bitplayer';

function App() {
  return (
    <ReactBitPlayer
      src="path/to/video.mp4"
      autoplay={false}
      controls={true}
    />
  );
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoplay` | boolean | `false` | Enable/disable autoplay |
| `controls` | boolean | `true` | Show/hide player controls |
| `loop` | boolean | `false` | Enable/disable video looping |
| `muted` | boolean | `false` | Mute/unmute video |
| `preload` | string | `'metadata'` | Video preload attribute ('none', 'metadata', 'auto') |
| `poster` | string | `''` | URL for the video poster image |
| `width` | number/string | `'100%'` | Player width |
| `height` | number/string | `'auto'` | Player height |
| `playbackRates` | array | `[0.5, 1, 1.5, 2]` | Available playback speeds |
| `volume` | number | `1` | Initial volume (0-1) |
| `theme` | string | `'dark'` | Player theme ('dark', 'light') |

## Events

BitPlayer emits various events that you can listen to:

```javascript
const player = new BitPlayer('#player');

player.on('play', () => {
  console.log('Video started playing');
});

player.on('pause', () => {
  console.log('Video paused');
});

player.on('ended', () => {
  console.log('Video finished');
});
```

### Available Events

- `play` - Fired when playback starts
- `pause` - Fired when playback is paused
- `ended` - Fired when playback ends
- `timeupdate` - Fired when playback position changes
- `volumechange` - Fired when volume changes
- `fullscreenchange` - Fired when entering/exiting fullscreen
- `qualitychange` - Fired when video quality changes
- `error` - Fired when an error occurs
