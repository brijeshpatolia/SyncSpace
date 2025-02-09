import { StatusCodes } from "http-status-codes";
import { customErrorResponse } from "../utils/common/responseObjects.js";

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: error.errors.map(err => err.message).join(", "), // ✅ Return all errors
                statusCode: StatusCodes.BAD_REQUEST,
                type: "Validation Error"
            }));
        }
    };
};
