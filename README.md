## 🛡️ Site Audit OSINT

Tool per analizzare domini usando solo API pubbliche. Legale al 100%.

### Cosa controlla
- **DNS / IP**: Record A via Google DNS
- **SSL Grade**: SSL Labs API v3
- **Security Headers**: HSTS, CSP, X-Frame-Options
- **Server**: Header Server

### Nota Legale
Questo tool NON esegue scan porte, bruteforce o exploit. Usa solo dati pubblici.
Usalo solo su domini di cui sei proprietario.

### Avvio
```bash
npm install
npm run dev
