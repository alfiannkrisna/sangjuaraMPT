/* Dashboard siswa; data bersama. */
(() => {
const SESSION = SJ.require("siswa"); if (!SESSION) return;
const { M, TIMES, LOKASI, add, dd, fmt, dayLbl, when } = Core;
const TARGET = 18;
const KENDALA = ["Paham materi, macet di hitungan", "Tidak tahu mulai dari mana", "Bingung membaca soal", "Rumus lupa", "Hasil beda dengan kunci"];
const mt = id => M.find(m => m.id === id) || M[0];
let state, tasks = [], hm = "Semua", kchip = "", byNew = false;
let bk = { task: null, mentor: "d", date: add(0), slot: "" };
let rd = {};   // draf penilaian per tugas: { [taskId]: { stars, comment } }
const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
const nextSess = () => tasks.filter(t => t.st === "jadwal").sort((a,b) => when(a)-when(b))[0];
const done = () => Core.weekly(tasks);
$("#me").textContent = SESSION.ini; $("#me").title = SESSION.name;
/* ---------- Umum ---------- */
function show(t) {
  document.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b.dataset.t === t));
  ["tugas", "jadwal", "riwayat"].forEach(x => $("#p-" + x).hidden = x !== t);
}
document.querySelectorAll(".tab").forEach(b => b.onclick = () => show(b.dataset.t));
$("#homeBtn").onclick = e => { e.preventDefault(); show("tugas"); window.scrollTo({ top: 0, behavior: "smooth" }); };
$("#goJadwal").onclick = () => show("jadwal");
$("#arsip").onclick = () => show("riwayat");
$("#newBtn").onclick = () => { show("tugas"); $("#formCard").scrollIntoView({ behavior: "smooth" }); $("#judul").focus({ preventScroll: true }); };
$("#chatSide").onclick = () => toast("Kontak tutor belum dikonfigurasi. Tidak ada pesan WhatsApp yang dikirim.");
$("#logout").onclick = async () => {
  const yes = await UI.confirm({ title: "Keluar dari akun?", text: "Kamu perlu masuk lagi untuk melihat tugas dan jadwal sesimu.", icon: "out", tone: "danger", ok: "Ya, keluar", cancel: "Batal" });
  if (yes) try { SJ.logout(); } catch (e) { toast(e.message); }
};
UI.initNotif({
  btn: "#bell",
  items: () => {
    const l = [];
    tasks.filter(t => t.st === "jadwal").sort((a, b) => when(a) - when(b)).forEach(t => l.push({ id: "s" + t.id + t.slot.d + t.slot.t, icon: "pin", tone: "brand", title: "Sesi " + dayLbl(t.slot.d).toLowerCase() + " pukul " + t.slot.t.replace(":", "."), text: t.judul + " bersama " + mt(t.mentor).n + ". Mohon hadir 10 menit lebih awal.", time: dayLbl(t.slot.d), go: "jadwal" }));
    tasks.filter(t => t.st === "baru" && dd(t.dl) <= 1).forEach(t => l.push({ id: "d" + t.id + t.dl, icon: "al", tone: "danger", title: dd(t.dl) < 0 ? "Deadline terlewat" : "Deadline mendekat", text: t.judul + " — " + (dd(t.dl) < 0 ? "lewat " + -dd(t.dl) + " hari" : dd(t.dl) === 0 ? "hari ini" : "besok") + ". Segera pilih jadwal bimbingan.", time: "Penting", go: "jadwal" }));
    tasks.filter(t => t.st === "selesai" && !t.rating).forEach(t => l.push({ id: "r" + t.id, icon: "ok", tone: "brand", title: "Beri penilaian untuk mentor", text: t.judul + " sudah dibahas bersama " + mt(t.mentor).n + ". Bagikan pendapatmu.", time: "Dibahas " + fmt(t.completedAt), go: "riwayat" }));
    return l;
  },
  onPick: it => show(it.go)
});
document.querySelectorAll("[data-x]").forEach(a => a.onclick = e => { e.preventDefault(); toast("Halaman contoh."); });
/* ---------- Hero ---------- */
function stats() {
  const w = tasks.filter(t => t.st === "baru").length, j = tasks.filter(t => t.st === "jadwal").length, n = nextSess();
  const box = (i, big, sm, right) => `<div class="stat"><span class="w-[42px] h-[42px] rounded-xl bg-white/15 grid place-items-center shrink-0">${ic(i, 20)}</span><div class="flex-1 min-w-0"><b class="block text-[22px] font-extrabold">${big}</b><span class="text-[13px] opacity-90">${sm}</span></div>${right}</div>`;
  $("#stats").innerHTML =
    box("clip", w + " Menunggu", "Soal dalam antrean review", `<em class="not-italic text-[11.5px] font-bold opacity-80">TETAP FOKUS</em>`) +
    box("pin", j + " Dijadwalkan", n ? "Sesi 1-on-1 " + dayLbl(n.slot.d).toLowerCase() + " pukul " + n.slot.t.replace(":", ".") + " WIB" : "Belum ada sesi terjadwal",
      n ? `<em class="not-italic text-[11.5px] font-bold bg-wa/40 text-[#9BF0BC] px-2.5 py-0.5 rounded-full">${dayLbl(n.slot.d).toUpperCase()}</em>` : "") +
    box("ok", done() + " Tuntas", "PR terselesaikan minggu ini", `<em class="not-italic text-[11.5px] font-bold opacity-80">PEKAN INI</em>`);
}

