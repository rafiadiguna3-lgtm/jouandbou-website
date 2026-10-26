# Panduan operasional dan handover

Untuk tim yang melanjutkan website · diperbarui 26 Oktober 2026.

Baca [PRD](prd.md) untuk tujuan dan [panduan perilaku](perilaku-desain.md) sebelum mengubah fitur. Dokumen ini menjelaskan cara bekerja dan apa yang perlu diserahkan.

## 1. Peta sistem

```text
Kode website di GitHub
        ↓ build
Cloudflare Pages → jouandbou.com → peta, proyek, foto, metadata

Kode Worker favicon → dipasang terpisah ke jnb-favicon
        ↓ dua route /favicon.ico
Ikon putih untuk browser / hitam untuk crawler yang dikenali

Google Search Console → memeriksa indexing dan pencarian
WhatsApp → percakapan dengan studio
```

Tidak ada database, panel admin konten, atau CRM khusus. Konten diubah lewat file di GitHub. Font dan layanan peta luar tetap membutuhkan koneksi. Penyimpanan foto di browser tidak membuat seluruh website bisa dipakai offline.

## 2. Yang diketahui dan yang perlu dicatat

| Bagian | Catatan saat ini |
| --- | --- |
| Repositori | `rafiadiguna3-lgtm/jouandbou-website` |
| Branch pengembangan | `migration/jou-and-bou` |
| Branch `main` | Kode website lebih lama; hanya beberapa pembaruan dokumentasi yang masuk |
| Cloudflare Pages | Nama proyek yang terlihat di screenshot pemilik: `jouandbou-test` |
| Website | `https://jouandbou.com`, dengan `www` diarahkan ke domain utama |
| Worker | `jnb-favicon`; kode di `cloudflare/favicon-worker.mjs` |
| Route Worker | `jouandbou.com/favicon.ico` dan `www.jouandbou.com/favicon.ico` |
| Mode kegagalan route | `Fail open (proceed)`; ada ICO putih statis sebagai cadangan |
| Build | `npm run build`, folder hasil `dist`, Node.js `24` |
| Nomor WhatsApp di kode | `628118111439`; konfirmasi pemilik jika hendak diganti |

Nama project yang mengandung “test” tidak membuktikan bahwa domain production salah. Cocokkan domain, deployment, dan commit, bukan menilai dari namanya.

### Bukti terakhir, bukan asumsi

- Kode lokal pernah diperiksa dengan tes metadata, routing, aset, dan Worker. Riwayat hasil ada di `docs/migration-status.md`.
- Pemilik menyatakan kedua route Worker terpasang dan sudah melihat ikon putih pada endpoint setelah perbaikan.
- File PNG hitam dan putih di project Pages berhasil diakses saat pemeriksaan.
- Respons hitam pada endpoint production dengan User-Agent Google belum diverifikasi langsung dari lingkungan pengembangan ini.
- Branch production Pages, commit deployment aktif, pengaturan cache akun, dan pengujian perangkat nyata perlu dicatat langsung dari dashboard/perangkat. Jangan menyimpulkan semuanya benar hanya karena tes lokal lolos.

## 3. Akses yang diserahkan

Isi kolom penanggung jawab sebelum handover selesai. Jangan menaruh password, token, kode pemulihan, atau data calon klien di repositori.

| Akses / tanggung jawab | Yang harus dapat dilakukan | Penanggung jawab |
| --- | --- | --- |
| Pemilik produk | Menyetujui arah visual, copy utama, publikasi karya, dan prioritas | Belum dicatat |
| GitHub | Membaca kode, membuat perubahan, meninjau, dan mengembalikan versi | Belum dicatat |
| Cloudflare Pages dan domain | Melihat build, deployment, domain, DNS, dan rollback | Belum dicatat |
| Worker favicon | Mengedit, deploy, memeriksa log dan kedua route | Belum dicatat |
| Search Console | Memeriksa indexing, sitemap, dan performa pencarian | Belum dicatat |
| Konten dan kontak | Menyediakan foto/cerita yang boleh dipublikasikan dan menerima inquiry | Belum dicatat |

