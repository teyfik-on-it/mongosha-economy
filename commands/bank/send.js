const { MessageEmbed, Client, Message } = require('discord.js');
const settings = require('../../settings.json');
const { DatabaseManager } = require('@aloshai/mongosha');

const db = DatabaseManager.getDatabase('ECONOMY');
const moment = require('moment');
const ms = require('parse-ms');
const emojis = require('../../emojis.json');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array<String>} args
 */
module.exports.run = async (client, message, args) => {
  const acceptmoji = client.emojis.cache.get(emojis.acceptordeny.yesemoji);
  const denymoji = client.emojis.cache.get(emojis.acceptordeny.noemoji);
  const banknotte = client.emojis.cache.get(emojis.other.money);

  const title = await db.get(
    `bank.properties.${message.author.id}.titles.list`,
  );
  if (title) {
    var onaykontrol = Object.values(title);
  }
  if (!title) {
    var onaykontrol = [];
  }
  const onay = onaykontrol.find((onay) => onay == 'AABF');

  if (!onay) {
    const timeout = 600;
    const bump = await db.get(`cooldowns.send.${message.author.id}`);
    if (bump !== null && timeout - (Date.now() - bump) > 0) {
      const time = ms(timeout - (Date.now() - bump));
      return message.channel.send(
        `${banknotte} Hurra! Bu kadar hızlı para transferi yapamazsın **${message.author.username}**! Lütfen ${time.hours} saat, ${time.minutes} dakika, ${time.seconds} saniye bekle. \n**Onaylı Satıcı** bu kısıtlamaların hepsini kaldırır...`,
      );
    }
  }

  const member = message.mentions.members.first();
  if (!member)
    return message.channel.send(
      `Hurra! Bir kişiyi etiketlemelisin **${message.author.username}**!`,
    );

  if (member.user.bot)
    return message.channel.send(
      `Hurra! Bir bota para gönderemezsin **${message.author.username}**!`,
    );
  if (member.id == message.author.id)
    return message.channel.send(
      `Hurra! Kendine para gönderemezsin **${message.author.username}**!`,
    );

  const membercode = await db.get(`bank.account.${member.id}`);
  const membercodeyourself = await db.get(`bank.account.${message.author.id}`);
  if (!membercode) {
    message.channel.send(
      `Tüh ya! Para göndermeye çalıştığın kişinin bir banka hesabı yok **${message.author.username}**!`,
    );
    message.react(denymoji);
    return;
  }

  if (!membercodeyourself) {
    message.channel.send(
      `Tüh ya! Para göndermeye çalışıyorsun ama senin banka hesabın yok ki **${message.author.username}**!`,
    );
    message.react(denymoji);
    return;
  }

  const balance = await db.get(`bank.${membercodeyourself}.funds`);
  if (!args[1]) {
    message.channel.send(
      `Hurra! Göndermek istediğin paranın miktarını girmedin ${message.author.username}`,
    );
    message.react(denymoji);
    return;
  }
  if (isNaN(args[1])) {
    message.channel.send(
      `Hurra! Göndermek istediğin parayı sayı cinsinden yaz ${message.author.username}`,
    );
    message.react(denymoji);
    return;
  }
  if (args[1] > balance) {
    message.channel
      .send(
        `Höh! Bankanda şu an **\`${balance}\` SC** bulunuyor **${message.author.username}**! Senin girdiğin tutar ise **${args[1]}**.`,
      )
      .then((x) => x.delete({ timeout: 5000 }));
    message.react(denymoji);
    return;
  }

  if (!onay) {
    if (args[1] > 50000)
      await message.channel
        .send(
          `Höh! Bu kadar fazla para gönderimini onaylamam mümkün değil **${message.author.username}**! \n\`50.000\` ve daha fazla olan gönderimler için **Onaylı Satıcı** durumunu almak zorunludur.`,
        )
        .then((x) => x.delete({ timeout: 5000 }));
    message.react(denymoji);
    return;
  }

  await db.add(`bank.${membercode}.funds`, +args[1]);
  await db.add(`bank.${membercodeyourself}.funds`, -args[1]);
  message.react(acceptmoji);
  message.channel.send(
    `${banknotte} **${message.author.username}** üyesi **\`${args[1]}\` SC**'yi **${member.user.username}** üyesine gönderdi.`,
  );
  await db.set(`cooldowns.send.${message.author.id}`, Date.now());
};
module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['gönder', 'send'],
};

module.exports.help = {
  name: 'gönder',
  help: 'Etiketlenen kişiye para yollamak için.',
  usage: 'gönder [@kişi] [<para tutarı>]',
  category: 'Bank',
};
