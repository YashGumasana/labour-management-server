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
exports.get_detail_labourDocs = exports.uploadDoc = void 0;
const helper_1 = require("../../helper");
const mongoose_1 = require("mongoose");
const cloudinary_1 = __importDefault(require("cloudinary"));
const common_1 = require("../../common");
const labourDoc_1 = require("../../database/models/labour/labourDoc");
const cloudinary = cloudinary_1.default.v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const ObjectId = mongoose_1.Types.ObjectId;
// export const uploadDoc = async (req: any, res: Response) => {
//     console.log("upload doc of labour api");
//     const imageUrl = [];
//     reqInfo(req)
//     try {
//         let body: any = req.body,
//             user: any = req.header('user'),
//             documents = req.files
//         // console.log('files-----', req?.files);
//         // console.log('documents-----', req?.files.document1);
//         body.createdBy = new ObjectId(user?._id)
//         const documentsArray = Object.values(documents);
//         console.log('documents-----', documentsArray);
//         const results: any = await Promise.allSettled(
//             documentsArray.map(async (photo: any) => {
//                 const srcRes: any = await cloudinary.uploader.upload(photo.tempFilePath, {
//                     folder: 'Labour-Doc', // set the folder name to store photos in Cloudinary
//                     use_filename: true, // use the original filename of the photo
//                     // unique_filename: false, // don't append a unique ID to the filename
//                     // overwrite: true, // overwrite the existing photo if it has the same name
//                 })
//                 imageUrl.push(srcRes.url);
//             }
//             )
//         )
//         body.documents = imageUrl
//         console.log("cloudinary result", body);
//         let response = await new labourDocModel(body).save()
//         console.log("response", response);
//         return res.status(200).json(new apiResponse(200, "Document uploaded sucessfully", {}, {}));
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
//     }
// }
const uploadDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("upload doc of labour api");
    const imageUrl = [];
    (0, helper_1.reqInfo)(req);
    try {
        let body = req.body, user = req.header('user'), documents = req.files;
        body.createdBy = new ObjectId(user === null || user === void 0 ? void 0 : user._id);
        const documentsArray = Object.values(documents);
        console.log('documents-----', documentsArray);
        const results = yield Promise.allSettled(documentsArray.map((photo) => __awaiter(void 0, void 0, void 0, function* () {
            const srcRes = yield cloudinary.uploader.upload(photo.tempFilePath, {
                folder: 'Labour-Doc',
                use_filename: true,
            });
            return srcRes.url;
        })));
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                imageUrl.push(result.value);
            }
            else {
                console.error(`Failed to upload image: ${result.reason}`);
            }
        });
        let find = yield labourDoc_1.labourDocModel.findOne({
            createdBy: user === null || user === void 0 ? void 0 : user._id
        });
        if (find) {
            let resp = yield labourDoc_1.labourDocModel.findOneAndUpdate({
                createdBy: user === null || user === void 0 ? void 0 : user._id
            }, {
                documents: imageUrl,
                docStatus: [0, 0, 0, 0]
            }, { new: true });
            console.log("resp", resp);
            return res.status(200).json(new common_1.apiResponse(200, "Document uploaded sucessfully", {}, {}));
        }
        body.documents = imageUrl;
        console.log("cloudinary result", body);
        let response = yield new labourDoc_1.labourDocModel(body).save();
        console.log("response", response);
        return res.status(200).json(new common_1.apiResponse(200, "Document uploaded sucessfully", {}, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.uploadDoc = uploadDoc;
const get_detail_labourDocs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, helper_1.reqInfo)(req);
    try {
        let user = req.header('user');
        let response = yield labourDoc_1.labourDocModel.findOne({
            isActive: true,
            createdBy: user._id
        });
        return res.status(200).json(new common_1.apiResponse(200, "Document detail fetched sucessfully", {
            documents_data: response
        }, {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(new common_1.apiResponse(500, 'Internal Server Error', {}, error));
    }
});
exports.get_detail_labourDocs = get_detail_labourDocs;
//# sourceMappingURL=labourDoc.js.map