const { connectDB, getDB } = require('../../../lib/mongo-config');

export default async function handler(req, res) {
  try {
    await connectDB();
    const db = getDB();

    if (req.method === 'GET') {
      const configs = await db.collection('siteConfigs').find({}).toArray();
      const configObj = {};
      configs.forEach((c) => {
        configObj[c.hostname] = { always: c.always, cartExtra: c.cartExtra };
      });
      return res.status(200).json(configObj);
    }

    if (req.method === 'POST') {
      const { hostname, always, cartExtra } = req.body;
      if (!hostname) {
        return res.status(400).json({ error: 'Hostname required' });
      }
      await db.collection('siteConfigs').updateOne(
        { hostname },
        { $set: { hostname, always: always || false, cartExtra: cartExtra || false } },
        { upsert: true }
      );
      return res.status(200).json({ message: 'Config updated' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API /site-configs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
