require('dotenv').config()

// Configure logger settings

var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

//
// Initialize Discord Bot
//
var Discord = require('discord.js');
const tawkWebhook = new Discord.WebhookClient('840026920695627826', 'gCoEpnZkLGd1Zv_D-5WSVrfwDbCrR1mBHffu39RFD4dk-_mBQNe-BOeFunostyYJaezp');

//
// Dependencies
//
const express = require('express');
const app = express();
app.use(express.json())
const crypto = require('crypto');

function verifySignature (body, signature) {
    const digest = crypto
        .createHmac('sha1', process.env.TAWK_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
    return signature === digest;
};

app.post('/webhooks', function (req, res, next) {
    
    if (req.body) {
        const json = req.body
        console.log('req body', req.body, 'eventType', json.event)
        if (json.event === 'chat:start') {
            console.log('Chat started by ' + json.visitor && json.visitor.name + ' from ' + json.visitor && json.visitor.country)
            console.log('Message: ', json.message && json.message.text)
        }
    }
    
    if (!verifySignature(req.body, req.headers['x-tawk-signature'])) {
        // verification failed
        console.log('failed verification')
    }
    
    // verification success
    console.log('verification success');
    tawkWebhook.send("You were mentioned!");
});
app.listen(process.env.PORT || 3000, function () {
    console.log('App listening now');
});