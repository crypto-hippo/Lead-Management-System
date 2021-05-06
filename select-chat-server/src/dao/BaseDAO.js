// const mssql = require('mssql');
const config = require("../config/db")
require('dotenv').config();
const Sequelize = require('sequelize');
const mssql = require('mssql');

class BaseDAO {

    constructor() {
        this._pool = new mssql.ConnectionPool(config);
    }

    sqlEscape(args) {
        return args.map(e => {
            return "\'e\'".replace('e', e)
        })
    }

    createInsertQuery(obj, table) {
        const columns = Object.keys(obj);
        const valuesEscaped = this.sqlEscape(Object.values(obj));
        return `insert into [dbo].[${table}] 
                (${columns.join(",")}) values (${valuesEscaped.join(",")})
                select SCOPE_IDENTITY() as id`
    }

    async getCount(table) {
        let selectCount = `select count(*) as c from [dbo].[${table}]`;
        return await this.execute(selectCount);
    }
    
    createSelectQuery(key, value, table) {
        return `select * from [dbo].[${table}] where ${key} = '${value}'`; 
    }

    async execute(query) {
        try {
            await this._pool.connect();
            let result = await this._pool.request().query(query);
            return result;    
        } catch (error) {
            console.error("Error caught: ", error);
            return error;
        } finally {
            this._pool.close();
        }
    }

    async select(key, value, table) {
        let selectQuery = this.createSelectQuery(key, value, table);
        return await this.execute(selectQuery)
    }

    async exists(key, value, table) {
        const query = this.createSelectQuery(key, value, table);
        const existing = await this.execute(query);
        return existing.recordset.length > 0;
    }

    get pool() {
        return this._pool;
    }
}

module.exports = BaseDAO;