Satu orang boleh memegang beberapa peran, tetapi penerimanya harus tahu siapa yang memutuskan dan siapa yang memperbaiki gangguan. Serahkan akses lewat undangan akun; gunakan pengelola password untuk informasi rahasia.

## 4. Sebelum mulai mengerjakan

1. Buka proyek Pages di Cloudflare. Catat domain, production branch, dan commit deployment aktif pada tabel rilis di bawah.
2. Di komputer, ambil kode branch yang sesuai. Pastikan tidak ada perubahan milik orang lain yang belum disimpan.
3. Jalankan `npm ci`, lalu `npm run dev`. Periksa tampilan sebelum mengedit.
4. Baca batas perubahan di PRD. Jika permintaan tidak jelas, tulis hasil yang diharapkan sebelum mengubah visual.

Jangan menggabungkan semua perubahan branch ke `main` hanya untuk menyamakan README. Pemindahan branch deployment atau penggabungan kode adalah pekerjaan rilis tersendiri yang harus ditinjau.

## 5. File sumber yang perlu dikenal

| Yang ingin diubah | Mulai dari |
| --- | --- |
| HTML awal dan identitas homepage | `site/index.html` |
| Metadata dan struktur informasi proyek | `site/project-seo.mjs`, `site/project-routing.mjs` |
| Judul saat About/Contact/proyek dibuka | `site/about.mjs`; harus tetap selaras dengan metadata |
| Pencarian | `site/project-search.mjs` |
| WhatsApp | `site/project-inquiry.mjs` |
| Daftar proyek publik | `scripts/build-project-catalog.mjs` → `site/project-catalog.mjs` |
| Materi Bou | `site/bou-projects.json` |
| Gambar preview link | `scripts/build-project-previews.mjs` |
| Intro peta | `site/phone-map-guide.mjs`, `site/world-guide.css` |
| URL lama dan domain | `site/_redirects` |
| Pilihan warna favicon | `cloudflare/favicon-worker.mjs` |
| Foto | Folder proyek di `site/assets/` |

Sebagian teks cerita Jou masih berada di panel HTML `site/index.html` dan dibaca pembuat katalog. Jangan hanya mengubah file hasil katalog lalu lupa sumbernya.

Metadata belum seluruhnya berasal dari satu file: HTML awal, pengelola route, dan pengelola judul About perlu tetap selaras. Ini pekerjaan pemeliharaan yang diketahui, bukan alasan untuk menambahkan pengganti metadata baru di Worker.

## 6. Update konten dan proyek

### Perubahan kecil pada kode/teks

Edit sumber, catat alasannya di `docs/migration-status.md`, lalu:

```sh
npm run manifest:update
npm run build
```

Manifest adalah daftar file beserta pemeriksaan isinya. Jika menambah file publik baru, daftarkan juga asal dan hash-nya di `docs/source-manifest.json`; perintah update hanya memperbarui file yang sudah tercatat.

### Perubahan daftar atau cerita proyek publik

1. Siapkan nama, foto, cerita, dan izin publikasi dari studio.
2. Perbarui sumber cerita, daftar yang ditinjau di `scripts/build-project-catalog.mjs`, atau materi Bou sesuai jenis karya.
3. Jalankan:

```sh
npm run build:project-catalog
npm run build:project-previews
npm run manifest:update
npm run build
```

Pembuatan preview membutuhkan Chromium. Deploy biasa memakai hasil katalog/preview yang sudah disimpan di GitHub dan tidak perlu menjalankan browser.

Pertahankan URL proyek yang sudah dibagikan. Jika harus mengganti alamat, tambahkan redirect yang menunjuk ke proyek setara. Jangan mengarahkan seluruh link error ke homepage.

