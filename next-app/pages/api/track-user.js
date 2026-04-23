const { connectDB, getDB } = require('../../lib/mongo-config');

async function getAffiliateUrlByHostNameFindActive(hostname) {
  const db = getDB();
  try {
    const result = await db.collection('HostNameN').findOne({ hostname, status: 'active' });
    return result ? result.affiliateUrl : '';
  } catch (error) {
    console.error('MongoDB Error:', error);
    return '';
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { url, referrer, unique_id, origin } = req.body;
  if (!url || !unique_id) {
    return res.status(400).json({ success: false, error: 'Invalid request data' });
  }

  try {
    await connectDB();
    const affiliateUrl = await getAffiliateUrlByHostNameFindActive(origin);
    if (!affiliateUrl) {
      return res.json({ success: true, affiliate_url: '' });
    }
    return res.json({ success: true, affiliate_url: affiliateUrl });
  } catch (error) {
    console.error('Track-user error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
