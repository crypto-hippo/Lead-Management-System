const BaseModel = require('./BaseModel.js');
const Sequelize = require('sequelize');

class UserModel extends BaseModel {
    constructor() {
        super();
        this.user = this._sequelize.define('User', {
            first_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            image_url: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            is_admin: {
                type: Sequelize.TINYINT,
                allowNull: false
            }
        })
    }

    exists(key, value) {
        let result = this.user.findOne({where: {key: value}});
        console.log(result);
    }
}

module.exports = UserModel;