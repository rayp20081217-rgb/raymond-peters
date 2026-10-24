// ============================================
// RAYP PORTFOLIO — MAIN JAVASCRIPT
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const topBtn = document.getElementById("topBtn");

  // Footer year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================

  function closeMenu() {
    if (!mainNav || !menuToggle) return;

    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.className = "fas fa-bars";
    }

    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );

      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
      }

      document.body.classList.toggle("menu-open", isOpen);
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // ==========================================
  // HEADER SCROLL EFFECT
  // ==========================================

  function handleScroll() {
    const scrollY = window.scrollY;

    if (header) {
      header.classList.toggle("scrolled", scrollY > 20);
    }

    if (topBtn) {
      topBtn.classList.toggle("show", scrollY > 350);
    }
  }

  window.addEventListener("scroll", handleScroll, {
    passive: true
  });

  handleScroll();

  // ==========================================
  // BACK TO TOP
  // ==========================================

  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // ==========================================
  // TYPING ANIMATION
  // ==========================================

  const typedElement = document.getElementById("typed");

  if (typedElement) {
    const phrases = [
      "modern websites",
      "responsive systems",
      "creative interfaces",
      "digital solutions"
    ];

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      typedElement.textContent = phrases[0];
    } else {
      let phraseIndex = 0;
      let characterIndex = 0;
      let deleting = false;

      function typeText() {
        const phrase = phrases[phraseIndex];

        if (deleting) {
          characterIndex--;
        } else {
          characterIndex++;
        }

        typedElement.textContent = phrase.slice(0, characterIndex);

        let delay = deleting ? 35 : 75;

        if (!deleting && characterIndex === phrase.length) {
          deleting = true;
          delay = 1400;
        } else if (deleting && characterIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 350;
        }

        window.setTimeout(typeText, delay);
      }

      typeText();
    }
  }

  // ==========================================
  // ACTIVE NAVIGATION LINK
  // ==========================================

  const navLinks = [...document.querySelectorAll(".nav-link[href^='#']")];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleSections.length) return;

      const currentId = visibleSections[0].target.id;

      navLinks.forEach(link => {
        const active = link.getAttribute("href") === `#${currentId}`;

        link.classList.toggle("active", active);

        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.1, 0.3, 0.6]
    });

    sections.forEach(section => observer.observe(section));
  }

  // ==========================================
  // GALLERY FILTERS
  // ==========================================

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = [...document.querySelectorAll(".gallery-item")];

  function visibleGalleryItems() {
    return galleryItems.filter(item => !item.classList.contains("is-hidden"));
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach(filterButton => {
        const active = filterButton === button;

        filterButton.classList.toggle("active", active);
        filterButton.setAttribute("aria-pressed", String(active));
      });

      galleryItems.forEach(item => {
        const matches =
          filter === "all" || item.dataset.category === filter;

        item.classList.toggle("is-hidden", !matches);
      });
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  // ==========================================
  // GALLERY LIGHTBOX
  // ==========================================

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let currentImageIndex = 0;
  let previouslyFocusedElement = null;

  function showGalleryImage(index) {
    const items = visibleGalleryItems();

    if (!items.length || !lightboxImage) return;

    currentImageIndex = (index + items.length) % items.length;

    const item = items[currentImageIndex];
    const image = item.querySelector("img");

    if (!image) return;

    lightboxImage.src = item.dataset.full || image.src;
    lightboxImage.alt = image.alt;

    if (lightboxCaption) {
      lightboxCaption.textContent =
        item.dataset.caption || image.alt || "";
    }

    if (lightboxPrev) {
      lightboxPrev.hidden = items.length < 2;
    }

    if (lightboxNext) {
      lightboxNext.hidden = items.length < 2;
    }
  }

  function openLightbox(item) {
    if (!lightbox) return;

    const items = visibleGalleryItems();
    const index = items.indexOf(item);

    if (index < 0) return;

    previouslyFocusedElement = document.activeElement;

    showGalleryImage(index);

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    if (lightboxClose) {
      lightboxClose.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
    }

    if (
      previouslyFocusedElement &&
      document.contains(previouslyFocusedElement)
    ) {
      previouslyFocusedElement.focus();
    }
  }

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      openLightbox(item);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => {
      showGalleryImage(currentImageIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => {
      showGalleryImage(currentImageIndex + 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", event => {
    if (!lightbox || !lightbox.classList.contains("open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showGalleryImage(currentImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showGalleryImage(currentImageIndex + 1);
    }
  });

  // ==========================================
  // GALLERY IMAGE ERROR HANDLING
  // ==========================================

  galleryItems.forEach(item => {
    const image = item.querySelector("img");

    if (!image) return;

    image.addEventListener("error", () => {
      item.classList.add("image-unavailable");
      item.setAttribute("aria-label", "Gallery image unavailable");
    }, { once: true });
  });
});
