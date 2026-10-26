# Panduan Fitur dan Desain

26 Oktober 2026 · pendamping [PRD](prd.md).

Panduan ini menjaga karakter visual dan alur penggunaan saat website diperbarui.

## Arah visual

Tampilan tetap tenang dan minimalis: ruang kosong yang cukup, teks terbaca, kontrol sederhana, dan peta sebagai pusat eksplorasi Jou.

Gunakan foto, logo, dan model asli studio. Warna model terpilih mengikuti asetnya. Penambahan komponen atau animasi harus memiliki fungsi yang jelas. Perbaikan satu bagian tidak perlu mengubah font dan ukuran seluruh website.

Hormati pengaturan pengurangan animasi perangkat. Fitur penting tetap dapat digunakan tanpa menunggu animasi selesai.

## Homepage dan intro

| Kondisi | Perilaku |
| --- | --- |
| Halaman baru / refresh | Peta muncul, diikuti intro `jou world` dan petunjuk singkat |
| Intro aktif | Peta blur ringan; warna rumah berganti mulai dari Rumah Anas, tanpa label atau garis tambahan |
| Drag, tap, scroll, keyboard, atau navigasi | Intro ditutup; blur dan warna sementara dibersihkan |
| Menu HP dibuka | Teks homepage disembunyikan agar tidak bertumpuk dengan menu |

Intro berlaku di HP dan desktop, muncul kembali pada refresh, dan tidak diulang setelah ditutup dalam kunjungan yang sama. Hindari kilatan teks panduan lama saat halaman mulai dimuat.

## Peta dan Explore 3D

**Pilih rumah → kamera mendekat dan rumah berwarna → masuk Explore 3D atau buka detail yang tersedia.** Detail menampilkan cerita, foto, dan kontak.

Pada menu HP, **Projects memilih Rumah Anas di peta**, bukan langsung masuk Explore 3D. Label proyek harus terbaca tanpa tertutup header, termasuk pada layar mendatar.

Pergerakan kamera harus menyambung tanpa lompatan ketika model detail selesai dimuat. Orbit dan zoom memakai kontrol yang sudah ada. Revisi video sosial media tidak otomatis mengubah animasi website.

## Pencarian

Pencarian tersedia di desktop dan menu HP, setelah Contact. Hasil mencakup nama/nomor Jou dan Bou yang dikenal, termasuk saran salah ketik.

Hasil harus membuka karya yang sesuai. Jangan menambahkan proyek atau cerita tanpa materi asli. Overlay ditutup bersama pencarian, dan input tetap dapat digunakan saat keyboard HP terbuka. Tidak perlu halaman daftar proyek terpisah.

## Bou Works

Tombol tutup mempertahankan asal navigasi: masuk dari homepage kembali ke homepage; masuk dari About kembali ke About.

Bou Works aktif menggunakan konten yang sudah tersedia. Konsep interior berlapis belum menjadi fitur aktif.

## Detail dan foto

Pemilihan lewat peta, URL langsung, dan link lama yang dikenal harus menuju karya yang sama. Reload, Back, Forward, dan tombol tutup tidak boleh menghilangkan foto atau mengubah URL ke proyek lain.

Galeri dapat dibuka dan ditutup pada HP tegak maupun mendatar. Teks/foto statis menjadi cadangan sebelum aplikasi siap, lalu disembunyikan setelah detail normal terbuka.

## Kontak proyek

Tombol **`lets talk~`** berada di detail proyek saja. Template pesannya:

```
Halo Jou and Bou, saya tertarik dengan proyek [nama]. Boleh ngobrol lebih lanjut?

[link proyek]
```

Nomor dan template berada di `site/project-inquiry.mjs`. Perubahan kontak perlu dikonfirmasi pemilik studio dan diuji melalui link WhatsApp.

## Identitas dan URL

| Bagian | Acuan |
| --- | --- |
| Jou / peta | `/#projects` |
| About | `/#about` |
| Bou | `/#bou-works` |
| Proyek publik | `/projects/.../` atau `/projects/bou/.../` |
| Domain utama | `https://jouandbou.com` |
| Nama situs dan judul homepage | `jou and bou studio` |
| Favicon | Satu `/favicon.ico`, dipilih Worker tanpa penggantian melalui JavaScript |

Judul proyek tetap memakai nama karya. Deskripsi menjelaskan isi/layanan, dan gambar preview berasal dari proyek yang dibagikan.

Worker menyajikan putih untuk browser dan hitam berlatar putih untuk crawler yang dikenali, dengan ukuran mark yang sama. Tampilan Google tetap bergantung pada pemilihan dan cache Google. Lihat [panduan favicon](favicon-behavior.md).

## Footer

Footer tipis tampil di bagian bawah homepage, About, Contact, Bou, Explore 3D, dan detail proyek. Copyright berada di kiri, dengan **“Elevating everyday life through design.”** di kanan. Kalimat ini diringkas dari narasi About tentang meningkatkan kualitas hidup melalui desain.

Di HP, teks menyesuaikan ruang tanpa menutup WhatsApp atau kontrol. Copyright lama pada footer sosial dihapus agar tidak berulang; tautan sosial tetap tersedia.

## Gangguan dan pemeriksaan visual

Jika aplikasi gagal dimuat, link proyek dan kontak tetap tersedia melalui tampilan cadangan. Teks/foto proyek publik juga dapat dibaca tanpa JavaScript.

Halaman kosong, salah karya, foto hilang, dan kontak yang tidak bekerja termasuk masalah fungsi. Periksa alur yang sama pada HP kecil, HP mendatar, dan desktop. Simpan perbandingan sebelum/sesudah untuk perubahan kamera, intro, menu, atau posisi tombol.

Prosedur tes dan rilis ada di [Panduan Pengelolaan](operasional-handover.md).
