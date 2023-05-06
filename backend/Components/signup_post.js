const {create_error} = require('../utils/create_error');
const {send_mail} = require('../utils/send_mail');
const pool = require('../DB/db');

const {uuid} = require('uuidv4'); 
const bcrypt = require('bcrypt');
const { email_validation } = require('../utils/email_validation');

module.exports.signup_post = async (req,response,next)=>{

    try 
    {
        // REQUEST VALIDATION
        let request_body = req.body;
        let is_valid_request = validate_request(request_body); 
        if( is_valid_request instanceof Error ) throw is_valid_request
        
        let {email} = request_body;

        // CHECKING IF USER IS ALREADY AN AUTHENTICATED USER
        let [rows,cols] = await pool.execute('SELECT * FROM authentic_users WHERE email=?',[email]) ;
        console.log(rows);
        if(rows.length!==0) throw create_error('User Already Exists!!!',401)

        // GETTING A UNIQUE CONFIRMATION CODE 
        let confirmation_code = uuid();
        
        // SEND MAIL
        let is_mail_sent = await send_mail(email , confirmation_code);
        if(!is_mail_sent) throw new Error;

        // HASHING THE CONFIRMATION CODE AND PASSWORD
        const salt = bcrypt.genSaltSync( parseInt(process.env.SALT_ROUNDS) ) ;
        let hashed_confirmation_code = bcrypt.hashSync(confirmation_code , salt);

        // ADDING UNAUTHENTICATED USER
        let answer = await pool.execute('INSERT INTO unauthentic_users (email,confirmation_code) VALUES (?,?) ON DUPLICATE KEY UPDATE confirmation_code=?,signup_time=now()',[
            email,
            hashed_confirmation_code,
            hashed_confirmation_code
        ]);
        //console.log(answer);

        return response.json({"message":"MAIL SENT SUCCESSFULLY!!!"});

    } catch (error) {
        next(error);
    }

}


let validate_request = (request_body)=>{
 
    let is_valid_email = email_validation(request_body['email']);
    if(is_valid_email instanceof Error) return is_valid_email;

    if(request_body['email'] && Object.keys(request_body).length === 1) return true;
    else return create_error('Invalid Request!!!',400);
}