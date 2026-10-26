# Kalau nanti bukan gue yang pegang

Panduan kerja dan handover · update 26 Oktober 2026.

Mulai dari [PRD](prd.md) buat ngerti tujuannya, terus [panduan fitur](perilaku-desain.md) buat ngerti feel dan alurnya. Di sini isinya cara ngerawat, update, rilis, dan benerin kalau ada yang rusak.

## Gambaran sistemnya

```text
GitHub → build → Cloudflare Pages → website, proyek, foto, metadata

Kode Worker → deploy terpisah ke jnb-favicon → pilihan ikon tab / Google

Search Console → lihat indexing dan pencarian
WhatsApp → mulai percakapan dengan studio
```

Belum ada database, admin konten, atau CRM khusus. Update konten lewat file. Font dan layanan peta luar masih butuh internet; cache foto di browser bukan berarti seluruh website bisa dipakai offline.

## Yang perlu lu tahu dulu

| Bagian | Catatannya |
| --- | --- |
| Repo | `rafiadiguna3-lgtm/jouandbou-website` |
| Kode pengembangan sekarang | `migration/jou-and-bou` |
| `main` | Masih kode website lama, walaupun README-nya udah dirapihin |
| Project Pages | Di screenshot pemilik namanya `jouandbou-test` |
| Domain | `https://jouandbou.com`; `www` diarahkan ke domain utama |
| Worker | `jnb-favicon`, sumber kode di `cloudflare/favicon-worker.mjs` |
| Route Worker | `jouandbou.com/favicon.ico` dan `www.jouandbou.com/favicon.ico` |
| Failure mode | `Fail open (proceed)`; kalau Worker dilewati, ada ICO putih statis |
| Build | `npm run build`, output `dist`, Node.js `24` |
| WhatsApp di kode | `628118111439`; konfirmasi pemilik kalau mau diganti |

Nama project ada kata “test” bukan otomatis salah. Yang dicek itu domain, branch, commit, dan deployment yang dipakai.

## Yang udah dicek vs yang belum

Tes lokal metadata, routing, aset, dan Worker pernah dijalanin; hasilnya ada di `docs/migration-status.md`. Pemilik udah konfirmasi dua route terpasang dan lihat ikon putih setelah error Worker dibenerin. Aset PNG hitam/putih di Pages juga sempat diakses dengan hasil 200.

Yang **belum ada bukti lengkapnya**: respons hitam buat Google di endpoint production, branch/commit Pages yang aktif, aturan cache akun, dan hasil tes di perangkat nyata. Cek langsung dari dashboard/perangkat, terus isi tabel rilis di bawah. Jangan nganggap tes lokal sama dengan cek website aktif.

## Siapa pegang apa?

Isi sebelum handover beres. Satu orang boleh pegang beberapa peran, yang penting jelas siapa yang dihubungi.

| Bagian | Harus bisa apa? | Siapa? |
| --- | --- | --- |
| Pemilik produk | Mutusin arah visual, copy utama, publikasi karya, dan prioritas | Belum dicatat |
| GitHub | Baca/edit kode, review, dan balikin perubahan | Belum dicatat |
| Cloudflare Pages + domain | Cek build, deploy, DNS, domain, dan rollback | Belum dicatat |
| Worker favicon | Edit, deploy, lihat log, dan cek route | Belum dicatat |
| Search Console | Cek indexing, sitemap, dan pencarian | Belum dicatat |
| Konten + kontak | Siapin materi yang boleh tayang dan nerima inquiry | Belum dicatat |

Akses diserahin lewat undangan akun. Password, token, kode pemulihan, dan data calon klien jangan ditaruh di repo; pakai pengelola password buat yang rahasia.

## Sebelum mulai ngedit

1. Buka Pages di Cloudflare. Catat production branch dan commit aktif.
2. Ambil kode yang sesuai. Cek dulu ada perubahan orang lain yang belum disimpan atau nggak.
3. Jalanin `npm ci`, terus `npm run dev`. Lihat kondisi awal sebelum diubah.
4. Cocokkan permintaan sama PRD. Kalau belum jelas, tulis dulu hasil yang dimau.

Jangan merge semua kode ke `main` cuma biar README-nya sama. Ganti branch deploy atau gabung kode itu pekerjaan rilis sendiri, perlu ditinjau.

## Mau ubah apa, bukanya di mana?

