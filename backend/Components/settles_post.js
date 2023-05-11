const {create_error} = require('../utils/create_error');
const pool = require('../DB/db');
const { request } = require('chai');

//      http://localhost:2600/api/groups/:group_id/settles

module.exports.settles_post = async (req,res,next)=>{

    try 
    {
        req.body["group_id"] = req.params.group_id;
        const request_body = req.body;
        
        let is_valid_request = validate_request(request_body);
        if(is_valid_request instanceof Error) throw is_valid_request;
    
        const {group_id , username , amount , pay_to , action} = request_body;
        const pay_by = username;
        console.log(request_body);

        // Check if the pay_by is eligibe to give that much amount 
        // pay_by has to give more or equal money than amount to pay_to to settle
        
        let is_amount_eligibe = await check_amount_eligiblity(pay_by,pay_to,amount,group_id,action);
        if(is_amount_eligibe instanceof Error) throw is_amount_eligibe;
        
        // For Settle
        if(action==="Settle")
        {
            //Inserting entry into settle
            await settle_amount(group_id,amount,pay_by,pay_to);

            // Inserting logs
            await settle_log(group_id , pay_by , pay_to , amount);

            // Updating group_members table
            await update_group_members(group_id,pay_by,pay_to,amount);
        }


        // For Unsettle
        if(action==="Unsettle")
        {
            // Inserting into settle with negative amount
            await unsettle_amount(group_id , amount , pay_by , pay_to);

            // Inserting log
            await unsettle_log(group_id , pay_by , pay_to , amount);

            // Updating group_members_table
            await update_group_table()
        }

        res.json({"message":"SETTLES POST"});
        
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


async function check_amount_eligiblity(pay_by,pay_to,amount,group_id,action)
{
    const query = `SELECT SUM(pay_amount) as actual_amount FROM settles WHERE group_id=? GROUP BY group_id,pay_by,pay_to HAVING pay_by=? AND pay_to=?`;
    const query_array = [group_id,pay_by,pay_to];

    const [rows,cols] = await pool.execute(query,query_array);
    console.log(rows[0]["actual_amount"]);
    const actual_amount = rows[0]["actual_amount"];

    if(action==="Settle" && actual_amount < amount) return create_error('Settling More amount then spent!!!',400)
    return true;
}


async function settle_amount(group_id,amount,pay_by,pay_to)
{
    const settle_query = `INSERT INTO settles (group_id , pay_amount , pay_to , pay_by) VALUES (?,?,?,?)`;
    const settle_array = [group_id,amount,pay_by,pay_to];
    await pool.execute(settle_query,settle_array);
}

async function settle_log(group_id , pay_by , pay_to , amount )
{
    const log = `${pay_by} paid ${amount} to ${pay_to}`;
    const log_query = `INSERT INTO user_logs (group_id,log_by,log_for,user_log) VALUES (?,?,?,?)`;
    const log_array = [group_id,pay_by,pay_to,log];

    await pool.execute(log_query,log_array);
}

async function update_group_members(group_id,pay_by,pay_to,amount)
{
    const update_query_pay_by = `UPDATE group_members SET paid=paid+? WHERE group_id=? AND username=?`;
    const update_query_pay_by_array = [amount,group_id,pay_by];
    
    const update_query_pay_to = `UPDATE group_members SET paid=paid-? WHERE group_id=? AND username=?`;
    const update_query_pay_to_array = [amount,group_id,pay_to];

    await pool.execute(update_query_pay_by,update_query_pay_by_array);
    await pool.execute(update_query_pay_to,update_query_pay_to_array);
}


// 5000 spent and 2000 pay ==> has to give 3000 , pay+3000
// 5000 pay and 2000 spent ==> has to take 3000 , pay-3000 