import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LogService {
  private logFilePath: string;

  constructor() {
    // Definimos la ruta del archivo de logs
    this.logFilePath = path.join(__dirname, '../../logs.log'); // Cambia la ruta si lo deseas
  }

  // Método para registrar un evento en el archivo
  async logEvent(eventType: string, description: string, userId: string): Promise<void> {
    const logMessage = `[${new Date().toISOString()}] Event: ${eventType}, UserID: ${userId}, Description: ${description}\n`;

    // Escribimos el log en el archivo
    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Error escribiendo el archivo de logs:', err);
      }
    });
  }
}
