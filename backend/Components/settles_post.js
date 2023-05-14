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
    
        const {group_id , pay_by , username , amount , pay_to , action} = request_body;
        console.log(request_body);

        // Check if the pay_by is eligibe to give that much amount 
        // pay_by has to give more or equal money than amount to pay_to to settle
        
        let is_amount_eligibe = await check_amount_eligiblity(pay_by,pay_to,amount,group_id,action);
        if(is_amount_eligibe instanceof Error) throw is_amount_eligibe;
        

        //inserting to settled table
        await insert_to_unsettled(group_id,amount,pay_by,pay_to,action);

        // updating to_settle table
        await update_to_settle(group_id,amount,pay_by,pay_to,action);

        // inserting entry in user_logs table
        await inserting_log(group_id,amount,pay_by,pay_to,action,username);

        //updating group_members table
        await update_group_members(group_id,amount,pay_by,pay_to,action);

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


async function insert_to_unsettled(group_id,amount,pay_by,pay_to,action)
{
    if(action==='Settle') amount=amount;
    else amount = -1*amount;

    const query = `INSERT INTO settled (group_id,amount,pay_by,pay_to) VALUES (?,?,?,?)`;
    await pool.execute(query,[group_id,amount,pay_by,pay_to]);
}

// user1 takes amount positive
// user2 is paying => amount = amount - amt
async function update_to_settle(group_id , amount , pay_by , pay_to , action)
{
    if(action==='Settle') amount=amount;
    else amount = -1*amount;

    const query = `UPDATE to_settle SET amount = amount - ? WHERE group_id=? AND user1=? AND user2=?`;
    const parameter_array_1 = [amount,group_id,pay_to,pay_by];
    const parameter_array_2 = [-1*amount,group_id,pay_by,pay_to];

    await pool.execute(query,parameter_array_1);
    await pool.execute(query,parameter_array_2);
}

async function inserting_log(group_id,amount,pay_by,pay_to,action,username)
{
    let log = `Amount ${amount} was ${action}d by ${username}`;
    
    let log_for;
    if(pay_by===username) log_for = pay_to;
    else log_for = pay_by; 
    
    const query = `INSERT INTO user_logs (group_id,log_by,log_for,user_log) VALUES (?,?,?,?)`;
    
    await pool.execute(query,[group_id,username,log_for,log]);
}

async function update_group_members(group_id,amount,pay_by,pay_to,action)
{
    if(action==='Settle') amount=amount;
    else amount = -1*amount;

    // for one who paid settle
    const query = `UPDATE group_members SET paid=paid+? WHERE group_id=? AND username=?`;
    const parameter_array_1 = [amount,group_id,pay_by];

    // for one who recieved settle
    const parameter_array_2 = [-1*amount,group_id,pay_to];
    
    await pool.execute(query,parameter_array_1);
    await pool.execute(query,parameter_array_2);
}