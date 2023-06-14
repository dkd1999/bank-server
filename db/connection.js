// define node app and monngoDB database connectivity


// import mongoose in connection.js file
const mongoose = require('mongoose')

// to get connection string from .env file : process.env
const connectionString = process.env.DATABASE

// connect node app with mongodb using connection string with the help of mongoose
mongoose.connect(connectionString,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("MongoDB Atlas : Online");
}).catch((error)=>{
    console.log("Connection Error"+error);
})