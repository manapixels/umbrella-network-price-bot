require('dotenv').config()

// Configure logger settings

var logger = require('winston');
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot

var Discord = require('discord.js');
const tawkWebhook = new Discord.WebhookClient('840026920695627826', 'gCoEpnZkLGd1Zv_D-5WSVrfwDbCrR1mBHffu39RFD4dk-_mBQNe-BOeFunostyYJaezp');

const express = require('express');
const app = express();
const crypto = require('crypto');

function verifySignature (body, signature) {
    const digest = crypto
        .createHmac('sha1', process.env.TAWK_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
    console.log('digest', digest, 'signature', signature)
    return signature === digest;
};

app.post('/webhooks', function (req, res, next) {
    console.log('req body', req.body)
    if (!verifySignature(req.rawBody, req.headers['x-tawk-signature'])) {
        // verification failed
        console.log('failed verification')
    }
    
    // verification success
    console.log('verification success');
    tawkWebhook.send("You were mentioned!");
});
app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});