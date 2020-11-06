const {
  writeLog
} = require('../utils')
const settings = require('./router')

const router = (crawler, message) => {
  if (message.channel.type == 'dm') {
    return
  }

  settings.forEach(info => {
    if (message.content == info.command) {
      writeLog('Bot', `Route to ${info.command}`)
      info.route(crawler, message)
    }
  })
}

module.exports = router