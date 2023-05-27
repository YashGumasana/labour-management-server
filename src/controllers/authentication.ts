import { Request, Response } from "express";
import { reqInfo } from "../helper";
import { userModel } from "../database/models/user";
import { apiResponse, genderStatus } from "../common";
import bcryptjs from 'bcryptjs'
import { userId_send_mail } from "../helper/nodemailer";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId

import axios from 'axios';



export const register = async (req: Request, res: Response) => {
    console.log("register");

    reqInfo(req)
    try {
        let body = req.body,
            otpFlag = 1,
            userId = 0,
            authToken = 0



        let [isAlready, userNameAlreadyExist]: any = await Promise.all([
            userModel.findOne({
                email: body?.email, isActive: true
            }),

            userModel.findOne({
                userName: { '$regex': body?.userName, '$options': 'i' },
                isActive: true
            })
        ])

        if (userNameAlreadyExist) {
            return res.status(409).json(new apiResponse(409, 'You have entered username is already exist!', {}, {}))
        }

        if (isAlready?.isBlock == true) {
            return res.status(409).json(new apiResponse(409, 'Your account has been blocked', {}, {}))
        }

        if (isAlready) {
            return res.status(409).json(new apiResponse(409, "You have entered email is already exist!", {}, {}))
        }

        const salt = bcryptjs.genSaltSync(8)
        const hashPassword = await bcryptjs.hash(body.password, salt)
        delete body.password
        body.password = hashPassword


        while (otpFlag == 1) {
            for (let flag = 0; flag < 1;) {
                authToken = Math.round(Math.random() * 1000000)
                if (authToken.toString().length == 6) {
                    flag++;
                }

                let isAlreadyAssign = await userModel.findOne({
                    userId: authToken
                })

                if (isAlreadyAssign?.userId != authToken) {
                    otpFlag = 0
                }
            }

            body.userId = authToken

            let user: any = await new userModel(body).save()
            console.log("user", user);

            let response = await userId_send_mail({
                email: user?.email,
                userName: user?.userName,
                userId: user?.userId
            })

            return res.status(200).json(new apiResponse(200, "register successful", {}, {}))
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}

export const login = async (req: Request, res: Response) => {
    console.log("login");

    reqInfo(req)
    let body = req.body
    console.log(body);

    try {
        let response: any = await userModel.findOne({
            userId: body.userId,
            isActive: true
        })

        if (!response) {
            return res.status(400).json(new apiResponse(400, 'UserID is not found', {}, {}))
        }

        if (response?.isBlock == true) {
            return res.status(403).json(new apiResponse(403, 'Your account has been blocked', {}, {}))
        }

        const passwordMatch = await bcryptjs.compare(body.password, response.password)

        if (!passwordMatch) {
            return res.status(400).json(new apiResponse(400, 'You have entered an invalid password!', {}, {}))
        }

        const token = jwt.sign({
            _id: response._id,
            category: response.category,
            userId: response.userId,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, process.env.JWT_TOKEN_SECRET)

        const refresh_token = jwt.sign({
            _id: response._id,
            category: response.category,
            userId: response.userId,
            status: "Login",
            generatedOn: (new Date().getTime())
        }, process.env.REFRESH_TOKEN_SECRET)

        console.log("token", token);

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/user/refresh_token',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
        })

        // response.token = token

        let match = {
            isActive: true,
            category: 0,
        }
        if (response.category === 0) {
            let labDocStatusRes = await Promise.all([
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

                                                { $eq: ['$createdBy', new ObjectId(response._id)] },
                                                {
                                                    $eq: ['$isActive', true]
                                                },

                                            ]
                                        }
                                    },
                                },
                                {
                                    $project: { docStatus: 1, createdBy: 1, documents: 1 }
                                }

                            ],
                            as: "docStatus"
                        }
                    },
                    {
                        $project: { userId: 1, userName: 1, docStatus: 1 }
                    },
                ])
            ])



            return res.status(200).json(new apiResponse(200, 'Login Successful!', { response, token, labDocStatusRes: labDocStatusRes[0][0] }, {}))
        }

        return res.status(200).json(new apiResponse(200, 'Login Successful!', { response, token }, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
    }
}


