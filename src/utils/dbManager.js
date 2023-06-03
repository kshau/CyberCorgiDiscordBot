const { MongoClient, ServerApiVersion } = require('mongodb');

const {MONGO_DB_CONNECT} = process.env;

const client = new MongoClient(MONGO_DB_CONNECT, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

client.connect();
const database = client.db("CyberCorgi");

const WORD_CHAIN_COLLECTION = database.collection("word_chain");
const CAPITAL_GUESS_COLLECTION = database.collection("capital_guess");
const CONV_COLLECTION = database.collection("ai_conversations");

module.exports = {WORD_CHAIN_COLLECTION, CAPITAL_GUESS_COLLECTION, CONV_COLLECTION};