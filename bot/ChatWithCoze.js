import fetch from 'node-fetch';

class ChatWithCoze {
  constructor(apiUrl, channelId, apiKey) {
    this.apiUrl = apiUrl;
    this.channelId = channelId;
    this.apiKey = apiKey;
  }

  async sendAndReceiveMessage(message, timeout = 120000) { // 设置默认超时时间为30秒
    const requestBody = {
      "channelId": this.channelId,
      "messages": [
        {
          "content": message,
          "role": "user"
        }
      ],
      "model": "gpt-4-32k",
      "stream": false
    };

    try {
      // 设置超时时间
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        throw new Error('Request timed out.');
      }, timeout);

      // 发送 POST 请求
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${this.apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      // 清除超时设置
      clearTimeout(timeoutId);

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // 解析响应数据
      const data = await response.json();

      // 提取需要的字段
      const choice = data.choices && data.choices[0];
      if (choice && choice.message) {
        return choice.message.content;
      } else {
        throw new Error('Expected field not found in response.');
      }
    } catch (error) {
      console.error('Error sending message or processing response:', error);
      throw error;
    }
  }
}

// 使用示例
/*

const coze = new ChatWithCoze('https://coze-discord-proxy-isb0.onrender.com/v1/chat/completions', '', 'HMLLSNOW1217');
const reply = await coze.sendAndReceiveMessage('你好,我想吃大鼻嘎咋办');
console.log(reply); // 输出从 API 接口获取的回复

*/
export default ChatWithCoze;
