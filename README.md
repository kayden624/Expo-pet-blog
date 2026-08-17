# Pet Blog Demo

This repository contains an Expo Router mobile/web client (`ashui-blog`), an Express/MongoDB API (`server`), and a legacy Vite client (`client`). The Expo web export is the recommended public demo.

## Environment setup

Copy each relevant `.env.example` to `.env` locally and replace placeholders. Never commit `.env` files.

| Component | Required variables |
| --- | --- |
| `server` | `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `CORS_ORIGIN`, `BASE_URL` |
| `ashui-blog` | `EXPO_PUBLIC_API_URL` (the HTTPS API origin, without `/api`) |
| `client` (legacy) | `VITE_BASE_URL` (the HTTPS API URL, including `/api`) |

## Local commands

```bash
cd server && npm install && npm run dev
cd ashui-blog && npm install && EXPO_PUBLIC_API_URL=https://api.example.com npm run build:web
```

The static Expo output is written to `ashui-blog/dist` and can be deployed to Vercel.

## Deployment

### Express API and MongoDB

1. Create a MongoDB Atlas database user with access only to this demo database and obtain its TLS connection string.
2. Deploy `server` as a Node service (Render, Railway, Fly.io, or equivalent) with root directory `server`.
3. Set the server variables listed above. Set `CORS_ORIGIN` to the exact Vercel URL(s), comma-separated; set `BASE_URL` to the API's HTTPS origin.
4. Build command: `npm ci`. Start command: `npm start`.
5. Configure the host health check to call an API health endpoint once one is added; until then, verify a public read endpoint such as `/api/blog/getHotBlogs`.

### Expo Web on Vercel

1. Import this repository in Vercel and set Root Directory to `ashui-blog`.
2. Add `EXPO_PUBLIC_API_URL=https://<your-api-domain>` for Preview and Production.
3. Build command: `npm run build:web`. Output directory: `dist`.
4. `ashui-blog/vercel.json` provides the SPA fallback required for direct links to dynamic article and user routes.
5. Deploy, then add the final Vercel domain to the API `CORS_ORIGIN` setting and redeploy the API.

`EXPO_PUBLIC_*` values are embedded into the browser bundle: they must never contain passwords, JWT secrets, or private connection strings.

## Verification checklist

- `cd ashui-blog && npm run typecheck`
- `cd ashui-blog && EXPO_PUBLIC_API_URL=https://api.example.com npm run build:web`
- Register and log in through the deployed web app.
- Create, edit, and delete a blog as its author; verify another account cannot edit or delete it.
- Create and delete a comment as its author; verify another account cannot delete it.
- Follow a user, favourite a blog, and load each related list.
- Upload a JPEG, PNG, or WebP under 5 MB and verify its HTTPS URL renders.
- Confirm unauthenticated write requests return 401/403 and protected notification lists reject another user's ID.
