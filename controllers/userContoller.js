// import model in userSchema in userController.js
const users = require("../Models/userSchema");

// import jsonwebtoken
const jwt = require('jsonwebtoken')
// define and export logic to resolve http client request

// register logic
exports.register = async (req, res) => {
  // register logic
  console.log(req.body);  //server.use(express.json) middleware parses json data the req.body
  // get data send by front end
  const { username, acno, password } = req.body;
  if (!username || !acno || !password) {
    res.status(403).json("All inputs are required!");
  }
  // check user is an existing user
  try {
    const pre_existing_user = await users.findOne({ acno });
    if (pre_existing_user) {
      res.status(406).send("User already exists !"); //406 - Not acceptable
    } else {
      // add non existing user to DB using new
      const newuser = new users({ //this - new
        username,
        password,
        acno,
        balance: 5000,
        transactions: [],
      });
      // to save newuser in mongoDB
      await newuser.save();
      res.status(200).json(newuser);
    }
  } catch {
    res.status(401).json(error);
  }
};

// login logic
exports.login = async (req, res) => {
  console.log(req.body);
  // get request body
  const { acno, password } = req.body;
  // if(!acno || !password){
  //     res.status(403).send("All fields are required")
  // }

  try {
    // check acno and password is in db
    const pre_existing_user = await users.findOne({ acno, password });
    if (pre_existing_user) {
      // generate token using jwt
      const token = jwt.sign({
        loginAcno : acno
      },'topsecretnukepassword')

      // send to client (frontend)
      res.status(200).json({pre_existing_user,token});
    } else {
      res.status(404).json("Invalid Account number or password");
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

// getbalance
exports.getbalance = async (req, res) => {
  // get acno from path parameter
  let acno = req.params.acno;
  // get data of given acno
  try {
    // find acno from user collections
    const pre_existing_user = await users.findOne({ acno });
    if (pre_existing_user) {
      res.status(200).json(pre_existing_user.balance);
    } else {
      res.status(404).json("Invalid account number");
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

// fund transfer
exports.transfer = async (req,res) => {
  console.log('inside fund transfer');
  // logic
  // 1. get body from req -  creditAcno, creditAmount, pswd
      const {creditAcno, creditAmount, pswd} = req.body
      // convert creditamount to number
      let amt = Number(creditAmount)
      const {debitAcno} = req
      console.log("fund transfer - debitAcno",debitAcno);
  try{
    // 2. check debitAcno and pswd is available in MongoDB Atlas
      const debitUserDetails = await users.findOne({acno:debitAcno,password:pswd})
      console.log(debitUserDetails);
      // res.send("transfer request received")
    
      // 3. get credit acno details from mongoDB
      const creditUserDetails = await users.findOne({acno:creditAcno})
      console.log(creditUserDetails);
      // for no self transactions
      if(debitAcno!=creditAcno){
        if(debitUserDetails && creditUserDetails){
          // check sufficient balance available for debitUserDetails
          if(debitUserDetails.balance>=creditAmount){
            // perform transfer
            // debit(reduce) creditAmount from debituserDetails
            debitUserDetails.balance-=amt
            // add debit transaction to debitUserDetails
            debitUserDetails.transactions.push({
              transaction_type:"DEBIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
            })
            // save debituserDetails in MongoDb
            debitUserDetails.save()
    
            // credit(add) creditAmount to credituserDetails
            creditUserDetails.balance+=amt
            // add credit transaction to creditUserDetails
            creditUserDetails.transactions.push({
              transaction_type:"CREDIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
            })
            // save credituserDetails in MongoDB
            creditUserDetails.save()
            res.status(200).json("Transaction Successfull")
          }
          else{
            // insufficient amount
            res.status(406).json("Insufficient balance")
          }
        }
        else{
          res.status(406).json("Invalid Credit / Debit details")
        } 
      }
      else{
        res.status(406).json("Operation Denied.Self Transactions are not allowed.")
      }
    }
    catch(error){
      res.status(401).json(error)
    }
    
}

// getTransactions
exports.getTransactions = async (req,res) => {
  // 1. get acno from req.debitAcno
  let acno = req.debitAcno
  //2. check whether user is in mongoDB ATLAS or not
  try {
      const pre_existing_user = await users.findOne({acno}) //{mongoDB key : local variable}
      res.status(200).json(pre_existing_user.transactions)
  }
  catch (error) {
    res.status(401).json("Invalid Account Number")
  }
}

// deletemyAcno
exports.deleteMyAcno = async (req,res) => {
  // 1. get acno from req
  let acno = req.debitAcno

  // remove acno from db
  try {
    await users.deleteOne({acno})
    res.status(200).json('Removed Successfully')
  } catch (error) {
    res.status(401).json(error)
  }
}