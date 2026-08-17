# Pet Blog

Pet Blog is a full-stack social blogging application for sharing articles, images, comments, and follows.

## Live Demo

Frontend: <https://expo-pet-blog.vercel.app>

The REST API is hosted separately on Railway.

## Overview

- Authentication with JWT
- User profiles and username customization
- Create, edit, and delete blog posts
- Banner and editor image uploads
- Comments and replies
- Follow users and favorite blogs
- Notifications and search
- Responsive web UI

## Tech Stack

Frontend: React, Vite, Tailwind CSS, Axios, React Router, EditorJS

Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer

Deployment: Vercel, Railway, MongoDB Atlas

## Architecture

```text
Browser
  -> Vercel frontend (client)
  -> Railway REST API (server)
  -> MongoDB Atlas
```

The repository also contains `ashui-blog`, an Expo Router/React Native client retained for mobile and experimental work. The current public Vercel demo is the Vite client in `client`.

## Key Engineering Work

- JWT-protected API requests, including authenticated multipart uploads
- Restricted production CORS configuration
- Defensive handling of orphan author references
- Loading, error, and empty states across profile and notification flows
- SPA routing fallback for direct Vercel URLs
- Production frontend and backend deployment configuration

## Local Development

Install dependencies in each application directory, then run the API and web client in separate terminals:

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

The Expo client can be run separately with `cd ashui-blog && npm install && npm run web`.

## Environment Variables

Create local files from the examples. Never commit `.env` files or replace these names with real secrets in documentation.

`server/.env.example`:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `CORS_ORIGIN`
- `BASE_URL`

`client/.env.example`:

- `VITE_BASE_URL`

`ashui-blog/.env.example`:

- `EXPO_PUBLIC_API_URL`

## Deployment

- Frontend: deploy `client` to Vercel with `npm run build` and output directory `dist`.
- Backend: deploy `server` to Railway with `npm ci` and `npm start`.
- Database: use MongoDB Atlas through `MONGODB_URI`.
- Set the frontend URL in the backend `CORS_ORIGIN` value and the Railway API URL in `BASE_URL`.

## Production Limitations

Image uploads currently use the Railway container filesystem. This is suitable for a portfolio/demo deployment, but uploaded files may not survive a redeploy or restart. Durable object storage such as S3, Cloudinary, or Supabase Storage would be the next production step.

## Future Improvements

- Durable object storage for uploaded media
- Automated tests and continuous integration
- Accessibility and performance improvements, including code splitting
- Further profile and username customization
