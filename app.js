(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on link click
    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => closeMenu());
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      const clickedInside = menu.contains(target) || toggle.contains(target);
      if (!clickedInside) closeMenu();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Quote form: lightweight handling (mailto fallback)
  const form = document.getElementById("quoteForm");
  const toast = document.getElementById("formToast");

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const email = String(data.get("email") || "").trim();
      const service = String(data.get("service") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !phone || !service || !message) {
        showToast("Please fill in the required fields.");
        return;
      }

      // Mailto (works on most devices; for a real backend you’d connect a form endpoint)
      const subject = encodeURIComponent(`Comfort-Tek Quote Request — ${service}`);
      const body = encodeURIComponent(
        `Name: ${name}\nPhone: ${phone}\nEmail: ${email || "N/A"}\nService: ${service}\n\nMessage:\n${message}\n`
      );

      const mailto = `mailto:comforttek2016@gmail.com?subject=${subject}&body=${body}`;

      showToast("Opening your email app… If it doesn’t open, copy your message and email us directly.");
      window.location.href = mailto;

      // Reset after a moment
      setTimeout(() => {
        form.reset();
      }, 600);
    });
  }
})();