# Kebutuhan website Jou and Bou

Pegangan produk · diperbarui 26 Oktober 2026 · berlaku untuk branch `migration/jou-and-bou`.

PRD adalah catatan tentang tujuan dan kebutuhan website. Dokumen ini membantu tim memutuskan apa yang perlu dibuat, dijaga, atau ditunda.

## 1. Tujuan utama

**Orang bisa mengenal Jou and Bou, menikmati karya, lalu mudah memulai percakapan dengan studio.**

Website berfungsi sebagai showcase. Peta 3D adalah cara menjelajahi karya, sedangkan foto dan cerita membantu orang memahami hasil desainnya. WhatsApp menjadi jalur percakapan, bukan bukti bahwa pengunjung sudah menjadi calon klien.

## 2. Siapa yang memakai

| Pengunjung | Kebutuhan |
| --- | --- |
| Calon klien dari Instagram atau link teman | Cepat melihat karya dan menemukan kontak |
| Orang yang mencari studio/proyek di Google | Masuk ke halaman yang sesuai, tanpa error |
| Pengunjung awam, termasuk yang lebih tua | Mengerti apa yang bisa disentuh/diklik tanpa penjelasan teknis |
| Tim studio | Memperbarui portofolio tanpa merusak link dan pengalaman yang sudah ada |

## 3. Hasil yang ingin dicapai

| Sasaran | Cara memeriksa | Patokan kerja |
| --- | --- | --- |
| Karya mudah ditemukan | Cari nama proyek dari HP dan komputer | Proyek yang tersedia bisa ditemukan dan dibuka |
| Link bisa diandalkan | Buka link proyek langsung, reload, lalu coba link lama | Tujuan benar; proyek yang ada tidak menjadi halaman error |
| Kontak mudah digunakan | Buka detail proyek dan tekan `lets talk~` | WhatsApp membuka pesan dengan nama dan link proyek yang benar |
| Orang awam paham peta | Minta orang yang belum pernah memakai mencoba sendiri | Bisa memilih rumah dan menemukan detail tanpa diarahkan tim |
| Identitas konsisten | Periksa judul, nama situs, favicon, dan preview link | Sesuai panduan; perubahan Google dicatat setelah crawl ulang |
| Nyaman di HP | Tes perangkat nyata dengan koneksi seluler | Menu, search, peta, foto, dan kontak dapat digunakan tanpa tertutup elemen lain |

Ini adalah patokan penerimaan, bukan klaim hasil pengukuran. Belum ada target angka traffic, konversi, atau waktu loading yang disepakati. Catat kondisi awal sebelum menetapkan target angka; jangan mengarang peningkatan.

## 4. Yang sudah ada di kode

| Fitur | Kondisi saat ini |
| --- | --- |
| Peta dan model 3D | 25 model proyek yang dapat dipilih |
| Pencarian | Jou dan tujuh proyek Bou, dengan saran salah ketik |
| Proyek yang dipublikasikan | 15 URL proyek dengan teks, metadata, dan gambar preview |
| Foto dan cerita | Ada pada proyek yang sudah memiliki konten; jangan menyamakan jumlah model dengan jumlah cerita lengkap |
| WhatsApp | Tombol di detail proyek, pesan menyertakan nama dan link proyek |
| About, Bou Works, Contact | Mengikuti section/panel yang sudah ada |
| Panduan awal peta | Muncul lagi saat refresh dan hilang setelah interaksi |
| Tampilan cadangan | Link proyek dan kontak tersedia jika aplikasi utama gagal dimuat |
| Pengalihan link lama | Aturan di kode mengarahkan URL lama yang dikenal ke tujuan yang sesuai |
| Identitas Google | Judul homepage dan nama situs di metadata: `jou and bou studio` |
| Favicon | Satu URL `/favicon.ico`; Worker memilih hitam untuk crawler yang dikenali dan putih untuk browser |

“Sudah ada di kode” tidak sama dengan “sudah diperiksa di production”. Bukti dan hal yang belum diverifikasi ada di panduan operasional.

## 5. Yang belum menjadi fitur aktif

| Rencana | Status / syarat lanjut |
| --- | --- |
| Pengalaman interior berlapis | Konsep; belum diimplementasikan. Butuh model interior GLB dan rancangan interaksi yang disetujui |
| Dashboard, database, dan CRM | Ditunda; belum dibutuhkan untuk fungsi showcase saat ini |
| Analitik khusus tambahan | Ditunda; mulai dari data Cloudflare dan Search Console yang tersedia |
| Motion untuk sosial media | Materi terpisah. Persetujuan video tidak otomatis mengubah animasi website |
| Nama pengganti `full package` | Ditahan; jangan mengganti berdasarkan eksplorasi copy yang belum dipilih |

Bou Works yang aktif tidak sama dengan konsep interior berlapis yang sedang dieksplorasi.

## 6. Batas yang harus dijaga

- Tidak menambah halaman index proyek terpisah; pintu masuk karya tetap peta dan Bou Works yang ada.
- Tidak menambah tombol share, status proyek, atau dashboard hanya karena pernah muncul di eksperimen lama.
- Model 3D, foto proyek, dan logo memakai aset studio. Jangan mengganti model asli dengan bentuk dummy atau hasil generatif.
- Visual tetap minimalis. Fitur baru harus menjawab kebutuhan pengunjung, bukan sekadar mengisi ruang kosong.
- Link proyek tetap bisa dibuka langsung, dibagikan, dan dibaca tanpa aplikasi 3D selesai dimuat.
- Jangan menjanjikan posisi Google, waktu indexing, atau kapan WhatsApp memperbarui gambar preview.

## 7. Urutan kerja berikutnya

1. Lengkapi catatan deployment aktif, pemegang akses, dan bukti favicon versi Google.
2. Tes alur utama di HP nyata dan minta satu pengunjung awam mencoba tanpa arahan. Catat hambatan sebelum mengubah desain.
3. Lengkapi cerita/foto proyek yang memang siap dipublikasikan.
4. Tinjau hasil Search Console dan Cloudflare tiap bulan, lalu pilih perbaikan berdasarkan masalah yang terlihat.
5. Lanjutkan konsep interior hanya setelah aset dan ruang lingkup disepakati.

Urutan ini adalah rekomendasi pemeliharaan, bukan komitmen tanggal rilis fitur baru.

## 8. Menentukan perubahan

Setiap usulan cukup menjawab: masalah siapa, bagian yang berubah, hasil yang diharapkan, dan cara mengeceknya. Pemilik studio menyetujui perubahan arah visual, copy utama, fitur baru, dan publikasi proyek. Pelaksana mencatat hasil tes dan deployment.

Sebuah pekerjaan selesai jika hasilnya sudah dibuat, diperiksa, dicatat, dan—jika memang diminta rilis—terpasang pada deployment yang benar. Push GitHub saja belum membuktikan website aktif sudah berubah.

Lanjut: [perilaku dan desain](perilaku-desain.md) · [operasional dan handover](operasional-handover.md).
