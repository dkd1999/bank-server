// import express
const express = require('express')
// import routerSpecific Middleware
const middleware = require('../Middleware/routerSpecific')

// create routes, using express.Router() class, object (express router classine oru objectilek eduth vechu)
const router = new express.Router()

// import controller
const userController = require('../controllers/userContoller')

// define routes to resolve http requests

// register request
router.post('/employee/register',userController.register)

// login request
router.post('/employee/login',userController.login)

// balance Enquiry // router specific middleware(logMiddleware) for login check getbalance
router.get('/user/balance/:acno',middleware.logMiddleware,userController.getbalance)

// fund transfer
router.post('/user/transfer',middleware.logMiddleware,userController.transfer)

// ministatement
router.get('/user/ministatement',middleware.logMiddleware,userController.getTransactions)

// deleteaccount
router.delete('/user/delete',middleware.logMiddleware,userController.deleteMyAcno)

// import router
module.exports = router;