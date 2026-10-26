# Ikon website dan tab browser

## Satu alamat favicon

Homepage dan halaman proyek hanya mencantumkan satu ikon: `/favicon.ico`. Tidak ada JavaScript yang mengganti ikon setelah halaman terbuka.

Worker Cloudflare memilih gambar untuk alamat yang sama:
- Crawler yang dikenali, termasuk Googlebot dan Google Favicon: logo hitam berlatar putih, `assets/brand/jou-and-bou-solid-48-v5.png`.
- Browser biasa: logo putih transparan, `assets/brand/jou-and-bou-white-48-v143.png`.

Bentuk, ukuran, dan posisi mark hitam/putih sama. Worker mengirim PNG dengan tipe `image/png`; ekstensi URL tetap `.ico`. Jika Worker tidak berjalan dan route menggunakan Fail open, file ICO statis berisi ikon putih tersedia sebagai cadangan.

## Worker yang dipasang

Kode tersimpan di [cloudflare/favicon-worker.mjs](../cloudflare/favicon-worker.mjs), sama dengan file yang disiapkan untuk editor Cloudflare. Worker ini terpisah dari deployment Pages; push kode website tidak otomatis memperbarui Worker.

Pasang dua route, keduanya dengan **Fail open (proceed)**:

```
jouandbou.com/favicon.ico
www.jouandbou.com/favicon.ico
```

Worker menyimpan kedua PNG langsung di dalam kode. Tidak ada fetch ke Pages, binding, atau secret yang diperlukan untuk melayani favicon. Jangan aktifkan Cloudflare Access pada route favicon.

Respons favicon memakai `no-store` untuk browser dan CDN. Jangan tambahkan aturan Cache Everything yang menimpa pengaturan ini. Identifikasi User-Agent hanya memilih gambar publik, bukan pemeriksaan keamanan. Sinyal verified bot dipakai jika tersedia, dengan pencocokan nama crawler sebagai cadangan.

## Verifikasi setelah deployment

1. Buka `https://jouandbou.com/favicon.ico` dan versi `www`. Browser biasa harus menerima PNG putih transparan, bukan teks Hello World atau halaman error.
2. Uji alamat yang sama dengan User-Agent `Google Favicon` atau `Googlebot`: harus menerima logo hitam berlatar putih.
3. Pastikan respons bertipe `image/png` dan memakai `Cache-Control: no-store`.
4. Periksa HTML homepage dan proyek: hanya satu `rel="icon"`, mengarah ke `/favicon.ico`, tanpa script pengganti ikon.
5. Minta crawl ulang homepage melalui Search Console.

Worker mengatur gambar yang disajikan, bukan pilihan akhir atau waktu pembaruan Google. Favicon lama bisa tetap tersimpan sementara di browser dan Google. Cache hasil pencarian tidak dapat dihapus oleh kode website.

## Pemeriksaan lokal

```
npm run build
npm test
node --test tests/favicon-worker.test.mjs
npx playwright test tests/browser/metadata.spec.mjs tests/browser/project-seo.spec.mjs
```

Tes lokal memeriksa byte PNG kedua respons Worker tanpa mengizinkan fetch upstream, metadata HTML, dan navigasi. Server preview lokal tidak menjalankan Cloudflare Worker; `/favicon.ico` di sana adalah ICO cadangan putih. Pengujian lokal bukan bukti route/code Worker production sudah benar.
