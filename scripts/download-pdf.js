document
  .getElementById("pdf-download")
  .addEventListener("click", async function () {
    const button = this;

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
      link.style.display = "none";
      document.body.appendChild(link);

      await new Promise((resolve) => requestAnimationFrame(resolve));

      link.click();

      await new Promise((resolve) => setTimeout(resolve, 200));
      document.body.removeChild(link);
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
