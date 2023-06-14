// define application specific middleware

const appMiddleware = (req,res,next)=>{
    console.log("Bank App -  app specific middleware");
    next()
}
// ingane kodutha exports. maati const aakanm
module.exports={
    appMiddleware
}