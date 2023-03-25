require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();


const unauthenticated_routes = require('./Routers/unauthenticated_routes');
const DB_pool = require('./DB/db');
const {error_handler} = require('./Error Handler/error_handler');
const {page_not_found} = require('./utils/page_not_found');

app.use(cors());
app.use(express.json());


app.use('/api', unauthenticated_routes );
app.use( '*' , page_not_found);
app.use(error_handler);

const startServer = async ()=>{    
    try {
        
        const [rows,fields] = await DB_pool.query('SELECT "DATABASE CONNECTED!!!"');
        console.log(rows[0]["DATABASE CONNECTED!!!"]);
    
        const port = process.env.PORT || 2700 ;
        app.listen(port,()=>{
            console.log(`Server is listening on port ${port}`);
        });
        
    } catch (error) {
        console.log(error);
    }

}
startServer();


module.exports = app;