// const { json } = require('body-parser');
const dbConnect = require('../connection');
const pipeline = [
    {
        '$match':{
            'operationType': 'insert',
            'fullDocument.status':'pending'
        },

    }
];
// const timeInMs = 60000;

// const pipeline = [
//     {
//         '$match': {
//             'operationType': 'insert',
//             'fullDocument.address.country': 'Australia',
//             'fullDocument.address.market': 'Sydney'
//         },
//     }
// ];

function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
};


const getPendingPaymentsData = async (req, res)=>{
    let data = await dbConnect();
    const changeStream = data.watch(pipeline);
    changeStream.on('change', (next) =>{
        console.log(next);
        res.send({name: next.fullDocument.name, amountPending : next.fullDocument.amountPending, amountPaid:  next.fullDocument.amountPaid, currentBill : next.fullDocument.currentBill});
    });

    // await closeChangeStream(timeInMs = 60000, changeStream);
    
    // console.log(data);
    // res.send('from the get Order Summary function');

};

module.exports = { getPendingPaymentsData };
