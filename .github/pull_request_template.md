## Ringkasan Perubahan
<!-- Jelaskan secara singkat fitur, bug fix, atau refactor yang dikerjakan -->

## Jenis Perubahan
- [ ] Fitur Baru (feat)
- [ ] Perbaikan Bug (fix)
- [ ] Refactor Kode (refactor)
- [ ] Dokumentasi (docs)
- [ ] Keamanan & Dependensi (security / deps)
- [ ] Konfigurasi CI/CD (ci)

## Checklist Kepatuhan Keamanan (ISO/IEC 27001 & OWASP)
- [ ] **Bebas Kredensial**: Tidak ada hardcoded secret, token, password, atau API key di commit (sudah lolos scan Gitleaks).
- [ ] **Validasi Input**: Validasi batas input (schema request body, pagination, sanitasi tipe data).
- [ ] **Error Handling**: Tidak membocorkan stack trace atau `error.message` internal ke respons HTTP 500.
- [ ] **Rate Limiting**: Endpoint sensitif (auth, payment, upload) dilindungi rate limiter.
- [ ] **Privasi Data**: Data PII (NIK, nomor telepon, email) disanitasi / di-masking sebelum ditulis ke log.
- [ ] **Kriptografi**: Menggunakan algoritma standar yang di-pin (misal: HS512 / SHA-256).

## Pengujian & Verifikasi
- [ ] `npm run lint` lulus tanpa warning baru.
- [ ] `npm run test:ci` (atau `test:pure`) lulus.
- [ ] Tidak ada penambahan dependensi dengan vulnerability status High/Critical (`npm audit`).

## Referensi Tiket
- Terkait issue / tiket: #
