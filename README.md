# Sapago x Substories Demo

Clone lokal dari https://business.substories.co.id/ untuk demo client Substories, dibuat 25 Oktober 2026.

## Menjalankan

Klik dua kali `Jalankan Demo.command` di Finder, lalu buka http://localhost:4173.

Atau melalui Terminal:

```sh
cd '/Users/vidi/Documents/LocalApp Project/SapaGo Demos/Sapago x Substories Demo'
npm start
```

Node.js diperlukan. Server memakai modul bawaan Node sehingga tidak perlu install dependency untuk menjalankan demo. Server hanya menerima koneksi dari komputer lokal. Jika port sudah dipakai, jalankan `PORT=4174 npm start`.

## Isi clone

- Seluruh 16 bagian landing page sumber, termasuk hero, masalah/kebutuhan bisnis, alasan memilih Substories, produk, material, testimonial, portfolio, FAQ, dan footer.
- Gambar, latar, logo, font, dan stylesheet disimpan dalam `dist/assets/`. Seluruh halaman dapat ditampilkan tanpa koneksi internet.
- Navigasi desktop/mobile, kedua galeri gambar, swipe galeri di mobile, testimonial, dan FAQ berfungsi menggunakan JavaScript lokal.
- Tombol konsultasi dan katalog membuka form demo. Submit memvalidasi nomor telepon dan nama usaha, lalu menampilkan konfirmasi lokal. Data tidak disimpan maupun dikirim ke backend client.
- Website sumber menggunakan permintaan katalog melalui form yang berujung ke WhatsApp, bukan tautan PDF langsung. Clone mempertahankan tombol dan popup permintaan katalog dalam mode simulasi.
- Link sosial, toko utama Substories, dan Google Maps tetap mengarah ke situs aslinya dan memerlukan internet saat diklik.
- Deployment Vercel menyajikan `dist/` sebagai website statis. Konfigurasi tersedia di `vercel.json`; server Node lokal tidak dijalankan di Vercel.

## Widget Sapago

Widget resmi Sapago khusus Substories sudah diaktifkan melalui `dist/sapago.config.js`:

```js
window.SAPAGO_CONFIG = {
  publicKey: 'lc_pk_S5TVST9zc6xP5PFp62-j1fHkgrTHnCzx',
  scriptUrl: 'https://sapago.id/livechat/widget.js',
  apiUrl: 'https://api.talky.id/v1/public/livechat',
  widgetUrl: 'https://sapago.id/livechat/widget'
};
```

Sesuaikan URL jika script embed resmi Substories berbeda. Refresh browser setelah mengubah konfigurasi. Loader memasang script resmi dengan atribut `data-api-key`, `data-api-url`, dan `data-widget-url`. Widget resmi membutuhkan internet dan konfigurasi domain yang mengizinkan localhost.

Jika konfigurasi key dikosongkan, tombol Sapago menampilkan informasi bahwa widget menunggu aktivasi. Tombol ini bukan chatbot AI. Public key dari client lain tidak digunakan.

## Struktur

- `dist/`: website lokal yang dijalankan server.
- `scripts/server.mjs`: server HTTP lokal tanpa dependency runtime.
- `scripts/mirror.mjs`: pengambilan aset dan konversi snapshot HTML ke clone lokal.
- `source/original.html`: snapshot HTML publik sumber.
- `source/asset-manifest.json`: pemetaan URL sumber ke aset lokal beserta hasil unduh.
- `qa/`: screenshot sumber/lokal serta laporan pemeriksaan.

## Verifikasi dan pemeliharaan

Dependency pengembangan sudah terpasang. Jika memindahkan project ke komputer lain, jalankan `npm ci` untuk menggunakan script pemeliharaan. Pemeriksaan browser menggunakan Google Chrome yang terpasang:

```sh
npm start
# Terminal kedua:
npm run check
```

Pemeriksaan menonaktifkan widget hanya dalam sesi pengujian dan memblokir jaringan eksternal untuk memastikan aset halaman benar-benar lokal, lalu memeriksa gambar, FAQ, galeri, form, status widget, dan menu mobile. Hasil disimpan di `qa/report.json`.

`npm run mirror` membangun ulang HTML dari snapshot sumber dan aset publik. Konfigurasi widget serta `demo.js`/`demo.css` tetap tersimpan. CSS sumber yang memiliki host/URL gambar salah ketik telah diperbaiki saat proses mirror.

Ini adalah salinan frontend publik. Backend CRM, pengiriman lead, dan layanan percakapan Sapago tidak disalin atau disimulasikan sebagai layanan aktif.
