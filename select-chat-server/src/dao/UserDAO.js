const BaseDAO = require('./BaseDAO');

class UserDAO extends BaseDAO {

    constructor() {
        super();
        this.table = "User";
    }

    async storeNewUser(givenName, familyName, email, imageUrl) {
        let user = {
            first_name: givenName,
            last_name: familyName,
            email: email,
            image_url: imageUrl,
            is_admin: 0,
        }
        let insertQuery = super.createInsertQuery(user, this.table);
        let result = await super.execute(insertQuery);
        return result.rowsAffected;
    }

    async exists(key, value) {
        return await super.exists(key, value, this.table);
    }

    async select(key, value) {
        return (await super.select(key, value, this.table)).recordset[0]
    }
}

module.exports = UserDAO;