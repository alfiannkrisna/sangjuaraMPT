/* Panel Mentor – Sang Juara School | data contoh, tanpa backend */
const S = SJ.require("mentor") || { name: "Mentor", ini: "M" };
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Ikon ---------- */
const I = {
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', video: '<path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  ok: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14l-3-3"/>', moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>', clip: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>', al: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>', zap: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'
};
const ic = (n, s = 16) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
document.querySelectorAll("[data-ic]").forEach(el => { el.innerHTML = ic(el.dataset.ic, +el.dataset.s || 16); el.classList.add("inline-flex"); });

/* ---------- Tanggal (lokal, aman untuk WIB) ---------- */
const DAY = 864e5, now = new Date(), today = new Date(now); today.setHours(0, 0, 0, 0);
const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const add = n => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };
const dt = s => new Date(s + "T00:00");
const fmt = (s, o) => dt(s).toLocaleDateString("id-ID", o || { day: "numeric", month: "short" });
const dd = s => Math.round((dt(s) - today) / DAY);
const dayLbl = s => dd(s) === 0 ? "Hari ini" : dd(s) === 1 ? "Besok" : fmt(s, { weekday: "long", day: "numeric", month: "short" });
const when = t => { const [h, m] = t.slot.t.split(":"), s = dt(t.slot.d); s.setHours(+h, +m); return s; };
const ini = n => n.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

/* ---------- Data contoh ---------- */
const TIMES = ["15:30", "16:30", "19:00", "20:15"];
const KES = { Mudah: 1, Sedang: 2, Sulit: 3 };
let tasks = [
  { id: 1, siswa: "Rina Aulia", kelas: "XII IPA 2", judul: "Turunan Parsial Implisit No. 4b", mapel: "Matematika Minat", kes: "Sulit", dl: add(1), kendala: "Paham konsep dasarnya tapi macet di perhitungan rantai kedua.", st: "baru" },
  { id: 2, siswa: "Bima Prasetyo", kelas: "XI IPA 1", judul: "Siklus Carnot & Entropi Reservoir", mapel: "Fisika", kes: "Sulit", dl: add(-1), kendala: "Bingung membaca grafik P-V pada proses isotermal.", st: "baru" },
  { id: 3, siswa: "Salsa Nabila", kelas: "X IPA 3", judul: "Stoikiometri & Pereaksi Pembatas", mapel: "Kimia", kes: "Sedang", dl: add(4), kendala: "Lupa rumus mol dari massa.", st: "jadwal", slot: { d: now.getHours() < 14 ? add(0) : add(1), t: "16:30" } },
  { id: 4, siswa: "Dika Pratama", kelas: "XII IPS 1", judul: "Barisan Aritmetika", mapel: "Matematika Wajib", kes: "Mudah", dl: add(6), kendala: "Tidak tahu mulai dari mana.", st: "baru" },
  { id: 5, siswa: "Putri Maharani", kelas: "XI IPA 2", judul: "Sintesis Protein", mapel: "Biologi", kes: "Sedang", dl: add(3), kendala: "Urutan transkripsi dan translasi masih tertukar.", st: "baru" },
  { id: 6, siswa: "Rafi Alfarizi", kelas: "XII IPA 1", judul: "Gelombang Stasioner", mapel: "Fisika", kes: "Sedang", dl: add(2), kendala: "Hasil berbeda dengan kunci jawaban.", st: "jadwal", slot: { d: add(1), t: "19:00" } },
  { id: 7, siswa: "Nadia Rahma", kelas: "X IPA 1", judul: "Persamaan Kuadrat No. 7", mapel: "Matematika Wajib", kes: "Mudah", dl: add(-6), kendala: "Rumus lupa.", st: "selesai", slot: { d: add(-7), t: "15:30" }, cat: "Dibahas metode pemfaktoran dan rumus abc, lalu latihan 3 soal serupa." },
  { id: 8, siswa: "Fikri Ramadhan", kelas: "XI IPS 2", judul: "Reaksi Redoks", mapel: "Kimia", kes: "Sedang", dl: add(-2), kendala: "Bingung menentukan bilangan oksidasi.", st: "selesai", slot: { d: add(-3), t: "16:30" }, cat: "Dibahas aturan bilangan oksidasi dan cara menyetarakan reaksi dengan metode PBO." }
];
let avail = { "15:30": true, "16:30": true, "19:00": true, "20:15": true };
let f = { q: "", mapel: "Semua", kes: "Semua", st: "aktif", so: "p" }, editing = null;

