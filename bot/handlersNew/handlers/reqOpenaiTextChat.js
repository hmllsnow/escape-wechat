import OpenAI from "openai";
import {parseActionNameString,convertKeysToUpperCase} from '../../Utils.js'
import removeMentions from '../../Utils.js'
import Mustache from 'mustache';
export async function reqOpenaiTextChat(bot,message, config) {
    // 确保message是从群里来的
    console.log('reqOpenaiTextChat---->entry')

    const handlerString = config.handler;
    //const [handlerName, params] = parseActionNameString(handlerString)
    const params = config.params;

    let apiconfig = {};
    if (Object.keys(params).length !== 0) {
        //Json配置不为空
        apiconfig = params;
        console.log('replayOpenAI----使用params进行配置');
    } else {
        //没有Json配置
        console.log('handlers.reqCozeTextChat----->config\'s handler params is null');
    }

    if (message.room()) {
        // 获取群聊实例
        const room = await message.room();
        let content = await message.text()
        const talker = await message.talker();
        const receiver = message.to()
        const userSelfName = bot.currentUser?.name() || bot.userSelf()?.name()
        const receiverName = receiver?.name()


        console.log('replayOpenAI----原始content=' + content);
        //content = content.replace('@' + receiverName, '').replace('@' + userSelfName, '').replace(/@[^,，：:\s@]+/g, '').trim()
        //console.log(`hml----content=${content}`);
        content = await removeMentions(message);
        console.log('replayOpenAI----处理后的content=' + content);
        try {
            console.log('openai config=' + JSON.stringify(apiconfig));


            const openai = new OpenAI({
                apiKey: `${apiconfig.apikey}`,
                baseURL: `${apiconfig.baseurl}`,
            });
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: `${content}` }],
                //{ role: "system", content: "You are a helpful assistant." },{role: "user", content: "请做个自我介绍." }
                model: `${apiconfig.model}`,
            });

            console.log(completion.choices[0]);
            const reply = completion.choices[0].message.content;
            if(params.template){
                config.replyContent = reply;
                const data = convertKeysToUpperCase(config)
                const replyContent = Mustache.render(params.template,data );
                await room.say(replyContent, talker);
            }else{
                await room.say(`${reply}\n  from ${apiconfig.model}`, talker);
            }
            
        } catch (e) {
            console.log('openai error', e);
            await room.say(`调用api出错了，请稍后再试吧\n${e.toString()}`, talker);
        }


    } else {//如果是非群聊
        console.log('这里是非群聊的replyOpenAI方法')
        let content = await message.text()
        const talker = await message.talker();
        const receiver = message.to()
        const userSelfName = bot.currentUser?.name() || bot.userSelf()?.name()
        const receiverName = receiver?.name()
        console.log('replayOpenAI----原始content=' + content);
        //content = content.replace('@' + receiverName, '').replace('@' + userSelfName, '').replace(/@[^,，：:\s@]+/g, '').trim()
        //console.log(`hml----content=${content}`);
        content = await removeMentions(message);
        console.log('replayOpenAI----处理后的content=' + content);
        try {
            console.log('openai config=' + JSON.stringify(apiconfig));
            const openai = new OpenAI({
                apiKey: `${apiconfig.apikey}`,
                baseURL: `${apiconfig.baseurl}`,
            });
            const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: `${content}` }],
                //{ role: "system", content: "You are a helpful assistant." },{role: "user", content: "请做个自我介绍." }
                model: `${apiconfig.model}`,
            });

            console.log(completion.choices[0]);
            const reply = completion.choices[0].message.content;
            if(params.template){
                config.replyContent = reply;
                const data = convertKeysToUpperCase(config)
                const replyContent = Mustache.render(params.template,data );
                await message.say(replyContent, talker);
            }else{
                await message.say(`${reply}\n  from ${apiconfig.model}`, talker);
            }
            
        } catch (e) {
            console.log('openai error' + e.toString());
            await message.say(`调用api出错了，请稍后再试吧\n${e.toString()}`, talker);
        }

    }
}