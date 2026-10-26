# SEO dan Link Proyek

26 Oktober 2026 · panduan untuk versi website saat ini.

Tujuannya agar pengunjung dari Google atau link yang dibagikan tiba di karya yang tepat, dengan judul, deskripsi, dan gambar preview yang sesuai.

## Cakupan

Ada **8 proyek Jou dan 7 konsep Bou** dengan URL publik, tercatat di `site/project-catalog.mjs`. Model dengan cerita yang belum siap tetap dapat diakses sesuai perilaku peta, tetapi tidak otomatis masuk katalog publik atau sitemap—daftar alamat untuk mesin pencari.

## Struktur URL

- Homepage/peta: `https://jouandbou.com/#projects`.
- Jou: `/projects/nama-proyek/`.
- Bou: `/projects/bou/nama-proyek/`.
- `/projects/` dan `/jou-works/` diarahkan ke peta, bukan halaman index tambahan.
- URL lama yang dikenal diarahkan ke karya yang sesuai melalui `site/_redirects`.

Pertahankan URL yang sudah dibagikan saat judul karya berubah. Jika alamat harus diganti, tambahkan pengalihan ke tujuan yang benar.

## Isi setiap halaman proyek

| Bagian | Fungsi |
| --- | --- |
| Judul dan deskripsi | Menjelaskan karya |
| Canonical | Menandai alamat utama halaman |
| Open Graph dan Twitter image | Menentukan teks dan gambar preview link |
| Data terstruktur | Membantu mesin pencari memahami karya, studio, dan susunan halaman |
| Teks dan foto di HTML | Menjaga konten terbaca tanpa JavaScript |

Build menghasilkan HTML setiap proyek publik. Setelah aplikasi siap, pengunjung memakai detail yang sama seperti dari peta; konten cadangan disembunyikan agar tidak muncul ganda.

Nama situs dan judul homepage: **`jou and bou studio`**. Judul proyek tetap spesifik, misalnya `Rumah Anas | Jou and Bou`. Favicon diatur melalui [Worker](favicon-behavior.md), tanpa menambahkan pengganti metadata di sana.

## Memperbarui proyek

1. Edit sumber cerita dan foto. Cerita Jou berada di panel HTML, materi Bou di `site/bou-projects.json`.
2. Jika daftar, nama, atau deskripsi publik berubah, perbarui `scripts/build-project-catalog.mjs`.
3. Jalankan:

```sh
npm run build:project-catalog
npm run build:project-previews
npm run manifest:update
npm run build
```

Preview menggunakan aset proyek yang tersedia, dalam JPEG 1200 × 630. Pembuatannya memerlukan Chromium. Deployment biasa memakai hasil yang sudah disimpan di repo.

Daftarkan aset baru dalam manifest sumber. Detailnya ada di [Panduan Pengelolaan](operasional-handover.md).

## Pemeriksaan sebelum rilis

- Buka URL proyek langsung dan reload; pastikan karya tetap sesuai.
- Periksa Back/Forward, foto, dan tombol tutup, termasuk lokasi aset setelah perpindahan URL.
- Periksa judul, deskripsi, canonical, dan gambar preview dalam respons HTML.
- Tanpa JavaScript, teks dan foto proyek tetap tersedia.
- Gambar preview dapat diakses dengan tipe `image/jpeg`.
- Di domain aktif, proyek memberi status 200, alamat yang tidak ada tetap 404, dan `www` beralih ke domain utama tanpa kehilangan path proyek.
- `sitemap.xml` berisi homepage dan proyek publik, tanpa halaman index yang sudah dialihkan.

```sh
npm run test:projects
```

Perubahan routing juga perlu tes alur browser yang terdampak. Chromium lokal belum mewakili Safari atau HP nyata. Hasil tes terdahulu ada di [riwayat pengembangan](migration-status.md).

## Pembaruan di Google dan WhatsApp

Setelah deployment diperiksa, kirim `https://jouandbou.com/sitemap.xml` melalui Search Console jika belum terdaftar. Minta pengindeksan halaman yang berubah; untuk nama situs dan favicon, mulai dari homepage.

Permintaan indexing tidak menjamin perubahan langsung. Google menentukan waktu crawl dan hasil yang ditampilkan. WhatsApp dapat menyimpan preview lama, termasuk pada pesan yang sudah dikirim.

Sebelum menunggu cache, pastikan deployment, metadata, redirect, dan gambar pada website aktif sudah benar.
