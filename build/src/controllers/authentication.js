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
exports.refresh_token = exports.login = exports.register = void 0;
const helper_1 = require("../helper");
const user_1 = require("../database/models/user");
const common_1 = require("../common");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = require("../helper/nodemailer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("register");
    (0, helper_1.reqInfo)(req);
    try {
        let body = req.body, otpFlag = 1, userId = 0, authToken = 0;
        let [isAlready, userNameAlreadyExist] = yield Promise.all([
            user_1.userModel.findOne({
                email: body === null || body === void 0 ? void 0 : body.email, isActive: true
            }),
            user_1.userModel.findOne({
                userName: { '$regex': body === null || body === void 0 ? void 0 : body.userName, '$options': 'i' },
                isActive: true
            })
        ]);
        if (userNameAlreadyExist) {
            return res.status(409).json(new common_1.apiResponse(409, 'You have entered username is already exist!', {}, {}));
        }
        if ((isAlready === null || isAlready === void 0 ? void 0 : isAlready.isBlock) == true) {
            return res.status(409).json(new common_1.apiResponse(409, 'Your account has been blocked', {}, {}));
        }
        if (isAlready) {
            return res.status(409).json(new common_1.apiResponse(409, "You have entered email is already exist!", {}, {}));
        }
        const salt = bcryptjs_1.default.genSaltSync(8);
        const hashPassword = yield bcryptjs_1.default.hash(body.password, salt);
        delete body.password;
        body.password = hashPassword;
        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                authToken = Math.round(Math.random() * 1000000);
                if (authToken.toString().length == 6) {
                    flag++;
                }
                let isAlreadyAssign = yield user_1.userModel.findOne({
                    userId: authToken
                });
                if ((isAlreadyAssign === null || isAlreadyAssign === void 0 ? void 0 : isAlreadyAssign.userId) != authToken) {
                    otpFlag = 0;
                }
            }
            body.userId = authToken;
            let user = yield new user_1.userModel(body).save();
            console.log("user", user);
            let response = yield (0, nodemailer_1.userId_send_mail)({
                email: user === null || user === void 0 ? void 0 : user.email,
                userName: user === null || user === void 0 ? void 0 : user.userName,
                userId: user === null || user === void 0 ? void 0 : user.userId
            });
            return res.status(200).json(new common_1.apiResponse(200, "register successful", {}, {}));
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    (0, helper_1.reqInfo)(req);
    let body = req.body;
    console.log(body);
    try {
        let response = yield user_1.userModel.findOne({
            userId: body.userId,
            isActive: true
        });
        if (!response) {
            return res.status(400).json(new common_1.apiResponse(400, 'UserID is not found', {}, {}));
        }
        if ((response === null || response === void 0 ? void 0 : response.isBlock) == true) {
            return res.status(403).json(new common_1.apiResponse(403, 'Your account has been blocked', {}, {}));
        }
        const passwordMatch = yield bcryptjs_1.default.compare(body.password, response.password);
        if (!passwordMatch) {
            return res.status(400).json(new common_1.apiResponse(400, 'You have entered an invalid password!', {}, {}));
        }
        const token = jsonwebtoken_1.default.sign({
            _id: response._id,
            category: response.category,
            userId: response.userId,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, process.env.JWT_TOKEN_SECRET);
        const refresh_token = jsonwebtoken_1.default.sign({
            _id: response._id,
            category: response.category,
            userId: response.userId,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, process.env.REFRESH_TOKEN_SECRET);
        console.log("token", token);
        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
        });
        // response.token = token
        let match = {
            isActive: true,
            category: 0,
        };
        if (response.category === 0) {
            let labDocStatusRes = yield Promise.all([
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
                                                { $eq: ['$createdBy', new ObjectId(response._id)] },
                                                {
                                                    $eq: ['$isActive', true]
                                                },
                                            ]
                                        }
                                    },
                                },
                                {
                                    $project: { docStatus: 1, createdBy: 1, documents: 1 }
                                }
                            ],
                            as: "docStatus"
                        }
                    },
                    {
                        $project: { userId: 1, userName: 1, docStatus: 1 }
                    },
                ])
            ]);
            return res.status(200).json(new common_1.apiResponse(200, 'Login Successful!', { response, token, labDocStatusRes: labDocStatusRes[0][0] }, {}));
        }
        return res.status(200).json(new common_1.apiResponse(200, 'Login Successful!', { response, token }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.login = login;
const refresh_token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("req.cookies", req === null || req === void 0 ? void 0 : req.cookies);
        const rf_token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshtoken;
        if (!rf_token) {
            return res.status(400).json(new common_1.apiResponse(400, 'Please Login Now.', {}, {}));
        }
        jsonwebtoken_1.default.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, response) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).json(new common_1.apiResponse(400, 'Please Login Now.', {}, {}));
            }
            const user = yield user_1.userModel.findById(response._id).select("-password");
            if (!user) {
                return res.status(404).json(new common_1.apiResponse(404, 'This user does not exist.', {}, {}));
            }
            const token = jsonwebtoken_1.default.sign({
                _id: new ObjectId(response._id),
                userId: response.userId,
                category: response.category,
                status: "Login",
                generatedOn: (new Date().getTime())
            }, process.env.JWT_TOKEN_SECRET);
            let match = {
                isActive: true,
                category: 0,
            };
            if (response.category === 0) {
                let labDocStatusRes = yield Promise.all([
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
                                                    { $eq: ['$createdBy', new ObjectId(response._id)] },
                                                    {
                                                        $eq: ['$isActive', true]
                                                    },
                                                ]
                                            }
                                        },
                                    },
                                    {
                                        $project: { docStatus: 1, createdBy: 1, documents: 1 }
                                    }
                                ],
                                as: "docStatus"
                            }
                        },
                        {
                            $project: { userId: 1, userName: 1, docStatus: 1 }
                        },
                    ])
                ]);
                return res.status(200).json(new common_1.apiResponse(200, 'refresh_token retrive successfully of labour', { user, token, labDocStatusRes: labDocStatusRes[0][0] }, {}));
            }
            return res.status(200).json(new common_1.apiResponse(200, 'refresh_token retrive successfully', { user, token }, {}));
        }));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.refresh_token = refresh_token;
