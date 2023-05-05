const {create_error} = require('../utils/create_error');
const pool = require('../DB/db');


// https://localhost:2600/api/groups
module.exports.groups_post = async (req,res,next)=>{

	try
	{
		const request_body = req.body;
		let is_valid_request = validate_request(request_body);
		if(is_valid_request instanceof Error) throw is_valid_request;

        console.log(request_body);
		const {group_name,username,icon,members} = request_body;
		

		// Create the Group
		let result = await pool.execute(`INSERT INTO group_details (group_name,made_by,icon) VALUES (?,?,?)` , [group_name,username,icon] );
        //console.log(result);
        let inserted_grp_ID = result[0]["insertId"];
        console.log(inserted_grp_ID);

		// Enteries in Group Requests Table
		let parameters_to_insert = [];
		let query = `INSERT INTO group_requests (group_id,username) VALUES `;
		for(let i=0; i<members.length ; i++)
		{
			if(members[i]!=username)
			{
				query = query + `(?,?) `;
			
				parameters_to_insert.push(inserted_grp_ID);
				parameters_to_insert.push(members[i]);
				if(i!=members.length-1) query = query + `,`;
			}
		}
        console.log(query);
		result = await pool.execute( query , parameters_to_insert );
        console.log(result);

        // Insert the group creater in the group
        result = await pool.execute(`INSERT INTO group_members (group_id,username) VALUES (?,?)`,[inserted_grp_ID,username]);
        console.log(result);
        
		res.json({"message":"Group Created Successfully"});
	}
	catch(error)
	{
		next(error);
	}
}


const validate_request = (request_body)=>{
    // if username in members array send bad request
	return;
}