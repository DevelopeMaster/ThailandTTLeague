const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const uri = `mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority&appName=Users`;

const client = new MongoClient(uri, {
    maxPoolSize: 50, // Максимальное количество соединений в пуле
    minPoolSize: 10, // Минимальное количество соединений в пуле
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    connectTimeoutMS: 10000, // Время ожидания подключения (в миллисекундах)
    socketTimeoutMS: 20000,  // Тайм-аут для сокетов
    retryReads: true,        // Автоматические повторы при сбое чтения
    retryWrites: true,       // Автоматические повторы при сбое записи
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

