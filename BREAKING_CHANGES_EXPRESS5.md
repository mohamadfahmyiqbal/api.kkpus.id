# Dokumentasi Catatan Perubahan & Pembaruan Express 5 (`api.kkpus.id`)

## 1. Pembaruan Dependensi & Keamanan
- **Migrasi XLSX ke ExcelJS:** Seluruh dependensi impor dan ekspor file spreadsheet yang sebelumnya menggunakan pustaka `xlsx` (SheetJS) telah sepenuhnya dimigrasikan menggunakan pustaka `exceljs` dan modul helper mandiri `utils/excelGenerator.js`. Hal ini dilakukan guna memitigasi kerentanan keamanan Prototype Pollution dan ReDoS (CWE-1321, CWE-1035).
- **ESLint Flat Config:** Konfigurasi linter telah diperbarui ke konfigurasi ESLint standar modern dengan exit code 0.

## 2. Perubahan Pola Routing di Express 5
Express 5 menggunakan parser jalur rute `path-to-regexp` versi terbaru (v0.1.x/v8.x):
- **Wildcard Matching (`*`):** 
  Sintaks wildcard route catch-all `app.use('*', ...)` atau `router.get('/path/*', ...)` memerlukan penamaan parameter eksplisit seperti `/*splat` atau format regex resmi Express 5 agar tidak memicu ambiguitas parsing atau ReDoS warning.
- **Penanganan Error Terpusat:**
  Pada Express 5, error yang terjadi di dalam blok fungsi asynchronous (`async/await`) diteruskan secara otomatis ke error handling middleware tanpa perlu dibungkus secara manual ke dalam callback `next(err)`.

## 3. Skrip Pengujian
- `npm test`: Menjalankan seluruh test suite (`test/*.test.js`).
- `npm run test:pure`: Menjalankan suite pengujian unit murni yang independen dari koneksi database MySQL lokal/staging.
