import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { LogstashLogger } from '@/common/logger/logstash.logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logstashLogger: LogstashLogger;
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  private ensureLogger() {
    if (!this.logstashLogger) {
      this.logstashLogger = this.moduleRef.get(LogstashLogger, {
        strict: false,
      });
    }
  }

  catch(exception: unknown, host: ArgumentsHost) {
    this.ensureLogger();

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);
    const stack = exception instanceof Error ? exception.stack : null;
    let errors = [];

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        errors = exceptionResponse['message'] || [];
      }
    }

    const responseBody = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      errors: errors,
    };

    const log = {
      index: 'exception-filter',
      action: 'error',
      request: {
        method: request.method,
        url: request.originalUrl || request.url,
        body: JSON.stringify(request.body),
        query: JSON.stringify(request.query),
        headers: JSON.stringify(request.headers),
      },
      exception: {
        message: message,
        status: status,
        stack: stack,
      },
      response: {
        statusCode: status,
        body: JSON.stringify(responseBody),
      },
      details: this.buildCustomMetadata(request),
    };

    this.logstashLogger.error('Exception', log);
    this.logger.error('Exception', log);

    response.status(status).json(responseBody);
  }

  private getStatus(exception: any): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof AxiosError) {
      return exception.response?.status || HttpStatus.BAD_GATEWAY;
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getMessage(exception: any): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      } else if (typeof response === 'object' && response !== null) {
        return response['message'] || exception.message || null;
      } else {
        return exception.message;
      }
    } else if (exception instanceof AxiosError) {
      return exception.response?.data
        ? JSON.stringify(exception.response.data)
        : exception.message;
    } else if (exception instanceof Error) {
      return exception.message;
    } else {
      return 'Internal server error';
    }
  }

  private buildCustomMetadata(request: Request) {
    const user = (request as any).user || null;
    return {
      userId: user ? user.id : null,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };
  }
}
