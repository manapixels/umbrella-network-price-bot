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
const discordWebhook = new Discord.WebhookClient('840026920695627826', 'gCoEpnZkLGd1Zv_D-5WSVrfwDbCrR1mBHffu39RFD4dk-_mBQNe-BOeFunostyYJaezp');

const stripeToDiscordWebhook = new Discord.WebhookClient('844038845591060490', '_q35HQeY3ozplNjA9FiAzdc8a1B9D8ZlEUZIiJcui130M6aGAyZGDomFY4jQ19FBXA0Q');
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

const mask = string => string.replace(
    /(..)(.{1,2})(?=.*@)/g,
    (_, a, b) => a + '*'.repeat(b.length)
);

app.post('/webhooks/stripe', function (req, res, next) {
    
    if (req['body']) {
        const json = req['body']

        logger.info(json)
        if (json && json['data'] && json['data']['object'] && json['data']['object']) {
            const obj = json['data']['object']

            const embed = new Discord.MessageEmbed().setColor('#0099ff')

            // Successful Charge
            if (obj['object'] === 'charge' && json['type'] === 'charge.succeeded') {
                embed.setTitle('Payment Success')
                    .setDescription(`Someone paid $${obj['amount']} (${obj['currency']})`)
            }
            // Successful Top-up
            if (obj['object'] === 'topup' && json['type'] === 'topup.succeeded') {
                embed.setTitle('New Top-Up')
                    .setDescription(`Someone topped-up $${obj['amount']} (${obj['currency']})`)
            }

            // Who paid
            if (obj['billing_details']) {
                embed.addFields(
                    { name: 'Name', value: obj['billing_details']['name'] ? obj['billing_details']['name'] : "", inline: true },
                    { name: 'Email', value: obj['billing_details']['email'] ? mask(obj['billing_details']['email']) : "", inline: true }
                )
            }

            stripeToDiscordWebhook.send({ 
                username: 'Stripe',
                avatarURL: 'https://i.imgur.com/WNIZqdz.png',
                embeds: [embed]
            }).catch(console.error);
        }
    }

    res.sendStatus(200);
    
    // if (!verifySignature(req.body, req.headers['x-tawk-signature'])) {
    //     // verification failed
    //     console.log('failed verification')
    // }
    
    // verification success
    
});

app.post('/webhooks/tawkto', function (req, res, next) {
    
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

            discordWebhook.send({ 
                username: 'Selfi Support',
	            avatarURL: 'https://i.imgur.com/c381fE2.png',
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

    res.sendStatus(200);
    
    // if (!verifySignature(req.body, req.headers['x-tawk-signature'])) {
    //     // verification failed
    //     console.log('failed verification')
    // }
    
    // verification success
    
});
app.listen(process.env.PORT || 3000, function () {
    console.log('App listening now');
});