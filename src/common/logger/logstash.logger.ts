import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { LogFactory } from '@/common/logger/factories/log.factory';
import { LogLevelEnum } from '@/common/logger/enums/log-level.enum';
import { LogMetadata } from '@/common/logger/types/log-metadata.interface';

@Injectable()
export class LogstashLogger {
  private logger: winston.Logger;

  constructor(private readonly logFactory: LogFactory) {
    this.logger = this.logFactory.createLogger();
  }

  private async logMessage(
    level: LogLevelEnum,
    message: string,
    metadata: LogMetadata,
  ) {
    const enrichedMetadata = this.logFactory.enrichMetadata(level, metadata);
    try {
      this.logger.log(level, message, enrichedMetadata);
    } catch (error) {
      await this.error('Failed to log message', {
        index: 'api-logger-error',
        error: {
          message: error.message,
          stack: error.stack,
        },
        originalMessage: message,
        originalMetadata: metadata,
      });
      throw error;
    }
  }

  async log(message: string, metadata: LogMetadata = { index: 'log' }) {
    await this.logMessage(LogLevelEnum.INFO, message, metadata);
  }

  async error(message: string, metadata: LogMetadata = { index: 'log' }) {
    await this.logMessage(LogLevelEnum.ERROR, message, metadata);
  }

  async warn(message: string, metadata: LogMetadata = { index: 'log' }) {
    await this.logMessage(LogLevelEnum.WARNING, message, metadata);
  }

  async debug(message: string, metadata: LogMetadata = { index: 'log' }) {
    await this.logMessage(LogLevelEnum.DEBUG, message, metadata);
  }

  async verbose(message: string, metadata: LogMetadata = { index: 'log' }) {
    await this.logMessage(LogLevelEnum.VERBOSE, message, metadata);
  }

  async success(message: string, metadata: LogMetadata = { index: 'log' }) {
    await this.logMessage(LogLevelEnum.SUCCESS, message, metadata);
  }

  async logByLevel(
    level: LogLevelEnum,
    message: string,
    metadata: LogMetadata = { index: 'log' },
  ): Promise<void> {
    const enrichedMetadata = this.logFactory.enrichMetadata(level, metadata);
    try {
      switch (level) {
        case LogLevelEnum.INFO:
          await this.log(message, enrichedMetadata);
          break;
        case LogLevelEnum.ERROR:
          await this.error(message, enrichedMetadata);
          break;
        case LogLevelEnum.WARNING:
          await this.warn(message, enrichedMetadata);
          break;
        case LogLevelEnum.DEBUG:
          await this.debug(message, enrichedMetadata);
          break;
        case LogLevelEnum.VERBOSE:
          await this.verbose(message, enrichedMetadata);
          break;
        case LogLevelEnum.SUCCESS:
          await this.success(message, enrichedMetadata);
          break;
        default:
          await this.log(message, enrichedMetadata);
      }
    } catch (error) {
      await this.error('Failed to log by level', {
        index: 'api-logger-error',
        error: {
          message: error.message,
          stack: error.stack,
        },
        originalMessage: message,
        originalMetadata: metadata,
      });
    }
  }
}
