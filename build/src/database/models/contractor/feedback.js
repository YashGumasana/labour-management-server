"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedBackModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const feedBackSchema = new mongoose_1.default.Schema({
    userId: { type: Number, default: 0 },
    feedbackBy: { type: Number, default: 0 },
    tenure: { type: String, default: null },
    remark: { type: String, default: null },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    labourId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.feedBackModel = mongoose_1.default.model("feedback", feedBackSchema);
//# sourceMappingURL=feedback.js.map