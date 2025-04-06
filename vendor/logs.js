// import fs from 'fs-extra'
// import path from 'path'

// import request from 'request'
// import rp from 'request-promise'
// import urlencode from 'urlencode'

// function curdate(minute){
//     minute = (minute < 10) ? '0' + minute : minute;
//     return minute;

//  }
// export function mlog (par) {
//     let detecreate = new Date();
//     let texta = `\n ${curdate(datecreate.getHours())}:${curdate(datecreate.getMinutes)}`
//     let obj = arguments;

//     for (const key in obj){
//         if (typeof obj[key]=='object'){
//             for (const keys in obj[key]){
//                texta = `${texta}\n${keys}:${obj[key][keys]}`;  
//             }
//         } else {
//             texta = `${texta} ${obj[key]}`
//         }
//     }
//     fs.writeFileSync(path.join('logs', `${curdate(datecreate.getDate())}.${curdate(datecreate.getMounth()+1)} log.txt`),texta,
// {
//     encoding: "utf8",
//     flag: "a+",
//     mode: 0o666
// });
// console.log(texta);
// return texta
// }



import fs from 'fs-extra';
import path from 'path';

function curdate(value) {
    return value < 10 ? '0' + value : value;
}

export function mlog(...args) {
    const date = new Date();
    const timestamp = `${curdate(date.getHours())}:${curdate(date.getMinutes())}`;
    let logText = `\n${timestamp}`;
    
    args.forEach(arg => {
        if (typeof arg === 'object') {
            logText += `\n${JSON.stringify(arg, null, 2)}`;
        } else {
            logText += ` ${arg}`;
        }
    });
    
    const logDir = path.join('vendor', 'logs');
    fs.ensureDirSync(logDir);
    const logFileName = `${curdate(date.getDate())}.${curdate(date.getMonth() + 1)}.log.txt`;
    const logFilePath = path.join(logDir, logFileName);
    
    fs.appendFileSync(logFilePath, logText + '\n', { encoding: 'utf8' });
}
