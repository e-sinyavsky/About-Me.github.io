document.addEventListener("DOMContentLoaded", () => {
  const links = Array.from(
    document.querySelectorAll('.header__menu-link[href^="#"]')
  );
  if (!links.length) return;

  // Pair each #hash nav link with its target element (any element, not just .section).
  const items = links
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      const target = id && document.getElementById(id);
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (!items.length) return;

  // Sort by document order so "last passed" works regardless of nav menu order.
  items.sort(
    (a, b) =>
      a.target.compareDocumentPosition(b.target) &
      Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1
  );

  const header = document.querySelector(".header");

  function update() {
    const headerH = header ? header.offsetHeight : 0;
    const triggerY = headerH + 80;
    let currentIdx = -1;

    for (let i = 0; i < items.length; i++) {
      const rect = items[i].target.getBoundingClientRect();
      if (rect.top <= triggerY) currentIdx = i;
    }

    // If we're at the very bottom of the page, force the last item active
    if (
      window.scrollY + window.innerHeight >=
      document.body.scrollHeight - 4
    ) {
      currentIdx = items.length - 1;
    }

    items.forEach((item, i) => {
      const isCurrent = i === currentIdx;
      item.link.classList.toggle("is-current", isCurrent);
      if (isCurrent) item.link.setAttribute("aria-current", "true");
      else item.link.removeAttribute("aria-current");
    });
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
