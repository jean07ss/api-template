import * as winston from 'winston';
import { LogMetadata } from '@/common/logger/types/log-metadata.interface';
import { UDPTransport } from 'udp-transport-winston';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates and configures a Winston logger instance.
   * @returns {winston.Logger} Configured Winston logger
   */
  createLogger(): winston.Logger {
    const host = this.configService.get<string>('logstash.host', 'localhost');
    const port = this.configService.get<number>('logstash.port', 5044);
    const username = 'logstash';
    const password = 'logstash';
    const base64Auth = Buffer.from(`${username}:${password}`).toString(
      'base64',
    );

    return winston.createLogger({
      format: winston.format.json(),
      transports: [
        new UDPTransport({
          host: host,
          port: port,
        }),
      ],
    });
    /*return winston.createLogger({
      format: winston.format.json(),
      transports: [
        new winston.transports.Http({
          host: 'infra.rivalryze.com',
          port: 5044,
          ssl: false,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ],
    });*/
  }

  /**
   * Enriches the log metadata with additional information.
   * @param {LogLevelEnum} level - The log level
   * @param {LogMetadata} metadata - The original metadata
   * @returns {LogMetadata} Enriched metadata
   */
  enrichMetadata(level: string, metadata: LogMetadata): LogMetadata {
    const prefixedIndex = metadata.index?.startsWith('api-')
      ? metadata.index
      : `api-${metadata.index}`;
    return {
      ...metadata,
      index: prefixedIndex,
      environment: process.env.NODE_ENV || 'development',
      nodeName: process.env.HOSTNAME || 'unknown',
      timestamp: new Date().toISOString(),
    };
  }
}
