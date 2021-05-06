
class SendGridService {
    constructor() {
        this.mail = require('@sendgrid/mail');
        this.mail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    sendEmail(message, to, from_email) {
        let result = this.mail.send({
            to: to,
            from: 'dylans.codes@gmail.com',
            subject: `Message from Insurance Agent: ${from_email}`,
            text: `${message}`,
            html: `<i style='color: deepskyblue'>${message}</i>`
        }).then(response => {
            console.log(response);
        })
    }
}

module.exports = SendGridService;
