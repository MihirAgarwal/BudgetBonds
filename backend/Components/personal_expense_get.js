require('dotenv').config();
const pool = require('../DB/db');
const { create_error } = require('../utils/create_error');

//  LINK => https://localhost:2600/api/personal_expense/?pageNo={}&date={}&Name={}

module.exports.personal_expense_get = async (req,res,next)=>{

    try 
    {
        console.log(req);
        let {pageNo,date,Name} = req.query;
        let {username} = req.body;
        //console.log(pageNo , Date , Name , username);
    
        let is_valid_request = validate_request(req.query);
        if(is_valid_request instanceof Error) throw is_valid_request;
    
        // Creating the query
        let start_row_number = 30 * parseInt(process.env.PAGE_SIZE); 
        let parameter_list = [username];
        let query = `SELECT * FROM Activities INNER JOIN Activity_expenses ON Activities.ActivityID=Activity_expenses.ActivityID WHERE Activity_expenses.Username=? `;
        if(date) 
        {
            parameter_list.push(date);
            query = query+`AND DATE(Activities.DateTime)=? `
        }
        if(Name)
        {
            parameter_list.push(Name);
            query = query+`AND Activities.ActivityName=? `
        }
        parameter_list.push(start_row_number);
        parameter_list.push(start_row_number+30);
        query = query + `LIMIT ?,?`
    
        console.log(query);
    
        // Executing the query 
        //let [rows,cols] = await pool.execute( query , parameter_list );
        // console.log(rows)
    
        
        
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