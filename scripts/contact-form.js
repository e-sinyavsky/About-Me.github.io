document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("contact-form-status");
  const submitBtn = form.querySelector(".contact-form__submit");
  const formspreeId = form.dataset.formspreeId;
  const mailto = form.dataset.mailto;

  function setStatus(msg, state = "") {
    if (!status) return;
    status.textContent = msg || "";
    if (state) status.dataset.state = state;
    else status.removeAttribute("data-state");
  }

  function localized(en, ru) {
    return document.documentElement.lang === "ru" ? ru : en;
  }

  function buildPayload() {
    const data = new FormData(form);
    return {
      name: (data.get("name") || "").toString().trim(),
      email: (data.get("email") || "").toString().trim(),
      message: (data.get("message") || "").toString().trim(),
      gotcha: (data.get("_gotcha") || "").toString(),
    };
  }

  async function submitFormspree(payload) {
    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        message: payload.message,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }

  function submitMailto(payload) {
    const subject = `Portfolio inquiry from ${payload.name}`;
    const body = `${payload.message}\n\n— ${payload.name} <${payload.email}>`;
    const href = `mailto:${mailto}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = buildPayload();

    if (payload.gotcha) return; // honeypot tripped

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus(
      localized("Sending…", "Отправляем…"),
      ""
    );
    submitBtn.disabled = true;

    try {
      if (formspreeId) {
        await submitFormspree(payload);
        form.reset();
        setStatus(
          localized(
            "Thanks! Your message has been sent.",
            "Спасибо! Сообщение отправлено."
          ),
          "success"
        );
      } else {
        submitMailto(payload);
        setStatus(
          localized(
            "Opening your email client…",
            "Открываем почтовый клиент…"
          )
        );
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus(
        localized(
          "Couldn't send. Please try email directly.",
          "Не удалось отправить. Попробуйте написать напрямую."
        ),
        "error"
      );
    } finally {
      submitBtn.disabled = false;
    }
  });
});
