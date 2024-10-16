import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { UtilsModule } from '@/common/utils/utils.module';
import { QueuesModule } from '@/common/queues/queues.module';
import { BullBoardModule } from '@/common/bull-board/bull-board.module';

@Module({
  imports: [LoggerModule, UtilsModule, QueuesModule, BullBoardModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CommonModule {}
