document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  const SHOW_AT = 400;
  let visible = false;

  // Drop the [hidden] attribute so CSS can drive visibility via opacity
  btn.removeAttribute("hidden");

  function update() {
    const shouldShow = window.scrollY > SHOW_AT;
    if (shouldShow === visible) return;
    visible = shouldShow;
    btn.classList.toggle("is-visible", shouldShow);
    btn.setAttribute("aria-hidden", String(!shouldShow));
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  update();
});
