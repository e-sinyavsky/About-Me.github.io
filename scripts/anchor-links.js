function getHeaderOffset() {
  const header = document.querySelector(".header");
  return header ? header.offsetHeight : 0;
}

function scrollToTarget(targetElement, smooth) {
  const headerOffset = getHeaderOffset();
  const top =
    targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top,
    behavior: smooth && !reduce ? "smooth" : "auto",
  });
}

function handleAnchorClick(e) {
  const targetId =
    this.getAttribute("href") || this.getAttribute("data-target");
  if (!targetId || targetId === "#" || !targetId.startsWith("#")) return;

  const targetElement = document.querySelector(targetId);
  if (!targetElement) return;

  e.preventDefault();

  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".header__menu");
  if (burger && menu && burger.classList.contains("active")) {
    burger.classList.remove("active");
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "auto";
  }

  scrollToTarget(targetElement, true);

  if (history.pushState) {
    history.pushState(null, "", targetId);
  } else {
    window.location.hash = targetId;
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", handleAnchorClick);
});

const heroButton = document.getElementById("hero__button");
if (heroButton) {
  heroButton.addEventListener("click", handleAnchorClick);
}

// Cross-page hash navigation: when arriving at this page with a hash
// (e.g. /index.html#skills from /news.html), apply the header-aware offset.
function applyHashScroll() {
  const hash = location.hash;
  if (!hash || hash === "#") return;
  // News post anchors are handled by news.js (it expands the matching post)
  if (hash.startsWith("#post-")) return;
  const target = document.querySelector(hash);
  if (!target) return;

  // Wait one frame for layout to settle (fonts, images may shift)
  requestAnimationFrame(() => {
    scrollToTarget(target, false);
  });
}

if (document.readyState === "complete") {
  applyHashScroll();
} else {
  // Apply twice: once after initial layout, once after full load (images).
  document.addEventListener("DOMContentLoaded", applyHashScroll);
  window.addEventListener("load", applyHashScroll);
}

// Also handle clicks on cross-page hash links from inside the same domain
// (gracefully — browser handles them, but on mobile keep the burger closed).
document.querySelectorAll('a[href*=".html#"]').forEach((anchor) => {
  anchor.addEventListener("click", () => {
    const burger = document.querySelector(".header__burger");
    const menu = document.querySelector(".header__menu");
    if (burger && menu && burger.classList.contains("active")) {
      burger.classList.remove("active");
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "auto";
    }
  });
});
