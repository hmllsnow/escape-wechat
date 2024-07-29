//默认转发函数
import Mustache from 'mustache';
import { parseActionNameString, convertKeysToUpperCase } from '../../Utils.js'
export async function forwardTextDefault(bot, message, config) {
    console.log('handlers/forwardTextDefault.js----->entry')
    //增加處理轉發格式
    try {
        const params = config.params;
        let forwardMessage = ''
        if (params) {
            if (params.template) {
                const template = params.template
                config.forwardmsg = message.text()
                const data = convertKeysToUpperCase(config)
                forwardMessage = Mustache.render(template, data);
            }
        }

        // 转发到指定的联系人，如果配置了 targetContacts
        if (Array.isArray(config.targetContacts) && config.targetContacts.length > 0) {
            for (const contactName of config.targetContacts) {
                const targetContact = await bot.Contact.find({ name: contactName });
                if (targetContact) {
                    if (message.room()) {
                        const room = message.room();
                        const name = await room.alias(message.talker()) || message.talker().name()
                        if (forwardMessage) {
                            await targetContact.say(forwardMessage);
                        } else {
                            await targetContact.say(`转发[${await message.room().topic()}][${name}]的消息：\n${message.text()}`);
                        }

                    } else {
                        if (forwardMessage) {
                            await targetContact.say(forwardMessage);
                        } else {
                            await targetContact.say(`转发[${await message.talker().name()}]的消息：\n${message.text()}`);
                        }

                    }

                }
            }
        }

        // 转发到指定的群聊，如果配置了 targetRooms
        if (Array.isArray(config.targetRooms) && config.targetRooms.length > 0) {
            for (const roomName of config.targetRooms) {
                const targetRoom = await bot.Room.find({ topic: roomName });
                if (targetRoom) {

                    if (message.room()) {

                        if (forwardMessage) {
                            await targetContact.say(forwardMessage);
                        } else {
                            await targetRoom.say(`转发[${await message.room().topic()}][${message.talker().name()}]的消息：\n${message.text()}`);
                        }

                    } else {
                        if (forwardMessage) {
                            await targetContact.say(forwardMessage);
                        } else {
                            await targetRoom.say(`转发[${await message.talker().name()}]的消息：\n${message.text()}`);
                        }

                    }

                }
            }
        }
    } catch (error) {
        console.log('handlers/forwardTextDefault.js----->error' + error)
    }finally{
        console.log('handlers/forwardTextDefault.js----->exit')
    }

    

}