# Biar proyek gampang ditemukan dan dibagikan

Update 26 Oktober 2026. Ini panduan SEO proyek yang dipakai sekarang. Catatan tes lama tetap ada di [riwayat pekerjaan](migration-status.md).

## Gampangnya, SEO di sini ngurus apa?

Supaya orang yang nemu karya lewat Google atau nerima link bisa masuk ke proyek yang benar. Judul, penjelasan singkat, dan gambar preview-nya juga harus sesuai karya itu.

Sekarang ada **8 proyek Jou dan 7 konsep Bou** yang punya link publik. Daftarnya ada di `site/project-catalog.mjs`.

Model yang ceritanya belum siap tetap bisa punya akses dari peta, tapi belum otomatis masuk daftar link publik dan sitemap. Sitemap itu daftar alamat yang kita kasih ke mesin pencari.

## Linknya jangan dobel-dobel

- Homepage/peta: `https://jouandbou.com/#projects`.
- Proyek Jou: `/projects/nama-proyek/`.
- Proyek Bou: `/projects/bou/nama-proyek/`.
- `/projects/` dan `/jou-works/` balik ke peta, bukan halaman index tambahan.
- Link lama yang dikenal diarahkan ke karya yang sesuai. Aturannya ada di `site/_redirects`.

Kalau nama atau judul karya berubah, jangan langsung ganti URL yang udah dibagikan. Pertahanin linknya, atau pasang pengalihan ke alamat baru yang benar.

## Yang harus ada di tiap proyek

| Bagian | Gunanya |
| --- | --- |
| Judul dan deskripsi | Ngasih tahu proyek ini apa |
| Alamat utama / canonical | Nandain URL yang dipakai sebagai rujukan |
| Open Graph dan Twitter image | Gambar dan teks preview pas link dibagikan |
| Data terstruktur | Bantu mesin pencari ngerti nama karya, studio, dan susunan halaman |
| Teks dan foto di HTML | Isi tetap kebaca walau JavaScript belum jalan |

Build bikin HTML untuk tiap proyek publik. Pas aplikasi udah siap, pengunjung masuk ke tampilan detail yang sama kayak dari peta; konten cadangannya disembunyiin supaya nggak numpuk.

Judul homepage dan nama situs sekarang **`jou and bou studio`**. Judul proyek tetap pakai nama karya, misalnya `Rumah Anas | Jou and Bou`. Favicon diurus terpisah lewat [Worker](favicon-behavior.md), bukan ditumpuk pengaturan SEO lagi.

## Kalau mau update proyek

1. Edit sumber cerita/fotonya. Cerita Jou ada di panel HTML, materi Bou di `site/bou-projects.json`.
2. Kalau daftar/nama/deskripsi proyek publik berubah, sesuaikan `scripts/build-project-catalog.mjs`.
3. Jalanin:

```sh
npm run build:project-catalog
npm run build:project-previews
npm run manifest:update
npm run build
```

Gambar preview dibuat dari aset proyek yang udah ada, ukuran 1200 × 630 JPEG. Perintah preview butuh Chromium. Deploy biasa pakai hasil yang udah disimpan di repo, jadi nggak perlu bikin gambarnya lagi.

Kalau nambah aset baru, daftarin juga di manifest sumber. Cara lengkapnya ada di [panduan kerja](operasional-handover.md).

## Sebelum bilang beres, coba ini

- Buka link proyek langsung, terus reload. Harus masuk ke karya yang sama.
- Coba Back/Forward, foto, dan tombol tutup. Jangan sampai asetnya dicari dari folder URL yang salah.
- Cek judul, deskripsi, canonical, dan gambar preview di respons HTML, bukan cuma tampilan setelah aplikasi kebuka.
- Coba tanpa JavaScript: teks dan foto proyek tetap ada.
- Pastikan gambar preview bisa diakses dan tipenya `image/jpeg`.
- Di website aktif, proyek harus balas 200, alamat yang nggak ada tetap 404, dan `www` mengarah ke domain utama tanpa kehilangan path proyek.
- Cek `sitemap.xml`: isinya homepage dan proyek publik, bukan halaman index yang udah dialihkan.

Buat tes lokal:

```sh
npm run test:projects
```

Kalau ngubah routing, tes alur browser lain yang kena juga. Tes Chromium di komputer bukan bukti udah aman di Safari/HP asli.

## Biar Google baca ulang

Abis deployment terbaru dicek, buka Search Console. Kirim sitemap `https://jouandbou.com/sitemap.xml` kalau belum, terus minta pengindeksan halaman yang berubah. Buat nama situs dan favicon, mulai dari homepage.

**Minta indexing bukan tombol buat langsung ganti hasil Google.** Google nentuin kapan baca ulang dan apa yang ditampilkan. WhatsApp juga bisa nyimpen preview lama; pesan yang udah dikirim belum tentu ikut berubah.

Jangan cuma nunggu cache kalau halaman aktifnya sendiri masih salah. Cek dulu deployment, metadata, redirect, dan file gambarnya.
