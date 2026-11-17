const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c]));
const I = {
  pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', video: '<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  ok: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14l-3-3"/>', zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', cplus: '<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>', moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>', clip: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  door: '<path d="M4 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M2 21h20M12 12h.01"/>', cam: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  up: '<path d="M16 16l-4-4-4 4M12 12v9"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>', sh: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  send: '<path d="M5 3l14 9-14 9z"/>', search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>', sl: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  tr: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
  al: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>', info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  arr: '<path d="M5 12h14M12 5l7 7-7 7"/>', chev: '<path d="M6 9l6 6 6-6"/>', chk: '<path d="M20 6L9 17l-5-5"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
};
const ic = (n, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
document.querySelectorAll("[data-ic]").forEach(el => { el.innerHTML = ic(el.dataset.ic, +el.dataset.s || 16); el.classList.add("inline-flex"); });



function toast(message) {
  const el = $("#toast"); if (!el) return;
  el.textContent = message; el.hidden = false;
  const dialog = document.querySelector("dialog[open]");
  if (dialog) {
    let status = dialog.querySelector("[data-dialog-status]");
    if (!status) {
      status = document.createElement("p"); status.dataset.dialogStatus = "";
      status.className = "cat mt-3"; status.setAttribute("role", "status"); dialog.appendChild(status);
    }
    status.textContent = message;
  }
  clearTimeout(toast.timer); toast.timer = setTimeout(() => { el.hidden = true; }, 6000);
}
function fatal(error) {
  const p = document.createElement("p"); p.className = "card text-bad"; p.setAttribute("role", "alert");
  p.textContent = error.message; document.querySelector("main").replaceChildren(p);
}
function initTabs(select, panelFor) {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((b, i) => {
    b.id = "tab-" + i; b.tabIndex = b.getAttribute("aria-selected") === "true" ? 0 : -1;
    const p = panelFor(b); b.setAttribute("aria-controls", p.id); p.setAttribute("role", "tabpanel");
    if (b.getAttribute("aria-selected") === "true") p.setAttribute("aria-labelledby", b.id);
    b.addEventListener("click", () => {
      select(b); tabs.forEach(t => { t.tabIndex = t === b ? 0 : -1; }); p.setAttribute("aria-labelledby", b.id);
    });
    b.addEventListener("keydown", e => {
      let n;
      if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") n = (i + tabs.length - 1) % tabs.length;
      if (e.key === "Home") n = 0; if (e.key === "End") n = tabs.length - 1;
      if (n !== undefined) { e.preventDefault(); tabs[n].click(); tabs[n].focus(); }
    });
  });
}
function attachment(t) {
  return t.attachment ? `<button class="btn btn-soft btn-sm mt-2" data-file="${esc(t.attachment.id)}">Unduh lampiran: ${esc(t.attachment.name)}</button>` : "";
}
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-file]");
  if (b) try { await Attachments.open(b.dataset.file); } catch (error) { toast(error.message); }
});
function initDashboard(role, render) {
  initTabs(() => {}, b => $("#p-" + b.dataset.t));
  const refresh = () => {
    if (!SJ.require(role)) return;
    try { render(); } catch (e) { fatal(e); }
  };
  Store.subscribe(refresh); addEventListener("focus", refresh);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
  setInterval(refresh, 60000);
  addEventListener("storage", e => { if (e.key === "sj-session" || e.key === null) SJ.require(role); });
}
