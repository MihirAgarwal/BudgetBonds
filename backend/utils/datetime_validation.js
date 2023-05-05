let moment = require('moment');
const { create_error } = require('./create_error');

module.exports.datetime_validation = (datetime)=>{

    // is datetime string
    let is_datetime_string = typeof datetime === 'string' ? true : false ;
    if(!is_datetime_string) return false;

    // is datetime in correct format
    let is_datetime_in_correct_format = moment(datetime, "YYYY-MM-DD hh:mm:ss", true).isValid();
    
    if (is_datetime_in_correct_format===true) return true;
    else return false;
    
}