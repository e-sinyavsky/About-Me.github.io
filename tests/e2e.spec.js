import { test, expect } from "@playwright/test";

test.describe("portfolio basics", () => {
  test("loads with English by default and shows hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Egor Sinyavsky/);

    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toHaveAttribute("href", "#about");

    // Wait for typing to finish or fall back text to be visible
    await expect(page.locator("#auto_typing_text")).toBeVisible();
  });

  test("logo navigates to top of page (no 404)", async ({ page }) => {
    await page.goto("/#projects");
    await page.locator(".header__logo-link").click();
    await expect(page).toHaveURL(/#about$/);
  });

  test("skip link target exists", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#about")).toBeVisible();
  });
});

test.describe("theme toggle", () => {
  test("toggles between light and dark, persists across reloads", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
    });
    await page.reload();

    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.locator("#themeToggle").click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");
  });

  test("toggle exposes aria-pressed state", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload();
    const toggle = page.locator("#themeToggle");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("language switcher", () => {
  test("switches header nav text to Russian and back", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("language", "en"));
    await page.reload();

    const aboutLink = page.locator('[i18n="header.nav.about"]');
    await expect(aboutLink).toHaveText("About");

    await page.locator(".language-selector__toggle").click();
    await page.locator('.language-selector__option[data-lang="ru"]').click();

    await expect(aboutLink).toHaveText("Обо мне");
    await expect(page.locator("html")).toHaveAttribute("lang", "ru");

    await page.locator(".language-selector__toggle").click();
    await page.locator('.language-selector__option[data-lang="en"]').click();
    await expect(aboutLink).toHaveText("About");
  });

  test("Projects section translates to Russian", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("language", "en"));
    await page.reload();

    await page.locator(".language-selector__toggle").click();
    await page.locator('.language-selector__option[data-lang="ru"]').click();

    await expect(page.locator("#projects-heading")).toContainText("Избранные");
    await expect(page.locator(".projects__subtitle")).toContainText(
      "репозитор"
    );
  });
});

test.describe("mobile burger menu", () => {
  test("opens and closes the menu at mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto("/");
    const burger = page.locator(".header__burger");
    const menu = page.locator(".header__menu");
    await expect(burger).toHaveAttribute("aria-expanded", "false");

    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toHaveClass(/open/);

    await page.keyboard.press("Escape");
    await expect(burger).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("contact form", () => {
  test("blocks submit when fields are empty", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#contact-form");
    await form.scrollIntoViewIfNeeded();
    await page.locator(".contact-form__submit").click();
    // Native validity blocks submit; status stays empty
    await expect(page.locator("#contact-form-status")).toHaveText("");
  });
});

test.describe("news page", () => {
  test("loads, renders posts, expands on click", async ({ page }) => {
    await page.goto("/news.html");
    await expect(page).toHaveTitle(/Dev Journal/);

    const cards = page.locator(".news-card:not(.news-card--skeleton)");
    await expect(cards.first()).toBeVisible({ timeout: 5000 });

    const firstCard = cards.first();
    const toggle = firstCard.locator(".news-card__toggle");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(firstCard).toHaveClass(/is-open/);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  test("translates posts on language switch", async ({ page }) => {
    await page.goto("/news.html");
    await page.evaluate(() => localStorage.setItem("language", "en"));
    await page.reload();

    const firstTitle = page.locator(".news-card__title").first();
    await expect(firstTitle).toBeVisible();
    const enText = await firstTitle.textContent();

    await page.locator(".language-selector__toggle").click();
    await page.locator('.language-selector__option[data-lang="ru"]').click();
    await page.waitForTimeout(150);

    const ruText = await firstTitle.textContent();
    expect(ruText).not.toBe(enText);
    expect(ruText.length).toBeGreaterThan(0);
  });

  test("hash deep-link opens the matching post", async ({ page }) => {
    await page.goto("/news.html#post-welcome");
    await page.waitForSelector("#post-welcome");
    await expect(page.locator("#post-welcome")).toHaveClass(/is-open/);
  });

  test("nav link from home page goes to news", async ({ page }) => {
    await page.goto("/");
    const burger = page.locator(".header__burger");
    if (await burger.isVisible()) {
      await burger.click();
    }
    await page.locator('a[href="news.html"]').first().click();
    await expect(page).toHaveURL(/news\.html$/);
  });

  test("nav link from news to index.html#skills lands on skills section", async ({
    page,
  }) => {
    await page.goto("/news.html");
    const burger = page.locator(".header__burger");
    if (await burger.isVisible()) {
      await burger.click();
    }
    await page.locator('a[href="index.html#skills"]').first().click();
    await expect(page).toHaveURL(/index\.html#skills$/);

    // Allow on-load hash scroll to settle
    await page.waitForLoadState("load");
    await page.waitForTimeout(400);

    const skillsTop = await page
      .locator("#skills")
      .evaluate((el) => el.getBoundingClientRect().top);
    const headerH = await page
      .locator(".header")
      .evaluate((el) => el.offsetHeight);

    // Skills should land near the top of the viewport, below the header.
    // Tolerance accounts for fluid scroll-margin-top (clamp 80-120px) vs the
    // smaller mobile header.
    expect(skillsTop).toBeGreaterThan(0);
    expect(skillsTop).toBeLessThan(headerH + 80);
  });

  test("Education link visible in news.html nav", async ({ page }) => {
    await page.goto("/news.html");
    const burger = page.locator(".header__burger");
    if (await burger.isVisible()) {
      await burger.click();
    }
    const edu = page.locator('a[href="index.html#education"]');
    await expect(edu).toBeVisible();
  });
});

test.describe("metadata", () => {
  test("OG and Twitter card point to og-cover.jpg", async ({ page }) => {
    await page.goto("/");
    const og = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(og).toMatch(/og-cover\.jpg$/);

    const tw = await page
      .locator('meta[name="twitter:image"]')
      .getAttribute("content");
    expect(tw).toMatch(/og-cover\.jpg$/);
  });

  test("manifest, robots.txt, sitemap.xml are reachable", async ({ page }) => {
    await page.goto("/");
    for (const path of ["/manifest.webmanifest", "/robots.txt", "/sitemap.xml"]) {
      const res = await page.request.get(path);
      expect(res.status(), `${path} should be 200`).toBe(200);
    }
  });
});