/* ---------- Kanban status tugas ---------- */
function kcard(t) {
  const m = mt(t.mentor), tg = `<span class="tag">${esc(t.mapel)} • Kelas ${esc(t.kelas)}</span>`;
  if (t.st === "baru") {
    const d = dd(t.dl), p = d < 0 ? `<span class="tag tag-r">${ic("al", 12)} Lewat ${-d} hari</span>` : `<span class="tag tag-y">${ic("clock", 12)} ${d === 0 ? "Hari ini" : d + " hari lagi"}</span>`;
    return `<div class="kc">${tg}<div class="my-1.5">${p}</div><h4 class="font-bold text-[15px] leading-snug my-1.5">${esc(t.judul)}</h4>${attachment(t)}
      <div class="flex items-center gap-1.5 text-xs text-mute mb-2.5">${ic("cal", 13)} Batas: ${fmt(t.dl, { day: "numeric", month: "short", year: "numeric" })}</div>
      ${t.kendala ? `<div class="cat"><b>Catatanmu:</b> ${esc(t.kendala)}</div>` : ""}
      <button class="btn w-full text-[12.5px] !py-2.5" data-a="pick" data-id="${t.id}">${ic("cal", 13)} Pilih Jadwal</button></div>`;
  }
  if (t.st === "jadwal") return `<div class="kc"><span class="tag">${esc(t.mapel)} • Kelas ${esc(t.kelas)}</span><div class="my-1.5"><span class="tag">${ic("pin", 12)} ${dayLbl(t.slot.d)}, ${t.slot.t.replace(":", ".")} WIB</span></div>
      <h4 class="font-bold text-[15px] leading-snug my-1.5">${esc(t.judul)}</h4>${attachment(t)}
      <div class="flex items-center gap-2 text-xs font-bold py-2 border-t border-line mt-2"><span class="av !w-7 !h-7 !text-[11px]" style="background:${m.col}">${m.ini}</span>${m.n} (${m.u})</div>
      <div class="cat flex gap-2">${ic("info", 15)}<span>Sesi Coaching Clinic 45 menit, tatap muka di ${esc(LOKASI)}. Mohon hadir 10 menit sebelum sesi.</span></div>
      <button class="btn btn-wa w-full text-[12.5px] !py-2.5" data-a="loc">${ic("pin", 13)} Lihat Lokasi Sesi</button>
       </div>`;
  return `<div class="kc">${tg}<h4 class="font-bold text-[15px] leading-snug my-1.5">${esc(t.judul)}</h4>${attachment(t)}<div class="flex items-center gap-1.5 text-xs text-mute">${ic("ok", 13)} Dibahas ${fmt(t.completedAt)}</div></div>`;
}
const openSec = { baru: true, jadwal: true, selesai: true };   // status buka/tutup tiap baris

