const {create_error} = require('../utils/create_error');
const {send_mail} = require('../utils/send_mail');
const pool = require('../DB/db');

const email_validator = require('email-validator');
const {uuid} = require('uuidv4'); 
const bcrypt = require('bcrypt');

module.exports.add_unauth_user = async (request,response,next)=>{

    try 
    {
        // REQUEST VALIDATION
        let is_valid_request = validate_request(request.body);
        if(!is_valid_request) throw create_error('Invalid Request!!!',400);
        
        let {email,password} = request.body;

        // PASSWORD LENGTH VALIDATIONS
        if(password.length < 8) throw create_error('Length of password should not be less than 8!!',400);
        if(password.length > 16) throw create_error('Length of password should not be greater than 16!!',400);
        
        // EMAIL AS WELL AS DOMAIN NAME VALIDATIONS
        let is_valid_domain_name = check_domain_name(email);
        //console.log('is_valid_domain_name ',is_valid_domain_name);
        if(typeof is_valid_domain_name === 'undefined') throw create_error('Invalid Request!!!',400);
        if(!is_valid_domain_name ) throw create_error('Domain Name of email is not accepted!!!',400);
        
        // CHECKING IF USER IS ALREADY AN AUTHENTICATED USER
        let [rows,cols] = await pool.execute('SELECT * FROM authentic_users WHERE email=?',[email]) ;
        //console.log(rows);
        if(rows.length!==0) throw create_error('User Already Exists!!!',401)

        // GETTING A UNIQUE CONFIRMATION CODE 
        let confirmation_code = uuid();
        
        // SEND MAIL
        let is_mail_sent = await send_mail(email , confirmation_code);
        if(!is_mail_sent) throw new Error;

        // HASHING THE CONFIRMATION CODE AND PASSWORD
        const salt = bcrypt.genSaltSync( parseInt(process.env.SALT_ROUNDS) ) ;
        let hashed_password = bcrypt.hashSync(password , salt);
        let hashed_confirmation_code = bcrypt.hashSync(confirmation_code , salt);

        // ADDING UNAUTHENTICATED USER
        let answer = await pool.execute('INSERT INTO unauthentic_users (email,user_password,confirmation_code) VALUES (?,?,?) ON DUPLICATE KEY UPDATE user_password=?,confirmation_code=?',[
            email,
            hashed_password,
            hashed_confirmation_code,
            hashed_password,
            hashed_confirmation_code
        ]);
        //console.log(answer);

        return response.json({"message":"MAIL SENT SUCCESSFULLY!!!"});

    } catch (error) {
        next(error);
    }

}


let validate_request = (request_body)=>{
    
    //Should have email in request
    let is_email_in_request = request_body['email']?true:false; 
    //console.log('is_email_in_request',is_email_in_request);

    //Should have password in request
    let is_password_in_request = request_body['password']?true:false;
    //console.log('is_password_in_request',is_password_in_request);
    
    //email should be string
    let is_email_string = (is_email_in_request && typeof request_body['email']=='string')
    //console.log('is_email_string',is_email_string);
    
    //password should be string
    let is_password_string = (is_password_in_request && typeof request_body['password']=='string')
    //console.log('is_password_string',is_password_string);
    
    //email should have a @ symbol
    let is_at_symbol_in_email = (is_email_string && request_body['email'].includes('@'));
    //console.log('is_at_symbol_in_email',is_at_symbol_in_email);
    
    //email should have a .com at the end
    let email_ends_with_dot_com = (is_email_string && request_body['email'].endsWith('.com'));
    //console.log('email_ends_with_dot_com',email_ends_with_dot_com);
    
    let username,domain_name;
    if(is_email_string)
    [username,domain_name] = request_body['email'].split('@');
    else return false;
    
    // length of username should not be 0
    let is_username_length_0 = username.length===0;
    //console.log('is_username_length_0',is_username_length_0);
    
    // length of username less than 64
    let is_username_length_less_than_64 = username.length<64; 
    //console.log('is_username_length_less_than_64',is_username_length_less_than_64);
    
    // There should be no < > tags in email
    let is_opening_tag_present_in_email = is_email_string && request_body['email'].includes('<');
    let is_closing_tag_present_in_email = is_email_string &&request_body['email'].includes('>');
    let is_tags_present_email = is_opening_tag_present_in_email && is_closing_tag_present_in_email;
    //console.log('is_tags_present_email',is_tags_present_email);
    
    // There should be no < > tags in password
    let is_opening_tag_present_in_password = is_password_string && request_body['password'].includes('<');
    let is_closing_tag_present_in_password = is_password_string && request_body['password'].includes('>');
    let is_tags_present_password = is_opening_tag_present_in_password && is_closing_tag_present_in_password;
    //console.log('is_tags_present_password',is_tags_present_password);
    
    //There should only be email and password in request
    let is_only_email_n_password = is_email_in_request && is_password_in_request &&Object.keys(request_body).length===2;
    //console.log('is_only_email_n_password',is_only_email_n_password);

    // forming conditions for a valid request
    let conditions_satisfied = is_email_in_request
                            && is_password_in_request
                            && is_email_string
                            && is_password_string
                            && is_at_symbol_in_email
                            && email_ends_with_dot_com
                            && !is_username_length_0
                            && is_username_length_less_than_64
                            && !is_tags_present_email
                            && !is_tags_present_password 
                            && is_only_email_n_password ;


    return conditions_satisfied;
}


let check_domain_name = (email)=>{

    // CHECKING IF EMAIL IS VALID AND ITS LENGTH LESS THAN 255
    let is_valid_email = email_validator.validate(email);
    if(!is_valid_email || email.length>255) return undefined;

    let [username , domain_dot_com] = email.split('@');
    let domain = domain_dot_com.split('.com')[0];
    //console.log(domain);
    if(domain==='gmail' || domain==='hotmail' || domain==='yahoo')
    return true;
    else return false;
}