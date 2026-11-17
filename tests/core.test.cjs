const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
global.Core = require('../core.js');
const Store = require('../store.js');
const SJ = require('../auth.js');
function storage() {
  const map = new Map();
  return { getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: k => map.delete(k) };
}
beforeEach(() => { global.localStorage = storage(); global.sessionStorage = storage(); });
test('Tanggal WIB tetap benar saat UTC masih hari sebelumnya', () => {
  assert.equal(Core.date(new Date('2026-11-16T18:00Z')), '2026-11-17');
  assert.equal(Core.add(1, '2024-02-28'), '2024-02-29');
  assert.equal(Core.validDate('2026-02-30'), false);
  assert.equal(Core.validDate('2026-2-03'), false);
});
test('Jadwal lampau, jam tidak dikenal, slot nonaktif dan konflik siswa/mentor ditolak', () => {
  const s = Store.seed(), t = s.tasks[0], now = new Date('2026-11-17T12:00Z');
  assert.match(Core.scheduleError(s, t, 'd', '2026-11-17', '15:30', now), /lewat/);
  assert.match(Core.scheduleError(s, t, 'd', '2026-11-18', '17:00', now), /valid/);
  s.avail.d['15:30'] = false;
  assert.match(Core.scheduleError(s, t, 'd', '2026-11-18', '15:30', now), /nonaktif/);
  const other = s.tasks[1]; other.slot = { d: '2026-11-18', t: '16:30' };
  assert.match(Core.scheduleError(s, t, 's', '2026-11-18', '16:30', now), /bentrok/);
  other.studentId = 'other';
  assert.match(Core.scheduleError(s, t, 'd', '2026-11-18', '16:30', now), /bentrok/);
  assert.equal(Core.scheduleError(s, t, 's', '2026-11-18', '16:30', now), '');
});
test('Ukuran/tipe lampiran dan nomor WhatsApp divalidasi', () => {
  assert.equal(Core.fileError({ name: 'soal.pdf', type: 'application/pdf', size: 10 * 1024 * 1024 }), '');
  assert.ok(Core.fileError({ name: 'x.pdf', type: 'application/pdf', size: 10 * 1024 * 1024 + 1 }));
  assert.ok(Core.fileError({ name: 'x.png', type: 'text/html', size: 20 }));
  assert.ok(Core.fileError({ name: 'x.html', type: 'text/html', size: 20 }));
  assert.equal(Core.phone('0812 3456 7890'), '6281234567890');
  assert.equal(Core.phone('abc'), '');
});
test('Statistik dibatasi Senin–Minggu dan tanggal selesai, bukan tanggal sesi', () => {
  const tasks = ['2026-11-16', '2026-11-22', '2026-11-15', '2026-11-23'].map(completedAt => ({ st: 'selesai', completedAt }));
  assert.equal(Core.weekly(tasks, 0, new Date('2026-11-17T00:00Z')), 2);
  assert.equal(Core.weekly(tasks, -1, new Date('2026-11-17T00:00Z')), 1);
});
test('Store diinisialisasi sekali dan perubahan bertahan setelah load ulang', async () => {
  const s = Store.load();
  await Store.create({ studentId: 'siswa', siswa: 'Alfian K.', kelas: 'XII', judul: 'Baru', mapel: 'Fisika', kes: 'Sulit', dl: Core.add(2) });
  const next = Store.load(); assert.equal(next.tasks.length, s.tasks.length + 1);
  assert.equal(next.tasks[0].judul, 'Baru');
  await assert.rejects(Store.create({ judul: 'Lampau', dl: Core.add(-1) }), /Deadline/);
});
test('Penyelesaian wajib catatan, memakai hari ini; reset membersihkan slot', async () => {
  const t = Store.load().tasks[1];
  await assert.rejects(Store.manage(t.id, { st: 'selesai', cat: '' }), /wajib/);
  await Store.manage(t.id, { st: 'selesai', cat: 'Pembahasan', mentor: 'd' });
  assert.equal(Store.load().tasks[1].completedAt, Core.date());
  await Store.manage(t.id, { st: 'baru' });
  const reset = Store.load().tasks[1]; assert.equal(reset.slot, undefined); assert.equal(reset.completedAt, undefined);
});
test('Revalidasi booking dan revision mencegah perubahan basi', async () => {
  const s = Store.load(), t = s.tasks[0];
  await Store.update(x => { x.avail.d['15:30'] = false; });
  await assert.rejects(Store.manage(t.id, { st: 'jadwal', mentor: 'd', slot: { d: Core.add(2), t: '15:30' } }), /nonaktif/);
  await assert.rejects(Store.manage(t.id, { st: 'baru' }, s.revision), /berubah/);
});
test('Data rusak tidak ditimpa dan quota error dilaporkan', async () => {
  localStorage.setItem(Store.KEY, '{broken');
  assert.throws(() => Store.load(), /data lokal/); assert.equal(localStorage.getItem(Store.KEY), '{broken');
  localStorage.removeItem(Store.KEY); Store.load();
  localStorage.setItem = () => { throw Error('quota'); };
  await assert.rejects(Store.update(s => { s.tasks = []; }), /gagal disimpan/);
});
test('Sesi dibangun ulang dari role whitelist, bukan home dari storage', () => {
  localStorage.setItem('sj-session', JSON.stringify({ role: 'siswa', home: 'https://evil.test' }));
  assert.equal(SJ.get().home, 'index.html');
  localStorage.setItem('sj-session', JSON.stringify({ role: '__proto__' })); assert.equal(SJ.get(), null);
  assert.equal(SJ.login('siswa', ' Siswa@sangjuara.id ', 'siswa123', false).id, 'siswa');
  assert.equal(localStorage.getItem('sj-session'), null);
  assert.equal(SJ.login('mentor', 'mentor@sangjuara.id', 'wrong', true), null);
});
