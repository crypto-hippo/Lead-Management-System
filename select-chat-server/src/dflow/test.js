const admin = require("firebase-admin");
const functions = require('firebase-functions');
const serviceAccount = require("../sc-firebase.json");
const cors = require('cors');
const {SessionsClient} = require('dialogflow');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://selectchat.firebaseio.com"
});

module.exports.dialogflowGateway = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        const {queryInput, sessionId} = request.body;
        const sessionClient = new SessionsClient({credentials: serviceAccount})
        const session = sessionClient.sessionPath('fireship-lessions', sessionId)
        const responses = await sessionClient.detectIntent({session, queryInput});
        const result = responses[0].queryResult;
        response.send(result);
    });
});