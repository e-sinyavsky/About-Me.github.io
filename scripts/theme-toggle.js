document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  const root = document.documentElement;

  function readStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (_) {
      return null;
    }
  }

  function writeStoredTheme(value) {
    try {
      localStorage.setItem("theme", value);
    } catch (_) {
      // localStorage unavailable
    }
  }

  function systemPrefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.setAttribute("data-theme", theme);
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  const initial =
    readStoredTheme() || (systemPrefersDark() ? "dark" : "light");
  applyTheme(initial);

  themeToggle.addEventListener("click", () => {
    const next =
      root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    writeStoredTheme(next);
  });

  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (readStoredTheme()) return; // user already chose
      applyTheme(e.matches ? "dark" : "light");
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
    } else if (mq.addListener) {
      mq.addListener(handler);
    }
  }
});
