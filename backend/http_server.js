const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');

const DB_pool = require('./DB/db');
const {error_handler} = require('./middlewares/error_handler');
const {page_not_found} = require('./utils/page_not_found');
const router = require('./Routers/router');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api', router );
app.use( '*' , page_not_found);
app.use(error_handler);

const server = http.createServer(app);

const startServer = async ()=>{    
    try {
        
        if(process.env.NODE_ENV==='DEVELOPMENT')
        {
            console.log("DEV ENV");
            const [rows,fields] = await DB_pool.query('SELECT "DEV DATABASE CONNECTED!!!"');
            console.log(rows[0]["DEV DATABASE CONNECTED!!!"]);
        }
        else
        {
            console.log("TEST ENV");
            const [rows,fields] = await DB_pool.query('SELECT "TEST DATABASE CONNECTED!!!"');
            console.log(rows[0]["TEST DATABASE CONNECTED!!!"]);
        }

        const port = process.env.PORT || 2800 ;
        server.listen(port,()=>{  
            console.log(`HTTP server is listening on port ${port}`);
        });
        
    } catch (error) {
        console.log(error);
    }
    
}
startServer();

module.exports = server;
