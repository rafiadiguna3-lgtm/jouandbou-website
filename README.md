# Jou and Bou

Ini website buat nunjukin karya arsitektur dan interior Jou and Bou.

**Langsung buka: [jouandbou.com](https://jouandbou.com/)**

Gue pengen orang bisa lihat karya, ngerti pendekatan desainnya, terus gampang ngajak ngobrol. Di website ada peta 3D buat eksplor rumah, foto dan cerita proyek, sama akses WhatsApp.

## Sebelum ngedit, cek versi kodenya dulu

- **`main` yang lagi lu buka ini masih kode website versi lama.**
- **[`migration/jou-and-bou`](https://github.com/rafiadiguna3-lgtm/jouandbou-website/tree/migration/jou-and-bou)** berisi pengembangan yang sekarang.

Branch itu versi kerja kode di GitHub. README udah dirapihin bukan berarti semua kode baru udah masuk `main`. Kalau mau lanjut website terbaru, [mulai dari README branch pengembangan](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/README.md).

## Biar yang nerusin nggak nebak-nebak

| Mau ngerti apa? | Buka ini |
| --- | --- |
| Tujuan dan prioritas website | [PRD](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/prd.md) |
| Cara fitur jalan dan feel desainnya | [Panduan fitur](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/perilaku-desain.md) |
| Update, deploy, error, dan serah terima | [Panduan kerja dan handover](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/operasional-handover.md) |
| SEO dan preview link proyek | [Panduan SEO](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/project-seo.md) |

Akses, penanggung jawab, dan deployment yang belum dicek ditandai di panduan handover. Jangan dianggap udah beres cuma karena dokumennya ada.

## Link website

[Peta proyek](https://jouandbou.com/#projects) · [About](https://jouandbou.com/#about) · [Bou Works](https://jouandbou.com/#bou-works) · [Rumah Anas](https://jouandbou.com/projects/rumah-anas/)

Ini link website publik, bukan bukti semua fiturnya udah ada di kode `main`.

## Kalau mau jalanin kode `main` di komputer

Pasang **Node.js 24**, buka terminal di folder proyek, terus:

```sh
npm ci
npm run dev
```

Buka `http://localhost:5173`. Di branch ini, perintahnya langsung menampilkan folder `site/`. Abis edit, reload browser; belum ada auto-update.

Buat lihat hasil build:

```sh
npm run build
npm run preview
```

Buka `http://localhost:4173`. File siap unggah ada di `dist/`. Edit sumbernya di `site/`, jangan di `dist/`, karena hasil build bakal ditimpa lagi.

## Foldernya buat apa?

| Folder | Isi |
| --- | --- |
| `site/` | Kode, foto, model 3D |
| `scripts/` | Alat build dan cek file |
| `tests/` | Tes website |
| `docs/` | Panduan dan riwayat pekerjaan |
| `dist/` | Hasil build |

Abis edit file website, catat alasan di [riwayat pekerjaan](docs/migration-status.md), terus jalanin `npm run manifest:update` dan `npm run build`. Buat ngecek hasilnya ada `npm test`, `npm run test:browser`, dan `npm run test:deployment-config`. Tes browser butuh Chromium; pasang lewat `npx playwright install chromium` kalau belum ada.

## Soal deploy

Cloudflare Pages pakai build `npm run build`, output `dist`, Node.js `24`. Pastikan branch yang dipasang memang versi yang dimau. Jangan sampai update di branch pengembangan tapi Cloudflare ambil kode lama.

Nama dan lokasi file jangan diubah sembarangan. File redirect/header yang ada di hasil build ikut diunggah. Link yang beneran nggak ada tetap 404, jangan semua dilempar ke homepage.

Kode awal berasal dari website studio yang dipublikasikan lewat ChatGPT Sites, terus dikembangin di repo ini. Asal file ada di [manifest sumber](docs/source-manifest.json).
