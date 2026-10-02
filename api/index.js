// Vercel Serverless API Handler - Bondhon O Biniyog (BoB)
import express from 'express';

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

// Seed Data
let systemSettings = {
  id: 'bob-settings-main',
  project_title: 'বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG)',
  slogan_bengali: 'যৌথ স্বপ্ন • নিশ্চিত ভবিষ্যৎ',
  logo_url: '/bob-logo.png',
  notice_bengali: 'জরুরি নোটিশ: ২০২৬ অর্থ-বছরের জন্য পূর্বাচল সেক্টর ২১ সংলগ্ন ১০ কাঠা জমির অবশিষ্ট ১২টি শেয়ার বরাদ্দ কার্যক্রম চলছে।',
  target_amount: 10000000,
  project_vision: 'বন্ধন ও বিনিয়োগ হলো একটি বিশ্বস্ত সমবায় ভূমি বিনিয়োগ উদ্যোগ।',
  contact_phone_1: '+880 1712-345678',
  contact_email: 'bondhon.biniyog@gmail.com',
  management_lead: 'সজিব মোল্লা',
  management_lead_designation: 'ব্যবস্থাপনা পরিচালক ও প্রধান সমন্বয়ক',
  payment_bkash_no: '01712-345678 (মার্চেন্ট)',
  payment_nagad_no: '01890-123456',
  payment_bank_name: 'BRAC Bank PLC',
  payment_bank_account_name: 'BONDHON O BINIYOG',
  payment_bank_account_no: '1501-2049-88001'
};

let members = [
  {
    member_id: 'BoB-001',
    full_name: 'সজিব মোল্লা (অ্যাডমিন)',
    email: 'admin@bob.com',
    phone: '+880 1712-345678',
    role: 'Admin',
    status: 'Active',
    monthly_target: 10000,
    total_monthly_paid: 120000,
    total_lumpsum_paid: 300000,
    grand_total_paid: 420000,
    due_installments: 0,
    owned_shares: 5,
    has_accepted_terms: true,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    joined_date: '2025-01-01'
  },
  {
    member_id: 'BoB-002',
    full_name: 'মোহাম্মদ তানভীর আহমেদ',
    email: 'tanvir@bob.com',
    phone: '+880 1819-987654',
    role: 'Member',
    status: 'Active',
    monthly_target: 5000,
    total_monthly_paid: 60000,
    total_lumpsum_paid: 200000,
    grand_total_paid: 260000,
    due_installments: 0,
    owned_shares: 3,
    has_accepted_terms: true,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    joined_date: '2025-02-15'
  }
];

let monthlyDeposits = [
  {
    deposit_id: 'DEP-2026-001',
    member_id: 'BoB-001',
    member_name: 'সজিব মোল্লা',
    month_year: '2026-01',
    amount: 10000,
    payment_method: 'bKash',
    trx_id: 'BKH9823412',
    status: 'Approved',
    submitted_at: '2026-01-05T10:30:00Z'
  },
  {
    deposit_id: 'DEP-2026-002',
    member_id: 'BoB-002',
    member_name: 'মোহাম্মদ তানভীর আহমেদ',
    month_year: '2026-01',
    amount: 5000,
    payment_method: 'Nagad',
    trx_id: 'NGD5512903',
    status: 'Approved',
    submitted_at: '2026-01-07T11:45:00Z'
  }
];

let lumpsumDeposits = [
  {
    lumpsum_id: 'LMP-2026-001',
    member_id: 'BoB-001',
    member_name: 'সজিব মোল্লা',
    purpose: 'পূর্বাচল সেক্টর ২১ ভূমি প্রকল্পের শেয়ার ক্রয়',
    amount: 300000,
    target_land_id: 'LAND-01',
    payment_method: 'Bank',
    trx_id: 'BRAC-TRX-99881',
    status: 'Approved',
    submitted_at: '2026-01-10T09:00:00Z'
  }
];

