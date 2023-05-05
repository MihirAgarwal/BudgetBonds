const pool = require('../DB/db');
const {create_error} = require('../utils/create_error');

//      https://localhost:2600/api/groups/:group_id/members

module.exports.group_members_get = async (req,res)=>{

    console.log("GROUP ID: ",req.params.group_id);
    req.body["group_id"] = req.params.group_id;

    const request_body = req.body;
    //console.log(request_body);
    let is_valid_request = validate_request(request_body);
    if(is_valid_request instanceof Error) throw is_valid_request;

    const {username,group_id} = req.body;

    // get group members data
    const [rows,cols] = await pool.execute(`SELECT username , is_in_group , spent , paid FROM group_members WHERE group_id=?`,[group_id]);
    console.log(rows);

    res.json({"group_members":rows});
}


function validate_request(request_body)
{
    return;
}