# api.kkpus.id

[![Quality Gates](https://github.com/kkpusi/kkpus-id-api/workflows/Quality%20Gates/badge.svg)](https://github.com/kkpusi/kkpus-id-api/actions)

> Backend service for api.kkpus.id - koperasi platform

## 🎯 Overview

api.kkpus.id provides core backend functionality for managing koperasi operations, including member management, payment processing, billing, and document workflows.

## 📋 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js, Express.js, TypeScript |
| **Database** | MySQL |
| **Security** | JWT (HS512), SSL/TLS |
| **Monitoring** | Winston, Memory alerts |
| **API Docs** | OpenAPI 3.0 |

## 🚀 Setup

### Prerequisites

- Node.js 18+
- MySQL database

### Initial Setup

```bash
# Clone repository
clone https://github.com/kkpusi/kkpus-id-api.git
cd api.kkpus.id

# Install dependencies
npm install

# Jalankan secret scanner
npm run secret-scan

# Setup MySQL
npm run setup-mysql

# Build
npm run build

# Jalankan server
node app.js
```

### Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | MySQL host |
| `DB_NAME` | `koperasi` | Database name |
| `DB_PASSWORD` | *secure password* | Database password (diolah dari secrets manager) |
| `JWT_SECRET` | *secure 32+ char* | JWT signing key (diolah dari secrets manager) |
| `NODE_ENV` | `development` | Environment (development/staging/production) |
| `SSL_KEY_PATH` | `config/certs/production/kkpusid.key` | SSL key path |
| `SSL_CERT_PATH` | `config/certs/production/kkpus_id.crt` | SSL cert path |
| `SSL_CA_PATH` | `config/certs/production/ca.crt` | SSL CA path |

### Key Management

- **SSL Keys & Certificates**: Disimpan di **AWS Secrets Manager** / HashiCorp Vault
- **JWT Secrets**: Disimpan di secrets manager
- **Database Passwords**: Disimpan di secrets manager

#### Shell ke SSL Key Path

```bash
export SSL_KEY_PATH=$(aws secretsmanager get-secret-value --secret-id ssl-key-path --query SecretString --output text | sed 's/"//')
export SSL_CERT_PATH=$(aws secretsmanager get-secret-value --secret-id ssl-cert-path --query SecretString --output text | sed 's/"//')
export SSL_CA_PATH=$(aws secretsmanager get-secret-value --secret-id ssl-ca-path --query SecretString --output text | sed 's/"//')
```

#### Shell ke JWT dan DB secrets

```bash
export JWT_SECRET=$(aws secretsmanager get-secret-value --secret-id jwt-secret --query SecretString --output text | sed 's/"//')
export DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id db-password --query SecretString --output text | sed 's/"//')
export MYSQL_ROOT_PASSWORD=$(aws secretsmanager get-secret-value --secret-id mysql-root-password --query SecretString --output text | sed 's/"//')
```

## 🔧 Development Commands

| Command | Purpose |
|---------|---------|
| `npm run setup-mysql` | Inisialisasi database lokal & production |
| `npm run lint:fix` | Perbaiki  NCI unused variables & dead code |
| `npm run test:ci` | Jalankan test suite |
| `npm audit fix --force` | Perbaiki vulnerabilities npm |
| `npm run secret-scan` | Scan secret di codebase |

## 📊 Monitoring & Health

### Health Check

```bash
curl -f http://localhost:3000/api/health
```

### Logging & Alerting

- **Memory alerts**: console.warn() saat usage > 500MB
- **Error tracking**: Winston logger dengan filtering
- **Performance metrics**: HTTP request/response time

### Monitoring Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | Status server |
| `GET /api/metrics` | Metrik aplikasi |
| `GET /api/logs` | Real-time logs |

## 🔐 Security

### Authentikasi & Otorisasi

- **JWT**: HMAC SHA-512, signature verification di server
- **HTTPS**: Force TLS untuk production
- **Rate limiting**: Apply pada auth endpoints

### Kontrol Keamanan

- **Secret Scanner**: GitHub Actions mendeteksi hardcoded secrets
- **Session timeout**: Auto-invalidate setelah 15 menit tidak aktif
- **Input validation**: Diperiksa di boundary (body, params, query)
- **CORS**: Permintaan hanya dari domain whitelist

### Penanganan Error

- **Tidak bocorkan details**: Response error bersih, tanpa stack trace
- **Logging terstruktur**: JSON log dengan correlation ID
- **Alerting**: Kirim alert ke tim ops saat error kritis

## 🏗️ Architecture

### Folder Structure

```
.
├── config/                    # Konfigurasi environment
├── controllers/              # Route handlers
├── middleware/               # Express middleware
├── models/                   # Sequelize models
├── routes/                   # API routes
├── services/                 # Business logic
├── scripts/                  # Utility scripts
├── test/                     # Unit tests
├── utils/                    # Helper libraries
├── .env.example              # Example env file (di-git)
├── .gitignore                # Git ignore
├── app.js                    # Entry point
├── package.json              # Dependencies
├── README.md                 # Dokumentasi ini
└── setup-mysql.sh           # Setup MySQL utilities
```

### Pola Desain

- **MVC**: Controller -> Service -> Model -> Database
- **Middleware chaining**: Logging, auth, validation
- **Error handling**: Global error handler middleware
- **Rate limiting**: Express-rate-limit

## 📝 Kode Konvensi

### Style

- **Format**: Prettier, eslint
- **Tipografi**: npm run lint:fix secara rutin
- **Dokumentasi**: JSDoc untuk semua fungsi publik

### Commit Messages

- **Conventional Commits**:
  - `feat: describe feature`
  - `fix: describe bug fix`
  - `docs: describe documentation`
  - `chore: perubahan non-fun && non-docs`

### Pull Request

- **Checklist**: Include security checklist template (lihat .github/pull_request_template.md)
- **Review**: Code review wajib (1 reviewer)
- **Linters**: Harus lulus
- **Test**: Harus lulus

## 🚀 Production Deployment

### Build & Deploy

```bash
# Run quality gates
npm run lint
npm run test:ci
npm audit

# Build
npm run build

# Inisialisasi secrets
set -a && source .env.example
export JWT_SECRET=$(aws secretsmanager get-secret-value --secret-id jwt-secret ...)
export DB_PASSWORD=$(aws secretsmanager get-secret . .env)

# Inisialisasi database (production mode)
DB_ENV=production npm run setup-mysql

# Jalankan server
NODE_ENV=production node app.js
```

### Monitoring Checklist

- [ ] Jalankan `npm run lint`
- [ ] Jalankan `npm run test:ci`
- [ ] Jalankan `npm audit`
- [ ] Verifikasi build (`npm run build`)
- [ ] Jalankan `node app.js`
- [ ] Test endpoint health (`GET /api/health`)

## 📊 Metrics & Observability

### Key Metrics

| Metric | Target |
|--------|--------|
| Uptime | 99.9% |
| Request latency | < 200ms |
| Memory usage | < 500MB |
| Error rate | < 1% |

### Alert Configuration

- **High memory**: > 500MB
- **Critical error**: 5+ per minute
- **Deployment**: Setiap deployment baru
- **Security**: Setiap failed auth > 3x berurutan

## 🛠️ Troubleshooting

### Common Issues

**MySQL Connection refused:**
```bash
# Periksa MySQL service
# Pastikan root user/password benar
cat /etc/mysql/my.cnf
```

**Rate Limiting Too Strict:**
```bash
# Edit config dan naikkan limits
# Example: authMax = 100
```

**JWT Auth Issues:**
```bash
# Verifikasi JWT_SECRET:
gcat .env | grep JWT_SECRET

# Periksa algorithm HS512 di:
grep -r "HS512" .
```

**Memory Usage Tinggi:**
```bash
# Cek process:
ps aux | grep node

# Jalankan alert manually:
# (Kode alert di app.js:5+)
```

## 📈 Status Quality Gates

| Check | Status |
|-------|--------|
| Linting | ✅ Bersih |
| Testing | ✅ Lulus |
| Build | ✅ Sukses |
| Security Scan | ✅ Bersih |
| Vulnerability Scan | ✅ Bersih |

## 📞 Support & Contact

- **GitHub**: issues di repository
- **Email**: dev@kkpus.id
- **Documentation**: Wiki internal

## 📅 Roadmap

- **2024**: Microservice refactoring
- **2025**: Observability stack
- **2026**: Integration dengan CI/CD

## ✅ Konformitas

- **ISO/IEC 27001:2022**: Implementasi kontrol keamanan
- **OWASP Top 10**: Semua kontrol diterapkan
- **PCI DSS**: Secure handling payment data
- **GDPR**: Data protection compliance

## 🔐 End-to-End Security Checklist

### Deployment Prerequisites

1. ✅ Jalankan `npm run lint`
2. ✅ Jalankan `npm run test:ci`
3. ✅ Jalankan `npm audit`
4. ✅ Jalankan `npm run build`
5. ✅ Verifikasi `GET /api/health`
6.ığınız ✅ Validasi OpenAPI schema (`openapi.yaml`)
7. ✅ Verifikasi rate limiting endpoint kritis

### File Penting

- **HTTPS**: `middleware/secure.js`
- **Auth**: `middleware/auth.js`
- **Rate limiting**: `middleware/rateLimit.js`
- **Secrets**: Environment vars (via AWS Secrets Manager/Vault)
- **Monitoring**: `app.js:348`, `utils/alerts.js`
- **Logging**: `utils/logger.js`

## 🔓 Licence

This project is licensed under the MIT License - see the LICENSE file for details.