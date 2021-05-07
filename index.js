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