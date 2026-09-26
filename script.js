/*
  Ishaan Fartyal Portfolio
  Shared script for the homepage and individual project pages.
*/

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------
  // 1. Smooth scrolling for same-page anchor links
  // ------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  // ------------------------------------------------------------
  // 2. Highlight the active homepage navigation section
  // ------------------------------------------------------------
  const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
  const sections = [...document.querySelectorAll("main section[id]")];

  if (navLinks.length && sections.length) {
    const setActiveLink = (sectionId) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("active", isActive);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length) {
          setActiveLink(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ------------------------------------------------------------
  // 3. Project-page back button
  //
  // Add data-back to any link/button:
  // <a href="../index.html#work" data-back>← Back to selected work</a>
  //
  // If the visitor came from your portfolio, it returns them there.
  // Otherwise it falls back to the href you supplied.
  // ------------------------------------------------------------
  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const fallback = button.getAttribute("href") || "../index.html#work";

      if (document.referrer && document.referrer.includes(window.location.host)) {
        event.preventDefault();
        window.history.back();
      } else {
        button.setAttribute("href", fallback);
      }
    });
  });

  // ------------------------------------------------------------
  // 4. Automatically display the current year
  //
  // Example:
  // <span data-current-year></span>
  // ------------------------------------------------------------
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // ------------------------------------------------------------
  // 5. Add safe attributes to external links
  // ------------------------------------------------------------
  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    const url = new URL(link.href, window.location.href);

    if (url.origin !== window.location.origin) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });
});
