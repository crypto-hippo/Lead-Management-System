const BaseDAO = require('./BaseDAO');

class BatchLeadDAO extends BaseDAO {

    constructor() {
        super();
        this.table = "BatchLead";
    }

    createLeadInsertRows(leads, batch_file_id) {
        let i;
        let currentLead;
        let valuesEscaped;
        let valueRowStr;
        let obj;
        let all = '';

        leads.forEach((lead, index) => { 
            obj = {
                first_name: lead[0],
                last_name: lead[1],
                selectcare_account_id: lead[2],
                selectcare_lead_id: lead[3],
                selectchat_campaign_id: lead[4], //default 0, campaigns need to be setup
                email: lead[5],
                phone: lead[6],
                agent_email: lead[7],
                batch_file_id: batch_file_id,
                activation_state: 'inactive',
                status: 'active'
            }

            valuesEscaped = this.sqlEscape(Object.values(obj));
            valueRowStr = `(${valuesEscaped.join(",")})`;
            if (index < leads.length - 1) {
                valueRowStr += ",";
            }
            all += valueRowStr;
            
        })
        console.log('all', all);
        return all;
    }

    createLeadInsertQuery(leads, batchFileId) {
        let valueRows = this.createLeadInsertRows(leads, batchFileId);
        return `insert into [dbo].[${this.table}] 
                (first_name, last_name, selectcare_account_id, 
                selectcare_lead_id, selectchat_campaign_id, email, phone, 
                agent_email, batch_file_id, activation_state, status) 
                values ${valueRows}`
    }

    async insertLeads(leads, batchFileId) {
       let insertManyQuery = this.createLeadInsertQuery(leads, batchFileId);
       return await this.execute(insertManyQuery);
    }

    async insertBatchFile(batchFile) {
        let insertQuery = this.createInsertQuery(batchFile, this.batchFileTable);
        let result = await this.execute(insertQuery);
        return result;
    }

    async insertLead(lead) {
        let insertQuery = this.createInsertQuery(lead, this.table);
        return await this.execute(insertQuery);
    }

    async exists(key, value) {
        return await this.exists(key, value, this.table);
    }

    async select(key, value) {
        return (await this.select(key, value, this.table)).recordset[0]
    }

    async getCount() {
        return await super.getCount(this.table)
    }
}

module.exports = BatchLeadDAO;