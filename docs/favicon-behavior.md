# Ikon website dan tab browser

- HTML awal memakai satu favicon hitam berlatar putih: `/assets/brand/jou-and-bou-solid-96-v5.png`.
- Bentuk, posisi, dan ukuran logo disamakan dengan ikon tab putih yang sudah ada. Ikon hitam dibuat dari siluet PNG putih yang sama, lalu diberi latar putih. Root ICO/PNG/SVG dan ikon apple-touch memakai versi yang sama.
- Modul `browser-tab-icon.mjs` langsung mengganti ikon menjadi putih transparan saat modul dimuat, tanpa menunggu klik, keyboard, atau scroll. Ini berlaku pada tema terang dan gelap, terpisah dari aplikasi 3D.
- Gambar preview share tetap memakai aset 1200px berlatar putih yang sudah ada. Perubahan favicon tidak mengganti foto preview proyek.

Sesuai prioritas pemilik, tab browser langsung memakai putih. HTML awal tetap hitam, tetapi crawler yang menjalankan JavaScript juga bisa melihat putih. Jadi kode ini tidak menjamin Google selalu memilih ikon hitam; pemilihan ikon dan jadwal cache tetap ditentukan Google.

Setelah deployment, periksa HTML homepage dan akses favicon, lalu minta crawl ulang homepage melalui Search Console. Permintaan crawl ulang tidak menjamin pembaruan langsung.

Pemeriksaan lokal: `npm run build`, `npm test`, dan `npx playwright test tests/browser/metadata.spec.mjs`. Tes browser memeriksa DOM dan interaksi, bukan tampilan tab asli atau hasil Google.
