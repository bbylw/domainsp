/* WebNav Hub — shared behaviour & data rendering for index.html and domains.html */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- prevent dead-link jump in footer placeholder links ---------- */
  document.querySelectorAll('footer nav a[href="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
    });
  });

  /* ---------- build semantic card element (<a class="link-card">) ---------- */
  function createCardElement(item) {
    var anchor = document.createElement("a");
    anchor.className = "link-card";
    anchor.href = item.url;
    if (!item.internal) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }

    var icon = document.createElement("i");
    icon.className = item.icon;
    icon.setAttribute("aria-hidden", "true");

    var heading = document.createElement("h3");
    heading.textContent = item.title;

    anchor.appendChild(icon);
    anchor.appendChild(heading);
    return anchor;
  }

  /* ---------- render page from links.json ---------- */
  var mainEl = document.getElementById("app-main");
  var pageType = mainEl ? mainEl.getAttribute("data-page") : "";

  fetch("links.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load links.json: " + res.status);
      return res.json();
    })
    .then(function (data) {
      if (pageType === "home" && mainEl && Array.isArray(data.categories)) {
        var fragment = document.createDocumentFragment();
        data.categories.forEach(function (cat) {
          var section = document.createElement("section");
          section.id = cat.id;

          var h2 = document.createElement("h2");
          h2.className = "category-title";
          h2.textContent = cat.title;
          section.appendChild(h2);

          var grid = document.createElement("div");
          grid.className = "link-grid";
          cat.links.forEach(function (item) {
            grid.appendChild(createCardElement(item));
          });

          section.appendChild(grid);
          fragment.appendChild(section);
        });
        mainEl.innerHTML = "";
        mainEl.appendChild(fragment);
        initTopNav();
      } else if (pageType === "domains" && Array.isArray(data.domains)) {
        var domainsGrid = document.getElementById("domains-grid");
        if (domainsGrid) {
          var dFragment = document.createDocumentFragment();
          data.domains.forEach(function (item) {
            dFragment.appendChild(createCardElement(item));
          });
          domainsGrid.innerHTML = "";
          domainsGrid.appendChild(dFragment);
        }
      }
    })
    .catch(function (err) {
      console.error(err);
    });

  /* ---------- in-page nav & ScrollSpy (index.html only) ---------- */
  function initTopNav() {
    var navLinks = document.querySelectorAll(".top-nav a");
    if (!navLinks.length) return;

    var isClickScrolling = false;
    var scrollTimer = null;

    function setActiveLink(hash) {
      navLinks.forEach(function (l) {
        l.classList.toggle("active", l.getAttribute("href") === hash);
      });
    }

    navLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = this.getAttribute("href") || "";
        if (href.indexOf("#") === -1) return;

        e.preventDefault();
        var targetId = href.split("#")[1];
        var targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        isClickScrolling = true;
        clearTimeout(scrollTimer);
        setActiveLink("#" + targetId);

        targetElement.scrollIntoView({ behavior: "smooth" });

        var newUrl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "#" +
          targetId;
        window.history.pushState({ path: newUrl }, "", newUrl);

        scrollTimer = setTimeout(function () {
          isClickScrolling = false;
        }, 700);
      });
    });

    /* ScrollSpy via IntersectionObserver */
    var sections = document.querySelectorAll("main section[id]");
    if ("IntersectionObserver" in window && sections.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          if (isClickScrolling) return;
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActiveLink("#" + entry.target.id);
            }
          });
        },
        {
          rootMargin: "-15% 0px -75% 0px",
          threshold: 0
        }
      );
      sections.forEach(function (sec) {
        observer.observe(sec);
      });
    }

    function handleHashChange() {
      var hash = window.location.hash;
      if (!hash) {
        if (navLinks[0]) {
          setActiveLink(navLinks[0].getAttribute("href"));
        }
        return;
      }

      var targetElement = document.getElementById(hash.substring(1));
      if (!targetElement) return;

      targetElement.scrollIntoView({ behavior: "smooth" });
      setActiveLink(hash);
    }

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
  }
});
