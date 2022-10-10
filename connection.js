const { MongoClient } =  require("mongodb");
require('dotenv').config();
const url = process.env.MONGOURL;
const database = 'AggregationDB';
const collection = 'orders';

const client = new MongoClient(url);
async function dbConnect(){
    let result = await client.connect();
    console.log("connected");
    db =  result.db(database);

    return db.collection(collection);
}

module.exports = dbConnect;
