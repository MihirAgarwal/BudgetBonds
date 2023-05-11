require('dotenv').config();
const pool = require('../DB/db');
const bcrypt = require('bcrypt');
const {create_access_token} = require('../utils/create_access_token');
const {create_error} = require('../utils/create_error');
const jwt = require('jsonwebtoken');
const { username_validation } = require('../utils/username_validation');
const { password_validation } = require('../utils/password_validaton');

module.exports.login_post = async (req,res,next)=>{
    
    try 
    {
        // REQUEST VALIDATION
        let request_body = req.body;
        let is_valid_request = validate_request(request_body);    
        if(is_valid_request instanceof Error) throw is_valid_request;

        let {username , password} = request_body;

        // Checking if the user is a verified user
        let is_authentic_user = await is_authenticated_user(username,password);
        if(is_authentic_user instanceof Error) throw is_authentic_user;
        


        // SENDING JWT IF USER EXISTS AND DETAILS ARE CORRECTLY ENTERED
        let payload = {"username":username};
        
        //Creating an access token
        let accessToken = create_access_token(payload);
        
        //Creating a refresh token
        let refreshToken = jwt.sign( payload , process.env.REFRESH_TOKEN_SECRET , {
            algorithm: "HS256",
            expiresIn: process.env.REFRESH_TOKEN_LIFE
        });

        // setting token in response cookies
        res.cookie("accessToken" , accessToken , { httpOnly : true  , sameSite : 'lax' } );
        res.cookie("refreshToken" , refreshToken , { httpOnly : true , sameSite : 'lax' } );
        
        //sending the response
        res.json({ "message":"User Login Successful"});
    } 
    catch (error) 
    {
        next(error);    
    }

}


function validate_request(request_body)
{
    let is_valid_username = username_validation(request_body['username']); 
    if( is_valid_username instanceof Error ) return is_valid_username;
    
    let is_valid_password = password_validation(request_body['password']);
    if( is_valid_password instanceof Error ) return is_valid_password;

    // request should have a username and password only
    if( request_body['username'] && request_body['password'] && Object.keys(request_body).length===2 ) return true;
    else return create_error('Invalid Request!!!',400);
}


async function is_authenticated_user(username,password)
{
    let [rows,cols] = await pool.execute('SELECT * FROM authentic_users WHERE username = ?',[username]);
    console.log(rows);
    if(rows.length===0) return create_error('Please Signup and verify the email !!!',401);

    let hashed_user_password = rows[0]['user_password'];
    if( !bcrypt.compareSync(password,hashed_user_password) ) return create_error('Invalid username or password !!!',401);
    else return true;
}