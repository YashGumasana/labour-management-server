import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema({

    userId: { type: Number, default: 0 },
    feedbackBy: { type: Number, default: 0 },
    tenure: { type: String, default: null },
    remark: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    isActive: { type: Boolean, default: true },

}, { timestamps: true })

export const feedBackModel = mongoose.model("feedback", feedBackSchema)