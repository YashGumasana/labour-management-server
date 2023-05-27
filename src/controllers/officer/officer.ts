import { Request, Response } from "express";
import { reqInfo } from "../../helper";
import { userModel } from "../../database/models/user";
import { apiResponse } from "../../common";
import { any, number } from "joi";
import { labourDocModel } from "../../database/models/labour/labourDoc";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId


export const labourList = async (req: Request, res: Response) => {
    reqInfo(req)

    let match: any = {
        isActive: true,
        category: 0
    },
        response: any, count: any

    const docStatusMatch = {
        $or: [
            { "docStatus.docStatus": { $eq: [0, 0, 0, 0] } },
            { "docStatus": { $exists: false } }
        ]
    };

    try {

        [response, count] = await Promise.all([
            userModel.aggregate([
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
            userModel.aggregate(
                [
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
                ]
            )
        ])

        return res.status(200).json(new apiResponse(200, 'labour details successfully fetched', {
            labour_data: response,
            state: {
                count_data: count
            }
        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const get_labour_list_by_search = async (req: Request, res: Response) => {
    reqInfo(req)

    let { search } = req.body,
        match: any = {},
        response: any,
        count: any



    try {
        if (search && search != '') {
            match = {
                isActive: true,
                category: 0,
                userId: Number(search)
            }
        }
        else {
            match = {
                isActive: true,
                category: 0,
            }
        }
        const docStatusMatch = {
            $or: [
                { "docStatus.docStatus": { $eq: [0, 0, 0, 0] } },
                { "docStatus": { $exists: false } }
            ]
        };


        [response, count] = await Promise.all([
            userModel.aggregate([
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
            userModel.aggregate(
                [
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
                ]
            )
        ])



        return res.status(200).json(new apiResponse(200, 'labour details successfully fetched with search', {
            labour_data: response,
            state: {
                count_data: count
            }
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


export const update_labour_doc_status = async (req: Request, res: Response) => {
    reqInfo(req)

    try {
        let { docStatus, id } = req.body

        let response = await labourDocModel.findOneAndUpdate({
            createdBy: new ObjectId(id),
            isActive: true,

        }, { docStatus: docStatus }, { new: true })

        if (!response) {
            return res.status(400).json(new apiResponse(400, 'data not found', {}, `${response}`))
        }

        console.log(response, "response--------------");


        return res.status(200).json(new apiResponse(200, 'doc status updated successfully', {}, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}



export const get_approved_labour_list = async (req: Request, res: Response) => {
    reqInfo(req)

    let { search } = req.body,
        match: any = {},
        response: any,
        count: any

    try {
        if (search && search != '') {
            match = {
                isActive: true,
                category: 0,
                userId: Number(search)
            }
        }
        else {
            match = {
                isActive: true,
                category: 0,
            }
        }

        const docStatusMatch = {
            $or: [
                { "docStatus.docStatus": { $eq: [1, 1, 1, 1] } },
                { "docStatus": { $exists: false } }
            ]
        };

        [response, count] = await Promise.all([
            userModel.aggregate([
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
            userModel.aggregate(
                [
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
                ]
            )
        ])

        return res.status(200).json(new apiResponse(200, 'labour details successfully fetched with search', {
            labour_data: response,
            state: {
                count_data: count
            }
        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }

}
export const get_rejected_labour_list = async (req: Request, res: Response) => {
    reqInfo(req)

    let { search } = req.body,
        match: any = {},
        response: any,
        count: any

    try {
        if (search && search != '') {
            match = {
                isActive: true,
                category: 0,
                userId: Number(search)
            }
        }
        else {
            match = {
                isActive: true,
                category: 0,
            }
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


        [response, count] = await Promise.all([
            userModel.aggregate([
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
            userModel.aggregate([
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


        ])




        return res.status(200).json(new apiResponse(200, 'labour details successfully fetched with search', {
            labour_data: response,
            state: {
                count_data: count
            }
        }, {}))

    } catch (error) {
        console.log(error);
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }

}





