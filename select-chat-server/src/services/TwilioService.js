

class TwilioService {
    constructor() {
        this.account_sid = process.env.TWILIO_SID;
        this.auth_token = process.env.TWILIO_AUTH_TOKEN;
        this.from_number = process.env.TWILIO_FROM_NUMBER;
        this.client = require('twilio')(this.account_sid, this.auth_token);
    }

    sendSms(message, to) {
        this.client.messages.create({
            body: message,
            from: `+1${this.from_number}`,
            to: `+1${to}`
        }).then(message => console.log(message.sid));
    }
}

module.exports = TwilioService;