/* ---------- Prioritas = urgensi deadline x2 + kesulitan x2 (skor 4 - 16) ---------- */
const urg = t => { const d = dd(t.dl); return d <= 0 ? 5 : d <= 1 ? 4 : d <= 3 ? 3 : d <= 7 ? 2 : 1; };
const score = t => urg(t) * 2 + KES[t.kes] * 2;
const level = t => score(t) >= 12 ? "Tinggi" : score(t) >= 8 ? "Sedang" : "Rendah";
const kcls = k => k === "Sulit" ? "tag-r" : k === "Sedang" ? "tag-y" : "!bg-okbg !text-okt";

/* ---------- Umum ---------- */
function toast(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 2600); }
function show(t) {
  document.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b.dataset.t === t));
  ["antrean", "jadwal", "riwayat"].forEach(x => $("#p-" + x).hidden = x !== t);
}
document.querySelectorAll(".tab").forEach(b => b.onclick = () => show(b.dataset.t));
$("#homeBtn").onclick = e => { e.preventDefault(); show("antrean"); window.scrollTo({ top: 0, behavior: "smooth" }); };
$("#logout").onclick = () => { if (confirm("Keluar dari akun mentor?")) SJ.logout(); };
$("#bell").onclick = () => toast("Belum ada notifikasi baru.");
$("#theme").onclick = () => {
  const r = document.documentElement;
  r.dataset.theme = r.dataset.theme === "dark" ? "light" : "dark";
};
$("#me").textContent = S.ini;

/* ---------- Hero ---------- */
function hero() {
  const baru = tasks.filter(t => t.st === "baru"), urgent = baru.filter(t => level(t) === "Tinggi").length;
  const hari = tasks.filter(t => t.st === "jadwal" && t.slot.d === add(0)).sort((a, b) => when(a) - when(b));
  const tuntas = tasks.filter(t => t.st === "selesai" && dd(t.slot.d) >= -6).length;
  $("#hello").textContent = "Halo, " + S.name + "!";
  $("#helloSub").textContent = baru.length ? `Ada ${baru.length} tugas menunggu. Yang paling mendesak sudah diurutkan di bagian atas antrean.` : "Semua tugas sudah ditangani. Kerja bagus!";
  const box = (i, big, sm, r) => `<div class="stat"><span class="w-[42px] h-[42px] rounded-xl bg-white/15 grid place-items-center shrink-0">${ic(i, 20)}</span><div class="flex-1 min-w-0"><b class="block text-[22px] font-extrabold">${big}</b><span class="text-[13px] opacity-90">${sm}</span></div><em class="not-italic text-[11.5px] font-bold opacity-80">${r}</em></div>`;
  $("#stats").innerHTML =
    box("clip", baru.length + " Perlu ditangani", "Menunggu penjadwalan sesi", urgent ? urgent + " MENDESAK" : "AMAN") +
    box("video", hari.length + " Sesi hari ini", hari.length ? "Sesi berikutnya pukul " + hari[0].slot.t.replace(":", ".") + " WIB" : "Tidak ada sesi hari ini", "HARI INI") +
    box("ok", tuntas + " Tuntas", "Tugas selesai dalam 7 hari terakhir", "PEKAN INI");
}

