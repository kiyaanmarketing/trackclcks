import { connectDB, getDB } from '@/lib/mongo-config';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { hostname, newUrl, newTag, newStatus } = req.body;

    if (!hostname || !newUrl) {
      return res.status(400).json({ message: 'Hostname and URL are required' });
    }

    try {
      await connectDB();
      const db = getDB();

      const updateData = {
        affiliateUrl: newUrl,
        tagUrl: newTag || '',
        status: newStatus || 'active',
        updatedAt: new Date(),
      };

      const result = await db.collection('trackingUrlsConfig').updateOne(
        { hostname },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'URL not found' });
      }

      return res.status(200).json({ message: 'URL updated successfully' });
    } catch (error) {
      console.error('Error editing URL:', error);
      return res.status(500).json({ message: 'Error editing URL' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
