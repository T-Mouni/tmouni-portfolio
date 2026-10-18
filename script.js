/* MOUNIKA T. — interactions */
document.documentElement.classList.add("js");

// 1. Rotating hero words
const words = ["business websites","landing pages","responsive websites","website redesigns"];
const rot = document.querySelector(".rotating-word");
let i = 0;
if (rot) setInterval(() => {
  rot.classList.add("word-out");
  setTimeout(() => { i = (i + 1) % words.length; rot.textContent = words[i]; rot.classList.remove("word-out"); }, 250);
}, 2600);

// 2. Mobile menu
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
if (toggle && nav) {
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "×" : "☰";
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
}

// 3. Scroll reveal
const items = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
} else items.forEach(el => el.classList.add("in"));

// 4. Scroll progress bar
const bar = document.querySelector(".progress");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (bar && max > 0) bar.style.transform = `scaleX(${scrollY / max})`;
}, { passive: true });

// 5. Cursor effects + card tilt (desktop only)
if (matchMedia("(hover:hover)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
  const glow = document.querySelector(".glow");
  const ring = document.createElement("div"); ring.className = "cursor-ring";
  const dot = document.createElement("div"); dot.className = "cursor-dot";
  document.body.append(ring, dot);
  let mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my, rx = mx, ry = my, last = 0;

  function spark(x, y) {
    const s = document.createElement("span");
    s.className = "spark";
    const c = ["#7c6cf0", "#ec6fa8", "#0f9d8a", "#f5a524"][Math.floor(Math.random() * 4)];
    s.style.cssText = `left:${x}px;top:${y}px;background:${c};--dx:${(Math.random() - .5) * 60}px;--dy:${Math.random() * 50 + 10}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }

  addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px)`;
    const now = performance.now();
    if (now - last > 45) { last = now; spark(mx, my); }
  }, { passive: true });

  (function loop() {
    gx += (mx - gx) * .08; gy += (my - gy) * .08;
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    if (glow) { glow.style.left = gx + "px"; glow.style.top = gy + "px"; }
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll("a,button").forEach((el) => {
    el.addEventListener("pointerenter", () => ring.classList.add("big"));
    el.addEventListener("pointerleave", () => ring.classList.remove("big"));
  });

  document.querySelectorAll(".service-card,.project-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave", () => card.style.transform = "");
  });
}
// 6. Copyright year
const y = document.querySelector("#year");
if (y) y.textContent = new Date().getFullYear();