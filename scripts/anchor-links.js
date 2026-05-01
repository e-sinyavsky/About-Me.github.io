function handleAnchorClick(e) {
  const targetId =
    this.getAttribute("href") || this.getAttribute("data-target");
  if (!targetId || targetId === "#") return;

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

  const header = document.querySelector(".header");
  const headerHeight = header ? header.offsetHeight : 0;
  const targetPosition =
    targetElement.getBoundingClientRect().top +
    window.scrollY -
    headerHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });

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
