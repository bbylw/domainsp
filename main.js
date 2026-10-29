/* WebNav Hub — shared behaviour for index.html and domains.html */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- a11y: label every card anchor with its heading ---------- */
  document.querySelectorAll(".link-card").forEach(function (card) {
    var link = card.querySelector("a");
    var heading = card.querySelector("h3");
    if (link && heading) {
      link.setAttribute("aria-label", heading.textContent.trim());
    }
  });

  /* ---------- in-page nav (index.html only) ---------- */
  var navLinks = document.querySelectorAll("nav a");
  if (!navLinks.length) return;

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href") || "";
      // links to other pages navigate normally
      if (href.indexOf("#") === -1) return;

      e.preventDefault();
      navLinks.forEach(function (l) {
        l.classList.remove("active");
      });
      this.classList.add("active");

      var targetId = href.split("#")[1];
      var targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      targetElement.scrollIntoView({ behavior: "smooth" });

      var newUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "#" +
        targetId;
      window.history.pushState({ path: newUrl }, "", newUrl);
    });
  });

  function handleHashChange() {
    var hash = window.location.hash;
    if (!hash) return;

    var targetElement = document.getElementById(hash.substring(1));
    if (!targetElement) return;

    targetElement.scrollIntoView({ behavior: "smooth" });

    var activeLink = document.querySelector('nav a[href="' + hash + '"]');
    if (activeLink) {
      navLinks.forEach(function (l) {
        l.classList.remove("active");
      });
      activeLink.classList.add("active");
    }
  }

  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();
});
