import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from '@/common/utils/filters/global-exception.filter';
import { LogInterceptor } from '@/common/utils/interceptors/log.interceptor';
@Module({
  imports: [],
  controllers: [],
  providers: [GlobalExceptionFilter, LogInterceptor],
  exports: [],
})
export class UtilsModule {}
