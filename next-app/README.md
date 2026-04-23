# TrackClcks Next.js Migration

This folder contains a migrated Next.js version of the TrackClcks admin UI and API.

## What is included

- `pages/index.js` - simple landing page for the migrated app
- `pages/manage-configs.js` - React-based config management UI
- `pages/api/site-configs` - API routes for site config CRUD
- `pages/api/track-user.js` - migrated tracking endpoint
- `lib/mongo-config.js` - MongoDB helper
- `lib/aws-config.js` - DynamoDB helper
- `public/fast.js` - copied tracking script for static delivery

## Run locally

1. `cd next-app`
2. `npm install`
3. `npm run dev`

The app will start on `http://localhost:3000`.

## Notes

- This is a fresh folder; the original project code in the parent directory is unchanged.
- Environment variables can be loaded from the root `.env` file via `lib/*` helpers.
