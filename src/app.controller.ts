import { Controller, Get } from '@nestjs/common';
import { Public } from '@/common/utils/decorators/public.decorator';

@Controller()
export class AppController {
  @Get('health-check')
  @Public()
  healthCheck(): string {
    return 'OK';
  }
}
