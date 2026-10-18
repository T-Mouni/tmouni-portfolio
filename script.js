
/* MOUNIKA T. — Responsive portfolio interactions */
document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// 1. Rotating hero words
const words = [
  "business websites",
  "landing pages",
  "responsive websites",
  "website redesigns"
];

const rotatingWord = document.querySelector(".rotating-word");
let wordIndex = 0;

if (rotatingWord && !reduceMotion) {
  window.setInterval(() => {
    rotatingWord.classList.add("word-out");

    window.setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      rotatingWord.textContent = words[wordIndex];
      rotatingWord.classList.remove("word-out");
    }, 250);
  }, 2600);
}

// 2. Mobile navigation
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (menuToggle && nav) {
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "×" : "☰";
  }

  menuToggle.addEventListener("click", () => {
    setMenu(!nav.classList.contains("open"));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });
}

// 3. Scroll reveal
const revealItems = document.querySelectorAll("[data-reveal]");

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("in"));
}

// 4. Scroll progress bar
const progressBar = document.querySelector(".progress");

function updateProgress() {
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  if (progressBar) {
    const progress = maxScroll > 0
      ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
      : 0;

    progressBar.style.transform = `scaleX(${progress})`;
  }
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// 5. Optimise image loading
document.querySelectorAll("img").forEach(img => {
  img.decoding = "async";

  // Keep the portrait ready immediately.
  if (img.closest(".portrait-frame")) {
    img.loading = "eager";
    img.fetchPriority = "high";
  } else {
    // Load other images as the visitor approaches them.
    img.loading = "lazy";
  }
});

// 6. Small colourful sparkles for mobile taps and touch movement
// Sparkles stay away from the portrait and disappear quickly.
if (!reduceMotion) {
  const touchDevice = window.matchMedia(
    "(hover: none), (pointer: coarse)"
  ).matches;

  const sparkleColors = [
    "#7c6cf0",
    "#ec6fa8",
    "#0f9d8a",
    "#f5a524"
  ];

  let lastTouchSpark = 0;

  function createTouchSparkles(x, y, amount = 4) {
    for (let i = 0; i < amount; i++) {
      const sparkle = document.createElement("span");
      sparkle.className = "spark";

      const angle = Math.random() * Math.PI * 2;
      const distance = 12 + Math.random() * 28;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      sparkle.style.cssText = `
        left: ${x}px;
        top: ${y}px;
        background: ${sparkleColors[
          Math.floor(Math.random() * sparkleColors.length)
        ]};
        --dx: ${dx}px;
        --dy: ${dy}px;
      `;

      document.body.appendChild(sparkle);
      window.setTimeout(() => sparkle.remove(), 850);
    }
  }

  if (touchDevice) {
    document.addEventListener("pointerdown", event => {
      if (event.pointerType !== "touch") return;

      // Never place sparkles directly over the portrait.
      if (event.target.closest(".portrait-frame")) return;

      createTouchSparkles(event.clientX, event.clientY, 5);
    }, { passive: true });

    document.addEventListener("pointermove", event => {
      if (event.pointerType !== "touch") return;
      if (event.target.closest(".portrait-frame")) return;

      const now = performance.now();

      // Limit the effect so scrolling stays smooth.
      if (now - lastTouchSpark < 140) return;
      lastTouchSpark = now;

      createTouchSparkles(event.clientX, event.clientY, 2);
    }, { passive: true });
  }
}

// 7. Desktop cursor, sparkles and card tilt
// Disabled on touch devices to keep mobile scrolling smooth.
if (
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !reduceMotion
) {
  const glow = document.querySelector(".glow");
  const ring = document.createElement("div");
  const dot = document.createElement("div");

  ring.className = "cursor-ring";
  dot.className = "cursor-dot";
  document.body.append(ring, dot);

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let gx = mx;
  let gy = my;
  let rx = mx;
  let ry = my;
  let lastSpark = 0;

  function createDesktopSpark(x, y) {
    const sparkle = document.createElement("span");
    sparkle.className = "spark";

    sparkle.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      background: ${sparkleColors[
        Math.floor(Math.random() * sparkleColors.length)
      ]};
      --dx: ${(Math.random() - 0.5) * 60}px;
      --dy: ${Math.random() * 50 + 10}px;
    `;

    document.body.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 850);
  }

  window.addEventListener("pointermove", event => {
    mx = event.clientX;
    my = event.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;

    const now = performance.now();
    if (now - lastSpark > 70) {
      lastSpark = now;
      createDesktopSpark(mx, my);
    }
  }, { passive: true });

  function animateCursor() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;

    if (glow) {
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
    }

    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    window.requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.querySelectorAll("a, button").forEach(element => {
    element.addEventListener("pointerenter", () => {
      ring.classList.add("big");
    });

    element.addEventListener("pointerleave", () => {
      ring.classList.remove("big");
    });
  });

  document.querySelectorAll(".service-card, .project-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `perspective(900px) rotateY(${x * 8}deg) ` +
        `rotateX(${-y * 8}deg) translateY(-6px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// 8. Copyright year
const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}
