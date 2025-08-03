import mongoose from'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number,
        Editor: Number,
    },
    refreshToken: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export const User = mongoose.model('user', userSchema)