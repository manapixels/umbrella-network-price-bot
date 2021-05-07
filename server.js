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
    console.log(body, signature)
    const digest = crypto
        .createHmac('sha1', process.env.TAWK_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
    return signature === digest;
};

app.post('/webhooks', function (req, res, next) {
    console.log(req.payload, res.payload)
    if (!verifySignature(req.rawBody, req.headers['x-tawk-signature'])) {
        // verification failed
    }
    
    tawkWebhook.send("You were mentioned!");
    // verification success
});
app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});