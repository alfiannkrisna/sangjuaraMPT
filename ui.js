/* Komponen popup bersama: dialog konfirmasi + panel notifikasi. Dipakai index.html dan mentor.html */
const UI = (() => {
  const P = {
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    al: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>',
    ok: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14l-3-3"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
  };
  const svg = (n, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.info}</svg>`;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const TONE = { brand: "bg-tagb text-brand", danger: "bg-badbg text-bad", ok: "bg-okbg text-okt", warn: "bg-warnbg text-warnt" };

  const css = document.createElement("style");
  css.textContent = "@keyframes sjpop{from{opacity:0;transform:translateY(6px) scale(.97)}to{opacity:1;transform:none}}dialog.sj[open],.sj-pop{animation:sjpop .16s ease-out}@media(prefers-reduced-motion:reduce){dialog.sj[open],.sj-pop{animation:none}}";
  document.head.appendChild(css);

  /* ---------- Dialog konfirmasi: await UI.confirm({...}) -> true / false ---------- */
  function confirm({ title, text = "", ok = "Ya", cancel = "Batal", icon = "info", tone = "brand", details = [] } = {}) {
    return new Promise(res => {
      const d = document.createElement("dialog");
      d.className = "sj rounded-2xl p-0 w-[min(420px,92vw)] bg-card text-ink shadow-2xl backdrop:bg-black/50";
      d.setAttribute("aria-labelledby", "sjT");
      d.innerHTML = `<div class="p-6 text-center">
        <div class="w-14 h-14 rounded-full grid place-items-center mx-auto mb-4 ${TONE[tone] || TONE.brand}">${svg(icon, 26)}</div>
        <h3 id="sjT" class="text-xl font-extrabold">${esc(title)}</h3>
        ${text ? `<p class="text-mute text-sm mt-2">${esc(text)}</p>` : ""}
        ${details.length ? `<dl class="text-left bg-soft rounded-xl px-4 py-3 mt-4 text-sm grid gap-1.5">${details.map(([k, v]) => `<div class="flex gap-3"><dt class="text-mute w-16 shrink-0">${esc(k)}</dt><dd class="font-semibold min-w-0">${esc(v)}</dd></div>`).join("")}</dl>` : ""}
        <div class="grid grid-cols-2 gap-3 mt-6"><button type="button" data-v="0" class="btn btn-soft">${esc(cancel)}</button><button type="button" data-v="1" class="btn ${tone === "danger" ? "!bg-[#E5484D]" : ""}">${esc(ok)}</button></div></div>`;
      let done = false;
      const fin = v => { if (done) return; done = true; d.close(); d.remove(); res(v); };
      d.addEventListener("cancel", e => { e.preventDefault(); fin(false); });            // tombol Esc
      d.addEventListener("click", e => {
        if (e.target === d) return fin(false);                                          // klik area gelap
        const b = e.target.closest("[data-v]"); if (b) fin(b.dataset.v === "1");
      });
      document.body.appendChild(d); d.showModal();
      d.querySelector('[data-v="0"]').focus();                                          // fokus awal di "Batal" agar aman
    });
  }

  /* ---------- Panel notifikasi (popover di bawah tombol lonceng) ---------- */
  let cfg = null, panel = null; const read = new Set();
  const items = () => cfg ? cfg.items() : [];
  function renderPanel() {
    const l = items(), n = l.filter(i => !read.has(i.id)).length;
    panel.innerHTML = `<div class="flex items-center gap-2 px-4 py-3 border-b border-line"><h3 class="font-extrabold">Notifikasi</h3>${n ? `<span class="tag">${n} baru</span>` : ""}<button type="button" data-all class="ml-auto text-[13px] font-bold text-brand ${n ? "" : "opacity-40 pointer-events-none"}">Tandai semua dibaca</button></div>
    <div class="max-h-[60vh] overflow-y-auto">${l.length ? l.map(i => `<button type="button" data-id="${esc(i.id)}" class="w-full text-left flex gap-3 px-4 py-3 border-b border-line last:border-0 hover:bg-soft ${read.has(i.id) ? "opacity-60" : ""}"><span class="w-9 h-9 rounded-full grid place-items-center shrink-0 ${TONE[i.tone] || TONE.brand}">${svg(i.icon, 17)}</span><span class="flex-1 min-w-0"><b class="block text-sm">${esc(i.title)}</b><span class="block text-[13px] text-mute">${esc(i.text)}</span><span class="block text-xs text-mute mt-1">${esc(i.time || "")}</span></span>${read.has(i.id) ? "" : '<i class="w-2.5 h-2.5 rounded-full bg-[#E5484D] mt-1.5 shrink-0"></i>'}</button>`).join("")
      : `<div class="text-center text-mute text-sm py-10 px-4"><div class="w-12 h-12 rounded-full bg-soft grid place-items-center mx-auto mb-3">${svg("bell", 22)}</div><b class="block text-ink">Belum ada notifikasi</b>Pengingat sesi dan deadline akan muncul di sini.</div>`}</div>`;
  }
  function closePanel() { if (!panel) return; panel.remove(); panel = null; cfg.btn.setAttribute("aria-expanded", "false"); }
  function openPanel() {
    panel = document.createElement("div");
    panel.className = "sj-pop fixed z-30 w-[min(380px,calc(100vw-16px))] bg-card text-ink border border-line rounded-2xl shadow-2xl overflow-hidden";
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Notifikasi");
    const r = cfg.btn.getBoundingClientRect();
    panel.style.top = (r.bottom + 8) + "px"; panel.style.right = Math.max(8, innerWidth - r.right - 4) + "px";
    renderPanel(); document.body.appendChild(panel); cfg.btn.setAttribute("aria-expanded", "true");
    panel.onclick = e => {
      if (e.target.closest("[data-all]")) { items().forEach(i => read.add(i.id)); refreshNotif(); return; }
      const b = e.target.closest("[data-id]"); if (!b) return;
      const it = items().find(i => String(i.id) === b.dataset.id);
      if (it) { read.add(it.id); closePanel(); refreshNotif(); if (cfg.onPick) cfg.onPick(it); }
    };
  }
  function refreshNotif() {                                   // panggil setiap data berubah
    if (!cfg) return;
    const n = items().filter(i => !read.has(i.id)).length, dot = cfg.btn.querySelector("span.absolute");
    if (dot) dot.hidden = n === 0;
    cfg.btn.setAttribute("aria-label", n ? `Notifikasi, ${n} belum dibaca` : "Notifikasi");
    if (panel) renderPanel();
  }
  function initNotif({ btn, items, onPick }) {
    cfg = { btn: document.querySelector(btn), items, onPick };
    cfg.btn.setAttribute("aria-haspopup", "dialog"); cfg.btn.setAttribute("aria-expanded", "false");
    cfg.btn.onclick = () => panel ? closePanel() : openPanel();
    document.addEventListener("click", e => { if (panel && !panel.contains(e.target) && !cfg.btn.contains(e.target)) closePanel(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });
    addEventListener("resize", closePanel); addEventListener("scroll", closePanel, { passive: true });
  }
  return { confirm, initNotif, refreshNotif };
})();