/* Dashboard Tugas – Sang Juara School | logika aplikasi (data contoh, tanpa backend) */
const SESSION = SJ.require("siswa");            // wajib login sebagai siswa
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Ikon (stroke, gaya Feather) ---------- */
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

/* ---------- Tanggal (waktu lokal, aman untuk WIB) ---------- */
const DAY = 864e5, now = new Date(), today = new Date(now); today.setHours(0, 0, 0, 0);
const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const add = n => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };
const dt = s => new Date(s + "T00:00");
const fmt = (s, o) => dt(s).toLocaleDateString("id-ID", o || { day: "numeric", month: "short" });
const dd = s => Math.round((dt(s) - today) / DAY);
const dayLbl = s => dd(s) === 0 ? "Hari ini" : dd(s) === 1 ? "Besok" : fmt(s, { weekday: "long", day: "numeric", month: "short" });

/* ---------- Data contoh ---------- */
const M = [
  { id: "d", n: "Kak Dimas S.", u: "ITB", r: 4.9, c: 128, st: "Standby", col: "#2326C9", ini: "DS" },
  { id: "s", n: "Kak Sarah N.", u: "UI", r: 5.0, c: 94, st: "1 Sisa Slot", col: "#0F8B6D", ini: "SN" },
  { id: "f", n: "Kak Fajar R.", u: "UGM", r: 4.8, c: 210, st: "Standby", col: "#B45309", ini: "FR" }
];
const mt = id => M.find(m => m.id === id) || M[0];
const KENDALA = ["Paham materi, macet di hitungan", "Tidak tahu mulai dari mana", "Bingung membaca soal", "Rumus lupa", "Hasil beda dengan kunci"];
const LOKASI = "Ruang Coaching Clinic Sang Juara School";   // ubah sesuai lokasi sebenarnya
const TIMES = ["15:30", "16:30", "19:00", "20:15"], BASE = 14, TARGET = 18;
let tasks = [
  { id: 1, judul: "Turunan Parsial Implisit No. 4b", mapel: "Matematika Minat", kelas: 12, dl: add(2), kendala: "Paham konsep dasarnya tapi macet di perhitungan rantai kedua.", st: "baru", mentor: "d" },
  { id: 2, judul: "Siklus Carnot & Entropi Reservoir", mapel: "Fisika", kelas: 11, dl: add(-3), kendala: "Bingung membaca soal grafik P-V pada proses isotermal.", st: "baru", mentor: "s" },
  { id: 3, judul: "Stoikiometri & Penentuan Pereaksi Pembatas", mapel: "Kimia", kelas: 12, dl: add(5), kendala: "", st: "jadwal", mentor: "d", slot: { d: now.getHours() < 14 ? add(0) : add(1), t: "16:30" } },
  { id: 4, judul: "Barisan aritmetika", mapel: "Matematika Wajib", kelas: 12, dl: add(-8), kendala: "Tidak tahu mulai dari mana", st: "selesai", old: 1, mentor: "d", slot: { d: add(-9), t: "17:00" }, cat: "Dibahas cara menentukan beda dan suku pertama, lalu latihan 3 soal serupa." },
  { id: 5, judul: "Persamaan kuadrat no. 7", mapel: "Matematika Wajib", kelas: 12, dl: add(-12), kendala: "Hasil beda dengan kunci", st: "selesai", old: 1, mentor: "s", slot: { d: add(-13), t: "15:00" }, cat: "Dibahas ulang pemfaktoran dan rumus abc. Disarankan latihan soal bab 3." }
];
let nid = 6, hm = "Semua", kchip = "", byNew = false;
let bk = { task: 1, mentor: "d", date: now.getHours() * 60 + now.getMinutes() > 1215 ? add(1) : add(0), slot: "" };
const taken = { [add(0)]: ["16:30"] };

