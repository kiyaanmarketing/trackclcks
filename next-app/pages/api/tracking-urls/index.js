import { connectDB, getDB } from '@/lib/mongo-config';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await connectDB();
      const db = getDB();
      const urls = await db.collection('trackingUrlsConfig').find({}).toArray();
      return res.status(200).json(urls);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      return res.status(500).json({ message: 'Error fetching URLs' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
