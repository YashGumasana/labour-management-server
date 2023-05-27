"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.labourDocModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const labourDocSchema = new mongoose_1.default.Schema({
    isActive: { type: Boolean, default: true },
    documents: { type: [{ type: String }] },
    // approveStatus: { type: Number, default: 0, enum: [0, 1, 2] }, // 0 - pending,1-approved,2-rejected
    docStatus: { type: [{ type: Number }], default: [0, 0, 0, 0] },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true });
exports.labourDocModel = mongoose_1.default.model('labourDoc', labourDocSchema);
//# sourceMappingURL=labourDoc.js.map