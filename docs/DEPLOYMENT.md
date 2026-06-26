# Deploying HealthBridge for free

HealthBridge has three pieces, each on a free tier:

| Piece     | Service          | Free tier note                                   |
| --------- | ---------------- | ------------------------------------------------ |
| Database  | MongoDB Atlas    | M0 cluster, 512 MB — free forever                |
| Backend   | Render           | Free web service; sleeps after ~15 min idle      |
| Frontend  | Netlify          | Free static hosting + global CDN                 |

> ⚠️ **Cold start:** On Render's free tier the backend sleeps when idle, so the
> first request after a pause takes ~50 seconds to wake up. Normal for a demo.
>
> ⚠️ **File uploads are temporary:** Render's disk is ephemeral, so files
> uploaded to `backend/uploads/` are wiped on every restart/redeploy. Fine for a
> demo; for permanent storage use a service like Cloudinary or S3 later.

---

## 1. Database — MongoDB Atlas

1. Sign up at <https://www.mongodb.com/atlas> and create a **free M0** cluster.
2. **Database Access** → add a database user (username + password).
3. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere — needed for Render).
4. **Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/healthbridge?retryWrites=true&w=majority
   ```
   Replace `<user>` / `<password>` and add the db name `healthbridge` before the `?`.

Keep this string for the next step.

---

## 2. Backend — Render

1. Push this repo to GitHub (see bottom of this file if not done yet).
2. Go to <https://render.com> → **New → Web Service** → connect your GitHub repo.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
4. **Environment** → add these variables:
   | Key          | Value                                               |
   | ------------ | --------------------------------------------------- |
   | `MONGO_URI`  | the Atlas connection string from step 1             |
   | `JWT_SECRET` | any long random string (e.g. 40+ random characters) |

   > Do **not** set `PORT` — Render provides it automatically and the server
   > already reads `process.env.PORT`.
5. Click **Create Web Service**. After it builds, you get a URL like
   `https://healthbridge-api.onrender.com`. Open it — you should see
   `{"message":"HealthBridge API is running"}`.

### Seed the database (optional, for demo logins)

If you have seed scripts under `backend/seed` or `backend/scripts`, run them once
from Render's **Shell** tab, or temporarily from your own machine with
`MONGO_URI` pointed at Atlas.

---

## 3. Frontend — Netlify

1. Open `frontend/src/environments/environment.prod.ts` and set `apiBase` to your
   Render backend URL (no trailing slash):
   ```ts
   export const environment = {
     production: true,
     apiBase: 'https://healthbridge-api.onrender.com',
   };
   ```
   Commit and push this change.
2. Go to <https://app.netlify.com> → **Add new site → Import an existing project**
   → pick your GitHub repo.
3. Netlify reads `netlify.toml` automatically, so the build settings are
   pre-filled:
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build -- --configuration production`
   - **Publish directory:** `dist/frontend/browser`
4. Click **Deploy**. You get a URL like `https://healthbridge.netlify.app`.

That's it — open the Netlify URL and the app is live.

---

## Updating after the first deploy

Both Render and Netlify auto-deploy on every push to your default branch:

- Change backend code → push → Render rebuilds.
- Change frontend code → push → Netlify rebuilds.
- Change the backend URL → edit `environment.prod.ts`, push.

---

## Pushing to GitHub (first time only)

```bash
# create an empty repo on github.com first, then:
git remote add origin https://github.com/<your-username>/healthbridge.git
git push -u origin main
```
