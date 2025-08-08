import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

const uri = process.env.MONGO_URI;
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("myPassword"); // ✅ specify your DB name

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("passOP");

    if (req.method === "GET") {
      const passwords = await collection.find({}).toArray();
      return res.status(200).json(passwords);
    }

    if (req.method === "POST") {
      const newPassword = req.body;
      if (!newPassword.id) {
        newPassword.id = uuidv4();
      }
      const insertResult = await collection.insertOne(newPassword);
      return res.status(201).json(insertResult);
    }

    if (req.method === "DELETE") {
      const deleteResult = await collection.deleteOne({ id: req.body.id });
      return res.status(200).json(deleteResult);
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
