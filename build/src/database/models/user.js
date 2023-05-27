"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userName: { type: String, default: null },
    fullName: { type: String, default: null },
    email: { type: String, default: null },
    phoneNumber: { type: Number, default: null },
    password: { type: String, default: null },
    profilePhoto: { type: String, default: null },
    category: { type: Number, default: 0, enum: [0, 1, 2, 3] },
    gender: { type: Number, default: 0, enum: [0, 1] },
    userId: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
});
exports.userModel = mongoose_1.default.model("user", userSchema);
//# sourceMappingURL=user.js.map