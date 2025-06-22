// typed-text.js
document.addEventListener("DOMContentLoaded", function() {
  var typed = new Typed("#auto_typing_text", {
    strings: [
      '<span class="text-accent">Hello!</span> My name is Sinyavsky Egor.\n^500\n<span class="highlight">Let me show you my capabilities...</span> ^1000\n<span class="highlight">I can do some great things for you.</span>',
    ],
    typeSpeed: 25,
    loop: false,
    showCursor: false,
    onComplete: function (self) {
      const cursor = document.querySelector(".typed-cursor");
      if (cursor) cursor.style.display = "none";
      document.getElementById("hero__button").classList.add("is-show");
      document.getElementById("pdf-download").classList.add("is-show-pdf-b");
    },
  });
});