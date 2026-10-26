# Website ini mau dibawa ke mana?

PRD Jou and Bou · update 26 Oktober 2026 · branch `migration/jou-and-bou`.

PRD itu pegangan soal tujuan website. Jadi kalau nanti bukan gue yang pegang, orang berikutnya tetap ngerti mau dibawa ke mana.

## Tujuannya simpel

**Orang kenal Jou and Bou, bisa menikmati karyanya, terus gampang ngajak ngobrol.**

Website ini buat showcase. Peta 3D bikin orang bisa eksplor, foto sama cerita bantu jelasin desainnya, dan WhatsApp jadi jalan buat mulai percakapan. Orang ngeklik WhatsApp belum tentu udah kirim pesan atau jadi calon klien.

## Siapa yang perlu dimudahin?

- Yang datang dari Instagram atau link teman dan pengen langsung lihat karya.
- Yang nemu studio atau proyek lewat Google.
- Orang yang nggak biasa pakai website 3D, termasuk yang lebih tua.
- Tim yang nanti update portofolio tanpa bikin link atau fitur lama rusak.

## Dibilang berhasil kalau gimana?

| Yang gue pengen | Cara ngeceknya |
| --- | --- |
| Karya gampang dicari | Cari nama proyek di HP dan desktop, terus buka hasil yang sesuai |
| Link nggak bikin nyasar | Buka link langsung, reload, dan coba link lama; harus masuk ke karya yang benar |
| Gampang ngajak ngobrol | Tekan `lets talk~`; WhatsApp buka pesan dengan nama dan link proyek yang sesuai |
| Orang awam ngerti petanya | Minta orang baru coba sendiri; lihat apakah bisa pilih rumah dan nemu detail tanpa dituntun |
| Nama dan logo konsisten | Cek metadata, favicon, preview link, lalu pantau hasil Google setelah dibaca ulang |
| Enak dipakai di HP | Coba HP asli dan koneksi seluler; jangan ada menu, foto, atau tombol yang ketutup |

Ini patokan yang mau dicapai, bukan klaim kalau semuanya udah diukur. Target angka traffic, inquiry, dan loading belum ditentuin. Ukur kondisi awal dulu sebelum ngomong naik berapa persen.

## Yang udah ada

| Bagian | Kondisinya |
| --- | --- |
| Peta 3D | 25 model yang bisa dipilih |
| Search | Proyek Jou + tujuh Bou, termasuk saran salah ketik |
| Link proyek publik | 15 URL, lengkap dengan teks, metadata, dan gambar preview |
| Foto dan cerita | Ada buat proyek yang kontennya udah siap; jumlah model bukan jumlah cerita lengkap |
| WhatsApp | Ada di detail proyek; pesan bawa nama dan link karya |
| About, Bou Works, Contact | Pakai section/panel yang udah ada |
| Intro peta | Muncul lagi pas refresh, hilang setelah interaksi |
| Kalau aplikasi gagal loading | Ada tampilan cadangan berisi link proyek dan kontak |
| Link lama | Yang udah dikenal diarahkan ke tujuan yang sesuai lewat aturan redirect |
| Nama situs dan judul homepage | `jou and bou studio` |
| Favicon | Satu `/favicon.ico`; Worker kasih hitam ke crawler yang dikenali dan putih ke browser |

Udah ada di kode bukan berarti udah dicek di website aktif. Bukti dan yang belum dicek dicatat di [panduan kerja](operasional-handover.md).

## Yang masih ditahan

| Ide | Sampai mana? |
| --- | --- |
| Interior berlapis | Masih konsep. Butuh GLB interior dan interaksi yang udah disepakati |
| Dashboard, database, CRM | Hold dulu; fungsi showcase belum perlu itu |
| Analitik tambahan | Pakai Cloudflare dan Search Console dulu |
| Motion sosmed | Materi terpisah; video disetujui bukan berarti website ikut diubah |
| Ganti tulisan `full package` | Belum ada pilihan final, jadi jangan diganti dulu |

Bou Works yang sekarang jangan dianggap sama dengan konsep interior berlapis.

## Yang perlu dijaga

- Masuk ke karya lewat peta dan Bou Works yang udah ada. Nggak perlu bikin index proyek baru.
- Jangan munculin lagi tombol share, badge status, atau dashboard cuma karena pernah ada di eksperimen.
- Pakai model, foto, dan logo asli studio. Jangan ganti modelnya jadi dummy atau gambar generatif.
- Tetap minimalis. Fitur baru harus bikin orang lebih gampang, bukan sekadar ngisi ruang kosong.
- Link proyek tetap bisa dibuka langsung dan dibagikan. Teks/foto harus kebaca walau aplikasi 3D belum jalan.
- Jangan janji ranking Google atau kapan preview WhatsApp berubah. Itu bukan sepenuhnya kita yang ngatur.

## Lanjut dari mana?

1. Catat akses, penanggung jawab, deployment aktif, dan hasil cek favicon versi Google.
2. Coba alur utama di HP asli, terus minta orang awam nyobain tanpa dituntun. Benerin hambatan yang kelihatan dulu.
3. Lengkapi foto dan cerita proyek yang siap dipublikasi.
4. Sebulan sekali lihat Search Console dan Cloudflare, baru tentuin perbaikan berikutnya.
5. Interior berlapis lanjut kalau aset sama arahnya udah disepakati.

Ini urutan yang disaranin, belum jadi janji tanggal rilis.

## Kalau mau nambah atau ngubah sesuatu

Jelasin singkat: masalahnya apa, siapa yang kena, mau diubah jadi apa, dan cara tahu hasilnya bener. Arah visual, copy utama, fitur baru, dan publikasi karya dikonfirmasi ke pemilik studio. Yang ngerjain catat hasil tes dan deploy-nya.

Kerjaan selesai kalau udah dibuat, dicek, dicatat, dan—kalau memang mau dirilis—udah terpasang di deployment yang benar. Push GitHub aja belum cukup.

Lanjut ke [fitur dan desain](perilaku-desain.md) atau [kerja dan handover](operasional-handover.md).
