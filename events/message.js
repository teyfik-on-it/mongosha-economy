const { Message } = require('discord.js');
const settings = require('../settings.json');

/**
 * @param {Message} message
 */
module.exports = async (message) => {
  const { client } = message;
  if (message.author.bot) return;
  if (!message.content.startsWith(settings.botSettings.prefix)) return;
  const command = message.content
    .split(' ')[0]
    .slice(settings.botSettings.prefix.length);
  const params = message.content.split(' ').slice(1);
  const perms = elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (cmd.conf.enabled === false) {
      if (
        !ayarlar.sahip.includes(message.author.id) &&
        !ayarlar.sahip.includes(message.author.id)
      ) {
        message.channel.send(
          `[+] ERROR [+] \n- Missing Permission: Super User. \n- Status: Command halted.`,
          { code: 'yaml' },
        );
        return;
      }
    }
    if (cmd.conf.permLevel === 1) {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) {
        message.channel.send(
          `[+] ERROR [+] \n- Missing Permission: Manage Messages. \n- Status: Command halted.`,
          { code: 'yaml' },
        );
        return;
      }
    }
    if (cmd.conf.permLevel === 2) {
      if (!message.member.hasPermission('KICK_MEMBERS')) {
        message.channel.send(
          `[+] ERROR [+] \n- Missing Permission: Kick Members. \n- Status: Command halted.`,
          { code: 'yaml' },
        );
        return;
      }
    }
    if (cmd.conf.permLevel === 3) {
      if (!message.member.hasPermission('BAN_MEMBERS')) {
        message.channel.send(
          `[+] ERROR [+] \n- Missing Permission: Ban Members. \n- Status: Command halted.`,
          { code: 'yaml' },
        );
        return;
      }
    }
    if (cmd.conf.permLevel === 4) {
      if (!message.member.hasPermission('ADMINISTRATOR')) {
        message.channel.send(
          `[+] ERROR [+] \n- Missing Permission: Administrator. \n- Status: Command halted.`,
          { code: 'yaml' },
        );
        return;
      }
    }
    if (cmd.conf.permLevel === 5) {
      if (!ayarlar.sahip.includes(message.author.id)) {
        message.channel.send(
          `[+] ERROR [+] \n- Missing Permission: Super User. \n- Status: Command halted.`,
          { code: 'yaml' },
        );
        return;
      }
    }
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
};

function elevation(message) {
  if (!message.guild) return;
  let permlvl = 0;
  if (message.member.hasPermission('BAN_MEMBERS')) permlvl = 2;
  if (message.member.hasPermission('ADMINISTRATOR')) permlvl = 3;
  if (message.author.id === settings.botSettings.owners) permlvl = 4;
  return permlvl;
}
