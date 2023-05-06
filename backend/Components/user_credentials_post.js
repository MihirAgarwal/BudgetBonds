// TODO
// ADD CSRF TOKEN TO GET ROUTE AND VALIDATE AT THIS POST ROUTE


const { hashSync } = require('bcrypt');
const pool = require('../DB/db');
const { create_error } = require("../utils/create_error");
const { email_validation } = require("../utils/email_validation");
const { password_validation } = require("../utils/password_validaton");
const { username_validation } = require("../utils/username_validation");
const bcrypt = require('bcrypt');

// wants email username and password
module.exports.user_credentials_post = async (req,res,next) => {

    try 
    {
        // REQUEST VALIDATION
        let request_body = req.body;
        let is_valid_request = validate_request(request_body);
        if(is_valid_request instanceof Error) throw is_valid_request;

        const {email,password,username} = request_body;

        // CHECKING IF THE USER WITH THIS EMAIL IS unauthentic user 
        let is_unauthentic_user_exist = await check_unauthentic_user_email(email);
        if(is_unauthentic_user_exist instanceof Error) throw is_unauthentic_user_exist;
        
        // CHANGE THE unauthentic user TO authentic_user
        let hashed_password = get_hashed_password(password);
        let answer = await pool.execute(`CALL unauthentic_user_to_authentic_user(?,?,?)`,[email,hashed_password,username])   
        if (answer instanceof Error) throw answer;

        // REDIRECT USER TO LOGIN PAGE
        res.json({"message": "REDIRECT TO LOGIN PAGE"});
    } 
    catch (error) 
    {
        next(error);
    }
   
}



function validate_request (request_body) {

    let is_valid_username = username_validation(request_body['username']);
    if(is_valid_username instanceof Error) return is_valid_username;

    let is_valid_password = password_validation(request_body['password']);
    if(is_valid_password instanceof Error) return is_valid_password;

    let is_valid_email = email_validation(request_body['email']);
    if(is_valid_email instanceof Error) return is_valid_email;

    if(request_body['email'] && request_body['password'] && request_body['username'] && Object.keys(request_body).length===3) return true;
    else return create_error('Invalid Request!!!',400);
}


async function check_unauthentic_user_email(email)
{
    let [rows,cols] = await pool.execute('SELECT * FROM unauthentic_users WHERE email = ?',[email]);

    if(rows.length===0) return create_error('Unauthorized!!!',401);
    else return true;
}

function get_hashed_password(password)
{
    let salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS))
    let hashed_password = hashSync(password,salt);
    console.log(hashed_password);
    return hashed_password;
}