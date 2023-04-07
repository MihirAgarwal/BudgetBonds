const jwt = require('jsonwebtoken');
const { create_access_token } = require('../utils/create_access_token');
const { create_error } = require('../utils/create_error');

module.exports.refresh_token_post = (req,res,next)=>{
    
    try 
    {
        // Taken the refresh token from cookies
        let refresh_token = req.cookies['refreshToken'];
        console.log("REFRESH TOKEN ",refresh_token);
        // If refresh token is undefined that means refresh token is expired
        if(typeof refresh_token === 'undefined') throw create_error('Please Login Again!!!',401);

        // Taking the payload from the refresh token and creating a new access token
        let payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
        console.log("REFRESH PAYLOAD",payload);
        let new_access_token = create_access_token({"username":payload['username']});
        console.log("B");
        
        // Setting access token in the response cookie
        res.cookie("accessToken" , new_access_token , { httpOnly : true , secure : true , sameSite: 'lax' } );
        res.json({"message":"Token refreshed!!"});

    } catch (error) {
        next(error);
    }
    

    
}