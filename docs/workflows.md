# Pemeriksaan Otomatis di GitHub

Workflow **Website Checks** memeriksa perubahan sebelum tim meninjau atau merilis website. Deployment tetap ditangani Cloudflare.

## Kapan berjalan

- Push perubahan kode ke `migration/jou-and-bou`.
- Pull request yang ditujukan ke branch tersebut.
- Manual melalui tab **Actions → Website Checks → Run workflow**.

Perubahan Markdown saja tidak memicu tes otomatis. Perubahan manifest JSON tetap diperiksa. Workflow tersedia pada `main` agar menu manual dapat digunakan, tetapi tidak menjalankan kode lama `main` secara otomatis. Pada pemeriksaan manual, kolom **revision** menentukan kode yang diuji; default-nya `migration/jou-and-bou`.

## Yang diperiksa

| Tahap | Cakupan |
| --- | --- |
| Build dan tes sumber | Hash/aset, model, kamera, file publik, halaman proyek, konfigurasi, dan respons Worker |
| Browser | Metadata, URL proyek, search, fallback, WhatsApp, dan 11 ukuran/input layar |
| Laporan | Hasil Playwright; screenshot/trace tersedia jika pemeriksaan menghasilkan bukti tersebut |

Worker diuji secara lokal dari kode repositori. Ini tidak membuktikan versi Worker yang terpasang di Cloudflare atau hasil Google sudah sama.

Workflow memakai Node.js 24 dan Chromium Playwright. Tidak membutuhkan token Cloudflare, tidak memublikasikan paket npm, dan tidak mengubah deployment. Hak GitHub dibatasi ke baca kode.

## Membaca hasil

1. Buka tab **Actions**, lalu pilih pemeriksaan yang sesuai commit.
2. Buka langkah berwarna merah jika gagal; baca pesan error pertama.
3. Unduh artifact **website-checks-…** untuk laporan browser. Buka `playwright-report/index.html`; trace dapat dibaca lewat `npx playwright show-trace [file-trace.zip]`.
4. Perbaiki penyebabnya, push perubahan, lalu periksa hasil berikutnya.

Bukti disimpan tujuh hari. Jika gagal sebelum tes browser dimulai, artifact browser mungkin belum ada; gunakan log langkah yang gagal. Pemeriksaan yang belum selesai pada revisi lama dibatalkan saat revisi baru masuk pada branch yang sama.

## Menjalankan di komputer

```sh
npm ci
npm run ci:source
npx playwright install chromium
npm run ci:browser
```

`ci:source` sudah menjalankan build. Jika kode berubah setelah itu, ulangi build sebelum tes browser. Paket `npm run test:browser` yang lebih luas tetap tersedia; beberapa tes historis di luar pilihan CI perlu disesuaikan dengan perilaku terbaru.

## Batas sebelum rilis

Status hijau berarti rangkaian tes lolos, bukan jaminan semua perangkat atau layanan luar sudah diperiksa. Tetap lakukan pemeriksaan domain aktif dan perangkat nyata sesuai [Panduan Pengelolaan](operasional-handover.md).

**Workflow ini belum menahan deployment Cloudflare.** Integrasi Git Pages dapat tetap memasang commit walaupun tes gagal. Jangan menganggap status ini sebagai gerbang rilis sebelum aturan branch dan alur deployment disepakati.

Jika branch produksi dipindah atau kode baru digabung ke `main`, perbarui pemicu workflow setelah prosesnya ditinjau. Pada pemeriksaan manual, revisi lama tanpa perintah `ci:source`/`ci:browser` akan gagal dengan pesan yang menjelaskan versi kode yang diperlukan.
