/* Dimuat di head agar tema diterapkan sebelum halaman tampil. */
(() => {
  const system = matchMedia("(prefers-color-scheme: dark)");
  function apply() {
    let theme;
    try { theme = localStorage.getItem("sj-theme"); } catch {}
    document.documentElement.dataset.theme = ["light", "dark"].includes(theme) ? theme : system.matches ? "dark" : "light";
  }
  apply(); system.addEventListener("change", apply);
  addEventListener("storage", e => { if (e.key === "sj-theme" || e.key === null) apply(); });
  document.addEventListener("DOMContentLoaded", () => {
    const b = document.querySelector("#theme");
    if (b) b.onclick = () => {
      const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("sj-theme", t); } catch {}
      document.documentElement.dataset.theme = t;
    };
  });
})();
