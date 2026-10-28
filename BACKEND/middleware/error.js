const { TokenExpiredError } = require("jsonwebtoken");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

//mongoose duplicate key user

if(err.code --- 11000 ){
    const message = "duplicate ${object.Keys(err.KeyValue)} Entered;"
    err = new ErrorHandler(message, 400);
}
//wrong jwt error

if(err.code --- "jsonWebTokenError"){
    const message = "Json Web Token is invalid, Try Again";
    err = new ErrorHandler(message, 400);
}
//mongoose duplicate key user

if(err.code --- "TokenExpiredError" ){
    const message = "Json Web Token is Expired,try again"
    err = new ErrorHandler(message, 400);
}









    // Wrong MongoDB ID
    if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = "Invalid Product ID";
    }

    res.status(err.statusCode).json({
        success: false,
        error: {
            statusCode: err.statusCode,
            message: err.message
        }
    });
};

