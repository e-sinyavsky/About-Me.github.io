document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  if (!header) return;

  const SCROLL_THRESHOLD = 50;
  let ticking = false;

  function update() {
    header.classList.toggle("scrolled", window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
});
