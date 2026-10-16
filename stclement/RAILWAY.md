# Hosting on Railway

The site and its editor run as one small Node service on Railway. Nothing else is needed: no database, no GitHub
access, no outside login service. Text edits and uploaded files are kept on a Railway Volume.

## 1. Create the service

1. In Railway: **New Project → Deploy from GitHub repo → AdsAstraLabs/demos**.
2. Open the new service → **Settings**:
   - **Source → Branch:** `stclement-cms`
   - **Source → Root Directory:** `stclement`
   - Build and start commands come from `railway.json` (build `node tools/prerender.mjs`, start `node server.mjs`,
     health check `/healthz`). Leave the fields in the dashboard empty.

## 2. Add a Volume

Right-click the service on the project canvas (or use **⌘K → Add Volume**) → **Attach Volume**.

- **Mount path:** `/data`

On first start the server copies the starting content into the volume. After that, everything editors save
(text, photos, PDFs, the last 50 versions of every section) lives there and survives redeploys.

## 3. Variables

Service → **Variables**. Set these names (values are yours; never commit them):

| Name | What to put in it |
| --- | --- |
| `DATA_DIR` | `/data` (the Volume mount path) |
| `SESSION_SECRET` | A long random string (e.g. 64 characters). Changing it signs everyone out. |
| `ADMIN_USERS` | The editors, one `email:password` pair each, separated by `;` (or one per line). |

Railway sets `PORT` itself; do not add it.

Passwords should be at least 12 characters and may not contain `;`. Instead of a plain password you can store a
hash: run `node tools/hash-password.mjs` on any computer with Node, type the password, and use
`email:scrypt$…` (the printed value) in `ADMIN_USERS`. To add or remove an editor, edit `ADMIN_USERS`; Railway
redeploys and the change applies at once (removed editors are signed out).

`CMS_TODAY` (a date such as `2026-10-16`) pins "today" for the date-driven parts of the page. It is only for
testing; leave it unset in production.

## 4. Get an address

Service → **Settings → Networking → Generate Domain**. The site is then at `https://<name>.up.railway.app/` and
the editor at `https://<name>.up.railway.app/admin/`.

## Custom domain (later)

Service → **Settings → Networking → Custom Domain**, enter e.g. `www.stclementparish.ca`, then add the CNAME
record Railway shows at the domain's DNS provider. Railway issues the HTTPS certificate automatically. The
editor moves with it (`https://www.stclementparish.ca/admin/`); nothing in the code needs to change.
