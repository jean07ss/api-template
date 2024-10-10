import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { UtilsModule } from '@/common/utils/utils.module';

@Module({
  imports: [LoggerModule, UtilsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CommonModule {}
