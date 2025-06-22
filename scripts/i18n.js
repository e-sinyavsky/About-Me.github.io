import { translations } from "../locales/translation.js";

let currentLanguage = "en";

export function setLanguage(lang) {
  if (!translations[lang]) return false;

  currentLanguage = lang;
  document.documentElement.lang = lang;
  updateTexts();
  return true;
}

function updateTexts() {
  const langData = translations[currentLanguage];
  if (!langData) return;

  const updateElement = (selector, content, useInnerHTML = false) => {
    const element = document.querySelector(selector);
    if (!element) return;

    if (useInnerHTML) {
      element.innerHTML = content;
    } else {
      element.textContent = content;
    }
  };

  updateElement('[i18n="header.nav.about"]', langData.header?.nav?.about);
  updateElement('[i18n="header.nav.skills"]', langData.header?.nav?.skills);
  updateElement(
    '[i18n="header.nav.education"]',
    langData.header?.nav?.education
  );
  updateElement('[i18n="educations.title"]', langData.educations?.title);
  updateElement(
    '[i18n="educations.bguir.title"]',
    langData.educations?.bguir?.title
  );
  updateElement(
    '[i18n="educations.bguir.badge"]',
    langData.educations?.bguir?.badge
  );
  updateElement(
    '[i18n="educations.bguir.speciality"]',
    langData.educations?.bguir?.speciality
  );
  updateElement(
    '[i18n="educations.mtek.title"]',
    langData.educations?.mtek?.title
  );
  updateElement(
    '[i18n="educations.mtek.badge"]',
    langData.educations?.mtek?.badge
  );
  updateElement(
    '[i18n="educations.mtek.speciality"]',
    langData.educations?.mtek?.speciality
  );

  updateElement(
    '[i18n="header.nav.experience"]',
    langData.header?.nav?.experience
  );
  updateElement('[i18n="header.nav.contacts"]', langData.header?.nav?.contacts);
  updateElement('[i18n="hero.button"]', langData.hero?.button);
  updateElement('[i18n="hero.pdf_button"]', langData.hero?.pdf_button);

  updateElement('[i18n="skills.frontend"]', langData.skills?.frontend);
  updateElement('[i18n="skills.backend"]', langData.skills?.backend);
  updateElement('[i18n="skills.hard"]', langData.skills?.hard, true);
  updateElement('[i18n="skills.soft"]', langData.skills?.soft, true);
  updateElement('[i18n="skills.other"]', langData.skills?.other, true);
  updateElement('[i18n="skills.english"]', langData.skills?.english, true);

  updateElement('[i18n="experience.title"]', langData.experience?.title, true);
  updateElement('[i18n="footer.title"]', langData.footer?.title, true);
  updateElement('[i18n="footer.subtitle"]', langData.footer?.subtitle);

  const softSkills = langData.skills?.soft_skills || {};
  updateElement('[i18n="skills.soft_skills.a"]', softSkills.a);
  updateElement('[i18n="skills.soft_skills.b"]', softSkills.b);
  updateElement('[i18n="skills.soft_skills.c"]', softSkills.c);
  updateElement('[i18n="skills.soft_skills.d"]', softSkills.d);

  const workExp = langData.work_experience?.descriptions || {};

  const streamline = workExp.streamline || {};
  updateElement(
    '[i18n="work_experience.descriptions.streamline.a"]',
    streamline.a
  );
  updateElement(
    '[i18n="work_experience.descriptions.streamline.b"]',
    streamline.b
  );
  updateElement(
    '[i18n="work_experience.descriptions.streamline.c"]',
    streamline.c
  );
  updateElement(
    '[i18n="work_experience.descriptions.streamline.d"]',
    streamline.d
  );

  const vibrant = workExp.vibrant || {};
  updateElement('[i18n="work_experience.descriptions.vibrant.a"]', vibrant.a);
  updateElement('[i18n="work_experience.descriptions.vibrant.b"]', vibrant.b);
  updateElement('[i18n="work_experience.descriptions.vibrant.c"]', vibrant.c);
  updateElement('[i18n="work_experience.descriptions.vibrant.d"]', vibrant.d);

  const justicebid = workExp.justicebid || {};
  updateElement(
    '[i18n="work_experience.descriptions.justicebid.a"]',
    justicebid.a
  );
  updateElement(
    '[i18n="work_experience.descriptions.justicebid.b"]',
    justicebid.b
  );
  updateElement(
    '[i18n="work_experience.descriptions.justicebid.c"]',
    justicebid.c
  );
  updateElement(
    '[i18n="work_experience.descriptions.justicebid.d"]',
    justicebid.d
  );

  const heroText = document.getElementById("auto_typing_text");
  if (heroText && langData.hero?.title) {
    heroText.innerHTML = langData.hero.title;
  }
}

document
  .querySelector(".language-selector__toggle")
  .addEventListener("click", function () {
    const isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });

// Обработчик для выбора языка
document.querySelectorAll(".language-selector__option").forEach((option) => {
  option.addEventListener("click", function () {
    const lang = this.dataset.lang;
    if (setLanguage(lang)) {
      // Обновляем текущий язык
      document.querySelector(".language-selector__current").textContent =
        lang.toUpperCase();

      // Обновляем активный элемент
      document.querySelectorAll(".language-selector__option").forEach((opt) => {
        opt.classList.toggle("active", opt === this);
      });

      // Закрываем dropdown
      document
        .querySelector(".language-selector__toggle")
        .setAttribute("aria-expanded", "false");
    }
  });
});

// Закрытие при клике вне элемента
document.addEventListener("click", function (e) {
  const selector = document.querySelector(".language-selector");
  if (!selector.contains(e.target)) {
    selector
      .querySelector(".language-selector__toggle")
      .setAttribute("aria-expanded", "false");
  }
});
