import { Module } from '@nestjs/common';
import { MeetingsController } from 'controller/meetings.controller';
import { MeetingsService } from 'service/meetings.service';

@Module({
  imports: [],
  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeetingsModule {}