/* ---------- Umum ---------- */
function toast(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.h); toast.h = setTimeout(() => t.hidden = true, 2600); }
function show(t) {
  document.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b.dataset.t === t));
  ["tugas", "jadwal", "riwayat"].forEach(x => $("#p-" + x).hidden = x !== t);
}
document.querySelectorAll(".tab").forEach(b => b.onclick = () => show(b.dataset.t));
$("#goJadwal").onclick = () => show("jadwal");
$("#arsip").onclick = () => show("riwayat");
$("#newBtn").onclick = () => { show("tugas"); $("#formCard").scrollIntoView({ behavior: "smooth" }); $("#judul").focus({ preventScroll: true }); };
$("#chatTop").onclick = $("#chatSide").onclick = () => toast("Membuka WhatsApp tutor jaga… (contoh tampilan)");
$("#logout").onclick = async () => {
  const yes = await UI.confirm({ title: "Keluar dari akun?", text: "Kamu perlu masuk lagi untuk melihat tugas dan jadwal sesimu.", icon: "out", tone: "danger", ok: "Ya, keluar", cancel: "Batal" });
  if (yes) SJ.logout();
};
UI.initNotif({
  btn: "#bell",
  items: () => {
    const l = [];
    tasks.filter(t => t.st === "jadwal").sort((a, b) => when(a) - when(b)).forEach(t => l.push({ id: "s" + t.id + t.slot.d + t.slot.t, icon: "pin", tone: "brand", title: "Sesi " + dayLbl(t.slot.d).toLowerCase() + " pukul " + t.slot.t.replace(":", "."), text: t.judul + " bersama " + mt(t.mentor).n + ". Mohon hadir 10 menit lebih awal.", time: dayLbl(t.slot.d), go: "jadwal" }));
    tasks.filter(t => t.st === "baru" && dd(t.dl) <= 1).forEach(t => l.push({ id: "d" + t.id + t.dl, icon: "al", tone: "danger", title: dd(t.dl) < 0 ? "Deadline terlewat" : "Deadline mendekat", text: t.judul + " — " + (dd(t.dl) < 0 ? "lewat " + -dd(t.dl) + " hari" : dd(t.dl) === 0 ? "hari ini" : "besok") + ". Segera pilih jadwal bimbingan.", time: "Penting", go: "jadwal" }));
    return l;
  },
  onPick: it => show(it.go)
});
document.querySelectorAll("[data-x]").forEach(a => a.onclick = e => { e.preventDefault(); toast("Halaman contoh."); });
$("#theme").onclick = () => {
  const r = document.documentElement, dark = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme:dark)").matches;
  r.dataset.theme = dark ? "light" : "dark";
};
const when = t => { const [h, m] = t.slot.t.split(":"), s = dt(t.slot.d); s.setHours(+h, +m); return s; };
const nextSess = () => tasks.filter(t => t.st === "jadwal").sort((a, b) => when(a) - when(b))[0];
const done = () => BASE + tasks.filter(t => t.st === "selesai" && !t.old).length;

/* ---------- Hero ---------- */
function stats() {
  const w = tasks.filter(t => t.st === "baru").length, j = tasks.filter(t => t.st === "jadwal").length, n = nextSess();
  const box = (i, big, sm, right) => `<div class="stat"><span class="w-[42px] h-[42px] rounded-xl bg-white/15 grid place-items-center shrink-0">${ic(i, 20)}</span><div class="flex-1 min-w-0"><b class="block text-[22px] font-extrabold">${big}</b><span class="text-[13px] opacity-90">${sm}</span></div>${right}</div>`;
  $("#stats").innerHTML =
    box("clip", w + " Menunggu", "Soal dalam antrean review", `<em class="not-italic text-[11.5px] font-bold opacity-80">TETAP FOKUS</em>`) +
    box("pin", j + " Dijadwalkan", n ? "Sesi 1-on-1 " + dayLbl(n.slot.d).toLowerCase() + " pukul " + n.slot.t.replace(":", ".") + " WIB" : "Belum ada sesi terjadwal",
      n ? `<em class="not-italic text-[11.5px] font-bold bg-wa/40 text-[#9BF0BC] px-2.5 py-0.5 rounded-full">${dayLbl(n.slot.d).toUpperCase()}</em>` : "") +
    box("ok", done() + " Tuntas", "PR terselesaikan minggu ini", `<em class="not-italic text-[11.5px] font-bold opacity-80">Peringkat 3 Kelas</em>`);
}

