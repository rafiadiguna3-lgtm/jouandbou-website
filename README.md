# Jou and Bou

Website portofolio arsitektur dan desain interior Jou and Bou, studio yang berbasis di Jakarta.

**Buka website: [jouandbou.com](https://jouandbou.com/)**

Pengunjung bisa memilih rumah di peta 3D, melihat model dan foto proyek, lalu menghubungi studio lewat WhatsApp.

## Link penting

- [Peta proyek / Jou Works](https://jouandbou.com/#projects)
- [Tentang studio](https://jouandbou.com/#about)
- [Bou Works](https://jouandbou.com/#bou-works)
- [Detail Rumah Anas](https://jouandbou.com/projects/rumah-anas/)

Link di atas membuka website publik. Kode pada branch ini belum mencakup semua pembaruan website tersebut.

## Versi kode yang dipakai

Versi kode di GitHub dipisahkan lewat **branch**, seperti folder kerja yang punya riwayat sendiri.

| Branch | Isinya |
| --- | --- |
| `main` | Versi kode yang lebih lama |
| [`migration/jou-and-bou`](https://github.com/rafiadiguna3-lgtm/jouandbou-website/tree/migration/jou-and-bou) | Pengembangan terbaru, termasuk pencarian Jou dan Bou, link proyek, pratinjau saat dibagikan, dan tampilan cadangan |

**Untuk mengerjakan website terbaru, buka [README branch pengembangan](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/README.md).**

Mengubah README di `main` tidak memindahkan kode terbaru ke sini. Petunjuk di bawah khusus untuk kode yang saat ini ada di `main`.

## Panduan untuk melanjutkan pekerjaan

Panduan aktif ada pada branch pengembangan:

- [Tujuan dan kebutuhan website / PRD](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/prd.md)
- [Perilaku fitur dan desain](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/perilaku-desain.md)
- [Update, rilis, pemulihan, dan checklist handover](https://github.com/rafiadiguna3-lgtm/jouandbou-website/blob/migration/jou-and-bou/docs/operasional-handover.md)

Mulai dari PRD untuk memahami tujuan, lalu gunakan checklist handover untuk mencoba akses dan pekerjaan penerus. Data penanggung jawab dan deployment yang belum diverifikasi ditandai di sana.

## Menjalankan di komputer sendiri

Pasang **Node.js versi 24**, lalu buka terminal di folder proyek dan jalankan:

```sh
npm ci
npm run dev
```

Buka **http://localhost:5173** di browser. Alamat ini hanya untuk melihat website di komputer sendiri. Perintah tersebut menampilkan isi folder `site/`.

Setelah mengedit kode, muat ulang browser. Website belum memakai pembaruan otomatis saat kode diedit.

Untuk menyiapkan dan melihat hasil yang akan diunggah:

```sh
npm run build
npm run preview
```

Buka **http://localhost:4173**. Hasil build, yaitu file website yang siap dipasang, ada di folder `dist/`.

## Isi folder

| Folder | Isinya |
| --- | --- |
| `site/` | Kode website, foto, dan model 3D |
| `scripts/` | Alat untuk menyiapkan website dan memeriksa file |
| `tests/` | Pemeriksaan fungsi website |
| `docs/` | Catatan perubahan dan panduan teknis |
| `dist/` | Hasil website yang siap diunggah; dibuat ulang saat build |

Edit file sumber di `site/`, bukan di `dist/`. Isi `dist/` akan ditimpa saat build berikutnya.

## Setelah mengubah file website

Catat perubahan di [catatan pengembangan](docs/migration-status.md), lalu jalankan:

```sh
npm run manifest:update
npm run build
```

Perintah pertama memperbarui daftar pemeriksaan file. Perintah kedua memeriksa file dan membuat hasil website terbaru.

## Memeriksa hasil perubahan

```sh
npm test
npm run test:browser
npm run test:deployment-config
```

Tes browser memerlukan Chromium. Jika belum tersedia, jalankan `npx playwright install chromium`.

Hasil pemeriksaan sebelumnya ada di [catatan pengembangan](docs/migration-status.md). Hasil lama belum membuktikan kondisi kode saat ini. Tes di komputer juga belum menggantikan pengecekan langsung di HP dan Safari.

## Memasang website

Untuk Cloudflare Pages, gunakan `npm run build` sebagai perintah build, `dist` sebagai folder hasil, dan Node.js versi `24`.

Pilih branch yang memang ingin dipasang. Pembaruan kode di branch pengembangan tidak otomatis masuk ke `main`.

Unggah isi `dist/` tanpa mengubah nama atau letak file. Sertakan file pengalihan link dan pengaturan respons jika tersedia di hasil build. File yang tidak ditemukan harus menampilkan status 404, bukan dialihkan ke halaman depan.

## Asal kode

Kode awal diambil dari website Jou and Bou yang dipublikasikan melalui ChatGPT Sites, lalu dikembangkan di repositori ini. Riwayat sumber file ada di [daftar sumber](docs/source-manifest.json).
