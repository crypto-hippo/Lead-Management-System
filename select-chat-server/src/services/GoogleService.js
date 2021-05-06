const {OAuth2Client} = require('google-auth-library');
require('dotenv').config()

class GoogleService {

    constructor() {

    }

    async verify(id_token) {
        const client = new OAuth2Client(process.env.PROD_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.PROD_CLIENT_ID,
        
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        return userid
    }
}

module.exports = new GoogleService();