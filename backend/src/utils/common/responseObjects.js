import { StatusCodes } from "http-status-codes";

export const internalErrorResponse = (error) => {
    return {
        success: false,
        err: error.message,
        data: {},
        message: 'Internal Server Error'
    };
};

export const customErrorResponse = (error) => {
    if (!error || typeof error !== "object") {
        return {
            success: false,
            err: "An unknown error occurred",
            data: {},
            message: "Internal Server Error",
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        };
    }

    return {
        success: false,
        err: error.explanation || error.message || "An error occurred",
        data: {},
        message: error.message || "Internal Server Error",
        statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
};



export const successResponse = (data, message) => {
    return { 
        success: true,
        err: {},
        data,
        message
    }

}
