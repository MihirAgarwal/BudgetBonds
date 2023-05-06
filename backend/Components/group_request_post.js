const {create_error} = require('../utils/create_error');
const pool = require('../DB/db');

//  https://localhost:2600/api/group_request

module.exports.group_request_post = async (req,res,next)=>{
 
    // Get the group ID
	// CHECK if Group Exists
	// If Group Exists then check if it is deleted
	// If request accepted then add the user to group_members
	// If request not accepted then set is_responded to true

    try
	{
		let request_body = req.body;
		let is_valid_request = validate_request(request_body);
		if(is_valid_request instanceof Error) throw is_valid_request;

		const {username,group_id,is_accepted} = request_body;
        //console.log(request_body);

		// CHECKING IF REQUEST EXISTS
		let [rows,cols] = await pool.execute(`SELECT COUNT(*) AS count FROM group_requests WHERE group_id=? AND username = ?`,[group_id,username]);
		//console.log(rows);
        if(rows[0]['count']<1) throw create_error('No such Request Exists!!!',401);

		// CHECKING IF GROUP EXISTS
		[rows,cols] = await pool.execute(`SELECT * FROM group_details WHERE group_id=?`,[group_id]);
        //console.log(rows)
		if(rows.length<1) throw create_error('No such Group Exists!!!',401);

		// CHECK IF GROUP IS NOT DELETED
		//console.log(rows[0]["is_deleted"]);
        if(rows[0]["is_deleted"]===1) throw create_error('The group is Deleted!!!',401);

		if(is_accepted===true)
		{
            // CHECK IF ACCEPTED IS TRUE
			let result = await pool.execute(`CALL groupRequestAccepted(?,?)`,[username,group_id]);
		}
		else
		{   
            // IF ACCEPTED IS FALSE
			let result = await pool.execute(`UPDATE group_requests SET is_responded=? WHERE group_id=? AND username=?`,[true,group_id,username]);
		}

		res.json({"message":"Operation Completed Successfully!!!"});
	}
	catch(error)
	{
		next(error);
	}

}


function validate_request(request_body)
{
    return;
}