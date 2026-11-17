/* Autentikasi DEMO (sisi klien). Untuk produksi, ganti dengan login server + token (PBI-01). */
const SJ = {
  users: {
    siswa:  { email: "siswa@sangjuara.id",  pw: "siswa123",  name: "Alfian K.",     ini: "AK", home: "index.html"  },
    mentor: { email: "mentor@sangjuara.id", pw: "mentor123", name: "Kak Dimas S.", ini: "DS", home: "mentor.html" }
  },
  session(role, id = "d") {
    const u = Object.hasOwn(this.users, role) ? this.users[role] : null;
    if (!u) return null;
    const m = role === "mentor" ? Core.M.find(x => x.id === id) : null;
    if (role === "mentor" && !m) return null;
    return { role, id: m ? m.id : "siswa", name: m ? m.n : u.name, ini: m ? m.ini : u.ini, home: u.home };
  },
  get() {
    for (const key of ["sessionStorage", "localStorage"]) {
      try {
        const s = JSON.parse(globalThis[key].getItem("sj-session") || "null");
        if (s && typeof s.role === "string" && this.session(s.role, s.id)) return this.session(s.role, s.id);
      } catch {}
    }
    return null;
  },
  clear() { for (const key of ["localStorage", "sessionStorage"]) globalThis[key].removeItem("sj-session"); },
  login(role, email, pw, remember, id = "d") {
    const s = this.session(role, id), u = s && this.users[role];
    if (!u || email.trim().toLowerCase() !== u.email || pw !== u.pw) return null;
    try {
      this.clear(); globalThis[remember ? "localStorage" : "sessionStorage"].setItem("sj-session", JSON.stringify({ role, id: s.id }));
    } catch { throw Error("Sesi tidak dapat disimpan. Izinkan storage browser."); }
    return s;
  },
  require(role) {
    const s = this.get();
    if (!s || s.role !== role) { location.replace("login.html"); return null; }
    return s;
  },
  logout() {
    try { this.clear(); location.replace("login.html"); }
    catch { throw Error("Sesi gagal dihapus. Hapus data situs melalui pengaturan browser."); }
  }
};
if (typeof module !== "undefined") module.exports = SJ;
