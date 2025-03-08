import * as winston from 'winston';
import * as path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';

const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

export const winstonConfig = {
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }), 
    winston.format.json(), 
  ),
  transports: [
    
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), 
        winston.format.simple(), 
      ),
    }),
   
    new DailyRotateFile({
      dirname: logsDir,
      filename: `%DATE% - Server.log`, 
      datePattern: 'DD-MM-YYYY HH-mm', 
      zippedArchive: false,
      maxSize: '20m', 
      maxFiles: '30d', 
      level: 'info',
    }),
  ],
};