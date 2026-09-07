# DB Foundation MEJN - CarRental System

A mobile-optimized full-stack car rental platform built with MongoDB, Express, JavaScript, and Node.js.

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

Execute the following commands in Termux to set up dependencies and push updates to the remote repository:

1. Navigate to the project directory:
   ```bash
   cd ~/CarRental
   ```

2. Install dependencies:
   ```bash
   npm install express dotenv cors cookie-parser jsonwebtoken
   ```
   > ⚠️ This line was cut off at the edge of the screenshot right after `jsonwe...`. Add any remaining packages you know belong here (likely candidates for this stack: `mongoose`, `bcryptjs`) before running it.

3. Ignore local environment files and installed modules:
   ```bash
   echo "node_modules/" > .gitignore
   echo ".env" >> .gitignore
   ```

4. Verify repository status:
   ```bash
   git status
   ```

5. Stage all project files:
   ```bash
   git add .
   ```

6. Commit changes:
   ```bash
   git commit -m "initial commit"
   ```

7. Push to the primary branch:
   ```bash
   git push origin main
   ```

8. Pull remote updates:
   ```bash
   git pull origin main
   ```

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
| Free Monthly Quota | Throttled RAM/CPU | 500 Million Reads / *(cut off)* Million Writes |
| Termux Driver Support | Standard TCP Node Driver | `@libsql/client` over HTTP/WebSocket (No native C++ compilation required) |

> ⚠️ The Turso column ran off the right edge of the screenshot (there was a horizontal scrollbar in the original table), so the write-quota number is missing and the other Turso cells are best-effort reconstructions. Worth double-checking against Turso's current docs before publishing.

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
