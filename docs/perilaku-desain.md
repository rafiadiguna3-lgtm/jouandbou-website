# Fitur dan tampilannya harus gimana?

Update 26 Oktober 2026. Baca bareng [PRD](prd.md). Ini pegangan biar pas dibenerin, karakter sama cara pakai websitenya nggak ikut berubah.

## Feel-nya tetap Jou and Bou

Gue pengen tampilannya tenang dan minimalis. Ada ruang kosong, teks gampang dibaca, kontrol simpel, dan peta tetap jadi pusat eksplor Jou.

Pakai foto, logo, dan model asli studio. Warna rumah yang dipilih ikutin asetnya. Jangan nambah badge, kotak, atau animasi cuma biar rame. Kalau benerin satu komponen, jangan sekalian ganti font dan ukuran seluruh website.

Kalau perangkat minta animasi dikurangin, ikutin. Fitur penting tetap harus bisa dipakai.

## Pertama buka homepage

| Lagi di tahap apa? | Yang kelihatan |
| --- | --- |
| Baru buka / refresh | Peta muncul dulu, terus intro `jou world` dan petunjuk singkat |
| Intro aktif | Peta blur tipis, rumah berganti warna mulai dari Anas; nggak ada label/garis tambahan |
| Orang mulai drag, tap, scroll, pakai keyboard, atau pindah halaman | Intro hilang, blur sama warna sementaranya dibersihin |
| Menu HP dibuka | Teks homepage disembunyiin biar nggak numpuk di belakang menu |

Intro ada di HP dan desktop. Refresh bikin muncul lagi, tapi kalau udah ditutup dalam kunjungan yang sama, jangan diulang terus. Teks panduan lama juga jangan sempat kedip sebelum tampilan siap.

## Dari peta ke proyek

Alurnya: **pilih rumah → kamera mendekat dan rumah berwarna → bisa masuk Explore 3D atau buka detail yang tersedia**. Di detail ada cerita, foto, dan kontak.

Dari menu HP, tombol **Projects milih Rumah Anas di peta**, bukan langsung masuk Explore 3D. Label proyek harus kebaca dan nggak nyangkut di bawah header, termasuk pas HP dimiringin.

Kameranya nyambung, nggak lompat pas model detail selesai loading. Orbit sama zoom di Explore 3D tetap pakai kontrol yang ada. Revisi video sosmed jangan otomatis diterapin ke website.

## Search

Ada di desktop dan menu HP. Di menu HP letaknya setelah Contact. Bisa cari Jou/Bou dari nama atau nomor yang dikenal, termasuk saran kalau salah ketik.

Hasilnya harus menuju karya yang sesuai. Jangan bikin proyek atau cerita palsu buat ngisi hasil kosong. Pas ditutup, overlay-nya ikut hilang; di HP input jangan ketutup keyboard. Nggak perlu bikin halaman daftar proyek baru buat gantiin search.

## Bou Works dan tombol silang

Kalau masuk dari homepage, tutupnya balik ke homepage. Kalau masuk dari About, balik ke About. Jangan bikin tombol silang selalu balik ke satu tempat tanpa lihat asalnya.

Bou yang aktif sekarang tetap pakai konten yang ada. Bangunan interior berlapis masih konsep, belum jadi fiturnya.

## Detail dan foto

Buka dari peta, URL langsung, atau link lama yang dikenal harus ketemu karya yang sama. Reload, Back, Forward, dan tombol tutup jangan bikin URL ngaco atau foto hilang.

Galeri tetap enak dibuka/ditutup di HP tegak maupun mendatar. Konten teks/foto statis jadi cadangan kalau aplikasi belum siap, lalu hilang setelah detail normal kebuka. Jangan dua tampilan muncul bareng.

## `lets talk~`

Tombol ini ada **di detail proyek aja**, nggak ditempel ke seluruh peta. Pesannya:

```
Halo Jou and Bou, saya tertarik dengan proyek [nama]. Boleh ngobrol lebih lanjut?

[link proyek]
```

Nomor sama template ada di `site/project-inquiry.mjs`. Kalau ganti kontak, konfirmasi dulu ke pemilik studio, terus tes link WhatsApp-nya juga.

## Nama dan link yang dipakai

| Bagian | Pakai ini |
| --- | --- |
| Jou / peta | `/#projects` |
| About | `/#about` |
| Bou | `/#bou-works` |
| Proyek publik | `/projects/.../` atau `/projects/bou/.../` |
| Domain utama | `https://jouandbou.com` |
| Nama situs dan judul homepage | `jou and bou studio` |
| Favicon | Satu `/favicon.ico`, dipilih Worker; jangan ditimpa JavaScript |

Judul proyek tetap pakai nama karya. Deskripsi jelasin isi/layanan, bukan cuma ngulang nama studio. Gambar preview harus sesuai proyek yang dibagikan.

Browser dapat ikon putih, crawler yang dikenali dapat hitam berlatar putih. Bentuk dan ukuran mark sama. Google tetap punya keputusan dan cache sendiri. Detailnya di [panduan favicon](favicon-behavior.md).

## Kalau gagal loading

Link proyek dan kontak tetap harus bisa ditemukan lewat tampilan cadangan. Proyek publik juga punya teks dan foto yang kebaca tanpa JavaScript.

Halaman kosong, salah karya, foto hilang, atau tombol kontak nggak bisa dipakai itu masalah fungsi. Jangan dianggap cuma beda tampilan.

## Sebelum ubah desain

Coba alur yang sama di HP kecil, HP mendatar, dan desktop. Kalau ngubah kamera, intro, menu, atau tombol, simpan screenshot/video sebelum dan sesudah. Satu screenshot bagus belum berarti semua device udah beres.

Cara tes dan deploy lanjut di [panduan kerja](operasional-handover.md).