/* ---------- Kanban status tugas ---------- */
function kcard(t) {
  const m = mt(t.mentor), tg = `<span class="tag">${esc(t.mapel)} • ${t.kelas}</span>`;
  if (t.st === "baru") {
    const d = dd(t.dl), p = d < 0 ? `<span class="tag tag-r">${ic("al", 12)} Lewat ${-d} hari</span>` : `<span class="tag tag-y">${ic("clock", 12)} ${d === 0 ? "Hari ini" : d + " hari lagi"}</span>`;
    return `<div class="kc">${tg}<div class="my-1.5">${p}</div><h4 class="font-bold text-[15px] leading-snug my-1.5">${esc(t.judul)}</h4>
      <div class="flex items-center gap-1.5 text-xs text-mute mb-2.5">${ic("cal", 13)} Batas: ${fmt(t.dl, { day: "numeric", month: "short", year: "numeric" })}</div>
      ${t.kendala ? `<div class="cat"><b>Catatanmu:</b> ${esc(t.kendala)}</div>` : ""}
      <button class="btn w-full text-[12.5px] !py-2.5" data-a="pick" data-id="${t.id}">${ic("cal", 13)} Pilih Jadwal</button></div>`;
  }
  if (t.st === "jadwal") return `<div class="kc"><span class="tag">${esc(t.mapel)} • Kelas ${t.kelas}</span><div class="my-1.5"><span class="tag">${ic("pin", 12)} ${dayLbl(t.slot.d)}, ${t.slot.t.replace(":", ".")} WIB</span></div>
      <h4 class="font-bold text-[15px] leading-snug my-1.5">${esc(t.judul)}</h4>
      <div class="flex items-center gap-2 text-xs font-bold py-2 border-t border-line mt-2"><span class="av !w-7 !h-7 !text-[11px]" style="background:${m.col}">${m.ini}</span>${m.n} (${m.u})</div>
      <div class="cat flex gap-2">${ic("info", 15)}<span>Sesi Coaching Clinic 45 menit, tatap muka di ${esc(LOKASI)}. Mohon hadir 10 menit sebelum sesi.</span></div>
      <button class="btn btn-wa w-full text-[12.5px] !py-2.5" data-a="loc">${ic("pin", 13)} Lihat Lokasi Sesi</button>
      <button class="btn btn-soft w-full text-[12.5px] !py-2.5 mt-2" data-a="done" data-id="${t.id}">${ic("ok", 13)} Tandai Tuntas</button></div>`;
  return `<div class="kc">${tg}<h4 class="font-bold text-[15px] leading-snug my-1.5">${esc(t.judul)}</h4><div class="flex items-center gap-1.5 text-xs text-mute">${ic("ok", 13)} Dibahas ${fmt(t.slot.d)}</div></div>`;
}
const openSec = { baru: true, jadwal: true, selesai: true };   // status buka/tutup tiap baris

