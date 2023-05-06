const pool = require('../DB/db');
const bcrypt = require('bcrypt');
const { create_error } = require('../utils/create_error');

module.exports.user_credentials_get = async (req,res,next)=>{

    try {
        
        // URL PARAMETERS VALIDATION
        console.log(req.query);
        let {email,confirmationCode} = req.query;
        console.log(email , confirmationCode);

        let [rows,cols] = await pool.execute('SELECT * FROM unauthentic_users WHERE email = ?',[email]);
        console.log(rows);
        if(rows.length === 0) throw create_error('Invalid Request!!!',400);
        
        let true_confirmation_code = rows[0]['confirmation_code'];
        let signup_time = rows[0]['signup_time'];
        
        let is_confirmationCode_right = bcrypt.compareSync(confirmationCode,true_confirmation_code);
        if(!is_confirmationCode_right) throw create_error('Invalid request!!!',400);
        
        [rows,cols] = await pool.execute('SELECT timestampdiff(SECOND,?,now()) as time_difference;',[signup_time]);
        let time_difference_seconds = rows[0]['time_difference'];
        console.log(time_difference_seconds);
        if(time_difference_seconds > 300) throw create_error('Time Expired , Please Signup Again !!!',401);

        // REDIRECT TO USER_CREDENTIALS FRONTEND PAGE with the email 
        res.json({"message":"DONE!!"});
    
    } catch (error) {
        next(error);
    }

}
