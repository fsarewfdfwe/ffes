const {
  writeLog,
  deleteFolderRecursive
} = require('../utils')
const os = require('os')
const glob = require('glob')
const News = require('../models/news')
const webDriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const By = webDriver.By
const url = 'https://corona-live.com/'

module.exports = class Crawler {
  constructor() {
    this._lastMessage = null
    this._lastInfo = null
    this._status = []
  }

  async wait(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  async update() {
    writeLog('Info', 'Fetch Data...')
    let flag = false
    let driver = await new webDriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless())
      .build()
    try {
      await driver.get(url)
      await this.wait(3000)

      const status = await driver.findElements(By.css('.stats-container > div > div > span'))
      this._status = []
      for (let i = 0; i < status.length; ++i) {
        this._status.push(await status[i].getText())
      }
      writeLog('Data', `의심환자 : ${this._status[0]}명`)
      writeLog('Data', `검사중 : ${this._status[1]}명`)
      writeLog('Data', `음성판정 : ${this._status[2]}명`)
      writeLog('Data', `확진자 : ${this._status[3]}명`)
      writeLog('Data', `사망 : ${this._status[4]}명`)
      writeLog('Data', `완치 : ${this._status[5]}명`)

      const messages = await driver.findElements(By.className('message'))
      for (let i = 0; i < messages.length; ++i) {
        const target = messages[i]

        // Label
        let label = await target.findElements(By.css('.time > .news'))

        if (label.length <= 0) {
          label = await target.findElements(By.css('.time > .report'))
        }

        if (label.length <= 0) {
          label = await target.findElements(By.css('.time > .official'))
        }

        let labelText = ''
        if (label.length > 0) {
          labelText = await label[0].getText()
        }

        // Timestamp
        let timeInfos = await target.findElements(By.css('.time > div'))
        let timestamp = ''
        if (timeInfos.length > 1) {
          timestamp = await timeInfos[1].getText()
        } else {
          const check = await target.findElements(By.css('.news'))
          if (check.length == 0) {
            timestamp = await timeInfos[0].getText()
          }
        }

        // 내용
        const info = await target.findElements(By.css('.text > .info'))
        let description = ''
        if (info.length > 0) {
          description = await info[0].getText()
        }

        // 출처
        const source = await target.findElements(By.css('.source > a'))
        let link = ''
        if (source != undefined && source.length > 0) {
          link = await source[0].getAttribute('href')
        }

        if (i == 0) {
          const last = new News(labelText, timestamp, description, link)
          if (this._lastMessage != null && this._lastMessage.equals(last)) {
            writeLog('Info', 'Already up to date')
            return flag
          }
          flag = true
          this._lastMessage = last
          writeLog('Data', 'News')
          writeLog('Data', `[${labelText}] ${timestamp}`)
          writeLog('Data', description)
          writeLog('Data', link)
        }

        if (labelText != '개발자') {
          this._lastInfo = new News(labelText, timestamp, description, link)
          break
        }
      }
    } catch (except) {
      writeLog('Except', except)
      return false
    } finally {
      driver.quit()
      this.removeTempFolder()
      writeLog('Info', 'Finish!')
    }
    return flag
  }

  removeTempFolder() {
    try {
      const folders = glob.sync(os.tmpdir() + '/scoped_dir*')
      for (let i = 0; i < folders.length; ++i) {
        writeLog('Info', `임시 폴더 : ${folders[i]} 삭제`)
        deleteFolderRecursive(folders[i])
      }
    } catch (except) {
      writeLog('Except', except)
    }
  }

  getLastMessage() {
    return this._lastMessage
  }

  getLastInfo() {
    return this._lastInfo
  }

  getStatus() {
    return this._status
  }
}