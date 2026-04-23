const { connectDB, getDB } = require('./mongo-config');

async function initConfigs() {
  await connectDB();
  const db = getDB();
  const configs = [
    { hostname: "www.fareastflora.com", always: true, cartExtra: true },
    { hostname: "www.ofm.co.th", always: false, cartExtra: true },
    { hostname: "checkout.accorplus.com", always: true, cartExtra: false },
    { hostname: "www.studio7thailand.com", always: false, cartExtra: true },
    { hostname: "www.bnn.in.th", always: false, cartExtra: true },
    { hostname: "gfiberprepaid.globe.com.ph", always: true, cartExtra: false },
    { hostname: "shop.globe.com.ph", always: true, cartExtra: false },
    { hostname: "www.watsons.com.hk", always: false, cartExtra: true },
    { hostname: "compasia.sg", always: true, cartExtra: true },
    { hostname: "compasia.my", always: true, cartExtra: true },
    { hostname: "www.samsung.com", always: true, cartExtra: true },
  ];

  for (const config of configs) {
    await db.collection('siteConfigs').updateOne(
      { hostname: config.hostname },
      { $set: config },
      { upsert: true }
    );
  }

  console.log('Configs inserted');
  process.exit(0);
}

initConfigs();