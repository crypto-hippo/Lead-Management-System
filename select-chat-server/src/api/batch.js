const express = require('express')
const BatchService = require('../services/BatchService');
const router = express.Router()
const csv = require('csv-express');
const errors = require('../errors')

router.use((req, res, next) => {
    console.log("batch middleware");
    let sessionKeys = Object.keys(req.session);

    if (req.session.user) {
        // if (sessionKeys.indexOf('batchService') === -1) {
        // }
        req.session.batchService = new BatchService();
        next();
    } else {
        res.send(errors.no_auth);
    }
})

router.post('/upload', function (req, res) {  
    const {name, size, lastModified, contents} = req.body;
    req.session.batchService.uploadLeads(name, size, lastModified, contents, req.session.user.id).then(result => {
        res.send(result);
    })
})

router.post('/fetch/files', function(req, res) {
    let {start, limit} = req.body;
    console.log(start, limit)
    console.log("Fetching files");
    req.session.batchService.fetchFiles(start, limit).then(response => {
        res.send(response);
    }).catch(err => {
        console.error("error fetching files");
    })
})

router.get('/download/:fileName', function(req, res) {
    req.session.batchService.createTempCsvForDownload(req.params.fileName).then(result => {
        if (result.error) {
            res.send(result);
        } else {
            res.csv(result.data);
        }
    }).catch(error => {
        console.error(error)
    })
});

router.post('/fetch/leads', function(req, res) {
    const {start, limit} = req.body;
    console.log(start, limit)
    req.session.batchService.fetchLeads(start, limit).then(result => {
        // console.log(result)
        res.send(result);
    }).catch(error => {
        console.error(error);
    })
});

router.post('/search/leads', function(req, res) {
    let {start, limit, search} = req.body;
    req.session.batchService.searchLeads(search, start, limit).then(resp => {
        res.send(resp)
    }).catch(error => {
        res.send(error);
    });
})

module.exports = router;
