const {create_error} = require('../utils/create_error');
const pool = require('../DB/db'); 

module.exports.activities_get = (req,res)=>{

    req.body["group_id"] = req.params.group_id;
    const request_body = req.body;
    let is_valid_request = validate_request(request_body);
    if(is_valid_request instanceof Error) throw is_valid_request;

    const {username,group_id} = request_body;

    // get activities 
    const [rows,cols] = (`CALL get_activities(?,?)`,[group_id,username]);
    console.log(rows);

    res.json({"activities":rows});
}


function validate_request(request_body)
{
    return;
}