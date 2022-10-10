const { MongoClient } =  require("mongodb");
require('dotenv').config();
const url = process.env.MONGOURL;


const execPipeline =  [
  {
      '$group': {
          '_id': {
              'userId': '$userId', 
              'name': '$name'
          }, 
          'totalBill': {
              '$sum': '$currentBill'
          }, 
          'totalPending': {
              '$sum': '$amountPending'
          }, 
          'totalPaid': {
              '$sum': '$amountPaid'
          }, 
          'NumOrders': {
              '$sum': 1
          }
      }
  }, {
      '$project': {
          '_id': 1, 
          'NumOrders': 1, 
          'totalPaid': 1, 
          'totalBill': 1, 
          'status': {
              '$cond': {
                  'if': {
                      '$gte': [
                          0, {
                              '$subtract': [
                                  '$totalBill', '$totalPaid'
                              ]
                          }
                      ]
                  }, 
                  'then': 'paid', 
                  'else': 'pending'
              }
          }, 
          'pending': {
              '$cond': {
                  'if': {
                      '$lt': [
                          0, {
                              '$subtract': [
                                  '$totalBill', '$totalPaid'
                              ]
                          }
                      ]
                  }, 
                  'then': {
                      '$subtract': [
                          '$totalBill', '$totalPaid'
                      ]
                  }, 
                  'else': '$$REMOVE'
              }
          }
      }
  }
]

async function main(){
  const client = new MongoClient(url);
  try{
    await client.connect();

    await getOrderSummary(client);
  }
  finally{
    await client.close();
  }
}

main().catch(console.error);

async function getOrderSummary(client){

  const aggCursor =  client.db("AggregationDB").collection("orders").aggregate(execPipeline);
  await aggCursor.forEach(record =>{

    if(record.status == 'pending'){
      console.log(`name: ${record._id.name}\t status:${record.status} \t pending:${record.pending}`);
    }
    else{
      console.log(`name: ${record._id.name}\t status:${record.status} `);
    }
    
  })
}

// module.exports = { main };