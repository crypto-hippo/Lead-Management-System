require('dotenv').config();
const Sequelize = require('sequelize');

class BaseModel {

    constructor() {
        
        /* Instantiate our sequelize instance */
        this._sequelize = new Sequelize(process.env.DB, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            host: process.env.DB_PROD_SERVER_IP,
            dialect: 'mssql',
            dialectOptions: {
                options: {
                    encrypt: true,
                }
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        });
    }
}

module.exports = BaseModel;
