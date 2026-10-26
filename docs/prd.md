# Tujuan dan Prioritas Website

PRD Jou and Bou · 26 Oktober 2026 · branch `migration/jou-and-bou`.

Dokumen ini merangkum tujuan, ruang lingkup, dan prioritas website agar tim berikutnya memiliki arah kerja yang sama.

## Tujuan

**Memperkenalkan Jou and Bou, menampilkan kualitas karya, dan memudahkan percakapan dengan calon klien.**

Peta 3D mengajak pengunjung menjelajahi karya. Foto dan cerita menjelaskan pendekatan desain. WhatsApp menjadi jalur kontak; klik tombolnya belum berarti pesan terkirim atau inquiry diterima.

## Pengguna

- Calon klien dari Instagram atau link yang dibagikan.
- Pengunjung yang menemukan studio dan proyek melalui Google.
- Pengunjung awam, termasuk pengguna yang belum terbiasa dengan website 3D.
- Tim studio yang memperbarui portofolio dan menjaga fungsi website.

## Indikator keberhasilan

| Sasaran | Cara memeriksa |
| --- | --- |
| Proyek mudah ditemukan | Pencarian di HP dan desktop membuka karya yang sesuai |
| Link dapat diandalkan | Link langsung, reload, dan URL lama menuju proyek yang benar |
| Kontak mudah diakses | `lets talk~` membuka WhatsApp dengan nama dan link proyek yang sesuai |
| Peta mudah dipahami | Pengguna baru dapat memilih rumah dan menemukan detail tanpa arahan |
| Identitas konsisten | Judul, nama situs, favicon, dan preview sesuai panduan; hasil Google dipantau setelah crawl ulang |
| Nyaman di HP | Menu, foto, peta, dan kontak dapat digunakan tanpa elemen yang tertutup |

Target angka traffic, inquiry, dan kecepatan loading belum ditetapkan. Ukur kondisi awal sebelum menentukan target peningkatan. Tabel ini adalah kriteria pemeriksaan, bukan laporan hasil pengukuran.

## Fitur saat ini

| Bagian | Status di kode |
| --- | --- |
| Peta 3D | 25 model yang dapat dipilih |
| Pencarian | Jou dan tujuh proyek Bou, dengan saran salah ketik |
| Halaman proyek publik | 15 URL dengan teks, metadata, dan gambar preview |
| Foto dan cerita | Tersedia pada proyek dengan materi yang sudah siap |
| WhatsApp | Tombol di detail proyek; pesan menyertakan nama dan link karya |
| About, Bou Works, Contact | Menggunakan section/panel yang sudah ada |
| Intro peta | Muncul pada refresh dan hilang setelah interaksi |
| Tampilan cadangan | Link proyek dan kontak tersedia jika aplikasi gagal dimuat |
| URL lama | Alamat yang dikenal diarahkan ke tujuan yang sesuai |
| Identitas situs | Judul homepage dan nama situs: `jou and bou studio` |
| Favicon | Satu `/favicon.ico`; Worker memilih hitam untuk crawler yang dikenali dan putih untuk browser |

Jumlah model tidak sama dengan jumlah cerita proyek lengkap. Status implementasi juga perlu dibedakan dari verifikasi website aktif; catatannya ada di [Panduan Pengelolaan](operasional-handover.md).

## Rencana yang ditunda

| Rencana | Syarat melanjutkan |
| --- | --- |
| Pengalaman interior berlapis | Model GLB interior dan rancangan interaksi disetujui; berbeda dari Bou Works yang aktif |
| Dashboard, database, dan CRM | Ada kebutuhan kerja yang jelas di luar fungsi showcase |
| Analitik tambahan | Evaluasi data Cloudflare dan Search Console terlebih dahulu |
| Motion sosial media | Dikelola sebagai materi terpisah, bukan perubahan otomatis pada website |
| Pengganti label `full package` | Menunggu pilihan copy final |

## Prinsip pengembangan

- Pertahankan peta dan Bou Works sebagai pintu masuk karya, tanpa halaman index proyek tambahan.
- Gunakan model, foto, dan logo asli studio.
- Jaga visual minimalis; fitur baru harus memudahkan pengguna.
- Pertahankan URL proyek yang dapat dibuka langsung, dibagikan, dan dibaca sebelum aplikasi 3D siap.
- Tombol share, badge status, dan dashboard dari eksperimen lama tidak termasuk fitur yang disetujui.
- Ranking Google, waktu indexing, dan pembaruan preview WhatsApp tidak dapat dijanjikan.

## Prioritas berikutnya

1. Lengkapi pemegang akses, deployment aktif, dan bukti favicon versi Google.
2. Uji alur utama pada HP nyata dan pengguna baru; perbaiki hambatan yang ditemukan.
3. Lengkapi foto dan cerita proyek yang siap dipublikasikan.
4. Evaluasi Search Console dan Cloudflare setiap bulan.
5. Lanjutkan konsep interior setelah aset dan ruang lingkup disepakati.

Urutan ini merupakan rekomendasi kerja, belum menjadi jadwal rilis.

## Persetujuan dan penyelesaian

Setiap usulan mencakup masalah, pengguna yang terdampak, hasil yang diharapkan, dan cara memeriksanya. Pemilik studio menyetujui arah visual, copy utama, fitur baru, dan publikasi karya. Pelaksana mencatat hasil tes dan rilis.

Pekerjaan selesai setelah dibuat, diperiksa, dan dicatat. Untuk pekerjaan yang dirilis, deployment aktif juga harus sesuai. Push ke GitHub belum menjadi bukti perubahan sudah tayang.

Lanjut: [Fitur dan Desain](perilaku-desain.md) · [Pengelolaan dan Serah Terima](operasional-handover.md).
