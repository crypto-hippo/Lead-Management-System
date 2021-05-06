const UserDAO = require('../dao/UserDAO');

require('dotenv').config()

class UserService {

    constructor() {
        this.userDao = new UserDAO();
    }

    /**
     * Insert a user if that user does not exist.
     * @param {String} givenName 
     * @param {String} familyName 
     * @param {String} email 
     * @param {String} imageUrl 
     * @returns {Object} An object containing user db entity and a stored boolean
     */
    async insertIfNotExists(givenName, familyName, email, imageUrl) {

        let result = {user: null, stored: 0};
        let exists = await this.userDao.exists("email", email);

        if ( ! exists) {
            result.stored = await this.userDao.storeNewUser(givenName, familyName, email, imageUrl);
        } 

        result.user = await this.userDao.select("email", email)
        return result;
    }
}

module.exports = new UserService();