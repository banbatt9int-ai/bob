# BONDHON O BINIYOG (BoB) - Joint Land Investment & Member Deposit Management

A production-ready full-stack cooperative investment and land share management platform built with **Vite + React + Tailwind CSS** and powered by **Firebase Firestore & Authentication**, tailored for seamless deployment on **Vercel**.

---

## 🚀 Quick Vercel Deployment Guide

### Option 1: Deploy via GitHub (Recommended)
1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/your-username/bondhon-biniyog-bob.git
   git push -u origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New...** > **Project** and import your GitHub repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Add the **Environment Variables** (see below).
6. Click **Deploy**.

### Option 2: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🔑 Environment Variables for Vercel

In your Vercel Dashboard under **Project Settings > Environment Variables**, add the following keys:

| Variable Name | Description | Example Value |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | `AIzaSyCfm96MtPHERhre3B9bipQdy2vB_wX0XrY` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `gen-lang-client-0796075706.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `gen-lang-client-0796075706` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Cloud Storage Bucket | `gen-lang-client-0796075706.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID | `624329780534` |
| `VITE_FIREBASE_APP_ID` | Firebase Web App ID | `1:624329780534:web:51d3156b6fa0c088911797` |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | Firestore Database ID | `ai-studio-bondhonobiniyogb-4e3fc049-ee0f-4157-be34-2b204e3b601c` |

> **Note**: Default fallback configuration is already present in `src/firebase.js` and `src/firebase.ts`, so the app will boot immediately even before configuring custom keys.

---

## 📁 Project Architecture

```
├── /api
│   └── index.js              # Vercel Serverless Function API
├── /public                   # Static public assets (logos, images)
├── /src
│   ├── components/           # UI components (AdminPanel, UserDashboard, Modals)
│   ├── services/             # Firebase SDK, cloudStorage, API interceptor
│   ├── utils/                # PDF/JPG export utils, Bengali formatting
│   ├── firebase.js           # Firebase configuration for Vercel
│   ├── firebase.ts           # Typed Firebase SDK initialization
│   ├── App.tsx               # Main application container
│   └── main.tsx              # React DOM entry point
├── vercel.json               # Vercel SPA routing and serverless rewrites
├── firestore.rules           # Security rules for Firestore collections
├── package.json              # Dependencies and build scripts
└── vite.config.ts            # Vite configuration
```

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server
npm run dev

# 3. Build for production
npm run build
```

---

## 📄 License
© 2026 বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG). All rights reserved.
