const express = require('express');
const cors = require('cors');
const https = require('https');
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

const bcrypt = require('bcrypt');
app.get('/',(req,res)=>{
    const pwd_list = ['sp1233',
    'hussain22923',
    'kevalrocks000',
    'password',
    'messigoat10',
    'manchesterisblue',
    'iamthegoat',
    'idrathermarryshaun',
    'cantkeepmyhandstomyself',
    'ishaandilookgreattogether'];

    let hashed_pwd_list = []
    for(let i=0 ; i<pwd_list.length ; i+=1)
    {
        const salt = bcrypt.genSaltSync( parseInt(process.env.SALT_ROUNDS) ) ;
        let hashed_pwd = bcrypt.hashSync(pwd_list[i] , salt);
        hashed_pwd_list.push(hashed_pwd);
    }

    res.json({"hashed":hashed_pwd_list});
})

app.use('/api', router );
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

            const server = https.createServer({
                key: fs.readFileSync('./certificate/key.pem'),
                cert: fs.readFileSync('./certificate/certificate.pem') 
            },app);

            server.listen(port,()=>{  
                console.log(`HTTPS server is listening on port ${port}`);
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
