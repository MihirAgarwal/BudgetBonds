const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');

const {error_handler} = require('./middlewares/error_handler');
const {page_not_found} = require('./utils/page_not_found');
const router = require('./Routers/router');
const pool = require('./DB/db');

const app = express();

app.use(cors({
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}));

app.use(cookieParser());
app.use(express.json());
app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});  

const bcrypt = require('bcrypt');
app.get('/',async (req,res)=>{
    let pwd_Array = ['sp12334444', 'hussain22923', 'kevalrocks000', 'password', 'messigoat10', 'manchesterisblue', 'iamthegoat', 'idratherma', 'cantkeepmy', 'ishaandil'];
    for (let i = 0 ; i<pwd_Array.length ; i+=1)
    {
        let salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS))
        pwd_Array[i] = bcrypt.hashSync(pwd_Array[i],salt);
    }
    res.json({"message":pwd_Array});
})

app.use('/api', router );
app.use( '*' , page_not_found);
app.use(error_handler);



const server = http.createServer(app);

const startServer = async ()=>{    
    try {
        
        if(process.env.NODE_ENV==='DEVELOPMENT')
        {
            console.log("DEV ENV");
            const [rows,fields] = await pool.query('SELECT "DEV DATABASE CONNECTED!!!"');
            console.log(rows[0]["DEV DATABASE CONNECTED!!!"]);
        }
        else
        {
            console.log("TEST ENV");
            const [rows,fields] = await pool.query('SELECT "TEST DATABASE CONNECTED!!!"');
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
