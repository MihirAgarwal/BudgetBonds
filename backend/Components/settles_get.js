require('dotenv').config();
const { create_error } = require('../utils/create_error');
const pool = require('../DB/db');

//      http://localhost:2600/api/groups/:group_id/settles

module.exports.settles_get = async (req,res,next) => {

    try 
    {   
        req.body['page_no'] = req.query.page_no;  
        req.body['group_id'] = req.params.group_id;
    
        const request_body = req.body;
        const is_valid_request = validate_request(request_body);
        if(is_valid_request instanceof Error) throw is_valid_request ;

        console.log(request_body);
        const { group_id , username , page_no } = request_body ;

        let result = await get_settles(username,group_id,page_no);

        res.json({"message":result});
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


async function get_settles(username,group_id,page_no)
{
    let start_row = page_no*parseInt(process.env.PAGE_SIZE);
    let end_row = page_no*parseInt(process.env.PAGE_SIZE) + parseInt(process.env.PAGE_SIZE);
    group_id = parseInt(group_id);

    const query1 = `SELECT pay_amount as amount , user1 as pay_to , user2 as pay_by FROM to_settle WHERE (pay_amount>0 AND (user1=? OR user2=?) AND group_id=?) limit ? , ?`;
    const parameter_array = [username,username,group_id,start_row,end_row];
    console.log(parameter_array);
    let [row,cols] = await pool.query(query1,parameter_array);
    
    end_row = end_row-row.length;
    const query2 = `SELECT -1*pay_amount as amount , user1 as pay_by , user2 as pay_to FROM to_settle WHERE (pay_amount<0 AND (user1=? OR user2=?) AND group_id=?) limit ? , ?`;
    let row2,cols2;
    
    if(end_row>0)
    [row2,cols2] = await pool.query(query2,parameter_array);

    console.log(row);
    console.log(row2);
    let result = [].concat(row);
    result = result.concat(row2);

    console.log("RESULT: ",result);
    return result;
}