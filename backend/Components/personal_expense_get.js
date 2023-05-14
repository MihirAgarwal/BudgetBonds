require('dotenv').config();
const pool = require('../DB/db');
const { create_error } = require('../utils/create_error');

//  LINK => https://localhost:2600/api/personal_expense/?pageNo={}&date={}&Name={}

module.exports.personal_expense_get = async (req,res,next)=>{

    try 
    {
        console.log(req.query);
        let {pageNo,date,Name} = req.query;
        let {username} = req.body;
        //console.log(pageNo , Date , Name , username);
    
        let is_valid_request = validate_request(req.query);
        if(is_valid_request instanceof Error) throw is_valid_request;
    
        // Creating the query
        let start_row_number = pageNo * parseInt(process.env.PAGE_SIZE); 
        let parameter_list = [username];
        let query = `SELECT activities.activity_id , activities.group_id , activity_expenses.spent , activity_expenses.income , activities.activity_name , activities.activity_type , activities.inserted_by , DATE(activities.date_time) as date , activities.is_personal  FROM activity_expenses INNER JOIN activities ON activity_expenses.activity_id = activities.activity_id WHERE activity_expenses.username = ? `;
        
        if(date)
        {
            parameter_list.push(date);
            query = query+`AND DATE(activities.date_time)=? `
        }
        if(Name)
        {
            parameter_list.push(Name);
            query = query+`AND activities.activity_name=? `
        }
        parameter_list.push(String(start_row_number));
        parameter_list.push(String(start_row_number+30));
        query = query + `ORDER BY DATE(activity.date_time) LIMIT ?,?`
    
        console.log(query);
        console.log(parameter_list);
    
        // Executing the query 
        let [rows,cols] = await pool.execute( query , parameter_list );
        console.log(rows)
    

        res.json({"message":"GET"});
        
    } 
    catch (error) 
    {
        next(error);
    }
}


const validate_request = (request_body)=>{

    return;
}