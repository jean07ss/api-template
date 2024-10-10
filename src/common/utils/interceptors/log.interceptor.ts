import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { LogstashLogger } from '@/common/logger/logstash.logger';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  constructor(private readonly logstashLogger: LogstashLogger) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const correlationId = uuidv4();
    const now = Date.now();

    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const { method, originalUrl: url } = req;
    /*const user = req.user?.email || req.user?.id || 'anonymous';*/
    const user = 'anonymous';

    res.setHeader('X-Correlation-ID', correlationId);

    await this.logRequest(correlationId, req, user);

    return next.handle().pipe(
      tap((data) => {
        const timeTaken = Date.now() - now;
        const { statusCode } = res;

        this.logResponse(correlationId, req, res, timeTaken, data);
      }),
      catchError((err) => {
        const timeTaken = Date.now() - now;
        const { statusCode } = res;

        this.logError(correlationId, req, res, timeTaken, err);

        throw err;
      }),
    );
  }

  private async logRequest(correlationId: string, req: Request, user: string) {
    const { method, originalUrl: url, body, query, params, ip, headers } = req;

    const safeBody = { ...body };
    delete safeBody.password;
    delete safeBody.passwordConfirmation;

    const logData = {
      correlationId,
      action: 'api-request',
      method,
      url,
      user,
      ip,
      headers: this.sanitizeHeaders(headers),
      data: {
        body: safeBody,
        query,
        params,
      },
    };

    await this.logstashLogger.log('Incoming Request', {
      index: 'api-metrics',
      ...logData,
    });
    this.logger.log(
      `Incoming Request: ${method} ${url}`,
      JSON.stringify(logData),
    );
  }

  private async logResponse(
    correlationId: string,
    req: Request,
    res: Response,
    timeTaken: number,
    data: any,
  ) {
    const { method, originalUrl: url } = req;
    const { statusCode } = res;

    const logData = {
      correlationId,
      action: 'api-response',
      method,
      url,
      statusCode,
      timeTaken,
      data: this.sanitizeResponseData(data),
    };

    await this.logstashLogger.log('Outgoing Response', {
      index: 'api-metrics',
      ...logData,
    });
    this.logger.log(
      `Outgoing Response: ${method} ${url} - ${statusCode} - ${timeTaken}ms`,
      JSON.stringify(logData),
    );
  }

  private async logError(
    correlationId: string,
    req: Request,
    res: Response,
    timeTaken: number,
    error: any,
  ) {
    const { method, originalUrl: url } = req;
    const { statusCode } = res;

    const logData = {
      correlationId,
      action: 'api-error',
      method,
      url,
      statusCode: statusCode || error.status || 500,
      timeTaken,
      error: {
        message: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      },
    };

    await this.logstashLogger.error('Request Error', {
      index: 'api-errors',
      ...logData,
    });
    this.logger.error(
      `Request Error: ${method} ${url} - ${statusCode} - ${timeTaken}ms`,
      JSON.stringify(logData),
    );
  }

  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const safeHeaders = { ...headers };
    delete safeHeaders.authorization;
    delete safeHeaders.cookie;
    return safeHeaders;
  }

  private sanitizeResponseData(data: any): any {
    return data;
  }
}
