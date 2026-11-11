# Environment Variables Documentation - api.kkpus.id

Dokumentasi lengkap mengenai environment variables yang digunakan di `api.kkpus.id`.

---

## 🗄️ Database Configuration

| Variable | Description | Default | Example |
|---|---|---|---|
| `DB_DIALECT` | Database dialect (mysql atau sqlite) | `mysql` | `mysql` |
| `DB_HOST` | Database host server | `localhost` | `kkpus.id` / `localhost` |
| `DB_PORT` | Database port number | `3306` | `3306` |
| `DB_USER` | Database username | `root` | `kkpusid` |
| `DB_PASSWORD` | Database password | - | `your_secret_password` |
| `DB_NAME` | Database name | `koperasi` | `koperasi` |
| `DB_STORAGE` | SQLite file path (hanya jika DB_DIALECT=sqlite) | `./database/local-dev.sqlite` | `./database/local-dev.sqlite` |
| `DB_POOL_MAX` | Max connection pool | `20` | `20` |
| `DB_POOL_MIN` | Min connection pool | `2` | `2` |

---

## 🔒 Security Configuration

| Variable | Description | Default | Example |
|---|---|---|---|
| `JWT_SECRET` | Secret key for JWT signing | - | `your-32-char-min-jwt-secret-key` |
| `NODE_TLS_REJECT_UNAUTHORIZED` | TLS rejection (set to 0 for self-signed certificates) | `1` | `0` (development) / `1` (production) |
| `COOKIE_DOMAIN` | Domain for authentication cookies | `undefined` | `.kkpus.id` |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | Whitelist internal | `https://admin.kkpus.id,https://kkpus.id` |

---

## 🌐 Server Configuration

| Variable | Description | Default | Example |
|---|---|---|---|
| `NODE_ENV` | Application environment | `development` | `development` / `production` / `test` |
| `HTTP_PORT` | HTTP server port | `3000` | `3000` |
| `HTTPS_PORT` | HTTPS server port (jika SSL aktif) | `3445` | `3445` |

---

## 📜 SSL Configuration

| Variable | Description | Default | Example |
|---|---|---|---|
| `SSL_KEY_PATH` | Path to SSL private key | `config/certs/production/kkpusid.key` | `config/certs/production/kkpusid.key` |
| `SSL_CERT_PATH` | Path to SSL certificate | `config/certs/production/kkpus_id.crt` | `config/certs/production/kkpus_id.crt` |
| `SSL_CA_PATH` | Path to SSL CA certificate bundle | `config/certs/production/ca.crt` | `config/certs/production/ca.crt` |

---

## 🛡️ Rate Limiting Configuration

| Variable | Description | Default | Example |
|---|---|---|---|
| `RATE_LIMIT_WINDOW_MS` | General rate limit window in ms | `900000` (15 min) | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | `100` |
| `AUTH_RATE_LIMIT_MAX` | Max requests for auth routes | `10` | `10` |
| `LOGIN_RATE_LIMIT_MAX` | Max failed login attempts before block | `10` | `10` |
| `OTP_RATE_LIMIT_MAX` | Max OTP requests | `5` | `5` |
| `PASSWORD_RESET_RATE_LIMIT_MAX`| Max password reset attempts | `5` | `5` |

---

## 🚀 Setup Cepat (Development)

Buat file `.env` di root direktori:

```bash
# Salin konfigurasi development
cp .env.example .env
```

Isi minimum file `.env`:

```env
NODE_ENV=development
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=koperasi
JWT_SECRET=super_secret_development_jwt_key_min_32_characters
```
