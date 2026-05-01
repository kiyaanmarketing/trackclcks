const { connectDB, getDB } = require('../../../lib/mongo-config');

export default async function handler(req, res) {
  try {
    await connectDB();
    const db = getDB();
    const { hostname } = req.query;

    if (req.method === 'DELETE') {
      await db.collection('siteConfigs').deleteOne({ hostname });
      return res.status(200).json({ message: 'Config deleted' });
    }

    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API /site-configs/[hostname] error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
