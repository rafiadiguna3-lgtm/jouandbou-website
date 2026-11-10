# Jou and Bou

Portofolio arsitektur dan desain interior Jou and Bou, studio yang berbasis di Jakarta.

**[jouandbou.com](https://jouandbou.com/)**

Website ini memperkenalkan karya dan pendekatan desain studio melalui peta 3D, foto, dan cerita proyek. Pengunjung dapat menjelajahi karya lalu menghubungi tim melalui WhatsApp.

## Panduan utama

| Kebutuhan | Dokumen |
| --- | --- |
| Tujuan, prioritas, dan indikator keberhasilan | [PRD](docs/prd.md) |
| Perilaku fitur dan arah visual | [Panduan Fitur dan Desain](docs/perilaku-desain.md) |
| Update, rilis, pemulihan, dan serah terima | [Panduan Pengelolaan](docs/operasional-handover.md) |
| Link proyek, SEO, dan gambar preview | [Panduan SEO](docs/project-seo.md) |
| Pemeriksaan otomatis di GitHub | [Website Checks](docs/workflows.md) |

Panduan ini menjadi acuan kerja saat ini. `docs/migration-status.md` menyimpan riwayat perubahan, termasuk keputusan lama yang sudah diganti.

## Versi kode

- **`migration/jou-and-bou`**: pengembangan website saat ini.
- **`main`**: kode website versi lama; pembaruan README tidak menyamakan isi kedua branch.

Branch adalah versi kerja kode. Sebelum rilis, cocokkan branch dan commit—penanda versi perubahan—dengan deployment Cloudflare.

## Link website

[Peta Proyek](https://jouandbou.com/#projects) · [About](https://jouandbou.com/#about) · [Bou Works](https://jouandbou.com/#bou-works) · [Rumah Anas](https://jouandbou.com/projects/rumah-anas/)

## Menjalankan website

Gunakan **Node.js 24**, lalu jalankan dari folder proyek:

```sh
npm ci
npm run dev
```

Buka `http://localhost:5173`. Setelah mengedit, hentikan server dengan `Ctrl+C` dan jalankan kembali `npm run dev`. Belum ada pembaruan otomatis saat kode diedit.

Untuk memeriksa hasil build:

```sh
npm run build
npm run preview
```

Buka `http://localhost:4173`. Edit sumber di `site/`, bukan di `dist/`; folder hasil build akan dibuat ulang.

## Struktur folder

| Folder | Isi |
| --- | --- |
| `site/` | Kode website, foto, dan model 3D |
| `cloudflare/` | Kode Worker favicon, dengan deployment terpisah |
| `scripts/` | Alat build dan pengolahan konten |
| `tests/` | Pemeriksaan fungsi dan aset |
| `docs/` | Panduan dan catatan pengembangan |
| `dist/` | Hasil build untuk deployment |

Website tidak memakai database atau server aplikasi. Cloudflare Pages melayani website, sementara Worker menangani pilihan favicon. Prosedurnya tersedia di [Panduan Pengelolaan](docs/operasional-handover.md).

Kode awal berasal dari website studio yang dipublikasikan melalui ChatGPT Sites, kemudian dikembangkan di repositori ini. Asal file dicatat dalam [manifest sumber](docs/source-manifest.json).
