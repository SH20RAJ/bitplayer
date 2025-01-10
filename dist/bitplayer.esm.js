import React, { useRef, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var BitPlayer = /** @class */ (function () {
    function BitPlayer(selector, options) {
        if (options === void 0) { options = {}; }
        this.isFullscreen = false;
        this.isSeeking = false;
        this.volume = 1;
        this.playbackRate = 1;
        this.options = __assign({ autoplay: false, muted: false, controls: true, loop: false, preload: 'metadata', playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2], theme: 'dark' }, options);
        this.container = typeof selector === 'string'
            ? document.querySelector(selector)
            : selector;
        if (!this.container) {
            throw new Error('Container element not found');
        }
        this.init();
    }
    BitPlayer.prototype.init = function () {
        this.createVideoElement();
        this.createControls();
        this.attachEventListeners();
        this.setupKeyboardControls();
        // Initialize with default state
        this.container.classList.add('bitplayer');
        this.container.classList.add("bitplayer-theme-".concat(this.options.theme || 'dark'));
        if (this.options.muted) {
            this.video.muted = true;
        }
        if (this.options.autoplay) {
            this.video.autoplay = true;
        }
    };
    BitPlayer.prototype.createVideoElement = function () {
        this.video = document.createElement('video');
        this.video.className = 'bitplayer-video';
        if (this.options.poster) {
            this.video.poster = this.options.poster;
        }
        if (this.options.preload) {
            this.video.preload = this.options.preload;
        }
        this.container.appendChild(this.video);
    };
    BitPlayer.prototype.createControls = function () {
        var _a;
        this.controls = document.createElement('div');
        this.controls.className = 'bitplayer-controls';
        var controlsHTML = "\n      <div class=\"bitplayer-control-group\">\n        <button class=\"bitplayer-play-button\" aria-label=\"Play\">\n          ".concat(this.getIcon('play'), "\n        </button>\n        <div class=\"bitplayer-time\">\n          <span class=\"bitplayer-current-time\">0:00</span>\n          <span class=\"bitplayer-duration\">0:00</span>\n        </div>\n      </div>\n      <div class=\"bitplayer-progress\">\n        <input type=\"range\" class=\"bitplayer-progress-bar\" min=\"0\" max=\"100\" step=\"0.1\" value=\"0\">\n        <div class=\"bitplayer-progress-buffer\"></div>\n      </div>\n      <div class=\"bitplayer-control-group\">\n        <div class=\"bitplayer-volume\">\n          <button class=\"bitplayer-volume-button\" aria-label=\"Volume\">\n            ").concat(this.getIcon('volume'), "\n          </button>\n          <input type=\"range\" class=\"bitplayer-volume-bar\" min=\"0\" max=\"1\" step=\"0.1\" value=\"1\">\n        </div>\n        <div class=\"bitplayer-settings\">\n          <button class=\"bitplayer-settings-button\" aria-label=\"Settings\">\n            ").concat(this.getIcon('settings'), "\n          </button>\n          <div class=\"bitplayer-settings-menu\">\n            <div class=\"bitplayer-settings-speed\">\n              <span>Playback Speed</span>\n              <select>\n                ").concat((_a = this.options.playbackRates) === null || _a === void 0 ? void 0 : _a.map(function (rate) {
            return "<option value=\"".concat(rate, "\">").concat(rate, "x</option>");
        }).join(''), "\n              </select>\n            </div>\n            <div class=\"bitplayer-settings-quality\">\n              <span>Quality</span>\n              <select></select>\n            </div>\n          </div>\n        </div>\n        <button class=\"bitplayer-fullscreen-button\" aria-label=\"Fullscreen\">\n          ").concat(this.getIcon('fullscreen'), "\n        </button>\n      </div>\n    ");
        this.controls.innerHTML = controlsHTML;
        this.container.appendChild(this.controls);
    };
    BitPlayer.prototype.attachEventListeners = function () {
        var _this = this;
        var _a, _b, _c;
        // Video events
        this.video.addEventListener('loadedmetadata', function () { return _this.updateTimeDisplay(); });
        this.video.addEventListener('timeupdate', function () { return _this.onTimeUpdate(); });
        this.video.addEventListener('play', function () { return _this.onPlayStateChange(); });
        this.video.addEventListener('pause', function () { return _this.onPlayStateChange(); });
        this.video.addEventListener('volumechange', function () { return _this.onVolumeChange(); });
        // Controls events
        if (this.controls) {
            (_a = this.controls.querySelector('.bitplayer-play-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return _this.togglePlay(); });
            (_b = this.controls.querySelector('.bitplayer-fullscreen-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return _this.toggleFullscreen(); });
            (_c = this.controls.querySelector('.bitplayer-volume-bar')) === null || _c === void 0 ? void 0 : _c.addEventListener('input', function (e) {
                var target = e.target;
                _this.setVolume(parseFloat(target.value));
            });
        }
    };
    BitPlayer.prototype.setupKeyboardControls = function () {
        var _this = this;
        document.addEventListener('keydown', function (e) {
            if (!_this.container.contains(document.activeElement))
                return;
            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    _this.togglePlay();
                    break;
                case 'f':
                    _this.toggleFullscreen();
                    break;
                case 'm':
                    _this.toggleMute();
                    break;
                case 'arrowleft':
                    _this.seek(-5);
                    break;
                case 'arrowright':
                    _this.seek(5);
                    break;
                case 'arrowup':
                    _this.setVolume(Math.min(_this.volume + 0.1, 1));
                    break;
                case 'arrowdown':
                    _this.setVolume(Math.max(_this.volume - 0.1, 0));
                    break;
            }
        });
    };
    // Public API methods
    BitPlayer.prototype.play = function () {
        return this.video.play();
    };
    BitPlayer.prototype.pause = function () {
        this.video.pause();
    };
    BitPlayer.prototype.togglePlay = function () {
        if (this.video.paused) {
            this.play();
        }
        else {
            this.pause();
        }
    };
    BitPlayer.prototype.setVolume = function (value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.video.volume = this.volume;
    };
    BitPlayer.prototype.toggleMute = function () {
        this.video.muted = !this.video.muted;
    };
    BitPlayer.prototype.setPlaybackRate = function (rate) {
        this.playbackRate = rate;
        this.video.playbackRate = rate;
    };
    BitPlayer.prototype.seek = function (seconds) {
        this.video.currentTime = Math.max(0, Math.min(this.video.duration, this.video.currentTime + seconds));
    };
    BitPlayer.prototype.toggleFullscreen = function () {
        if (!this.isFullscreen) {
            if (this.container.requestFullscreen) {
                this.container.requestFullscreen();
            }
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        this.isFullscreen = !this.isFullscreen;
    };
    // Private helper methods
    BitPlayer.prototype.formatTime = function (seconds) {
        var date = new Date(seconds * 1000);
        var mm = date.getUTCMinutes();
        var ss = String(date.getUTCSeconds()).padStart(2, '0');
        return "".concat(mm, ":").concat(ss);
    };
    BitPlayer.prototype.updateTimeDisplay = function () {
        if (!this.controls)
            return;
        var timeDisplay = this.controls.querySelector('.bitplayer-time');
        if (!timeDisplay)
            return;
        var current = this.formatTime(this.video.currentTime);
        var total = this.formatTime(this.video.duration);
        timeDisplay.querySelector('.bitplayer-current-time').textContent = current;
        timeDisplay.querySelector('.bitplayer-duration').textContent = total;
    };
    BitPlayer.prototype.onTimeUpdate = function () {
        this.updateTimeDisplay();
        if (!this.controls)
            return;
        var progress = this.controls.querySelector('.bitplayer-progress-bar');
        if (progress) {
            progress.value = (this.video.currentTime / this.video.duration) * 100;
        }
    };
    BitPlayer.prototype.onPlayStateChange = function () {
        if (!this.controls)
            return;
        var playButton = this.controls.querySelector('.bitplayer-play-button');
        if (playButton) {
            playButton.innerHTML = this.getIcon(this.video.paused ? 'play' : 'pause');
        }
    };
    BitPlayer.prototype.onVolumeChange = function () {
        if (!this.controls)
            return;
        var volumeButton = this.controls.querySelector('.bitplayer-volume-button');
        if (volumeButton) {
            volumeButton.innerHTML = this.getIcon(this.video.muted || this.video.volume === 0 ? 'volume-mute' : 'volume');
        }
    };
    BitPlayer.prototype.getIcon = function (type) {
        var icons = {
            play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
            pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
            volume: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
            'volume-mute': '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
            fullscreen: '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
            settings: '<svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>'
        };
        return icons[type] || '';
    };
    return BitPlayer;
}());

var ReactBitPlayer = function (_a) {
    var src = _a.src, poster = _a.poster, _b = _a.autoPlay, autoPlay = _b === void 0 ? false : _b, _c = _a.muted, muted = _c === void 0 ? false : _c, _d = _a.controls, controls = _d === void 0 ? true : _d, _e = _a.loop, loop = _e === void 0 ? false : _e, _f = _a.preload, preload = _f === void 0 ? 'metadata' : _f, _g = _a.playbackRates, playbackRates = _g === void 0 ? [0.5, 0.75, 1, 1.25, 1.5, 2] : _g, _h = _a.theme, theme = _h === void 0 ? 'dark' : _h, onPlay = _a.onPlay, onPause = _a.onPause, onEnded = _a.onEnded, onTimeUpdate = _a.onTimeUpdate, onVolumeChange = _a.onVolumeChange, _j = _a.className, className = _j === void 0 ? '' : _j, _k = _a.style, style = _k === void 0 ? {} : _k;
    var containerRef = useRef(null);
    var playerRef = useRef(null);
    useEffect(function () {
        if (containerRef.current && !playerRef.current) {
            playerRef.current = new BitPlayer(containerRef.current, {
                autoplay: autoPlay,
                muted: muted,
                controls: controls,
                loop: loop,
                preload: preload,
                poster: poster,
                playbackRates: playbackRates,
                theme: theme,
            });
            // Add event listeners
            var video_1 = containerRef.current.querySelector('video');
            if (video_1) {
                if (onPlay)
                    video_1.addEventListener('play', onPlay);
                if (onPause)
                    video_1.addEventListener('pause', onPause);
                if (onEnded)
                    video_1.addEventListener('ended', onEnded);
                if (onTimeUpdate) {
                    video_1.addEventListener('timeupdate', function () {
                        onTimeUpdate(video_1.currentTime);
                    });
                }
                if (onVolumeChange) {
                    video_1.addEventListener('volumechange', function () {
                        onVolumeChange(video_1.volume);
                    });
                }
            }
        }
        return function () {
            var _a;
            var video = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('video');
            if (video) {
                if (onPlay)
                    video.removeEventListener('play', onPlay);
                if (onPause)
                    video.removeEventListener('pause', onPause);
                if (onEnded)
                    video.removeEventListener('ended', onEnded);
                if (onTimeUpdate) {
                    video.removeEventListener('timeupdate', function () {
                        onTimeUpdate(video.currentTime);
                    });
                }
                if (onVolumeChange) {
                    video.removeEventListener('volumechange', function () {
                        onVolumeChange(video.volume);
                    });
                }
            }
        };
    }, []);
    // Update source if it changes
    useEffect(function () {
        var _a;
        var video = (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('video');
        if (video) {
            video.src = src;
        }
    }, [src]);
    return (React.createElement("div", { ref: containerRef, className: "bitplayer-container ".concat(className, " theme-").concat(theme), style: style }));
};

export { ReactBitPlayer, ReactBitPlayer as default };
//# sourceMappingURL=bitplayer.esm.js.map
