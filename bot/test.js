import {config} from './config.js'
import { configParser } from './Utils.js'
// 假设文件名为 openai.json，位于项目的根目录下
import openaiconfig from './openai.json' assert { type: 'json' };
console.log(config.someParameter);
// 现在你可以使用config对象中的参数了
console.log(openaiconfig.baseurl);
console.log('openai config=',openaiconfig);
//控制台显示config.personal.actions[0].regex的property

config.personal.actions[0].regex = "^#操你"
console.log(config.personal.actions[0].regex instanceof RegExp)

console.log(Object.prototype.toString(config.personal.actions[0].regex))
configParser(config)
console.log(config.personal.actions[0].regex instanceof RegExp)
