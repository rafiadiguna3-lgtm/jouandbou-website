# Panduan Pengelolaan dan Serah Terima

26 Oktober 2026 · pendamping [PRD](prd.md) dan [Panduan Fitur](perilaku-desain.md).

Panduan ini membantu tim berikutnya memperbarui, merilis, dan memulihkan website tanpa bergantung pada riwayat percakapan.

## Sistem yang digunakan

```text
GitHub → build → Cloudflare Pages → website, proyek, foto, metadata
Kode Worker → deployment terpisah ke jnb-favicon → favicon browser / Google
Search Console → indexing dan pencarian
WhatsApp → percakapan dengan studio
```

Konten diperbarui melalui file; belum ada database, admin konten, atau CRM khusus. Font dan layanan peta luar memerlukan internet. Cache foto tidak membuat seluruh website tersedia offline.

## Informasi proyek

| Bagian | Acuan |
| --- | --- |
| Repositori | `rafiadiguna3-lgtm/jouandbou-website` |
| Branch pengembangan | `migration/jou-and-bou` |
| `main` | Kode website versi lama, meskipun README sudah diperbarui |
| Project Pages | `jouandbou-test`, sesuai screenshot pemilik |
| Domain | `https://jouandbou.com`; `www` diarahkan ke domain utama |
| Worker | `jnb-favicon`; kode di `cloudflare/favicon-worker.mjs` |
| Route Worker | `jouandbou.com/favicon.ico` dan `www.jouandbou.com/favicon.ico` |
| Failure mode | `Fail open (proceed)`, dengan ICO putih statis sebagai cadangan |
| Build | `npm run build`, output `dist`, Node.js `24` |
| WhatsApp | `628118111439`; konfirmasikan perubahan kepada pemilik |

Periksa domain, branch, commit, dan deployment. Kata “test” pada nama project tidak menentukan apakah deployment tersebut benar atau salah.

## Status verifikasi

Tes lokal metadata, routing, aset, dan Worker sudah pernah dijalankan; hasilnya dicatat di `docs/migration-status.md`. Pemilik mengonfirmasi dua route terpasang dan ikon putih terlihat setelah perbaikan Worker. Aset PNG hitam/putih di Pages juga berhasil diakses dengan status 200.

Hal yang masih perlu bukti langsung: respons hitam untuk Google di production, branch/commit Pages yang aktif, aturan cache akun, dan hasil perangkat nyata. Lengkapi melalui dashboard/perangkat pada catatan rilis. Tes lokal tidak menggantikan verifikasi website aktif.

## Akses dan penanggung jawab

| Bagian | Tanggung jawab | Penanggung jawab |
| --- | --- | --- |
| Pemilik produk | Arah visual, copy utama, publikasi karya, prioritas | Belum dicatat |
| GitHub | Perubahan kode, review, pemulihan versi | Belum dicatat |
| Pages dan domain | Build, deployment, DNS, domain, rollback | Belum dicatat |
| Worker favicon | Kode, deployment, log, route | Belum dicatat |
| Search Console | Indexing, sitemap, pencarian | Belum dicatat |
| Konten dan kontak | Materi siap tayang dan penerimaan inquiry | Belum dicatat |

Satu orang dapat memegang beberapa peran. Serahkan akses melalui undangan akun, lalu pastikan penerima dapat menggunakannya. Simpan password, token, dan kode pemulihan di pengelola password, bukan di repo. Data calon klien juga tidak disimpan di sini.

## Memulai pekerjaan

1. Catat production branch dan commit aktif dari Cloudflare Pages.
2. Ambil kode yang sesuai; periksa perubahan yang belum disimpan.
3. Jalankan `npm ci` dan `npm run dev`, lalu periksa kondisi awal.
4. Cocokkan ruang lingkup perubahan dengan PRD.

Penggabungan kode atau pergantian branch deployment perlu ditinjau sebagai pekerjaan rilis. Pembaruan README saja tidak menjadi alasan untuk menggabungkan seluruh branch.

## Sumber perubahan

