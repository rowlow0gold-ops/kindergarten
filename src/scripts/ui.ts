function initScrollReveal() {
  const targets = document.querySelectorAll<HTMLElement>(".reveal, [data-reveal-children]");
  if (!targets.length || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );
  targets.forEach((el) => io.observe(el));
}

function initHeaderScrollState() {
  const header = document.querySelector<HTMLElement>(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileMenu() {
  const toggle = document.querySelector<HTMLButtonElement>("[data-mobile-toggle]");
  const panel = document.querySelector<HTMLElement>("[data-mobile-panel]");
  if (!toggle || !panel) return;
  const close = () => { panel.classList.add("hidden"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("hidden");
    toggle.setAttribute("aria-expanded", String(!open));
  });
  panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

function initCountUp() {
  const targets = document.querySelectorAll<HTMLElement>("[data-count-up]");
  if (!targets.length || !("IntersectionObserver" in window)) {
    targets.forEach((el) => (el.textContent = el.dataset.countUp || "0"));
    return;
  }
  const animate = (el: HTMLElement, target: number) => {
    const duration = 1600;
    const start = performance.now();
    const fmt = (n: number) => Math.floor(n).toLocaleString("ko-KR");
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          animate(el, Number(el.dataset.countUp || "0"));
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.4 },
  );
  targets.forEach((el) => { el.textContent = "0"; io.observe(el); });
}

function initRotator() {
  document.querySelectorAll<HTMLElement>("[data-rotate]").forEach((el) => {
    let words: string[] = [];
    try { words = JSON.parse(el.dataset.rotate || "[]"); } catch { return; }
    if (words.length < 2) return;
    let i = 0;
    el.textContent = words[0];
    setInterval(() => {
      i = (i + 1) % words.length;
      el.style.opacity = "0";
      setTimeout(() => { el.textContent = words[i]; el.style.opacity = "1"; }, 300);
    }, 2400);
  });
}

function initTabs() {
  document.querySelectorAll<HTMLElement>("[data-tabs]").forEach((root) => {
    const tabs = Array.from(root.querySelectorAll<HTMLElement>("[data-tab]"));
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-panel]"));
    if (!tabs.length) return;
    const activate = (key: string) => {
      tabs.forEach((b) => { const on = b.dataset.tab === key; b.classList.toggle("is-active", on); b.setAttribute("aria-selected", String(on)); });
      panels.forEach((pn) => pn.classList.toggle("hidden", pn.dataset.panel !== key));
      try { history.replaceState(null, "", "#" + key); } catch {}
    };
    tabs.forEach((b) => b.addEventListener("click", () => { if (b.dataset.tab) { activate(b.dataset.tab); window.scrollTo({ top: (root.offsetTop - 80), behavior: "smooth" }); } }));
    const hash = location.hash.replace("#", "");
    const first = tabs[0].dataset.tab as string;
    activate(tabs.some((b) => b.dataset.tab === hash) ? hash : first);
  });
}

function boot() {
  initScrollReveal();
  initHeaderScrollState();
  initMobileMenu();
  initCountUp();
  initRotator();
  initTabs();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
