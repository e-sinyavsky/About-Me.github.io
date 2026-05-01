(function () {
  const list = document.getElementById("news-list");
  const empty = document.getElementById("news-empty");
  const errorEl = document.getElementById("news-error");
  if (!list) return;

  const POSTS_URL = "news/posts.json?v=11";
  let postsCache = null;

  function lang() {
    return document.documentElement.lang === "ru" ? "ru" : "en";
  }

  function l10n(field) {
    return field?.[lang()] ?? field?.en ?? "";
  }

  function fmtDate(iso) {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat(lang() === "ru" ? "ru-RU" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(d);
    } catch (_) {
      return iso;
    }
  }

  function readMoreLabel() {
    return lang() === "ru" ? "Читать дальше" : "Read more";
  }

  function readLessLabel() {
    return lang() === "ru" ? "Свернуть" : "Show less";
  }

  function renderSkeleton() {
    list.innerHTML = `
      <article class="news-card news-card--skeleton" aria-hidden="true"></article>
      <article class="news-card news-card--skeleton" aria-hidden="true"></article>
    `;
    list.setAttribute("aria-busy", "true");
  }

  function postEl(post) {
    const el = document.createElement("article");
    el.className = "news-card";
    el.id = `post-${post.id}`;
    el.dataset.postId = post.id;

    const tagsHTML = (post.tags || [])
      .map((t) => `<span class="news-card__tag">${escapeHtml(t)}</span>`)
      .join("");

    const dateText = fmtDate(post.date);
    const readMin = post.read_minutes
      ? ` · ${post.read_minutes} ${lang() === "ru" ? "мин чтения" : "min read"}`
      : "";

    el.innerHTML = `
      <header class="news-card__head">
        <div class="news-card__meta">
          <time class="news-card__date" datetime="${escapeHtml(post.date)}">${escapeHtml(dateText)}${escapeHtml(readMin)}</time>
          <div class="news-card__tags">${tagsHTML}</div>
        </div>
        <h2 class="news-card__title">
          <a href="#post-${escapeHtml(post.id)}" class="news-card__anchor">${escapeHtml(l10n(post.title))}</a>
        </h2>
        <p class="news-card__excerpt">${escapeHtml(l10n(post.excerpt))}</p>
      </header>
      <div class="news-card__body" hidden>${l10n(post.content)}</div>
      <button
        type="button"
        class="news-card__toggle"
        aria-expanded="false"
        aria-controls="post-body-${escapeHtml(post.id)}"
      >
        <span class="news-card__toggle-label">${readMoreLabel()}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    `;

    el.querySelector(".news-card__body").id = `post-body-${post.id}`;

    const toggle = el.querySelector(".news-card__toggle");
    const body = el.querySelector(".news-card__body");
    const titleLink = el.querySelector(".news-card__anchor");

    function setOpen(open) {
      el.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".news-card__toggle-label").textContent = open
        ? readLessLabel()
        : readMoreLabel();
      body.hidden = !open;
    }

    toggle.addEventListener("click", () => {
      setOpen(!el.classList.contains("is-open"));
    });
    titleLink.addEventListener("click", (e) => {
      // Allow native hash update, but also expand inline
      if (!el.classList.contains("is-open")) {
        e.preventDefault();
        setOpen(true);
        history.replaceState(null, "", `#post-${post.id}`);
      }
    });

    el.__setOpen = setOpen;
    return el;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function render(posts) {
    list.innerHTML = "";
    list.setAttribute("aria-busy", "false");

    if (!posts || posts.length === 0) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;

    const sorted = [...posts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    for (const post of sorted) {
      list.appendChild(postEl(post));
    }

    // Open the post that matches the current hash
    if (location.hash.startsWith("#post-")) {
      const target = document.getElementById(location.hash.slice(1));
      if (target?.__setOpen) {
        target.__setOpen(true);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  async function fetchPosts() {
    if (postsCache) return postsCache;
    const res = await fetch(POSTS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    postsCache = await res.json();
    return postsCache;
  }

  async function load() {
    renderSkeleton();
    try {
      const posts = await fetchPosts();
      render(posts);
    } catch (err) {
      console.warn("news fetch failed:", err);
      list.innerHTML = "";
      list.setAttribute("aria-busy", "false");
      if (errorEl) errorEl.hidden = false;
    }
  }

  // Re-render when language changes
  const langObserver = new MutationObserver(() => {
    if (postsCache) render(postsCache);
  });
  langObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  load();
})();
