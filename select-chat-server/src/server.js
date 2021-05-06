const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const cors = require("cors");
let session = require('express-session');
const batch = require('./api/batch');
const auth = require('./api/auth');
const campaign = require('./api/campaign')
const app = express();

const {Datastore} = require('@google-cloud/datastore');
const DatastoreStore = require('@google-cloud/connect-datastore')(session);

app.disable('x-powered-by')

app.use(session({
    store: new DatastoreStore({
      kind: 'express-sessions',
  
      // Optional: expire the session after this many milliseconds.
      // note: datastore does not automatically delete all expired sessions
      // you may want to run separate cleanup requests to remove expired sessions
      // 0 means do not expire
      expirationMs: 0,
  
      dataset: new Datastore({
  
        // For convenience, @google-cloud/datastore automatically looks for the
        // GCLOUD_PROJECT environment variable. Or you can explicitly pass in a
        // project ID here:
        projectId: process.env.GCLOUD_PROJECT,
  
        // For convenience, @google-cloud/datastore automatically looks for the
        // GOOGLE_APPLICATION_CREDENTIALS environment variable. Or you can
        // explicitly pass in that path to your key file here:
        keyFilename: process.env.GOOGLE_CREDS
      })
    }),
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
  }));
  
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    console.log("setting req headers");

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/batch', batch);
app.use('/auth', auth);
app.use('/campaign', campaign);

app.use(express.static(path.join(__dirname, '../', 'build')));

app.use((req, res) => {
    console.log("default route. Send index.html")
    res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
});

// function defaultRoute(req, res) {
//     
// }

app.listen(8080);

module.exports = app;