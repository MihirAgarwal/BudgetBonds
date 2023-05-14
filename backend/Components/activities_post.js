const { create_error } = require('../utils/create_error');
const pool = require('../DB/db');

//      http://localhost:2600/api/groups/:group_id/activities


module.exports.activities_post = async (req,res,next)=>{
    
    // ADD ACTIVITY
    // 1.) Validate Request (Done --)
    // 2.) Add activity to the activity table and get the new activity ID (Done)
    // 3.) Add activity expenses to the activity expenses table (Done)
    // 4.) Update the Spent paid of members table (Done)
    // 5.) Add to the logs (Done)
    // 6.) Determine who will pay whom how much And add it to the settles table (Done)
    
    
    try 
    {
        req.body["group_id"] = req.params.group_id;
        const request_body = req.body;
        const is_valid_request = validate_request(request_body);
        if (is_valid_request instanceof Error) throw is_valid_request;
        //console.log(request_body);
        const {group_id,username,activity_name,activity_type,expenses} = request_body ;
        
        // Add activity to the activity table and get activity ID
        const inserted_activity_id = await add_activity_to_activities_table(group_id , activity_name , activity_type , username);
        
        // Add to activity_expenses and update spent and paid
        await add_to_activity_expenses_table(group_id , inserted_activity_id , expenses);

        // Add to logs
        await add_to_logs(group_id,activity_name,username);

        // Compute spent paid and add to settles table
        await add_payments_to_settle_table(group_id,inserted_activity_id,expenses);

        res.json({"message":"ACTIVITIES POST"})
    } 
    catch (error) 
    {
        next(error);
    }
}


function validate_request(request_body)
{
    // check the if user is present in group
    // check if all the usernames belong to the group
    return ;
}


async function add_activity_to_activities_table(group_id,activity_name,activity_type,username)
{
    const result = await pool.execute(`INSERT INTO activities (group_id,activity_name,activity_type,inserted_by,is_personal) VALUES (?,?,?,?,?)`,[group_id,activity_name,activity_type,username,false]); 
    const inserted_id = result[0]["insertId"];
    console.log(inserted_id);
    return inserted_id;
}


async function add_to_activity_expenses_table( group_id , activity_id , expenses )
{
    let expenses_query_array = [];
    let expenses_query = `INSERT INTO activity_expenses (activity_id,username,paid,spent,income) VALUES `;
    
    const update_query = `UPDATE group_members SET spent = spent + ? , paid = paid + ? WHERE group_id = ? AND  username = ?`
    for( let i=0 ; i<expenses.length ; i++)
    {
        let {username,paid,spent} = expenses[i];
        // console.log( username , paid , spent );
        
        expenses_query_array.push(activity_id); 
        expenses_query_array.push(username);
        expenses_query_array.push(paid);
        expenses_query_array.push(spent);
        expenses_query_array.push(0);

        expenses_query = expenses_query + `(?,?,?,?,?)`;

        if(i!=expenses.length-1) expenses_query+=` , `;

        await pool.execute(update_query,[spent,paid,group_id,username]);
    }
    //console.log("EXPENSE ARRAY",expenses_query_array);
    //console.log("EXPENSE QUERY",expenses_query);
    await pool.execute(expenses_query,expenses_query_array);

}


async function add_to_logs(group_id,activity_name,username)
{
    const query = `INSERT INTO user_logs (group_id,log_by,user_log) VALUES (?,?,?)`;
    let user_log = `Activity ${activity_name} was added by ${username}`;
    console.log("LOGS QUERY  ",query );
    console.log("QUERY ARRAY  ",[group_id,username,user_log]);
    await pool.execute(query,[group_id,username,user_log]);
}


async function add_payments_to_settle_table(group_id,activity_id,expenses)
{
    const data_array_objects = calculate_payments_to_be_settled(expenses);
    console.log(data_array_objects);
    if(data_array_objects.length > 0)
    {
        for(let i=0 ; i<data_array_objects.length ; i+=1)
        {
            let {pay_to , pay_by , pay_amount} = data_array_objects[i];

            await pool.execute(`UPDATE to_settle SET pay_amount = pay_amount + ? WHERE group_id = ? AND user1 = ? AND user2 = ?`,[pay_amount , group_id , pay_to , pay_by]);
            await pool.execute(`UPDATE to_settle SET pay_amount = pay_amount - ? WHERE group_id = ? AND user1 = ? AND user2 = ?`,[pay_amount , group_id , pay_by , pay_to]);
        }
    }
}

function calculate_payments_to_be_settled(expenses)
{
    let {usernames,excessive_spent} = format_data(expenses);
    // console.log(usernames,excessive_spent);
    let data_array_objects = [];
    let left_pointer = 0;
    let right_pointer = expenses.length-1;

    while( left_pointer < right_pointer )
    {
        if( -1*excessive_spent[left_pointer] == excessive_spent[right_pointer])
        {
            let obj = {
                "pay_to" : usernames[left_pointer],
                "pay_by" : usernames[right_pointer],
                "pay_amount" : excessive_spent[right_pointer]
            };
            console.log("OBJ=>",obj);
            if(obj['pay_amount']!==0)   data_array_objects.push(obj);
            right_pointer = right_pointer - 1;
            left_pointer = left_pointer + 1;
        }

        else if( -1*excessive_spent[left_pointer] > excessive_spent[right_pointer])
        {
            let obj = {
                "pay_to" : usernames[left_pointer],
                "pay_by" : usernames[right_pointer],
                "pay_amount" : excessive_spent[right_pointer]
            };
            if(obj['pay_amount']!==0)   data_array_objects.push(obj);
            excessive_spent[left_pointer] = excessive_spent[left_pointer] + excessive_spent[right_pointer];
            right_pointer = right_pointer - 1;
        }

        else if( -1*excessive_spent[left_pointer] < excessive_spent[right_pointer] )
        {
            let obj = {
                "pay_to" : usernames[left_pointer],
                "pay_by" : usernames[right_pointer],
                "pay_amount" : -1*excessive_spent[left_pointer]
            };
            if(obj['pay_amount']!==0)   data_array_objects.push(obj);
            excessive_spent[right_pointer] = excessive_spent[left_pointer] + excessive_spent[right_pointer];
            left_pointer = left_pointer + 1;
        }
    }
    console.log("DATA ======> ",data_array_objects)
    return data_array_objects;
}

function format_data(expenses)
{
    let usernames = [];
    let excessive_spent = [];

    //console.log("EXPENSES: ",expenses);
    for( let i = 0 ; i < expenses.length ; i++ )
    {
        excessive_spent.push( { "index" : i , "value" : expenses[i]["spent"] - expenses[i]["paid"] } ) ;
    }
    //console.log("EXCESSIVE SPENT: ",excessive_spent);
    
    excessive_spent.sort((a, b) => {
        return a.value - b.value;
    });
    //console.log("EXCESSIVE SPENT: ",excessive_spent);

    for( let i = 0 ; i < expenses.length ; i++ )
    {
        let username = expenses[ excessive_spent[i]["index"] ]["username"] ;
        usernames.push( username );
        excessive_spent[i] = excessive_spent[i]["value"] ;
    }

    console.log("FROM FORMAT DATA: ",usernames,excessive_spent);
    return {"usernames":usernames,"excessive_spent":excessive_spent};
}

// spent - paid
// right pointer gives money
// left pointer takes money