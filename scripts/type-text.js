document.addEventListener("DOMContentLoaded", function () {
  const target = document.getElementById("auto_typing_text");
  if (!target || typeof Typed === "undefined") {
    if (target) {
      target.textContent =
        "Hello! My name is Sinyavsky Egor. Let me show you my capabilities... I can do some great things for you.";
    }
    document.getElementById("hero__button")?.classList.add("is-show");
    document.getElementById("pdf-download")?.classList.add("is-show-pdf-b");
    return;
  }

  new Typed("#auto_typing_text", {
    strings: [
      '<span class="text-accent">Hello!</span> My name is Sinyavsky Egor.\n^500\n<span class="highlight">Let me show you my capabilities...</span> ^1000\n<span class="highlight">I can do some great things for you.</span>',
    ],
    typeSpeed: 25,
    loop: false,
    showCursor: false,
    onComplete: function () {
      const cursor = document.querySelector(".typed-cursor");
      if (cursor) cursor.style.display = "none";
      document.getElementById("hero__button")?.classList.add("is-show");
      document.getElementById("pdf-download")?.classList.add("is-show-pdf-b");
    },
  });
});
