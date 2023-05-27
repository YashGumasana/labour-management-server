"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../common");
const user_1 = require("../database/models/user");
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_token_secret = process.env.JWT_TOKEN_SECRET;
const ObjectId = mongoose_1.default.Types.ObjectId;
const userJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { authorization, userType } = req.headers, result;
    if (authorization) {
        try {
            let isverifyToken = jsonwebtoken_1.default.verify(authorization, jwt_token_secret);
            if ((isverifyToken === null || isverifyToken === void 0 ? void 0 : isverifyToken.category) != userType) {
                return res.status(403).json(new common_1.apiResponse(403, 'Access Denied!', {}, {}));
            }
            result = yield user_1.userModel.findOne({ _id: new ObjectId(isverifyToken._id), isActive: true });
            req.headers.user = result;
            return next();
        }
        catch (err) {
            if (err.message == "invalid signature") {
                return res.status(403).json(new common_1.apiResponse(403, 'Do not try a different token!', {}, {}));
            }
        }
    }
    else {
        return res.status(401).json(new common_1.apiResponse(401, 'We can not find tokens in header!', {}, {}));
    }
});
exports.userJWT = userJWT;
//# sourceMappingURL=jwt.js.map