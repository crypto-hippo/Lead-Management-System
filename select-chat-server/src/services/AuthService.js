const googleService = require('../services/GoogleService');

class AuthService {

    constructor() {
        
    }

    authenticateGoogle(id_token) {
        return googleService.verify(id_token);
    }
}

module.exports = new AuthService();