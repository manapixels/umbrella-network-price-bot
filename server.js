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
const discordWebhook = new Discord.WebhookClient('840090366741053490', 'p75U1289Qzik-_mPSLWKv4ExNw-G2Ck3O-vExupmPdw9EeK7-dE8RZpnKPwP4iPG8kUx');

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
    
    if (req['body']) {
        const json = req['body']
        // console.log('req body', json, 'eventType', json['event'])
        if (json['event'] === 'chat:start') {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('New chat')
                .setDescription(json['message']['text'])
                .addFields(
                    { name: 'Name', value: json['visitor']['name'], inline: true },
                    { name: 'Email', value: json['visitor']['email'], inline: true },
                    { name: 'From', value: json['visitor']['country'], inline: true }
                )

            discordWebhook.send('Test', { 
                username: 'some-username',
	            avatarURL: 'https://i.imgur.com/wSTFkRM.png',
                embeds: [embed]
                // embeds: [{
                //     color: '#0099ff',
                //     title: 'New chat',
                //     description: json['message']['text'],
                //     fields: [
                //         { name: 'Name', value: json['visitor']['name'], inline: true },
                //         { name: 'Email', value: json['visitor']['email'], inline: true },
                //         { name: 'From', value: json['visitor']['country'], inline: true }
                //     ]
                // }]
            }).catch(console.error);
        }
    }
    
    // if (!verifySignature(req.body, req.headers['x-tawk-signature'])) {
    //     // verification failed
    //     console.log('failed verification')
    // }
    
    // verification success
    
});
app.listen(process.env.PORT || 3000, function () {
    console.log('App listening now');
});