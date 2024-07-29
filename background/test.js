
const a = ['a','b','c']
function print() {
  console.log(arguments)
}
let c ={
    a:1,
    b:2,
}
let method={
    a:Symbol("uuu"),
    b:Symbol()
}

c[Symbol('a')]=3

console.log(c[Symbol('a')])

const path = require('path');
const handlersDir = path.join(__dirname, './handlers');
console.log(handlersDir)

