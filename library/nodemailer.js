const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  auth: {
      user: 'test.tallam@mail.ru',
      pass: 'r27443rA'
  }
},
{
    from: 'Техподдержка TALLAM <test.tallam@mail.ru>',
});

const mailer = message => {
  transport.sendMail(message,(err,info) => {
    if(err) return console.log(err)
    console.log('Email sent: '. info)
  })
}

module.exports = mailer;