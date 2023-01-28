var nodemailer = require('nodemailer');

async function sendEmail(email, link, text) {
    console.log("hello")
    let testAccount = {
        user: "anaomart@gmail.com",
        pass: "jtuumbmuhxiwowni"
    };
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
    console.log("hello")
    let info = await transporter.sendMail({
        from: 'anonymous Massager <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Email verification", // Subject line
        text: "Hello world?", // plain text body
        html: `<h2>Hello , You can ${text} by Visiting this Link <div>${link} </div> The Link will expired In <span style='color:red'>5 Hours</h2> </span>`, // html body
    }, (error, result) => {
        if (error) {
            console.log(error)
        }
        return console.log(result)
    })
}

module.exports = sendEmail;