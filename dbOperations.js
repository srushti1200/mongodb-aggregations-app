console.log("inside dbOperations");

const { MongoClient } =  require("mongodb");
require('dotenv').config();
const url = process.env.MONGOURL;
const database = 'AggregationDB';
const collection = 'orders';
// console.log(database, collection)
const client = new MongoClient(url);
async function dbConnect(){
    console.log("inside dbConnect")
    let result = await client.connect();
    console.log("connected");
    db =  result.db(database);
    return db.collection(collection);
}



const insertData =  async ()=>{
    let data = await dbConnect();

    let order17 = {
        userId: {
            $oid: "633ac0c14cf9ad2ece9e1257"
          },
            name: "Srushti",
            status: "pending",
            amountPaid: 4500,
            amountPending: 2500,
            currentBill: 7000
          };

    const result =  await data.insertOne(order17);
    console.log(result);
};

insertData();


const updateData = async()=>{
    let data = await dbConnect();
    let updateObj = {
        userId: {
            $oid: "633ac0c14cf9ad2ece9e1257"
          },
            name: "Srushti",
            status: "pending",
            amountPaid: 4500,
            amountPending: 2500,
            currentBill: 7000
          };
}


