import { Module } from '@nestjs/common';
import { LogFactory } from '@/common/logger/factories/log.factory';
import { CustomLoggerService } from '@/common/logger/custom-logger.service';
import { LogstashLogger } from '@/common/logger/logstash.logger';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [CustomLoggerService, LogstashLogger, LogFactory],
  exports: [CustomLoggerService, LogstashLogger],
})
export class LoggerModule {}
