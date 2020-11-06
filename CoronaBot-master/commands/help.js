const discord = require('discord.js')

const help = (crawler, message) => {
  let result = '정보 출처 : https://corona-live.com/\r\n'
  const embed = new discord.RichEmbed()
    .setColor(0xFF0000)
    .setThumbnail('https://i.imgur.com/dthfKX4.png')
    .setTitle('도움말')
    .addField('!소식', '가장 마지막 소식을 알려줍니다.')
    .addField('!현황', '지금까지 집계된 확진자, 완치, 사망자의 수를 알려줍니다.')
    .setDescription(result)
    .setFooter('https://github.com/MKachi/CoronaBot')
  message.channel.send(embed)
}

module.exports = help