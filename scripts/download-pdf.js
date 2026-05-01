document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("pdf-download");
  if (!button) return;

  button.addEventListener("click", async () => {
    try {
      button.classList.add("loading");
      button.disabled = true;

      const fileUrl = "assets/cv.pdf";
      const fileName = "Egor_Sinyavsky_CV.pdf";

      const response = await fetch(fileUrl, { method: "HEAD" });
      if (!response.ok) {
        throw new Error("File not available");
      }

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.rel = "noopener";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert(
        "Sorry, the CV download is currently unavailable. Please try again later."
      );
    } finally {
      button.classList.remove("loading");
      button.disabled = false;
    }
  });
});
