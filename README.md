# api.kkpus.id - KKPUS Ecosystem Backend

Backend API service untuk Koperasi Syariah KKPUS Ecosystem. Menyediakan layanan perbankan, pembiayaan syariah, kasir POS, dan manajemen anggota.

## 📋 Daftar Isi

- [Ikhtisar](#-ikhtisar)
- [Fitur Utama](#-fitur-utama)
- [Teknologi Stack](#-teknologi-stack)
- [Instalasi](#-instalasi)
- [Konfigurasi Lingkungan](#-konfigurasi-lingkungan)
- [Menggunakan Aplikasi](#-menggunakan-aplikasi)
- [API Endpoints](#-api-endpoints)
- [Keamanan](#-keamanan)
- [Kolaborasi dan Kontribusi](#-kolaborasi-dan-kontribusi)
- [Lisensi](#-lisensi)
- [Kontak](#-kontak)

---

## ✨ Ikhtisar

`api.kkpus.id` adalah platform backend utama untuk ekosistem Koperasi Syariah KKPUS. Mengelola:

- **Perbankan syariah** - Simpanan wadiah, mudharabah, dan tabungan
- **Pembiayaan syariah** - Pembiayaan berbasis profit-sharing, mudharabah, dan ijarah
- **Kasir & JualBeli** - Sistem point-of-sale untuk transaksi penjualan
- **Manajemen anggota** - Proses KYC, pendaftaran, dan manajemen peran
- **Laporan & Analytics** - Laporan keuangan, laporan keuangan, dan analisis kinerja
- **Integrasi Pembayaran** - Midtrans, DOKU, dan gateway pembayaran lainnya
- **Push Notification** - Notifikasi real-time untuk aktivitas anggota

Platform ini dirancang khusus untuk institusi keuangan syariah, mengikuti prinsip-prinsip akuntansi syariah dan aturan OJK (Otoritas Jasa Keuangan) Indonesia.

---

## 🚀 Fitur Utama

### 📊 Keuangan Inti
- **Simpanan** - Tabungan wadiah, tabungan mudharabah, tabungan berjangka
- **Pembiayaan** - Pembiayaan murabahah, mudharabah, ijarah, qardh
- **Bill & Payment** - Tagihan rutin, pembayaran multi-akun
- **Platform bisnis** - JualBeli POS, katalog produk, inventaris

### 👥 Manajemen Anggota & KYC
- **Profil anggota** - Data pribadi, status keanggotaan
- **Proses KYC** - Verifikasi dokumen, penilaian kredit
- **Peran & Izin** - Hierarki role pengurus, persetujuan multi-level
- **Dokumen keanggotaan** - Akta, sertifikat, kontrak

### 📱 Akses Seluler & Integrasi
- **API khusus** - 20+ endpoint untuk mobile dan web apps
- **Push notification** - Real-time alerts, pengingat pembayaran
- **Integrasi pembayaran** - Midtrans, DOKU, gateway tambahan
- **WebSocket** - Komunikasi real-time untuk aktivitas langsung

### 📊 Pelaporan & Analitik
- **Laporan keuangan** - Laporan bulanan, tahunan, dan komparatif
- **Lanjutan laporan** - Laporan PINJAMAN, laporan transaksi
- **Analytics** - KPI, metrik performa, dashboard analitik
- **Export laporan** - CSV, Excel, PDF, ekspor API

### 🔒 Keamanan & Kepatuhan
- **CSRF protection** - Token-based CSRF protection untuk semua POST/PUT/DELETE requests
- **Rate limiting** - Middleware untuk semua endpoint
- **Helmet.js** - Security headers compliance
- **JWT auth** - Bearer token dan cookie authentication
- **OWASP compliant** - Security best practices

---

## 🛠️ Teknologi Stack

| Layer | Technology | Version |
|------- diplomas securityOptions | Your existing technology stack |

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework

### Database
- **MySQL** - Primary database (production)
- **SQLite** - Local development/testing

### Authentication
- **JWT (JSON Web Tokens)** - Token-based authentication
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie handling

### Security
- **helmet** - Security headers middleware
- **express-rate-limit** - Rate limiting
- **csurf** - CSRF protection (custom implementation)

### API Documentation
- **OpenAPI 3.0** - Swagger UI documentation
- **YAML-based** - API specifications in `openapi.yaml`

### Testing & Quality
- **Vitest** - JavaScript testing framework
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting

---

## ⚙️ Instalasi

### Prasyarat
- Node.js 18+
- npm atau yarn
- MySQL server (production) atau SQLite (local)

### Persiapan Lokal (Development)

```bash
# Clone repository
git clone https://github.com/mohamadfahmyiqbal/api.kkpus.id

cd api.kkpus.id

# Instal dependencies
npm install

# Buat file .env dari contoh
# Copy dari .env.example
# Edit .env untuk konfigurasi database
git clone https://github.com/mohamadfahmyiqbal/api.kkpus.id
d:
   cd api.kkpus.id
   if not exist .env (
       copy .env.example .env
   )

# Edit .env sebagai berikut (development)
DB_DIALECT=sqlite
DB_STORAGE=./database/local-dev.sqlite
NODE_ENV=development
```

### Production Deployment

1. **Setup MySQL server**
2. **Buat user dan database**
   ```sql
   CREATE USER 'kkpusid'@'%' IDENTIFIED BY 'your_password';
   CREATE DATABASE koperasi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   GRANT ALL PRIVILEGES ON koperasi.* TO 'kkpusid'@'%';
   ```

3. **Config .env**
   ```env
   DB_DIALECT=mysql
   DB_HOST=your-mysql-server
   DB_PORT=3306
   DB_USER=kkpusid
   DB_PASSWORD=your_password
   DB_NAME=koperasi
   NODE_ENV=production
   ```

4. **Setup SSL certificates**
   - Copy SSL certificates ke `config/certs/production/`
   - Atur path yang benar di .env

5. **Deploy**
   ```bash
   npm run build
   node app.js
   ```

---

## 🌐 Konfigurasi Lingkungan

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | `development` | Aplikasi environment (
  development | production | test ) |

| `DB_DIALECT` | Yes | `mysql` | Database dialect (`mysql` atau `sqlite`) |

| `DB_HOST` | Varies | `localhost` | Database host |
| `DB_PORT` | Varies | `3306` | Database port |
| `DB_USER` | Yes | `root` | Database username |
| `DB_PASSWORD` | Yes | (kosong) | Database password |
| `DB_NAME` | Yes | `koperasi` | Database name |

| `DB_STORAGE` | Conditionally | `./database/local-dev.sqlite` | SQLite storage path |

| `JWT_SECRET` | Yes | (kosong) | Secret key for JWT signing |

| `HTTP_PORT` | No | `3000` | HTTP server port |
| `HTTPS_PORT` | No | `3445` | HTTPS server port |

| `SSL_KEY_PATH` | Conditionally | `config/certs/production/kkpusid.key` | SSL key path |
| `SSL_CERT_PATH` | Conditionally | `config/certs/production/kkpus_id.crt` | SSL certificate path |
| `SSL_CA_PATH` | Conditionally | `config/certs/production/ca.crt` | SSL CA path |

| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window (per IP) |
| `AUTH_RATE_LIMIT_MAX` | No | `10` | Max requests for auth endpoints |
| `LOGIN_RATE_LIMIT_MAX` | No | `10` | Max failed login attempts |

### Local Development (.env example)

```env
# Environment: Development
NODE_ENV=development

# Database - SQLite untuk lokal development
DB_DIALECT=sqlite
DB_STORAGE=./database/local-dev.sqlite

# Security
JWT_SECRET=your_development_jwt_secret_key_minimum_32_characters

# Server
HTTP_PORT=3000
HTTPS_PORT=3445

# Rate limiting
RATE_LIMIT_MAX_REQUESTS=200
AUTH_RATE_LIMIT_MAX=20
LOGIN_RATE_LIMIT_MAX=20
```

### Production (.env example)

```env
# Environment: Production
NODE_ENV=production

# Database - MySQL untuk production
DB_DIALECT=mysql
DB_HOST=your-mysql-server
DB_PORT=3306
DB_USER=kkpusid
DB_PASSWORD=your_production_password
DB_NAME=koperasi

# Security
JWT_SECRET=your_production_jwt_secret_key_minimum_32_characters

# SSL
SSL_KEY_PATH=config/certs/production/kkpusid.key
SSL_CERT_PATH=config/certs/production/kkpus_id.crt
SSL_CA_PATH=config/certs/production/ca.crt

# Server
HTTP_PORT=3000
HTTPS_PORT=3445

# Rate limiting
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=10
LOGIN_RATE_LIMIT_MAX=10
```

---

## 🚀 Menggunakan Aplikasi

### Local Development

```bash
# Development dengan Nodemon (auto-restart)
npm run dev

# Build dan start
git clone https://github.com/mohamadfahmyiqbal/api.kkpus.id
d:
   cd api.kkpus.id
   npm run build
   npm start
```

### API Endpoints

#### Health Check
```bash
# Health check endpoint
GET http://localhost:3000/health
GET https://api.kkpus.id/health

Response:
{
  "success": true,
  "status": "ok",
  "data": {
    "timestamp": "2026-11-10T12:00:00.000Z",
    "uptime": 12345,
    "environment": "development",
    "services": {
      "database": {
        "status": "ok",
        "message": "Connected"
      },
      "storage": {
        "status": "ok",
        "size_bytes": 1024
      }
    }
  }
}
```

#### API Documentation

Visit the API documentation di:
- `http://localhost:3000/api-docs`
- `https://api.kkpus.id/api-docs`

The OpenAPI 3.0 specification is available in `openapi.yaml`.

#### Contoh Penggunaan

```bash
# Health check
curl http://localhost:3000/health

# API docs (browser)
# Open http://localhost:3000/api-docs
```

---

## 🔒 Keamanan

### Perlindungan CSRF

Aplikasi ini menerapkan **CSRF protection** untuk semua endpoint state-changing (POST, PUT, DELETE) menggunakan **Double-Submit Cookie Pattern**:

1. **Token Generation** - GET `/api/auth/csrf-token`
2. **Token Validation** - All POST/PUT/DELETE endpoints validate CSRF token
3. **Cookie-based** - Token stored di browser cookie, verified via custom header

### Security Headers

Aplikasi ini menggunakan **helmet** middleware yang menyediakan:
- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Strict-Transport-Security

### Authentication

**JWT-based authentication** dengan:

- Access tokens menggunakan HMAC-SHA256
- Access token expiration: 24 hours
- Cookie-based session management
- Role-based access control

### Rate Limiting

**express-rate-limit** middleware:
- **General limit**: 100 requests per 15 minutes
- **Auth endpoints**: 10 requests per 15 minutes
- **Login attempts**: 10 attempts per 15 minutes
- **OTP requests**: 5 requests per 15 minutes

### Input Validation

- **ESLint** enforces code quality
- **Yup** untuk schema validation (jika digunakan)
- **Sanitization** untuk logging

### HTTPS

- **SSL/TLS 1.2/1.3**
- **Self-signed certificates** (development)
- **Production certificates** dari CA terpercaya

### Security Best Practices

✅ OWASP Top 10 compliant  
✅ HTTPS enforcement (production)  
✅ CSRF protection for all state-changing requests  
✅ Rate limiting untuk semua endpoint  
✅ Input validation and sanitization  
✅ Security headers (helmet)  
✅ JWT authentication with proper expiration  
✅ Secure cookie configuration (HttpOnly, Secure, SameSite)  

---

## 🤝 Kolaborasi dan Kontribusi

### Kontribusi Kode

1. **Fork repository**
2. **Buat branch** untuk fitur Anda
3. **Buat pull request** setelah pengujian

### Proses Review

- **Code review** wajib untuk PR
- **Tests harus lulus** sebelum merge
- **Documentation harus update**
- **Security checks** wajib passes

### Prinsip Commit

- **Commit deskriptif** dengan message yang jelas
- **Conventional Commits** format:
  ```
  feat: implement new feature
  fix: resolve security issue
  docs: update documentation
  style: code formatting
  refactor: restructure code
  test: add tests
  chore: maintenance tasks
  ```

---

## 📄 Lisensi

This project is licensed under the MIT License.

---

## 📞 Kontak

### GitHub
https://github.com/mohamadfahmyiqbal/api.kkpus.id

### Issues
Report bugs dan permintaan fitur di GitHub Issues.

### Documentation
Untuk dokumentasi tambahan, kunjungi repository GitHub dan baca:
- **OpenAPI**: `openapi.yaml`
- **Environment Variables**: `ENVIRONMENT_VARIABLES.md` (docs folder)

### Questions
For questions about the codebase, setup, atau deployment, silahkan kunjungi GitHub Issues.

---

*Terakhir diperbarui: November 10, 2026*
*Versi: 1.0.0*

---

## 📝 Catatan

### 🛡️ Tentang Keamanan

Aplikasi ini mengimplementasikan beberapa lapisan keamanan:

1. **CSRF Protection** (Layer 1)
   - Melindungi dari Cross-Site Request Forgery attacks
   - Menggunakan Double-Submit Cookie pattern
   - All state-changing endpoints protected

2. **Network Security** (Layer 2)
   - HTTPS/TLS 1.2/1.3
   - Security headers (helmet)
   - Rate limiting

3. **Authentication & Authorization** (Layer 3)
   - JWT-based authentication
   - Role-based access control
   - Secure password storage

4. **Input Validation & Sanitization** (Layer 4)
   - ESLint untuk quality
   - Sanitization untuk log
   - Validation untuk semua input

### 🏗️ Arsitektur

```
+-----------------------------------------------+
|                    Frontend                   |
+-----------------------------------------------+
         |
+-----------------------------------------------+
|                    API Gateway                |
+-----------------------------------------------+
|                 Express.js Application         |
+-----------------------------------------------+
|           Middleware Stack                   |
|  - helmet (security headers)                   |
|  - express-rate-limit (rate limiting)           |
|  - csurf (CSRF protection)                     |
|  - body-parser (request parsing)               |
+-----------------------------------------------+
|                Controller Layer               |
|  - authController (login, register, logout)    |
|  - memberController (member data)              |
|  - billController (billing operations)         |
|  - ... (other controllers)                     |
+-----------------------------------------------+
|               Service Layer                   |
|  - authService (authentication)                |
|  - dbService (database operations)             |
|  - logService (audit logging)                  |
|  - ... (other services)                        |
+-----------------------------------------------+
|              Model Layer                      |
|  - Member, Bill, Transaction, etc.             |
+-----------------------------------------------+
|              Database (MySQL/SQLite)           |
+-----------------------------------------------+
```

### 🔄 Alur Kerja Request

1. **Client → API** - Client mengirim request HTTP
2. **Middleware** - Helmet, rate limiting, CSRF validation
3. **Authentication** - JWT validation atau cookie auth
4. **Route Handler** - Controller logic
5. **Service Layer** - Business logic
6. **Database** - CRUD operations
7. **Response** - Formatted response

### 📊 Monitoring & Observability

- **Health Check** (`GET /api/health`) - Server status
- **Logging** - Structured logging untuk audit trail
- **Error Handling** - Centralized error handling
- **Performance** - Monitoring response times

### 🔄 API versioning

The application uses semantic versioning for API changes:

- **Major version** (breaking changes)
- **Minor version** (new features)
- **Patch version** (bug fixes)

API version is defined in `package.json` and follows semantic versioning.

---

*This documentation is automatically generated from the source code and may be updated as the application evolves.*

---

© 2026 mohamadfahmyiqbal. All rights reserved.