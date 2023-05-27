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
exports.login = exports.register = void 0;
const joi_1 = __importDefault(require("joi"));
const common_1 = require("../common");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        userName: joi_1.default.string().error(new Error('user name is string!')),
        fullName: joi_1.default.string().error(new Error('full name is string!')),
        email: joi_1.default.string().error(new Error('email is string!')),
        phoneNumber: joi_1.default.number().error(new Error('phonenumber is number!')),
        password: joi_1.default.string().error(new Error('password is string!')),
        profilePhoto: joi_1.default.string().error(new Error('profilephoto is string!')),
        category: joi_1.default.number().error(new Error('category is number!')),
        gender: joi_1.default.number().error(new Error('gender is number!')),
    });
    schema.validateAsync(req.body).then(result => {
        console.log("result", result);
        return next();
    }).catch(error => {
        console.log(error);
        res.status(400).json(new common_1.apiResponse(400, error.message, {}, {}));
    });
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        userId: joi_1.default.number().error(new Error('userId is number!')),
        password: joi_1.default.string().error(new Error('password is string!')),
    });
    schema.validateAsync(req.body).then(result => {
        return next();
    }).catch(error => {
        console.log(error);
        res.status(400).json(new common_1.apiResponse(400, error.message, {}, {}));
    });
});
exports.login = login;
//# sourceMappingURL=authentication.js.map