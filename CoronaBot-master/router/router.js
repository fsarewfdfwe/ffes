const help = require('../commands/help')
const news = require('../commands/news')
const status = require('../commands/status')

module.exports = [{
  command: '!도움말',
  route: help
}, {
  command: '!소식',
  route: news
}, {
  command: '!현황',
  route: status
}]