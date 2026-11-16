/* WebNav Hub — shared behaviour & data rendering for index.html and domains.html */

const initApp = async () => {
  /* ---------- footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- prevent dead-link jump in footer placeholder links ---------- */
  document.querySelectorAll('footer nav a[href="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });

  /* ---------- helpers ---------- */
  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toSafeHref = (rawUrl) => {
    try {
      const parsed = new URL(rawUrl, window.location.href);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        return parsed.href;
      }
    } catch {
      // Invalid URL falls through to "#"
    }
    return "#";
  };

  const scrollIntoViewAsync = (element, options) => {
    const result = element.scrollIntoView(options);
    if (result instanceof Promise) {
      return result;
    }

    return new Promise((resolve) => {
      let timeoutId;
      const finish = () => {
        clearTimeout(timeoutId);
        window.removeEventListener("scrollend", finish);
        window.removeEventListener("scroll", onScroll);
        resolve();
      };

      const onScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(finish, 100);
      };

      window.addEventListener("scrollend", finish, { once: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      timeoutId = setTimeout(finish, 100);
    });
  };

  /* ---------- build semantic card element (<a class="link-card">) ---------- */
  const createCardElement = (item) => {
    const anchor = document.createElement("a");
    anchor.className = "link-card";
    anchor.href = toSafeHref(item.url);
    if (!item.internal) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }

    const icon = document.createElement("i");
    icon.className = item.icon;
    icon.setAttribute("aria-hidden", "true");

    const heading = document.createElement("h3");
    heading.textContent = item.title;

    anchor.append(icon, heading);
    return anchor;
  };

  /* ---------- in-page nav & ScrollSpy (index.html only) ---------- */
  const initTopNav = () => {
    const navLinks = Array.from(document.querySelectorAll(".top-nav a"));
    if (!navLinks.length) return;

    const supportsScrollTargetGroup =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("scroll-target-group", "auto");

    let isClickScrolling = false;
    let currentScrollId = 0;

    const setActiveLink = (hash) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === hash;
        if (!supportsScrollTargetGroup) {
          link.classList.toggle("active", isActive);
        }
        link.setAttribute("aria-current", isActive ? "true" : "false");
      });
    };

    const syncNativeScrollSpy = () => {
      const currentLink = document.querySelector(".top-nav a:target-current");
      if (currentLink) {
        navLinks.forEach((link) => {
          link.setAttribute("aria-current", link === currentLink ? "true" : "false");
        });
      }
    };

    const scrollToSection = async (targetElement, { moveFocus = true } = {}) => {
      const scrollId = ++currentScrollId;
      isClickScrolling = true;
      const behavior = prefersReducedMotion() ? "auto" : "smooth";

      await scrollIntoViewAsync(targetElement, { behavior });
      if (scrollId !== currentScrollId) return;

      isClickScrolling = false;
      if (moveFocus) {
        targetElement.focus({ preventScroll: true });
      }
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href") || "";
        const hashIndex = href.indexOf("#");
        if (hashIndex === -1) return;

        e.preventDefault();
        const targetId = href.slice(hashIndex + 1);
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const targetHash = `#${targetId}`;
        setActiveLink(targetHash);
        window.history.pushState(null, "", targetHash);
        scrollToSection(targetElement, { moveFocus: true });
      });
    });

    if (supportsScrollTargetGroup) {
      let ariaSyncTimer;
      const syncAfterRender = () => requestAnimationFrame(syncNativeScrollSpy);
      const scheduleAriaSync = () => {
        clearTimeout(ariaSyncTimer);
        ariaSyncTimer = setTimeout(syncAfterRender, 150);
      };

      syncAfterRender();
      document.addEventListener(
        "scrollend",
        () => {
          clearTimeout(ariaSyncTimer);
          syncAfterRender();
        },
        { passive: true }
      );
      /* Instant jumps (e.g., Home/End keys or reduced-motion) may skip scrollend. */
      window.addEventListener("scroll", scheduleAriaSync, { passive: true });
    } else {
      const sections = document.querySelectorAll("main section[id]");
      if ("IntersectionObserver" in window && sections.length) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (isClickScrolling) return;
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveLink(`#${entry.target.id}`);
              }
            });
          },
          {
            rootMargin: "-15% 0px -75% 0px",
            threshold: 0,
          }
        );
        sections.forEach((sec) => observer.observe(sec));
      }
    }

    const handleHashChange = ({ isInitial = false } = {}) => {
      const hash = window.location.hash;
      if (!hash) {
        if (navLinks[0]) {
          setActiveLink(navLinks[0].getAttribute("href"));
        }
        return;
      }

      const targetElement = document.getElementById(hash.slice(1));
      if (!targetElement) return;

      setActiveLink(hash);
      scrollToSection(targetElement, { moveFocus: !isInitial });
    };

    window.addEventListener("hashchange", () => handleHashChange({ isInitial: false }));
    handleHashChange({ isInitial: true });
  };

  /* ---------- render page from links.json ---------- */
  const mainEl = document.getElementById("app-main");
  const pageType = mainEl ? mainEl.getAttribute("data-page") : "";

  try {
    const res = await fetch("links.json");
    if (!res.ok) throw new Error(`Failed to load links.json: ${res.status}`);
    const data = await res.json();

    if (pageType === "home" && mainEl && Array.isArray(data.categories)) {
      const fragment = document.createDocumentFragment();
      data.categories.forEach((cat) => {
        const section = document.createElement("section");
        section.id = cat.id;
        section.tabIndex = -1;

        const h2 = document.createElement("h2");
        h2.className = "category-title";
        h2.textContent = cat.title;
        section.appendChild(h2);

        const grid = document.createElement("div");
        grid.className = "link-grid";
        cat.links.forEach((item) => {
          grid.appendChild(createCardElement(item));
        });

        section.appendChild(grid);
        fragment.appendChild(section);
      });
      mainEl.replaceChildren(fragment);
      initTopNav();
    } else if (pageType === "domains" && Array.isArray(data.domains)) {
      const domainsGrid = document.getElementById("domains-grid");
      if (domainsGrid) {
        const dFragment = document.createDocumentFragment();
        data.domains.forEach((item) => {
          dFragment.appendChild(createCardElement(item));
        });
        domainsGrid.replaceChildren(dFragment);
      }
    }
  } catch (err) {
    console.error(err);
    if (mainEl) {
      const errorMsg = document.createElement("p");
      errorMsg.className = "load-error";
      errorMsg.setAttribute("role", "alert");
      errorMsg.textContent = "导航数据加载失败，请稍后刷新重试。";
      mainEl.replaceChildren(errorMsg);
    }
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
  initApp();
}
