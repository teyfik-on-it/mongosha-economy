const { MessageEmbed, Client, Message } = require('discord.js');
const { DatabaseManager } = require('@aloshai/mongosha');
const settings = require('../../settings.json');

const db = DatabaseManager.getDatabase('ECONOMY');
const emojis = require('../../emojis.json');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array<String>} args
 */
module.exports.run = async (client, message, args) => {
  const check = await db.get(`bank.account.${message.author.id}`);
  if (!check) {
    message.channel.send(
      `Tüh ya! Bu eylemi gerçekleştirmek için bir banka hesabına sahip olmalısın **${message.author.username}**!`,
    );
    return;
  }

  const wallet = client.emojis.cache.get(emojis.other.wallet);
  const acceptmoji = client.emojis.cache.get(emojis.acceptordeny.yesemoji);
  const denymoji = client.emojis.cache.get(emojis.acceptordeny.noemoji);

  const membercode = await db.get(`bank.account.${message.author.id}`);
  if (!membercode) {
    await message.channel
      .send(
        `Bir bankan yok! Lütfen \`banka oluştur\` komutuyla bankanı oluştur.`,
      )
      .then((x) => x.delete({ timeout: 3000 }));
    message.react(denymoji);
    return;
  }

  message.channel
    .send(
      `${wallet} **${message.author.username}** senin adına kayıtlı banka hesabının kodu \`${membercode}\``,
    )
    .then((x) => x.delete({ timeout: 7000 }));
  message.react(acceptmoji);
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['whats-my-bank', 'bankam'],
};

module.exports.help = {
  name: 'bankam',
  help: 'Banka numaranızı öğrenmek için.',
  usage: 'bankam',
  category: 'Bank',
};