export const refresh_token = async (req: Request, res: Response) => {

    try {
        console.log("req.cookies", req?.cookies);

        const rf_token = req.cookies?.refreshtoken
        if (!rf_token) {
            return res.status(400).json(new apiResponse(400, 'Please Login Now.', {}, {}))
        }

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err: any, response: any) => {
            if (err) {
                return res.status(400).json(new apiResponse(400, 'Please Login Now.', {}, {}))
            }

            const user = await userModel.findById(response._id).select("-password")

            if (!user) {
                return res.status(404).json(new apiResponse(404, 'This user does not exist.', {}, {}))
            }

            const token = jwt.sign({
                _id: new ObjectId(response._id),
                userId: response.userId,
                category: response.category,
                status: "Login",
                generatedOn: (new Date().getTime())
            }, process.env.JWT_TOKEN_SECRET)

            let match = {
                isActive: true,
                category: 0,
            }


            if (response.category === 0) {
                let labDocStatusRes = await Promise.all([
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

                                                    { $eq: ['$createdBy', new ObjectId(response._id)] },
                                                    {
                                                        $eq: ['$isActive', true]
                                                    },

                                                ]
                                            }
                                        },
                                    },
                                    {
                                        $project: { docStatus: 1, createdBy: 1, documents: 1 }
                                    }

                                ],
                                as: "docStatus"
                            }
                        },
                        {
                            $project: { userId: 1, userName: 1, docStatus: 1 }
                        },
                    ])
                ])



                return res.status(200).json(new apiResponse(200, 'refresh_token retrive successfully of labour', { user, token, labDocStatusRes: labDocStatusRes[0][0] }, {}))
            }


            return res.status(200).json(new apiResponse(200, 'refresh_token retrive successfully', { user, token }, {}))

        })

    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))

    }
}




// console.log(paypal, "paypal------------");


// export const paypal_identiy_check = async (req: Request, res: Response) => {
//     try {
//         const email = 'bhumit.semicolon@gmail.com';

//         const getToken = async () => {
//             const response = await axios({
//                 method: 'post',
//                 url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
//                 auth: {
//                     username: clientId,
//                     password: clientSecret
//                 },
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 },
//                 params: {
//                     grant_type: 'client_credentials'
//                 }
//             });
//             return response.data.access_token;
//         };

//         getToken().then((accessToken) => {
//             axios.get('https://api-m.sandbox.paypal.com/v1/identity/openidconnect/userinfo', {
//                 headers: {
//                     'Authorization': 'Bearer ' + accessToken,
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 },
//                 params: {
//                     'schema': 'openid',
//                     'email': email
//                 }
//             }).then((response) => {
//                 console.log('Status: ' + response.status);
//                 console.log('Data: ' + JSON.stringify(response.data));

//                 console.log(response.data.email, 'response.data.email');


//                 if (response.data.email === email) {
//                     console.log('Email is registered with PayPal');
//                 } else {
//                     console.log('Email is not registered with PayPal');
//                 }
//             }).catch((error) => {
//                 console.error(error);
//             });
//         }).catch((error) => {
//             console.error(error);
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))
//     }

// }




//  // Replace with the email you want to check

//         paypal.identity.get({ emails: [email] }, function (error, response) {
//             if (error) {
//                 console.error(error);
//             } else {
//                 if (response.emails && response.emails.length > 0) {
//                     const emailResponse = response.emails[0];
//                     console.log('Email: ' + emailResponse.email);
//                     console.log('Status: ' + emailResponse.status);
//                 } else {
//                     console.log('Email not found');
//                 }
//             }
//         });


// export const get_paypal_token = async (req: Request, res: Response) => {
//     try {
//         axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token',
//             'grant_type=client_credentials',
//             {
//                 auth: {
//                     username: clientId,
//                     password: clientSecret
//                 },
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 }
//             }
//         ).then(response => {
//             console.log(response.data);
//         }).catch(error => {
//             console.error(error.response.data);
//         });

//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error))

//     }
// }