function board() {
  const q = $("#q").value.trim().toLowerCase(), act = tasks.filter(t => !t.old);
  const f = s => act.filter(t => t.st === s && (!q || t.judul.toLowerCase().includes(q) || t.mapel.toLowerCase().includes(q)))
    .sort(byNew ? (a, b) => b.id - a.id : (a, b) => a.dl.localeCompare(b.dl));
  const sec = (s, title, c, emp) => {
    const l = f(s);
    return `<details class="kcol group" data-s="${s}" ${openSec[s] ? "open" : ""}>
      <summary class="flex items-center gap-2 cursor-pointer list-none select-none text-sm font-extrabold [&::-webkit-details-marker]:hidden">
        <i class="w-[11px] h-[11px] rounded-full" style="background:${c}"></i>${title}
        <b class="ml-auto bg-card rounded-full text-[11.5px] px-2.5" style="color:${c}">${l.length}</b>
        <span class="flex transition-transform duration-200 group-open:rotate-180">${ic("chev", 18)}</span>
      </summary>
      <div class="grid gap-3 mt-3 grid-cols-[repeat(auto-fill,minmax(230px,1fr))] [&>.kc]:mb-0">${l.length ? l.map(kcard).join("") : emp}</div>
    </details>`;
  };
  $("#kan").innerHTML =
    sec("baru", "Menunggu Jadwal", "#FFC21A", `<div class="emp col-span-full">Tidak ada tugas yang menunggu jadwal.</div>`) +
    sec("jadwal", "Dijadwalkan", "#2326C9", `<div class="emp col-span-full">Belum ada sesi terjadwal.</div>`) +
    sec("selesai", "Selesai", "#16A34A", `<div class="emp col-span-full"><div class="w-12 h-12 rounded-full bg-okbg text-okt grid place-items-center mx-auto mb-2.5">${ic("tr", 22)}</div><b class="block text-sm text-ink mb-1.5">Belum ada tugas selesai pekan ini</b>Tugas yang sudah dibahas bareng mentor akan otomatis tersimpan rapi di sini beserta catatan solusinya.<br><br><span class="tag tag-y">Semangat Juara! 💪</span></div>`);
  $("#total").textContent = "Total " + act.filter(t => t.st !== "selesai").length + " Tugas";
}
// ingat baris mana yang dibuka/ditutup (toggle tidak bubbling, jadi pakai capture)
$("#kan").addEventListener("toggle", e => { const s = e.target.dataset && e.target.dataset.s; if (s) openSec[s] = e.target.open; }, true);
$("#q").oninput = board;
$("#sortBtn").onclick = () => { byNew = !byNew; board(); toast(byNew ? "Diurutkan: terbaru" : "Diurutkan: batas waktu terdekat"); };
$("#kan").onclick = async e => {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const t = tasks.find(x => x.id == b.dataset.id), a = b.dataset.a;
  if (a === "pick") { bk.task = t.id; bk.mentor = t.mentor; side(); show("jadwal"); toast("Pilih mentor dan jam sesi, lalu konfirmasi."); }
  if (a === "done") {
    const yes = await UI.confirm({ title: "Tandai tugas selesai?", text: "“" + t.judul + "” akan dipindahkan ke kolom Selesai dan Riwayat.", icon: "ok", tone: "ok", ok: "Ya, sudah selesai", cancel: "Belum" });
    if (!yes) return;
    t.st = "selesai"; all(); toast("Bagus! Tugas masuk ke kolom Selesai dan Riwayat.");
  }
  if (a === "loc") toast("Lokasi sesi: " + LOKASI);
};

/* ---------- Form unggah ---------- */
$("#kchips").innerHTML = KENDALA.map(k => `<button type="button" class="chip" aria-pressed="false">${k}</button>`).join("");
const clearChips = () => document.querySelectorAll("#kchips .chip").forEach(c => { c.setAttribute("aria-pressed", "false"); c.querySelector("svg")?.remove(); });
$("#kchips").onclick = e => {
  const b = e.target.closest(".chip"); if (!b) return;
  const on = b.getAttribute("aria-pressed") !== "true"; clearChips();
  b.setAttribute("aria-pressed", on); kchip = on ? b.textContent : "";
  if (on) b.insertAdjacentHTML("afterbegin", ic("chk", 13));
};
$("#browse").onclick = () => $("#file").click();
$("#file").onchange = e => { const f = e.target.files[0]; $("#dropTxt").textContent = f ? f.name : "Pilih foto, PDF, atau tangkapan layar"; };
$("#dl").value = add(3); $("#dl").min = add(0);
$("#kirim").onclick = () => {
  const j = $("#judul").value.trim();
  if (!j) { toast("Isi judul soal dulu ya."); $("#judul").focus(); return; }
  const k = [kchip, $("#kendala").value.trim()].filter(Boolean).join(". ");
  tasks.unshift({ id: nid++, judul: j, mapel: $("#mapel").value, kelas: 12, dl: $("#dl").value || add(3), kendala: k, st: "baru", mentor: "d" });
  $("#judul").value = ""; $("#kendala").value = ""; $("#file").value = ""; $("#dropTxt").textContent = "Pilih foto, PDF, atau tangkapan layar";
  clearChips(); kchip = ""; all(); toast("Tugas terkirim. Tinggal pilih jadwalnya!");
};

