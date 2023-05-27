"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.officerRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllers_1 = require("../controllers");
const validation = __importStar(require("../validation"));
const jwt_1 = require("../helper/jwt");
router.use(jwt_1.userJWT);
router.get('/labourList', controllers_1.officerController.labourList);
router.post('/get_labour_list_by_search', controllers_1.officerController.get_labour_list_by_search);
router.get('/get_labour_docs_by_id/:id', controllers_1.officerController.get_labour_docs_by_id);
router.get('/get_labour_info_by_id/:id', controllers_1.officerController.get_labour_info_by_id);
router.put('/update_labour_doc_status', validation.update_labour_doc_status, controllers_1.officerController.update_labour_doc_status);
router.post('/get_approved_labour_list', controllers_1.officerController.get_approved_labour_list);
router.post('/get_rejected_labour_list', controllers_1.officerController.get_rejected_labour_list);
// router.post('/login', validation.login, authController.login)
exports.officerRouter = router;
//# sourceMappingURL=officer.js.map