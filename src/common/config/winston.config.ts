import * as winston from 'winston';
import * as path from 'path';

const logFilePath = path.join(__dirname, '..', 'logs', 'app.log');

export const winstonConfig = {
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(), 
    winston.format.json(), 
  ),
  transports: [
    
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), 
        winston.format.simple(), 
      ),
    }),
   
    new winston.transports.File({
      filename: logFilePath, 
      level: 'info', 
    }),
  ],
};