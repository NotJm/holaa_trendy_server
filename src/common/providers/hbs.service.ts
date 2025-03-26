import { Injectable } from "@nestjs/common";
import * as Handlebars from 'handlebars';
import { LoggerApp } from "../logger/logger.service";
import { join } from "path";
import { readFile } from "fs/promises";

@Injectable()
export class HbsService {
  private cache: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(private readonly loggerApp: LoggerApp) {}

  async compile(templateName: string, data: any): Promise<string> {
    try {
      let template = this.cache.get(templateName);

      const templatePath = join(process.cwd(), 'templates', templateName);
      const source = await readFile(templatePath, 'utf8');
      template = Handlebars.compile(source);
      this.cache.set(templateName, template);

      return template(data);
    } catch (error) {
      this.loggerApp.error(`No se pudo compilar la plantilla ${templateName}`, error, 'HbsService');
    }
  }
}