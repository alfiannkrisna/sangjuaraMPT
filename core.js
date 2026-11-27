/* Logika murni bersama; dapat diuji dengan Node tanpa DOM. */
const Core = (() => {
  const TIMES = ["15:30", "16:30", "19:00", "20:15"];
  const MAPEL = ["Matematika Minat", "Matematika Wajib", "Fisika", "Kimia", "Biologi", "Penalaran Umum", "Bahasa Inggris"];
  const KES = { Mudah: 1, Sedang: 2, Sulit: 3 };
  const LOKASI = "Ruang Coaching Clinic Sang Juara School";
  const M = [
    { id: "d", n: "Kak Dimas S.", u: "ITB", col: "#2326C9", ini: "DS" },
    { id: "s", n: "Kak Sarah N.", u: "UI", col: "#0F8B6D", ini: "SN" },
    { id: "f", n: "Kak Fajar R.", u: "UGM", col: "#B45309", ini: "FR" }
  ];
  function date(now = new Date()) {
    const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
    const v = k => p.find(x => x.type === k).value;
    return `${v("year")}-${v("month")}-${v("day")}`;
  }
  const validDate = s => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
  function add(n, from = date()) { const d = new Date(from + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  const dd = (s, from = date()) => Math.round((Date.parse(s) - Date.parse(from)) / 864e5);
  const fmt = (s, options = { day: "numeric", month: "short" }) => new Date(s + "T00:00:00+07:00").toLocaleDateString("id-ID", { ...options, timeZone: "Asia/Jakarta" });
  const dayLbl = s => dd(s) === 0 ? "Hari ini" : dd(s) === 1 ? "Besok" : fmt(s, { weekday: "long", day: "numeric", month: "short" });
  const when = t => new Date(`${t.slot.d}T${t.slot.t}:00+07:00`);
  function scheduleError(state, task, mentor, d, h, now = new Date()) {
    if (!task || task.st === "selesai") return "Tugas tidak tersedia untuk dijadwalkan.";
    if (!M.some(m => m.id === mentor)) return "Mentor tidak valid.";
    if (!validDate(d) || !TIMES.includes(h)) return "Pilih tanggal dan jam sesi yang valid.";
    if (d < date(now) || new Date(`${d}T${h}:00+07:00`) <= now) return "Tanggal atau jam sesi sudah lewat.";
    if (!state.avail[mentor]?.[h]) 
       "Slot mentor sedang dinonaktifkan.";
    if (state.tasks.some(x => x.id !== task.id && x.st === "jadwal" && x.slot.d === d && x.slot.t === h && (x.mentor === mentor || x.studentId === task.studentId))) return "Jadwal bentrok dengan sesi mentor atau siswa lain.";
    return "";
  }
  function fileError(f) {
    if (!f) return "";
    if (f.size <= 0 || f.size > 10 * 1024 * 1024) return "Ukuran berkas harus 1 byte hingga 10 MB.";
    const ext = f.name.split(".").pop().toLowerCase();
    const types = { pdf: "application/pdf", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png" };
    return !types[ext] || (f.type && f.type !== types[ext]) ? "Gunakan berkas PDF, JPG, atau PNG." : "";
  }
  function phone(s) {
    let n = String(s).replace(/[\s()+-]/g, "");
    if (n.startsWith("0")) n = "62" + n.slice(1);
    return /^62[1-9]\d{7,12}$/.test(n) ? n : "";
  }
  function weekly(tasks, offset = 0, now = new Date()) {
    const today = date(now), weekday = new Date(today).getUTCDay();
    const start = add(-((weekday + 6) % 7) + offset * 7, today), end = add(7, start);
    return tasks.filter(t => t.st === "selesai" && t.completedAt >= start && t.completedAt < end).length;
  }
    function ratingStats(tasks, mentor) {
    const done = tasks.filter(t => t.st === "selesai" && t.mentor === mentor);
    const rated = done.filter(t => t.rating);
    const sum = rated.reduce((a, t) => a + t.rating.stars, 0);
    return { sudah: rated.length, belum: done.length - rated.length, total: done.length, avg: rated.length ? sum / rated.length : 0 };
  }
  function monthCount(tasks, now = new Date()) {
    const ym = date(now).slice(0, 7);
    return tasks.filter(t => (t.st === "jadwal" && t.slot.d.startsWith(ym)) || (t.st === "selesai" && t.completedAt.startsWith(ym))).length;
  }
  /* Grid bulan Senin–Minggu. ym = "2026-11". */
  function monthGrid(ym) {
    const [y, m] = ym.split("-").map(Number), first = ym + "-01";
    const lead = (new Date(first + "T00:00:00Z").getUTCDay() + 6) % 7;
    const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return Array.from({ length: Math.ceil((lead + days) / 7) * 7 }, (_, i) => { const d = add(i - lead, first); return { d, in: d.startsWith(ym) }; });
  }
  const addMonth = (ym, n) => { const [y, m] = ym.split("-").map(Number); return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7); };
    return { TIMES, MAPEL, KES, LOKASI, M, date, validDate, add, dd, fmt, dayLbl, when, scheduleError, fileError, phone, weekly, ratingStats, monthCount, monthGrid, addMonth };
})();
if (typeof module !== "undefined") module.exports = Core;
