const express = require('express')
const authService = require('../services/AuthService');
const userService = require('../services/UserService');

const router = express.Router()

router.post('/google', (req, res) => { 
    try {
        const {id_token, givenName, familyName, email, imageUrl} = req.body;
        authService.authenticateGoogle(id_token).then(result => {

            userService.insertIfNotExists(givenName, familyName, email, imageUrl).then(result => {
                req.session.id_token = id_token;
                req.session.user = result.user;
                console.log(req.session)
                res.send({
                    user: result.user,
                    stored: result.stored,
                    id_token: id_token,
                });
            })
        })
        .catch(err => {
            res.send({error: err})
        });
    } catch (err) {
        console.log("Exception Encountered", err);
        res.send({error: "Cannot handle request"});
    }
})

router.get('/google/authenticated', (req, res) => {
    let id_token = req.session.id_token;
    let noAuth = {authenticated: false};

    if (id_token) {
        authService.authenticateGoogle(id_token).then(result => {
            res.send({authenticated: true})
        })
        .catch(err => {
            res.send(noAuth);
        });
    } else {
        res.send(noAuth);
    }
})

router.get('/google/logout', (req, res) => {
    try {
        req.session.destroy();
        res.send({success: true});
    } catch (err) {
        res.send({error: "Cannot handle request"});
        console.log(err);
    }
});

module.exports = router;
