const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '..', '.env') });

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (db) return;
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

function getDB() {
  if (!db) {
    throw new Error('MongoDB not connected');
  }
  return db;
}

module.exports = { connectDB, getDB };
