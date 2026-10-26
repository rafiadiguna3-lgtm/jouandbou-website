# Panduan perilaku dan desain

Pegangan pengalaman pengunjung · diperbarui 26 Oktober 2026.

Gunakan bersama [PRD](prd.md). Ini menjelaskan perilaku yang harus dijaga saat memperbaiki website, bukan instruksi untuk mendesain ulang.

## Tampilan dan aset

- Pertahankan gaya studio: ruang kosong yang cukup, tipografi tenang, kontrol sederhana, dan peta sebagai pusat pengalaman Jou.
- Tetap gunakan foto dan model 3D asli. Warna pada model yang dipilih mengikuti materi yang sudah ada.
- Jangan menambahkan kotak, badge, tombol, atau animasi dekoratif tanpa tujuan yang jelas.
- Jangan mengganti font/ukuran seluruh website untuk menyelesaikan masalah pada satu komponen. Ikuti gaya komponen yang sudah dipakai.
- Hormati pengaturan pengurangan animasi perangkat. Fungsi penting tidak boleh bergantung pada animasi selesai.

## Homepage dan panduan awal

| Keadaan | Yang terjadi |
| --- | --- |
| Halaman baru / refresh | Peta diungkap terlebih dahulu; intro `jou world` dan petunjuk singkat mengikuti |
| Intro aktif | Peta blur ringan, warna rumah berganti mulai dari Rumah Anas; tidak membuat label/garis callout tambahan |
| Pengunjung drag, tap, scroll, memakai keyboard, atau navigasi | Intro hilang; blur dan warna sementara dibersihkan |
| Menu HP dibuka | Teks homepage disembunyikan supaya tidak bertumpuk dengan menu |

Panduan berlaku di HP dan desktop, muncul lagi pada refresh, dan tidak diulang setelah ditutup dalam kunjungan yang sama. Hindari teks panduan lama berkedip sebelum tampilan siap.

## Memilih dan menjelajahi proyek Jou

1. Pengunjung memilih rumah di peta.
2. Kamera mendekat, rumah terpilih berwarna, dan nama proyek mengikuti rumah.
3. Pengunjung dapat masuk Explore 3D untuk memeriksa model atau membuka detail yang tersedia.
4. Detail proyek memuat cerita, foto, dan akses kontak.

Di menu HP, **Projects memilih Rumah Anas di peta**, bukan langsung memasukkannya ke Explore 3D. Nama rumah harus terbaca dan tidak tertutup header, termasuk pada layar mendatar.

Gerak kamera harus terasa menyambung, tanpa lompatan ketika model detail selesai dimuat. Setelah masuk 3D, orbit/zoom memakai kontrol yang sudah tersedia. Perubahan pada motion sosial media tidak mengubah aturan ini.

## Pencarian

- Bisa ditemukan dari desktop maupun menu HP; di menu HP letaknya setelah Contact.
- Mencari proyek Jou dan Bou dari nama/nomor yang dikenal, serta memberikan saran salah ketik.
- Hasil menuju karya yang sesuai; jangan mengarang proyek atau cerita yang belum tersedia.
- Jangan membuat daftar proyek terpisah untuk menggantikan pencarian dan peta.
- Input tidak boleh tertutup keyboard HP atau meninggalkan overlay setelah ditutup.

## Bou Works dan tombol kembali

Bou Works yang aktif memakai konten/karya yang sudah ada. Eksplorasi bangunan interior berlapis belum menjadi pengalaman aktif.

Saat membuka Bou Works dari homepage lalu menutupnya, kembali ke homepage. Jika dibuka dari About, kembali ke About. Simpan konteks asal, jangan membuat satu tombol tutup selalu menuju tempat yang sama.

## Detail, foto, dan WhatsApp

- URL proyek langsung, pemilihan di peta, dan link lama yang dikenal harus menuju karya yang sama.
- Reload, Back, Forward, dan tombol tutup tidak boleh membuat foto hilang atau URL salah.
- Galeri foto harus bisa dibuka/ditutup dan tetap dapat digunakan pada HP mendatar.
- Tombol **`lets talk~`** hanya berada di detail proyek. Bukan tombol tambahan di seluruh peta.
- Pesan WhatsApp memakai format berikut, dengan nama/link sesuai karya:

```
Halo Jou and Bou, saya tertarik dengan proyek [nama]. Boleh ngobrol lebih lanjut?

[link proyek]
```

Nomor dan template berada di `site/project-inquiry.mjs`. Perubahan kontak harus dikonfirmasi pemilik studio dan dites, bukan hanya diganti di teks tampilan.

## Link dan identitas

| Tujuan | Alamat / aturan |
| --- | --- |
| Jou Works / peta | `/#projects` |
| About | `/#about` |
| Bou Works | `/#bou-works` |
| Proyek yang dipublikasikan | `/projects/.../` |
| Proyek Bou yang dipublikasikan | `/projects/bou/.../` |
| Domain utama | `https://jouandbou.com` |
| Judul homepage dan nama situs | `jou and bou studio` |
| Ikon tab / favicon | Satu `/favicon.ico`, dipilih oleh Worker; jangan ditimpa JavaScript |

Judul halaman proyek tetap memakai nama karya. Deskripsi menjelaskan isi atau layanan; jangan mengganti semua deskripsi dengan nama studio saja. Gambar preview proyek harus berasal dari karya yang dibagikan.

Untuk favicon, browser menerima putih; crawler yang dikenali menerima hitam berlatar putih. Ukuran dan posisi mark sama. Ini aturan penyajian Worker; tampilan Google tetap bergantung pada pilihan dan cache Google. [Detail favicon](favicon-behavior.md).

## Saat ada gangguan

Jika JavaScript gagal atau startup terlalu lama, pengunjung tetap mendapat link proyek dan kontak. Halaman proyek memiliki teks/foto statis yang dapat dibaca tanpa JavaScript. Jangan menampilkan fallback bersamaan dengan aplikasi normal.

Foto yang gagal, tombol tertutup, halaman kosong, salah karya, atau kontak tidak bekerja adalah masalah fungsi, bukan sekadar perbedaan visual.

## Cara menilai perubahan visual

Periksa layar HP kecil, HP mendatar, dan desktop. Coba alur yang sama sebelum/sesudah. Simpan screenshot atau video singkat jika mengubah kamera, intro, menu, atau letak tombol. Persetujuan satu tampilan tidak membuktikan semua ukuran layar sudah benar.

Lanjut: [operasional dan handover](operasional-handover.md).
