import { createUser, getUserByEmail } from "../repositories/userRepository.js";
import validationError from "../utils/errors/validationError.js";

export const signUpService = async (data) => {
    try {
        // Check if the user already exists by email
        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
            throw new validationError(
                { error: { email: "A user with this email already exists" } }, // Ensure error object is structured correctly
                "A user with this email already exists"
            );
        }

        // Create a new user
        const newUser = await createUser(data);

        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);

        if (error.name === "ValidationError") {
            throw new validationError(
                { error: error.errors || {} }, // Ensure valid error object
                error.message
            );
        }

        if (error.name === "MongoServerError" && error.code === 11000) {
            throw new validationError(
                { error: { email: "A user with this email already exists" } },
                "A user with this email already exists"
            );
        }

        throw error; // Ensure unexpected errors are properly handled
    }
};