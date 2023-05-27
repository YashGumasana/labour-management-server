import config from 'config'
import nodemailer from 'nodemailer'

const mail: any = config.get('nodeMail')

const option: any = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: mail.mail,
        pass: mail.password,
    }
}

const transPorter = nodemailer.createTransport(option)



export const userId_send_mail = async (mail_data: any) => {
    return new Promise(async (resolve, reject) => {
        console.log(mail.mail, mail_data?.email, mail_data?.userName, mail_data?.userId);

        try {
            const mailOptions = {
                from: `Network <${mail.mail}>`,
                to: mail_data?.email,
                subject: "Network User Id",
                html: `<html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Network</title>
                    <meta name="description" content="Network Register User Id">
                    <style type="text/css">
                        a:hover {
                            text-decoration: underline !important;
                        }
                    </style>
                </head>
                
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                       
                                                        <h1
                                                            style="color:#1e1e2d; font-weight:500; margin:0; padding-top: 20px;font-size:32px;font-family:'Rubik',sans-serif;">
                                                            Network User Id</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:6px 0 26px; border-bottom:1px solid #cecece; width:300px;"></span>
                                                        <p
                                                            style="color:#455056; font-size:15px;line-height:24px;text-align:left; margin:0;">
                                                            Hi ${mail_data?.userName || ""},
                                                            <br><br>
                                                            Your User Id For Network is ${mail_data?.userId}. Please do
                                                            not share it anyone.
                                                            <br><br>
                                                            Thanks & Regards<br>
                                                            Team Network
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                        </tr>
                    </table>
                    </td>
                    </tr>
                    </table>
                </body>
                
                </html>`,
            }
            transPorter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(`Email has been sent to ${mail_data?.email}, kindly follow the instruction`)
                }
            })
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}