/* ---------- Booking sesi 1-on-1 ---------- */
function busy(t) {
  const d = bk.date, mn = (+t.slice(0, 2)) * 60 + +t.slice(3);
  return (taken[d] || []).includes(t) || tasks.some(x => x.st === "jadwal" && x.slot.d === d && x.slot.t === t) || (dd(d) === 0 && mn <= now.getHours() * 60 + now.getMinutes());
}
function side() {
  const pend = tasks.filter(t => t.st === "baru");
  if (!pend.some(t => t.id === bk.task)) bk.task = pend[0] ? pend[0].id : null;
  let dopt = ""; for (let i = 0; i < 7; i++) { const s = add(i); dopt += `<option value="${s}" ${s === bk.date ? "selected" : ""}>${i === 0 ? "Hari ini" : i === 1 ? "Besok" : fmt(s, { weekday: "short", day: "numeric", month: "short" })}</option>`; }
  $("#book").innerHTML = `<h3 class="flex items-center gap-2 text-[19px] font-extrabold"><span class="w-2.5 h-2.5 rounded-full bg-wa"></span>Booking Sesi 1-on-1<span class="tag tag-y ml-auto">${dayLbl(bk.date)}</span></h3>
  <p class="sub !mb-2.5">Pilih mentor pilihanmu untuk bedah soal macet secara intensif selama 45 menit.</p>
  <div class="flex items-center gap-2 bg-soft text-mute rounded-xl px-3.5 py-2.5 text-[13px] mb-4">${ic("pin", 15)} Sesi tatap muka di ${esc(LOKASI)}</div>
  <label class="lbl !mt-0" for="bkT">Tugas yang mau dibahas</label>
  <select class="field" id="bkT">${pend.length ? pend.map(t => `<option value="${t.id}" ${t.id === bk.task ? "selected" : ""}>${esc(t.judul)}</option>`).join("") : '<option value="">Belum ada tugas menunggu</option>'}</select>
  <div class="lbl">Pilih Mentor Tersedia:</div>
  ${M.map(m => `<label class="ment"><input type="radio" name="mt" value="${m.id}" class="w-[18px] h-[18px] accent-[var(--blue)]" ${m.id === bk.mentor ? "checked" : ""}><span class="av" style="background:${m.col}">${m.ini}</span><span><b class="text-sm">${m.n}</b><span class="tag !rounded-md !px-1.5 !py-px ml-1">${m.u}</span><small class="block text-xs text-mute">★ ${m.r.toFixed(1)} (${m.c} sesi)</small></span><span class="ml-auto text-xs font-bold ${m.st === "Standby" ? "text-okt" : "text-mute"}">${m.st}</span></label>`).join("")}
  <label class="lbl" for="bkD">Tanggal</label><select class="field" id="bkD">${dopt}</select>
  <div class="lbl">Pilih Jam Sesi:</div>
  <div class="grid grid-cols-2 gap-2 mb-4">${TIMES.map(t => { const b = busy(t); return `<button class="slot" data-t="${t}" ${b ? "disabled" : ""} aria-pressed="${t === bk.slot}">${t.replace(":", ".")} WIB${b ? " (Penuh)" : ""}</button>`; }).join("")}</div>
  <button class="btn w-full !py-3.5" id="ok">Konfirmasi Jadwal 1-on-1</button>`;
}
$("#book").onchange = e => {
  if (e.target.id === "bkT") bk.task = +e.target.value;
  if (e.target.id === "bkD") { bk.date = e.target.value; bk.slot = ""; }
  if (e.target.name === "mt") bk.mentor = e.target.value;
  side();
};
$("#book").onclick = async e => {
  const s = e.target.closest(".slot"); if (s && !s.disabled) { bk.slot = s.dataset.t; side(); return; }
  if (e.target.closest("#ok")) {
    const t = tasks.find(x => x.id === bk.task);
    if (!t) return toast("Belum ada tugas yang menunggu jadwal.");
    if (!bk.slot) return toast("Pilih jam sesi dulu ya.");
    const yes = await UI.confirm({ title: "Konfirmasi sesi 1-on-1", text: "Pastikan jadwal ini sudah sesuai.", icon: "cal", tone: "brand", ok: "Ya, pesan sesi", cancel: "Ubah lagi",
      details: [["Tugas", t.judul], ["Mentor", mt(bk.mentor).n], ["Waktu", dayLbl(bk.date) + ", " + bk.slot.replace(":", ".") + " WIB"], ["Lokasi", LOKASI]] });
    if (!yes) return;
    t.st = "jadwal"; t.mentor = bk.mentor; t.slot = { d: bk.date, t: bk.slot }; bk.slot = "";
    all(); toast("Sesi dipesan. Pengingat WhatsApp akan dikirim.");
  }
};

