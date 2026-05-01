document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("pdf-download");
  if (!button) return;

  button.addEventListener("click", async () => {
    if (button.dataset.state === "loading") return;

    button.dataset.state = "loading";
    button.disabled = true;

    try {
      const fileUrl = "assets/cv.pdf";
      const fileName = "Egor_Sinyavsky_CV.pdf";

      const response = await fetch(fileUrl, { method: "HEAD" });
      if (!response.ok) throw new Error("File not available");

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.rel = "noopener";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();

      button.dataset.state = "success";
      setTimeout(() => {
        delete button.dataset.state;
        button.disabled = false;
      }, 1800);
    } catch (error) {
      console.error("Download failed:", error);
      button.dataset.state = "error";
      setTimeout(() => {
        delete button.dataset.state;
        button.disabled = false;
      }, 1800);
      alert(
        "Sorry, the CV download is currently unavailable. Please try again later."
      );
    }
  });
});
