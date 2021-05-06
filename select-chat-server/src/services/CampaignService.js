
const CampaignDAO = require('../dao/CampaignDAO');
const errors = require('../errors');

class CampaignService {

    constructor() {
        this.campaignDao = new CampaignDAO();
    }

    async saveCampaign(name, type, method, description) {
        return this.campaignDao.save(name, type, method, description).then(result => {
            return result;
        }).catch(error => {
            return errors.save_campaign;
        });
    }
    
    // if same name but different id is found which indicates a different campaign with the same name, return true
    async nameExists(name, id) {
        let query = `select * from [dev].[dbo].[Campaign]
                    where id <> ${id} and name = '${name}'`;
        
        
        let result = await this.campaignDao.execute(query);
        console.log(result)
        console.log(query);
        return result.recordset.length > 0;
    }

    async fetchCampaigns(start, limit) {
        let select = `select * from [dev].[dbo].[Campaign]
                        order by id desc
                        offset ${start} rows
                        fetch next ${limit} rows only`;
        console.log(select);
        let result = await this.campaignDao.execute(select);
        let count = await this.campaignDao.getCount();

        return {
            campaigns: result.recordset || [],
            count: count.recordset[0].c
        }
    }

    async updateCampaign(campaign) {
        if (await this.nameExists(campaign.name, campaign.id)) {
            return errors.campaign_name_exists; 
        }

        let keys = Object.keys(campaign); 
        let values = Object.keys(campaign);
        let update_str = 'set ';

        keys.forEach((key, index) => {
            if (key !== 'id') {
                let value = campaign[key];
                let str = `${key} = '${campaign[key]}'`;
                if (index < keys.length - 2)
                    str += ","
                update_str += str;
            }
        })

        let updateQuery = `update [dev].[dbo].[Campaign]
                           ${update_str}
                           where id = ${campaign.id}`;
        let result = this.campaignDao.execute(updateQuery);
        return {
            campaign: campaign
        }
    }
}

module.exports = CampaignService