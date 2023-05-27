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
exports.get_applied_job = exports.update_job_by_id = exports.get_job_list = void 0;
const helper_1 = require("../../helper");
const job_1 = require("../../database/models/contractor/job");
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const ObjectId = mongoose_1.default.Types.ObjectId;
const get_job_list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let match = {
        isActive: true,
    }, response, count, user = req.header('user');
    try {
        response = yield job_1.jobModel.find({
            isActive: true,
            appliedBy: { $nin: [new ObjectId(user._id)] }
        });
        count = yield job_1.jobModel.countDocuments({
            isActive: true,
            appliedBy: { $nin: [new ObjectId(user._id)] }
        });
        return res.status(200).json(new common_1.apiResponse(200, 'job details successfully fetched ', {
            job_data: response,
            state: {
                count_data: count
            }
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.get_job_list = get_job_list;
const update_job_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let user = req.header('user'), jobId = req.body.jobId;
    try {
        let updateRes = yield job_1.jobModel.findByIdAndUpdate({
            _id: jobId
        }, { $push: { appliedBy: user._id } }, { new: true });
        return res.status(200).json(new common_1.apiResponse(200, 'Applied Successfully', {
            updateRes,
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.update_job_by_id = update_job_by_id;
const get_applied_job = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let user = req.header('user'), response, count;
    try {
        response = yield job_1.jobModel.find({
            isActive: true,
            appliedBy: { $in: [new ObjectId(user._id)] }
        });
        count = yield job_1.jobModel.countDocuments({
            isActive: true,
            appliedBy: { $in: [new ObjectId(user._id)] }
        });
        return res.status(200).json(new common_1.apiResponse(200, 'applied job details successfully fetched ', {
            applied_job_data: response,
            state: {
                count_data: count
            }
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.get_applied_job = get_applied_job;
//# sourceMappingURL=dashboard.js.map