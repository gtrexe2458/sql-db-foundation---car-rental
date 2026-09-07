# DB Foundation MEJN - CarRental System

A mobile-optimized full-stack car rental platform built with MongoDB, Express, JavaScript, and Node.js.

🔗 **Live (Vercel):** [sql-db-foundation-car-rental](https://sql-db-foundation-car-rental-crnojm6xn-gpuc.vercel.app) ✅

---

## 📁 Directory Structure

```text
CarRental/
├── config/
│   └── db.js
├── db/
│   └── schema.sql
├── middleware/
│   └── jwt.js
├── models/
│   ├── userModel.js
│   └── searchModel.js
├── controllers/
│   └── authController.js
├── routes/
│   ├── authRoutes.js
│   └── carRoutes.js
├── src/
│   ├── page/
│   │   ├── login.html
│   │   ├── profile.html
│   │   ├── searchCar.html
│   │   ├── shareRent.html
│   │   └── signup.html
│   ├── script/
│   │   ├── checkAuth.js
│   │   ├── loginDB.js
│   │   ├── profileDB.js
│   │   ├── searchCar.js
│   │   ├── shareRent.js
│   │   └── signupDB.js
│   └── style/
│       └── signupPassLog.css
├── package.json
└── server.js
```

## ⚙️ Package Configuration (`package.json`)

- Set `"type": "module"` in `package.json` to enable standard ES module imports (`import` / `export`).
- Set npm scripts:
  - `"start": "node server.js"` (production execution)
  - `"dev": "node --watch server.js"` (development auto-reloading)

## 🛠️ Termux Setup & Git Commands

This connects the **project folder you already have** (`~/storage/downloads/SQLdb/carRental`) to the existing GitHub repo. Use `git remote add origin` for this — **not** `git clone`. `git clone` downloads a brand-new copy into a new subfolder; it does not link a folder you already have, and can leave the repo you're actually in with no `origin` set (causing a `fatal: 'origin' does not appear to be a git repository` error on push).

**One-time cleanup** — remove the stray duplicate folder that clone created:
```bash
rm -rf ~/storage/downloads/SQLdb/carRental/sql-db-foundation---car-rental
```

1. Navigate to the project directory:
   ```bash
   cd ~/storage/downloads/SQLdb/carRental
   ```

2. Install dependencies:
   ```bash
   npm install express dotenv cors cookie-parser jsonwebtoken
   ```
   > Add any other packages this project depends on (e.g. `mongoose` for MongoDB, `bcryptjs` for password hashing) if they aren't already installed.

3. Initialize git and set the branch name to `main` immediately — this sidesteps the whole `master` vs `main` mismatch:
   ```bash
   git init
   git branch -M main
   ```

4. Ignore local environment files and installed modules:
   ```bash
   echo "node_modules/" > .gitignore
   echo ".env" >> .gitignore
   ```

5. Link the existing GitHub repo as `origin`:
   ```bash
   git remote add origin https://github.com/gtrexe2458/sql-db-foundation---car-rental
   ```

6. Stage all project files:
   ```bash
   git add .
   ```

7. Commit changes:
   ```bash
   git commit -m "Initial commit"
   ```

8. Push to GitHub:
   ```bash
   git push -u origin main
   ```
   > ⚠️ If this is rejected with "fetch first" or "unrelated histories," the GitHub repo already has a commit on it (e.g. from creating the repo with a starter README). Then either:
   > - **Merge it in** (keeps remote history): `git pull origin main --allow-unrelated-histories`, resolve any conflicts, then `git push origin main`
   > - **Overwrite it** (discards remote history): `git push -u origin main --force` — only do this if you're sure you don't need whatever's already on GitHub

9. For every push after this first one, `origin` is already set, so it's just:
   ```bash
   git add .
   git commit -m "your message"
   git push origin main
   ```

### Troubleshooting: Common Push Errors

**"nothing added to commit but untracked files present"**
This happens if you `git add` one specific file (e.g. `git add .gitignore`) instead of the whole project — git commits only what you staged, so everything else (README.md, config/, controllers/, db/, middleware/, models/, routes/, server.js, src/, package.json) stays untracked and never gets pushed. Always use `git add .` to stage the full project, not individual filenames, unless you deliberately want a partial commit.

**`! [rejected] main -> main (fetch first)`**
GitHub's `main` branch already has a commit your local repo doesn't have (usually the default one created when the repo was first made). Git refuses to push over history it hasn't seen. Fix, run in order:
```bash
cd ~/storage/downloads/SQLdb/carRental
rm -rf sql-db-foundation---car-rental
git add .
git commit -m "Initial commit"
git push -u origin main --force
```
- `rm -rf sql-db-foundation---car-rental` clears out the duplicate folder created if `git clone` was ever run inside this directory by mistake, so it doesn't get committed as junk.
- `--force` overwrites whatever's currently on GitHub's `main` with your local project — fine for a fresh setup where the remote only has GitHub's auto-generated starter content, but worth a quick look at the repo on github.com first if you're not sure.
- To merge instead of overwriting, use `git pull origin main --allow-unrelated-histories` before pushing — but expect a merge conflict on README.md since both sides have one, which is more fiddly to resolve in Termux.

## 🗄️ Database Access (MongoDB Atlas vs. Turso)

### Cloud Database Setup (MongoDB Atlas)

1. Log into MongoDB Atlas and create a project/cluster.
2. Under **Network Access**, add `0.0.0.0/0` to allow connections from cloud deployments.
3. Under **Database Access**, create a user with password credentials.
4. Set the connection string in `.env` as `MONGODB_URI`.

### Database Comparison

| Metric / Feature | MongoDB Atlas | Turso (libSQL) |
|---|---|---|
| Data Model | Document Store (NoSQL JSON) | Relational SQL & Foreign Keys |
| Free Storage | 500 MB Shared Cluster | 5 GB Total Storage |
| Free Monthly Quota | Throttled RAM/CPU | 500 Million Reads / — Million Writes *(confirm exact figure)* |
| Termux Driver Support | Standard TCP Node Driver | `@libsql/client` over HTTP/WebSocket (No native C++ compilation required) |

> ⚠️ Some Turso figures above are approximate — confirm current limits against Turso's official docs/pricing page before relying on them.

## 🚀 Render Web Service Deployment

1. Log into Render and select **New + → Web Service**.
2. Connect the GitHub repository (`CarRental`).
3. Set Web Service configuration:
   - **Name**: `car-rental`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
4. Set Environment Variables under the **Environment** tab:
   - `PORT`: `5000`
   - `MONGODB_URI` / `TURSO_DATABASE_URL`: Cloud DB connection URI
   - `JWT_SECRET`: Secret cryptographic key

### Platform Comparison: Vercel vs. Render (WebSocket Support)

- **Execution Model**:
  - **Render**: Runs a persistent, long-lived Node.js runtime process (`node server.js`).
  - **Vercel**: Runs ephemeral serverless functions (`@vercel/node`) that spin down immediately after execution.
- **WebSocket Reason for Render**:
  - Render maintains active TCP connections, natively supporting WebSockets / Server-Sent Events (SSE) for real-time status synchronization.
  - Vercel's serverless model terminates execution upon request completion and cannot maintain open socket connections natively.

## 🔗 Render Quick Access Paths

- **Public App URL**: `https://<your-render-app>.onrender.com`
- **API Endpoint Check**: `https://<your-render-app>.onrender.com/api/cars/search`

## 🔗 Vercel Deployment ✅ Done

- **Live App**: [sql-db-foundation-car-rental](https://sql-db-foundation-car-rental-crnojm6xn-gpuc.vercel.app)
- ⚠️ Comparison/testing deployment only — see the Vercel vs. Render note above. WebSocket/SSE features won't work reliably here since Vercel's functions don't hold a persistent connection.

## 🚀 Quickstart Guide

1. Clone repository in Termux:
   ```bash
   git clone <repository-url>
   cd CarRental
   ```

2. Create `.env` in the root directory:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

3. Install dependencies and start server:
   ```bash
   npm install
   npm start
   ```

## ⏰ Uptime & Keep-Alive Strategy (Cron-job.org / UptimeRobot)

Render free instances hibernate after 15 minutes of zero HTTP traffic. An automated external ping keeps the service active continuously.

1. **The Challenge**: Render puts idle web services to sleep, causing a 30–50 second cold-start wake delay on the next incoming request.
2. **Ping Setup**: Create a job on `Cron-job.org` or `UptimeRobot` sending a `POST` request to `https://<your-render-app>.onrender.com/api/cars/search` every 12 minutes with an empty JSON body `{}`.
3. **Key Benefit**: Keeps the persistent Express process loaded in memory 24/7 without hitting free tier limits.
