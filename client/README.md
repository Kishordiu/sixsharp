# SIXSHARP — web client

React and TypeScript frontend for the SIXSHARP quantitative research workspace. The API server lives in the sibling `server/` directory.

## Run from the repository root

Create the local client configuration:

```bash
cp client/.env.example client/.env.local
```

Fill in the Supabase project URL and **public anon/publishable key**. Values prefixed by `VITE_` are embedded in the built frontend, so never put a service-role key or private provider token in this file.

Install and start the client:

```bash
npm ci --prefix client
npm run dev --prefix client
```

Start the API separately in a second terminal from the repository root:

```bash
cp .env.example .env
npm ci --prefix server
npm run dev --prefix server
```

Fill in only the server credentials you actually need in the root `.env`. The client is available at `http://localhost:5173`, and its `/api` development proxy targets port 3001.

## Checks

```bash
npm run build --prefix client
npm run lint --prefix client
```

Playwright tests live in `client/tests/`. They may require a running application and installed browser binaries; run them against the current commit before reporting a verified result.
