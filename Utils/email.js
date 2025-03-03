const SibApiV3Sdk = require('sib-api-v3-sdk');
const path = require('path');
const pug = require('pug');
const { convert } = require('html-to-text');

function initBrevoClient() {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
  return new SibApiV3Sdk.TransactionalEmailsApi();
}

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = {
      email: process.env.EMAIL_FROM,
      name: 'Natours',
    };
  }

  async send(template, subject) {
    const html = pug.renderFile(
      path.join(__dirname, '../views/email', `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    const text = convert(html);

    const emailData = {
      sender: this.from,
      to: [{ email: this.to }],
      subject: subject,
      htmlContent: html,
      textContent: text,
    };

    const brevoClient = initBrevoClient();

    try {
      await brevoClient.sendTransacEmail(emailData);
    } catch (err) {
      console.error('Failed to send email:', err.response.body || err.message);
      throw new Error('Email sending failed');
    }
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
