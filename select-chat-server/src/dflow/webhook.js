const {WebhookClient} = require('dialogflow-fulfillment');
const functions = require('firebase-functions');

/**
 * Chatbot webhook to fulfill intentions from dialogflow
 */
module.exports.dialogflowWebhook = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({request, response});
    console.log(JSON.stringify(request.body));
    const result = request.body.queryResult;
    
});