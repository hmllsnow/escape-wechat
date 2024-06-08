// config.js

//==========================================================================
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//vvvvv Customization Starts vvvvv
const config = {
    db: { host: 'localhost', port: 27017, name: 'db' },
    redis:
    { default: { port: 6379 },
      development: { host: '127.0.0.1' },
      production: { host: '192.168.0.11' }
    },
    friendEnabled: false,
    msgKW1: 'ding',
    msgKW2: 'dong',
    room1:'咱们仨',
    xiaocheroom:'郑东5号校车家长群',
    yingyuroom:'三6班英语群',
    banjiroom:'郑东小学3年级6班',
    teacherChinese:'赵Z',
    teacherMaths:'20',
    teacherEnglish:'蛋卷冰淇淋',
    teacherBus:'云',
    king:'LL',
    personal: {
      reply: [
        { whitelist: 'LL', keywords: ['ding'] , handler: 'greet' },//也支持regax，关键字和keywords互斥
       // { whitelist: ['LL'], keywords: '*', handler: 'greet' },//也支持regax，关键字和keywords互斥,关键字配置成*，他就可以处理任意类型
        // 更多个人消息回复规则...
        { whitelist: ['黄焖鸡'], keywords: ['你好'], handler: 'greet' },//也支持regax，关键字和keywords互斥
      ],
      forward: [
        { whitelist: '*', keywords: ['forward'], targetContacts: ['LL','黄焖鸡'], targetRooms: ['咱们仨'], handler: '' },
        { whitelist: '小鹏汽车-詹', keywords: '*', targetContacts: ['LL'], targetRooms: [], handler: '' },
        // 更多个人消息转发规则...
      ],
      actions: [
        { whitelist: '*',regex: /^#操你/, action: 'actionHandler' },
        // 更多个人消息动作规则...
      ],
      nontext:[
        { whitelist: ['LL'],targetContacts: ['黄焖鸡'],  handler: 'nontextForwardHandler' },//针对某人发的文本以外的消息进行处理,注意位置消息是文本消息
      ],
    },
    room: {
      reply: [
        { whitelist: ['aaa','bbb咱们仨'],talkers:'*', keywords: ['啊啊啊'], mentionMe: true, mentionAll: false, handler: 'replyMeeting' },//首先必须满足白名单和发送人，满足上述条件后：关键字、被@，@所以人 满足其一，就执行handler
        { whitelist: ['abc测试群','咱们仨1'],talkers:'*',keywords: ['这是啥？'], mentionMe: true, mentionAll: false, handler: 'replyCoze' },//首先必须满足白名单和发送人，满足上述条件后：关键字、被@，@所以人 满足其一，就执行handler
        // 更多群消息回复规则... 
      ],
      forward: [
        { whitelist: ['abc测试群'], talkers:'*', targetContacts: ['LL'], targetRooms: [], keywords: '*',mentionMe: false, mentionAll: false,  handler: ''},
        // 更多群消息转发规则...⚽️ 聚义厅
      ],
      actions: [
        { whitelist: '*',regex: /^#操你/, action: 'actionHandler' },
        { whitelist: '*',regex: /^#群成员/, action: 'actionRoomMembers' },
        { whitelist: '*',regex: /^#提醒群成员/, action: 'actionAtRoomMembers' },
        { whitelist: '*',regex: /^#退群/, action: 'actionQuitRoom' },
        // 更多群消息动作规则...
      ],
      nontext:[
        { whitelist: ['咱们仨'], talkers:'*', targetContacts: ['LL','黄焖鸡'], targetRooms: [],handler: 'nontextForwardHandler' },//针对某群中某人发的文本以外的消息进行处理
      ],
    },
    handlersconfig:{
      nontextForwardHandler_config:{//转发处理函数的配置
        targetContacts: ['LL'], 
        targetRooms: [],
      }
    }

  }
  //^^^^^ Customization Ends ^^^^^
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //const targetRoomNames = ['咱们仨', '三6班英语群','郑东小学3年级6班','郑东5号校车家长群']; // 替换为实际的群聊名称
//const targetContactNames = ['LL', '蛋卷冰淇淋','云','赵Z','20']; // 替换为实际的联系人微信名
//const forwardToContactName = 'LL'; // 替换为要转发消息的联系人微信名
  //==========================================================================
  
export  {config}