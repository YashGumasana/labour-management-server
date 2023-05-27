"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    jobTitle: { type: String, default: null },
    description: { type: String, default: null },
    experinceLevel: { type: String, default: null },
    location: { type: String, default: null },
    salery: { type: String, default: null },
    timeDuration: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    appliedBy: { type: [{ type: mongoose_1.default.Schema.Types.ObjectId }], ref: 'user' }
}, { timestamps: true });
exports.jobModel = mongoose_1.default.model("job", jobSchema);
//# sourceMappingURL=job.js.map