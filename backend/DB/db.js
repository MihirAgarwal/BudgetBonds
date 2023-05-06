require('dotenv').config();
const mysql = require('mysql2');

let pool;
if(process.env.NODE_ENV === 'DEVELOPMENT')
{
    pool = mysql.createPool({

        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DEV_DATABASE
    }).promise()
}

else if(process.env.NODE_ENV === 'TEST')
{
    pool = mysql.createPool({

        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_TEST_DATABASE
    }).promise()
}

module.exports = pool;