function board() {
  const q = $("#q").value.trim().toLowerCase(), act = tasks;
  const f = s => act.filter(t => t.st === s && (!q || t.judul.toLowerCase().includes(q) || t.mapel.toLowerCase().includes(q)))
    .sort(byNew ? (a, b) => b.id.localeCompare(a.id) : (a, b) => a.dl.localeCompare(b.dl));
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
$("#file").onchange = e => {
  const f = e.target.files[0], error = Core.fileError(f);
  if (error) { e.target.value = ""; toast(error); }
  $("#dropTxt").textContent = error || !f ? "Pilih foto, PDF, atau tangkapan layar" : f.name;
};
$("#dl").value = add(3); $("#dl").min = add(0);
$("#kirim").onclick = async () => {
  const button = $("#kirim"); if (button.disabled) return;
  let saved; button.disabled = true;
  try {
    const judul = $("#judul").value.trim(), dl = $("#dl").value;
    if (!judul) { $("#judul").focus(); throw Error("Isi judul soal dulu ya."); }
    if (!Core.validDate(dl) || dl < Core.date()) throw Error("Deadline tidak boleh lampau atau kosong.");
    const file = $("#file").files[0]; if (file) saved = await Attachments.save(file);
    await Store.create({ studentId: SESSION.id, siswa: SESSION.name, kelas: "XII", judul, dl,
      mapel: $("#mapel").value, kes: $("#kes").value,
      kendala: [kchip, $("#kendala").value.trim()].filter(Boolean).join(". "), ...(saved ? { attachment: saved } : {}) });
    $("#judul").value = ""; $("#kendala").value = ""; $("#file").value = "";
    $("#dropTxt").textContent = "Pilih foto, PDF, atau tangkapan layar";
    clearChips(); kchip = ""; all(); toast("Tugas tersimpan. Pilih jadwal atau kelola melalui akun mentor.");
  } catch (e) {
    if (saved) try { await Attachments.remove(saved.id); } catch {}
    toast(e.message);
  } finally { button.disabled = false; }
};

/* ---------- Booking sesi 1-on-1 ---------- */
function busy(t) {
  return !!Core.scheduleError(state, tasks.find(x => x.id === bk.task), bk.mentor, bk.date, t);
}
function side() {
  const pend = tasks.filter(t => t.st === "baru");
  if (!pend.some(t => t.id === bk.task)) bk.task = pend[0] ? pend[0].id : null;
  const step = (n, txt) => `<div class="lbl ${n === 1 ? "!mt-0" : ""}"><span class="flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-brand text-white grid place-items-center text-xs">${n}</span>${txt}</span></div>`;
  let days = "";
  for (let i = 0; i < 7; i++) {                                    // 7 kotak hari: hari ini sampai 6 hari ke depan
    const s = add(i), on = s === bk.date, mute = on ? "opacity-90" : "text-mute";
    days += `<button type="button" class="day rounded-xl py-2.5 text-center border-[1.5px] ${on ? "bg-brand text-white border-brand" : "bg-card border-line hover:bg-soft"}" data-d="${s}" aria-pressed="${on}" aria-label="${fmt(s, { weekday: "long", day: "numeric", month: "long" })}">
      <span class="block text-[11px] font-semibold ${mute}">${fmt(s, { weekday: "short" })}</span>
      <b class="block text-lg font-extrabold leading-tight">${Number(s.slice(8))}</b>
      <span class="block text-[10.5px] ${mute}">${i === 0 ? "Hari ini" : fmt(s, { month: "short" })}</span></button>`;
  }
  $("#book").innerHTML = `<h3 class="flex items-center gap-2 text-[19px] font-extrabold"><span class="w-2.5 h-2.5 rounded-full bg-wa"></span>Booking Sesi 1-on-1<span class="tag tag-y ml-auto">${dayLbl(bk.date)}</span></h3>
  <p class="sub !mb-2.5">Ikuti empat langkah berikut untuk bedah soal macet secara intensif selama 45 menit.</p>
  <div class="flex items-center gap-2 bg-soft text-mute rounded-xl px-3.5 py-2.5 text-[13px] mb-4">${ic("pin", 15)} Sesi tatap muka di ${esc(LOKASI)}</div>

  ${step(1, "Pilih soal yang mau dibahas")}
  <select class="field" id="bkT" aria-label="Soal yang mau dibahas">${pend.length ? pend.map(t => `<option value="${t.id}" ${t.id === bk.task ? "selected" : ""}>${esc(t.judul)}</option>`).join("") : '<option value="">Belum ada tugas menunggu</option>'}</select>

  ${step(2, "Pilih hari")}
  <div class="grid grid-cols-7 gap-1.5 sm:gap-2" role="group" aria-label="Pilih hari">${days}</div>

  ${step(3, "Pilih tutor")}
  ${M.map(m => `<label class="ment"><input type="radio" name="mt" value="${m.id}" class="w-[18px] h-[18px] accent-[var(--blue)]" ${m.id === bk.mentor ? "checked" : ""}><span class="av" style="background:${m.col}">${m.ini}</span><span><b class="text-sm">${m.n}</b><span class="tag !rounded-md !px-1.5 !py-px ml-1">${m.u}</span><small class="block text-xs text-mute">Profil mentor demo</small></span><span class="ml-auto text-xs font-bold text-mute">${TIMES.filter(t => state.avail[m.id][t]).length} slot aktif</span></label>`).join("")}

  ${step(4, "Pilih jam sesi")}
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">${TIMES.map(t => { const b = busy(t); return `<button class="slot" data-t="${t}" ${b ? "disabled" : ""} aria-pressed="${t === bk.slot}">${t.replace(":", ".")} WIB${b ? " (Penuh)" : ""}</button>`; }).join("")}</div>
  <button class="btn w-full !py-3.5" id="ok">Konfirmasi Jadwal 1-on-1</button>`;
}
$("#book").onchange = e => {
  if (e.target.id === "bkT") bk.task = e.target.value;
  if (e.target.name === "mt") { bk.mentor = e.target.value; bk.slot = ""; }   // jam kosong bisa berbeda untuk tiap tutor
  side();
};
$("#book").onclick = async e => {
  const dayBtn = e.target.closest(".day"); if (dayBtn) { bk.date = dayBtn.dataset.d; bk.slot = ""; side(); return; }
  const s = e.target.closest(".slot"); if (s && !s.disabled) { bk.slot = s.dataset.t; side(); return; }
  if (e.target.closest("#ok")) {
    const t = tasks.find(x => x.id === bk.task);
    if (!t) return toast("Belum ada tugas yang menunggu jadwal.");
    if (!bk.slot) return toast("Pilih jam sesi dulu ya.");
    const yes = await UI.confirm({ title: "Konfirmasi sesi 1-on-1", text: "Pastikan jadwal ini sudah sesuai.", icon: "cal", tone: "brand", ok: "Ya, pesan sesi", cancel: "Ubah lagi",
      details: [["Tugas", t.judul], ["Mentor", mt(bk.mentor).n], ["Waktu", dayLbl(bk.date) + ", " + bk.slot.replace(":", ".") + " WIB"], ["Lokasi", LOKASI]] });
    if (!yes) return;
    try {
      await Store.manage(t.id, { st: "jadwal", mentor: bk.mentor, slot: { d: bk.date, t: bk.slot } });
      bk.slot = ""; all(); toast("Sesi tersimpan. Pengingat otomatis tidak tersedia pada demo.");
    } catch (error) { all(); toast(error.message); }
  }
};

/* ---------- Target, sesi mendatang, riwayat ---------- */
function target() {
  const tu = done(), p = Math.min(100, Math.round(tu / TARGET * 100));
  $("#target").innerHTML = `<div class="flex justify-between text-[13px] font-bold"><span>Target Tuntas Pekanan</span><span class="text-brand">${tu}/${TARGET} Soal (${p}%)</span></div>
  <div class="h-2.5 rounded-full bg-soft overflow-hidden my-3"><i class="block h-full bg-sun rounded-full transition-all duration-300" style="width:${p}%"></i></div>
  <div class="flex justify-between text-[13px] text-mute"><span>Senin - Minggu ini</span><b class="text-okt">Pekan lalu: ${Core.weekly(tasks, -1)} soal</b></div>`;
}
function upcoming() {
  const l = tasks.filter(t => t.st === "jadwal").sort((a, b) => when(a) - when(b));
  $("#upcoming").innerHTML = l.length ? l.map(t => `<div class="row"><div><b>${esc(t.judul)}</b><div class="text-[13px] text-mute">${fmt(t.slot.d, { weekday: "long", day: "numeric", month: "long" })}, ${t.slot.t.replace(":", ".")} WIB · ${mt(t.mentor).n}</div></div></div>`).join("")
    : `<div class="text-mute text-center py-5">Belum ada sesi. Pilih mentor dan jam di sebelah kiri.</div>`;
}
$("#upcoming").onclick = e => { if (e.target.closest("[data-n]")) toast("Demo tidak mengirim pengingat WhatsApp."); };

/* Penilaian siswa untuk mentor: sudah dinilai -> tampil ringkas; belum -> form bintang + komentar */
function rateBox(t) {
  if (t.rating) return `<div class="cat !mb-0 mt-2.5"><b class="text-warnt" aria-label="${t.rating.stars} dari 5 bintang">${stars(t.rating.stars)}</b> Penilaianmu${t.rating.comment ? ": " + esc(t.rating.comment) : ""}</div>`;
  const d = rd[t.id] || {}, v = d.stars || 0;
  return `<div class="mt-3 border-t border-line pt-3" data-rate="${t.id}">
    <b class="block text-sm mb-1">Beri penilaian untuk ${esc(mt(t.mentor).n)}</b>
    <div class="flex gap-0.5" role="group" aria-label="Pilih jumlah bintang">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}" aria-label="${n} bintang" aria-pressed="${n === v}" class="text-[28px] leading-none px-0.5 bg-transparent border-0 cursor-pointer ${n <= v ? "text-sun" : "text-line"}">★</button>`).join("")}</div>
    <textarea class="field mt-2 min-h-16 resize-y" maxlength="1000" aria-label="Komentar penilaian" placeholder="Komentar untuk mentor (opsional)">${esc(d.comment || "")}</textarea>
    <button type="button" class="btn btn-sm mt-2" data-send>Kirim penilaian</button></div>`;
}
function hist() {
  const a = tasks.filter(t => t.st === "selesai"), ms = ["Semua", ...new Set(a.map(t => t.mapel))];
  $("#hchips").innerHTML = ms.map(m => `<button class="chip" aria-pressed="${m === hm}" data-h="${esc(m)}">${esc(m)}</button>`).join("");
  const l = a.filter(t => hm === "Semua" || t.mapel === hm);
  $("#hist").innerHTML = l.length ? l.map(t => `<div class="card !mb-0"><h3 class="text-[17px] font-extrabold">${esc(t.judul)}</h3>${attachment(t)}<div class="text-[13px] text-mute mt-1 mb-2">${esc(t.mapel)} · dibahas ${fmt(t.completedAt, { day: "numeric", month: "long" })} · ${mt(t.mentor).n}</div>${t.kendala ? `<span class="tag tag-y">${esc(t.kendala)}</span>` : ""}<div class="cat !mb-0 mt-3"><b>Catatan mentor:</b> ${esc(t.cat || "Belum ada catatan dari mentor.")}</div>${rateBox(t)}</div>`).join("")
    : `<div class="card text-mute text-center col-span-full">Belum ada tugas tuntas.</div>`;
}
$("#hchips").onclick = e => { const b = e.target.closest("[data-h]"); if (b) { hm = b.dataset.h; hist(); } };
$("#hist").oninput = e => { const box = e.target.closest("[data-rate]"); if (box) (rd[box.dataset.rate] ||= {}).comment = e.target.value; };
$("#hist").onclick = async e => {
  const box = e.target.closest("[data-rate]"); if (!box) return;
  const id = box.dataset.rate, star = e.target.closest("[data-star]");
  if (star) { (rd[id] ||= {}).stars = +star.dataset.star; hist(); return; }
  const send = e.target.closest("[data-send]"); if (!send || send.disabled) return;
  send.disabled = true;
  try {
    await Store.rate(id, rd[id]?.stars || 0, box.querySelector("textarea").value);
    delete rd[id]; all(); toast("Terima kasih! Penilaianmu sudah tersimpan.");
  } catch (error) { toast(error.message); }
  finally { send.disabled = false; }
};

function all() {
  state = Store.load(); tasks = state.tasks.filter(t => t.studentId === SESSION.id);
  if (bk.date < Core.date()) { bk.date = Core.date(); bk.slot = ""; }
  $("#dl").min = Core.date();
  stats(); board(); side(); target(); upcoming();
  if (!document.activeElement?.closest?.("#hist")) hist();   // jangan timpa komentar yang sedang diketik
  UI.refreshNotif();
  $("#weeklyReport").textContent = `Pekan ini: ${done()} soal selesai. Pekan lalu: ${Core.weekly(tasks, -1)} soal.`;
  const prefs = state.prefs[SESSION.id] || {};
  if (document.activeElement !== $("#wa")) $("#wa").value = prefs.wa || "";
  document.querySelectorAll("#p-jadwal .sw input").forEach((el, i) => { el.checked = !!prefs.reminders?.[i]; });
}
$("#wa").onchange = async e => {
  const value = e.target.value.trim(), normalized = Core.phone(value);
  if (value && !normalized) { e.target.setAttribute("aria-invalid", "true"); return toast("Nomor WhatsApp Indonesia tidak valid."); }
  e.target.removeAttribute("aria-invalid");
  try { await Store.update(s => { s.prefs[SESSION.id] = { ...s.prefs[SESSION.id], wa: normalized }; }); all(); toast("Nomor tersimpan lokal. Demo tidak mengirim pesan otomatis."); } catch (error) { toast(error.message); }
};
document.querySelectorAll("#p-jadwal .sw input").forEach((el, index) => {
  el.onchange = async () => {
    try { await Store.update(s => {
      const prefs = s.prefs[SESSION.id] ||= {};
      const reminders = prefs.reminders ||= [false, false, false]; reminders[index] = el.checked;
    }); toast("Preferensi tersimpan. Pengingat otomatis belum tersedia."); }
    catch (e) { el.checked = !el.checked; toast(e.message); }
  };
});
try { all(); initDashboard("siswa", all); } catch (error) { fatal(error); }
})();
