# ESCAPE-WECHAT 逃离微信
## 介绍：
escape-wechat是一个微信助手，通过简单的可视化的配置，实现微信好友、微信群的指定消息的**自动回复、自动转发或自动处理**，让你从微信中“逃”出来，拯救你宝贵的注意力。<br/>
**最新功能：** 提供发送消息的api接口供第三方应用调用，可发送群消息或个人消息。 <br/>

>
**为什要做这个东西？**<br/>
小故事：<br/>
我的孩子正在上小学，学校各项事务都会通过微信群进行发布，包括作业和各项通知。而群里家长也会进行提问和完成作业情况的打卡，群里核心信息密度不高。如果你需要了解群里的核心消息，你可能需要翻看很长时间的历史消息，这会消耗你的注意力。另外就是孩子的校车群，每天我需要关注的就是校车到达到某个特定站点的消息。在收到这个消息后，我出发去接孩子即可。可是校车老师会从发车起就开始发消息，并且伴随不少家长的提问。这会大大分散你的注意力，甚至会导致你无法及时关注你最应该关注的那条消息。<br>
于是我开发了这东西。<br/>

在实现上述功能后，我还把这个东西也对接上了大语言模型，只要api使用了openAI的api，你就可以经过简单的配置实现智能回复。<br>
本项目基于wechaty项目，感谢wechaty项目组提供的开源项目。<br>
<u>https://github.com/wechaty/wechaty</u>

## 如何安装：
一、使用docker安装
docker安装是最简单，最快捷的方案
1. 拉取镜像
docker pull hmllsnow/escape-wechat
2. 运行容器
```shell
docker run -d  -p 443:443 -p 8080:8080 -e OPENAI_BASE_URL='your_base_url' -e OPENAI_API_KEY="your_api_key" -e OPENAI_MODEL="your_model" -e API_KEY="your_apikey use fro sendmessage" -e LOGIN_PWD="your_login password use fro login control Panel" --name escape-wechat-container hmllsnow/escape-wechat
```
> OPENAI_BASE_URL参数配置ai的base url<br/>
OPENAI_API_KEY参数配置ai的api key <br>
OPENAI_MODEL参数配置ai的模型名称 <br>
API_KEY参数配置使用api接口发送消息时的apikey <br>
LOGIN_PWD参数配置登录配置页面的密码 <br>

* 举例如果你使用的deepseek模型（价格较低）： 
```shell
docker run -d -p 443:443 -p 8080:8080 -e OPENAI_BASE_URL="https://api.deepseek.com" -e OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxx" -e OPENAI_MODEL="deepseek-chat" -e API_KEY="123456789" -e LOGIN_PWD="password" --name escape-wechat-container hmllsnow/escape-wechat
```