Jika mengganti foto pada alamat file yang sama, periksa cache foto dan versinya di `site/photo-offline-sw.js`. Worker ini berbeda dari Worker favicon Cloudflare.

## 7. Pemeriksaan sebelum rilis

Jalankan dari folder proyek:

```sh
npm run build
npm test
node --test tests/favicon-worker.test.mjs
npx playwright test tests/browser/metadata.spec.mjs tests/browser/project-seo.spec.mjs
```

Untuk perubahan interaksi/tampilan, jalankan juga tes browser yang berkaitan dan periksa langsung pada HP kecil, HP mendatar, serta desktop. Tes penuh tersedia lewat `npm run test:browser`; sebagian tes panduan/device lama masih mencerminkan perilaku terdahulu. Catat hasil dan alasan kegagalan, jangan menyembunyikannya atau mengubah tes sekadar agar hijau.

Periksa alur berikut pada hasil build:

- [ ] Homepage dan intro muncul; tidak ada teks lama berkedip.
- [ ] Search Jou/Bou membuka karya yang benar.
- [ ] Pilih rumah → Explore 3D → detail → foto → WhatsApp bekerja.
- [ ] Pesan WhatsApp berisi nama/link yang sesuai.
- [ ] About, Contact, Bou Works, tombol tutup, Back, dan Forward bekerja.
- [ ] URL proyek bisa dibuka langsung dan di-reload; teks/foto tersedia tanpa JavaScript.
- [ ] Judul homepage tetap `jou and bou studio` setelah kembali dari proyek.
- [ ] Tidak ada tombol tertutup, teks terpotong, atau halaman melebar di HP.

Tes di komputer dengan ukuran layar HP adalah simulasi, bukan Safari/iPhone asli. Gunakan perangkat nyata dan koneksi seluler untuk pemeriksaan kenyamanan/loading.

## 8. Memasang perubahan

### Website / Pages

1. Simpan perubahan dan hasil tes di GitHub pada branch yang dituju.
2. Buka deployment Pages yang sesuai. Pastikan status sukses dan commit cocok; cek juga build command `npm run build`, output `dist`, Node.js `24`.
3. Periksa domain aktif, homepage, satu proyek Jou, satu Bou, URL lama, foto, dan WhatsApp.
4. Catat bukti rilis. Jika tes lokal lolos tetapi deployment gagal, pekerjaan belum selesai.

### Worker favicon

1. Buka `jnb-favicon` → Edit code.
2. Cocokkan dengan `cloudflare/favicon-worker.mjs`, lalu Deploy. Push repo tidak otomatis memperbarui Worker ini.
3. Pertahankan dua route persis di bagian 2 dan Access tetap OFF.
4. Periksa `/favicon.ico`: browser biasa putih, User-Agent `Google Favicon` hitam; keduanya `image/png` dengan `Cache-Control: no-store`.
5. Jangan tambahkan aturan cache akun yang memaksa menyimpan satu respons untuk semua pengunjung.

Worker menyimpan kedua gambar di kode. Jika aset logo berubah, PNG tertanam juga perlu diperbarui dan dites; mengganti file di Pages saja tidak mengubah gambar di Worker.

### Catatan rilis yang wajib diisi

| Data | Isi saat handover / rilis berikutnya |
| --- | --- |
| Tanggal dan pelaksana | Belum dicatat |
| Production branch Pages | Verifikasi dari dashboard |
| Commit website yang aktif | Verifikasi dari deployment |
| Versi deployment Worker | Verifikasi dari dashboard Worker |
| Hasil cek domain dan URL lama | Belum dicatat |
| Hasil favicon browser / Google | Browser putih dilaporkan pemilik; versi Google perlu bukti |
| Perangkat nyata yang diperiksa | Belum dicatat |
| Versi yang dapat dipakai rollback | Tentukan dari deployment sukses terakhir |

## 9. Jika ada masalah

