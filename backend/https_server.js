const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');

const DB_pool = require('./DB/db');
const {error_handler} = require('./middlewares/error_handler');
const {page_not_found} = require('./utils/page_not_found');
const unauthenticated_routes = require('./Routers/router');
const router = require('./Routers/router')

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());


app.use('/api', router );
app.use( '*' , page_not_found);
app.use(error_handler);

const startServer = async ()=>{    
    try {
        
        const [rows,fields] = await DB_pool.query('SELECT "DATABASE CONNECTED!!!"');
        console.log(rows[0]["DATABASE CONNECTED!!!"]);
    
        const port = process.env.PORT || 2800 ;

        const https_server = https.createServer({
            key: fs.readFileSync('./certificate/key.pem'),
            cert: fs.readFileSync('./certificate/certificate.pem') 
        },app);

        https_server.listen(port,()=>{  
            console.log(`HTTPS server is listening on port ${port}`);
        });
        
    } catch (error) {
        console.log(error);
    }

}
startServer();