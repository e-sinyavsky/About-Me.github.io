document.addEventListener("DOMContentLoaded", function () {
  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".header__menu");
  const body = document.body;

  if (!burger || !menu) return;

  function setOpen(open) {
    burger.classList.toggle("active", open);
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    body.style.overflow = open ? "hidden" : "auto";
  }

  function closeMenu() {
    setOpen(false);
  }

  burger.addEventListener("click", function () {
    const isOpen = !menu.classList.contains("open");
    setOpen(isOpen);
  });

  document.querySelectorAll(".header__menu a").forEach((item) => {
    item.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      closeMenu();
      burger.focus();
    }
  });
});
