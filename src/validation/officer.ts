import { Request, Response } from 'express'
import Joi from 'joi'
import { isValidObjectId } from 'mongoose'

import { apiResponse } from '../common'

export const update_labour_doc_status = async (req: Request, res: Response, next: any) => {
    const schema = Joi.object({
        docStatus: Joi.array().error(new Error('docStatus is array')),
        id: Joi.string().error(new Error('id is string!')),

    })
    schema.validateAsync(req.body).then(result => {

        return next()
    }).catch(error => {
        console.log(error);

        res.status(400).json(new apiResponse(400, error.message, {}, {}))
    })
}