let lands = [
  {
    land_id: 'LAND-01',
    land_name: 'পূর্বাচল সেক্টর ২১ সংলগ্ন বাণিজ্যিক ও আবাসিক ভূমি',
    location: 'পূর্বাচল নতুন শহর, সেক্টর ২১ সংলগ্ন, রূপগঞ্জ, নারায়ণগঞ্জ',
    area_size: '১০ কাঠা',
    purchase_price: 15000000,
    current_valuation: 18500000,
    total_shares: 50,
    share_price: 300000,
    sold_shares: 38,
    status: 'Active',
    description: 'ঢাকা পূর্বাচল এক্সপ্রেসওয়ে সংলগ্ন অত্যন্ত দ্রুত বিকাশমান বাণিজ্যিক জোন।',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
    features: ['১০০ ফুট চওড়া পাকা রাস্তা সংলগ্ন', 'উচ্চ রিটার্ন সম্ভাবনা', 'সম্পূর্ণ নির্ভেজাল সরকারি সাব-কবলা দলিল']
  },
  {
    land_id: 'LAND-02',
    land_name: 'কেরানীগঞ্জ ওয়েস্টার্ন সিটি সংলগ্ন রিভারভিউ প্লট',
    location: 'ঢাকা মাওয়া হাইওয়ে সংযোগ সড়ক, কেরানীগঞ্জ, ঢাকা',
    area_size: '১৫ কাঠা',
    purchase_price: 18000000,
    current_valuation: 21000000,
    total_shares: 60,
    share_price: 300000,
    sold_shares: 25,
    status: 'Active',
    description: 'পদ্মা সেতু সংযোগ এক্সপ্রেসওয়ে থেকে মাত্র ৮ মিনিটের দূরত্বে মনোরম রিভারভিউ আবাসন প্রকল্প।',
    images: ['https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800'],
    features: ['পদ্মা সেতু এক্সপ্রেসওয়ে কানেক্টিভিটি', 'নয়নাভিরাম প্রাকৃতিক নদী তীরবর্তী পরিবেশ']
  }
];

let directors = [
  {
    director_id: 'DIR-01',
    name: 'সজিব মোল্লা',
    designation: 'ব্যবস্থাপনা পরিচালক ও প্রধান সমন্বয়ক',
    phone: '+880 1712-345678',
    email: 'bondhon.biniyog@gmail.com',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    message: 'সততা, স্বচ্ছতা ও যৌথ কল্যাণে আমাদের প্রতিটি সদস্যের সঞ্চয় সুরক্ষিত ও ফলপ্রসূ হবে।',
    order: 1
  }
];

let gallery = [
  {
    id: 'gal-01',
    title: 'পূর্বাচল প্রকল্পের সরেজমিন সীমানা নির্ধারণ ও পরিদর্শন',
    category: 'সাইট ভিজিট',
    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    date: '১০ জানুয়ারি ২০২৬',
    location: 'পূর্বাচল সেক্টর ২১'
  }
];

let notifications = [
  {
    id: 'notif-01',
    title: 'স্বাগতম বন্ধন ও বিনিয়োগে!',
    message: 'আপনার সমবায় সঞ্চয় ও ভূমি প্রকল্পের সকল বিবরণী এখান থেকে রিয়েল-টাইমে পর্যবেক্ষণ করতে পারবেন।',
    type: 'system',
    created_at: new Date().toISOString()
  }
];

let storedFiles = [];

// API Routes
app.get(['/api/settings', '/settings'], (req, res) => res.json({ success: true, settings: systemSettings }));
app.post(['/api/settings', '/settings'], (req, res) => {
  systemSettings = { ...systemSettings, ...req.body };
  res.json({ success: true, settings: systemSettings });
});

app.get(['/api/stats', '/stats'], (req, res) => {
  const totalMonthly = monthlyDeposits.filter(d => d.status === 'Approved').reduce((s, d) => s + Number(d.amount), 0);
  const totalLump = lumpsumDeposits.filter(d => d.status === 'Approved').reduce((s, d) => s + Number(d.amount), 0);
  const totalCap = totalMonthly + totalLump;
  res.json({
    success: true,
    stats: {
      total_capital: totalCap,
      total_monthly_capital: totalMonthly,
      total_lumpsum_capital: totalLump,
      target_amount: systemSettings.target_amount,
      capital_percentage: Math.round((totalCap / systemSettings.target_amount) * 100),
      total_members: members.length,
      active_members: members.filter(m => m.status === 'Active').length,
      pending_members: members.filter(m => m.status === 'Pending').length,
      blocked_members: members.filter(m => m.status === 'Blocked').length,
      pending_monthly_deposits: monthlyDeposits.filter(d => d.status === 'Pending').length,
      pending_lumpsum_deposits: lumpsumDeposits.filter(d => d.status === 'Pending').length,
      active_lands_count: lands.filter(l => l.status === 'Active').length
    }
  });
});

app.get(['/api/members', '/members'], (req, res) => res.json({ success: true, members }));
app.post(['/api/members', '/members'], (req, res) => {
  const newMember = { ...req.body, member_id: `BoB-${String(members.length + 1).padStart(3, '0')}`, joined_date: new Date().toISOString().slice(0, 10) };
  members.push(newMember);
  res.json({ success: true, member: newMember });
});

