# BitPlayer

A beautiful, minimalistic, modern HTML5 video player with React support.


[![Visitors](https://api.visitorbadge.io/api/combined?path=https%3A%2F%2Fgithub.com%2Fsh20raj%2Fbitplayer&labelColor=%232ccce4&countColor=%23ba68c8&style=flat)](https://visitorbadge.io/status?path=https%3A%2F%2Fgithub.com%2Fsh20raj%2Fbitplayer)
[![npm version](https://badge.fury.io/js/bitplayer.svg)](https://badge.fury.io/js/bitplayer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/sh20raj/bitplayer.svg)](https://github.com/sh20raj/bitplayer/issues)



## Features

- 🎨 Minimalistic and modern design
- 🎯 Highly customizable
- 📱 Fully responsive
- ⌨️ Keyboard shortcuts
- 🎛️ Advanced controls (quality, playback speed, volume)
- 📺 Full-screen support
- 🎭 Picture-in-Picture
- 🔊 Volume controls with mute toggle
- ⏱️ Custom time display
- 🎯 Seeking preview thumbnails
- 🎨 Customizable themes
- ⚛️ React component available

## Installation

### Via NPM
```bash
npm install bitplayer
```

### Via CDN
```html
<link rel="stylesheet" href="https://unpkg.com/bitplayer/dist/bitplayer.css">
<script src="https://unpkg.com/bitplayer/dist/bitplayer.js"></script>
```

## Usage

### Vanilla JavaScript
```html
<div class="bitplayer-container">
  <video id="my-video" class="bitplayer">
    <source src="path/to/video.mp4" type="video/mp4">
  </video>
</div>

<script>
  const player = new BitPlayer('#my-video', {
    autoplay: false,
    muted: false,
    controls: true
  });
</script>
```

### React
```jsx
import { BitPlayer } from 'bitplayer';
import 'bitplayer/dist/bitplayer.css';

function App() {
  return (
    <BitPlayer
      src="path/to/video.mp4"
      autoPlay={false}
      muted={false}
      controls={true}
    />
  );
}
```

## Documentation

For detailed documentation, visit [documentation](https://github.com/yourusername/bitplayer/docs).

## License

MIT © [Your Name]