| Mau ngubah… | Mulai di sini |
| --- | --- |
| HTML awal dan identitas homepage | `site/index.html` |
| Metadata/routing proyek | `site/project-seo.mjs`, `site/project-routing.mjs` |
| Judul pas About/Contact/proyek kebuka | `site/about.mjs`; harus selaras sama metadata |
| Search | `site/project-search.mjs` |
| WhatsApp | `site/project-inquiry.mjs` |
| Daftar proyek publik | `scripts/build-project-catalog.mjs` → `site/project-catalog.mjs` |
| Materi Bou | `site/bou-projects.json` |
| Preview link | `scripts/build-project-previews.mjs` |
| Intro peta | `site/phone-map-guide.mjs`, `site/world-guide.css` |
| Link lama/domain | `site/_redirects` |
| Favicon | `cloudflare/favicon-worker.mjs` |
| Foto | Folder proyek di `site/assets/` |

Cerita Jou masih ada di panel HTML dan dibaca pembuat katalog. Jangan cuma edit file hasil katalog terus sumbernya ketinggalan.

Metadata juga belum semua ngambil dari satu file: HTML awal, route, dan pengelola judul About harus sama-sama dicek. Jangan nambah penimpa metadata baru di Worker buat nutup masalah itu.

## Cara update konten

Buat edit kecil, ubah sumbernya, catat alasan di `docs/migration-status.md`, terus:

```sh
npm run manifest:update
npm run build
```

Manifest itu daftar file dan pemeriksaan isinya. Perintah update cuma ngurus file yang udah tercatat. Kalau nambah file publik, daftarin asal dan hash-nya juga di `docs/source-manifest.json`.

Kalau ngubah proyek publik, siapin nama, foto, cerita, dan izin tayangnya dulu. Edit sumber Jou/Bou dan daftar di `scripts/build-project-catalog.mjs` sesuai kebutuhan, terus:

```sh
npm run build:project-catalog
npm run build:project-previews
npm run manifest:update
npm run build
```

Bikin preview butuh Chromium. Deploy biasa pakai hasil yang udah disimpan di GitHub, nggak perlu bikin ulang gambarnya.

Pertahanin URL yang udah dibagikan. Kalau alamat harus berubah, arahkan link lama ke karya yang sesuai. Jangan semua error dilempar ke homepage.

Ganti foto di alamat file yang sama? Cek cache di `site/photo-offline-sw.js`. Ini beda dari Worker favicon Cloudflare.

## Cek sebelum rilis

```sh
npm run build
npm test
node --test tests/favicon-worker.test.mjs
npx playwright test tests/browser/metadata.spec.mjs tests/browser/project-seo.spec.mjs
```

Kalau ngubah tampilan/interaksi, jalanin tes browser yang kena dan coba di HP kecil, HP mendatar, sama desktop. Tes lengkap ada di `npm run test:browser`. Sebagian tes guide/device lama masih ngikut perilaku terdahulu. Kalau gagal, cari dan catat sebabnya; jangan asal ubah tes biar hijau.

Checklist yang dicoba:

- [ ] Homepage/intro muncul, nggak ada teks lama kedip.
- [ ] Search Jou/Bou masuk ke karya yang benar.
- [ ] Pilih rumah → 3D → detail → foto → WhatsApp jalan.
- [ ] Nama dan link di pesan WhatsApp sesuai karya.
- [ ] About, Contact, Bou, silang, Back, dan Forward nggak bikin nyasar.
- [ ] Link proyek bisa dibuka langsung/reload; teks dan foto tetap ada tanpa JavaScript.
- [ ] Balik ke homepage, judulnya tetap `jou and bou studio`.
- [ ] Di HP nggak ada tombol ketutup, teks kepotong, atau halaman melebar.

Simulasi HP di komputer bukan iPhone/Safari asli. Coba perangkat beneran dan koneksi seluler buat ngerasain loading sama responsnya.

## Pasang perubahan

**Website / Pages:** push ke branch yang dituju, tunggu deployment sukses, terus cocokkan commit-nya. Build pakai `npm run build`, output `dist`, Node.js `24`. Tes lagi di domain aktif: homepage, satu Jou, satu Bou, link lama, foto, dan WhatsApp. Kalau deploy gagal, kerjaannya belum selesai walau lokal lolos.

**Worker favicon:** buka `jnb-favicon` → Edit code, cocokkan dengan `cloudflare/favicon-worker.mjs`, terus Deploy. Push repo **nggak otomatis** update Worker ini. Dua route tetap, Access OFF, dan jangan paksa cache satu respons buat semua pengunjung.

