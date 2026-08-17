# Pet Blog API

The Express API uses MongoDB and JWT authentication. Copy `.env.example` to `.env` locally and configure every value through the deployment provider's secret manager. Do not commit real connection strings, JWT secrets, or API URLs.

## Commands

```bash
npm install
npm run dev    # local development
npm start      # production
```

For public deployment, use a TLS MongoDB connection string, an HTTPS `BASE_URL`, and the exact web origins in `CORS_ORIGIN`. The full deployment procedure is in the repository root README.
