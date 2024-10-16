import { Controller, All, Req, Res } from '@nestjs/common';
import { BullBoardService } from './bull-board.service';
import { Request, Response } from 'express';

@Controller('/admin/queues')
export class BullBoardController {
  constructor(private readonly bullBoardService: BullBoardService) {}

  @All('*')
  bullBoard(@Req() req: Request, @Res() res: Response) {
    return this.bullBoardService.serverAdapter.getRouter()(req, res);
  }
}