| Kebutuhan | File |
| --- | --- |
| HTML awal dan identitas homepage | `site/index.html` |
| Metadata dan routing proyek | `site/project-seo.mjs`, `site/project-routing.mjs` |
| Judul About/Contact/proyek | `site/about.mjs` |
| Pencarian | `site/project-search.mjs` |
| WhatsApp | `site/project-inquiry.mjs` |
| Katalog proyek publik | `scripts/build-project-catalog.mjs` → `site/project-catalog.mjs` |
| Materi Bou | `site/bou-projects.json` |
| Preview link | `scripts/build-project-previews.mjs` |
| Intro peta | `site/phone-map-guide.mjs`, `site/world-guide.css` |
| URL lama dan domain | `site/_redirects` |
| Favicon | `cloudflare/favicon-worker.mjs` |
| Foto | Folder proyek di `site/assets/` |

Cerita Jou di panel HTML dibaca pembuat katalog. Perbarui sumbernya, bukan hanya file hasil katalog. Metadata HTML, route, dan judul About juga perlu tetap selaras; jangan menambahkan pengganti metadata di Worker.

## Memperbarui konten

Untuk perubahan kecil, edit sumber, catat alasan di `docs/migration-status.md`, lalu:

```sh
npm run manifest:update
npm run build
```

Manifest mencatat asal dan pemeriksaan isi file. Perintah update hanya memperbarui file yang sudah terdaftar. Tambahkan file publik baru beserta asal dan hash-nya ke `docs/source-manifest.json`.

Untuk proyek publik, siapkan nama, foto, cerita, dan izin publikasi. Perbarui sumber Jou/Bou serta daftar di `scripts/build-project-catalog.mjs`, lalu:

```sh
npm run build:project-catalog
npm run build:project-previews
npm run manifest:update
npm run build
```

Pembuatan preview memerlukan Chromium. Deployment biasa memakai hasil yang sudah disimpan di GitHub.

Pertahankan URL yang sudah dibagikan. Jika alamat berubah, buat redirect ke karya yang sesuai. Untuk foto yang diganti pada alamat file yang sama, periksa cache di `site/photo-offline-sw.js`; ini terpisah dari Worker favicon Cloudflare.

## Pemeriksaan sebelum rilis

GitHub menjalankan **Website Checks** untuk perubahan kode pada branch pengembangan dan pull request terkait. Lihat [panduan workflow](workflows.md) untuk membaca hasil, laporan, dan menjalankan pemeriksaan manual. Status tes belum otomatis menahan deployment Cloudflare.

```sh
npm run build
npm test
node --test tests/favicon-worker.test.mjs
npx playwright test tests/browser/metadata.spec.mjs tests/browser/project-seo.spec.mjs
```

Untuk perubahan visual/interaksi, jalankan tes terkait dan periksa HP kecil, HP mendatar, serta desktop. Tes lengkap tersedia melalui `npm run test:browser`. Sebagian tes guide/device lama masih mengikuti perilaku terdahulu; catat penyebab kegagalan sebelum memperbarui tesnya.

- [ ] Homepage dan intro muncul tanpa kilatan teks lama.
- [ ] Pencarian Jou/Bou membuka karya yang sesuai.
- [ ] Alur rumah → 3D → detail → foto → WhatsApp bekerja.
- [ ] Nama dan link dalam pesan WhatsApp benar.
- [ ] About, Contact, Bou, tombol tutup, Back, dan Forward bekerja.
- [ ] URL proyek dapat dibuka langsung/reload; teks dan foto tersedia tanpa JavaScript.
- [ ] Judul kembali ke `jou and bou studio` saat masuk homepage.
- [ ] Tidak ada tombol tertutup, teks terpotong, atau halaman melebar di HP.

Simulasi layar HP belum menggantikan perangkat nyata. Periksa loading dan respons dengan HP asli serta koneksi seluler.

## Rilis website dan Worker

**Website / Pages:** push ke branch yang dituju, pastikan deployment sukses dan commit cocok. Gunakan `npm run build`, output `dist`, Node.js `24`. Periksa domain aktif: homepage, satu Jou, satu Bou, URL lama, foto, dan WhatsApp.

**Worker favicon:** buka `jnb-favicon` → Edit code, cocokkan dengan `cloudflare/favicon-worker.mjs`, lalu Deploy. Push repo tidak otomatis memperbarui Worker. Pertahankan dua route, Access OFF, dan jangan memaksa cache satu respons untuk semua pengunjung.

