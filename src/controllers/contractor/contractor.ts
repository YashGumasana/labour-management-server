import { Request, Response, response } from "express";
import { reqInfo } from "../../helper";
import { jobModel } from "../../database/models/contractor/job";
import { apiResponse } from "../../common";
import { ObjectId, Types } from "mongoose";
import { userModel } from "../../database/models/user";
import { labourDocModel } from "../../database/models/labour/labourDoc";
import { feedBackModel } from "../../database/models/contractor/feedback";
const ObjectId = Types.ObjectId

export const createJob = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let body: any = req.body,
            user: any = req.header('user')

        body.createdBy = new ObjectId(user?._id)

        let job: any = await new jobModel(body).save()

        return res.status(200).json(new apiResponse(200, "job created successful", {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}

export const get_crated_job = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let user: any = req.header('user')

        let jobs: any = await jobModel.find({
            createdBy: user._id,
            isActive: true
        })

        return res.status(200).json(new apiResponse(200, "get created job successful", { created_jobs: jobs }, {}))

    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const get_labour_request_for_job = async (req: Request, res: Response) => {

    reqInfo(req)
    let user: any = req.header('user')
    let match: any = {
        isActive: true,
        createdBy: user._id
    },
        response: any
    try {


        [response] = await Promise.all([
            jobModel.aggregate([
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
        ])

        return res.status(200).json(new apiResponse(200, 'labour details successfully fetched', {
            requested_job_data: response,
        }, {}))


    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const get_labour_docs_by_id = async (req: Request, res: Response) => {
    reqInfo(req)

    let { id } = req.params,
        match: any = {},
        response: any,
        count: any

    try {


        response = await labourDocModel.findOne({
            createdBy: new ObjectId(id),
            isActive: true
        })

        return res.status(200).json(new apiResponse(200, 'labour docs details successfully fetched ', {
            labour_data: response,

        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }

}

export const get_labour_info_by_id = async (req: Request, res: Response) => {
    reqInfo(req)

    let { id } = req.params,
        match: any = {},
        response: any,
        count: any

    try {
        response = await userModel.findOne({
            _id: new ObjectId(id),
            isActive: true

        })
        return res.status(200).json(new apiResponse(200, 'labour details successfully fetched ', {
            labour_data: response,
        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }

}

export const feedback_for_labour_by_contractor = async (req: Request, res: Response) => {

    reqInfo(req)
    let body = req.body,
        user: any = req.header('user')

    body.createdBy = new ObjectId(user?._id)
    try {

        let resp = await userModel.findOne({
            userId: body.userId
        })

        if (!resp) {
            return res.status(400).json(new apiResponse(400, "UserID is not found", {}, {}))

        }

        let feedbackBy = await userModel.findOne({
            _id: new ObjectId(user._id)
        })

        body.labourId = new ObjectId(resp._id)

        console.log('feedbackBy', feedbackBy);

        body.feedbackBy = feedbackBy.userId


        let feedback: any = await new feedBackModel(body).save()

        return res.status(200).json(new apiResponse(200, "feedback created successful", { feedback }, {}))

    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const get_feedback_detail = async (req: Request, res: Response) => {
    reqInfo(req)

    console.log('get_feedback_detail');


    let { id } = req.params,
        response: any

    try {



        response = await feedBackModel.findOne({
            _id: new ObjectId(id),
        })

        return res.status(200).json(new apiResponse(200, 'feedback details successfully fetched ', {
            feedback_data: response,
        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }

}