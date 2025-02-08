export const internalErrorResponse = (error) => {
    return {
        success: false,
        err: error.message,
        data: {},
        message: 'Internal Server Error'
    };
};

export const customErrorResponse = (error) => {
    if (!error.explanation && !error.message) {
        return internalErrorResponse(error);
    }

    if (!error.message && !error.explanation)
        return {
            success: false,
            err: error.explanation,
            data: {},
            message: error.message
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
