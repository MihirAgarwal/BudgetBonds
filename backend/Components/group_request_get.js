const { create_error } = require('../utils/create_error');
const pool = require('../DB/db');

//      https://localhost:2600/api/group_request

module.exports.group_request_get = async (req,res,next)=>{

    const {username} = req.body;

    const [rows,cols] = await pool.execute(`CALL get_group_requests(?)`,[username]);
    console.log(rows[0]);

    res.json({"group_requests":rows[0]});
}