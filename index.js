// import
// loads .env file contents into process.env
require('dotenv').config();
// import express
const express = require('express')
// import cors
const cors = require('cors');
// import json web token
const jwt = require('jsonwebtoken')

// test middleware
const middleware = require('./Middleware/appMiddleware')


// import db
require('./db/connection')

// import router
const router = require('./Routes/router');

// create express server
const server = express()

// setup port number for server
      //dynamic      //static
const PORT = 3000 || process.env.PORT  //after deploying automatically change the local port to the deployed port number aka deployed url
// use cors, json parser in server app
server.use(cors())
server.use(express.json())

// use middleware
server.use(middleware.appMiddleware)

// only after middleware we must use router
// use router
server.use(router) 

// to resolve http request using express server
server.get('/', (req,res)=>{
    res.send(`<h2>Bank server ONLINE</h2>`)
})

// server.post('/',(req,res)=>{
//     res.send("post method")
// })

// server.delete('/',(req,res)=>{
//     res.send("Delete this")
// })

// server.put('/',(req,res)=>{
//     res.send("Put it in yah mouth")
// })

// run the server app in a specified port number
server.listen(PORT,()=>{
    console.log(`Bank server started at port number ${PORT}`);
})