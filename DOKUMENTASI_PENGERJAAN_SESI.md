# Dokumentasi Pengerjaan Sesi — Dashboard Sang Juara

Tanggal: 17 November 2026
Proyek: dashboard siswa dan mentor Sang Juara School
Teknologi: HTML, vanilla JavaScript, Tailwind CSS 3.4.19

## 1. Ringkasan pekerjaan saya

Pada sesi ini saya mengembangkan dashboard statis Sang Juara agar alur siswa dan mentor terhubung melalui penyimpanan browser, memperkuat validasi jadwal, menambahkan penyimpanan lampiran, memperjelas autentikasi demo, serta menyiapkan build CSS dan pengujian. Saya juga mengevaluasi kesesuaiannya dengan ringkasan desain Figma dan membahas cara menjalankan proyek setelah pull.

Aplikasi tetap berupa demo statis tanpa backend dan database server. Login bukan autentikasi produksi, dan data tidak tersinkron antarperangkat.

## 2. Pekerjaan yang diselesaikan

### A. Penyimpanan dan sinkronisasi data
- Menyatukan data tugas siswa dan mentor dalam shared store dengan key `sj-data-v1` di localStorage.
- Menambahkan validasi versi skema, revision, dan penanganan data rusak tanpa menimpa data secara otomatis.
- Menyinkronkan perubahan antartab menggunakan event `storage`.
- Menggunakan Web Locks jika tersedia untuk menserialisasi perubahan data.
- Mempertahankan tugas setelah halaman dimuat ulang.

### B. Alur tugas siswa dan pengelolaan mentor
- Menghubungkan unggah tugas, booking, antrean mentor, sesi terjadwal, dan riwayat melalui data yang sama.
- Mewajibkan catatan pembahasan saat mentor menyelesaikan tugas.
- Memisahkan tanggal penyelesaian (`completedAt`) dari tanggal sesi.
- Membersihkan jadwal dan informasi penyelesaian ketika tugas dikembalikan ke antrean.
- Menghitung statistik pekanan berdasarkan penyelesaian pada Senin–Minggu, bukan tanggal sesi.

### C. Validasi penjadwalan
- Menggunakan zona waktu `Asia/Jakarta`.
- Menolak deadline sebelum hari ini dan jadwal sesi yang sudah lewat.
- Menolak slot tidak aktif serta bentrok jadwal siswa atau mentor.
- Memvalidasi ulang booking saat disimpan, bukan hanya saat memilih jam.
- Menolak perubahan mentor berdasarkan revision data yang sudah basi.

### D. Lampiran tugas
- Mendukung PDF, JPG, dan PNG dengan batas 10 MB per berkas.
- Menyimpan blob lampiran di IndexedDB `sj-files`, dengan metadata di localStorage.
- Menyediakan akses unduh bagi siswa dan mentor.
- Menangani kesalahan penyimpanan dan keterbatasan kuota browser.

### E. Sesi demo dan keamanan alur
- Memperjelas bahwa login adalah autentikasi demo, bukan keamanan produksi.
- Menguatkan validasi sesi berdasarkan role whitelist dan tujuan redirect yang diizinkan.
- Mendukung pilihan profil mentor Dimas, Sarah, dan Fajar dengan kredensial mentor bersama.
- Mendokumentasikan cara mencoba siswa dan mentor di tab berbeda menggunakan sesi per tab.

### F. Tema, aksesibilitas, dan kejelasan antarmuka
- Menyimpan pilihan light/dark agar bertahan setelah refresh.
- Memperbaiki interaksi aksesibel, termasuk navigasi tab dengan keyboard.
- Menyimpan preferensi pengingat dan status baca notifikasi.
- Memperjelas fitur demo yang belum dikonfigurasi, seperti kontak tutor jaga.
- Tidak mengklaim pengiriman WhatsApp otomatis; tautan WhatsApp mentor hanya tersedia jika nomor siswa valid.

### G. Build, pengujian, dan dokumentasi
- Mengganti pemuatan Tailwind CDN dengan build Tailwind CLI.
- Menambahkan konfigurasi npm, lockfile, konfigurasi Tailwind, stylesheet sumber dan hasil build.
- Menambahkan sembilan unit test menggunakan test runner bawaan Node.js.
- Menulis README berisi cara menjalankan, akun demo, aturan data, keterbatasan, dan reset lokal.

## 3. Evaluasi desain Figma

Sumber evaluasi: PDF `Ringkasan-Figma-SangJuara-Dashboard.pdf` dari pengguna. Akses langsung Figma sebelumnya hanya menampilkan halaman generik, sehingga evaluasi tidak mengklaim pemeriksaan frame langsung atau kesamaan pixel-perfect.

### Bagian yang searah dengan desain
- Identitas visual Plus Jakarta Sans, warna indigo/kuning/hijau, kartu membulat, dan tombol pil.
- Header, hero, navigasi Tugas/Jadwal/Riwayat, serta tema light/dark.
- Form tugas, status tugas, empat langkah booking, popup konfirmasi, dan panel jadwal.
- Layout responsif desktop dan mobile.

