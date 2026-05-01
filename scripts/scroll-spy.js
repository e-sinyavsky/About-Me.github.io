document.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(
    document.querySelectorAll(".section[id], section[id]")
  ).filter((s) => document.querySelector(`.header__menu-link[href="#${s.id}"]`));
  const links = Array.from(
    document.querySelectorAll('.header__menu-link[href^="#"]')
  );
  if (!sections.length || !links.length) return;

  const header = document.querySelector(".header");

  function update() {
    const headerH = header ? header.offsetHeight : 0;
    const triggerY = headerH + 80;
    let currentId = null;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= triggerY) currentId = section.id;
    }

    // If we're scrolled past the bottom of the page, keep the last section
    if (
      !currentId &&
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 4
    ) {
      currentId = sections[sections.length - 1].id;
    }

    for (const link of links) {
      const href = link.getAttribute("href");
      const isCurrent = href === `#${currentId}`;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
});
