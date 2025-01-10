# BitPlayer

A beautiful, minimalistic, modern HTML5 video player with React support.

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
