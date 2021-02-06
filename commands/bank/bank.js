const {
  MessageEmbed,
  Client,
  Message,
  MessageAttachment,
} = require('discord.js');
const { DatabaseManager } = require('@aloshai/mongosha');

const db = DatabaseManager.getDatabase('ECONOMY');
const moment = require('moment');
const code = require('@codedipper/random-code');
const settings = require('../../settings.json');

moment.locale('TR');
const emojis = require('../../emojis.json');

/**
 * @param {Client} client
 * @param {Message} message
 * @param {Array<String>} args
 */
module.exports.run = async (client, message, args) => {
  const acceptmoji = client.emojis.cache.get(emojis.acceptordeny.yesemoji);
  const denymoji = client.emojis.cache.get(emojis.acceptordeny.noemoji);
  const money = client.emojis.cache.get(emojis.other.money);
  const document = client.emojis.cache.get(emojis.other.document);
  const wallet = client.emojis.cache.get(emojis.other.wallet);
  const glass = client.emojis.cache.get(emojis.other.glass);

  if (args[0] === 'oluştur') {
    const check = await db.get(`bank.account.${message.author.id}`);
    if (check) {
      message.react(denymoji);
      message.channel
        .send(
          `Hurra! Zaten bir __banka hesabın__ var **${message.author.username}**! Mevcut bankanı **görmek** için \`bankam\` komutunu kullan.`,
        )
        .then((x) => x.delete({ timeout: 7000 }));
      return;
    }
    const kod = code(6, ['0', '1', '2', '3', '4', '5', '6']);
    await db.set(`bank.infos.${kod}`, {
      Name: message.author.id,
      CardName: 'Kişisel',
      Found: Date.now(),
    });

    await db.set(`bank.account.${message.author.id}`, kod);
    await db.add(`bank.${kod}.funds`, +500);
    message.channel
      .send(
        `Hehe! __Banka hesabını__ oluşturdum **${message.author.username}**! Artık bankana **\`${kod}\`** ile erişebilirsin. Yaklaşık **500 SC** de hesabına ekledim.`,
      )
      .then((x) => x.delete({ timeout: 7000 }));
    message.react(acceptmoji);
    return;
  }

  if (!args[0]) {
    const membercode = await db.get(`bank.account.${message.author.id}`);
    const infoa = await db.get(`bank.infos.${membercode}`);
    const bal = await db.get(`bank.${membercode}.funds`);
    if (!infoa) {
      message.channel
        .send(
          `Hurra! Bir __banka hesabı kodu__ girmelisin **${message.author.username}**! Eğer bir banka hesabı **oluşturmak** istersen **\`banka oluştur\`** komutunu kullanman yeterli.`,
        )
        .then((x) => x.delete({ timeout: 7000 }));
      message.react(denymoji);
      return;
    }
    message.channel
      .send(
        `${document} **Hesap Sahibi:** <@${
          infoa.Name
        }> \n${wallet} **Hesabın Türü:** ${
          infoa.CardName
        } \n${money} **Hesabın Bakiyesi:** \`${bal}\` \n${glass} **Hesap Numarası:** \`${membercode}\` \n:stopwatch: **Açılış Tarihi:** ${moment(
          infoa.Found,
        ).format('DD MMMM YYYY (HH:mm:ss)')}`,
      )
      .then((x) => x.delete({ timeout: 17000 }));
    message.react(acceptmoji);
    return;
  }

  const arg = message.mentions.members.first();
  if (arg) {
    const membercode = await db.get(`bank.account.${arg.id}`);
    const fetch = await db.get(`bank.${membercode}`);
    const info = await db.get(`bank.infos.${membercode}`);
    if (!info || !fetch)
      return message.channel
        .send(
          `Tüh ya! Girdiğin kişinin banka hesabını bulamadım **${message.author.username}**! Bir banka hesabı **oluşturmadıysan** lütfen **\`banka oluştur\`** komutunu kullanman yeterli.`,
        )
        .then((x) => x.delete({ timeout: 7000 }));
    message.react(acceptmoji);
    message.channel
      .send(
        `${document} **Hesap Sahibi:** <@${
          info.Name
        }> \n${wallet} **Hesabın Türü:** ${
          info.CardName
        } \n${money} **Hesabın Bakiyesi:** \`${
          fetch.funds
        }\` \n${glass} **Hesap Numarası:** \`${membercode}\` \n:stopwatch: **Açılış Tarihi:** ${moment(
          info.Found,
        ).format('DD MMMM YYYY (HH:mm:ss)')}`,
      )
      .then((x) => x.delete({ timeout: 17000 }));
    return;
  }

  if (!arg) {
    const fetchiki = await db.get(`bank.${args[0]}`);
    if (!fetchiki) {
      message.channel
        .send(
          `Tüh ya! Girdiğin \`${args[0]}\` banka hesabı numarasıyla ilgili bir hesap bulunamadı **${message.author.username}**! Bir banka hesabı **oluşturmadıysan** lütfen **\`banka oluştur\`** komutunu kullanman yeterli.`,
        )
        .then((x) => x.delete({ timeout: 7000 }));
      message.react(denymoji);
      return;
    }

    const info = await db.get(`bank.infos.${args[0]}`);
    const fetch = await db.get(`bank.${args[0]}`);
    message.react(acceptmoji);
    message.channel
      .send(
        `${document} **Hesap Sahibi:** <@${
          info.Name
        }> \n${wallet} **Hesabın Türü:** ${
          info.CardName
        } \n${money} **Hesabın Bakiyesi:** \`${
          fetch.funds
        }\` \n${glass} **Hesap Numarası:** \`${
          args[0]
        }\` \n:stopwatch: **Açılış Tarihi:** ${moment(info.Found).format(
          'DD MMMM YYYY (HH:mm:ss)',
        )}`,
      )
      .then((x) => x.delete({ timeout: 17000 }));
  }
};

module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['banka'],
};

module.exports.help = {
  name: 'banka',
  help: 'Banka oluşturmak, bakiyeyi görüntülemek ve dahası.',
  usage: 'banka [oluştur/@üye/<kod>]',
  category: 'Bank',
};