Browser harus dapat putih, User-Agent `Google Favicon` hitam, dengan `image/png` dan `Cache-Control: no-store`. Kedua PNG tertanam di kode Worker; kalau logo diganti, update gambar tertanamnya juga. Ganti aset di Pages aja belum ngubah Worker.

## Catat rilisnya, biar yang nerusin nggak nebak

| Yang dicatat | Kondisi sekarang / isi berikutnya |
| --- | --- |
| Tanggal dan pelaksana | Belum dicatat |
| Production branch Pages | Cek dashboard |
| Commit website aktif | Cek deployment |
| Versi deploy Worker | Cek dashboard Worker |
| Domain dan link lama | Catat hasil pengecekan |
| Favicon browser / Google | Putih dilaporkan pemilik; versi Google masih perlu bukti |
| HP/browser asli yang dicoba | Belum dicatat |
| Versi buat rollback | Pilih deployment sukses terakhir yang diketahui bekerja |

## Kalau error, mulai dari mana?

| Yang kejadian | Cek dulu |
| --- | --- |
| Update GitHub nggak muncul | Branch, commit, status deploy Pages |
| Favicon error 1101 | Worker → Observability → Logs; ambil pesan error-nya. Fail open nggak menangani semua error kode |
| Ikon tab masih lama | Respons `/favicon.ico`, cache browser, sama alamat ikon di HTML |
| Nama/logo Google masih lama | Respons crawler, metadata, redirect, tanggal crawl; cek browser biasa aja belum cukup |
| Foto hilang dari link proyek | Lokasi file, base URL, cache foto, dan hasil build |
| Peta gagal loading | Cek tampilan cadangan dan teks/foto statis proyek |
| Link lama error | Aturan spesifik di `_redirects` dan deployment yang memuatnya |

Butuh matiin Worker sementara? Lepas kedua route, biar pakai ICO putih statis. Ini pemulihan browser sementara, bukan perbaikan ikon Google.

Buat balikin website, rollback ke deployment Pages sukses yang udah diketahui bekerja. Worker dibalikin versinya **terpisah**. Abis pulih, catat versi dan masalahnya, baru siapin perbaikan. Jangan ganti DNS atau force-push riwayat cuma buat batalin satu perubahan tampilan.

## Rutinitasnya nggak perlu ribet

| Kapan? | Ngapain? |
| --- | --- |
| Tiap rilis | Coba alur utama, cocokkan deploy, catat hasil |
| Ada proyek baru | Cek konten, link, preview, sitemap, WhatsApp |
| Sebulan sekali | Lihat Search Console/Cloudflare dan coba lagi di HP |
| Ganti tim | Cek akses, keputusan yang ditunda, dan latihan handover |

Traffic Cloudflare bukan jumlah calon klien. Klik WhatsApp juga belum tentu pesan terkirim. Sebelum bikin dashboard baru, tentuin dulu pertanyaan bisnis yang perlu dijawab.

## Handover dibilang beres kalau…

- [ ] Yang nerusin ngerti tujuan showcase dan prioritasnya.
- [ ] Jelas siapa pemilik produk dan pelaksana teknisnya.
- [ ] Akses GitHub, Pages, Worker, domain, Search Console udah dicoba.
- [ ] Branch/commit aktif dan versi rollback udah dicatat.
- [ ] Bisa jalanin website, ubah satu teks, build, dan cek hasil sendiri.
- [ ] Ngerti Pages dan Worker deploy-nya beda.
- [ ] Bisa nemu log error dan tahu cara balikin versi.
- [ ] Paham interior berlapis/dashboard itu masih rencana.
- [ ] Yang belum terverifikasi tetap dicatat, bukan dianggap otomatis aman.

**Bukan cuma kirim dokumen. Coba bareng satu update kecil sampai beres.**

Kalau tujuan berubah, update [PRD](prd.md). Kalau interaksi berubah, update [panduan fitur](perilaku-desain.md). Kalau proses kerja berubah, update dokumen ini. Riwayatnya masuk ke `migration-status.md`.

Bacaan teknis: [SEO](project-seo.md), [favicon](favicon-behavior.md), [domain](www-domain.md), [Cloudflare](cloudflare-security.md). Dokumen lama bisa nyeritain keadaan waktu itu; kalau beda, cocokkan kode dan panduan utama sebelum dipakai.
