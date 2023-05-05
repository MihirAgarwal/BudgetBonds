const email_validator = require('email-validator');
const { create_error } = require('./create_error');


module.exports.email_validation = (email)=>
{
    let is_valid_email_username = email_username_validation(email);
    if(is_valid_email_username instanceof Error) return is_valid_email_username;

    let is_valid_domain_name = email_domain_validation(email);
    if(is_valid_domain_name instanceof Error) return is_valid_domain_name;

    return true;
}


let email_username_validation = (email)=>{

    //Should have email in request
    let is_email_in_request = typeof email === 'undefined' ? false:true; 
    //console.log('is_email_in_request',is_email_in_request);

    //email should be string
    let is_email_string = (is_email_in_request && typeof email=='string')
    //console.log('is_email_string',is_email_string);

    //email should have a @ symbol
    let is_at_symbol_in_email = (is_email_string && email.includes('@'));
    //console.log('is_at_symbol_in_email',is_at_symbol_in_email);

    //email should have a .com at the end
    let email_ends_with_dot_com = (is_email_string && email.endsWith('.com'));
    //console.log('email_ends_with_dot_com',email_ends_with_dot_com);

    let username,domain_name;
    if(is_email_string)
    [username,domain_name] = email.split('@');
    else return false;

    // length of username should not be 0
    let is_username_length_0 = username.length===0;
    //console.log('is_username_length_0',is_username_length_0);

    // length of username less than 64
    let is_username_length_less_than_64 = username.length<64; 
    //console.log('is_username_length_less_than_64',is_username_length_less_than_64);

    // There should be no < > tags in email
    let is_opening_tag_present_in_email = is_email_string && email.includes('<');
    let is_closing_tag_present_in_email = is_email_string && email.includes('>');
    let is_tags_present_email = is_opening_tag_present_in_email && is_closing_tag_present_in_email;
    //console.log('is_tags_present_email',is_tags_present_email);

    // forming conditions for a valid request
    let conditions_satisfied = is_email_in_request
                            && is_email_string
                            && is_at_symbol_in_email
                            && email_ends_with_dot_com
                            && !is_username_length_0
                            && is_username_length_less_than_64
                            && !is_tags_present_email;


    if(conditions_satisfied===true) return true;
    else return create_error('Invalid Request!!!',400);

}


let email_domain_validation = (email)=>{

    // CHECKING IF EMAIL IS VALID AND ITS LENGTH LESS THAN 255
    let is_valid_email = email_validator.validate(email);
    if(!is_valid_email || email.length>255) return create_error('Invalid Request!!!',400);

    let [username , domain_dot_com] = email.split('@');
    let domain = domain_dot_com.split('.com')[0];

    if(domain==='gmail' || domain==='hotmail' || domain==='yahoo')
    return true;
    else return create_error('Domain Name of email is not accepted!!!',400);

}