## 如何使用：
### 一、进入配置页面
核心功能都在配置页面完成。根据你的安装方法，进入配置页面略有不同<br/>
#### 1、docker安装
如果使用docker镜像方式运行，配置页面：<u>[http://localhost](http://localhost)</u> <br/>
#### 2、node直接运行
不适用docker，且没有修改配置文件，配置页面：<u>[http://localhost:7788](http://localhost:7788)</u> <br/>
### 二、配置
配置页面分为二个部分：<br/>
<img src="./docs/images/image-1.png" alt="" width="800"/>

#### 1、控制区
首先是：启动，停止，重启按钮
启动：启动微信机器人，如果已经启动，则不会重复启动。
停止：停止微信机器人，如果已经停止，则不会重复停止。
重启：重启微信机器人

#### 2、配置面板
大类分为个人和群，分别对应个人微信消息、群消息的配置
##### 1、个人消息
###### 1.1、回复配置
收到白名单（*表示任何人）用户发送的文本消息，如何文本消息包含Keyword关键字（或文本消息符合Regex配置的正则表达）则执行Handler配置的回复函数。默认已经开发了greet函数，会回复dang
keyword、regex 兩個條件可以同時存在，但必須同時符合，才会触发，所以這樣做意義不大，所以建議這兩個條件互斥存在。<br/>
**回复函数实现了调用函数传参的功能，函数名和参数之间通过\#\#分隔，参数使用json格式**<br/>
**举例：**<br/>
```shell
actionCozeTextChat##{apikey:\"pat_************************c\", bot_id:\"12345678901234564\", user_id:\"123\" }
```
###### 1.2、转发配置
收到白名单（*表示任何人）用户发送的文本消息，如何文本消息包含Keyword关键字（或文本消息符合Regex配置的正则表达）则转发到指定的群Target Rooms或联系人Target Contacts。
###### 1.3、动作配置
收到白名单（*表示任何人）用户发送的文本消息，如何文本消息包含Keyword关键字（或文本消息符合Regex配置的正则表达）则执行Handler配置的函数内写好的动作。<br/>
**回复函数实现了调用函数传参的功能，函数名和参数之间通过\#\#分隔，参数使用json格式**<br/>
**举例：**<br/>
```shell
actionCozeTextChat##{apikey:\"pat_************************c\", bot_id:\"12345678901234564\", user_id:\"123\" }
```
###### 1.4、非文本消息处理配置
由于非文本消息目前不能处理，所以非文本消息一般执行转发规则。收到白名单人员发送的消息，直接转发给指定群或指定群。
##### 2、群消息
回复，转发、动作与个人消息规则类似，增加了说话人（就是消息的发送人），增加了@自己和@所有人两个选项。
规则说明：当群白名单，说话人满足后。执行后续规则————。所以如果想要仅在被@时触发，就要配置一个永远无法满足的keyword做为条件。




#### 3、举例
##### 1、转发
**要求：** 转发A群，B用户，发送的包含文字C的文本消息，转发给D群和E用户。
在配置面板找到**群组->转发配置**，点击**新增**按钮，填入以下信息：<br>
<img src="./docs/images/image-2.png" alt="" width="800"/>

**配置如图**<br>
<img src="./docs/images/image-3.png" alt="" width="800"/>

##### 2、与AI对话
**要求：** 群A中，只要被@就把消息发送给大模型，大模型响应后，把响应消息发回群A。

**配置如图**<br>
由于keyword、regex为一组条件（如都配置就需要都满足），@Me，@all，共三组条件，满足任意一组就触发动作。所以设置了永远无法满足的keyword，只有@Me时才能触发。<br>
>
<img src="./docs/images/image-4.png" alt="" width="800"/>

#### 3、API调用

可以使用api调用，是程序开放与否的重要衡量。为了让您体验开放带来的快感，我也设计了两个api接口。可以实现调用api接口发送消息（两个接口分别对应群和个人消息）。
##### 接口地址
```shell
https://ip:443/api/
```
##### 接口文档
接口必须携带参数apiKey，apikey为docker run 启动容器时API_KEY配置的参数
###### 1、发送群消息
Method: POST<br/>
/chat/room<br/>
<br/>
**总体结构**

| 参数名      | 必填 | 类型   | 说明                                                     | 默认值 |
|-------------|------|--------|-----------------------------------------------------------|--------|
| apiKey      | 是   | string | apiKey                                                    | 无     |
| roomName    | 是   | string | 群名                                                     | 无     |
| message     | 是   | object | 消息内容，数据格式参考message数据类型说明              | {}     |
   
**message字段结构**

| 参数名       | 必填 | 类型   | 说明                                    | 默认值 |
|----------------|------|--------|------------------------------------------|--------|
| type           | 是   | number | 消息类型：1 文字 2 图片url 3 图片base64 (暂时仅支持1) | 1      |
| content        | 否   | string | 消息内容，如果type为1必填，内容换行使用\n               | 无     |
| url            | 否   | string | type 为2，3必填，图片地址，或者文件地址，例如png,jpg或者zip，excel都可以，必须是网络地址(暂时不支持) | 无 |
###### 2、发送群消息
Method: POST<br/>
/chat/contact<br/>
<br/>
**总体结构**

| 参数名   | 必填 | 类型   | 说明                                    | 默认值 |
|----------|------|--------|------------------------------------------|--------|
| apiKey   | 是   | string | apiKey                                   | 无     |
| name     | 是   | string | 好友昵称，不能带特殊字符和表情           | 无     |
| alias    | 否   | string | 好友备注，如果昵称带特殊字符，建议使用备注，name为空，alias有值即可 | 无     |
| wxid     | 是   | string | 好友列表查看wxid 对于web协议此id 不唯一，可能不生效（插件>1.6.10支持） | 无    |
| message  | 是   | object | 消息内容，数据格式参考message数据类型说明  | {}     | 

**message字段结构**

| 参数名       | 必填 | 类型   | 说明                                    | 默认值 |
|----------------|------|--------|------------------------------------------|--------|
| type           | 是   | number | 消息类型：1 文字 2 图片url 3 图片base64 (暂时仅支持1) | 1      |
| content        | 否   | string | 消息内容，如果type为1必填，内容换行使用\n               | 无     |
| url            | 否   | string | type 为2，3必填，图片地址，或者文件地址，例如png,jpg或者zip，excel都可以，必须是网络地址(暂时不支持) | 无 |

###### 3、请求示例
```shell
curl -k --location 'https://127.0.0.1/api/chat/contact' \
--header 'Content-Type: application/json' \
--data '{
    "apiKey": "your apikey",
    "name": "联系人",
    "alias":"",
    "message": {
        "type": 1,
        "content":"消息内容"
    }
    
}'
```
```shell
curl -k --location 'https://127.0.0.1/api/chat/room' \
--header 'Content-Type: application/json' \
--data '{
    "apiKey": "your apikey",
    "roomName":"群名",
    "message": {
        "type": 1,
        "content":"群消息"
    }
    
}'
```
windows cmd 请求示例（注意不是power shell）
```command prompt
curl -k -X POST "https://127.0.0.1/api/chat/contact" ^
-H "Content-Type: application/json" ^
-d "{\"apiKey\": \"your apikey\", \"name\": \"联系人\", \"alias\": \"\", \"message\": {\"type\": 1, \"content\": \"消息内容\"}}"
```
```command prompt
curl -k -X POST "https://127.0.0.1/api/chat/room" ^
-H "Content-Type: application/json" ^
-d "{\"apiKey\": \"your apikey\", \"roomName\": \"群名\",\"message\": {\"type\": 1, \"content\": \"消息内容\"}}"
```
**加入 `-k` 参数忽略自签名证书，否则会报错。咱们的程序暂时使用的是自签名证书，所以需要忽略。**
