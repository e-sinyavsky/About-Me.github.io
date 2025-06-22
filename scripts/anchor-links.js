// anchor-links.js
function handleAnchorClick(e) {
  e.preventDefault();

  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".header__menu");
  if (burger.classList.contains("active")) {
    burger.classList.remove("active");
    menu.classList.remove("open");
  }

  const targetId =
    this.getAttribute("href") || this.getAttribute("data-target");
  if (!targetId || targetId === "#") return;

  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    const headerHeight = document.querySelector(".header").offsetHeight;
    const targetPosition =
      targetElement.getBoundingClientRect().top +
      window.pageYOffset -
      headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    if (history.pushState) {
      history.pushState(null, null, targetId);
    } else {
      window.location.hash = targetId;
    }
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", handleAnchorClick);
});

document
  .getElementById("hero__button")
  .addEventListener("click", handleAnchorClick);
