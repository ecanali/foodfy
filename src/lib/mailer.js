const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e22f17fda9016b",
    pass: "0b9b300779cd22"
  }
})