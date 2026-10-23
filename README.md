# Jou and Bou

Website portofolio arsitektur dan desain interior Jou and Bou, studio yang berbasis di Jakarta.

**Buka website: [jouandbou.com](https://jouandbou.com/)**

Pengunjung bisa memilih rumah di peta 3D, melihat model dan foto proyek, lalu menghubungi studio lewat WhatsApp.

## Yang ada di website

- Peta dengan 25 model proyek yang bisa dipilih.
- Pencarian proyek Jou dan Bou, termasuk saran saat nama salah diketik.
- Foto, keterangan proyek, dan tombol WhatsApp di detail proyek.
- Halaman tentang studio, Bou Works, dan kontak.
- Tampilan untuk komputer dan HP.
- Link khusus untuk 15 proyek, lengkap dengan judul, deskripsi, dan gambar pratinjau saat dibagikan.
- Tampilan cadangan berisi link proyek dan kontak jika aplikasi gagal dimuat.

## Link penting

| Tujuan | Link |
| --- | --- |
| Peta proyek / Jou Works | [Lihat proyek](https://jouandbou.com/#projects) |
| Tentang studio | [About](https://jouandbou.com/#about) |
| Desain interior | [Bou Works](https://jouandbou.com/#bou-works) |
| Contoh detail proyek | [Rumah Anas](https://jouandbou.com/projects/rumah-anas/) |

Link proyek bisa dibuka langsung atau dibagikan. Isinya tetap tersedia jika JavaScript, kode yang menjalankan tampilan interaktif, tidak aktif.

Tidak ada halaman daftar proyek terpisah. Link `/projects/` dan `/jou-works/` mengarah ke peta. Link lama `/about-us/` mengarah ke About, sedangkan `/bou-works/` mengarah ke Bou Works.

Google dan WhatsApp memperbarui hasil pencarian atau pratinjau sesuai jadwal mereka sendiri. Perubahan di website tidak selalu langsung terlihat di sana.

## Pilih versi kode

Versi kode di GitHub dipisahkan lewat **branch**, seperti folder kerja yang punya riwayat sendiri.

- `migration/jou-and-bou`: berisi pengembangan website terbaru dan petunjuk di README ini.
- `main`: masih berisi versi kode yang lebih lama. Mengubah README tidak memindahkan kode website antarbranch.

## Menjalankan di komputer sendiri

Bagian ini untuk orang yang akan mengerjakan kodenya. Pasang **Node.js versi 24**, lalu buka terminal di folder proyek dan jalankan:

```sh
npm ci
npm run dev
```

Buka **http://localhost:5173** di browser. Alamat ini hanya untuk melihat website di komputer sendiri.

Setelah mengubah kode, hentikan server dengan `Ctrl+C`, lalu jalankan lagi `npm run dev`. Website belum memakai pembaruan otomatis saat kode diedit.

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

## Setelah mengubah isi website

Catat perubahan di [catatan pengembangan](docs/migration-status.md), lalu jalankan:

```sh
npm run manifest:update
npm run build
```

Perintah pertama memperbarui daftar pemeriksaan file. Perintah kedua memeriksa file dan membuat hasil website terbaru.

Jika mengubah daftar proyek atau gambar pratinjau link, ikuti [panduan proyek dan pratinjau](docs/project-seo.md).

## Memeriksa hasil perubahan

```sh
npm test
npm run test:browser
npm run test:projects
npm run test:deployment-config
```

Pemeriksaan mencakup file, pencarian, navigasi, detail proyek, foto, dan tampilan beberapa ukuran layar. Tes browser memerlukan Chromium. Jika belum tersedia, jalankan `npx playwright install chromium`.

Sebagian tes lama masih perlu disesuaikan dengan tampilan dan arah link terbaru. Hasil pemeriksaan sebelumnya ada di [catatan pengembangan](docs/migration-status.md). Tes di komputer juga belum menggantikan pengecekan langsung di HP dan Safari.

## Memasang website

Untuk Cloudflare Pages:

| Pengaturan | Isi |
| --- | --- |
| Perintah build | `npm run build` |
| Folder hasil | `dist` |
| Versi Node.js | `24` |

Pilih branch yang memang ingin dipasang. Pastikan file `_redirects` dan `_headers` ikut terunggah agar pengalihan link dan pengaturan respons tetap bekerja. Jangan ubah nama atau letak file foto dan model.

File yang tidak ditemukan harus menampilkan status 404, bukan dialihkan ke halaman depan. Domain `www.jouandbou.com` diarahkan ke `jouandbou.com` dengan tetap mempertahankan alamat proyeknya.

## Catatan teknis

Website ini tidak membutuhkan server aplikasi atau database. Font dan layanan peta luar tetap membutuhkan koneksi internet. Penyimpanan foto di browser membantu pemuatan ulang, tetapi website tidak sepenuhnya bisa dipakai tanpa internet.

Kode awal diambil dari website Jou and Bou yang dipublikasikan melalui ChatGPT Sites, lalu dikembangkan di repositori ini. Riwayat sumber file ada di [daftar sumber](docs/source-manifest.json).

Panduan lanjutan: [domain](docs/www-domain.md), [ikon tab browser](docs/favicon-behavior.md), dan [pengaturan keamanan Cloudflare](docs/cloudflare-security.md).
