import { StatusCodes } from "http-status-codes";
import { signUpService, signInService } from "../services/userService.js";
import { customErrorResponse,  successResponse } from "../utils/common/responseObjects.js";

export const signUp = async (req, res) => {
    try {
        const user = await signUpService(req.body);
        return res.status(StatusCodes.CREATED).json(successResponse(user, "User created successfully"));
    } catch (error) {
        console.log('User Controller Error:', error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(customErrorResponse(error));
    }
};

export const signIn = async (req, res) => {
    try {
        const token = await signInService(req.body);
        return res.status(StatusCodes.OK).json(successResponse({ token }, "User signed in successfully"));
    } catch (error) {
        console.log('User Controller Error:', error);
        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(customErrorResponse(error));
    }
};

