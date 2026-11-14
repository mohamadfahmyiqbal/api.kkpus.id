# Standar Operasional & Aturan Pengembangan API api.kkpus.id

Dokumen ini memuat standar teknis, konvensi commit, dan kontrol keamanan untuk setiap agent dan pengembang di sub-proyek `api.kkpus.id`.

---

## 1. Konvensi Pesan Commit (Conventional Commits)

Format commit: `<tipe>(<lingkup opsional>): <deskripsi ringkas dalam kalimat imperatif>`

Tipe yang diakui:
- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `refactor`: Perubahan struktur kode tanpa mengubah fungsionalitas
- `perf`: Optimasi performa
- `test`: Penambahan atau penyesuaian unit / integration test
- `docs`: Pembaruan dokumentasi
- `chore`: Tugas rutin atau pemeliharaan build
- `ci`: Perubahan pipeline CI/CD GitHub Actions
- `security`: Perbaikan kontrol keamanan, audit, atau patch vuln

Contoh:
- `fix(auth): enforce HS512 algorithm for jwt token signing`
- `feat(billing): add rate limiting on manual payment upload`

---

## 2. Prinsip Keamanan Wajib (ISO/IEC 27001:2022 & OWASP Top 10)

1. **Zero Hardcoded Secrets (Kontrol 8.24, 8.28)**:
   - Dilarang keras menaruh token, credential file, RSA private key, atau connection string riil di kode sumber.
   - Gunakan variabel lingkungan (`process.env`) dengan fallback dummy di mode test.
   - Semua commit diverifikasi oleh Gitleaks Secret Scanner di CI pipeline.

2. **Sanitasi Log & Privasi Data (Kontrol 8.10, 8.15)**:
   - Jangan pernah mencatat kata sandi, CVV, OTP, atau Authorization Header mentah ke `console.log` / `logger`.
   - Gunakan `utils/logSanitizer.js` atau `utils/dataMasking.js` untuk data PII.

3. **Proteksi Denial of Service (Kontrol 8.28)**:
   - Setiap endpoint POST/PUT publik harus dibatasi dengan middleware rate limit (`middleware/rateLimitMiddleware.js`).
   - Batasi ukuran file upload pada middleware Multer (maksimal 5MB).

4. **Fail-Closed & Generic Error Responses (Kontrol 8.28)**:
   - Response status 500 tidak boleh mengembalikan stack trace atau `error.message` internal ke client.

---

## 3. Alur Verifikasi Sebelum Pengajuan PR

Sebelum kode diajukan untuk merge:
1. `npm run lint` → 0 error, 0 warning.
2. `npm run test:pure` (dan `npm run test:ci` dengan DB aktif) → semua test lulus.
3. `npm audit` → tidak ada kerentanan status High atau Critical.
4. Pastikan PR menggunakan checklist dari `.github/pull_request_template.md`.