/* ---------- Target, sesi mendatang, riwayat ---------- */
function target() {
  const tu = done(), p = Math.min(100, Math.round(tu / TARGET * 100));
  $("#target").innerHTML = `<div class="flex justify-between text-[13px] font-bold"><span>Target Tuntas Pekanan</span><span class="text-brand">${tu}/${TARGET} Soal (${p}%)</span></div>
  <div class="h-2.5 rounded-full bg-soft overflow-hidden my-3"><i class="block h-full bg-sun rounded-full transition-all duration-300" style="width:${p}%"></i></div>
  <div class="flex justify-between text-[13px] text-mute"><span>Senin - Minggu ini</span><b class="text-okt">+3 Soal dari minggu lalu</b></div>`;
}
function upcoming() {
  const l = tasks.filter(t => t.st === "jadwal").sort((a, b) => when(a) - when(b));
  $("#upcoming").innerHTML = l.length ? l.map(t => `<div class="row"><div><b>${esc(t.judul)}</b><div class="text-[13px] text-mute">${fmt(t.slot.d, { weekday: "long", day: "numeric", month: "long" })}, ${t.slot.t.replace(":", ".")} WIB · ${mt(t.mentor).n}</div></div><button class="btn btn-wa btn-sm" data-n="1">Ingatkan saya</button></div>`).join("")
    : `<div class="text-mute text-center py-5">Belum ada sesi. Pilih mentor dan jam di sebelah kiri.</div>`;
}
$("#upcoming").onclick = e => { if (e.target.closest("[data-n]")) toast("Pengingat WhatsApp dijadwalkan."); };
function hist() {
  const a = tasks.filter(t => t.st === "selesai"), ms = ["Semua", ...new Set(a.map(t => t.mapel))];
  $("#hchips").innerHTML = ms.map(m => `<button class="chip" aria-pressed="${m === hm}" data-h="${esc(m)}">${esc(m)}</button>`).join("");
  const l = a.filter(t => hm === "Semua" || t.mapel === hm);
  $("#hist").innerHTML = l.length ? l.map(t => `<div class="card !mb-0"><h3 class="text-[17px] font-extrabold">${esc(t.judul)}</h3><div class="text-[13px] text-mute mt-1 mb-2">${esc(t.mapel)} · dibahas ${fmt(t.slot.d, { day: "numeric", month: "long" })} · ${mt(t.mentor).n}</div>${t.kendala ? `<span class="tag tag-y">${esc(t.kendala)}</span>` : ""}<div class="cat !mb-0 mt-3"><b>Catatan mentor:</b> ${esc(t.cat || "Belum ada catatan dari mentor.")}</div></div>`).join("")
    : `<div class="card text-mute text-center col-span-full">Belum ada tugas tuntas.</div>`;
}
$("#hchips").onclick = e => { const b = e.target.closest("[data-h]"); if (b) { hm = b.dataset.h; hist(); } };

function all() { stats(); board(); side(); target(); upcoming(); hist(); UI.refreshNotif(); }
all();