Browser menerima putih; User-Agent `Google Favicon` menerima hitam. Keduanya memakai `image/png` dan `Cache-Control: no-store`. Karena PNG tertanam dalam Worker, penggantian logo juga perlu memperbarui data gambar di kode Worker.

## Catatan rilis

| Data | Status / isian |
| --- | --- |
| Tanggal dan pelaksana | Belum dicatat |
| Production branch Pages | Verifikasi di dashboard |
| Commit website aktif | Verifikasi di deployment |
| Versi Worker | Verifikasi di dashboard Worker |
| Domain dan URL lama | Catat hasil pemeriksaan |
| Favicon browser / Google | Putih dilaporkan pemilik; versi Google perlu bukti |
| Perangkat dan browser nyata | Belum dicatat |
| Versi rollback | Pilih deployment sukses yang diketahui bekerja |

## Penanganan masalah

| Gejala | Pemeriksaan awal |
| --- | --- |
| Update GitHub belum tampil | Branch, commit, status deployment Pages |
| Favicon error 1101 | Worker → Observability → Logs; periksa exception. Fail open tidak menangani semua error kode |
| Ikon tab masih lama | Respons `/favicon.ico`, cache browser, URL ikon dalam HTML |
| Nama/logo Google masih lama | Respons crawler, metadata, redirect, tanggal crawl |
| Foto hilang dari URL proyek | Lokasi file, base URL, cache foto, hasil build |
| Peta gagal dimuat | Tampilan cadangan dan konten statis proyek |
| URL lama error | Aturan spesifik di `_redirects` dan deployment yang memuatnya |

Untuk menonaktifkan Worker sementara, lepas kedua route agar ICO putih statis digunakan. Ini pemulihan browser sementara, bukan perbaikan favicon Google.

Pulihkan website lewat rollback ke deployment Pages sukses sebelumnya. Pulihkan Worker secara terpisah. Catat versi dan masalah sebelum menyiapkan perbaikan; perubahan tampilan tidak memerlukan pergantian DNS atau force-push riwayat.

## Pemeliharaan rutin

| Waktu | Pekerjaan |
| --- | --- |
| Setiap rilis | Uji alur utama, cocokkan deployment, catat hasil |
| Proyek baru | Periksa konten, URL, preview, sitemap, WhatsApp |
| Bulanan | Tinjau Search Console/Cloudflare dan uji kembali di HP |
| Pergantian tim | Tinjau akses, pekerjaan tertunda, dan latihan serah terima |

Traffic Cloudflare tidak sama dengan jumlah calon klien; klik WhatsApp belum tentu pesan terkirim. Tentukan kebutuhan pengukuran sebelum menambah dashboard.

## Checklist serah terima

- [ ] Penerima memahami tujuan showcase dan prioritas PRD.
- [ ] Pemilik produk dan pelaksana teknis tercatat.
- [ ] Akses GitHub, Pages, Worker, domain, dan Search Console sudah dicoba.
- [ ] Branch/commit aktif serta versi rollback tercatat.
- [ ] Penerima dapat menjalankan website, mengubah satu teks, build, dan memeriksa hasil.
- [ ] Penerima memahami deployment Pages dan Worker yang terpisah.
- [ ] Penerima dapat membaca log error dan memulihkan versi.
- [ ] Konsep interior/dashboard dipahami sebagai rencana, bukan fitur aktif.
- [ ] Hal yang belum terverifikasi tercatat sebagai pekerjaan terbuka.

Lakukan satu update kecil bersama penerima sampai selesai. Serah terima mencakup praktik, bukan hanya pengiriman dokumen.

Perbarui [PRD](prd.md) saat tujuan berubah, [Panduan Fitur](perilaku-desain.md) saat interaksi berubah, dan panduan ini saat proses kerja berubah. Simpan riwayatnya di `migration-status.md`.

Referensi teknis: [SEO](project-seo.md), [favicon](favicon-behavior.md), [domain](www-domain.md), [Cloudflare](cloudflare-security.md). Dokumen lama perlu dibaca sesuai konteks tanggalnya; cocokkan dengan kode dan panduan aktif sebelum digunakan.
