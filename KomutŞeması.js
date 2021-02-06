const { MessageEmbed, Client, Message } = require('discord.js');
const { DatabaseManager } = require('@aloshai/mongosha');
const settings = require('../../settings.json');

const db = DatabaseManager.getDatabase('ECONOMY');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array<String>} args
 */
module.exports.run = async (client, message, args) => {};
module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [''],
};

module.exports.help = {
  name: '',
};
