const BaseDAO = require('./BaseDAO');

class BatchFileDAO extends BaseDAO {

    constructor() {
        super();
        this.table = "BatchFile";
    }

    async insertBatchFile(batchFile) {
        let insertQuery = super.createInsertQuery(batchFile, this.table);
        let result = await super.execute(insertQuery);
        try {
            return result.recordset[0].id;
        } catch (error) {
            console.log(error);
            return -1;
        }
    }

    async byName(file_name) {
        let selectQuery = super.createSelectQuery("file_name", file_name, this.table);
        return await super.execute(selectQuery);
    }

    async exists(key, value) {
        return await super.exists(key, value, this.table);
    }

    async select(key, value) {
        return (await super.select(key, value, this.table)).recordset[0]
    }

    async getCount() {
        return await super.getCount(this.table)
    }
}

module.exports = BatchFileDAO;