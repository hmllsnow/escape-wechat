const { spawn } = require('child_process');
const { inherits } = require('util');

const child = spawn('cmd',{stdio:'inherit'});


child.on('close', (code,signal) => {
  console.log(`child process exited with code ${code} and signal ${signal}`);
})

child.kill()
//child.kill()
console.log('------exports')
console.log(exports)
console.log('------require')
console.log(require)
console.log('------module')
console.log(module)

console.log(__filename)
console.log(__dirname)


//console.log(arguments.callee.toString())