(function () {
  const section = document.getElementById("projects");
  const grid = document.getElementById("projects-grid");
  const errorEl = document.getElementById("projects-error");
  if (!section || !grid) return;

  const user = section.dataset.githubUser || "e-sinyavsky";
  const limit = Number(section.dataset.githubLimit) || 6;
  const STORAGE_KEY = `gh-repos:${user}`;
  const TTL_MS = 60 * 60 * 1000; // 1 hour

  function readCache() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts > TTL_MS) return null;
      return data;
    } catch (_) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ts: Date.now(), data })
      );
    } catch (_) {
      /* ignore */
    }
  }

  function escape(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderRepoCard(repo) {
    const lang = repo.language ? escape(repo.language) : "";
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const desc = repo.description
      ? escape(repo.description)
      : "No description provided.";

    return `
      <article class="project-card" role="listitem">
        <header class="project-card__head">
          <h3 class="project-card__title">
            <a href="${escape(repo.html_url)}" target="_blank" rel="noopener noreferrer">
              ${escape(repo.name)}
            </a>
          </h3>
          ${lang ? `<span class="project-card__lang">${lang}</span>` : ""}
        </header>
        <p class="project-card__desc">${desc}</p>
        <footer class="project-card__meta">
          <span class="project-card__stat" title="Stars">
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path fill="currentColor" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
            </svg>
            ${stars}
          </span>
          <span class="project-card__stat" title="Forks">
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path fill="currentColor" d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-3 8.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0z"/>
            </svg>
            ${forks}
          </span>
          ${
            repo.homepage
              ? `<a class="project-card__live" href="${escape(repo.homepage)}" target="_blank" rel="noopener noreferrer">Live ↗</a>`
              : ""
          }
        </footer>
      </article>
    `;
  }

  function showError() {
    grid.innerHTML = "";
    grid.setAttribute("aria-busy", "false");
    if (errorEl) errorEl.hidden = false;
  }

  function render(repos) {
    if (!repos || repos.length === 0) {
      showError();
      return;
    }
    grid.innerHTML = repos.map(renderRepoCard).join("");
    grid.setAttribute("aria-busy", "false");
    if (errorEl) errorEl.hidden = true;
  }

  async function fetchRepos() {
    const cached = readCache();
    if (cached) {
      render(cached);
      return;
    }

    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const all = await res.json();
      const top = all
        .filter((r) => !r.fork && !r.archived)
        .sort(
          (a, b) =>
            (b.stargazers_count || 0) - (a.stargazers_count || 0) ||
            new Date(b.pushed_at) - new Date(a.pushed_at)
        )
        .slice(0, limit);
      writeCache(top);
      render(top);
    } catch (err) {
      console.warn("GitHub repos fetch failed:", err);
      showError();
    }
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchRepos();
            obs.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(section);
  } else {
    fetchRepos();
  }
})();
