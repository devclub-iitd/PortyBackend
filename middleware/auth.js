const jwt = require('jsonwebtoken')
const config = require('../config/keys')


module.exports = function (req,res,next) {
    //get token from header
    const token = req.header('x-auth-token')

    //check if there is no token
    if(!token){
        return res.status(401).json({ msg : "Authorization denied as no token present"})
    }

    //check the validity of the token
    try{
        const decoded = jwt.verify(token,config.secretkey)
        req.user = decoded.user   //this will give us the user:id in req.user.id
        next()
    }catch(err){
        console.error(err)
        res.status(500).json({msg:"Token not valid"})
    }
}


