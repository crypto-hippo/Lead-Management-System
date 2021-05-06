
require('dotenv').config();

module.exports = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    server: process.env.DB_PROD_SERVER_IP,
    port: process.env.DB_PORT,
}