const { MessageEmbed, Client, Message } = require('discord.js');
const { DatabaseManager } = require('@aloshai/mongosha');
const settings = require('../../settings.json');
const emojis = require('../../emojis.json');

const db = DatabaseManager.getDatabase('ECONOMY');

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
  const member = message.mentions.members.first() || message.member;
  const rings = await db.get(`bank.properties.${member.id}.rings`);
  const titles = await db.get(`bank.properties.${member.id}.titles.list`);

  const onayfetch = await db.get(`bank.properties.${member.id}.titles.list`);

  if (onayfetch) {
    var onaykontrol = Object.values(onayfetch);
  }
  if (!onayfetch) {
    var onaykontrol = [];
  }
  const onay = onaykontrol.find((onay) => onay == 'AABF');

  let onaythings;
  if (onay) onaythings = 'GREEN';
  if (!onay) onaythings = 'BLUE';

  let onaymessages;
  if (onay)
    onaymessages =
      'Bu üye **Onaylı Satıcı** unvanına sahiptir. Herkesten daha fazla para gönderebilir, daha hızlı para gönderir ve zor durumlarda kalırsa **Kraliyet Bankasından** destek alabilir.';
  if (!onay)
    onaymessages =
      'Bu üyenin çok önemli bir unvanı mevcut değil. Herkes gibi yavaş ve daha az miktarda para gönderir. **Kraliyet Bankasından** herhangi bir para çekemez veya isteyemez.';

  const lv1 = client.emojis.cache.get(emojis.rings.lv1);
  const lv2 = client.emojis.cache.get(emojis.rings.lv2);
  const lv3 = client.emojis.cache.get(emojis.rings.lv3);
  const lv4 = client.emojis.cache.get(emojis.rings.lv4);
  const lv5 = client.emojis.cache.get(emojis.rings.lv5);
  const lv6 = client.emojis.cache.get(emojis.rings.lv6);
  const lv7 = client.emojis.cache.get(emojis.rings.lv7);
  const lv8 = client.emojis.cache.get(emojis.rings.lv8);
  const lv9 = client.emojis.cache.get(emojis.rings.lv9);
  const lv10 = client.emojis.cache.get(emojis.rings.lv10);
  const title1 = client.emojis.cache.get(emojis.titles.title1);
  const title2 = client.emojis.cache.get(emojis.titles.title2);
  const title3 = client.emojis.cache.get(emojis.titles.title3);
  const title4 = client.emojis.cache.get(emojis.titles.title4);
  const title5 = client.emojis.cache.get(emojis.titles.title5);

  if (rings) {
    var yüzükler =
      rings.length > 0
        ? rings
            .map(
              (value, index) =>
                `\`${index + 1}.\` \`${value}\` ${value
                  .replace(/AAAA/g, `${lv1} Tahta Alaşım Yüzük`)
                  .replace(/AAAB/g, `${lv2} Bakır Alaşım Yüzük`)
                  .replace(
                    /AAAC/g,
                    `${lv3} Pirinç Karışımlı Bakır Alaşım Yüzük`,
                  )
                  .replace(/AAAD/g, `${lv4} Demir Has Yüzük`)
                  .replace(/AAAE/g, `${lv5} Platin Kaplama Yüzük`)
                  .replace(/AAAF/g, `${lv6} Yaldızlı Yüzük`)
                  .replace(/AAAG/g, `${lv7} Elmas Yüzük`)
                  .replace(
                    /AAAH/g,
                    `${lv8} Fasilyus'un Kırmızı Nahçıvan Yüzüğü`,
                  )
                  .replace(/AAAI/g, `${lv9} Konfiçyus'un Bilge Yüzüğü`)
                  .replace(/AABA/g, `${lv10} Fazilet'in Safir Yüzüğü`)}`,
            )
            .join(`\n`)
        : 'Yüzük yok!';
  }
  if (!rings) {
    var yüzükler = 'Hiçbir yüzüğü yok.';
  }
  if (titles) {
    var title =
      titles.length > 0
        ? titles
            .map(
              (value, index) =>
                `\`${index + 1}.\` \`${value}\` ${value
                  .replace(/AABB/g, `${title1} Tecrübeli Oyuncu`)
                  .replace(/AABC/g, `${title2} Hırs Delisi`)
                  .replace(/AABD/g, `${title3} Katil Meddhaun`)
                  .replace(/AABE/g, `${title4} Sevgili Circi`)
                  .replace(/AABF/g, `${title5} **Onaylı Satıcı**`)}`,
            )
            .join(`\n`)
        : 'Unvan yok!';
  }
  if (!titles) {
    var title = 'Hiçbir unvanı yok.';
  }

  const embed = new MessageEmbed()
    .setDescription(
      `${onaymessages} \n\n**Sahip Olduğu Yüzükler** \n${yüzükler} \n\n**Sahip Olduğu Unvanlar** \n${title}`,
    )
    .setColor(onaythings);

  message.channel.send(embed);
};
module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['env', 'inv'],
};

module.exports.help = {
  name: 'envanter',
  help: 'Üzerinizde bulunan eşyaları görüntülemek için.',
  usage: 'envanter',
  category: 'Items',
};
