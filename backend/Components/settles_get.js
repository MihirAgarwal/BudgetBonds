const { create_error } = require('../utils/create_error');
const pool = require('../DB/db');

//      https://localhost:2600/api/groups/:group_id/settles

module.exports.settles_get = async (req,res,next) => {

    try 
    {    
        req.body['group_id'] = req.params.group_id;
        const request_body = req.body;
        const is_valid_request = validate_request(request_body);
        if(is_valid_request instanceof Error) throw is_valid_request ;

        const { group_id , username , username_2 , page_no } = req.body ;

        let rows,cols;
        if(page_no === -1)
        {
            [rows,cols] = await get_aggregated_settles( group_id , username );
        }
        else
        {
            [rows,cols] = await get_settles_of_two( group_id , username , username_2 , page_no );
        }

        res.json({"message":"SETTLES GET"});
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
    const [rows,cols] = await pool.execute(`CALL get_aggregated_group_settles(?,?)`, [ group_id , username ] );
    console.log(rows);
    const processed_data = get_processed_data(rows);
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

    console.log(data);
    return data ;
}


async function get_settles_of_two( group_id , username , username2 , page_no )
{
    return ;
}