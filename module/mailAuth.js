const nodemailer = require('nodemailer');
const mailConfig = require('../config/mailConfig');

var transporter = nodemailer.createTransport({
    service:mailConfig.mailService,
    auth:{
        user:mailConfig.mailId,
        pass:mailConfig.mailPassword
    }
});

module.exports = transporter;


