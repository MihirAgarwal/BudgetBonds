const {create_error} = require('../utils/create_error'); 
const pool = require('../DB/db');

module.exports.groups_get = async(req,res)=>{

    const {username} = req.body;

    console.log("USERNAME: ",username);
    const [rows,cols] = await pool.execute(`CALL get_groups(?)`,[username]);
    console.log("ROWS: ",rows[0]);

    res.json({"groups":rows[0]});
}