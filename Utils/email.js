/* eslint-disable no-else-return */
const nodemailer = require('nodemailer');
const path = require('path');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Natours <${process.env.EMAIL_FROM || process.env.GMAIL_USERNAME}>`; // Use Gmail if needed
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Gmail SMTP configuration
      return nodemailer.createTransport({
        service: 'gmail', // This simplifies the host/port for Gmail
        auth: {
          user: process.env.EMAIL_FROM, // Your Gmail address
          pass: process.env.GMAIL_APP_PASSWORD, // 16-character App Password
        },
      });
    } else {
      // Development with Mailtrap (optional for local testing)
      return nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });
    }
  }

  async send(template, subject) {
    // 1. Render HTML using Pug
    const html = pug.renderFile(
      path.join(__dirname, '../views/email', `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    // 2. Define Email Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: convert(html),
    };

    // 3. Create Transport and Send Email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset link (Valid for only 10 minutes)',
    );
  }
};
