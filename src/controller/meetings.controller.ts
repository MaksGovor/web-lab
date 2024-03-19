import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MeetingsService } from 'service/meetings.service';

@ApiTags('Meetings')
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  getHello(): string {
    return this.meetingsService.getHello();
  }
}
