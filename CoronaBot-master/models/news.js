module.exports = class News {
  constructor(label, timestamp, message, link) {
    this._label = label
    this._timestamp = timestamp
    this._message = message
    this._link = link
  }

  getLabel() {
    return this._label
  }

  getTimestamp() {
    return this._timestamp
  }

  getMessage() {
    return `${this._message}\r\n${this._link}`
  }

  equals(other) {
    if (
      other._message == undefined ||
      other._link == undefined) {
      return false
    }

    if (
      this._message != other._message ||
      this._link != other._link) {
      return false
    }
    return true
  }
}