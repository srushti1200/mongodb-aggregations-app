// const dbConnect = require('../connection');

const { MongoClient } =  require("mongodb");
require('dotenv').config();
const url = process.env.MONGOURL;

/******  changeStream pipeline  ******/
const pipeline = [
    {
        '$match':{
            'operationType': 'update'
        },

    }
];

/********* Pipeline to execute after change stream execution ********/
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

/*************  get order summary  */
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

/*********  to close changeStream  ********/
function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
};

const onUpdate = async(req, res)=>{
    const client = new MongoClient(url);
    try{
      await client.connect();
    
      const changeStream = client.db("AggregationDB").collection("orders").watch(pipeline);
      changeStream.on('change', (next)=>{
          console.log(next);
          res.send({clusterTime: next.clusterTime, 'update Details': next.updateDescription});
      })
      await getOrderSummary(client);
      await closeChangeStream(60000, changeStream);
    }
    finally{
        await client.close();
    }

    // require('../aggregationPipeline'); // to run the other pipeline
    
};

module.exports= { onUpdate };