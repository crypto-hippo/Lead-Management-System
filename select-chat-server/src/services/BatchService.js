let mssql = require('mssql');

const BatchFileDAO = require("../dao/BatchFileDAO");
const BatchLeadDAO = require("../dao/BatchLeadDAO");
const BatchValidator = require('../validators/BatchValidator')
const errors = require('../errors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

require('dotenv').config();

class BatchService {

    constructor() {
        this.batchFileDao = new BatchFileDAO();
        this.batchLeadDao = new BatchLeadDAO();
        this.batchValidator = new BatchValidator();
    }
  
    async getLeadCsvData(file_name) {
        let query = `select first_name, last_name, selectcare_account_id, selectcare_lead_id, selectchat_campaign_id, agent_email, phone 
                    from [dbo].[BatchFile] a
                    inner join [dbo].[BatchLead] b on(a.id = b.batch_file_id)
                    where a.file_name = '${file_name}'`            
        
        let result = await this.batchFileDao.execute(query);
        return result.recordset;
    }

    async createCsvFile(file_name) {
        const csvWriter = createCsvWriter({
            path: file_name,
        });    

        return {
            data: await this.getLeadCsvData(file_name)
        }
    }

    async createTempCsvForDownload(file_name) {
        if (await this.batchFileDao.exists("file_name", file_name)) {
            let result = await this.createCsvFile(file_name);
            return result;
        } else {
            return {error: true, errorMessage: "File does not exist."}
        }
    }

    getRecords(lines) {
        let leads = {data: []}
        let invalidLeads = {data: []};
        let index;
        let line;
        for (index = 0; index < lines.length; index++) {
            line = lines[index]
            if (line.length === 8) {
                let result = this.batchValidator.validateRecord(line);
                if (result.error) {
                    invalidLeads.data.push({error:true, error_message: `Invalid Column: ${result.error}`, line: index});
                } else {
                    // lead is valid
                    leads.data.push(line);
                } 
            } else {
                invalidLeads.data.push({error: true, line: index, error_message: `Each row should contain 8 columns`});
            }
        }

        return {leads: leads, invalidLeads: invalidLeads};
        // let validRecordCount = 0;
        // let invalidRecordCount = 0;

        // let records = contents.map(record => {
        //     if (record) {
        //         let result = this.batchValidator.validateRecord(record);
        //         if (result.valid) {
        //             validRecordCount++;
        //         } else if (result.error) {
        //             invalidRecordCount++;
        //         }
        //         return {
        //             ...result,
        //             record: record,
        //         }
        //     }
        // });

        // return {
        //     records: records,
        //     validRecordCount: validRecordCount,
        //     invalidRecordCount: invalidRecordCount
        // }
    }

    prepareBatchFile(name, size, lastModified, user_id, len) {
        return {
            file_name: name.toLowerCase(),
            lead_count: len,
            description: '',
            user_id: user_id
        };
    }

    async insertBatchFile(name, size, lastModified, contents, user_id) {
        let batchFile = this.prepareBatchFile(name, size, lastModified, user_id, contents.length);
        let batchFileId = await this.batchFileDao.insertBatchFile(batchFile);
        return batchFileId;
    }

    async insertLeads(leads) {
        return await this.batchLeadDao.insertLeads(leads);
    }

    async uploadLeads(name, size, lastModified, contents, user_id) {
        name = name.toLowerCase().trim();
        let records = this.getRecords(contents);

        if (!name) {
            return errors.invalid_file_name;
        } else if (records.invalidLeads.data.length > 0) {
            return {
                error: true,
                invalid_leads: records.invalidLeads
            }
        }

        // if batch file name exists, return error: filename exists
        if (await this.batchFileDao.exists("file_name", name)) {
            console.log("Batch File Exists", errors.file_name_exists);
            return errors.file_name_exists;
        } else {
            let batchFileId = await this.insertBatchFile(name, size, lastModified, records.leads.data, user_id);
            console.log("The batch id ", batchFileId);
            let result = await this.batchLeadDao.insertLeads(records.leads.data, batchFileId)
            console.log("Insert Leads Result:", result);
            return records;
        }
    }

    async fetchFiles(start, limit) {

        let select = `select file_name, upload_date, first_name, last_name, lead_count from [dbo].[BatchFile] a 
                        INNER JOIN [dbo].[User] b ON(a.user_id = b.id)
                        order by a.upload_date desc
                        offset ${start} rows
                        fetch next ${limit} rows only`;

        let result = await this.batchFileDao.execute(select);
        let totalCount = await this.batchFileDao.getCount();
        
        return {
            count: totalCount.recordset[0].c,
            files: result.recordset,
        }
    }

    async fetchLeads(start, limit) {
        let select = `select * from [dev].[dbo].[BatchLead] a 
                        INNER JOIN [dev].[dbo].[BatchFile] b ON(a.batch_file_id = b.id)
                        order by b.upload_date desc
                        offset ${start} rows
                        fetch next ${limit} rows only`;
        let result = await this.batchFileDao.execute(select);
        let count = await this.batchLeadDao.getCount();

        return {
            leads: result.recordset || [],
            count: count.recordset[0].c
        }
    }

    async searchLeads(searchValue, start, limit) {
        let selectQuery = `select * from [dev].[dbo].[BatchLead] a 
                            INNER JOIN [dev].[dbo].[BatchFile] b ON(a.batch_file_id = b.id)
                            where CONTAINS(a.*, '"${searchValue}*"')
                            order by b.upload_date desc
                            offset ${start} rows
                            fetch next ${limit} rows only`;

        let searchCountQuery = `select count(*) as c from [dev].[dbo].[BatchLead] a 
                            INNER JOIN [dev].[dbo].[BatchFile] b ON(a.batch_file_id = b.id)
                            where CONTAINS(a.*, '"${searchValue}*"')`

               
        console.log(selectQuery)
        let result = await this.batchLeadDao.execute(selectQuery);
        let count = await this.batchLeadDao.execute(searchCountQuery);

        return {
            leads: result.recordset || [],
            count: count.recordset[0].c
        }
    }
}

module.exports = BatchService;