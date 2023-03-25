require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();


const unauthenticated_routes = require('./Routers/unauthenticated_routes');


app.use(cors());
app.use(express.json());


app.use('/api',unauthenticated_routes)


const startServer = ()=>{
    
    const port = process.env.PORT || 2700 ;
    app.listen(port,()=>{
        console.log(`Server is listening on port ${port}`);
    });

}
startServer();