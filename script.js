/* =============================================
   PROPERTY SITE — script.js
   ============================================= */

(function () {
  "use strict";

  /* ------------------------------------------
     VIEW-ONLY DETERRENTS
     ------------------------------------------ */
  document.addEventListener("contextmenu", function (e) {
    const t = e.target;
    if (t.tagName === "IMG" || t.tagName === "VIDEO") {
      e.preventDefault();
    }
  });

  document.addEventListener("dragstart", function (e) {
    const t = e.target;
    if (t.tagName === "IMG" || t.tagName === "VIDEO") {
      e.preventDefault();
    }
  });

  /* ------------------------------------------
     CONFIG
     ------------------------------------------ */
  const cfg = window.PROPERTY_SITE || {
    photoBaseUrl: "assets/photos",
    posterUrl: "assets/photos/photo-01.jpg",
    videoMp4Url: "assets/video/walkthrough.mp4",
    videoEmbedUrl: ""
  };

  const PHOTO_COUNT = 40;

  /* ------------------------------------------
     GALLERY BUILD
     ------------------------------------------ */
  const galleryGrid = document.getElementById("galleryGrid");

  if (galleryGrid) {
    for (let i = 1; i <= PHOTO_COUNT; i++) {
      const num = String(i).padStart(2, "0");
      const src = cfg.photoBaseUrl + "/photo-" + num + ".jpg";

      const item = document.createElement("div");
      item.className = "gallery-item";
      item.dataset.index = i - 1;
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", "Open photo " + i + " of " + PHOTO_COUNT);

      const img = document.createElement("img");
      img.alt = "Property photo " + i;
      img.loading = i <= 8 ? "eager" : "lazy";
      img.decoding = "async";

      img.onerror = function () {
        item.innerHTML = "";
        const ph = document.createElement("div");
        ph.className = "img-placeholder";
        ph.textContent = "Photo " + i;
        item.appendChild(ph);
        item.dataset.broken = "true";
      };

      img.src = src;

      const overlay = document.createElement("div");
      overlay.className = "gallery-item-overlay";
      overlay.setAttribute("aria-hidden", "true");

      item.appendChild(img);
      item.appendChild(overlay);
      galleryGrid.appendChild(item);

      item.addEventListener("click", function () {
        if (item.dataset.broken) return;
        openLightbox(parseInt(item.dataset.index, 10));
      });

      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (item.dataset.broken) return;
          openLightbox(parseInt(item.dataset.index, 10));
        }
      });
    }
  }

  /* ------------------------------------------
     HERO IMAGE — click opens lightbox at 0
     ------------------------------------------ */
  const heroImg = document.getElementById("heroImg");
  if (heroImg) {
    heroImg.style.cursor = "pointer";
    heroImg.addEventListener("click", function () {
      openLightbox(0);
    });
  }

  /* ------------------------------------------
     LIGHTBOX
     ------------------------------------------ */
  const lightbox    = document.getElementById("lightbox");
  const lbImg       = document.getElementById("lbImg");
  const lbCaption   = document.getElementById("lbCaption");
  const lbClose     = document.getElementById("lbClose");
  const lbPrev      = document.getElementById("lbPrev");
  const lbNext      = document.getElementById("lbNext");

  let currentIndex  = 0;
  let isOpen        = false;

  function openLightbox(index) {
    currentIndex = clampIndex(index);
    showPhoto(currentIndex);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    isOpen = true;
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    isOpen = false;
  }

  function showPhoto(index) {
    const num = String(index + 1).padStart(2, "0");
    const src = cfg.photoBaseUrl + "/photo-" + num + ".jpg";
    lbImg.src = src;
    lbImg.alt = "Property photo " + (index + 1);
    lbCaption.textContent = "Photo " + (index + 1) + " of " + PHOTO_COUNT;
  }

  function clampIndex(i) {
    return Math.max(0, Math.min(PHOTO_COUNT - 1, i));
  }

  function navigate(dir) {
    currentIndex = clampIndex(currentIndex + dir);
    showPhoto(currentIndex);
  }

  if (lbClose)  lbClose.addEventListener("click", closeLightbox);
  if (lbPrev)   lbPrev.addEventListener("click",  function () { navigate(-1); });
  if (lbNext)   lbNext.addEventListener("click",  function () { navigate(1);  });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!isOpen) return;
    if (e.key === "Escape")      { closeLightbox(); }
    if (e.key === "ArrowLeft")   { navigate(-1); }
    if (e.key === "ArrowRight")  { navigate(1);  }
  });

  /* ------------------------------------------
     HERO BUTTONS — scroll to sections
     ------------------------------------------ */
  const btnPhotos      = document.getElementById("btnPhotos");
  const btnWalkthrough = document.getElementById("btnWalkthrough");

  if (btnPhotos) {
    btnPhotos.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("photos").scrollIntoView({ behavior: "smooth" });
    });
  }

  if (btnWalkthrough) {
    btnWalkthrough.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("walkthrough").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ------------------------------------------
     VIDEO SETUP
     ------------------------------------------ */
  const videoSection = document.getElementById("videoMount");

  if (videoSection) {
    if (cfg.videoEmbedUrl && cfg.videoEmbedUrl.trim() !== "") {
      const iframe = document.createElement("iframe");
      iframe.src = cfg.videoEmbedUrl;
      iframe.title = "Property video walkthrough";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      videoSection.appendChild(iframe);
    } else {
      const video = document.createElement("video");
      video.src = cfg.videoMp4Url;
      video.poster = cfg.posterUrl;
      video.controls = true;
      video.playsInline = true;
      video.setAttribute("controlslist", "nodownload noplaybackrate");
      video.setAttribute("disablepictureinpicture", "");
      video.preload = "metadata";
      video.addEventListener("contextmenu", function (e) { e.preventDefault(); });
      videoSection.appendChild(video);
    }
  }

})();
