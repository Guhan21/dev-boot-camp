const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;

    // Log the err for dev
    console.log(err.stack.red);

    // Mongoose ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found with the id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Duplicate field
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;