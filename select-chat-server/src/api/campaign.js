const express = require('express')
const CampaignService = require('../services/CampaignService');
const router = express.Router()
const csv = require('csv-express');
const errors = require('../errors')
const uuid = require('uuid');
const admin = require("firebase-admin");
const serviceAccount = require("../../dflow-agent.json");
const DialogFlowService = require('../services/DialogFlowService');

router.use((req, res, next) => {
    console.log("batch middleware");
    let sessionKeys = Object.keys(req.session);

    if (req.session.user) {
        // if (sessionKeys.indexOf('batchService') === -1) {
        // }
        req.session.campaignService = new CampaignService();
        next();
    } else {
        res.send(errors.no_auth);
    }
})

router.post("/fetch", function(req, res) {
    let {start, limit} = req.body;
    console.log("nothing")
    req.session.campaignService.fetchCampaigns(start, limit).then(result => {
        console.log(result)
        res.send(result);
    }).catch(error => {
        console.log(error);
    });
});

router.post("/save", function(req, res) {
    let {name, type, method, description} = req.body;

    if (!name || !type || !method) {
        res.send(errors.invalid_campaign);
    }
    
    req.session.campaignService.saveCampaign(name, type, method, description).then(result => {
        console.log(result)
        res.send(result);
    });
});

router.post('/update', function(req, res) {
    let campaign = req.body.campaign;
    if (campaign) {
        req.session.campaignService.updateCampaign(campaign).then(result => {
           res.send(result); 
        }).catch(error => {
            return errors.update_campaign;
        })
    } else {
        return errors.campaign_required
    }
})

router.post('/message/send', async function(req, res) {
    let message = req.body.message;
    if (message) {
        let dflow = new DialogFlowService();
        dflow.sendMessage(message).then(result => {
            res.send(result);
        }).catch(error => {
            res.send(errors.failed_dflow_message);
        })
    } else {
        res.send(errors.invalid_dflow_message);
    }
    
// const functions = require('firebase-functions');
// const cors = require('cors');



// module.exports.dialogflowGateway = functions.https.onRequest((request, response) => {
//     cors(request, response, async () => {
//         const {queryInput, sessionId} = request.body;
//         const sessionClient = new SessionsClient({credentials: serviceAccount})
//         const session = sessionClient.sessionPath('fireship-lessions', sessionId)
//         const responses = await sessionClient.detectIntent({session, queryInput});
//         const result = responses[0].queryResult;
//         response.send(result);
//     });
// });
})

module.exports = router;


