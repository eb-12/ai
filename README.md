# Private House Sale Website

A clean, modern static website for sharing a private property listing with potential buyers.

## What's included

| File | Purpose |
|------|---------|
| `index.html` | Main page — hero, details, gallery, video |
| `styles.css` | All styles (mobile-first, warm minimal theme) |
| `script.js` | Gallery build, lightbox, video setup, view-only deterrents |
| `config.js` | Site configuration — photo base URL, video source |
| `DEPLOYMENT.md` | Hosting recommendations and deployment notes |
| `assets/photos/` | Place `photo-01.jpg` … `photo-40.jpg` here |
| `assets/video/` | Place `walkthrough.mp4` here (or use embed URL in config) |
| `assets/placeholders/` | Folder for any placeholder/fallback assets |

## Quick start

1. Add your 40 photos named `photo-01.jpg` through `photo-40.jpg` in `assets/photos/`.
2. Optionally add `walkthrough.mp4` to `assets/video/`, or set a `videoEmbedUrl` in `config.js`.
3. Update `agent@example.com` in `index.html` to your real contact email.
4. Deploy to Cloudflare Pages (see `DEPLOYMENT.md`).

## Photo requirements

- Format: JPEG or WebP
- Width: 1800–2400px (height proportional)
- Naming: `photo-01.jpg`, `photo-02.jpg`, … `photo-40.jpg`
- The first photo (`photo-01.jpg`) is used as the hero image and video poster

## Configuration — config.js

```js
window.PROPERTY_SITE = {
  photoBaseUrl: "assets/photos",      // folder containing photo-01.jpg … photo-40.jpg
  posterUrl: "assets/photos/photo-01.jpg", // video poster frame
  videoMp4Url: "assets/video/walkthrough.mp4", // direct MP4 (see note below)
  videoEmbedUrl: ""                   // YouTube/Vimeo embed URL — overrides MP4 if set
};
```

If `videoEmbedUrl` is non-empty it takes priority and renders an `<iframe>`.
If it is empty the site renders an HTML5 `<video>` element pointing to `videoMp4Url`.

## View-only deterrents

The following casual deterrents are implemented. Note that browser-viewable media
**cannot be fully protected** from determined download or screen capture.

- No download links anywhere on the page
- Right-click disabled on images and video
- Drag disabled on images and video
- Video `controlslist="nodownload noplaybackrate"` and `disablepictureinpicture`
- `<meta name="robots" content="noindex, nofollow">`
- Recommended deployment headers (see `DEPLOYMENT.md`)
