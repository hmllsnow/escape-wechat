const Validator = require('../util/jsonValidator.js');
const schema = require('../schema/sendDataSchema.json');

const sendData = {
    "apiKey": "apiKey",
    "name": "LL",
    "alias": "",
    "roomName": "",
    "message": {
      "type": 1,
      "url": "https://img.aibotk.com/aibotk/public/kbap8w56GBZWqjYd_bg-min.jpg",
      "content": "你是个大聪明"
    }
  }

console.log(schema);
const validator = new Validator(schema);
const result = validator.validateData(sendData)
console.log(result);
