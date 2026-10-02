// Vercel Serverless Function entry point (/api)
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { url, method } = req;

  // Simple status / health API endpoint
  if (url === '/api/health' || url === '/api' || url === '/api/') {
    return res.status(200).json({
      status: 'online',
      app: 'Molla Family Tree & Bondhon O Biniyog',
      database: 'Firebase Firestore',
      platform: 'Vercel Serverless',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Molla Family Tree & Bondhon O Biniyog API Ready',
    note: 'Frontend directly communicates with Firebase Firestore in real-time.',
    timestamp: new Date().toISOString()
  });
}
