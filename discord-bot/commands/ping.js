/*
 *	COMMAND FILE FOR PING
 *	Test command to see if the bot is working
 */
const data = require('./../../lib/data.js');
module.exports = {
    name: 'ping',
    description: 'It pings',
    aliases: ['ping!', 'pong'],

    execute(message, args) {
        message.channel.send('Pong.');
    }
};