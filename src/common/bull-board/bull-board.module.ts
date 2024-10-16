import { Module } from '@nestjs/common';
import { BullBoardController } from './bull-board.controller';
import { BullBoardService } from './bull-board.service';

@Module({
  imports: [],
  controllers: [BullBoardController],
  providers: [BullBoardService],
})
export class BullBoardModule {}
