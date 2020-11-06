const fs = require('fs')
const moment = require('moment')
require('moment-timezone')

const isEmpty = (value) => {
  if (
    typeof value == 'boolean' &&
    value != null &&
    value != undefined) {
    return false
  }

  if (
    value == '' ||
    value == null ||
    value == undefined ||
    (value != null && typeof value == 'object' && !Object.keys(value).length)) {
    return true
  }
  return false
}

const getKorTime = (format) => {
  moment.tz.setDefault('Asia/Seoul')
  return moment().format(format)
}
const writeLog = (type, message) => {
  console.log(`${getKorTime('YYYY-MM-DD HH:mm:ss')} : [${type}] ${message}`)
}
const deleteFolderRecursive = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file) => {
        const curPath = path + '/' + file
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath)
        } else {
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  } catch (except) {
    writeLog('Except', except)
  }
}

module.exports = {
  isEmpty,
  getKorTime,
  writeLog,
  deleteFolderRecursive
}