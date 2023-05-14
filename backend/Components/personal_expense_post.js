const pool = require("../DB/db");
const { create_error } = require("../utils/create_error");
const { datetime_validation } = require("../utils/datetime_validation");

module.exports.personal_expense_post = async (req,res,next)=>{

    try 
    {
        let request_body = req.body;
        console.log("REQUEST BODY => ",request_body);
        
        // Checking if request is valid
        let is_valid_request = validate_request(request_body);
        if(is_valid_request instanceof Error) throw is_valid_request;
        
        let {datetime , activity_name , activity_type , username , amount} = request_body ;

        // Adding the activities
        let is_expense_inserted = await add_expense(datetime,activity_name,activity_type,is_personal,username,amount);
        if(is_expense_inserted instanceof Error) throw create_error();


        res.json({"message":"EXPENSE ADDED SUCCESSFULLY!!"});    
    } 
    catch (error) {
        next(error)
    }
}


function validate_request(request_body)
{
    // is datetime format valid
    let is_datetime_valid = datetime_validation(request_body['datetime']) ;
    
    // activity_name should be string
    let is_activity_name_valid = typeof request_body['activity_name'] === 'string' ? true : false ;
    
    // activity_type should be a string and should belong to the set only
    let is_activity_type_string = typeof request_body['activity_type']==='string' ? true : false ;
    // Enter the valid activities types
    let valid_activities = new Set([]);
    let is_activity_type_valid = is_activity_type_string && valid_activities.has(request_body['activity_type']) ; 

    // amount should be an integer and should be greater than 0
    let is_amount_valid = typeof request_body['amount'] === 'number' && request_body['amount'] > 0

    // request should only have datetime, activity_name, activity_type, is_personal, username and amount
    let are_only_required_fields_present = Object.keys(request_body).length===5 ;

    let is_conditions_satisfied = is_datetime_valid
                               && is_activity_name_valid
                               && is_activity_type_valid
                               && is_amount_valid 
                               && are_only_required_fields_present ;
                               

    if(is_conditions_satisfied) return true ;
    else return create_error('Invalid Request!!!',400);
}


async function add_expense(datetime,activity_name,activity_type,is_personal,username,amount)
{
    try {
        

        // GroupID=null , ActivityID=AutoIncrement , ActivityName=activity_name , ActivityType=activity_type , InsertedBy=username , DateTime=datetime , IsPersonal=true
        let result = await pool.execute(`INSERT INTO activities (activity_name,activity_type,inserted_by,date_time,is_personal) VALUES (?,?,?,?,?)`,
              [activity_name,activity_type,username,datetime,is_personal]);
        
        // Getting the recently inserted ID
        let insertedActivityID = result.insertId;
    
        if (activity_type === 'Income')
        {
            // ActivityID = extracted ActivityID , Username = username , Paid = 0 , Spent = 0 , Income = amount 
            await pool.execute(`INSERT INTO activity_expenses (activity_id,username,paid,spent,income) VALUES (?,?,0,0,?)`,
                  [insertedActivityID,username,amount]);
        }
        else
        {
            // ActivityID = extracted ActivityID , Username = username , Paid = 0 , Spent = amount , Income = 0
            await pool.execute(`INSERT INTO activity_expenses (activity_id,username,paid,spent,income) VALUES (?,?,0,?,0)`,
                  [insertedActivityID,username,amount]);
        }
        
        return true;

    } catch (error) {
        return error;
    }
}
