import { Request, Response } from "express";
import { reqInfo } from "../../helper";
import { ObjectId, Types } from "mongoose";
import cloudinary1 from 'cloudinary'
import { apiResponse } from "../../common";
import { labourDocModel } from "../../database/models/labour/labourDoc";
const cloudinary = cloudinary1.v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})


const ObjectId = Types.ObjectId

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

export const uploadDoc = async (req: any, res: Response) => {
    console.log("upload doc of labour api");
    const imageUrl = [];
    reqInfo(req)
    try {
        let body: any = req.body,
            user: any = req.header('user'),
            documents = req.files

        body.createdBy = new ObjectId(user?._id)

        const documentsArray = Object.values(documents);
        console.log('documents-----', documentsArray);

        const results: any[] = await Promise.allSettled(
            documentsArray.map(async (photo: any) => {
                const srcRes: any = await cloudinary.uploader.upload(photo.tempFilePath, {
                    folder: 'Labour-Doc',
                    use_filename: true,
                })
                return srcRes.url;
            })
        )

        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                imageUrl.push(result.value);
            } else {
                console.error(`Failed to upload image: ${result.reason}`);
            }
        });

        let find = await labourDocModel.findOne({
            createdBy: user?._id
        })

        if (find) {
            let resp = await labourDocModel.findOneAndUpdate({
                createdBy: user?._id
            },
                {
                    documents: imageUrl,
                    docStatus: [0, 0, 0, 0]
                }, { new: true })
            console.log("resp", resp);
            return res.status(200).json(new apiResponse(200, "Document uploaded sucessfully", {}, {}));
        }
        body.documents = imageUrl;
        console.log("cloudinary result", body);

        let response = await new labourDocModel(body).save()
        console.log("response", response);

        return res.status(200).json(new apiResponse(200, "Document uploaded sucessfully", {}, {}));

    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const get_detail_labourDocs = async (req: Request, res: Response) => {

    reqInfo(req)


    try {
        let user: any = req.header('user')

        let response = await labourDocModel.findOne({
            isActive: true,
            createdBy: user._id
        })


        return res.status(200).json(new apiResponse(200, "Document detail fetched sucessfully", {
            documents_data: response
        }, {}));


    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}