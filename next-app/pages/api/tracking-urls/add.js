import { connectDB, getDB } from '@/lib/mongo-config';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { hostname, affiliateUrl, tagUrl, status } = req.body;

    if (!hostname || !affiliateUrl) {
      return res.status(400).json({ message: 'Hostname and URL are required' });
    }

    try {
      await connectDB();
      const db = getDB();

      // Check if hostname already exists
      const existing = await db.collection('trackingUrlsConfig').findOne({ hostname });
      if (existing) {
        return res.status(400).json({ message: 'Hostname already exists' });
      }

      const newUrl = {
        hostname,
        affiliateUrl,
        tagUrl: tagUrl || '',
        status: status || 'active',
        createdAt: new Date(),
      };

      await db.collection('trackingUrlsConfig').insertOne(newUrl);
      return res.status(200).json({ message: 'URL added successfully', data: newUrl });
    } catch (error) {
      console.error('Error adding URL:', error);
      return res.status(500).json({ message: 'Error adding URL' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
