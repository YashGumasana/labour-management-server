"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const common_1 = require("../common");
const labour_1 = require("./labour");
const officer_1 = require("./officer");
const user_1 = require("./user");
const contractor_1 = require("./contractor");
const router = (0, express_1.Router)();
exports.router = router;
const accessControl = (req, res, next) => {
    req.headers.userType = common_1.userStatus[req.originalUrl.split('/')[1]];
    console.log(req.headers.userType);
    next();
};
router.use('/user', user_1.userRouter);
router.use('/labour', accessControl, labour_1.labourRouter);
router.use('/officer', accessControl, officer_1.officerRouter);
router.use('/contractor', accessControl, contractor_1.contractorRouter);
//# sourceMappingURL=index.js.map