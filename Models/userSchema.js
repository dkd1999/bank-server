// import mongoose in userSchema.js
const mongoose = require('mongoose')

// using mongoose define schema for users   (schema is a class userschema is a taken as an object of schema so use new)
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    acno:{
        type:Number,
        required:true,
        unique:true
    },
    balance:{
        type:Number,
        required:true
    },
    transactions:{
        type:Array,
        required:true
    }
})

// create a model / collection to store documents as the given schema (make sure variable name and model are same to reduce errors)
const users = mongoose.model('users',userSchema)

// export model
module.exports = users