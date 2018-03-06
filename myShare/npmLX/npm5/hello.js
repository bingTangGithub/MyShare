var fs = require('fs');
const exec = require('child_process').exec;
const remCmd = 'rm -rf node_modules && rm -rf package-lock.json';
const installCmd = 'npm install';

let timeTotal = 0;
const countTotal = 2;
let countcur = 0;



// fs.stat('package-lock.json', function(err, stat){
//   if(stat&&stat.isFile()) {
//   console.log('文件存在');
//     } else {
//   console.log('文件不存在或不是标准文件');
//     }
// });
// 
// fs.stat('node_modules', function(err, stat){
//   if(stat&&stat.isDirectory()) {
//   console.log('文件夹存在');
//     } else {
//   console.log('文件不存在或不是标准文件');
//     }
// });
// 
// 


const filesExist = (path) => {
  fs.stat(path, function(err, stat) {
    if(err == null) {
        if(stat.isDirectory() || stat.isFile()) {
          console.log('文件夹或者文件存在');
          obtain();
        } else {
          console.log('路径存在，但既不是文件，也不是文件夹');
        }
    } else if(err.code == 'ENOENT') {
        console.log(err.name);
        console.log('路径不存在');
    } else {
        console.log('错误：' + err);
    }
  });
}

canfilesExist = () => {
  // filesExist('node_modules');
  // filesExist('package-lock.json');
  const filesBoolean = filesExist('node_modules');
  const fileBoolean = filesExist('package-lock.json');
  console.log('filesBoolean::::::', filesBoolean);
}
canfilesExist();

const obtain = () => {
  // const filesBoolean = filesExist('node_modules');
  // const fileBoolean = filesExist('package-lock.json');
  // // if(filesBoolean && fileBoolean){
  //   console.log('filesBoolean::', filesBoolean);
  // // }
  exec(remCmd, (remError, remStdout, remStderr) => {
  // 获取命令执行的输出
    if(remError){
        console.log(remError);
    }

    exec(installCmd, (installError, installStdout, installStderr) => {
      // 获取命令执行的输出
      if(installError){
        console.log(installError);
      }
      const installStdoutArray = installStdout.split(' ');
      const timeStr = installStdoutArray[installStdoutArray.length - 1].trim();
      const time = + timeStr.substring(0, timeStr.length-1);
      timeTotal += time;
      countcur += 1;
      if(countcur === countTotal){
        eachTimeCount();
      }

    });

  });

  
}

// obtain();
const run = () => {
  for (let i=0; i<countTotal; i++) {
    obtain();
  }
}

// run();

const eachTimeCount = () => {
  const eachTime = ((new Number(timeTotal))/countTotal).toFixed(2);
  console.log('eachTime:::::', eachTime + 's');
}

























































































































































































































































































































































































































































































































































