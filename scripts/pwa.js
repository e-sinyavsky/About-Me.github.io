if ("serviceWorker" in navigator) {
  // Capture whether a controller already exists at boot time.
  // - controller present → page is controlled, any controllerchange means an UPDATE → reload
  // - controller missing → this is the first SW install → skip reload (no stale assets)
  const hadController = !!navigator.serviceWorker.controller;

  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("./service-worker.js");

      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!hadController || refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      // Periodically check for updates (covers long-lived tabs)
      setInterval(() => {
        reg.update().catch(() => {});
      }, 60 * 60 * 1000);
    } catch (err) {
      console.warn("Service worker registration failed:", err);
    }
  });
}