### Selisih yang dicatat, belum dikerjakan
- Desain FIX memuat 12 mentor; aplikasi menggunakan 3 profil demo.
- Navigasi minggu dengan panah belum tersedia.
- Grid riwayat, pencarian riwayat, pagination, dan beberapa chip kendala belum sama dengan FIX.
- Rekaman sesi dan PDF pembahasan khusus mentor belum tersedia.
- Dropzone drag-and-drop belum ditangani.
- PDF menyebut batas unggahan 15 MB, sedangkan keputusan implementasi tetap 10 MB.
- Desain menyebut Google Meet pada popup, sementara implementasi menggunakan sesi tatap muka.
- Status “Paham 100%” tidak diberikan otomatis hanya karena tugas selesai.

Keputusan akhir: mempertahankan implementasi saat ini. Penyelarasan detail Figma menjadi catatan pengembangan berikutnya, bukan pekerjaan yang sudah selesai.

## 4. Berkas yang terlibat

| Kelompok | Berkas |
| --- | --- |
| Logika inti dan data | `core.js`, `store.js`, `attachments.js` |
| Sesi dan utilitas bersama | `auth.js`, `common.js`, `theme.js`, `ui.js` |
| Logika halaman | `app.js`, `mentor.js`, `login.js` |
| Halaman | `index.html`, `mentor.html`, `login.html` |
| Build | `package.json`, `package-lock.json`, `tailwind.config.js`, `styles.css`, `dist/styles.css`, `.gitignore` |
| Pengujian dan panduan | `tests/core.test.cjs`, `README.md` |

Nama berkas pada tabel relatif terhadap root proyek. Lokasi workspace sesi ini: `/run/media/alfan_ghofari/Data/BARU/KULIAH/7/MPT/dasbor_MPT`.

## 5. Verifikasi

### Dijalankan ulang saat penyusunan dokumentasi
- `npm test`: 9 test lulus, 0 gagal.
- `npm run build`: berhasil menghasilkan CSS.
- `git diff --check`: berhasil tanpa temuan whitespace.
- Build menampilkan peringatan database Browserslist/caniuse-lite kedaluwarsa; peringatan ini tidak menggagalkan build.

### Tercatat pada laporan pengerjaan sebelumnya
Pemeriksaan syntax JavaScript dan browser Chromium mencakup login, persistensi, sinkronisasi antartab, unggah/unduh lampiran, pengaturan slot, booking, tema, navigasi keyboard, dan overflow mobile. Pemeriksaan browser tersebut tidak dijalankan ulang saat penulisan dokumen ini. Audit pembaca layar menyeluruh dan pengujian semua browser belum dilakukan.

## 6. Cara menjalankan setelah clone/pull

Buka terminal pada folder proyek, lalu jalankan:

```sh
npm ci
npm run build
npm test
python3 -m http.server 8001 --bind 127.0.0.1
```

Buka `http://localhost:8001/login.html`. Di Windows, server dapat dijalankan dengan `py -m http.server 8001 --bind 127.0.0.1`. Alternatifnya gunakan ekstensi Live Server di VS Code.

Untuk sekadar membuka demo, npm tidak wajib jika `dist/styles.css` sudah ikut repository. Setelah mengubah kelas/style, bangun ulang CSS. Node 22 digunakan pada pengujian proyek.

| Peran | Email | Kata sandi |
| --- | --- | --- |
| Siswa | siswa@sangjuara.id | siswa123 |
| Mentor | mentor@sangjuara.id | mentor123 |

Gunakan alamat dan port yang sama secara konsisten. Origin berbeda mempunyai penyimpanan terpisah.

## 7. Batasan dan status akhir

- Data hanya dibagikan dalam browser/profil/origin yang sama, bukan antarperangkat atau antarteman.
- localStorage dan IndexedDB bukan pengganti backend, otorisasi, atau backup.
- Data dapat hilang jika penyimpanan situs dibersihkan; jangan gunakan data pribadi siswa sungguhan.
- Browser tanpa Web Locks masih berisiko kehilangan salah satu penulisan yang terjadi tepat bersamaan.
- Validasi tipe lampiran bukan pemindaian antivirus.
- Tidak ada pengiriman WhatsApp otomatis atau penyimpanan cloud.
- Saat diperiksa, perubahan implementasi masih berada di working tree dan belum di-commit/push. Teman baru memperoleh versi ini setelah perubahan terkait dimasukkan ke Git dan di-push.
- Tidak dilakukan commit atau push dalam penyusunan dokumentasi ini.

## 8. Kesimpulan

Hasil sesi ini adalah demo dashboard siswa–mentor yang lebih terhubung, persisten, tervalidasi, dan terdokumentasi. Fokus pengerjaan adalah fungsi inti dan keandalan demo statis; kesamaan visual penuh dengan Figma dan layanan produksi belum menjadi hasil akhir sesi.
