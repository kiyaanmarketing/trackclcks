import { connectDB, getDB } from '@/lib/mongo-config';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { hostname, newStatus } = req.body;

    if (!hostname || !newStatus) {
      return res.status(400).json({ message: 'Hostname and status are required' });
    }

    try {
      await connectDB();
      const db = getDB();

      const result = await db.collection('trackingUrlsConfig').updateOne(
        { hostname },
        { $set: { status: newStatus, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'URL not found' });
      }

      return res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
      console.error('Error toggling status:', error);
      return res.status(500).json({ message: 'Error toggling status' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
