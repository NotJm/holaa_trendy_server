import * as winston from 'winston';
import * as path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

export const winstonConfig = {
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }), 
    winston.format.printf(({ level, message, timestamp, context, trace }) => {
      return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
    }),
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
      datePattern: 'DD-MM-YYYY', 
      zippedArchive: false,
      maxSize: '20m',  
      level: 'info',
    }),
  ],
};