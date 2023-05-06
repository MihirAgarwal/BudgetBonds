const jwt = require('jsonwebtoken');

module.exports.check_access_token = (req,res,next)=>{
    
    try {
        let access_token = req.cookies['accessToken'];
    
        if(typeof access_token === 'undefined') throw create_error('Unauthorized!!!',401);
        
        let payload = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
        let username = payload['username'];
        
        req.body['username'] = username;
        next();

    } catch (error) {
        next(error);        
    }

}