Deployment notes — Vercel
This project is a monorepo with `frontend/` (Create React App) and `backend/` (Express). The easiest, safest option is to deploy the frontend to Vercel and host the backend on a separate service (Heroku, Render, Railway, or a VM).
What I added
- `vercel.json` — instructs Vercel to build the CRA app found in `frontend/`.
Recommended steps (you can run locally):
1) Install Vercel CLI and log in
```bash
npm i -g vercel
vercel login
```
2) From repository root, deploy the frontend (interactive)
```bash
cd /path/to/fewaz-final-project
vercel --prod --confirm
```
3) Environment variables
- Configure your API base URL in the Vercel project settings as `REACT_APP_API_URL` (for CRA the prefix `REACT_APP_` is required). Set it to the public URL of your backend (for example `https://your-backend.example.com/api`).
4) If you want me to run this for you
- Provide a Vercel token or connect via the Vercel dashboard. I can run `vercel --prod --token <TOKEN>` and set environment variables via the API.
Notes on full-stack deployment options
- Deploy backend separately (recommended): use Render, Railway, or a small VPS and set the backend URL in Vercel env.
- Deploy backend on Vercel: requires converting Express endpoints to serverless functions (`/api/*`) or using a Docker deployment (teams/plans may be required). I can help convert a subset of endpoints to Vercel Functions if desired.
If you want, I can:
- Run the Vercel CLI deploy for you (paste Vercel token), or
- Add CI (GitHub Actions) to automatically deploy when you push to `main`.
