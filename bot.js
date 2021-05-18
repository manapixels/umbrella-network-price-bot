// const { google } = require('googleapis')
const logger = require('winston')
const Discord = require('discord.js')

require('dotenv').config()

// const googleAccounts = google.analytics('v3')
// const googleAnalytics = google.analyticsreporting('v4')

// const clientID = process.env.CLIENT_ID
// const clientSecret = process.env.CLIENT_SECRET
// const oauth2Client = new google.auth.OAuth2(clientID, clientSecret)
// const url = oauth2Client.generateAuthUrl({
// 	access_type: 'online',
// 	scope: 'https://www.googleapis.com/auth/analytics.readonly'
// })
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

// const {client_secret, client_id, redirect_uris} = credentials.installed;
// const oAuth2Client = new google.auth.OAuth2(
//     client_id, client_secret, redirect_uris[0]);

// // Check if we have previously stored a token.
// fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
// });


logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot


const client = new Discord.Client();

client.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ' + client.user.username);
});

client.on("message", message => {
    if (message.content === "hey") {
        message.reply("hi there")
    }
})

client.login(process.env.BOT_TOKEN)

//
// Pull Google Analytics
//
function getData() {
    googleAnalytics.reports.batchGet(
        {
            headers: {
                'Content-Type': 'application/json'
            },
            auth: oauth2Client,
            resource: {
                reportRequests: [{
                    viewId: "ga:206687613",
                    metrics: [
                        {
                            expression: "rt:activeUsers"
                        }
                    ]
                }]
            }
        },
        (err, data) => {
            if (err) {
                console.error('Error: ' + err)
            } else if (data) {
                logger.info("data: ", data)
                // let views = []
                // let max = 0
                // data.reports[0].data.rows.forEach(view => {
                //     views.push(view.metrics[0].values[0])
                //     if (parseInt(view.metrics[0].values[0]) > parseInt(max)) max = view.metrics[0].values[0]
                // })
                // res.send([views, max])
            }
        }
    )
    // google.analytics('v3').data().realtime().get({
    //     auth: process.env.GOOGLE_API_SECRET,
    //     ids: "ga:206687613",
    //     metrics: "rt:activeUsers"
    // })
    // .then(res => {
    //     console.log(`GA Data: `, res);
    // })
    // .catch(error => {
    //     console.error(error);
    // })
    // logger.info(result);
}
// getData()
// fetch(`${GA_API}/data/realtime`, {
//     method: 'GET', // or 'PUT'
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//   .then(response => response.json())

// Configure logger settings


// bot.on('message', function (user, userID, channelID, message, evt) {
//     // Our bot needs to know if it will execute a command
//     // It will listen for messages that will start with `!`
//     if (message.substring(0, 1) == '!') {
//         var args = message.substring(1).split(' ');
//         var cmd = args[0];
       
//         args = args.splice(1);
//         switch(cmd) {
//             // !ping
//             case 'ping':
//                 bot.sendMessage({
//                     to: channelID,
//                     message: 'Pong!'
//                 });
//             break;
//             // Just add any case commands if you want to..
//          }
//      }
// });