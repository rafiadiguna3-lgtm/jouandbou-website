# Ikon website dan tab browser

- HTML awal memakai satu favicon hitam berlatar putih: `/assets/brand/jou-and-bou-solid-96-v5.png`.
- Bentuk, posisi, dan ukuran logo disamakan dengan ikon tab putih yang sudah ada. Ikon hitam dibuat dari siluet PNG putih yang sama, lalu diberi latar putih. Root ICO/PNG/SVG dan ikon apple-touch memakai versi yang sama.
- Modul `browser-tab-icon.mjs` baru mengganti ikon menjadi versi putih transparan setelah interaksi nyata: klik/sentuh, keyboard, atau scroll. Tanpa interaksi, ikon tetap hitam meskipun JavaScript berjalan. Tidak ada timer atau deteksi user-agent.
- Gambar preview share tetap memakai aset 1200px berlatar putih yang sudah ada. Perubahan favicon tidak mengganti foto preview proyek.

Ini mengurangi kemungkinan crawler mengambil ikon putih ketika menjalankan JavaScript tanpa berinteraksi. Pemilihan ikon, nama situs, dan jadwal pembaruan cache tetap ditentukan Google; pemisahan tampilan Google dan browser tidak bisa dijamin mutlak.

Setelah deployment, periksa HTML homepage dan akses favicon, lalu minta crawl ulang homepage melalui Search Console. Permintaan crawl ulang tidak menjamin pembaruan langsung.

Pemeriksaan lokal: `npm run build`, `npm test`, dan `npx playwright test tests/browser/metadata.spec.mjs`. Tes browser memeriksa DOM dan interaksi, bukan tampilan tab asli atau hasil Google.
