import Mustache from 'mustache';

const template = "hello {{#room}}[{{room}}]{{/room}}[{{talker}}] {{#users}}{{name}} {{/users}} {{room.name}}}"
let data1 = {

    talker:'说话者',
    users:[
        {name:'user1'},
        {name:'user2'}
    ],
    room:{name:'房间',alias:'房间别名'}
}
let data2 ={
    //room:''
}

let data = {...data1,...data2}
//data.room = '房间'
console.log(JSON.stringify(data));
const result = Mustache.render(template, data);
console.log(result);

function convertKeysToUpperCase(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    const newObj = {};
    Object.keys(obj).forEach(key => {
      const upperCaseKey = key.toUpperCase();
      newObj[upperCaseKey] = obj[key];
    });
    return newObj;
  }
  
  // 测试代码
  const inputObj = data;
  const upperCaseObj = convertKeysToUpperCase(inputObj);
  console.log(upperCaseObj);