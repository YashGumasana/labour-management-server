import { Request, Response } from "express";
import { reqInfo } from "../../helper";
import { jobModel } from "../../database/models/contractor/job";
import mongoose from "mongoose";
import { apiResponse } from "../../common";
const ObjectId = mongoose.Types.ObjectId


export const get_job_list = async (req: Request, res: Response) => {
    reqInfo(req)
    let match: any = {
        isActive: true,
    },
        response: any, count: any, user: any = req.header('user')


    try {
        response = await jobModel.find({
            isActive: true,
            appliedBy: { $nin: [new ObjectId(user._id)] }
        })

        count = await jobModel.countDocuments({
            isActive: true,
            appliedBy: { $nin: [new ObjectId(user._id)] }
        })

        return res.status(200).json(new apiResponse(200, 'job details successfully fetched ', {
            job_data: response,
            state: {
                count_data: count
            }
        }, {}))
    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }

}




export const update_job_by_id = async (req: Request, res: Response) => {

    reqInfo(req)
    let user: any = req.header('user'),
        jobId = req.body.jobId


    try {

        let updateRes = await jobModel.findByIdAndUpdate({
            _id: jobId
        }, { $push: { appliedBy: user._id } }, { new: true })


        return res.status(200).json(new apiResponse(200, 'Applied Successfully', {
            updateRes,
        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const get_applied_job = async (req: Request, res: Response) => {
    reqInfo(req)
    let user: any = req.header('user'), response: any, count: any

    try {
        response = await jobModel.find({
            isActive: true,
            appliedBy: { $in: [new ObjectId(user._id)] }
        })

        count = await jobModel.countDocuments({
            isActive: true,
            appliedBy: { $in: [new ObjectId(user._id)] }
        })


        return res.status(200).json(new apiResponse(200, 'applied job details successfully fetched ', {
            applied_job_data: response,
            state: {
                count_data: count
            }
        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }


}