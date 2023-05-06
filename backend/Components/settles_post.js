const {create_error} = require('../utils/create_error');
const pool = require('../DB/db');

//      http://localhost:2600/api/groups/:group_id/settles

module.exports.settles_post = async (req,res,next)=>{

    
    res.json({"message":"SETTLES POST"});

}