# Jou and Bou

Website portofolio arsitektur dan desain interior Jou and Bou, studio di Jakarta.

**Website: [jouandbou.com](https://jouandbou.com/)**

Tujuannya: membantu orang mengenal studio, melihat karya, lalu menghubungi tim. Pengunjung bisa memilih rumah di peta 3D, membaca cerita proyek, dan melihat foto sebelum membuka WhatsApp.

## Mulai dari sini

| Kalau ingin tahu… | Baca |
| --- | --- |
| Tujuan website, ukuran keberhasilan, dan prioritas | [Kebutuhan website / PRD](docs/prd.md) |
| Cara fitur dan desain seharusnya bekerja | [Panduan perilaku dan desain](docs/perilaku-desain.md) |
| Cara update, rilis, memeriksa masalah, dan serah terima | [Panduan operasional dan handover](docs/operasional-handover.md) |

Tiga panduan ini adalah pegangan kerja saat ini. `docs/migration-status.md` menyimpan riwayat perubahan, termasuk keputusan lama yang sudah diganti. Jangan mengambil aturan produk dari satu catatan lama tanpa memeriksa panduan terbaru dan kodenya.

## Versi kode

- **`migration/jou-and-bou`**: berisi pengembangan website saat ini dan panduan ini.
- **`main`**: masih versi kode lama. README yang baru tidak berarti kode website di kedua branch sudah sama.

Branch adalah versi kerja kode di GitHub. Sebelum rilis, cocokkan branch dan nomor commit dengan deployment Cloudflare yang akan digunakan.

## Link website

[Peta proyek](https://jouandbou.com/#projects) · [About](https://jouandbou.com/#about) · [Bou Works](https://jouandbou.com/#bou-works) · [Contoh proyek](https://jouandbou.com/projects/rumah-anas/)

## Menjalankan di komputer sendiri

Pasang **Node.js 24**, buka terminal di folder proyek, lalu:

```sh
npm ci
npm run dev
```

Buka `http://localhost:5173`. Setelah mengedit kode, hentikan dengan `Ctrl+C` lalu jalankan lagi `npm run dev`. Belum ada pembaruan otomatis saat kode diedit.

Untuk melihat hasil yang siap dipasang:

```sh
npm run build
npm run preview
```

Buka `http://localhost:4173`. Hasil build ada di `dist/`. Edit kode di `site/`, bukan di `dist/`, karena folder hasil itu dibuat ulang saat build.

## Isi repositori

| Folder | Isi |
| --- | --- |
| `site/` | Kode website, foto, dan model 3D |
| `cloudflare/` | Salinan kode Worker favicon; dipasang terpisah dari website |
| `scripts/` | Alat build dan pengolahan konten |
| `tests/` | Pemeriksaan otomatis |
| `docs/` | Panduan kerja dan riwayat perubahan |
| `dist/` | Hasil build untuk diunggah |

Website tidak membutuhkan database atau server aplikasi. Cloudflare Pages melayani file website; Worker menangani pilihan favicon. Detail update dan pemeriksaan ada di [panduan operasional](docs/operasional-handover.md).

Kode awal berasal dari website studio yang dipublikasikan melalui ChatGPT Sites, lalu dikembangkan di sini. Asal file dicatat dalam [manifest sumber](docs/source-manifest.json).