// console.log(paypal, "paypal------------");
// export const paypal_identiy_check = async (req: Request, res: Response) => {
//     try {
//         const email = 'bhumit.semicolon@gmail.com';
//         const getToken = async () => {
//             const response = await axios({
//                 method: 'post',
//                 url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
//                 auth: {
//                     username: clientId,
//                     password: clientSecret
//                 },
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 },
//                 params: {
//                     grant_type: 'client_credentials'
//                 }
//             });
//             return response.data.access_token;
//         };
//         getToken().then((accessToken) => {
//             axios.get('https://api-m.sandbox.paypal.com/v1/identity/openidconnect/userinfo', {
//                 headers: {
//                     'Authorization': 'Bearer ' + accessToken,
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 },
//                 params: {
//                     'schema': 'openid',
//                     'email': email
//                 }
//             }).then((response) => {
//                 console.log('Status: ' + response.status);
//                 console.log('Data: ' + JSON.stringify(response.data));
//                 console.log(response.data.email, 'response.data.email');
//                 if (response.data.email === email) {
//                     console.log('Email is registered with PayPal');
//                 } else {
//                     console.log('Email is not registered with PayPal');
//                 }
//             }).catch((error) => {
//                 console.error(error);
//             });
//         }).catch((error) => {
//             console.error(error);
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
//     }
// }
//  // Replace with the email you want to check
//         paypal.identity.get({ emails: [email] }, function (error, response) {
//             if (error) {
//                 console.error(error);
//             } else {
//                 if (response.emails && response.emails.length > 0) {
//                     const emailResponse = response.emails[0];
//                     console.log('Email: ' + emailResponse.email);
//                     console.log('Status: ' + emailResponse.status);
//                 } else {
//                     console.log('Email not found');
//                 }
//             }
//         });
// export const get_paypal_token = async (req: Request, res: Response) => {
//     try {
//         axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token',
//             'grant_type=client_credentials',
//             {
//                 auth: {
//                     username: clientId,
//                     password: clientSecret
//                 },
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             }
//         ).then(response => {
//             console.log(response.data);
//         }).catch(error => {
//             console.error(error.response.data);
//         });
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
//     }
// }
//# sourceMappingURL=authentication.js.map