/* eslint-disable no-useless-escape */
import mongoose from 'mongoose';
import bcrypt from  'bcryptjs'
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String, // ✅ Missing type added
            required: [true, 'Username is required'],
            unique: true, // ✅ `unique` does not take an array
            match: [/^[a-zA-Z0-9]+$/, 'Username is invalid']
        },
        avatar: {
            type: String
        },
        email: {
            type: String, // ✅ Missing type added
            required: [true, 'Email is required'],
            unique: true, // ✅ `unique` should be a boolean
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Email is invalid']
        },
        password: {
            type: String, // ✅ Missing type added
            required: [true, 'Password is required']
        }
    },
    { timestamps: true }
);

userSchema.pre('save', function (next) {

    const user = this;
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    

    user.avatar = `https://robohash.org/${user.username}`;
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
