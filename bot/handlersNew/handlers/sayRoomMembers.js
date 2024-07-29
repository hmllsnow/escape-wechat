import {parseActionNameString} from '../../Utils.js'
export async function sayRoomMembers(bot, message, config) {
    console.log('handlers.sayRoomMember輸出群成員----->entry')
    
    //获取配置
    
    /**
    const handlerString = config.handler;
    const [handlerName, params] = parseActionNameString(handlerString)
    if(Object.keys(params).length!==0){
        //Json配置不为空

    }else{
        //没有Json配置
        console.log('handlers.sayRoomMember----->config\'s handler params is null');
    }
    */
    const room = message.room();
    console.log('handlers.sayRoomMember----->room='+JSON.stringify(room));
    let status = room.sync();
    if (status) {
      console.log('handlers.sayRoomMember----->同步群成员成功');
    } else {
      console.log('handlers.sayRoomMember----->同步群成员失败');
    }
    console.log('handlers.sayRoomMember----->room(after sync)='+JSON.stringify(room));
    const members = await room.memberList();
    let memberList = [];
    for (let member of members) {
        console.log('handlers.sayRoomMember----->member='+JSON.stringify(member));
        const roomAlias = await room.alias(member)
        const alias =roomAlias || member.name(); // 获取群内alias，如果没有alias，则用微信名（存在不更新的问题，谋个人手动修改一次自己的昵称就生效了）
        memberList.push(alias);
    }
    const namesString = memberList.join(', ');
    console.log(`群成员列表: ${namesString}`);
    await room.say(`群成员列表: \n${namesString}`);
    console.log('handlers.sayRoomMember-----> exit');

    //getContactList(bot);
    //getRoomList(bot);
}
async function getRoomList(bot) {
    try {
      const roomList = await bot.Room.findAll();
      console.log('群列表:');
      for (const room of roomList) {
        const topic = await room.topic();
        console.log(topic);
      }
    } catch (error) {
      console.error('获取群列表时出错:', error);
    }
}

async function getContactList(bot) {
    try {
        const contactList = await bot.Contact.findAll();
        console.log('全量朋友列表:共'+contactList.length+'个');
        contactList.forEach((contact) => {
          //console.log(contact.name());
          if (contact.type() === bot.Contact.Type.Official) {
            console.log('公众号:', contact.name());
          } else //if (contact.type() === bot.Contact.Type.Personal) {
          if (contact.friend() === true){
            console.log('好友:', contact.name());
          }
        });
    } catch (error) {
      console.error('获取联系人列表时出错:', error);
    }
}
