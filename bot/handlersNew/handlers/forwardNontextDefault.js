import { parseActionNameString } from '../../Utils.js'
import removeMentions from '../../Utils.js'
export async function forwardNontextDefault(bot, message, config) {
    //configParser(config);
    console.log('handler.forwardNontext----->entry');
    console.log('handler.forwardNontext----->message json='+JSON.stringify(message));
    const { targetContacts, targetRooms } = config;


    console.log(`配置读出，targetContacts=${targetContacts},targetRooms${targetRooms}`);

    if (Array.isArray(targetContacts) && targetContacts.length > 0) {
        for (const contactName of targetContacts) {
            const targetContact = await bot.Contact.find({ name: contactName });
            if (targetContact) {
                innerForwardMessage(message, bot, targetContact);
            }
        }
    }

    // 转发到指定的群聊，如果配置了 targetRooms
    if (Array.isArray(targetRooms) && targetRooms.length > 0) {
        for (const roomName of targetRooms) {
            const targetRoom = await bot.Room.find({ topic: roomName });
            if (targetRoom) {
                innerForwardMessage(message, bot, targetRoom);
            }
        }
    }


}


async function innerForwardMessage(message, bot, contact) {
    console.log('innerForwardMessage:', message, bot, contact);
    console.log('innerForwardMessage----->message:', JSON.stringify(message));
    if (!message || !bot || !contact) {
        console.error('Invalid arguments for forwardMessage function.');
        return;
    }
    let prompt = '';
    if (message.room()) {
        prompt = `[${await message.room().topic()}][${message.talker().name()}]`;
    } else {
        prompt = `[${await message.talker().name()}]`;
    }

    try {
        // 根据消息类型进行不同的处理
        switch (message.type()) {
            case bot.Message.Type.Audio:
                // 处理音频消息
                // 注意：Wechaty 不支持直接转发音频文件，以下代码仅为示例

                await contact.say(`${prompt}发了音频消息，我暂处理不了，去亲自听听吧！`);
                break;
            case bot.Message.Type.Video:
                // 处理视频消息
                // 注意：Wechaty 不支持直接转发视频文件，以下代码仅为示例
                //const videoUrl = message.url(); // 获取视频文件的网络地址
                const video = await message.toFileBox();
                await contact.say(`转发${prompt}发的视频：`);
                await contact.say(video);
                break;
            case bot.Message.Type.Emoticon:
                // 处理表情消息
                //不支持转发emoticon
                await contact.say(`转发${prompt}发的表情消息:\n ${message.description}`);
                //const emo = await message.forward(contact);
                //console.log("innerForwardMessage----->emo="+JSON.stringify(emo))
                //await contact.say(emo);
                break;
            case bot.Message.Type.Image:
                // 处理图片消息
                // 注意：Wechaty 不支持直接转发图片文件，以下代码仅为示例
                const image = await message.toFileBox();
                await contact.say(`转发${prompt}发的图片:`);
                await contact.say(image);
                break;
            case bot.Message.Type.Attachment:
                // 处理附件消息
                // 注意：Wechaty 不支持直接转发附件文件，以下代码仅为示例
                const attachment = await message.toFileBox();
                await contact.say(`转发${prompt}发的文件:`);
                await contact.say(attachment);
                break;
            case bot.Message.Type.MiniProgram:
                // 处理小程序消息
                const miniProgram = await message.toMiniProgram()
                let eol = '\n'
                if (miniProgram.payload) {
                    const miniParse = `【小程序解析】${eol}${eol}appid：${miniProgram.appid()}${eol}username：${miniProgram.username().replace('@app', '')}${eol}标题：${miniProgram.title()}${eol}描述：${miniProgram.description()}${eol}路径：${decodeURIComponent(miniProgram.pagePath())}`
                    contact.say(miniParse)

                }

                await contact.say(`${prompt}发了一个小程序，我暂处理不了，去亲自瞅瞅吧！`);
                //await contact.say(miniProgram);
                break;
            // ... 其他消息类型处理
            case bot.Message.Type.Transfer:
                // 处理转账消息


                await contact.say(`${prompt}发了一个转账，我暂处理不了，去亲自收钱吧！`);
                //await contact.say(miniProgram);
                break;
            // ... 其他消息类型处理

            default:
                // 无法识别的消息类型
                await contact.say(`收到${prompt}发送的无法识别的消息`);
        }
    } catch (error) {
        console.log('Error forwarding message:', error);
    }finally{
        console.log('handler.forwardNontext----->exit');
    }
}