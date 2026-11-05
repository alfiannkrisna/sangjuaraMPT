const $ = s => document.querySelector(s);
const ic = p => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const EYE = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>';
const EYE_OFF = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>';
const CHK = '<path d="M20 6L9 17l-5-5"/>';
document.querySelectorAll("[data-chk]").forEach(el => el.innerHTML = ic(CHK));
$("#eye").innerHTML = ic(EYE);

const existing = SJ.get();                       // sudah login? langsung ke dashboard
if (existing) location.replace(existing.home);

let role = "siswa";
function setRole(r) {
  role = r;
  document.querySelectorAll("[data-role]").forEach(b => b.setAttribute("aria-selected", b.dataset.role === r));
  $("#email").placeholder = r === "siswa" ? "siswa@sangjuara.id" : "mentor@sangjuara.id";
  $("#demoRole").textContent = r === "siswa" ? "Siswa" : "Mentor";
  $("#demoCred").textContent = SJ.users[r].email + " / " + SJ.users[r].pw;
  $("#err").hidden = true;
}
document.querySelectorAll("[data-role]").forEach(b => b.onclick = () => setRole(b.dataset.role));
setRole("siswa");

$("#eye").onclick = () => {
  const show = $("#pw").type === "password";
  $("#pw").type = show ? "text" : "password";
  $("#eye").innerHTML = ic(show ? EYE_OFF : EYE);
  $("#eye").setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
};
$("#fill").onclick = () => { $("#email").value = SJ.users[role].email; $("#pw").value = SJ.users[role].pw; $("#err").hidden = true; };
$("#forgot").onclick = () => { $("#err").hidden = true; $("#note").textContent = "Hubungi admin Sang Juara untuk mengatur ulang kata sandi."; $("#note").hidden = false; };

$("#f").onsubmit = e => {
  e.preventDefault();
  const email = $("#email").value, pw = $("#pw").value, err = $("#err");
  $("#note").hidden = true;
  if (!email.trim() || !pw) { err.textContent = "Isi email dan kata sandi dulu ya."; err.hidden = false; return; }
  const s = SJ.login(role, email, pw, $("#rem").checked);
  if (!s) { err.textContent = "Email atau kata sandi tidak cocok untuk akun " + (role === "siswa" ? "siswa" : "mentor") + "."; err.hidden = false; $("#pw").focus(); return; }
  location.replace(s.home);
};
