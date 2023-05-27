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
exports.update_labour_doc_status = void 0;
const joi_1 = __importDefault(require("joi"));
const common_1 = require("../common");
const update_labour_doc_status = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        docStatus: joi_1.default.array().error(new Error('docStatus is array')),
        id: joi_1.default.string().error(new Error('id is string!')),
    });
    schema.validateAsync(req.body).then(result => {
        return next();
    }).catch(error => {
        console.log(error);
        res.status(400).json(new common_1.apiResponse(400, error.message, {}, {}));
    });
});
exports.update_labour_doc_status = update_labour_doc_status;
//# sourceMappingURL=officer.js.map