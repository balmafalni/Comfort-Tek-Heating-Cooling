(() => {
  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  const closeNav = () => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!t) return;
      if (!navMenu.contains(t) && !navToggle.contains(t)) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // Tabs
  const tabButtons = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".panel"));

  const setActiveTab = (btn) => {
    tabButtons.forEach(b => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", String(active));
    });

    const id = btn.getAttribute("aria-controls");
    panels.forEach(p => p.classList.toggle("is-active", p.id === id));
  };

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => setActiveTab(btn));
  });

  // Promo carousel (robust: full-width on mobile, card-width on desktop)
  const track = document.getElementById("promoTrack");
  const viewport = document.getElementById("promoViewport");
  const prev = document.getElementById("promoPrev");
  const next = document.getElementById("promoNext");
  let index = 0;

  const getSlideWidth = () => {
    if (!track || !viewport) return 0;
    const cards = Array.from(track.children);
    if (!cards.length) return 0;

    // Mobile = full width per slide
    if (window.matchMedia("(max-width: 980px)").matches) {
      return viewport.getBoundingClientRect().width;
    }

    // Desktop = card width + gap
    const cardW = cards[0].getBoundingClientRect().width;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "18") || 18;
    return cardW + gap;
  };

  const applySlide = () => {
    if (!track) return;
    const step = getSlideWidth();
    track.style.transform = `translateX(${-step * index}px)`;
  };

  const slide = (dir) => {
    if (!track) return;
    const cards = Array.from(track.children);
    if (!cards.length) return;

    index = (index + dir + cards.length) % cards.length;
    applySlide();
  };

  prev?.addEventListener("click", () => slide(-1));
  next?.addEventListener("click", () => slide(1));
  window.addEventListener("resize", applySlide);

  // Modal (callback)
  const modal = document.getElementById("callbackModal");
  const open1 = document.getElementById("openCallback");
  const open2 = document.getElementById("openCallback2");

  const openModal = () => {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => modal.querySelector("input")?.focus(), 0);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  open1?.addEventListener("click", openModal);
  open2?.addEventListener("click", openModal);

  modal?.addEventListener("click", (e) => {
    const t = e.target;
    if (!t) return;
    if (t.hasAttribute("data-close")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Forms -> mailto (simple, no backend)
  const quoteForm = document.getElementById("quoteForm");
  const quoteToast = document.getElementById("quoteToast");

  const cbForm = document.getElementById("callbackForm");
  const cbToast = document.getElementById("cbToast");

  const toast = (el, msg) => { if (el) el.textContent = msg; };

  const openMail = ({ subject, body }) => {
    const s = encodeURIComponent(subject);
    const b = encodeURIComponent(body);
    window.location.href = `mailto:comforttek2016@gmail.com?subject=${s}&body=${b}`;
  };

  quoteForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(quoteForm);

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const service = String(data.get("service") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !phone || !service || !message) {
      toast(quoteToast, "Please fill all required fields.");
      return;
    }

    toast(quoteToast, "Opening your email app…");
    openMail({
      subject: `Comfort-Tek Quote Request — ${service}`,
      body:
`Name: ${name}
Phone: ${phone}
Service: ${service}

Message:
${message}
`
    });

    setTimeout(() => quoteForm.reset(), 600);
  });

  cbForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(cbForm);

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const time = String(data.get("time") || "").trim();

    if (!name || !phone || !time) {
      toast(cbToast, "Please fill all required fields.");
      return;
    }

    toast(cbToast, "Opening your email app…");
    openMail({
      subject: `Comfort-Tek Callback Request`,
      body:
`Name: ${name}
Phone: ${phone}
Best time to call: ${time}
`
    });

    setTimeout(() => {
      cbForm.reset();
      closeModal();
    }, 700);
  });
})();