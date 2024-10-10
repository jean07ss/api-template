import { Injectable, LoggerService } from '@nestjs/common';
import * as process from 'process';
import { winstonLogger } from '@/common/logger/winston.config';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger = winstonLogger;

  private enrichLogInfo(message: string, context?: string, extraInfo?: object) {
    return {
      message,
      context,
      environment: process.env.NODE_ENV,
      node_name: process.env.NODE_NAME,
      ...extraInfo,
    };
  }

  log(message: string, context?: string) {
    const logInfo = this.enrichLogInfo(message, context);
    this.logger.info(logInfo);
  }

  error(message: string, trace: string, context?: string) {
    const logInfo = this.enrichLogInfo(message, context, { trace });
    this.logger.error(logInfo);
  }

  warn(message: string, context?: string) {
    const logInfo = this.enrichLogInfo(message, context);
    this.logger.warn(logInfo);
  }

  debug(message: string, context?: string) {
    const logInfo = this.enrichLogInfo(message, context);
    this.logger.debug(logInfo);
  }

  verbose(message: string, context?: string) {
    const logInfo = this.enrichLogInfo(message, context);
    this.logger.verbose(logInfo);
  }
}
