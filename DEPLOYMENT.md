# Deployment Guide

## Recommended stack

| Component | Recommended service | Why |
|-----------|--------------------|----|
| Static site shell | **Cloudflare Pages** | Free tier, global CDN, easy custom domain, supports response headers |
| Video (free) | **YouTube Unlisted** | No file-size limit, reliable streaming, embed via `videoEmbedUrl` in config |
| Video (private/paid) | **Cloudflare Stream** | Signed URLs, no public access, HLS streaming |
| Photos | Committed alongside site or Cloudflare Pages assets | Files ≤25 MB each; optimised JPEGs are well within limits |

## Important: MP4 size limit

Do **not** upload an 850 MB MP4 directly to Cloudflare Pages.  
Cloudflare Pages has a 25 MB per-file asset limit and a project size cap.  
Use a video hosting service instead.

---

## Option A — Cloudflare Pages + YouTube Unlisted (free)

1. Upload your walkthrough video to YouTube and set visibility to **Unlisted**.
2. Copy the embed URL, e.g. `https://www.youtube.com/embed/VIDEO_ID`.
3. In `config.js` set:
   ```js
   videoEmbedUrl: "https://www.youtube.com/embed/VIDEO_ID"
   ```
4. Deploy the site to Cloudflare Pages (see below).

YouTube Unlisted means the video is not indexed and not discoverable in search,
but anyone with the direct link or embed URL can view it.

---

## Option B — Cloudflare Pages + Cloudflare Stream (stronger protection)

1. Upload the MP4 to Cloudflare Stream.
2. Enable **Require Signed URLs** in the Stream dashboard.
3. Generate a signed token server-side (requires a small worker or API call).
4. Set `videoEmbedUrl` to the signed Stream embed URL.

This prevents direct hotlinking and limits access to valid tokens.

---

## Deploying to Cloudflare Pages

### Via dashboard (no CLI required)

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages**.
2. Click **Create a project** → **Upload assets**.
3. Drag the entire `house-sale/` folder contents (not the folder itself) into the upload area.
4. Set a project name and deploy.
5. Optionally connect a custom domain.

### Via Wrangler CLI

```bash
npx wrangler pages deploy ./house-sale --project-name private-residence
```

---

## Response headers (Cloudflare Pages)

Create a `_headers` file in the root of your deployed site with:

```
/*
  X-Robots-Tag: noindex, nofollow
  Referrer-Policy: strict-origin-when-cross-origin
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Cache-Control: no-store
```

This adds server-level noindex, prevents hotlinking metadata, and disables
content sniffing.

---

## Sharing the site

- Share the Cloudflare Pages URL (e.g. `https://private-residence.pages.dev`) directly with buyers.
- Do not post it publicly or link it from any indexed page.
- The `noindex, nofollow` meta tag and `X-Robots-Tag` header both instruct search
  engine crawlers not to index the page, but they only take effect if crawlers visit —
  the primary protection is not sharing the URL publicly.

---

## Photo optimisation checklist

Before uploading:

- [ ] Resize to max 2400px wide (maintains aspect ratio)
- [ ] Save as JPEG at 80–85% quality, or WebP at 80%
- [ ] Strip EXIF metadata with an image processor (removes GPS, camera info)
- [ ] Name files `photo-01.jpg` through `photo-40.jpg`
- [ ] Check total photo folder size is under Cloudflare Pages project limits (~500 MB project cap)
