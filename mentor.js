/* Panel mentor demo; tugas baru dapat dipilih mentor, sesi hanya milik mentor aktif. */
(() => {
const S = SJ.require("mentor"); if (!S) return;
const { TIMES, LOKASI, KES, add, dd, fmt, dayLbl, when } = Core;
const ini = n => n.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
let state, tasks = [], avail = {}, editing = null;
let f = { q: "", mapel: "Semua", kes: "Semua", st: "aktif", so: "p" };
let ym = Core.date().slice(0, 7), selDay = Core.date();
const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
const tile = (v, l, c) => `<div class="rounded-2xl p-4 text-center ${c}"><b class="block text-[28px] font-extrabold leading-tight">${v}</b><span class="text-[13px] opacity-80">${l}</span></div>`;
/* ---------- Prioritas = urgensi deadline x2 + kesulitan x2 (skor 4 - 16) ---------- */
const urg = t => { const d = dd(t.dl); return d <= 0 ? 5 : d <= 1 ? 4 : d <= 3 ? 3 : d <= 7 ? 2 : 1; };
const score = t => urg(t) * 2 + KES[t.kes] * 2;
const level = t => score(t) >= 12 ? "Tinggi" : score(t) >= 8 ? "Sedang" : "Rendah";
const kcls = k => k === "Sulit" ? "tag-r" : k === "Sedang" ? "tag-y" : "!bg-okbg !text-okt";

/* ---------- Umum ---------- */
function show(t) {
  document.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", b.dataset.t === t));
  ["beranda", "antrean", "jadwal", "riwayat"].forEach(x => $("#p-" + x).hidden = x !== t);
}
document.querySelectorAll(".tab").forEach(b => b.onclick = () => show(b.dataset.t));
document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => show(b.dataset.go));
$("#homeBtn").onclick = e => { e.preventDefault(); show("beranda"); window.scrollTo({ top: 0, behavior: "smooth" }); };
$("#logout").onclick = async () => {
  const yes = await UI.confirm({ title: "Keluar dari akun?", text: "Kamu akan kembali ke halaman masuk.", icon: "out", tone: "danger", ok: "Ya, keluar", cancel: "Batal" });
  if (yes) try { SJ.logout(); } catch (e) { toast(e.message); }
};
function notifItems() {
  const l = [], rel = t => dd(t.dl) < 0 ? "lewat " + -dd(t.dl) + " hari" : dd(t.dl) === 0 ? "deadline hari ini" : dd(t.dl) === 1 ? "deadline besok" : "deadline " + fmt(t.dl);
  tasks.filter(t => t.st === "baru" && level(t) === "Tinggi").forEach(t => l.push({ id: "u" + t.id, icon: "al", tone: "danger", title: "Tugas mendesak", text: t.siswa + " · " + t.judul + " (" + rel(t) + ")", time: "Prioritas tinggi", go: "antrean" }));
  tasks.filter(t => t.st === "jadwal" && dd(t.slot.d) >= 0 && dd(t.slot.d) <= 1).sort((a, b) => when(a) - when(b)).forEach(t => l.push({ id: "j" + t.id + t.slot.d + t.slot.t, icon: "pin", tone: "brand", title: "Sesi " + dayLbl(t.slot.d).toLowerCase() + " pukul " + t.slot.t.replace(":", "."), text: t.siswa + " · " + t.judul + " · tatap muka", time: dayLbl(t.slot.d), go: "jadwal" }));
  return l;
}
UI.initNotif({ btn: "#bell", items: notifItems, onPick: it => show(it.go) });
$("#notifOpen").onclick = () => $("#bell").click();
$("#me").textContent = S.ini;

/* ---------- Beranda: hero ---------- */
function hero() {
  const baru = tasks.filter(t => t.st === "baru"), urgent = baru.filter(t => level(t) === "Tinggi").length;
  const hari = tasks.filter(t => t.st === "jadwal" && t.slot.d === add(0)).sort((a, b) => when(a) - when(b));
  const tuntas = Core.weekly(tasks);
  $("#hello").textContent = "Halo, " + S.name + "!";
  $("#helloSub").textContent = baru.length ? `Ada ${baru.length} tugas menunggu. Yang paling mendesak sudah diurutkan di bagian atas antrean.` : "Semua tugas sudah ditangani. Kerja bagus!";
  const box = (i, big, sm, r) => `<div class="stat"><span class="w-[42px] h-[42px] rounded-xl bg-white/15 grid place-items-center shrink-0">${ic(i, 20)}</span><div class="flex-1 min-w-0"><b class="block text-[22px] font-extrabold">${big}</b><span class="text-[13px] opacity-90">${sm}</span></div><em class="not-italic text-[11.5px] font-bold opacity-80">${r}</em></div>`;
  $("#stats").innerHTML =
    box("clip", baru.length + " Perlu ditangani", "Menunggu penjadwalan sesi", urgent ? urgent + " MENDESAK" : "AMAN") +
    box("pin", hari.length + " Sesi hari ini", hari.length ? "Sesi berikutnya pukul " + hari[0].slot.t.replace(":", ".") + " WIB" : "Tidak ada sesi hari ini", "HARI INI") +
    box("clock", Core.monthCount(tasks) + " Sesi bulan ini", fmt(Core.date(), { month: "long", year: "numeric" }), "BULAN INI") +
    box("ok", tuntas + " Tuntas", "Tugas selesai pekan ini", "PEKAN INI");
}

/* ---------- Beranda: AKP (rating) + ketersediaan + notifikasi ---------- */
function akp() {
  const r = Core.ratingStats(tasks, S.id);
  $("#akp").innerHTML =
    tile(r.sudah, "Sudah terisi", "bg-okbg text-okt") +
    tile(r.belum, "Belum terisi", "bg-warnbg text-warnt") +
    tile(r.total, "Total AKP", "bg-tagb text-brand") +
    tile(`<span class="text-[22px]" aria-hidden="true">★</span> ${r.avg.toFixed(2)}`, "Rata-rata rating", "bg-soft text-ink");
}
function beranda() {
  akp();
  const on = TIMES.filter(t => avail[t]).length;
  $("#availSum").innerHTML = tile(on, "Slot aktif", "bg-okbg text-okt") + tile(TIMES.length - on, "Slot ditutup", "bg-warnbg text-warnt") + tile(TIMES.length, "Total slot", "bg-tagb text-brand");
  const n = notifItems().length;
  $("#notifSub").textContent = n ? `Ada ${n} pengingat yang perlu kamu lihat.` : "Belum ada notifikasi baru untuk Anda.";
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
    <h3 class="text-[17px] font-extrabold">${esc(t.judul)}</h3>${attachment(t)}
    <div class="flex flex-wrap items-center gap-2 text-sm text-mute my-1.5"><span class="av !w-7 !h-7 !text-[11px] bg-brand">${ini(t.siswa)}</span><b class="text-ink">${esc(t.siswa)}</b> · ${esc(t.kelas)}${t.st === "jadwal" ? `<span class="tag">${ic("pin", 12)} ${dayLbl(t.slot.d)}, ${t.slot.t.replace(":", ".")} WIB</span>` : ""}</div>
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
  if (b.dataset.a === "wa") {
    const phone = Core.phone(state.prefs[t.studentId]?.wa || "");
    if (phone) window.open("https://wa.me/" + phone, "_blank", "noopener,noreferrer");
    else toast("Siswa belum menyimpan nomor WhatsApp yang valid.");
  }
};

/* ---------- Dialog kelola tugas ---------- */
$("#dTm").innerHTML = TIMES.map(t => `<option value="${t}">${t.replace(":", ".")} WIB</option>`).join("");
const toggleJ = () => $("#dJ").hidden = $("#dSt").value !== "jadwal";
$("#dSt").onchange = toggleJ;
function openDlg(t) {
  $("#dlg [data-dialog-status]")?.remove();
  editing = { ...t, revision: state.revision };
  $("#dT").textContent = t.judul; $("#dS").textContent = t.siswa + " · " + t.kelas + " · " + t.mapel + " · Kesulitan " + t.kes;
  $("#dK").textContent = t.kendala || "Siswa tidak menuliskan kendala."; $("#dSt").value = t.st;
  $("#dD").value = t.slot ? t.slot.d : add(1); $("#dD").min = add(0); $("#dTm").value = t.slot ? t.slot.t : TIMES.find(x => avail[x]) || TIMES[0];
  $("#dN").value = t.cat || ""; toggleJ(); $("#dlg").showModal();
}
$("#dX").onclick = () => $("#dlg").close();
$("#dOk").onclick = async () => {
  const t = editing, st = $("#dSt").value, cat = $("#dN").value.trim();
  if (!t || $("#dOk").disabled) return;
  if (st === "selesai") {
    if (!cat) return toast("Isi catatan pembahasan sebelum menandai selesai.");
    const yes = await UI.confirm({ title: "Tandai tugas selesai?", text: "Catatan akan terlihat di akun siswa. Tanggal penyelesaian dicatat hari ini.", icon: "ok", tone: "ok", ok: "Ya, selesai" });
    if (!yes) return;
  }
  $("#dOk").disabled = true;
  try {
    const current = Store.load();
    if (current.revision !== t.revision) throw Error("Data berubah di tab lain. Buka ulang tugas untuk meninjau perubahan.");
    await Store.manage(t.id, { st, cat, mentor: S.id, slot: { d: $("#dD").value, t: $("#dTm").value } }, t.revision);
    $("#dlg").close(); all(); toast("Perubahan tersimpan dan dapat dilihat siswa.");
  } catch (e) { toast(e.message); }
  finally { $("#dOk").disabled = false; }
};

/* ---------- Jadwal sesi: mode Jadwal ---------- */
const sesiRow = t => `<div class="row"><div class="flex items-center gap-3"><b class="w-14 text-brand">${t.slot.t.replace(":", ".")}</b><div><b>${esc(t.judul)}</b><div class="text-[13px] text-mute">${esc(t.siswa)} · ${esc(t.kelas)}</div></div></div><div class="flex gap-2"><button class="btn btn-sm" data-a="start" data-id="${t.id}">${ic("pin", 13)} Mulai sesi</button><button class="btn btn-soft btn-sm" data-a="open" data-id="${t.id}">Ubah</button></div></div>`;

function sesi() {
  const l = tasks.filter(t => t.st === "jadwal").sort((a, b) => when(a) - when(b)), g = {};
  l.forEach(t => (g[t.slot.d] = g[t.slot.d] || []).push(t));
  $("#sesi").innerHTML = l.length ? Object.keys(g).map(d => `<div class="mb-4"><h3 class="text-sm font-extrabold text-brand mb-1">${dayLbl(d)} <span class="text-mute font-semibold">· ${g[d].length} sesi</span></h3>` + g[d].map(sesiRow).join("") + `</div>`).join("")
    : `<div class="text-center text-mute py-6">Belum ada sesi terjadwal.</div>`;
  $("#avail").innerHTML = TIMES.map(t => `<div class="row"><span><b>${t.replace(":", ".")} WIB</b> <small class="text-mute">· 45 menit</small></span><span class="sw relative w-11 h-6 shrink-0"><input class="absolute inset-0 opacity-0 m-0 cursor-pointer" type="checkbox" data-slot="${t}" ${avail[t] ? "checked" : ""} aria-label="Slot ${t}"><span class="absolute inset-0 rounded-full bg-line pointer-events-none"></span></span></div>`).join("");
}

/* ---------- Jadwal sesi: mode Kalender ---------- */
function kal() {
  const by = {};
  tasks.filter(t => t.st === "jadwal").sort((a, b) => when(a) - when(b)).forEach(t => (by[t.slot.d] = by[t.slot.d] || []).push(t));
  const today = Core.date();
  $("#mLbl").textContent = fmt(ym + "-01", { month: "long", year: "numeric" });
  $("#calGrid").innerHTML = Core.monthGrid(ym).map(c => {
    const n = (by[c.d] || []).length, on = c.d === selDay;
    return `<button type="button" data-day="${c.d}" aria-pressed="${on}" aria-label="${fmt(c.d, { weekday: "long", day: "numeric", month: "long" })}, ${n} sesi" class="min-h-[64px] rounded-xl border p-1.5 flex flex-col items-center gap-1 ${on ? "border-brand bg-soft" : "border-line"} ${c.in ? "" : "opacity-40"}"><span class="grid place-items-center w-6 h-6 rounded-full text-[13px] font-bold ${c.d === today ? "bg-brand text-white" : ""}">${+c.d.slice(8)}</span>${n ? `<span class="tag !px-2 !py-0">${n}</span>` : ""}</button>`;
  }).join("");
  const sel = by[selDay] || [];
  $("#kalDetail").innerHTML = `<h3 class="text-sm font-extrabold text-brand mb-1">${dayLbl(selDay)} <span class="text-mute font-semibold">· ${sel.length} sesi</span></h3>` + (sel.length ? sel.map(sesiRow).join("") : `<div class="text-center text-mute py-4">Tidak ada sesi pada tanggal ini.</div>`);
}
function setView(v) {
  document.querySelectorAll("[data-view]").forEach(b => b.setAttribute("aria-pressed", b.dataset.view === v));
  $("#sesi").hidden = v !== "list"; $("#cal").hidden = v !== "cal";
}
document.querySelectorAll("[data-view]").forEach(b => b.onclick = () => setView(b.dataset.view));
$("#mPrev").onclick = () => { ym = Core.addMonth(ym, -1); kal(); };
$("#mNext").onclick = () => { ym = Core.addMonth(ym, 1); kal(); };
$("#calGrid").onclick = e => {
  const b = e.target.closest("[data-day]"); if (!b) return;
  selDay = b.dataset.day; ym = selDay.slice(0, 7); kal();
};

const sesiClick = e => {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const t = tasks.find(x => x.id == b.dataset.id);
  if (b.dataset.a === "open") openDlg(t); else toast("Sesi dengan " + t.siswa + " dimulai (tatap muka di " + LOKASI + ").");
};
$("#sesi").onclick = sesiClick; $("#kalDetail").onclick = sesiClick;
$("#avail").onchange = async e => {
  const t = e.target.dataset.slot; if (!t) return;
  try { await Store.update(s => { s.avail[S.id][t] = e.target.checked; }); all(); toast("Ketersediaan tersimpan. Sesi yang sudah dipesan tidak dibatalkan."); }
  catch (error) { e.target.checked = !e.target.checked; toast(error.message); }
};

/* ---------- Riwayat (dengan penilaian siswa) ---------- */
function hist() {
  const l = tasks.filter(t => t.st === "selesai").sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  $("#hist").innerHTML = l.length ? l.map(t => `<div class="card !mb-0"><div class="flex flex-wrap gap-2 mb-2"><span class="tag">${esc(t.mapel)}</span><span class="tag ${kcls(t.kes)}">${t.kes}</span></div>
    <h3 class="text-[17px] font-extrabold">${esc(t.judul)}</h3>${attachment(t)}<div class="text-[13px] text-mute mt-1 mb-2.5">${esc(t.siswa)} · ${esc(t.kelas)} · dibahas ${fmt(t.completedAt, { day: "numeric", month: "long" })}</div>
    <div class="cat"><b>Catatan pembahasan:</b> ${esc(t.cat || "-")}</div>
    ${t.rating ? `<div class="cat !mb-0"><b class="text-warnt" aria-label="${t.rating.stars} dari 5 bintang">${stars(t.rating.stars)}</b> ${t.rating.comment ? esc(t.rating.comment) : "<i>Tanpa komentar</i>"}</div>` : `<div class="text-[12.5px] text-mute">Siswa belum mengisi penilaian.</div>`}</div>`).join("") : `<div class="card text-center text-mute col-span-full">Belum ada riwayat.</div>`;
}

function all() {
  state = Store.load(); avail = state.avail[S.id];
  tasks = state.tasks.filter(t => t.st === "baru" || t.mentor === S.id);
  hero(); list(); sesi(); kal(); hist(); beranda(); UI.refreshNotif();
}
const lk = $("#lokasi"); if (lk) lk.textContent = LOKASI;
try { all(); initDashboard("mentor", all); } catch (error) { fatal(error); }
})();
