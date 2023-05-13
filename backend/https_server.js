const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const DB_pool = require('./DB/db');
const {error_handler} = require('./middlewares/error_handler');
const {page_not_found} = require('./utils/page_not_found');
const unauthenticated_routes = require('./Routers/router');
const router = require('./Routers/router');

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//app.use('/api', router );
app.use( '*' , page_not_found);
app.use(error_handler);


const startServer = async ()=>{    
    try {
        
        if(process.env.NODE_ENV==='DEVELOPMENT')
        {
            console.log("DEV ENV");
            const [rows,fields] = await DB_pool.query('SELECT "DATABASE CONNECTED!!!"');
            console.log(rows[0]["DATABASE CONNECTED!!!"]);
        
            const port = process.env.PORT || 2800 ;

            // const https_server = https.createServer({
            //     key: fs.readFileSync('./certificate/key.pem'),
            //     cert: fs.readFileSync('./certificate/certificate.pem') 
            // },app);

            const http_server = http.createServer(app);
            //https_server.listen(4444);

            app.listen(port,()=>{  
                console.log(`HTTP server is listening on port ${port}`);
            });
        }
        else
        {
            console.log("TEST ENV");
            const [rows,fields] = await DB_pool.query('SELECT "DATABASE CONNECTED!!!"');
            console.log(rows[0]["DATABASE CONNECTED!!!"]);
            const port = process.env.PORT || 2800 ;
            
            app.listen(port,()=>{  
                console.log(`TEST server is listening on port ${port}`);
            });
        }
        
    } catch (error) {
        console.log(error);
    }
    
}
startServer();

module.exports = app;
