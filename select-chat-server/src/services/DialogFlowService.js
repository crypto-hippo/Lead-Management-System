const admin = require('firebase-admin');
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const TwilioService = require('./TwilioService');
const SendGridService = require('./SendGridService');

class DialogFlowService {

    constructor() {
        this.projectId = 'agent-name-ifxhol';
        this.serviceAccount = require('../../dflow-agent.json');
        this.twilioService = new TwilioService();
        this.sendGridService = new SendGridService();
    }

    async sendMessage(message) {
        console.log("[+] Sending message to dialogflow")

        // A unique identifier for the given session
        const sessionId = uuid.v4();
      
        // Create a new session
        const sessionClient = new dialogflow.SessionsClient({credentials: this.serviceAccount});
        const sessionPath = sessionClient.sessionPath(this.projectId, sessionId);
      
        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
                    text: {
                    // The query to send to the dialogflow agent
                    text: message.trim(),
                    // The language used by the client (en-US)
                    languageCode: 'en-US',
                },
            },
        };
      
        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
            console.log(`  Intent: ${result.intent.displayName}`);
        } else {
            console.log(`No intent matched.`);
        }

        // on response from dialogflow, send sms and email to test
        this.twilioService.sendSms(`Response from dialogflow: ${result.fulfillmentText}`, '8283332747');
        this.sendGridService.sendEmail(result.fulfillmentText, 'dylan.dannenhauer@gmail.com', 'Agent Email Here');
        return result;
    }
}

module.exports = DialogFlowService;