# Jou and Bou

Ini website buat nunjukin karya arsitektur dan interior Jou and Bou.

**Langsung buka: [jouandbou.com](https://jouandbou.com/)**

Gue pengen orang bisa lihat karya, ngerti pendekatan desainnya, terus gampang ngajak ngobrol. Makanya ada peta 3D yang bisa dimainin, foto dan cerita proyek, sama akses ke WhatsApp.

## Mau lanjut ngerjain? Mulai di sini

| Mau ngerti apa? | Buka ini |
| --- | --- |
| Tujuan website dan mana yang perlu dikerjain dulu | [PRD](docs/prd.md) |
| Cara fitur jalan dan tampilan yang perlu dijaga | [Panduan fitur dan desain](docs/perilaku-desain.md) |
| Cara update, deploy, benerin error, sampai handover | [Panduan kerja dan handover](docs/operasional-handover.md) |
| SEO, link proyek, dan gambar pas link dibagikan | [Panduan SEO](docs/project-seo.md) |

Baca panduan ini dulu. `docs/migration-status.md` itu riwayat pekerjaan, jadi ada keputusan lama yang sekarang udah diganti. Jangan sampai aturan lama kepakai lagi.

## Kodenya pakai yang mana?

- **`migration/jou-and-bou`**: pengembangan website yang sekarang.
- **`main`**: masih kode versi lama. README-nya udah dirapihin, tapi bukan berarti kode websitenya ikut sama.

Branch itu versi kerja kode di GitHub. Sebelum deploy, cek Cloudflare ambil branch dan commit yang mana. Commit itu penanda satu versi perubahan.

## Link penting

[Peta proyek](https://jouandbou.com/#projects) · [About](https://jouandbou.com/#about) · [Bou Works](https://jouandbou.com/#bou-works) · [Rumah Anas](https://jouandbou.com/projects/rumah-anas/)

## Mau buka di komputer sendiri?

Pasang **Node.js 24**, buka terminal di folder proyek, terus jalanin:

```sh
npm ci
npm run dev
```

Buka `http://localhost:5173`. Kalau abis edit kode, hentikan dengan `Ctrl+C`, terus jalanin `npm run dev` lagi. Belum ada auto-update pas ngedit.

Buat lihat hasil yang siap dipasang:

```sh
npm run build
npm run preview
```

Buka `http://localhost:4173`. Hasilnya ada di `dist/`. **Edit sumbernya di `site/`, jangan di `dist/`**, karena isi `dist/` bakal dibuat ulang.

## Biar nggak nyasar di folder

| Folder | Buat apa? |
| --- | --- |
| `site/` | Kode website, foto, dan model 3D |
| `cloudflare/` | Kode Worker favicon; deploy-nya terpisah |
| `scripts/` | Alat buat build dan ngolah konten |
| `tests/` | Tes fungsi dan file |
| `docs/` | Panduan sama catatan pekerjaan |
| `dist/` | Hasil build yang siap diunggah |

Website ini belum butuh database atau server aplikasi. File website dilayani Cloudflare Pages, sementara pilihan favicon diurus Worker. Cara update dan ngeceknya ada di [panduan kerja](docs/operasional-handover.md).

Kode awalnya dari website studio yang dipublikasikan lewat ChatGPT Sites, terus dikembangin di sini. Asal file dicatat di [manifest sumber](docs/source-manifest.json).
