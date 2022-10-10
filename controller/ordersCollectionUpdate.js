const dbConnect = require('../connection');

function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            changeStream.close();
            resolve();
        }, timeInMs)
    })
};

const getUpdate = async(req, res)=>{
    let data = await dbConnect();
    const changeStream = data.watch();
    changeStream.on('change', (next) =>{
        console.log(next);
        res.send({operationPerformed: next.operationType, clusterTime: next.clusterTime});
    });

    await closeChangeStream(timeInMs = 60000, changeStream);
};

module.exports =   { getUpdate };