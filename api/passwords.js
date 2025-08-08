import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  const { client, db } = await connectToDatabase();
  const collection = db.collection("passOP");

  try {
    switch (req.method) {
      case 'GET':
        const passwords = await collection.find({}).toArray();
        res.status(200).json(passwords);
        break;

      case 'POST':
        const newPassword = req.body;
        if (!newPassword.id) {
          newPassword.id = require('uuid').v4();
        }
        const insertResult = await collection.insertOne(newPassword);
        res.status(201).json(insertResult);
        break;

      case 'DELETE':
        const deleteResult = await collection.deleteOne({ id: req.body.id });
        res.status(200).json(deleteResult);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  } finally {
    // Don't close connection in serverless environment
  }
}