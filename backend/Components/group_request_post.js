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
		console.log(rows);
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
			await insert_to_settle(username,group_id);
			//let result = await pool.execute(`CALL groupRequestAccepted(?,?)`,[username,group_id]);
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


async function insert_to_settle(username,group_id)
{
	let [rows,cols] = await pool.execute(`SELECT username FROM group_members WHERE group_id=? AND is_in_group=1`,[group_id]);
	console.log(rows);
	await pool.execute(`DELETE FROM group_requests WHERE username=? AND group_id=?`,[username,group_id]);
	await pool.execute(`INSERT INTO group_members (group_id,username,is_in_group) VALUES (?,?,1)`,[group_id,username]);

	let query = `INSERT INTO to_settle ( group_id , user1 , user2 ) VALUES `;
	let parameter_array = []
	for(let i = 0 ; i < rows.length ; i += 1)
	{
		query = query + `(?,?,?)`;
		parameter_array.push(group_id);
		parameter_array.push(username);
		parameter_array.push(rows[i]["username"]);

		if(i!=rows.length-1) query = query + ` , `;
	}
	console.log(query);
	console.log(parameter_array);

	await pool.execute( query , parameter_array );
}