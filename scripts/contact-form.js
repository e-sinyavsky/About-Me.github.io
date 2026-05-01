import { translations } from "../locales/translation.js?v=11";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("contact-form-status");
  const submitBtn = form.querySelector(".contact-form__submit");
  const formspreeId = form.dataset.formspreeId;
  const mailto = form.dataset.mailto;

  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    message: form.elements.message,
  };

  function lang() {
    return document.documentElement.lang === "ru" ? "ru" : "en";
  }

  function tr(path, fallback) {
    const parts = path.split(".");
    let cur = translations[lang()];
    for (const p of parts) cur = cur?.[p];
    return cur ?? fallback ?? "";
  }

  function setFieldState(input, errorKey) {
    const wrapper = input.closest(".contact-form__field");
    const errEl = wrapper?.querySelector(".contact-form__error");

    if (errorKey) {
      input.setAttribute("aria-invalid", "true");
      wrapper?.setAttribute("data-state", "error");
      if (errEl) {
        errEl.textContent = tr(`contact.errors.${errorKey}`);
        errEl.hidden = false;
      }
      return false;
    }

    input.removeAttribute("aria-invalid");
    if (input.value.trim()) {
      wrapper?.setAttribute("data-state", "valid");
    } else {
      wrapper?.removeAttribute("data-state");
    }
    if (errEl) {
      errEl.hidden = true;
      errEl.textContent = "";
    }
    return true;
  }

  function validateField(input) {
    const value = input.value.trim();
    const name = input.name;

    if (!value) {
      return setFieldState(input, `${name}_required`);
    }
    if (name === "name" && value.length < 2) {
      return setFieldState(input, "name_short");
    }
    if (name === "email" && !EMAIL_RE.test(value)) {
      return setFieldState(input, "email_invalid");
    }
    if (name === "message" && value.length < 10) {
      return setFieldState(input, "message_short");
    }
    return setFieldState(input, null);
  }

  function validateAll() {
    let ok = true;
    for (const input of Object.values(fields)) {
      if (!validateField(input)) ok = false;
    }
    return ok;
  }

  // Re-translate already-shown errors when language changes
  const langObserver = new MutationObserver(() => {
    for (const input of Object.values(fields)) {
      const wrapper = input.closest(".contact-form__field");
      if (wrapper?.dataset.state === "error") validateField(input);
    }
  });
  langObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  // Validate on blur after user has interacted
  for (const input of Object.values(fields)) {
    input.addEventListener("blur", () => {
      if (input.value || input.dataset.touched) validateField(input);
    });
    input.addEventListener("input", () => {
      input.dataset.touched = "1";
      const wrapper = input.closest(".contact-form__field");
      if (wrapper?.dataset.state === "error") validateField(input);
    });
  }

  function setStatus(msg, state) {
    if (!status) return;
    status.textContent = msg || "";
    if (state) status.dataset.state = state;
    else status.removeAttribute("data-state");
  }

  function setSubmitState(state) {
    if (state) submitBtn.dataset.state = state;
    else submitBtn.removeAttribute("data-state");
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

    const honeypot = (form.elements._gotcha?.value || "").trim();
    if (honeypot) return;

    if (!validateAll()) {
      const firstInvalid = form.querySelector(
        '.contact-form__field[data-state="error"] input, ' +
          '.contact-form__field[data-state="error"] textarea'
      );
      firstInvalid?.focus();
      return;
    }

    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      message: fields.message.value.trim(),
    };

    setStatus("");
    setSubmitState("loading");
    submitBtn.disabled = true;

    try {
      if (formspreeId) {
        await submitFormspree(payload);
        setSubmitState("success");
        setStatus(
          lang() === "ru"
            ? "Спасибо! Сообщение отправлено."
            : "Thanks! Your message has been sent.",
          "success"
        );
        form.reset();
        for (const input of Object.values(fields)) {
          delete input.dataset.touched;
          input.closest(".contact-form__field")?.removeAttribute("data-state");
        }
        setTimeout(() => {
          setSubmitState(null);
          submitBtn.disabled = false;
        }, 2400);
      } else {
        submitMailto(payload);
        setSubmitState(null);
        submitBtn.disabled = false;
        setStatus(
          lang() === "ru"
            ? "Открываем почтовый клиент…"
            : "Opening your email client…"
        );
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setSubmitState(null);
      submitBtn.disabled = false;
      setStatus(
        lang() === "ru"
          ? "Не удалось отправить. Попробуйте написать напрямую."
          : "Couldn't send. Please try email directly.",
        "error"
      );
    }
  });
});
