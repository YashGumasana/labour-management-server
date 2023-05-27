import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, default: null },
    fullName: { type: String, default: null },
    email: { type: String, default: null },
    phoneNumber: { type: Number, default: null },
    password: { type: String, default: null },
    profilePhoto: { type: String, default: null },
    category: { type: Number, default: 0, enum: [0, 1, 2, 3] }, //'Labour', 'Contractor', 'Officer', 'Builder'
    gender: { type: Number, default: 0, enum: [0, 1] }, // Male,Female
    userId: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },

})

export const userModel = mongoose.model("user", userSchema)