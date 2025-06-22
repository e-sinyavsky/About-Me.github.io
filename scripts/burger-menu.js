document.addEventListener("DOMContentLoaded", function () {
  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".header__menu");
  const body = document.body;

  function closeMenu() {
    burger.classList.remove("active");
    menu.classList.remove("open");
    body.style.overflow = "auto";
  }

  burger.addEventListener("click", function () {
    this.classList.toggle("active");
    menu.classList.toggle("open");

    if (menu.classList.contains("open")) {
      body.style.overflow = "hidden";
    } else {
      closeMenu();
    }
  });

  const menuItems = document.querySelectorAll(".header__menu a");
  menuItems.forEach((item) => {
    item.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });
});
