const { create_error } = require('../utils/create_error');
const pool = require('../DB/db');

//      https://localhost:2600/api/groups/:group_id/logs

module.exports.logs_get = async (req,res,next)=>{

    try 
    {
        req.body["group_id"] = req.params.group_id;
        const request_body = req.body;
        const is_valid_request = validate_request(request_body); 
        if(is_valid_request instanceof Error) throw is_valid_request;
        
        const {username,group_id} = request_body;

        // fetching logs
        const [rows,cols] = await pool.execute(`CALL get_group_logs(?,?)`,[group_id,username]);
        console.log(rows[0]);
        
        res.json( { "logs" : rows[0] } );
    } 
    catch (error) 
    {
        next(error);
    }    
}


function validate_request(request_body)
{
    return ;
}