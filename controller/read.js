const dbConnect = require('../connection');

const readdata = async (req, res)=>{
    console.log("readdata")
    let data = await dbConnect();
    data = await data.find().toArray();
    console.log(data);
    res.send(data);

    
};

module.exports = { readdata };


