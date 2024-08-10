const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const uri = `mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority&appName=Users`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db('ttleague');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

function getDB() {
    
    if (!db) {
        throw new Error("Database not initialized");
    }
    return db;
}

module.exports = { connectDB, getDB, client };

