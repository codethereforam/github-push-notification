const nodemailer = require('nodemailer');
const config = require('./config');

let mailTransport = nodemailer.createTransport({
    service: config.mail.service,
    host: config.mail.host,
    secure: config.mail.secure,
    port: config.mail.port,
    auth: {
        user: config.mail.authUser,
        pass: config.mail.authPass
    },
});

module.exports = {
    send: function (subject, message) {
        console.log(`subject: ${subject}`);
        console.log(`message: ${message}`);
        mailTransport.sendMail({
            from: config.mail.from,
            to: config.mail.to,
            subject: subject,
            text: message
        }, function (err, msg) {
            if (err) {
                console.log(`send email error: ${err}`);
            } else {
                console.log(`send email success: ${msg.messageId}`);
            }
        });
    }
};