module.exports.page_not_found = (req,res,next)=>{
    try {
        let err = new Error('Page Not Found!!!');
        err.status = 404;
        throw err;
    } catch (error) {
        next(error);   
    }
}