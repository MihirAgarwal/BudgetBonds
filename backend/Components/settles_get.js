require('dotenv').config();
const { create_error } = require('../utils/create_error');
const pool = require('../DB/db');

//      https://localhost:2600/api/groups/:group_id/settles

module.exports.settles_get = async (req,res,next) => {

    try 
    {   
        req.body['page_no'] = req.query.page_no; 
        req.body['username_2'] = req.query.username_2; 
        req.body['group_id'] = req.params.group_id;
    
        const request_body = req.body;
        const is_valid_request = validate_request(request_body);
        if(is_valid_request instanceof Error) throw is_valid_request ;

        console.log(request_body);
        const { group_id , username , username_2 , page_no } = request_body ;

        let result;
        if(parseInt(page_no) === -1)
        {
            result = await get_aggregated_settles( group_id , username );
        }
        else
        {
            result = await get_settles_of_two( group_id , username , username_2 , page_no );
            console.log("RESULT ==> ",result);
        }

        res.json({"message":result});
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


async function get_aggregated_settles( group_id , username )
{
    const query = `SELECT group_id,SUM(pay_amount) as give_amount,pay_to,pay_by FROM settles WHERE group_id=? AND is_settled=0 GROUP BY group_id,pay_to,pay_by HAVING pay_to=? OR pay_by=?`
    const [rows,cols] = await pool.execute( query, [ group_id , username , username ] );
    console.log("ROWS: ",rows);
    console.log("\n\n\n");
    
    const processed_data = get_processed_data(rows);
    console.log("Processed Data: ",processed_data)
    return processed_data;
}

function get_processed_data(data)
{
    for(let i = 0 ; i<data.length ; i+=1)
    {
        for (let j=i+1 ; j<data.length ; j+=1)
        {
            if( data[i]['pay_to'] === data[j]['pay_by'] && data[i]['pay_by'] === data[i]['pay_to'] )
            {
                if(data[i]['give_amount'] > data[j]['give_amount'])
                {
                    data[i]['give_amount'] = data[i]['give_amount'] - data[j]['give_amount'];
                }

                else if(data[i]['give_amount'] < data[j]['give_amount'])
                {
                    data[i]['give_amount'] = data[j]['give_amount'] - data[i]['give_amount'];
                    data[i]['pay_to'] = data[j]['pay_to'];
                    data[i]['pay_by'] = data[j]['pay_by'];
                }

                else
                {
                    data.splice(i,1);
                    i=i-1;
                }

                data.splice(j, 1);
                j=j-1;
            }

            else if(data[i]['pay_by'] === data[j]['pay_to'] && data[i]['pay_to']===data[i]['pay_by'])
            {
                if(data[i]['give_amount'] > data[j]['give_amount'])
                {
                    data[i]['give_amount'] = data[i]['give_amount'] - data[j]['give_amount'];
                }

                else if(data[i]['give_amount'] < data[j]['give_amount'])
                {
                    data[i]['give_amount'] = data[j]['give_amount'] - data[i]['give_amount'];
                    data[i]['pay_to'] = data[j]['pay_to'];
                    data[i]['pay_by'] = data[j]['pay_by'];
                }

                else
                {
                    data.splice(i,1);
                    i=i-1;
                }

                data.splice(j, 1);
                j=j-1;
            }
        }
    }

    return data ;
}


async function get_settles_of_two( group_id , username , username2 , page_no )
{
    const query = `CALL get_group_settles_of_two_members(?,?,?,?,?)`;
    const start_row = page_no*process.env.PAGE_SIZE;
    const end_row = (page_no+1)*process.env.PAGE_SIZE;
    const [rows,cols] = await pool.execute( query, [ group_id , username , username2 , start_row , end_row ] );
    return rows[0];
}