const fs = require('fs');
const { get } = require('http');
const path = require('path');

// CommonJS 模块
async function loadModule() {
    const { config } = await import('../../bot/config.js');
    //console.log(config);
    //console.log(config.room.reply.length);
}

loadModule()
// const handleconfig = fs.readFileSync('../handlercfg.json', 'utf8');
// const config = JSON.parse(handleconfig);
// console.log(config.room.reply);

// console.log('第一个talker=',config.room.reply[0].whitelist)
// config.room.reply[0].whitelist = ["abc测试群","咱们仨1"];
// console.log('改后第一个talker=',config.room.reply[0].whitelist)
// fs.writeFileSync('../handlercfg.json', JSON.stringify(config), 'utf8')
//获取配置文件路径的函数getConfigPath（）
function getConfigPath() {
    return path.join(__dirname, '../handlercfg.json');
}


//getConfig，调用这个方法读取config.json文件，并返回一个config对象
function getConfig() {
    //使用path.resolve()方法获取绝对路径
    const config = fs.readFileSync(getConfigPath(), 'utf8');
    return JSON.parse(config);
}

//setConfig，调用这个方法传入一个config对象，根据这个对象修改config.json文件，修改成功后调用回调函数
//保存的config.json文件，请进行格式化
function setConfig(config, callback) {
    fs.writeFile(getConfigPath(), JSON.stringify(config, null, 4), 'utf8', (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null,'成功');
        }
    });
}
console.log('getConfigPath=',getConfigPath())

module.exports = { getConfig, setConfig }