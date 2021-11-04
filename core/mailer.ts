import nodemailer = require('nodemailer')

const options = {
  host: process.env.NODEMAILER_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.NODEMAILER_PORT) || 2525,
  auth: {
    user: process.env.NODEMAILER_USER || 'f4a70c3ced2a2d',
    pass: process.env.NODEMAILER_PASS || '1061d7823e1836',
  },
}

const transport = nodemailer.createTransport(options)

export default transport
