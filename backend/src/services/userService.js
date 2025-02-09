import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "../repositories/userRepository.js";
import validationError from "../utils/errors/validationError.js";
import { createJWT } from "../utils/common/authUtils.js";


export const signUpService = async (data) => {
    try {
        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
            throw new validationError(
                { error: { email: "A user with this email already exists" } },
                "A user with this email already exists"
            );
        }

        const newUser = await createUser(data);
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const signInService = async (data) => {
    try {
        const user = await getUserByEmail(data.email);
        if (!user) {
            throw new validationError(
                { error: { email: "User not found" } },
                "User not found"
            );
        }

        const isPasswordValid = bcrypt.compareSync(data.password, user.password);
        if (!isPasswordValid) {
            throw new validationError(
                { error: { password: "Incorrect password" } },
                "Incorrect password"
            );
        }

        const token = createJWT({ id: user._id, email: user.email })
       

        return token;
    } catch (error) {
        console.error("Sign-in Error:", error);
        throw error;
    }
};
