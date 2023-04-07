const { create_error } = require("./create_error");

module.exports.password_validation = (password)=>{

    // Should have password
    let is_password_present = password?true:false;

    // password should be string
    let is_password_string = is_password_present && typeof password==='string';

    // password should not have closing or opening tags
    let is_tags_present_password = is_password_string && password.includes('<') && password.includes('>');

    let conditions_satisfied = is_password_present
                            && is_password_string
                            && !is_tags_present_password; 

    if( conditions_satisfied !== true ) return create_error('Invalid Request!!!', 400);

    // PASSWORD LENGTH VALIDATION
    if(password.length < 8) return create_error('Length of password should not be less than 8!!',400); 
    if(password.length > 16) return create_error('Length of password should not be greater than 16!!',400);

    return true;
}