/* ---------- Antrean tugas ---------- */
function dlPill(t) {
  const d = dd(t.dl);
  if (d < 0) return `<span class="tag tag-r">${ic("al", 12)} Lewat ${-d} hari</span>`;
  return `<span class="tag ${d <= 3 ? "tag-y" : ""}">${ic("clock", 12)} ${d === 0 ? "Deadline hari ini" : d === 1 ? "Deadline besok" : d + " hari lagi"}</span>`;
}
function card(t) {
  const lv = level(t), c = { Tinggi: "#E5484D", Sedang: "#FFC21A", Rendah: "#16A34A" }[lv];
  const lc = lv === "Tinggi" ? "tag-r" : lv === "Sedang" ? "tag-y" : "!bg-okbg !text-okt";
  return `<article class="card !p-5 !mb-3.5" style="border-left:5px solid ${c}">
    <div class="flex flex-wrap items-center gap-2 mb-2"><span class="tag">${esc(t.mapel)}</span><span class="tag ${kcls(t.kes)}">Kesulitan: ${t.kes}</span>${dlPill(t)}<span class="tag ${lc} ml-auto">Prioritas ${lv}</span></div>
    <h3 class="text-[17px] font-extrabold">${esc(t.judul)}</h3>
    <div class="flex flex-wrap items-center gap-2 text-sm text-mute my-1.5"><span class="av !w-7 !h-7 !text-[11px] bg-brand">${ini(t.siswa)}</span><b class="text-ink">${esc(t.siswa)}</b> · ${esc(t.kelas)}${t.st === "jadwal" ? `<span class="tag">${ic("video", 12)} ${dayLbl(t.slot.d)}, ${t.slot.t.replace(":", ".")} WIB</span>` : ""}</div>
    ${t.kendala ? `<div class="cat"><b>Kendala siswa:</b> ${esc(t.kendala)}</div>` : ""}
    <div class="flex flex-wrap gap-2"><button class="btn btn-sm" data-a="open" data-id="${t.id}">${t.st === "baru" ? "Jadwalkan / kelola" : "Kelola tugas"}</button><button class="btn btn-wa btn-sm" data-a="wa" data-id="${t.id}">${ic("chat", 13)} Chat siswa</button></div>
  </article>`;
}
function list() {
  const act = tasks.filter(t => t.st !== "selesai"), q = f.q.trim().toLowerCase();
  const maps = ["Semua", ...new Set(act.map(t => t.mapel))];
  if (!maps.includes(f.mapel)) f.mapel = "Semua";
  $("#fm").innerHTML = maps.map(m => `<option ${m === f.mapel ? "selected" : ""}>${esc(m)}</option>`).join("");
  $("#fs").innerHTML = [["aktif", "Semua aktif"], ["baru", "Baru"], ["jadwal", "Dijadwalkan"]].map(([k, l]) => {
    const n = act.filter(t => k === "aktif" || t.st === k).length;
    return `<button class="chip" aria-pressed="${f.st === k}" data-s="${k}">${l} (${n})</button>`;
  }).join("");
  let l = act.filter(t => (f.st === "aktif" || t.st === f.st) && (f.mapel === "Semua" || t.mapel === f.mapel) && (f.kes === "Semua" || t.kes === f.kes) && (!q || (t.judul + t.siswa).toLowerCase().includes(q)));
  const sorters = { p: (a, b) => score(b) - score(a) || a.dl.localeCompare(b.dl), d: (a, b) => a.dl.localeCompare(b.dl), k: (a, b) => KES[b.kes] - KES[a.kes] || a.dl.localeCompare(b.dl) };
  l.sort(sorters[f.so]);
  $("#cnt").textContent = l.length + " tugas";
  $("#list").innerHTML = l.length ? l.map(card).join("") : `<div class="card text-center text-mute">Tidak ada tugas yang cocok dengan filter.</div>`;
}
$("#q").oninput = e => { f.q = e.target.value; list(); };
$("#fm").onchange = e => { f.mapel = e.target.value; list(); };
$("#fk").onchange = e => { f.kes = e.target.value; list(); };
$("#so").onchange = e => { f.so = e.target.value; list(); };
$("#fs").onclick = e => { const b = e.target.closest("[data-s]"); if (b) { f.st = b.dataset.s; list(); } };
$("#list").onclick = e => {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const t = tasks.find(x => x.id == b.dataset.id);
  if (b.dataset.a === "open") openDlg(t);
  if (b.dataset.a === "wa") toast("Membuka WhatsApp " + t.siswa + "… (contoh tampilan)");
};

