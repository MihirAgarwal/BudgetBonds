module.exports.error_handler = (err,req,res,next)=>
{
    err.message = err.message || "Internal Server Error" ;
    err.status = err.status || 500 ;

    if(err.message==="Timeout") 
    {
        err.status=200;
    }
    console.log(err);
    res.status(err.status).json({"message":err.message , "status":err.status});
}
