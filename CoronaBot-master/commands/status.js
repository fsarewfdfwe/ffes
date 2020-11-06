const discord = require('discord.js')

const status = (crawler, message) => {
  const infos = crawler.getStatus()
  let result = '정보 출처 : https://corona-live.com/\r\n'
  const embed = new discord.RichEmbed()
    .setColor(0xFF0000)
    .setThumbnail('https://i.imgur.com/dthfKX4.png')
    .setTitle('현황')
    .addField('의심환자', infos[0], true)
    .addField('검사중', infos[1], true)
    .addField('음성판정', infos[2], true)
    .addField('확진자', infos[3], true)
    .addField('사망', infos[4], true)
    .addField('완치', infos[5], true)
    .setDescription(result)
    .setFooter('https://github.com/MKachi/CoronaBot')
  message.channel.send(embed)
}

module.exports = status