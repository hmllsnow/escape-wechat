import { WechatyBuilder } from "wechaty"
const wechaty = WechatyBuilder.build()
  

  
  require('dotenv').config()

  function onScan (qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      generate(qrcode, { small: true })  // show qrcode on console
  
      const qrcodeImageUrl = [
        'https://wechaty.js.org/qrcode/',
        encodeURIComponent(qrcode),
      ].join('')
  
      log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
    } else {
      log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
  }

  function onLogin (user) {
    log.info('StarterBot', '%s login', user)
  }


  function onLogout (user) {
    log.info('StarterBot', '%s logout', user)
  }

  async function onMessage (msg) {
    log.info('StarterBot', msg.toString())
  
    if (msg.text() === 'ding') {
      await msg.say('dong')
    }
  }

  const bot = new Wechaty({
    name: 'ding-dong-bot',
  })

  bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))