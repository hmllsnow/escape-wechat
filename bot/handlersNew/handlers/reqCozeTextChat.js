import { parseActionNameString } from '../../Utils.js'
import removeMentions from '../../Utils.js'
import fetch from 'node-fetch';
export async function reqCozeTextChat(bot, message, config) {
    // 设置默认值
    console.log('handlers.reqCozeTextChat----->entry')
    const handlerString = config.handler;
    const params = config.params;
    if(Object.keys(params).length!==0){
        //Json配置不为空

    }else{
        //没有Json配置
        console.log('handlers.reqCozeTextChat----->config\'s handler params is null');
    }




    const url = params.url || 'https://api.coze.cn/v3/chat';
    const bot_id = params.bot_id;
    const user_id = params.user_id || 'escapewechat';
    const apikey = params.apikey;
    // 检查必要参数
    if (!bot_id) {
      throw new Error('bot_id is required');
    }
    if (!apikey) {
      throw new Error('apikey is required');
    }
    //构建content
    let sendContent = "";
    let content = "";
    content = await removeMentions(message);
    const talker = await message.talker();
    if (message.room()) {
      // 获取群聊实例
      const room = await message.room();
      sendContent = `${content}    --消息来自[${room}]群的[${talker}]`
      
    
    }
    else{
      sendContent = `${content}    --消息来自好友[${talker}]`
    }
  
    // 构建请求体
    const requestBody = {
      bot_id: bot_id,
      user_id: user_id,
      stream: false,
      auto_save_history: true,
      additional_messages: [
        {
          role: "user",
          content: sendContent,
          content_type: "text"
        }
      ]
    };
  
    try {
      // 发送请求
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apikey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // 解析并返回响应
      const data = await response.json();
      console.log('Response from Coze API:'+ data.toString());
      return data;
  
    } catch (error) {
      console.log('Error calling Coze API:', error);
      throw error;
    }finally{
        console.log('handlers.reqCozeTextChat----->exit')
    }
  }