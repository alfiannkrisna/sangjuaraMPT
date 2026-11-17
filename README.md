# Sang Juara School — Dashboard demo statis

HTML, vanilla JavaScript, Tailwind CSS 3.4.19. Tidak ada backend. **Autentikasi dan data lokal bukan keamanan produksi**: siapa pun dapat mengubah data/sesi melalui DevTools. Jangan gunakan kredensial atau data siswa sungguhan.


## Akun demo

| Role | Email | Kata sandi |
| --- | --- | --- |
| Siswa | siswa@sangjuara.id | siswa123 |
| Mentor | mentor@sangjuara.id | mentor123 |

Pada role mentor, pilih profil Dimas, Sarah, atau Fajar. Ketiganya memakai kredensial demo yang sama. Profil aktif mengelola antrean baru serta sesi/riwayat miliknya. Hanya UI mentor menyediakan penyelesaian tugas; catatan pembahasan wajib. Ini pembatasan alur demo, bukan otorisasi server.

Untuk mencoba dua role bersamaan, **hapus centang Ingat saya** pada kedua login dan buka tab baru langsung ke halaman login (bukan duplikasi tab). Sesi sessionStorage per tab; data tugas tetap bersama. Login membersihkan sesi lama pada kedua jenis storage. Logout/sesi role yang berubah dapat mengarahkan tab terkait ke login.

## Data dan aturan

- `sj-data-v1` di localStorage: skema versi 1, revision, tugas, metadata lampiran, ketersediaan mentor, preferensi siswa. Seed sekali saat key belum ada. Aplikasi lama tidak memiliki data tugas persisten sehingga tidak ada array lama yang perlu dimigrasikan. Versi asing/data rusak ditolak dan **tidak ditimpa**.
- Perubahan data disinkronkan melalui event `storage`. Web Locks menserialisasi perubahan antartab pada browser yang mendukung (localhost/HTTPS). Browser tanpa Web Locks memakai fallback baca–ubah–simpan; penulisan tepat bersamaan masih dapat saling menimpa. Dialog mentor menolak revision basi.
- Storage **hanya browser/profil/origin yang sama**. `localhost`, `127.0.0.1`, port 8000, dan port 8001 mempunyai data terpisah. Tidak ada sinkronisasi perangkat/cloud.
- Waktu memakai **Asia/Jakarta**. Deadline minimal hari ini; jadwal harus masa depan, slot aktif, tanpa bentrok siswa maupun mentor. Pilihan jam diskret, sesi 45 menit. Waktu divalidasi ulang saat menyimpan dan tampilan diperbarui tiap menit/fokus tab.
- Kembali ke antrean membersihkan slot dan tanggal selesai. Tanggal selesai terpisah dari tanggal sesi. Statistik pekanan Senin–Minggu berdasarkan tanggal penyelesaian. Target 18 soal adalah target demo, bukan hasil penilaian.
- Lampiran PDF/JPG/PNG maksimal 10 MB per berkas disimpan di IndexedDB `sj-files`, object store `files`. Dapat diunduh siswa dan mentor; berkas seed tidak tersedia karena seed tidak melampirkan berkas. Pemeriksaan tipe/ekstensi bukan antivirus.
- Kuota/storage yang diblokir menampilkan kesalahan; data rusak tidak di-reset otomatis. Data dapat hilang jika browser dibersihkan atau mode privat berakhir. Tidak tersedia backup otomatis.
- Tema, preferensi pengingat dan status baca notifikasi persisten. Demo **tidak mengirim WhatsApp otomatis**. Mentor hanya mendapat tautan `wa.me` jika siswa menyimpan nomor Indonesia valid. Kontak tutor jaga dan halaman kebijakan/bantuan belum dikonfigurasi dan dilabeli sebagai demo/segera hadir.

## Reset lokal

Cadangkan dulu nilai `sj-data-v1` melalui DevTools → Application/Storage jika diperlukan. Untuk reset total, hapus data situs pada origin yang digunakan (localStorage, sessionStorage, IndexedDB), lalu muat ulang. Ini menghapus seluruh tugas dan lampiran lokal secara permanen. Seed dibuat kembali. Jangan menghapus hanya metadata jika masih ingin mempertahankan akses lampiran.

## Pengujian

`npm test` memakai test runner bawaan Node: tanggal WIB, validasi deadline/jadwal, bentrok siswa/mentor, slot nonaktif, lampiran, nomor WhatsApp, statistik, persistensi store, transisi status, revision basi, data rusak/kuota, dan sesi/redirect whitelist.

Pemeriksaan browser headless saat implementasi mencakup login, unggah/unduh lampiran, refresh, sinkronisasi siswa–mentor antartab, penyelesaian bercatatan, ketersediaan slot, tema persisten, dan overflow layar 390 px. Runner browser bersifat pemeriksaan lingkungan, bukan dependensi aplikasi. Audit pembaca layar menyeluruh dan pengujian semua browser belum dilakukan.
