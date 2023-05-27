import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, default: null },
    description: { type: String, default: null },
    experinceLevel: { type: String, default: null },
    location: { type: String, default: null },
    salery: { type: String, default: null },
    timeDuration: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    appliedBy: { type: [{ type: mongoose.Schema.Types.ObjectId }], ref: 'user' }
}, { timestamps: true })

export const jobModel = mongoose.model("job", jobSchema)