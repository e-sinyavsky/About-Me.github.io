// Tell the browser we'll handle scroll restoration manually
// (so it won't restore the previous scroll position on reload).
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {
  // Honour cross-page hash navigation: don't reset scroll if a hash is set.
  if (location.hash && location.hash !== "#") return;
  window.scrollTo(0, 0);
});
