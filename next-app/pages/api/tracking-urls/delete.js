import { connectDB, getDB } from '@/lib/mongo-config';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { hostname } = req.query;

    if (!hostname) {
      return res.status(400).json({ message: 'Hostname is required' });
    }

    try {
      await connectDB();
      const db = getDB();

      const result = await db.collection('trackingUrlsConfig').deleteOne({ hostname });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'URL not found' });
      }

      return res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
      console.error('Error deleting URL:', error);
      return res.status(500).json({ message: 'Error deleting URL' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