app.get(['/api/deposits/monthly', '/deposits/monthly'], (req, res) => res.json({ success: true, deposits: monthlyDeposits }));
app.post(['/api/deposits/monthly', '/deposits/monthly'], (req, res) => {
  const dep = { ...req.body, deposit_id: `DEP-${Date.now()}`, status: 'Pending', submitted_at: new Date().toISOString() };
  monthlyDeposits.unshift(dep);
  res.json({ success: true, deposit: dep });
});

app.get(['/api/deposits/lumpsum', '/deposits/lumpsum'], (req, res) => res.json({ success: true, deposits: lumpsumDeposits }));
app.post(['/api/deposits/lumpsum', '/deposits/lumpsum'], (req, res) => {
  const dep = { ...req.body, lumpsum_id: `LMP-${Date.now()}`, status: 'Pending', submitted_at: new Date().toISOString() };
  lumpsumDeposits.unshift(dep);
  res.json({ success: true, deposit: dep });
});

app.get(['/api/lands', '/lands'], (req, res) => res.json({ success: true, lands }));
app.get(['/api/directors', '/directors'], (req, res) => res.json({ success: true, directors }));
app.get(['/api/gallery', '/gallery'], (req, res) => res.json({ success: true, gallery }));
app.get(['/api/notifications', '/notifications'], (req, res) => res.json({ success: true, notifications }));

app.post(['/api/auth/login', '/auth/login'], (req, res) => {
  const { email, password, googleAuth, quickAuth, full_name, avatar_url } = req.body;
  const user = members.find(m => m.email.toLowerCase() === (email || '').trim().toLowerCase());
  if (user) {
    return res.json({ success: true, member: user });
  }
  if (googleAuth || quickAuth) {
    const isOwner = (email || '').toLowerCase() === 'bondhon.biniyog@gmail.com' || (email || '').toLowerCase() === 'admin@bob.com';
    const newMember = {
      member_id: `BoB-${String(members.length + 1).padStart(3, '0')}`,
      full_name: full_name || 'নতুন সদস্য',
      email: email.trim().toLowerCase(),
      phone: '+880 1712-000000',
      role: isOwner ? 'Admin' : 'Member',
      status: 'Active',
      monthly_target: 5000,
      total_monthly_paid: 0,
      total_lumpsum_paid: 0,
      grand_total_paid: 0,
      due_installments: 0,
      owned_shares: 0,
      has_accepted_terms: true,
      avatar_url: avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`,
      joined_date: new Date().toISOString().slice(0, 10)
    };
    members.push(newMember);
    return res.json({ success: true, member: newMember });
  }
  return res.status(401).json({ success: false, message: 'ভুল ইমেইল বা পাসওয়ার্ড' });
});

app.post(['/api/auth/register', '/auth/register'], (req, res) => {
  const { full_name, email, phone, monthly_target, live_photo_url } = req.body;
  const newMember = {
    member_id: `BoB-${String(members.length + 1).padStart(3, '0')}`,
    full_name: full_name || 'নতুন সদস্য',
    email: (email || '').trim().toLowerCase(),
    phone: phone || '',
    role: 'Member',
    status: 'Pending',
    monthly_target: Number(monthly_target) || 5000,
    total_monthly_paid: 0,
    total_lumpsum_paid: 0,
    grand_total_paid: 0,
    due_installments: 0,
    owned_shares: 0,
    has_accepted_terms: false,
    avatar_url: live_photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email || 'User')}`,
    joined_date: new Date().toISOString().slice(0, 10)
  };
  members.push(newMember);
  res.json({ success: true, member: newMember });
});

// File upload support
app.post(['/api/files/upload', '/files/upload'], (req, res) => {
  const fileItem = {
    id: `file-${Date.now()}`,
    name: 'uploaded_document',
    size: 1024,
    mimeType: 'image/jpeg',
    url: '/bob-logo.png',
    uploadedAt: new Date().toISOString(),
    category: 'general'
  };
  storedFiles.push(fileItem);
  res.json({ success: true, url: fileItem.url, file: fileItem });
});

app.post(['/api/files/upload-dataurl', '/files/upload-dataurl'], (req, res) => {
  const { dataUrl, filename, category } = req.body;
  const fileItem = {
    id: `file-${Date.now()}`,
    name: filename || 'file.png',
    size: dataUrl ? dataUrl.length : 1024,
    mimeType: 'image/png',
    url: dataUrl || '/bob-logo.png',
    uploadedAt: new Date().toISOString(),
    category: category || 'general'
  };
  storedFiles.push(fileItem);
  res.json({ success: true, url: fileItem.url, file: fileItem });
});

app.get(['/api/files', '/files'], (req, res) => res.json({ success: true, files: storedFiles }));

// Vercel Serverless Handler
export default (req, res) => {
  return app(req, res);
};
