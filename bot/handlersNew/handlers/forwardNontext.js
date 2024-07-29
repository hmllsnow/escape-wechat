import { convertKeysToUpperCase, parseActionNameString } from '../../Utils.js'
import removeMentions from '../../Utils.js'
import Mustache from 'mustache';
export async function forwardNontext(bot, message, config) {
    //configParser(config);
    console.log('handler.forwardNontext----->entry');
    const { targetContacts, targetRooms } = config;
    const params = config.params;
    let handleType ={}
    let template ='';
    let prompt ='';
    let isDo = false
    let isOtherType = false
    if(Object.keys(params).length==0){
        console.log('handler.forwardNontext----->params is null ,function exit');
        return
    }else{
        handleType = params.handleType
        template = params.template
        if(Object.keys(handleType).length==0){
            console.log('handler.forwardNontext----->handleType is null ,function exit');
            return
        }
        const HANDLETYPE = convertKeysToUpperCase(handleType)

        if(template!=''){
            switch (message.type()) {
                case bot.Message.Type.Audio:
                    config.msgType = '语音'
                    if(HANDLETYPE.OTHER){
                        isDo = true
                    }
                    isOtherType =true
                    break;
                case bot.Message.Type.Video:
                    config.msgType = '视频'
                    if(HANDLETYPE.VIDEO){
                        isDo = true
                    }
                    break;
                case bot.Message.Type.Emoticon:
                    config.msgType = '表情'
                    if(HANDLETYPE.OTHER){
                        isDo = true
                    }
                    isOtherType =true
                    break;
                case bot.Message.Type.Image:
                    config.msgType = '图片'
                    if(HANDLETYPE.IMAGE){
                        isDo = true
                    }
                    break;
                case bot.Message.Type.Attachment:
                    config.msgType = '文件'
                    if(HANDLETYPE.ATTACHMENT){
                        isDo = true
                    }
                    //冗余支持file关键字
                    if(HANDLETYPE.FILE){
                        isDo = true
                    }
                    break;
                case bot.Message.Type.MiniProgram:
                    config.msgType = '小程序'
                    isOtherType =true
                    if(HANDLETYPE.OTHER){
                        isDo = true
                    }
                    break;
                // ... 其他消息类型处理
                case bot.Message.Type.Transfer:
                    config.msgType = '转账'
                    if(HANDLETYPE.OTHER){
                        isDo = true
                    }
                    isOtherType =true
                    break;
                default:
                    if(HANDLETYPE.OTHER){
                        isDo = true
                    }
                    isOtherType =true
                    config.msgType = '其他（不支持）类型'
            }
            const data = convertKeysToUpperCase(config)
            prompt = Mustache.render(template,data );
            


        }

    }



    console.log(`配置读出，targetContacts=${targetContacts},targetRooms${targetRooms}`);

    if (Array.isArray(targetContacts) && targetContacts.length > 0) {
        for (const contactName of targetContacts) {
            const targetContact = await bot.Contact.find({ name: contactName });
            if (targetContact) {
                if(isDo){
                    if(prompt){
                        await targetContact.say(prompt);
                    }
                    innerForwardMessage(message, bot, targetContact);
                }
                
            }
        }
    }

    // 转发到指定的群聊，如果配置了 targetRooms
    if (Array.isArray(targetRooms) && targetRooms.length > 0) {
        for (const roomName of targetRooms) {
            const targetRoom = await bot.Room.find({ topic: roomName });
            if (targetRoom) {
                if(isDo){
                    if(prompt){
                        await targetRoom.say(prompt);
                    }
                    innerForwardMessage(message, bot, targetRoom);
                }
                
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

                await contact.say(`系统暂时无法转发音频消息，请自行收听！`);
                break;
            case bot.Message.Type.Video:
                // 处理视频消息
                // 注意：Wechaty 不支持直接转发视频文件，以下代码仅为示例
                //const videoUrl = message.url(); // 获取视频文件的网络地址
                const video = await message.toFileBox();
                await contact.say(video);
                break;
            case bot.Message.Type.Emoticon:
                // 处理表情消息
                //不支持转发emoticon
                await contact.say(`系统暂时无法转发表情消息，请自行查看！`);

                break;
            case bot.Message.Type.Image:
                // 处理图片消息
                // 注意：Wechaty 不支持直接转发图片文件，以下代码仅为示例
                const image = await message.toFileBox();
                await contact.say(image);
                break;
            case bot.Message.Type.Attachment:
                // 处理附件消息
                // 注意：Wechaty 不支持直接转发附件文件，以下代码仅为示例
                const attachment = await message.toFileBox();
                await contact.say(attachment);
                break;
            case bot.Message.Type.MiniProgram:
                // 处理小程序消息
                const miniProgram = await message.toMiniProgram()

                await contact.say(`系统暂时无法转发小程序，请自行查看！`);
                //await contact.say(miniProgram);
                break;
            // ... 其他消息类型处理
            case bot.Message.Type.Transfer:
                // 处理转账消息


                await contact.say(`系统暂时无法转发转账消息，请自行收款！`);
                //await contact.say(miniProgram);
                break;
            // ... 其他消息类型处理

            default:
                // 无法识别的消息类型
                await contact.say(`收到系统暂时无法转发的消息，请自行查看！`);
        }
    } catch (error) {
        console.log('handler.forwardNontext----->Error:', error);
    }finally{
        console.log('handler.forwardNontext----->exit');
    }
}