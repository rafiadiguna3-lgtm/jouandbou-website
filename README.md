# Jou and Bou

Portofolio arsitektur dan desain interior Jou and Bou, studio yang berbasis di Jakarta.

**[jouandbou.com](https://jouandbou.com/)**

Website memperkenalkan karya dan pendekatan desain studio melalui peta 3D, foto, dan cerita proyek. Pengunjung dapat menjelajahi karya lalu menghubungi tim melalui WhatsApp.

## Versi kode

**Branch `main` ini masih berisi kode website versi lama.** Pengembangan saat ini berada di [`migration/jou-and-bou`](https://github.com/rafiadiguna3-lgtm/jouandbou-website/tree/migration/jou-and-bou).

Pembaruan README tidak menyamakan kode kedua branch. Untuk melanjutkan website terbaru, gunakan [README branch pengembangan](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/README.md).

## Panduan utama

| Kebutuhan | Dokumen |
| --- | --- |
| Tujuan, prioritas, indikator keberhasilan | [PRD](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/prd.md) |
| Perilaku fitur dan arah visual | [Panduan Fitur](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/perilaku-desain.md) |
| Update, rilis, pemulihan, serah terima | [Panduan Pengelolaan](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/operasional-handover.md) |
| SEO dan preview link | [Panduan SEO](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/project-seo.md) |
| Pemeriksaan otomatis di GitHub | [Website Checks](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/workflows.md) |

Akses, penanggung jawab, dan deployment yang belum diverifikasi ditandai dalam panduan serah terima.

## Link website

[Peta Proyek](https://jouandbou.com/#projects) · [About](https://jouandbou.com/#about) · [Bou Works](https://jouandbou.com/#bou-works) · [Rumah Anas](https://jouandbou.com/projects/rumah-anas/)

Link ini menuju website publik; tidak semua pembaruannya tersedia pada kode `main`.

## Menjalankan kode di branch ini

Gunakan **Node.js 24**, lalu jalankan:

```sh
npm ci
npm run dev
```

Buka `http://localhost:5173`. Pada `main`, perintah ini melayani folder `site/` secara langsung. Muat ulang browser setelah mengedit; belum ada pembaruan otomatis.

Untuk memeriksa hasil build:

```sh
npm run build
npm run preview
```

Buka `http://localhost:4173`. Edit sumber di `site/`, bukan di `dist/`, karena hasil build akan ditimpa.

## Struktur folder

| Folder | Isi |
| --- | --- |
| `site/` | Kode, foto, dan model 3D |
| `scripts/` | Alat build dan pemeriksaan file |
| `tests/` | Tes website |
| `docs/` | Panduan dan riwayat pengembangan |
| `dist/` | Hasil build |

Setelah mengubah sumber, catat alasan di [riwayat pengembangan](docs/migration-status.md), lalu jalankan `npm run manifest:update` dan `npm run build`.

Pemeriksaan tersedia melalui `npm test`, `npm run test:browser`, dan `npm run test:deployment-config`. Tes browser memerlukan Chromium; pasang dengan `npx playwright install chromium` jika belum tersedia.

## Deployment

Cloudflare Pages menggunakan build `npm run build`, output `dist`, dan Node.js `24`. Cocokkan branch serta commit yang dipasang dengan versi yang dituju.

Pertahankan nama dan lokasi aset. Sertakan file redirect/header dalam hasil build. Alamat yang tidak ditemukan tetap mengembalikan 404, bukan seluruhnya dialihkan ke homepage.

Kode awal berasal dari website studio yang dipublikasikan melalui ChatGPT Sites, kemudian dikembangkan di sini. Asal file dicatat dalam [manifest sumber](docs/source-manifest.json).
