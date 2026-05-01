import { translations } from "../locales/translation.js?v=5";

const STORAGE_KEY = "language";
const DEFAULT_LANG = "en";
let currentLanguage = DEFAULT_LANG;

const I18N_BINDINGS = [
  { selector: '[i18n="header.nav.about"]', path: ["header", "nav", "about"] },
  { selector: '[i18n="header.nav.skills"]', path: ["header", "nav", "skills"] },
  { selector: '[i18n="header.nav.education"]', path: ["header", "nav", "education"] },
  { selector: '[i18n="header.nav.experience"]', path: ["header", "nav", "experience"] },
  { selector: '[i18n="header.nav.projects"]', path: ["header", "nav", "projects"] },
  { selector: '[i18n="header.nav.contacts"]', path: ["header", "nav", "contacts"] },

  { selector: '[i18n="projects.title"]', path: ["projects", "title"], html: true },
  { selector: '[i18n="projects.subtitle"]', path: ["projects", "subtitle"] },
  { selector: '[i18n="projects.cta"]', path: ["projects", "cta"] },
  { selector: '[i18n="projects.error"]', path: ["projects", "error"] },

  { selector: '[i18n="hero.button"]', path: ["hero", "button"] },
  { selector: '[i18n="hero.pdf_button"]', path: ["hero", "pdf_button"] },

  { selector: '[i18n="skills.frontend"]', path: ["skills", "frontend"] },
  { selector: '[i18n="skills.backend"]', path: ["skills", "backend"] },
  { selector: '[i18n="skills.hard"]', path: ["skills", "hard"], html: true },
  { selector: '[i18n="skills.soft"]', path: ["skills", "soft"], html: true },
  { selector: '[i18n="skills.other"]', path: ["skills", "other"], html: true },
  { selector: '[i18n="skills.english"]', path: ["skills", "english"], html: true },

  { selector: '[i18n="skills.soft_skills.a"]', path: ["skills", "soft_skills", "a"] },
  { selector: '[i18n="skills.soft_skills.b"]', path: ["skills", "soft_skills", "b"] },
  { selector: '[i18n="skills.soft_skills.c"]', path: ["skills", "soft_skills", "c"] },
  { selector: '[i18n="skills.soft_skills.d"]', path: ["skills", "soft_skills", "d"] },

  { selector: '[i18n="experience.title"]', path: ["experience", "title"], html: true },

  { selector: '[i18n="educations.title"]', path: ["educations", "title"] },
  { selector: '[i18n="educations.bguir.title"]', path: ["educations", "bguir", "title"] },
  { selector: '[i18n="educations.bguir.badge"]', path: ["educations", "bguir", "badge"] },
  { selector: '[i18n="educations.bguir.speciality"]', path: ["educations", "bguir", "speciality"] },
  { selector: '[i18n="educations.mtek.title"]', path: ["educations", "mtek", "title"] },
  { selector: '[i18n="educations.mtek.badge"]', path: ["educations", "mtek", "badge"] },
  { selector: '[i18n="educations.mtek.speciality"]', path: ["educations", "mtek", "speciality"] },

  { selector: '[i18n="work_experience.descriptions.streamline.a"]', path: ["work_experience", "descriptions", "streamline", "a"] },
  { selector: '[i18n="work_experience.descriptions.streamline.b"]', path: ["work_experience", "descriptions", "streamline", "b"] },
  { selector: '[i18n="work_experience.descriptions.streamline.c"]', path: ["work_experience", "descriptions", "streamline", "c"] },
  { selector: '[i18n="work_experience.descriptions.streamline.d"]', path: ["work_experience", "descriptions", "streamline", "d"] },

  { selector: '[i18n="work_experience.descriptions.vibrant.a"]', path: ["work_experience", "descriptions", "vibrant", "a"] },
  { selector: '[i18n="work_experience.descriptions.vibrant.b"]', path: ["work_experience", "descriptions", "vibrant", "b"] },
  { selector: '[i18n="work_experience.descriptions.vibrant.c"]', path: ["work_experience", "descriptions", "vibrant", "c"] },
  { selector: '[i18n="work_experience.descriptions.vibrant.d"]', path: ["work_experience", "descriptions", "vibrant", "d"] },

  { selector: '[i18n="work_experience.descriptions.justicebid.a"]', path: ["work_experience", "descriptions", "justicebid", "a"] },
  { selector: '[i18n="work_experience.descriptions.justicebid.b"]', path: ["work_experience", "descriptions", "justicebid", "b"] },
  { selector: '[i18n="work_experience.descriptions.justicebid.c"]', path: ["work_experience", "descriptions", "justicebid", "c"] },
  { selector: '[i18n="work_experience.descriptions.justicebid.d"]', path: ["work_experience", "descriptions", "justicebid", "d"] },

  { selector: '[i18n="footer.title"]', path: ["footer", "title"], html: true },
  { selector: '[i18n="footer.subtitle"]', path: ["footer", "subtitle"] },
];

function resolvePath(obj, path) {
  return path.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

function applyTexts() {
  const langData = translations[currentLanguage];
  if (!langData) return;

  for (const { selector, path, html } of I18N_BINDINGS) {
    const value = resolvePath(langData, path);
    if (value == null) continue;

    document.querySelectorAll(selector).forEach((el) => {
      if (html) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });
  }

  const heroText = document.getElementById("auto_typing_text");
  if (heroText && langData.hero?.title) {
    heroText.innerHTML = langData.hero.title;
  }
}

function syncLanguageUI(lang) {
  const current = document.querySelector(".language-selector__current");
  if (current) current.textContent = lang.toUpperCase();

  document.querySelectorAll(".language-selector__option").forEach((opt) => {
    const isActive = opt.dataset.lang === lang;
    opt.classList.toggle("active", isActive);
    opt.setAttribute("aria-selected", String(isActive));
  });
}

export function setLanguage(lang) {
  if (!translations[lang]) return false;

  currentLanguage = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (_) {
    // localStorage may be unavailable (private mode, disabled cookies)
  }
  applyTexts();
  syncLanguageUI(lang);
  return true;
}

function initialLanguage() {
  let stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    // ignore
  }
  if (stored && translations[stored]) return stored;

  const browser = (navigator.language || DEFAULT_LANG).slice(0, 2).toLowerCase();
  return translations[browser] ? browser : DEFAULT_LANG;
}

function init() {
  setLanguage(initialLanguage());

  const toggle = document.querySelector(".language-selector__toggle");
  if (toggle) {
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", String(!isExpanded));
    });
  }

  document.querySelectorAll(".language-selector__option").forEach((option) => {
    option.addEventListener("click", function () {
      const lang = this.dataset.lang;
      if (setLanguage(lang) && toggle) {
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", function (e) {
    const selector = document.querySelector(".language-selector");
    if (selector && !selector.contains(e.target)) {
      const t = selector.querySelector(".language-selector__toggle");
      if (t) t.setAttribute("aria-expanded", "false");
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
