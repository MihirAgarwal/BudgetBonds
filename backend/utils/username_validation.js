const { create_error } = require("./create_error");

module.exports.username_validation = (username)=>{
    
    // Should have username
    let is_username_present = username?true:false;

    // username should be string
    let is_username_string = is_username_present && typeof username==='string';

    // username should not have closing or opening tags
    let is_tags_present_username = is_username_string && username.includes('<') && username.includes('>');

    let conditions_satisfied = is_username_present
                            && is_username_string
                            && !is_tags_present_username ;

    if(conditions_satisfied !== true) return create_error('Invalid Request!!!',400);

    // USERNAME LENGTH VALIDATION
    if(username.length < 2) throw create_error('Length of username should not be less than 2!!!',400);
    if(username.length > 20) throw create_error('Username cannot have length greater than 20!!!',400);

    return true;
}