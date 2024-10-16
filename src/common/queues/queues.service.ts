import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueuesService {
  private queues: Map<string, Queue> = new Map();

  private redisConfig: any;

  constructor(private readonly configService: ConfigService) {
    this.redisConfig = {
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password'),
    };

    /*this.addQueue('exampleQueue');*/
  }

  addQueue(name: string) {
    const queue = new Queue(name, {
      connection: this.redisConfig,
    });
    this.queues.set(name, queue);
  }

  getQueue(name: string): Queue {
    return this.queues.get(name);
  }

  getAllQueues(): Queue[] {
    return Array.from(this.queues.values());
  }
}
