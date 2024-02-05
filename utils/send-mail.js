const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const sendMail = asyncHandler(async (email, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: 'Cein Ecommerce Shop', // sender address
        to: email, // list of receivers
        subject: "Cein Shop Service", // Subject line
        text: "Hi please check information below carefully", // plain text body
        html: htmlContent, // html body
    });
    return info;
});
module.exports = sendMail;