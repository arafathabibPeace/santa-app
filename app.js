const cors = require('cors');
const express = require("express");
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

app.use(cors());
app.use(bodyParser());
app.use(morgan());

app.post("/sendLetter", (req, res) => {
  const username = req.body.username
  const address = req.body.address
  const wish = req.body.wish

  const emailTemplate = () => {

    // Generate SMTP service account from ethereal.email
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
      }

      console.log('Credentials obtained, sending message...');

      // Create a SMTP transporter object
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'vicente.beer@ethereal.email',
          pass: 'PtMUBdxyq9qUSU5yhZ'
        }
      });

      // Message object
      let message = {
        from: 'do_not_reply@northpole.com',
        to: 'santa@northpole.com',
        subject: 'Nodemailer is unicode friendly ✔',
        text: 'Username: ' + username + '\nAddress: ' + address + '\nWish: ' + wish,
        html: '<p><b>Hi Santa, </b></p> <p> I am ' + username + ' and I wish to have a '+ wish + '. Thank you.</p> Address: ' + address 
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log('Error occurred. ' + err.message);
          return process.exit(1);
        }
    
        const messageInfo = info.messageId;
        const previewURL = nodemailer.getTestMessageUrl(info);
        
        console.log('Message sent: %s', messageInfo);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', previewURL);

        return res.status(200).json(emailInfo);
      });
    });
  }


  setInterval(emailTemplate, 15 * 1000);


});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));