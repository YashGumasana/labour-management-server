"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.labourRouter = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllers_1 = require("../controllers");
const jwt_1 = require("../helper/jwt");
router.use(jwt_1.userJWT);
router.post('/uploadDoc', controllers_1.labourController.uploadDoc);
router.get('/get_detail_labourDocs', controllers_1.labourController.get_detail_labourDocs);
router.get('/get_job_list', controllers_1.labourController.get_job_list);
router.put('/update_job_by_id', controllers_1.labourController.update_job_by_id);
router.get('/get_applied_job', controllers_1.labourController.get_applied_job);
// router.post('/login', validation.login, authController.login)
exports.labourRouter = router;
//# sourceMappingURL=labour.js.map