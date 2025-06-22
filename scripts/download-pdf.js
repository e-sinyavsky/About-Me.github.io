document
  .getElementById("pdf-download")
  .addEventListener("click", async function () {
    const button = this;
    const fileUrl = "assets/cv.pdf";
    const fileName = "Egor_Sinyavsky_CV.pdf";

    button.classList.add("loading");
    button.disabled = true;

    try {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        window.open(fileUrl, "_blank");
      } else {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (error) {
      console.error("Download error:", error);
      window.open(fileUrl, "_blank");
    } finally {
      setTimeout(() => {
        button.classList.remove("loading");
        button.disabled = false;
      }, 3000);
    }
  });
