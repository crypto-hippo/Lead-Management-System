const BaseDAO = require('./BaseDAO');
const errors = require('../errors');

class CampaignDAO extends BaseDAO {

    constructor() {
        super();
        this.table = "Campaign";
    }

    async select(key, value) {
        return (await this.select(key, value, this.table)).recordset[0]
    }

    async save(name, type, method, description) {
        console.log("nothing")
        let exists = await this.exists("name", name, this.table);
        if (exists) {
            return errors.campaign_exists;  
        } else {
            let campaign = {name: name, type: type, method: method, description: description}
            let insertCampaignQuery = this.createInsertQuery(campaign, this.table)
            let result = await this.execute(insertCampaignQuery);
            if (result.recordset) {
                return {success: true};
            } else {
                throw "error_save_campaign";
            }
        }
    }

    async getCount() {
        return await super.getCount(this.table);
    }
}

module.exports = CampaignDAO;