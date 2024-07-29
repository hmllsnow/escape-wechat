import {parseActionNameString,getTalkerAndRoom,convertKeysToUpperCase} from '../../Utils.js'
import Mustache from 'mustache';
export async function greet(bot, message, config) {
    console.log('handlers.greet----->entry')
    let greetContent = "dong"
    console.log('handlers.greet----->config='+JSON.stringify(config))
    //获取配置
    const handlerString = config.handler;
    const [handlerName, params] = parseActionNameString(handlerString)
    if(Object.keys(config.params).length!==0){
        //Json配置不为空
        //greetContent = params.greetContent
        const template = config.params.template //"hello {{#MSGROOM}}[{{MSGROOM}}]{{/MSGROOM}}[{{MSGTALKER}}]"
        if(template){
            const data = convertKeysToUpperCase(config)
            greetContent = Mustache.render(template,data );
        }
        
    }else{
        //没有Json配置
        console.log('handlers.greet----->config\'s handler params is null greet default \'dong\'');
    }
    await message.say(greetContent);
    console('handlers.greet----->'+JSON.stringify(config))
    console.log('handlers.greet-----> exit');
}