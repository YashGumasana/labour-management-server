import { NextFunction, Request, Response, Router } from "express";
import { userStatus } from "../common";
import { labourRouter } from "./labour";
import { officerRouter } from "./officer";
import { userRouter } from "./user";
import { contractorRouter } from "./contractor";

const router = Router()

const accessControl = (req: Request, res: Response, next: NextFunction) => {
    req.headers.userType = userStatus[req.originalUrl.split('/')[1]]

    console.log(req.headers.userType,);

    next()
}

router.use('/user', userRouter)
router.use('/labour', accessControl, labourRouter)
router.use('/officer', accessControl, officerRouter)
router.use('/contractor', accessControl, contractorRouter)

export { router }
