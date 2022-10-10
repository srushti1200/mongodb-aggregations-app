const express = require("express");
const app = express();





require('dotenv').config();
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("Server created");
})

app.use(express.json());

// const conn  = require('./connectionUsingMongoose');

// const conn = require('./connection');
app.use('/', require("./routes/router"));