/* ---------- Dialog kelola tugas ---------- */
$("#dTm").innerHTML = TIMES.map(t => `<option value="${t}">${t.replace(":", ".")} WIB</option>`).join("");
const toggleJ = () => $("#dJ").hidden = $("#dSt").value !== "jadwal";
$("#dSt").onchange = toggleJ;
function openDlg(t) {
  editing = t;
  $("#dT").textContent = t.judul; $("#dS").textContent = t.siswa + " · " + t.kelas + " · " + t.mapel + " · Kesulitan " + t.kes;
  $("#dK").textContent = t.kendala || "Siswa tidak menuliskan kendala."; $("#dSt").value = t.st;
  $("#dD").value = t.slot ? t.slot.d : add(1); $("#dD").min = add(0); $("#dTm").value = t.slot ? t.slot.t : TIMES.find(x => avail[x]) || TIMES[0];
  $("#dN").value = t.cat || ""; toggleJ(); $("#dlg").showModal();
}
$("#dX").onclick = () => $("#dlg").close();
$("#dOk").onclick = () => {
  const t = editing, st = $("#dSt").value;
  if (st === "jadwal") {
    const d = $("#dD").value, h = $("#dTm").value;
    if (!d) return toast("Pilih tanggal sesi dulu ya.");
    if (!avail[h]) return toast("Slot " + h.replace(":", ".") + " sedang kamu nonaktifkan.");
    if (tasks.some(x => x !== t && x.st === "jadwal" && x.slot.d === d && x.slot.t === h)) return toast("Jadwal bentrok dengan sesi lain.");
    t.slot = { d, t: h };
  }
  if (st === "selesai") {
    if (!$("#dN").value.trim()) return toast("Isi catatan pembahasan sebelum menandai selesai.");
    if (!t.slot) t.slot = { d: add(0), t: TIMES[0] };
  }
  t.st = st; t.cat = $("#dN").value.trim(); $("#dlg").close(); all();
  toast(st === "jadwal" ? "Sesi dijadwalkan. Siswa akan menerima pengingat." : st === "selesai" ? "Tugas ditandai selesai dan masuk riwayat." : "Perubahan disimpan.");
};

/* ---------- Jadwal sesi + ketersediaan ---------- */
function sesi() {
  const l = tasks.filter(t => t.st === "jadwal").sort((a, b) => when(a) - when(b)), g = {};
  l.forEach(t => (g[t.slot.d] = g[t.slot.d] || []).push(t));
  $("#sesi").innerHTML = l.length ? Object.keys(g).map(d => `<div class="mb-4"><h3 class="text-sm font-extrabold text-brand mb-1">${dayLbl(d)} <span class="text-mute font-semibold">· ${g[d].length} sesi</span></h3>` +
    g[d].map(t => `<div class="row"><div class="flex items-center gap-3"><b class="w-14 text-brand">${t.slot.t.replace(":", ".")}</b><div><b>${esc(t.judul)}</b><div class="text-[13px] text-mute">${esc(t.siswa)} · ${esc(t.kelas)}</div></div></div><div class="flex gap-2"><button class="btn btn-sm" data-a="start" data-id="${t.id}">${ic("video", 13)} Mulai sesi</button><button class="btn btn-soft btn-sm" data-a="open" data-id="${t.id}">Ubah</button></div></div>`).join("") + `</div>`).join("")
    : `<div class="text-center text-mute py-6">Belum ada sesi terjadwal.</div>`;
  $("#avail").innerHTML = TIMES.map(t => `<div class="row"><span><b>${t.replace(":", ".")} WIB</b> <small class="text-mute">· 45 menit</small></span><span class="sw relative w-11 h-6 shrink-0"><input class="absolute inset-0 opacity-0 m-0 cursor-pointer" type="checkbox" data-slot="${t}" ${avail[t] ? "checked" : ""} aria-label="Slot ${t}"><span class="absolute inset-0 rounded-full bg-line pointer-events-none"></span></span></div>`).join("");
}
$("#sesi").onclick = e => {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const t = tasks.find(x => x.id == b.dataset.id);
  if (b.dataset.a === "open") openDlg(t); else toast("Membuka ruang sesi dengan " + t.siswa + "… (contoh tampilan)");
};
$("#avail").onchange = e => { const t = e.target.dataset.slot; if (t) { avail[t] = e.target.checked; toast("Slot " + t.replace(":", ".") + (avail[t] ? " diaktifkan." : " dinonaktifkan.")); } };

/* ---------- Riwayat ---------- */
function hist() {
  const l = tasks.filter(t => t.st === "selesai").sort((a, b) => b.slot.d.localeCompare(a.slot.d));
  $("#hist").innerHTML = l.length ? l.map(t => `<div class="card !mb-0"><div class="flex flex-wrap gap-2 mb-2"><span class="tag">${esc(t.mapel)}</span><span class="tag ${kcls(t.kes)}">${t.kes}</span></div>
    <h3 class="text-[17px] font-extrabold">${esc(t.judul)}</h3><div class="text-[13px] text-mute mt-1 mb-2.5">${esc(t.siswa)} · ${esc(t.kelas)} · dibahas ${fmt(t.slot.d, { day: "numeric", month: "long" })}</div>
    <div class="cat !mb-0"><b>Catatan pembahasan:</b> ${esc(t.cat || "-")}</div></div>`).join("") : `<div class="card text-center text-mute col-span-full">Belum ada riwayat.</div>`;
}

function all() { hero(); list(); sesi(); hist(); }
all();
