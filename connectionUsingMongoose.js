const mongoose = require("mongoose");
const url = process.env.MONGOURL;

require('dotenv').config();

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true});
const conn = mongoose.connection;

conn.on('open',function (){
    console.log('connected...');
})

module.exports = conn;


