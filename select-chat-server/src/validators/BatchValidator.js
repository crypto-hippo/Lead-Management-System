
class BatchValidator {

    constructor() {
        this.nameRegex = /^([a-zA-Z_-]){3,10}$/
        this.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.numbersRegex = /^\d+$/;
    }


    validateName(first, last) {
        return this.nameRegex.test(first) && this.nameRegex.test(last);
    }

    validateAccountID(accountId) {
        return accountId.length <= 10;
    } 

    validateLeadID(leadId) {
        return this.numbersRegex.test(leadId) && leadId.length <= 10;
    }

    validateEmail(email) {
        return this.emailRegex.test(email.toLowerCase());
    }

    validatePhone(phone) {
        
        let phoneArgs = phone.split("-");
        phoneArgs.forEach(nums => {
            if (isNaN(parseInt(nums)) ) {
                return false;    
            }
        })

        return true;
    }

    validateCampaignId(id) {
        return this.numbersRegex.test(id);
    }

    validateRecord(record) {
        let result = {};

        if (this.validateName(record[0], record[1])) {
            if (this.validateAccountID(record[2])) {
                if (this.validateLeadID(record[3])) {
                    if (this.validateCampaignId(record[4])) {
                        if (this.validateEmail(record[5])) {
                            if (this.validatePhone(record[6])) {
                                if (this.validateEmail(record[7])) {
                                    result.valid = true;
                                } else {
                                    result.error = "agent";
                                }
                            } else {
                                result.error = "phone";
                            }
                        } else {
                            result.error = "email";
                        }
                    } else {
                        result.error = "selectchat_campaign_id";
                    }
                } else {
                    result.error = "selectcare_lead_id";
                }
            } else {
                result.error = "selectcare_account_id";
            }
        } else {
            result.error = "name"
        }

        return result;
    }
}
module.exports = BatchValidator;