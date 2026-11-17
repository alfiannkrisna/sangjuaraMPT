/* Store demo bersama. Tidak menyediakan otorisasi atau sinkronisasi server. */
const Store = (() => {
  const KEY = "sj-data-v1";
  function seed() {
    const avail = Object.fromEntries(Core.M.map(m => [m.id, Object.fromEntries(Core.TIMES.map(t => [t, true]))]));
    return { version: 1, revision: 0, avail, prefs: {}, tasks: [
      { id: "sample-1", studentId: "siswa", siswa: "Alfian K.", kelas: "XII", judul: "Turunan Implisit No. 4b", mapel: "Matematika Minat", kes: "Sulit", dl: Core.add(2), kendala: "Macet di aturan rantai.", st: "baru", mentor: "d" },
      { id: "sample-2", studentId: "siswa", siswa: "Alfian K.", kelas: "XII", judul: "Stoikiometri", mapel: "Kimia", kes: "Sedang", dl: Core.add(4), kendala: "Menentukan pereaksi pembatas.", st: "jadwal", mentor: "d", slot: { d: Core.add(1), t: "16:30" } },
      { id: "sample-3", studentId: "siswa", siswa: "Alfian K.", kelas: "XII", judul: "Persamaan Kuadrat", mapel: "Matematika Wajib", kes: "Mudah", dl: Core.add(-2), st: "selesai", mentor: "d", completedAt: Core.add(-1), cat: "Dibahas pemfaktoran dan rumus abc." }
    ] };
  }
  function validate(s) {
    if (!s || s.version !== 1 || !Number.isInteger(s.revision) || !Array.isArray(s.tasks) || !s.avail || !s.prefs) throw Error("Data lokal rusak atau versinya tidak didukung. Ekspor/cadangkan storage sebelum reset; lihat README.");
    for (const m of Core.M) for (const h of Core.TIMES) if (typeof s.avail[m.id]?.[h] !== "boolean") throw Error("Data ketersediaan rusak.");
    const ids = new Set();
    for (const t of s.tasks) {
      if (!t || typeof t.id !== "string" || ids.has(t.id) || typeof t.studentId !== "string" || !t.studentId || typeof t.siswa !== "string" || typeof t.kelas !== "string" || typeof t.judul !== "string" || !Core.MAPEL.includes(t.mapel) || !Object.hasOwn(Core.KES, t.kes) || !Core.validDate(t.dl) || !["baru", "jadwal", "selesai"].includes(t.st) || !Core.M.some(m => m.id === t.mentor)) throw Error("Data tugas lokal tidak valid.");
      if (t.st === "jadwal" && (!Core.validDate(t.slot?.d) || !Core.TIMES.includes(t.slot?.t))) throw Error("Data jadwal lokal tidak valid.");
      if (t.st === "selesai" && (!Core.validDate(t.completedAt) || !t.cat?.trim())) throw Error("Data penyelesaian lokal tidak valid.");
      if (t.attachment && (typeof t.attachment.id !== "string" || typeof t.attachment.name !== "string" || !Number.isInteger(t.attachment.size) || t.attachment.size <= 0 || t.attachment.size > 10 * 1024 * 1024)) throw Error("Metadata lampiran tidak valid.");
      if (t.cat !== undefined && (typeof t.cat !== "string" || t.cat.length > 4000)) throw Error("Catatan maksimal 4000 karakter.");
      ids.add(t.id);
    }
    return s;
  }
  function load() {
    let raw;
    try { raw = localStorage.getItem(KEY); } catch { throw Error("Penyimpanan browser tidak tersedia. Izinkan storage untuk memakai demo."); }
    if (!raw) { const s = seed(); write(s); return s; }
    try { return validate(JSON.parse(raw)); } catch (e) { throw Error("Tidak dapat membaca data lokal: " + e.message); }
  }
  function write(s) {
    validate(s);
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { throw Error("Data gagal disimpan. Storage mungkin penuh atau diblokir; perubahan tidak diterapkan."); }
  }
  async function update(fn) {
    const commit = () => {
      const s = load(); fn(s); s.revision++; write(s); return s;
    };
    // Web Locks menserialisasi operasi antartab pada localhost/HTTPS.
    return globalThis.navigator?.locks ? navigator.locks.request("sj-store", commit) : commit();
  }
  async function create(data) {
    return update(s => {
      if (!data.judul?.trim() || data.judul.length > 200) throw Error("Judul wajib diisi, maksimal 200 karakter.");
      if (!Core.validDate(data.dl) || data.dl < Core.date()) throw Error("Deadline tidak boleh kosong atau lampau.");
      s.tasks.unshift({ ...data, id: crypto.randomUUID(), st: "baru", mentor: "d" });
    });
  }
  async function manage(id, changes, revision) {
    return update(s => {
      if (revision !== undefined && s.revision !== revision) throw Error("Data berubah di tab lain. Buka ulang tugas untuk meninjau perubahan.");
      const t = s.tasks.find(x => x.id === id);
      if (!t) throw Error("Tugas tidak ditemukan.");
      if (changes.st === "jadwal") {
        const err = Core.scheduleError(s, t, changes.mentor, changes.slot?.d, changes.slot?.t);
        if (err) throw Error(err);
        t.slot = changes.slot; t.mentor = changes.mentor;
      } else if (changes.st === "selesai") {
        if (t.st === "selesai") throw Error("Tugas sudah selesai.");
        if (!changes.cat?.trim()) throw Error("Catatan pembahasan wajib diisi.");
        t.completedAt = Core.date();
        if (changes.mentor && Core.M.some(m => m.id === changes.mentor)) t.mentor = changes.mentor;
      } else if (changes.st === "baru") { delete t.slot; delete t.completedAt; }
      else throw Error("Status tidak valid.");
      t.st = changes.st; t.cat = changes.cat?.trim() || "";
    });
  }
  function subscribe(fn) { addEventListener("storage", e => { if (e.key === KEY || e.key === null) fn(); }); }
  return { KEY, seed, validate, load, update, create, manage, subscribe };
})();
if (typeof module !== "undefined") module.exports = Store;
