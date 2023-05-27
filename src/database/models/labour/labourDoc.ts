import mongoose from "mongoose";

const labourDocSchema = new mongoose.Schema({
    isActive: { type: Boolean, default: true },

    documents: { type: [{ type: String }] },

    // approveStatus: { type: Number, default: 0, enum: [0, 1, 2] }, // 0 - pending,1-approved,2-rejected

    docStatus: { type: [{ type: Number }], default: [0, 0, 0, 0] },// 0 - pending,1-approved,2-rejected

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }

}, { timestamps: true })

export const labourDocModel = mongoose.model('labourDoc', labourDocSchema);     