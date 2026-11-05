/* Autentikasi DEMO (sisi klien). Untuk produksi, ganti dengan login server + token (PBI-01). */
const SJ = {
  users: {
    siswa:  { email: "siswa@sangjuara.id",  pw: "siswa123",  name: "Alfian K.",     ini: "AK", home: "index.html"  },
    mentor: { email: "mentor@sangjuara.id", pw: "mentor123", name: "Kak Dimas S.", ini: "DS", home: "mentor.html" }
  },
  get() {
    for (const st of [localStorage, sessionStorage]) {
      try { const s = JSON.parse(st.getItem("sj-session") || "null"); if (s) return s; } catch (e) {}
    }
    return null;
  },
  set(s, remember) { try { (remember ? localStorage : sessionStorage).setItem("sj-session", JSON.stringify(s)); } catch (e) {} },
  login(role, email, pw, remember) {
    const u = this.users[role];
    if (!u || email.trim().toLowerCase() !== u.email || pw !== u.pw) return null;
    const s = { role, name: u.name, ini: u.ini, home: u.home };
    this.set(s, remember); return s;
  },
  require(role) {
    const s = this.get();
    if (!s || s.role !== role) { location.replace("login.html"); return null; }
    return s;
  },
  logout() {
    for (const st of [localStorage, sessionStorage]) { try { st.removeItem("sj-session"); } catch (e) {} }
    location.replace("login.html");
  }
};
