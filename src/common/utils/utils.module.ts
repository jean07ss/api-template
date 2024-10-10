import { Module } from '@nestjs/common';
import { GlobalExceptionFilter } from '@/common/utils/filters/global-exception.filter';

@Module({
  imports: [],
  controllers: [],
  providers: [GlobalExceptionFilter],
  exports: [],
})
export class UtilsModule {}