| Gejala | Periksa dulu |
| --- | --- |
| Perubahan GitHub tidak muncul | Branch, commit, dan status deployment Pages |
| Error 1101 pada favicon | Worker → Observability → Logs; ambil pesan exception. Fail open bukan jaminan menangani semua error kode |
| Tab menampilkan ikon lama | Respons `/favicon.ico`, cache browser, dan apakah HTML masih menunjuk ikon lama |
| Google masih menampilkan nama/logo lama | Respons crawler, metadata, redirect, dan tanggal crawl Search Console; bukan hanya hasil browser biasa |
| Foto hilang setelah masuk dari URL proyek | Letak file, base URL, cache foto, dan hasil build |
| Peta gagal tetapi detail perlu dibaca | Pastikan fallback aplikasi dan halaman proyek statis bekerja |
| Link lama menghasilkan error | Aturan URL spesifik di `_redirects` dan deployment yang memuat aturan itu |

Jika Worker perlu dinonaktifkan sementara, lepas kedua route agar permintaan memakai ICO putih statis. Ini pemulihan sementara untuk browser, bukan perbaikan hasil favicon Google.

Untuk mengembalikan website, pilih deployment Pages sukses sebelumnya yang sudah diketahui bekerja, lalu rollback dari dashboard. Untuk Worker, pulihkan versi Worker yang bekerja secara terpisah. Setelah pulih, catat versi dan masalahnya; perbaiki kode sebelum rilis ulang. Jangan mengubah DNS atau force-push riwayat hanya untuk membatalkan satu perubahan tampilan.

## 10. Rutinitas yang cukup

| Kapan | Yang dilakukan |
| --- | --- |
| Setiap rilis | Checklist alur utama, cocokkan deployment, dan catat hasil |
| Setiap proyek baru | Cek konten, URL, preview, sitemap, dan WhatsApp |
| Sebulan sekali | Periksa error dan pencarian di Search Console, traffic/gangguan Cloudflare, serta coba ulang alur di HP |
| Saat tim berganti | Tinjau akses, panduan, keputusan tertunda, dan latihan handover |

Bedakan request, pengunjung, crawler, dan calon klien. Traffic Cloudflare bukan jumlah inquiry. Klik WhatsApp juga belum tentu pesan terkirim. Jangan membuat dashboard baru sebelum pertanyaan bisnis dan kebutuhan datanya jelas.

## 11. Syarat handover selesai

- [ ] Penerima memahami tujuan showcase dan prioritas PRD.
- [ ] Pemilik produk dan pelaksana teknis sudah tercatat.
- [ ] Akses GitHub, Pages, Worker, domain, dan Search Console sudah dicoba.
- [ ] Branch/commit aktif dan versi rollback sudah dicatat.
- [ ] Penerima dapat menjalankan website, mengubah satu teks, build, dan memeriksa hasilnya.
- [ ] Penerima memahami perbedaan rilis Pages dan Worker.
- [ ] Penerima dapat menemukan log error dan tahu cara memulihkan versi sebelumnya.
- [ ] Konsep interior, dashboard, dan pekerjaan tertunda dipahami sebagai rencana, bukan fitur yang harus sudah berfungsi.
- [ ] Bukti perangkat/URL/favicon yang belum ada sudah tercatat sebagai pekerjaan terbuka.

Dokumen boleh diserahkan sekarang. Serah terima operasional baru selesai setelah checklist ini dipraktikkan, bukan hanya dibaca.

## 12. Menjaga dokumen tetap berguna

Setelah mengubah arah produk, perbarui PRD. Setelah mengubah interaksi, perbarui panduan perilaku. Setelah mengubah proses deploy/akses, perbarui panduan ini. Hasil rilis dan keputusan historis masuk ke `migration-status.md`.

Catatan teknis lanjutan: [SEO proyek](project-seo.md), [favicon](favicon-behavior.md), [domain](www-domain.md), [keamanan Cloudflare](cloudflare-security.md). Dokumen lama dapat memuat keadaan saat ditulis; jika bertentangan, periksa kode dan tiga panduan utama ini sebelum bertindak.
