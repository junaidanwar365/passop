import express from "express"
import 'dotenv/config'
import { MongoClient } from "mongodb"
import bodyParser from "body-parser"
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

// MongoDB connection
let collection;

const client = new MongoClient(process.env.MONGO_URI);

try {
  await client.connect();
  console.log("✅ Connected to MongoDB Atlas");

  const db = client.db(); // will use DB name from URI
  collection = db.collection("passOP");

} catch (err) {
  console.error("❌ Failed to connect to MongoDB Atlas");
  console.error("Error Message:", err.message);
  process.exit(1); // Stop server if DB connection fails
}

// API Routes
app.get("/api/passwords", async (req, res) => {
  const data = await collection.find({}).toArray()
  res.json(data)
})

app.post("/api/passwords", async (req, res) => {
  const result = await collection.insertOne(req.body)
  res.json({ success: true, result })
})

app.delete("/api/passwords", async (req, res) => {
  const result = await collection.deleteOne(req.body)
  res.json({ success: true, result })
})

// Serve frontend from /dist
app.use(express.static(path.join(__dirname, "dist")))
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"))
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
