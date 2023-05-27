"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractorRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllers_1 = require("../controllers");
const jwt_1 = require("../helper/jwt");
router.use(jwt_1.userJWT);
router.post('/createJob', controllers_1.contractorController.createJob);
router.get('/get_crated_job', controllers_1.contractorController.get_crated_job);
router.get('/get_labour_request_for_job', controllers_1.contractorController.get_labour_request_for_job);
router.get('/get_labour_docs_by_id/:id', controllers_1.contractorController.get_labour_docs_by_id);
router.get('/get_labour_info_by_id/:id', controllers_1.contractorController.get_labour_info_by_id);
router.post('/feedback_for_labour_by_contractor', controllers_1.contractorController.feedback_for_labour_by_contractor);
router.get('/get_feedback_detail/:id', controllers_1.contractorController.get_feedback_detail);
exports.contractorRouter = router;
//# sourceMappingURL=contractor.js.map