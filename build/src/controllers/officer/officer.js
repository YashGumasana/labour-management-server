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
exports.get_rejected_labour_list = exports.get_approved_labour_list = exports.update_labour_doc_status = exports.get_labour_info_by_id = exports.get_labour_docs_by_id = exports.get_labour_list_by_search = exports.labourList = void 0;
const helper_1 = require("../../helper");
const user_1 = require("../../database/models/user");
const common_1 = require("../../common");
const labourDoc_1 = require("../../database/models/labour/labourDoc");
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const labourList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let match = {
        isActive: true,
        category: 0
    }, response, count;
    const docStatusMatch = {
        $or: [
            { "docStatus.docStatus": { $eq: [0, 0, 0, 0] } },
            { "docStatus": { $exists: false } }
        ]
    };
    try {
        [response, count] = yield Promise.all([
            user_1.userModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "labourdocs",
                        let: { createdBy: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$createdBy', '$$createdBy'] },
                                            {
                                                $eq: ['$isActive', true]
                                            },
                                            {
                                                $eq: ['$docStatus', [0, 0, 0, 0]]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: { docStatus: 1, createdBy: 1 }
                            }
                        ],
                        as: "docStatus"
                    }
                },
                {
                    $project: { userId: 1, userName: 1, docStatus: 1 }
                },
                {
                    $match: docStatusMatch
                }
            ]),
            user_1.userModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "labourdocs",
                        let: { createdBy: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$createdBy', '$$createdBy'] },
                                            {
                                                $eq: ['$isActive', true]
                                            },
                                            {
                                                $eq: ['$docStatus', [0, 0, 0, 0]]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: { docStatus: 1, createdBy: 1 }
                            }
                        ],
                        as: "docStatus"
                    }
                },
                {
                    $project: { userId: 1, userName: 1, docStatus: 1 }
                },
                {
                    $match: docStatusMatch
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);
        return res.status(200).json(new common_1.apiResponse(200, 'labour details successfully fetched', {
            labour_data: response,
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
exports.labourList = labourList;
const get_labour_list_by_search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { search } = req.body, match = {}, response, count;
    try {
        if (search && search != '') {
            match = {
                isActive: true,
                category: 0,
                userId: Number(search)
            };
        }
        else {
            match = {
                isActive: true,
                category: 0,
            };
        }
        const docStatusMatch = {
            $or: [
                { "docStatus.docStatus": { $eq: [0, 0, 0, 0] } },
                { "docStatus": { $exists: false } }
            ]
        };
        [response, count] = yield Promise.all([
            user_1.userModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "labourdocs",
                        let: { createdBy: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$createdBy', '$$createdBy'] },
                                            {
                                                $eq: ['$isActive', true]
                                            },
                                            {
                                                $eq: ['$docStatus', [0, 0, 0, 0]]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: { docStatus: 1, createdBy: 1 }
                            }
                        ],
                        as: "docStatus"
                    }
                },
                {
                    $project: { userId: 1, userName: 1, docStatus: 1 }
                },
                {
                    $match: docStatusMatch
                }
            ]),
            user_1.userModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "labourdocs",
                        let: { createdBy: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$createdBy', '$$createdBy'] },
                                            {
                                                $eq: ['$isActive', true]
                                            },
                                            {
                                                $eq: ['$docStatus', [0, 0, 0, 0]]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: { docStatus: 1, createdBy: 1 }
                            }
                        ],
                        as: "docStatus"
                    }
                },
                {
                    $project: { userId: 1, userName: 1, docStatus: 1 }
                },
                {
                    $match: docStatusMatch
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);
        return res.status(200).json(new common_1.apiResponse(200, 'labour details successfully fetched with search', {
            labour_data: response,
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
exports.get_labour_list_by_search = get_labour_list_by_search;
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
const update_labour_doc_status = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    try {
        let { docStatus, id } = req.body;
        let response = yield labourDoc_1.labourDocModel.findOneAndUpdate({
            createdBy: new ObjectId(id),
            isActive: true,
        }, { docStatus: docStatus }, { new: true });
        if (!response) {
            return res.status(400).json(new common_1.apiResponse(400, 'data not found', {}, `${response}`));
        }
        console.log(response, "response--------------");
        return res.status(200).json(new common_1.apiResponse(200, 'doc status updated successfully', {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.update_labour_doc_status = update_labour_doc_status;
const get_approved_labour_list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { search } = req.body, match = {}, response, count;
    try {
        if (search && search != '') {
            match = {
                isActive: true,
                category: 0,
                userId: Number(search)
            };
        }
        else {
            match = {
                isActive: true,
                category: 0,
            };
        }
        const docStatusMatch = {
            $or: [
                { "docStatus.docStatus": { $eq: [1, 1, 1, 1] } },
                { "docStatus": { $exists: false } }
            ]
        };
        [response, count] = yield Promise.all([
            user_1.userModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "labourdocs",
                        let: { createdBy: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$createdBy', '$$createdBy']
                                            },
                                            {
                                                $eq: ['$isActive', true]
                                            },
                                            {
                                                $eq: ['$docStatus', [1, 1, 1, 1]]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: { docStatus: 1, createdBy: 1 }
                            }
                        ],
                        as: 'docStatus'
                    }
                },
                {
                    $project: { userId: 1, userName: 1, docStatus: 1 }
                },
                {
                    $match: docStatusMatch
                }
            ]),
            user_1.userModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "labourdocs",
                        let: { createdBy: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$createdBy', '$$createdBy'] },
                                            {
                                                $eq: ['$isActive', true]
                                            },
                                            {
                                                $eq: ['$docStatus', [1, 1, 1, 1]]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: { docStatus: 1, createdBy: 1 }
                            }
                        ],
                        as: "docStatus"
                    }
                },
                {
                    $project: { userId: 1, userName: 1, docStatus: 1 }
                },
                {
                    $match: docStatusMatch
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);
        return res.status(200).json(new common_1.apiResponse(200, 'labour details successfully fetched with search', {
            labour_data: response,
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
exports.get_approved_labour_list = get_approved_labour_list;
const get_rejected_labour_list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    let { search } = req.body, match = {}, response, count;
    try {
        if (search && search != '') {
            match = {
                isActive: true,
                category: 0,
                userId: Number(search)
            };
        }
        else {
            match = {
                isActive: true,
                category: 0,
            };
        }
        const docStatusMatch = {
            $and: [
                {
                    $or: [
                        {
                            $and: [
                                { "docStatus.docStatus": { $ne: [1, 1, 1, 1] } },
                                { "docStatus.docStatus": { $ne: [0, 0, 0, 0] } },
                            ],
                        },
                        { "docStatus": { $exists: false } },
                    ],
                },
                { "docStatus": { $ne: [] } },
            ],
        };
        [response, count] = yield Promise.all([
            user_1.userModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "labourdocs",
                        let: { createdBy: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$createdBy', '$$createdBy']
                                            },
                                            {
                                                $eq: ['$isActive', true]
                                            },
                                            {
                                                $and: [
                                                    {
                                                        $ne: ['$docStatus', [1, 1, 1, 1]]
                                                    },
                                                    {
                                                        $ne: ['$docStatus', [0, 0, 0, 0]]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: { docStatus: 1, createdBy: 1 }
                            }
                        ],
                        as: 'docStatus'
                    }
                },
                {
                    $project: { userId: 1, userName: 1, docStatus: 1 }
                },
                {
                    $match: docStatusMatch
                }
            ]),
            user_1.userModel.aggregate([
                { $match: match },
                { $sort: { createdAt: 1 } },
                {
                    $lookup: {
                        from: "labourdocs",
                        let: { createdBy: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$createdBy', '$$createdBy']
                                            },
                                            {
                                                $eq: ['$isActive', true]
                                            },
                                            {
                                                $and: [
                                                    {
                                                        $ne: ['$docStatus', [1, 1, 1, 1]]
                                                    },
                                                    {
                                                        $ne: ['$docStatus', [0, 0, 0, 0]]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $project: { docStatus: 1, createdBy: 1 }
                            }
                        ],
                        as: 'docStatus'
                    }
                },
                {
                    $project: { userId: 1, userName: 1, docStatus: 1 }
                },
                {
                    $match: docStatusMatch
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 }
                    }
                }
            ]),
        ]);
        return res.status(200).json(new common_1.apiResponse(200, 'labour details successfully fetched with search', {
            labour_data: response,
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
exports.get_rejected_labour_list = get_rejected_labour_list;
//# sourceMappingURL=officer.js.map