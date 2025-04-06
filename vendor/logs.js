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
