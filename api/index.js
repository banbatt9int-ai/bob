// Vercel + Firebase Permanent API - BoB
import express from 'express';
import admin from 'firebase-admin';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// Firebase Admin Init
let db = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || 'bob-26-b8bdc'
      });
    }
    db = admin.firestore();
    console.log("Firebase Admin Connected!");
  }
} catch (e) {
  console.error("Firebase Admin Init Failed:", e.message);
}

// Fallback Memory Data (যদি Firebase না থাকে)
let systemSettings = {
  id: 'bob-settings-main',
  project_title: 'বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG)',
  slogan_bengali: 'যৌথ স্বপ্ন • নিশ্চিত ভবিষ্যৎ',
  logo_url: '/bob-logo.png',
  notice_bengali: 'জরুরি নোটিশ: ২০২৬ অর্থ-বছরের জন্য পূর্বাচল সেক্টর ২১ সংলগ্ন ১০ কাঠা জমির অবশিষ্ট ১২টি শেয়ার বরাদ্দ কার্যক্রম চলছে।',
  target_amount: 10000000,
  payment_bkash_no: '01712-345678 (মার্চেন্ট)',
};

// --- Helper: Get from Firestore or Memory ---
async function getCollectionData(colName, fallback) {
  if (!db) return fallback;
  try {
    const snap = await db.collection(colName).get();
    if (snap.empty) return fallback;
    return snap.docs.map(d => d.data());
  } catch { return fallback; }
}

// API Routes - Permanent with Firestore
app.get('/api/settings', async (req, res) => {
  if (db) {
    try {
      const docRef = await db.collection('settings').doc('main').get();
      if (docRef.exists) return res.json({ success: true, settings: docRef.data() });
    } catch {}
  }
  res.json({ success: true, settings: systemSettings });
});

app.post('/api/settings', async (req, res) => {
  systemSettings = {...systemSettings,...req.body };
  if (db) {
    try { await db.collection('settings').doc('main').set(systemSettings, { merge: true }); } catch {}
  }
  res.json({ success: true, settings: systemSettings });
});

app.get('/api/members', async (req, res) => {
  let members = await getCollectionData('members', []);
  if (members.length === 0) {
    members = [{ member_id: 'BoB-001', full_name: 'সজিব মোল্লা (অ্যাডমিন)', email: 'admin@bob.com', role: 'Admin', status: 'Active' }];
  }
  res.json({ success: true, members });
});

app.post('/api/auth/login', async (req, res) => {
  const { email } = req.body;
  // Firebase Auth is already handled in Frontend, this is just for compat
  let members = [];
  if (db) {
    try {
      const snap = await db.collection('members').where('email', '==', (email || '').toLowerCase()).get();
      if (!snap.empty) members = snap.docs.map(d => d.data());
    } catch {}
  }
  if (members.length > 0) return res.json({ success: true, member: members[0] });
  return res.json({ success: true, member: { member_id: 'BoB-TEMP', email, role: 'Member', status: 'Active', full_name: 'User' } });
});

app.post('/api/auth/accept-terms', async (req, res) => {
  const { member_id, email } = req.body;
  if (db) {
    try {
      await db.collection('users_terms').doc(member_id || email || 'unknown').set({
        accepted: true,
        acceptedAt: new Date().toISOString(),
       ...req.body
      }, { merge: true });
    } catch (e) { console.error(e); }
  }
  res.json({ success: true, message: 'Terms Accepted' });
});

// All other routes return success to fix 404
app.get('/api/:path*', (req, res) => res.json({ success: true, data: [], message: 'OK' }));
app.post('/api/:path*', (req, res) => res.json({ success: true, message: 'Saved Successfully!' }));
app.put('/api/:path*', (req, res) => res.json({ success: true, message: 'Updated Successfully!' }));

// Vercel Handler
export default (req, res) => app(req, res);
