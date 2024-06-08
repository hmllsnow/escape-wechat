//class名为botstatusHandler，使用单例模式，有一个静态变量叫status，他有一个set，get方法，有一个reciveLogin方法，reciveLogout方法，reciveQrcode方法
class botstatusHandler {
    constructor() {
        if (botstatusHandler.instance) {
            return botstatusHandler.instance;
        }
        this.status = '未登录';
        this.qrcode = null;
        botstatusHandler.instance = this;
        
    }
    setStatus(status) {
        this.status = status;
    }   
    getStatus() {
        return this.status;
    }
    setQrcode(qrcode) {
        this.qrcode = qrcode;
    }
    getQrcode() {
        return this.qrcode;
    }
    reciveLogin() {
        console.log('botstatusHandler-->reciveLogin');
        this.status = '已登录';
        this.qrcode = null;
    }
    reciveLogout() {
        console.log('botstatusHandler-->reciveLogout');
        this.status = '未登录';
        this.qrcode = null;
    }
    reciveQrcode() {
        console.log('botstatusHandler-->reciveQrcode');
        this.status = '未登录';
    }
}
module.exports = botstatusHandler;



