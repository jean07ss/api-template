import { Injectable } from '@nestjs/common';
import { QueuesService } from '@/common/queues/queues.service';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Queue } from 'bullmq';

@Injectable()
export class BullBoardService {
  public serverAdapter: ExpressAdapter;

  constructor(private readonly queuesService: QueuesService) {
    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath('/admin/queues');

    const queues: Queue[] = this.queuesService.getAllQueues();

    const bullAdapters = queues.map((queue) => new BullMQAdapter(queue));

    createBullBoard({
      queues: bullAdapters,
      serverAdapter: this.serverAdapter,
    });
  }
}
