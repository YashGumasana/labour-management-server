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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_feedback_detail = exports.feedback_for_labour_by_contractor = exports.get_labour_info_by_id = exports.get_labour_docs_by_id = exports.get_labour_request_for_job = exports.get_crated_job = exports.createJob = void 0;
const helper_1 = require("../../helper");
const job_1 = require("../../database/models/contractor/job");
const common_1 = require("../../common");
const mongoose_1 = require("mongoose");
const user_1 = require("../../database/models/user");
const labourDoc_1 = require("../../database/models/labour/labourDoc");
const feedback_1 = require("../../database/models/contractor/feedback");
const ObjectId = mongoose_1.Types.ObjectId;
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    try {
        let body = req.body, user = req.header('user');
        body.createdBy = new ObjectId(user === null || user === void 0 ? void 0 : user._id);
        let job = yield new job_1.jobModel(body).save();
        return res.status(200).json(new common_1.apiResponse(200, "job created successful", {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.createJob = createJob;
const get_crated_job = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    try {
        let user = req.header('user');
        let jobs = yield job_1.jobModel.find({
            createdBy: user._id,
            isActive: true
        });
        return res.status(200).json(new common_1.apiResponse(200, "get created job successful", { created_jobs: jobs }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.get_crated_job = get_crated_job;
const get_labour_request_for_job = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let user = req.header('user');
    let match = {
        isActive: true,
        createdBy: user._id
    }, response;
    try {
        [response] = yield Promise.all([
            job_1.jobModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "users",
                        let: { appliedBy: '$appliedBy' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $in: ['$_id', '$$appliedBy']
                                            },
                                        ]
                                    }
                                }
                            },
                        ],
                        as: "user"
                    }
                },
                {
                    $lookup: {
                        from: "labourdocs",
                        let: { appliedBy: '$appliedBy' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $in: ['$createdBy', '$$appliedBy']
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "labDocs"
                    }
                },
                {
                    $lookup: {
                        from: "feedbacks",
                        let: { appliedBy: '$appliedBy' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $in: ['$labourId', '$$appliedBy']
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "feedback"
                    }
                },
                {
                    $project: { jobTitle: 1, user: 1, labDocs: 1, feedback: 1 }
                }
            ])
        ]);
        return res.status(200).json(new common_1.apiResponse(200, 'labour details successfully fetched', {
            requested_job_data: response,
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.get_labour_request_for_job = get_labour_request_for_job;
const get_labour_docs_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { id } = req.params, match = {}, response, count;
    try {
        response = yield labourDoc_1.labourDocModel.findOne({
            createdBy: new ObjectId(id),
            isActive: true
        });
        return res.status(200).json(new common_1.apiResponse(200, 'labour docs details successfully fetched ', {
            labour_data: response,
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.get_labour_docs_by_id = get_labour_docs_by_id;
const get_labour_info_by_id = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { id } = req.params, match = {}, response, count;
    try {
        response = yield user_1.userModel.findOne({
            _id: new ObjectId(id),
            isActive: true
        });
        return res.status(200).json(new common_1.apiResponse(200, 'labour details successfully fetched ', {
            labour_data: response,
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.get_labour_info_by_id = get_labour_info_by_id;
const feedback_for_labour_by_contractor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let body = req.body, user = req.header('user');
    body.createdBy = new ObjectId(user === null || user === void 0 ? void 0 : user._id);
    try {
        let resp = yield user_1.userModel.findOne({
            userId: body.userId
        });
        if (!resp) {
            return res.status(400).json(new common_1.apiResponse(400, "UserID is not found", {}, {}));
        }
        let feedbackBy = yield user_1.userModel.findOne({
            _id: new ObjectId(user._id)
        });
        body.labourId = new ObjectId(resp._id);
        console.log('feedbackBy', feedbackBy);
        body.feedbackBy = feedbackBy.userId;
        let feedback = yield new feedback_1.feedBackModel(body).save();
        return res.status(200).json(new common_1.apiResponse(200, "feedback created successful", { feedback }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.feedback_for_labour_by_contractor = feedback_for_labour_by_contractor;
const get_feedback_detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    console.log('get_feedback_detail');
    let { id } = req.params, response;
    try {
        response = yield feedback_1.feedBackModel.findOne({
            _id: new ObjectId(id),
        });
        return res.status(200).json(new common_1.apiResponse(200, 'feedback details successfully fetched ', {
            feedback_data: response,
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.get_feedback_detail = get_feedback_detail;
//# sourceMappingURL=contractor.js.map