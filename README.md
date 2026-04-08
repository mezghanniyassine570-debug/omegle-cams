# OmegleCams — Next.js + Socket.io + WebRTC

A fully functional Omegle clone with video/text chat, matchmaking queue, and interest-based pairing.

## 🚀 Deployment Guide (Railway.app)

Since this app uses **Socket.io** and a **persistent matchmaking queue**, it cannot be hosted on Vercel. Use **Railway** or **Render** for a 2-minute setup.

### 1. Push to GitHub
Ensure your latest code is pushed to your repository: `https://github.com/iyedferah/omegleyassine.git`

### 2. Connect to Railway
1.  Go to [Railway.app](https://railway.app/) and sign in with GitHub.
2.  Click **"New Project"** → **"Deploy from GitHub repo"**.
3.  Select `omegleyassine`.
4.  Railway will automatically detect the `package.json` and start the server using `npm run start`.

### 3. Environment Variables
In Railway (or Render), add this variable:
- `PORT` = `3000` (Railway often sets this automatically)
- `NODE_ENV` = `production`

### 4. Done!
Open the provided URL. Your matchmaking queue and video chat will work perfectly in production.

---

## 🛠 Tech Stack
- **Framework**: Next.js (Pages Router)
- **Realtime**: Socket.io (Matchmaking & Signaling)
- **Video/Audio**: WebRTC (via `simple-peer`)
- **Styling**: Tailwind CSS v4

---

## 💻 Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)
"# omegle-cams" 
