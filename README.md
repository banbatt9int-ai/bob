# মোল্লা ফ্যামিলি ট্রি ও বন্ধন ও বিনিয়োগ
### Molla Family Tree & Bondhon O Biniyog Web Application

A modern, responsive web application for the Molla Family Tree (বংশলতিকা), Ancestor Lineage, and Joint Family Investment & Welfare Fund (বন্ধন ও বিনিয়োগ). Built with React, Vite, Tailwind CSS, and Firebase Firestore, ready for 1-click deployment to Vercel.

---

## 🚀 Vercel Deployment Guide

This project is 100% configured for Vercel drag-and-drop or GitHub import with `vercel.json` and `/api/index.js` serverless function.

### Step 1: Push or Import to GitHub
1. Upload this project to your GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"** -> **"Import Git Repository"**.

### Step 2: Add Firebase Environment Variables in Vercel
In the Vercel dashboard project settings (**Settings** -> **Environment Variables**), add the following keys:

| Key | Example Value | Description |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCfm96MtPHERhre3B9bipQdy2vB_wX0XrY` | Your Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `gen-lang-client-0796075706.firebaseapp.com` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | `gen-lang-client-0796075706` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `gen-lang-client-0796075706.firebasestorage.app` | Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `624329780534` | Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | `1:624329780534:web:51d3156b6fa0c088911797` | Web App ID |
| `VITE_FIREBASE_FIRESTORE_DATABASE_ID` | `ai-studio-bondhonobiniyogb-4e3fc049-ee0f-4157-be34-2b204e3b601c` | Firestore Database ID |

> **Note**: Even if you don't add environment variables immediately, the project contains default active credentials in `src/firebase.js` so it works out-of-the-box!

### Step 3: Deploy
1. Click **Deploy**.
2. Vercel will run `npm run build` and output the production build to `dist`.

---

## 🌟 Key Features

1. **পারিবারিক বংশলতিকা (Interactive Family Tree)**:
   - আদি পুরুষ মরহুম আলহাজ্ব রহিম মোল্লা থেকে শুরু করে ৪র্থ প্রজন্ম পর্যন্ত ধারাবাহিক বংশবৃক্ষ।
   - প্রজন্মভিত্তিক (Generations), শাখাভিত্তিক (Branches যেমন: বড় বাড়ি, মেজো বাড়ি, ছোট বাড়ি) এবং ডিরেক্টরি ভিউ।
   - বাংলা ইউনিকোড ফন্ট (Hind Siliguri / Noto Serif Bengali)।

2. **রিয়েল-টাইম ডাটাবেজ (Firebase Firestore Only)**:
   - নতুন সদস্য যুক্ত করা (Add), সম্পাদনা (Edit) এবং মুছে ফেলা (Delete)।
   - সকল ডাটা সরাসরি Google Firebase Firestore-এ রিয়েল-টাইমে সংরক্ষিত ও সিঙ্ক হয়।

3. **তহবিল ও বিনিয়োগ (বন্ধন ও বিনিয়োগ - BoB)**:
   - পারিবারিক যৌথ সঞ্চয় ও মাসিক কিস্তির হিসাব।
   - যৌথ ভূমি ক্রয় ও শেয়ার অংশীদারি।
   - পারিবারিক আপদকালীন স্বাস্থ্য ও শিক্ষা কল্যাণ তহবিল।

4. **বংশলতিকা PDF ডাউনলোড**:
   - যেকোনো সময় সম্পূর্ণ বংশলতিকা PDF বা প্রিন্ট ফরম্যাটে এক ক্লিকে ডাউনলোড করার সুবিধা।

5. **মোবাইল রেসপনসিভ ও আধুনিক ডিজাইন**:
   - যেকোনো স্মার্টফোন, ট্যাবলেট ও কম্পিউটারে ব্যবহারোপযোগী ঝকঝকে ডার্ক মোড ইন্টারফেস।
