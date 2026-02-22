# Deploying on Render

Per [Render's documentation](https://render.com/docs):

- **Environment variables are not loaded from a `.env` file** on Render. They must be set in the **Render Dashboard** (or via [Blueprints](https://render.com/docs/blueprint-spec#environment-variables)) for each service.
- Render sets `RENDER=true` and injects your env vars into `process.env` at runtime.
- For monorepos, use [Root Directory](https://render.com/docs/monorepo-support#setting-a-root-directory) and/or [Build Filters](https://render.com/docs/monorepo-support#setting-build-filters) so each service builds and runs from the right folder.

## What was wrong / How to fix

### 1. "API key invalid" or env vars not visible

**Cause:** On Render there is no `.env` file at build or runtime. If you only set variables in a local `.env` and never added them in the Dashboard, the service won’t see them.

**Fix:** For each service (e.g. auth-service, api-gateway):

1. In the [Render Dashboard](https://dashboard.render.com/), open the service.
2. Go to **Environment** in the left pane.
3. Click **+ Add Environment Variable** (or **Add from .env** to paste from your local `.env`).
4. Add every variable that service needs (e.g. `RESEND_API_KEY`, `EMAIL_FROM`, `DATABASE_URL`, `JWT_SECRET`, etc.).
5. Save; choose **Save, rebuild, and deploy** so the new vars are used.

See: [Environment Variables and Secrets](https://render.com/docs/configure-environment-variables).

### 2. Monorepo: root directory and builds

**Cause:** If the repo root is the default, build/start commands run from the repo root. If you use a subfolder (e.g. `my-workspace` or `apps/auth-service`), you must set **Root Directory** and make build/start commands relative to it.

**Fix:**

- In the service **Settings**, set **Root Directory** (e.g. `my-workspace` if the app lives there).
- **Build command** and **Start command** are then relative to that root (e.g. `npm install && npx prisma generate`, then `node dist/apps/auth-service/main.js` or whatever your start command is).
- **Build filters** (optional): use [Build Filters](https://render.com/docs/monorepo-support#setting-build-filters) so only relevant path changes trigger a deploy.

See: [Monorepo Support](https://render.com/docs/monorepo-support).

### 3. Do not commit `.env`

Render and security best practice: **do not commit your `.env` file**. Add `.env` to `.gitignore`. Use the Dashboard (or “Add from .env” once) to set the same variables on Render.

See: [Setting environment variables locally](https://render.com/docs/configure-environment-variables#setting-environment-variables-locally).

---

## Required env vars by service (checklist)

Set these in the **Environment** tab for each service on Render:

| Variable | auth-service | api-gateway | user-service | admin-service | employee-service | loan-service | provider-service | file-service |
|----------|--------------|-------------|--------------|---------------|------------------|--------------|-------------------|--------------|
| `DATABASE_URL` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |
| `JWT_SECRET` | ✓ | | | | | | | |
| `JWT_EXPIRES_IN` | ✓ | | | | | | | |
| `RESEND_API_KEY` | ✓ | | | | | | | |
| `EMAIL_FROM` | ✓ | | | | | | | |
| `AUTH_SERVICE_HOST` / `PORT` | | ✓ | | | | | | |
| (other service hosts/ports) | | ✓ | | | | | | |
| `CLOUDINARY_*` | | | | | | | | ✓ |

Use **Environment Groups** to share variables (e.g. `DATABASE_URL`) across services: [Environment groups](https://render.com/docs/configure-environment-variables#environment-groups).
