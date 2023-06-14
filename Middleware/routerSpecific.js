// import jsonwebtoken
const jwt = require('jsonwebtoken')
// define logic for checking whether the user is logged in
const logMiddleware = (req,res,next)=>{
    console.log('router specific middleware');
    // get token
    const token = req.headers['access-token']
    // console.log('token is ',token);
    
    try{
        // verify token (funtransfer - taking loginAcno from jwt payload and storing it in const loginAcno (destructuring))
    const {loginAcno} = jwt.verify(token,'topsecretnukepassword')
    console.log(loginAcno);
    // pass loginAcno to req
    req.debitAcno = loginAcno
    // to process user request goes to getbalance in userController
    next()
    }
    catch(error){
        res.status(401).json("Please log in",error)
    }
}
module.exports = {
    logMiddleware
}